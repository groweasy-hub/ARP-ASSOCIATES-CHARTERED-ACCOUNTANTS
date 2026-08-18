const Task = require("../models/Task");
const Admin = require("../models/Admin");
const BillingItem = require("../models/BillingItem");
const Notification = require("../models/Notification");
const { ROLE_NAMES, isTopAdmin, roleLevel } = require("../config/permissions");
const { writeAudit } = require("../utils/audit");
const { sendTaskAssignedNotification } = require("../services/pushNotificationService");

const actorName = (admin) =>
  `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || admin.email;

const clientName = (client) => client?.companyName || client?.name || "Client";

const monthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const recurrencePeriodKey = (date, frequency) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  if (frequency === "YEARLY") return `${year}`;
  if (frequency === "QUARTERLY") return `${year}-Q${Math.floor(month / 3) + 1}`;
  return monthKey(date);
};

const recurrenceIntervalMonths = (frequency) =>
  ({ MONTHLY: 1, QUARTERLY: 3, YEARLY: 12 })[frequency] || 0;

const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const nextRecurringDueDate = (sourceDate, frequency, now) => {
  const intervalMonths = recurrenceIntervalMonths(frequency);
  if (!intervalMonths) return null;
  const source = new Date(sourceDate);
  const target = addDays(now, 2);
  const monthsElapsed = (target.getFullYear() - source.getFullYear()) * 12 + target.getMonth() - source.getMonth();
  if (monthsElapsed < intervalMonths || monthsElapsed % intervalMonths !== 0) return null;
  const day = new Date(sourceDate).getDate();
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  const dueDate = new Date(target.getFullYear(), target.getMonth(), Math.min(day, lastDay));
  return dateKey(dueDate) === dateKey(target) ? dueDate : null;
};

const createTaskAssignedNotification = async (task) => {
  if (!task.assignedTo) return;
  await Notification.create({
    user: task.assignedTo._id || task.assignedTo,
    task: task._id,
    assignedTo: task.assignedTo._id || task.assignedTo,
    url: `/admin/tasks?filter=assigned&employee=${encodeURIComponent(String(task.assignedTo._id || task.assignedTo))}&task=${encodeURIComponent(String(task._id))}`,
    title: "New task assigned",
    message: `${actorName(task.assignedBy)} assigned ${task.service} for ${clientName(task.client)}. Due date: ${
      task.dueDate ? String(task.dueDate).slice(0, 10) : "-"
    }.`,
    type: "task_assigned",
  });
};

const sendTaskAssignedPushSafely = async (task, eventType = "TASK_ASSIGNED") => {
  if (!task.assignedTo) return;
  try {
    await sendTaskAssignedNotification(task.assignedTo._id || task.assignedTo, task, eventType);
  } catch (error) {
    console.warn("[task-assigned-push-failed]", {
      taskId: String(task._id),
      assignedTo: String(task.assignedTo._id || task.assignedTo),
      message: error.message,
    });
  }
};

const createTaskStatusNotifications = async (task, actor) => {
  const admins = await Admin.find({
    _id: { $ne: actor._id },
    status: "Active",
    role: { $in: [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN] },
  }).select("_id");

  const recipientIds = new Set(admins.map((recipient) => String(recipient._id)));
  if (task.assignedTo?._id && String(task.assignedTo._id) !== String(actor._id)) {
    recipientIds.add(String(task.assignedTo._id));
  }
  if (task.assignedBy?._id && String(task.assignedBy._id) !== String(actor._id)) {
    recipientIds.add(String(task.assignedBy._id));
  }

  const recipientList = Array.from(recipientIds);
  if (recipientList.length === 0) return;

  await Notification.insertMany(
    recipientList.map((recipientId) => ({
      user: recipientId,
      task: task._id,
      assignedTo: task.assignedTo?._id || task.assignedTo,
      url: `/admin/tasks?filter=assigned&employee=${encodeURIComponent(String(task.assignedTo?._id || task.assignedTo || recipientId))}&task=${encodeURIComponent(String(task._id))}`,
      title: "Task status updated",
      message: `${actorName(actor)} updated ${task.service} for ${clientName(task.client)} to ${task.workStatus}.`,
      type: "task_status_updated",
    })),
  );
};

const ensureBillingItemForCompletedTask = async (task, actorId) => {
  if (task.workStatus !== "Completed") return;
  await BillingItem.findOneAndUpdate(
    { task: task._id },
    {
      $setOnInsert: {
        client: task.client._id || task.client,
        task: task._id,
        service: task.service,
        taskType: task.taskType || "Compliance",
        status: "INVOICE_TO_BE_RAISED",
        createdBy: actorId,
      },
    },
    { upsert: true, new: true }
  );
};

const canAssignTaskTo = (actor, target) => {
  if (!actor || !target) return false;
  if (target.status !== "Active") return false;
  if (String(actor._id) === String(target._id)) return actor.role === ROLE_NAMES.ADMIN;
  if (target.role === ROLE_NAMES.SUPER_ADMIN) return false;
  if (actor.role === ROLE_NAMES.SUPER_ADMIN) return true;
  if (actor.role === ROLE_NAMES.ADMIN) return roleLevel(actor.role) > roleLevel(target.role);
  return false;
};

const normalizeRecurrenceFrequency = (value, recurringMonthly = false) => {
  if (["MONTHLY", "QUARTERLY", "YEARLY"].includes(value)) return value;
  return recurringMonthly ? "MONTHLY" : "NONE";
};

const ensureRecurringTasks = async () => {
  const now = new Date();
  const templates = await Task.find({
    $and: [
      {
        $or: [
          { recurrenceFrequency: { $in: ["MONTHLY", "QUARTERLY", "YEARLY"] } },
          { recurringMonthly: true },
        ],
      },
      { $or: [{ recurrenceRoot: null }, { recurrenceRoot: { $exists: false } }] },
    ],
  }).populate("assignedTo", "status");

  await Promise.all(
    templates.map(async (template) => {
      const frequency = normalizeRecurrenceFrequency(template.recurrenceFrequency, template.recurringMonthly);
      const rootId = template.recurrenceRoot || template._id;
      const dueDate = nextRecurringDueDate(template.dueDate || template.createdAt, frequency, now);
      if (!dueDate) return;
      const periodKey = recurrencePeriodKey(dueDate, frequency);

      const exists = await Task.exists({
        recurrenceRoot: rootId,
        recurrenceMonthKey: periodKey,
      });
      if (exists) return;

      const assigneeInactive = template.assignedTo?.status !== "Active";
      const recurringTask = await Task.create({
        client: template.client,
        service: template.service,
        description: template.description,
        taskType: template.taskType || "Compliance",
        dueDate,
        assignedTo: template.assignedTo?._id || template.assignedTo,
        assignedBy: template.assignedBy,
        workStatus: "Pending",
        workPreference: template.workPreference || "Medium",
        recurringMonthly: frequency === "MONTHLY",
        recurrenceFrequency: frequency,
        recurrenceRoot: rootId,
        recurrenceMonthKey: periodKey,
        needsReassignment: assigneeInactive,
        comments: [
          {
            text: assigneeInactive
              ? "Recurring task created. Original assignee is inactive; reassign this task."
              : "Recurring task created automatically.",
            status: "Pending",
            author: template.assignedBy,
            authorName: "System",
          },
        ],
      });
      await recurringTask.populate("client", "name companyName");
      await recurringTask.populate("assignedTo", "firstName lastName email status");
      await recurringTask.populate("assignedBy", "firstName lastName email");
      await createTaskAssignedNotification(recurringTask);
      await sendTaskAssignedPushSafely(recurringTask, "TASK_ASSIGNED");
    })
  );
};

let recurringTaskSchedulerStarted = false;

exports.startTaskScheduler = () => {
  if (recurringTaskSchedulerStarted) return;
  recurringTaskSchedulerStarted = true;

  const run = () => {
    ensureRecurringTasks().catch((error) => {
      console.error("Recurring task scheduler failed:", error.message);
    });
  };

  run();
  setInterval(run, 6 * 60 * 60 * 1000);
};

const serialize = (task) => ({
  id: task._id,
  client: task.client
    ? {
        id: task.client._id,
        name: task.client.name,
        companyName: task.client.companyName,
      }
    : null,
  service: task.service,
  description: task.description,
  taskType: task.taskType,
  dueDate: task.dueDate,
  assignedTo: task.assignedTo
    ? {
        id: task.assignedTo._id,
        name: actorName(task.assignedTo),
        email: task.assignedTo.email,
      }
    : null,
  assignedBy: task.assignedBy
    ? {
        id: task.assignedBy._id,
        name: actorName(task.assignedBy),
        email: task.assignedBy.email,
      }
    : null,
  workStatus: task.workStatus,
  workPreference: task.workPreference,
  recurringMonthly: Boolean(task.recurringMonthly),
  recurrenceFrequency: normalizeRecurrenceFrequency(task.recurrenceFrequency, task.recurringMonthly),
  needsReassignment: Boolean(task.needsReassignment || task.assignedTo?.status !== "Active"),
  comments: task.comments || [],
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

exports.listTasks = async (req, res, next) => {
  try {
    await ensureRecurringTasks();

    const filter = {};
    if (req.query.client) filter.client = req.query.client;
    if (!req.query.client && !isTopAdmin(req.admin.role)) filter.assignedTo = req.admin._id;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    const tasks = await Task.find(filter)
      .populate("client", "name companyName")
      .populate("assignedTo", "firstName lastName email status")
      .populate("assignedBy", "firstName lastName email")
      .sort({ dueDate: 1, createdAt: -1 });

    if (req.query.client) {
      await Promise.all(
        tasks
          .filter((task) => task.workStatus === "Completed")
          .map((task) => ensureBillingItemForCompletedTask(task, req.admin._id))
      );
    }

    res.json({ success: true, tasks: tasks.map(serialize) });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { client, service, description, dueDate, assignedTo, workStatus, workPreference, comment, taskType, recurringMonthly, recurrenceFrequency } = req.body;
    if (!client || !service || !description || !dueDate || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Client, service, description, due date, and assignee are required",
      });
    }

    const assignee = await Admin.findById(assignedTo);
    if (!assignee) {
      return res.status(404).json({ success: false, message: "Assigned employee not found" });
    }
    if (assignee.status !== "Active") {
      return res.status(400).json({ success: false, message: "Selected employee is inactive. Assign this task to an active employee." });
    }
    if (!canAssignTaskTo(req.admin, assignee)) {
      return res.status(403).json({
        success: false,
        message: "You can only assign tasks to allowed lower-level employees, not yourself or Super Admin",
      });
    }

    const normalizedRecurrence = normalizeRecurrenceFrequency(recurrenceFrequency, recurringMonthly);
    const task = await Task.create({
      client,
      service,
      description,
      dueDate,
      assignedTo,
      assignedBy: req.admin._id,
      taskType: taskType || "Compliance",
      workStatus: workStatus || "Pending",
      workPreference: workPreference || "Medium",
      recurringMonthly: normalizedRecurrence === "MONTHLY",
      recurrenceFrequency: normalizedRecurrence,
      comments: comment
        ? [
            {
              text: comment,
              status: workStatus || "Pending",
              author: req.admin._id,
              authorName: actorName(req.admin),
            },
          ]
        : [],
    });

    await task.populate("client", "name companyName");
    await task.populate("assignedTo", "firstName lastName email status");
    await task.populate("assignedBy", "firstName lastName email");
    await ensureBillingItemForCompletedTask(task, req.admin._id);
    await createTaskAssignedNotification(task);
    await sendTaskAssignedPushSafely(task, "TASK_ASSIGNED");
    await writeAudit(req, "TASK_CREATED", "TASKS", `${req.admin.email} assigned ${service}`);

    res.status(201).json({ success: true, task: serialize(task) });
  } catch (err) {
    next(err);
  }
};

exports.reassignTask = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    if (!assignedTo) return res.status(400).json({ success: false, message: "Employee is required" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const assignee = await Admin.findById(assignedTo);
    if (!assignee) return res.status(404).json({ success: false, message: "Employee not found" });
    if (!canAssignTaskTo(req.admin, assignee)) {
      return res.status(403).json({ success: false, message: "You can only reassign to an active allowed employee" });
    }

    const previousAssigneeId = String(task.assignedTo || "");
    const isSameAssignee = previousAssigneeId === String(assignee._id);
    task.assignedTo = assignee._id;
    task.needsReassignment = false;
    task.comments.push({
      text: `Task reassigned to ${actorName(assignee)}`,
      status: task.workStatus,
      author: req.admin._id,
      authorName: actorName(req.admin),
    });
    await task.save();

    await task.populate("client", "name companyName");
    await task.populate("assignedTo", "firstName lastName email status");
    await task.populate("assignedBy", "firstName lastName email");
    if (!isSameAssignee) {
      await createTaskAssignedNotification(task);
      await sendTaskAssignedPushSafely(task, "TASK_REASSIGNED");
    }
    await writeAudit(req, "TASK_REASSIGNED", "TASKS", `${req.admin.email} reassigned ${task.service}`);

    res.json({ success: true, task: serialize(task) });
  } catch (err) {
    next(err);
  }
};

exports.updateTaskDetails = async (req, res, next) => {
  try {
    const { assignedTo, dueDate, workStatus, workPreference, description, recurrenceFrequency } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const canEditTask =
      isTopAdmin(req.admin.role) ||
      String(task.assignedBy || "") === String(req.admin._id);
    if (!canEditTask) {
      return res.status(403).json({ success: false, message: "You cannot edit this task" });
    }

    let assigneeChanged = false;
    if (assignedTo && String(assignedTo) !== String(task.assignedTo || "")) {
      const assignee = await Admin.findById(assignedTo);
      if (!assignee) return res.status(404).json({ success: false, message: "Employee not found" });
      if (!canAssignTaskTo(req.admin, assignee)) {
        return res.status(403).json({ success: false, message: "You can only assign to an active allowed employee" });
      }
      task.assignedTo = assignee._id;
      task.needsReassignment = false;
      assigneeChanged = true;
      task.comments.push({
        text: `Task assigned to ${actorName(assignee)}`,
        status: task.workStatus,
        author: req.admin._id,
        authorName: actorName(req.admin),
      });
    }

    if (dueDate) task.dueDate = dueDate;
    if (workStatus) task.workStatus = workStatus;
    if (workPreference) task.workPreference = workPreference;
    if (description !== undefined) task.description = description;
    if (recurrenceFrequency !== undefined) {
      const normalizedRecurrence = normalizeRecurrenceFrequency(recurrenceFrequency, false);
      task.recurrenceFrequency = normalizedRecurrence;
      task.recurringMonthly = normalizedRecurrence === "MONTHLY";
    }

    await task.save();
    await task.populate("client", "name companyName");
    await task.populate("assignedTo", "firstName lastName email status");
    await task.populate("assignedBy", "firstName lastName email");
    if (assigneeChanged) {
      await createTaskAssignedNotification(task);
      await sendTaskAssignedPushSafely(task, "TASK_REASSIGNED");
    }
    await writeAudit(req, "TASK_EDITED", "TASKS", `${req.admin.email} edited ${task.service}`);

    res.json({ success: true, task: serialize(task) });
  } catch (err) {
    next(err);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { workStatus, comment } = req.body;
    if (!workStatus || !comment) {
      return res.status(400).json({
        success: false,
        message: "Work status and comment are required",
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const isAssignee = String(task.assignedTo) === String(req.admin._id);
    if (!isTopAdmin(req.admin.role) && !isAssignee) {
      return res.status(403).json({ success: false, message: "You cannot update this task" });
    }

    task.workStatus = workStatus;
    task.comments.push({
      text: comment,
      status: workStatus,
      author: req.admin._id,
      authorName: actorName(req.admin),
    });
    await task.save();

    await task.populate("client", "name companyName");
    await task.populate("assignedTo", "firstName lastName email status");
    await task.populate("assignedBy", "firstName lastName email");
    await ensureBillingItemForCompletedTask(task, req.admin._id);
    await createTaskStatusNotifications(task, req.admin);
    await writeAudit(req, "TASK_UPDATED", "TASKS", `${req.admin.email} updated ${task.service}`);

    res.json({ success: true, task: serialize(task) });
  } catch (err) {
    next(err);
  }
};
