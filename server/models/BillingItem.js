const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    receivedAt: { type: Date, default: Date.now },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    note: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const billingItemSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", index: { unique: true, sparse: true } },
    service: { type: String, trim: true, required: true },
    taskType: { type: String, trim: true, default: "Compliance" },
    amount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    invoiceNumber: { type: String, trim: true, default: "" },
    invoiceGroupId: { type: String, trim: true, default: "" },
    isInvoiceGroupPrimary: { type: Boolean, default: true },
    groupedServices: [
      {
        service: { type: String, trim: true, default: "" },
        taskType: { type: String, trim: true, default: "" },
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "BillingItem", default: null },
      },
    ],
    status: {
      type: String,
      enum: ["INVOICE_TO_BE_RAISED", "INVOICE_RAISED", "PAYMENT_PENDING", "PAID"],
      default: "INVOICE_TO_BE_RAISED",
    },
    invoiceRaisedAt: Date,
    paymentPendingAt: Date,
    paidAt: Date,
    payments: [paymentSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BillingItem", billingItemSchema);
