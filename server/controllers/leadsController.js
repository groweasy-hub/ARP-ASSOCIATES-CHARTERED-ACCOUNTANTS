const Lead = require("../models/Lead");
const {
  isEmailConfigured,
  sendAdminNotification,
  sendCustomerAcknowledgement,
} = require("../config/email");
const { writeAudit } = require("../utils/audit");

// POST /api/leads  — public (contact form submission)
exports.createLead = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !phone || !subject || !message)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (!isEmailConfigured()) {
      return res.status(500).json({
        success: false,
        message:
          "Email service is not configured yet. Please add the server email settings.",
      });
    }

    const lead = await Lead.create({ name, email, phone, subject, message });

    const emailResults = await Promise.allSettled([
      sendAdminNotification(lead),
      sendCustomerAcknowledgement(lead),
    ]);

    const failedEmails = emailResults.filter((result) => result.status === "rejected");
    if (failedEmails.length === emailResults.length) {
      return res.status(502).json({
        success: false,
        message: "Message saved, but email delivery failed. Please check the email settings.",
      });
    }

    res.status(201).json({ success: true, message: "Message sent successfully", lead });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads  — admin
exports.getLeads = async (req, res, next) => {
  try {
    const { search, status, period, sort = "newest", page = 1, limit = 10 } = req.query;

    const filter = {};

    if (status && status !== "All") filter.status = status;

    if (period) {
      const now = new Date();
      if (period === "today") {
        filter.createdAt = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
      } else if (period === "week") {
        const start = new Date();
        start.setDate(start.getDate() - 7);
        filter.createdAt = { $gte: start };
      } else if (period === "month") {
        const start = new Date();
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        filter.createdAt = { $gte: start };
      }
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
      ];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(Number(limit)),
      Lead.countDocuments(filter),
    ]);

    res.json({ success: true, leads, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/stats  — admin
exports.getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [total, todayCount, pending, contacted] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ createdAt: { $gte: todayStart } }),
      Lead.countDocuments({ status: { $in: ["New", "Follow Up"] } }),
      Lead.countDocuments({ status: "Contacted" }),
    ]);

    res.json({ success: true, stats: { total, today: todayCount, pending, contacted, messages: total } });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/:id  — admin
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/leads/:id  — admin
exports.updateLead = async (req, res, next) => {
  try {
    const { status, notes, isRead } = req.body;
    const update = {};
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (isRead !== undefined) update.isRead = isRead;

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    await writeAudit(req, "CLIENT_UPDATED", "LEADS", `${req.admin.email} updated lead ${lead.email}`);
    res.json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/leads/:id  — admin
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    await writeAudit(req, "CLIENT_DELETED", "LEADS", `${req.admin.email} deleted lead ${lead.email}`);
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/leads/export/csv  — admin
exports.exportCSV = async (req, res, next) => {
  try {
    const { status, ids } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (ids) filter._id = { $in: ids.split(",") };

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["Name", "Email", "Phone", "Subject", "Message", "Status", "Submitted Date"];
    const rows = leads.map((l) => [
      escape(l.name), escape(l.email), escape(l.phone),
      escape(l.subject), escape(l.message), escape(l.status),
      escape(new Date(l.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })),
    ]);

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="arp-leads-${Date.now()}.csv"`);
    res.send("\uFEFF" + csv); // BOM for Excel
  } catch (err) {
    next(err);
  }
};
