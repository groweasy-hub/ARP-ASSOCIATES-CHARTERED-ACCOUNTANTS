const express = require("express");
const router = express.Router();
const { listNotifications, markRead } = require("../controllers/notificationsController");
const { protect, hasPermission } = require("../middlewares/auth");

router.get("/", protect, hasPermission("notifications.view"), listNotifications);
router.patch("/:id/read", protect, hasPermission("notifications.view"), markRead);

module.exports = router;
