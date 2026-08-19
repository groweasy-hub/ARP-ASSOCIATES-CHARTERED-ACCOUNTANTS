const Notification = require("../models/Notification");

exports.listNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      isRead: false,
      $or: [{ user: req.admin._id }, { user: null }],
    }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      $or: [{ user: req.admin._id }, { user: null }],
    });
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, message: "Notification cleared" });
  } catch (err) {
    next(err);
  }
};

exports.clearAllNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({
      isRead: false,
      $or: [{ user: req.admin._id }, { user: null }],
    });
    res.json({
      success: true,
      message: "Notifications cleared",
      deletedCount: result.deletedCount || 0,
    });
  } catch (err) {
    next(err);
  }
};
