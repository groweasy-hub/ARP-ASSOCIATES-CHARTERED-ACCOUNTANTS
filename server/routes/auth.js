const express = require("express");
const router = express.Router();
const { forgotPassword, login, logout, updatePassword, verifyToken } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/verify", protect, verifyToken);
router.post("/logout", protect, logout);
router.patch("/password", protect, updatePassword);

module.exports = router;
