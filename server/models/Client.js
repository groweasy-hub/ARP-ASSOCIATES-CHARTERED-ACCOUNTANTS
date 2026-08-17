const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, default: "" },
    clientType: {
      type: String,
      enum: ["Individual", "Proprietorship", "Partnership", "LLP", "Company", "Trust", "Other"],
      default: "Individual",
    },
    contactPerson: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    pan: { type: String, trim: true, uppercase: true, default: "" },
    gstin: { type: String, trim: true, uppercase: true, default: "" },
    address: { type: String, trim: true, default: "" },
    service: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Prospect", "Closed"],
      default: "Active",
    },
    notes: { type: String, trim: true, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
