const { z } = require("zod");
const PushSubscription = require("../models/PushSubscription");
const { isWebPushConfigured, vapidPublicKey } = require("../config/webPush");

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(2048),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(20).max(512),
    auth: z.string().min(8).max(256),
  }),
  deviceName: z.string().max(120).optional(),
});

exports.getPushStatus = async (req, res, next) => {
  try {
    const activeCount = await PushSubscription.countDocuments({
      user: req.admin._id,
      isActive: true,
    });

    res.json({
      success: true,
      configured: isWebPushConfigured,
      publicKey: vapidPublicKey,
      activeSubscriptions: activeCount,
    });
  } catch (err) {
    next(err);
  }
};

exports.subscribe = async (req, res, next) => {
  try {
    if (!isWebPushConfigured) {
      return res.status(503).json({ success: false, message: "Push notifications are not configured" });
    }

    const parsed = subscriptionSchema.safeParse(req.body);
    if (!parsed.success) {
      console.warn("[push-subscription-validation-failed]", {
        userId: String(req.admin._id),
        issues: parsed.error.issues.map((issue) => issue.path.join(".")),
      });
      return res.status(400).json({ success: false, message: "Invalid push subscription" });
    }

    const subscription = parsed.data;
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        user: req.admin._id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userAgent: String(req.headers["user-agent"] || "").slice(0, 500),
        deviceName: subscription.deviceName || "",
        isActive: true,
        lastUsedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: "Task notifications enabled" });
  } catch (err) {
    next(err);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const endpoint = String(req.body?.endpoint || "").trim();
    if (!endpoint) return res.json({ success: true });

    await PushSubscription.updateMany(
      { user: req.admin._id, endpoint },
      { isActive: false, lastUsedAt: new Date() }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
