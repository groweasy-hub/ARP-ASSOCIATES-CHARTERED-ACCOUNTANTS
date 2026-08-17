const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    url: { type: String, trim: true, default: "" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "info" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
