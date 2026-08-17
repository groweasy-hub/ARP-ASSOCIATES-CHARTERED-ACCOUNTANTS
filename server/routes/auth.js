const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  login,
  logout,
  resetPasswordWithOtp,
  sendProfileUpdateOtp,
  updatePassword,
  updateProfileWithOtp,
  verifyToken,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");
const { loginRateLimiter } = require("../utils/authSecurity");

router.post("/login", loginRateLimiter, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordWithOtp);
router.get("/verify", protect, verifyToken);
router.post("/logout", protect, logout);
router.patch("/password", protect, updatePassword);
router.post("/profile/otp", protect, sendProfileUpdateOtp);
router.patch("/profile", protect, updateProfileWithOtp);

module.exports = router;
