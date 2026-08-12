const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    userEmail: String,
    action: { type: String, required: true },
    module: { type: String, required: true },
    description: { type: String, required: true },
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
