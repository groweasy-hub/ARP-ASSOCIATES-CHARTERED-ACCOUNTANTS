const express = require("express");
const router = express.Router();
const {
  createBillingItems,
  deleteInvoice,
  getBillingStats,
  listBillingItems,
  markPaid,
  markPaymentPending,
  raiseInvoice,
  raiseMultipleInvoices,
} = require("../controllers/billingController");
const { protect } = require("../middlewares/auth");

router.use(protect);
router.get("/stats", getBillingStats);
router.get("/", listBillingItems);
router.post("/", createBillingItems);
router.patch("/raise-invoices", raiseMultipleInvoices);
router.patch("/:id/raise-invoice", raiseInvoice);
router.patch("/:id/payment-pending", markPaymentPending);
router.patch("/:id/paid", markPaid);
router.delete("/:id/invoice", deleteInvoice);

module.exports = router;
