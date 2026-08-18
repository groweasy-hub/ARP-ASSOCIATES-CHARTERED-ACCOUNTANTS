const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { protect, hasPermission } = require("../middlewares/auth");
const {
  createLead,
  getLeads,
  getStats,
  getLead,
  updateLead,
  deleteLead,
  exportCSV,
} = require("../controllers/leadsController");

const publicLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests" },
});

// Public
router.post("/", publicLeadLimiter, createLead);

// Admin protected
router.get("/stats", protect, hasPermission("dashboard.view"), getStats);
router.get("/export/csv", protect, hasPermission("clients.view"), exportCSV);
router.get("/", protect, hasPermission("clients.view"), getLeads);
router.get("/:id", protect, hasPermission("clients.view"), getLead);
router.patch("/:id", protect, hasPermission("clients.edit"), updateLead);
router.delete("/:id", protect, hasPermission("clients.delete"), deleteLead);

module.exports = router;
