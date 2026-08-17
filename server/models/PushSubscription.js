const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    userAgent: { type: String, trim: true, default: "" },
    deviceName: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true, index: true },
    lastUsedAt: Date,
  },
  { timestamps: true }
);

pushSubscriptionSchema.index({ user: 1, endpoint: 1 }, { unique: true });

module.exports = mongoose.model("PushSubscription", pushSubscriptionSchema);
