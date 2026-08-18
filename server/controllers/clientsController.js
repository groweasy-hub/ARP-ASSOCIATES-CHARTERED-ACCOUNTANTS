const Client = require("../models/Client");
const BillingItem = require("../models/BillingItem");
const { writeAudit } = require("../utils/audit");

const billingSummaryPipeline = (clientIds, groupByClient = true) => {
  const balanceExpression = {
    $subtract: [
      { $ifNull: ["$amount", 0] },
      { $ifNull: ["$paidAmount", 0] },
    ],
  };

  return [
    {
      $match: {
        client: { $in: clientIds },
        isInvoiceGroupPrimary: { $ne: false },
        invoiceRaisedAt: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: groupByClient ? "$client" : null,
        paymentPendingAmount: {
          $sum: {
            $cond: [{ $gt: [balanceExpression, 0] }, balanceExpression, 0],
          },
        },
        invoicesRaisedCount: { $sum: 1 },
        pendingInvoicesCount: {
          $sum: {
            $cond: [{ $gt: [balanceExpression, 0] }, 1, 0],
          },
        },
      },
    },
  ];
};

const serialize = (client, billingSummary = {}) => ({
  id: client._id,
  name: client.name,
  companyName: client.companyName,
  clientType: client.clientType,
  contactPerson: client.contactPerson,
  email: client.email,
  phone: client.phone,
  pan: client.pan,
  gstin: client.gstin,
  address: client.address,
  service: client.service,
  status: client.status,
  notes: client.notes,
  paymentPendingAmount: billingSummary.paymentPendingAmount || 0,
  invoicesRaisedCount: billingSummary.invoicesRaisedCount || 0,
  pendingInvoicesCount: billingSummary.pendingInvoicesCount || 0,
  createdAt: client.createdAt,
  updatedAt: client.updatedAt,
});

exports.listClients = async (req, res, next) => {
  try {
    const { search = "", status = "", billing = "", page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { companyName: regex },
        { contactPerson: regex },
        { email: regex },
        { phone: regex },
        { pan: regex },
        { gstin: regex },
        { service: regex },
      ];
    }
    if (billing) {
      const baseBillingMatch = {
        isInvoiceGroupPrimary: { $ne: false },
        invoiceRaisedAt: { $exists: true, $ne: null },
      };
      let billingClientIds = [];

      if (billing === "PAYMENT_PENDING") {
        const balanceExpression = {
          $subtract: [
            { $ifNull: ["$amount", 0] },
            { $ifNull: ["$paidAmount", 0] },
          ],
        };
        billingClientIds = (
          await BillingItem.aggregate([
            { $match: baseBillingMatch },
            { $match: { $expr: { $gt: [balanceExpression, 0] } } },
            { $group: { _id: "$client" } },
          ])
        ).map((item) => item._id);
      } else if (billing === "PAID") {
        billingClientIds = await BillingItem.distinct("client", {
          ...baseBillingMatch,
          status: "PAID",
        });
      } else if (billing === "INVOICE_RAISED") {
        billingClientIds = await BillingItem.distinct("client", baseBillingMatch);
      }

      filter._id = { $in: billingClientIds };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [clients, total, matchingClientIds] = await Promise.all([
      Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Client.countDocuments(filter),
      Client.distinct("_id", filter),
    ]);
    const clientIds = clients.map((client) => client._id);
    const pendingTotals = clientIds.length
      ? await BillingItem.aggregate(billingSummaryPipeline(clientIds, true))
      : [];
    const [billingTotals = {}] = matchingClientIds.length
      ? await BillingItem.aggregate(billingSummaryPipeline(matchingClientIds, false))
      : [];
    const billingByClient = new Map(
      pendingTotals.map((item) => [
        String(item._id),
        {
          paymentPendingAmount: Math.max(0, Number(item.paymentPendingAmount || 0)),
          invoicesRaisedCount: Number(item.invoicesRaisedCount || 0),
          pendingInvoicesCount: Number(item.pendingInvoicesCount || 0),
        },
      ])
    );

    res.json({
      success: true,
      clients: clients.map((client) => serialize(client, billingByClient.get(String(client._id)) || {})),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      summary: {
        totalClients: total,
        invoicesRaisedCount: Number(billingTotals.invoicesRaisedCount || 0),
        pendingInvoicesCount: Number(billingTotals.pendingInvoicesCount || 0),
        paymentPendingAmount: Math.max(0, Number(billingTotals.paymentPendingAmount || 0)),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: "Client name is required" });
    }

    const client = await Client.create({ ...req.body, createdBy: req.admin._id });
    await writeAudit(req, "CLIENT_CREATED", "CLIENTS", `${req.admin.email} created client ${client.name}`);
    res.status(201).json({ success: true, client: serialize(client) });
  } catch (err) {
    next(err);
  }
};

exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    res.json({ success: true, client: serialize(client) });
  } catch (err) {
    next(err);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const protectedFields = ["_id", "id", "createdBy", "createdAt", "updatedAt"];
    protectedFields.forEach((field) => delete req.body[field]);

    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    await writeAudit(req, "CLIENT_UPDATED", "CLIENTS", `${req.admin.email} updated client ${client.name}`);
    res.json({ success: true, client: serialize(client) });
  } catch (err) {
    next(err);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    await writeAudit(req, "CLIENT_DELETED", "CLIENTS", `${req.admin.email} deleted client ${client.name}`);
    res.json({ success: true, message: "Client deleted" });
  } catch (err) {
    next(err);
  }
};
