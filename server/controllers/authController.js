const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const { ROLE_NAMES, ROLE_LABELS, resolvePermissions } = require("../config/permissions");
const { writeAudit } = require("../utils/audit");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const publicUser = (admin) => ({
  id: admin._id,
  firstName: admin.firstName,
  lastName: admin.lastName,
  name: `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || admin.email,
  email: admin.email,
  phone: admin.phone,
  employeeId: admin.employeeId,
  department: admin.department,
  role: admin.role,
  roleLabel: ROLE_LABELS[admin.role] || admin.role,
  customRole: admin.customRole,
  permissions: resolvePermissions(admin),
  status: admin.status,
  profileImage: admin.profileImage,
  lastLogin: admin.lastLogin,
  createdAt: admin.createdAt,
});

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    let admin = await Admin.findOne({ email }).populate("customRole");

    // Auto-create admin from .env on first login
    if (!admin) {
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        admin = await Admin.create({
          email,
          password,
          firstName: "Super",
          lastName: "Admin",
          department: "Administration",
          role: ROLE_NAMES.SUPER_ADMIN,
          status: "Active",
        });
      } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    }

    if (admin.status !== "Active") {
      await writeAudit({ ...req, admin }, "LOGIN_BLOCKED", "AUTH", `Blocked login for ${admin.email}: ${admin.status}`);
      return res.status(403).json({ success: false, message: "Account is not active" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    admin.lastLogin = new Date();
    await admin.save();

    await writeAudit({ ...req, admin }, "LOGIN", "AUTH", `${admin.email} signed in`);
    const token = signToken(admin._id);
    res.json({ success: true, token, admin: publicUser(admin) });
  } catch (err) {
    next(err);
  }
};

exports.verifyToken = (req, res) => {
  res.json({ success: true, admin: publicUser(req.admin) });
};

exports.logout = async (req, res) => {
  await writeAudit(req, "LOGOUT", "AUTH", `${req.admin.email} signed out`);
  res.json({ success: true, message: "Logged out" });
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

    await writeAudit(req, "PASSWORD_CHANGED", "AUTH", `${req.admin.email} changed password`);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const admin = await Admin.findOne({ email });
    if (admin) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      admin.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      admin.passwordResetExpires = Date.now() + 15 * 60 * 1000;
      await admin.save({ validateBeforeSave: false });
      await writeAudit({ ...req, admin }, "PASSWORD_RESET_REQUESTED", "AUTH", `${admin.email} requested password reset`);
    }

    res.json({
      success: true,
      message: "If an active account exists for this email, password reset instructions will be sent.",
    });
  } catch (err) {
    next(err);
  }
};
