const express = require("express");
const router = express.Router();
const { listAuditLogs } = require("../controllers/auditController");
const { protect, hasPermission } = require("../middlewares/auth");

router.get("/", protect, hasPermission("audit_logs.view"), listAuditLogs);

module.exports = router;
