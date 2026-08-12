const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true, default: "" },
    type: {
      type: String,
      enum: ["SYSTEM", "CUSTOM"],
      default: "CUSTOM",
    },
    baseRole: {
      type: String,
      enum: ["ADMIN", "TEAM_MEMBER"],
      default: "TEAM_MEMBER",
    },
    permissions: [{ type: String }],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
