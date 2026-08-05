const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const {
  createLead,
  getLeads,
  getStats,
  getLead,
  updateLead,
  deleteLead,
  exportCSV,
} = require("../controllers/leadsController");

// Public
router.post("/", createLead);

// Admin protected
router.get("/stats", protect, getStats);
router.get("/export/csv", protect, exportCSV);
router.get("/", protect, getLeads);
router.get("/:id", protect, getLead);
router.patch("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);

module.exports = router;
