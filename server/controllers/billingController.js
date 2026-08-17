const mongoose = require("mongoose");
const BillingItem = require("../models/BillingItem");
const Task = require("../models/Task");
const { writeAudit } = require("../utils/audit");

const totalPaid = (item) =>
  (item.payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

const serialize = (item) => ({
  id: item._id,
  client: item.client,
  task: item.task && item.task.service
    ? {
        id: item.task._id,
        service: item.task.service,
        workStatus: item.task.workStatus,
        completedAt: item.task.updatedAt,
      }
    : null,
  service:
    item.groupedServices && item.groupedServices.length > 1
      ? `${item.groupedServices.length} services`
      : item.service,
  taskType: item.taskType,
  services:
    item.groupedServices && item.groupedServices.length > 0
      ? item.groupedServices.map((entry) => ({
          service: entry.service,
          taskType: entry.taskType,
          itemId: entry.itemId,
        }))
      : [{ service: item.service, taskType: item.taskType, itemId: item._id }],
  invoiceGroupId: item.invoiceGroupId,
  isInvoiceGroupPrimary: item.isInvoiceGroupPrimary,
  amount: item.amount,
  paidAmount: item.paidAmount || totalPaid(item),
  balanceAmount: Math.max(Number(item.amount || 0) - Number(item.paidAmount || totalPaid(item)), 0),
  invoiceNumber: item.invoiceNumber,
  status: item.status,
  payments: item.payments || [],
  invoiceRaisedAt: item.invoiceRaisedAt,
  paymentPendingAt: item.paymentPendingAt,
  paidAt: item.paidAt,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const parseDateRange = (from, to) => {
  const start = from ? new Date(from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = to ? new Date(to) : new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

exports.getBillingStats = async (req, res, next) => {
  try {
    const { start, end } = parseDateRange(req.query.from, req.query.to);
    const visibleFilter = { isInvoiceGroupPrimary: { $ne: false } };
    const invoiceDateFilter = {
      ...visibleFilter,
      invoiceRaisedAt: { $gte: start, $lte: end },
    };

    const [raisedInvoices, allVisibleItems] = await Promise.all([
      BillingItem.find(invoiceDateFilter).lean(),
      BillingItem.find(visibleFilter).lean(),
    ]);

    const paymentsInRange = allVisibleItems.flatMap((item) =>
      (item.payments || [])
        .filter((payment) => {
          const receivedAt = new Date(payment.receivedAt);
          return receivedAt >= start && receivedAt <= end;
        })
        .map((payment) => Number(payment.amount || 0)),
    );

    const invoiceAmount = raisedInvoices.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const pendingAmount = raisedInvoices.reduce((sum, item) => {
      const paid = Number(item.paidAmount || totalPaid(item));
      return sum + Math.max(Number(item.amount || 0) - paid, 0);
    }, 0);
    const paidAmount = paymentsInRange.reduce((sum, amount) => sum + amount, 0);

    res.json({
      success: true,
      stats: {
        from: start,
        to: end,
        invoicesRaised: raisedInvoices.length,
        invoiceAmount,
        paidAmount,
        pendingAmount,
        paymentPendingInvoices: raisedInvoices.filter((item) => item.status === "PAYMENT_PENDING").length,
        paidInvoices: raisedInvoices.filter((item) => item.status === "PAID").length,
        invoiceToBeRaised: allVisibleItems.filter((item) => item.status === "INVOICE_TO_BE_RAISED").length,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.listBillingItems = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.client) filter.client = req.query.client;
    if (req.query.status) filter.status = req.query.status;

    if (req.query.client) {
      const completedTasks = await Task.find({
        client: req.query.client,
        workStatus: "Completed",
      }).select("_id client service taskType");
      await Promise.all(
        completedTasks.map((task) =>
          BillingItem.findOneAndUpdate(
            { task: task._id },
            {
              $setOnInsert: {
                client: task.client,
                task: task._id,
                service: task.service,
                taskType: task.taskType || "Compliance",
                status: "INVOICE_TO_BE_RAISED",
                createdBy: req.admin._id,
              },
            },
            { upsert: true, new: true }
          )
        )
      );
    }

    const items = await BillingItem.find(filter)
      .populate("task", "service workStatus updatedAt")
      .sort({ updatedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      billingItems: items
        .filter((item) => item.isInvoiceGroupPrimary !== false)
        .map(serialize),
    });
  } catch (err) {
    next(err);
  }
};

exports.createBillingItems = async (req, res, next) => {
  try {
    const { client, services = [] } = req.body;
    if (!client) return res.status(400).json({ success: false, message: "Client is required" });
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "Select at least one compliance or notice service" });
    }

    const normalizedServices = services
      .map((item) => ({
        service: String(item.service || item.label || "").trim(),
        taskType: String(item.taskType || "Compliance").trim() || "Compliance",
      }))
      .filter((item) => item.service);

    if (normalizedServices.length === 0) {
      return res.status(400).json({ success: false, message: "Valid services are required" });
    }

    const items = [];
    for (const entry of normalizedServices) {
      const existing = await BillingItem.findOne({
        client,
        service: entry.service,
        taskType: entry.taskType,
        status: { $in: ["INVOICE_TO_BE_RAISED", "INVOICE_RAISED", "PAYMENT_PENDING"] },
      });

      if (existing) {
        items.push(existing);
        continue;
      }

      const item = await BillingItem.create({
        client,
        task: new mongoose.Types.ObjectId(),
        service: entry.service,
        taskType: entry.taskType,
        status: "INVOICE_TO_BE_RAISED",
        createdBy: req.admin._id,
      });
      items.push(item);
    }

    await writeAudit(
      req,
      "BILLING_ITEMS_CREATED",
      "BILLING",
      `${req.admin.email} created ${items.length} invoice-to-be-raised item(s)`
    );

    res.status(201).json({ success: true, billingItems: items.map(serialize) });
  } catch (err) {
    next(err);
  }
};

exports.raiseInvoice = async (req, res, next) => {
  try {
    const { amount, invoiceNumber } = req.body;
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Valid invoice amount is required" });
    }

    const item = await BillingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Billing item not found" });
    if (!["INVOICE_TO_BE_RAISED", "INVOICE_RAISED", "PAYMENT_PENDING", "PAID"].includes(item.status)) {
      return res.status(400).json({ success: false, message: "Invoice cannot be updated for this item" });
    }

    const paidSoFar = item.paidAmount || totalPaid(item);
    if (parsedAmount < paidSoFar) {
      return res.status(400).json({ success: false, message: `Invoice amount cannot be less than paid amount ${paidSoFar}` });
    }

    const wasInvoiceRaised = Boolean(item.invoiceRaisedAt);
    item.amount = parsedAmount;
    item.invoiceNumber = invoiceNumber || "";
    if (!wasInvoiceRaised) item.invoiceRaisedAt = new Date();
    if (item.status === "INVOICE_TO_BE_RAISED") item.status = "INVOICE_RAISED";
    if (item.status === "PAID" && parsedAmount > paidSoFar) {
      item.status = "PAYMENT_PENDING";
      item.paidAt = undefined;
      item.paymentPendingAt = item.paymentPendingAt || new Date();
    }
    item.updatedBy = req.admin._id;
    await item.save();
    await item.populate("task", "service workStatus updatedAt");
    await writeAudit(
      req,
      wasInvoiceRaised ? "INVOICE_UPDATED" : "INVOICE_RAISED",
      "BILLING",
      `${req.admin.email} ${wasInvoiceRaised ? "updated" : "raised"} invoice for ${item.service}`
    );

    res.json({ success: true, billingItem: serialize(item) });
  } catch (err) {
    next(err);
  }
};

exports.raiseMultipleInvoices = async (req, res, next) => {
  try {
    const { itemIds = [], amount, invoiceNumber } = req.body;
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ success: false, message: "Select at least one invoice item" });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Valid invoice amount is required" });
    }

    const items = await BillingItem.find({ _id: { $in: itemIds } }).populate("task", "service workStatus updatedAt");
    if (items.length !== itemIds.length) {
      return res.status(404).json({ success: false, message: "One or more billing items were not found" });
    }

    for (const item of items) {
      if (!["INVOICE_TO_BE_RAISED", "INVOICE_RAISED", "PAYMENT_PENDING", "PAID"].includes(item.status)) {
        return res.status(400).json({ success: false, message: `Invoice cannot be updated for ${item.service}` });
      }
      const paidSoFar = item.paidAmount || totalPaid(item);
      if (parsedAmount < paidSoFar) {
        return res.status(400).json({ success: false, message: `Invoice amount for ${item.service} cannot be less than paid amount ${paidSoFar}` });
      }
    }

    const groupId = items.length > 1 ? new mongoose.Types.ObjectId().toString() : "";
    const groupedServices = items.map((entry) => ({
      service: entry.service,
      taskType: entry.taskType || "Compliance",
      itemId: entry._id,
    }));
    const updatedItems = [];
    for (const item of items) {
      const paidSoFar = item.paidAmount || totalPaid(item);
      const wasInvoiceRaised = Boolean(item.invoiceRaisedAt);
      const isPrimary = updatedItems.length === 0;
      item.amount = isPrimary ? parsedAmount : 0;
      item.invoiceNumber = invoiceNumber || "";
      item.invoiceGroupId = groupId;
      item.isInvoiceGroupPrimary = isPrimary;
      item.groupedServices = items.length > 1 ? groupedServices : [];
      if (!wasInvoiceRaised) item.invoiceRaisedAt = new Date();
      if (item.status === "INVOICE_TO_BE_RAISED") item.status = "INVOICE_RAISED";
      if (item.status === "PAID" && parsedAmount > paidSoFar) {
        item.status = "PAYMENT_PENDING";
        item.paidAt = undefined;
        item.paymentPendingAt = item.paymentPendingAt || new Date();
      }
      item.updatedBy = req.admin._id;
      await item.save();
      updatedItems.push(item);
    }

    await writeAudit(
      req,
      "INVOICES_RAISED",
      "BILLING",
      `${req.admin.email} raised/updated ${updatedItems.length} invoice(s)`
    );

    res.json({ success: true, billingItems: updatedItems.map(serialize) });
  } catch (err) {
    next(err);
  }
};

exports.markPaymentPending = async (req, res, next) => {
  try {
    const item = await BillingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Billing item not found" });
    if (item.status !== "INVOICE_RAISED") {
      return res.status(400).json({ success: false, message: "Only raised invoices can move to payment pending" });
    }

    item.status = "PAYMENT_PENDING";
    item.paymentPendingAt = new Date();
    item.updatedBy = req.admin._id;
    await item.save();
    if (item.invoiceGroupId) {
      await BillingItem.updateMany(
        { invoiceGroupId: item.invoiceGroupId, _id: { $ne: item._id } },
        { status: "PAYMENT_PENDING", paymentPendingAt: item.paymentPendingAt, updatedBy: req.admin._id }
      );
    }
    await item.populate("task", "service workStatus updatedAt");
    await writeAudit(req, "PAYMENT_PENDING", "BILLING", `${req.admin.email} marked payment pending for ${item.service}`);

    res.json({ success: true, billingItem: serialize(item) });
  } catch (err) {
    next(err);
  }
};

exports.markPaid = async (req, res, next) => {
  try {
    const { amount, note } = req.body;
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Valid payment amount is required" });
    }

    const item = await BillingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Billing item not found" });
    if (item.status !== "PAYMENT_PENDING") {
      return res.status(400).json({ success: false, message: "Only pending payments can be marked paid" });
    }

    const paidBefore = item.paidAmount || totalPaid(item);
    const balance = Number(item.amount || 0) - paidBefore;
    if (parsedAmount > balance) {
      return res.status(400).json({ success: false, message: `Payment cannot exceed pending amount ${balance}` });
    }

    item.payments.push({
      amount: parsedAmount,
      note: note || "",
      receivedBy: req.admin._id,
    });
    item.paidAmount = paidBefore + parsedAmount;
    if (item.paidAmount >= Number(item.amount || 0)) {
      item.status = "PAID";
      item.paidAt = new Date();
    }
    item.updatedBy = req.admin._id;
    await item.save();
    if (item.invoiceGroupId) {
      await BillingItem.updateMany(
        { invoiceGroupId: item.invoiceGroupId, _id: { $ne: item._id } },
        {
          status: item.status,
          paidAt: item.status === "PAID" ? item.paidAt : undefined,
          paymentPendingAt: item.paymentPendingAt,
          updatedBy: req.admin._id,
        }
      );
    }
    await item.populate("task", "service workStatus updatedAt");
    await writeAudit(req, "PAYMENT_RECEIVED", "BILLING", `${req.admin.email} received payment ${parsedAmount} for ${item.service}`);

    res.json({ success: true, billingItem: serialize(item) });
  } catch (err) {
    next(err);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const item = await BillingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Billing item not found" });
    if (!item.invoiceRaisedAt) {
      return res.status(400).json({ success: false, message: "Only raised invoices can be deleted" });
    }

    const groupFilter = item.invoiceGroupId
      ? { invoiceGroupId: item.invoiceGroupId }
      : { _id: item._id };

    await BillingItem.updateMany(groupFilter, {
      $set: {
        amount: 0,
        paidAmount: 0,
        invoiceNumber: "",
        invoiceGroupId: "",
        isInvoiceGroupPrimary: true,
        groupedServices: [],
        payments: [],
        status: "INVOICE_TO_BE_RAISED",
        updatedBy: req.admin._id,
      },
      $unset: {
        invoiceRaisedAt: "",
        paymentPendingAt: "",
        paidAt: "",
      },
    });

    await writeAudit(
      req,
      "INVOICE_DELETED",
      "BILLING",
      `${req.admin.email} deleted invoice for ${item.service}`
    );

    res.json({ success: true, message: "Invoice and related payments deleted" });
  } catch (err) {
    next(err);
  }
};
