const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, required: true },
    status: { type: String, trim: true, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    authorName: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    service: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    taskType: { type: String, trim: true, default: "Compliance" },
    dueDate: { type: Date, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    workStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Waiting for Client", "Completed"],
      default: "Pending",
    },
    workPreference: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    recurringMonthly: { type: Boolean, default: false },
    recurrenceRoot: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
    recurrenceMonthKey: { type: String, trim: true, default: "" },
    needsReassignment: { type: Boolean, default: false },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
