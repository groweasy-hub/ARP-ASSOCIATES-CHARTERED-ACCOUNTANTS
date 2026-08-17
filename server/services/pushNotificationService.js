const PushSubscription = require("../models/PushSubscription");
const { isWebPushConfigured, webPush } = require("../config/webPush");

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
};

const safeClientName = (client) => client?.companyName || client?.name || "Client";
const safeActorName = (admin) =>
  `${admin?.firstName || ""} ${admin?.lastName || ""}`.trim() || admin?.email || "Admin";

const removeExpiredSubscription = async (subscription, error) => {
  const statusCode = error?.statusCode;
  if (statusCode !== 404 && statusCode !== 410) return;
  await PushSubscription.findByIdAndUpdate(subscription._id, {
    isActive: false,
    lastUsedAt: new Date(),
  });
};

const sendPushToUser = async (userId, payload) => {
  if (!isWebPushConfigured || !userId) return { sent: 0, skipped: true };

  const subscriptions = await PushSubscription.find({ user: userId, isActive: true });
  if (subscriptions.length === 0) return { sent: 0, skipped: false };

  let sent = 0;
  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
          JSON.stringify(payload)
        );
        sent += 1;
        subscription.lastUsedAt = new Date();
        await subscription.save();
      } catch (error) {
        await removeExpiredSubscription(subscription, error);
        console.warn("[web-push-delivery-failed]", {
          subscriptionId: String(subscription._id),
          userId: String(subscription.user),
          statusCode: error.statusCode,
          message: error.message,
        });
      }
    })
  );

  return { sent, skipped: false };
};

const sendTaskAssignedNotification = async (employeeId, task, eventType = "TASK_ASSIGNED") => {
  const taskId = String(task._id);
  const due = formatDate(task.dueDate);
  const priority = task.workPreference ? `${task.workPreference} Priority` : "";
  const details = [due ? `Due ${due}` : "", priority].filter(Boolean).join(" | ");
  const service = task.service || "Task";
  const client = safeClientName(task.client);

  return sendPushToUser(employeeId, {
    title: eventType === "TASK_REASSIGNED" ? "Task Reassigned" : "New Task Assigned",
    body: `${service} - ${client}${details ? `\n${details}` : ""}`,
    icon: "/logo192.png",
    badge: "/logo192.png",
    tag: `task-${eventType.toLowerCase()}-${taskId}`,
    data: {
      type: eventType,
      taskId,
      url: `/admin/tasks?task=${encodeURIComponent(taskId)}`,
      assignedBy: safeActorName(task.assignedBy),
    },
  });
};

module.exports = {
  sendPushToUser,
  sendTaskAssignedNotification,
  removeExpiredSubscription,
};
