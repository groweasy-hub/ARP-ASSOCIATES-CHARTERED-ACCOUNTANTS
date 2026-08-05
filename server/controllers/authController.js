const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    let admin = await Admin.findOne({ email });

    // Auto-create admin from .env on first login
    if (!admin) {
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        admin = await Admin.create({ email, password });
      } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(admin._id);
    res.json({ success: true, token, admin: { email: admin.email } });
  } catch (err) {
    next(err);
  }
};

exports.verifyToken = (req, res) => {
  res.json({ success: true, admin: { email: req.admin.email } });
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password, new password, and confirmation are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation do not match",
      });
    }

    const isCurrentPasswordValid = await req.admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await req.admin.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    req.admin.password = newPassword;
    await req.admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
