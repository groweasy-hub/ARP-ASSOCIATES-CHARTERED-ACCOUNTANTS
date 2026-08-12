const AuditLog = require("../models/AuditLog");

const writeAudit = async (req, action, module, description) => {
  try {
    await AuditLog.create({
      user: req.admin?._id,
      userEmail: req.admin?.email,
      action,
      module,
      description,
      ip: req.ip,
      userAgent: typeof req.get === "function" ? req.get("user-agent") : req.headers?.["user-agent"],
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};

module.exports = { writeAudit };
