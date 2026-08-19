const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../models/Admin");
require("../models/Role");
const { ROLE_NAMES, ROLE_LABELS, resolvePermissions } = require("../config/permissions");
const { writeAudit } = require("../utils/audit");
const { sendOtpEmail, sendSecurityAlertEmail, isEmailConfigured } = require("../config/email");
const { deleteProfileImage, isDataImage, uploadProfileImage } = require("../config/cloudinary");
const {
  LOGIN_FAILURE_MESSAGE,
  PASSWORD_RESET_RESPONSE,
  PASSWORD_UPDATE_FAILURE_MESSAGE,
  PROFILE_UPDATE_FAILURE_MESSAGE,
  clearLoginFailures,
  constantTimeEqual,
  forgotPasswordSchema,
  getLoginState,
  loginSchema,
  passwordChangeSchema,
  passwordResetSchema,
  profileUpdateSchema,
  registerLoginFailure,
  validateAuthBody,
  verifyAndMigratePassword,
  wait,
} = require("../utils/authSecurity");

const MOBILE_SESSION_EXPIRES_IN = "45d";

const isMobileRequest = (req) => {
  const userAgent = String(req.headers["user-agent"] || "");
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
};

const signToken = (id, req) => {
  const expiresIn = isMobileRequest(req)
    ? MOBILE_SESSION_EXPIRES_IN
    : process.env.JWT_EXPIRES_IN || "1d";
  return {
    token: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn }),
    expiresIn,
  };
};

const publicUser = (admin) => ({
  id: admin._id,
  firstName: admin.firstName,
  lastName: admin.lastName,
  name: `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || admin.email,
  email: admin.email,
  phone: admin.phone,
  employeeId: admin.employeeId,
  designation: admin.designation,
  department: admin.department,
  address: admin.address,
  dateOfJoining: admin.dateOfJoining,
  role: admin.role,
  roleLabel: ROLE_LABELS[admin.role] || admin.role,
  customRole: admin.customRole,
  permissions: resolvePermissions(admin),
  status: admin.status,
  profileImage: admin.profileImage,
  profileImagePublicId: admin.profileImagePublicId,
  mustChangePassword: admin.mustChangePassword,
  lastLogin: admin.lastLogin,
  createdAt: admin.createdAt,
});

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const normalizeEmployeeId = (employeeId = "") => String(employeeId).trim().toUpperCase();
const makeOtp = () => String(crypto.randomInt(100000, 1000000));
const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");
const fullName = (admin) => `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || admin.email;

const saveOtp = async (admin, purpose) => {
  const otp = makeOtp();
  admin.otpHash = hashOtp(otp);
  admin.otpPurpose = purpose;
  admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await admin.save({ validateBeforeSave: false });
  return otp;
};

const validateOtp = (admin, otp, purpose) => {
  if (!otp) return "OTP is required";
  if (!admin.otpHash || admin.otpPurpose !== purpose || !admin.otpExpires) return "Please request a new OTP";
  if (admin.otpExpires.getTime() < Date.now()) return "OTP expired. Please request a new OTP";
  if (admin.otpHash !== hashOtp(otp)) return "OTP verification failed";
  return "";
};

const clearOtp = (admin) => {
  admin.otpHash = undefined;
  admin.otpPurpose = undefined;
  admin.otpExpires = undefined;
};

const buildResetLink = (admin) => {
  const baseUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/login?reset=1&email=${encodeURIComponent(admin.email)}`;
};

const sendLockoutNotification = async (admin) => {
  if (!admin || !isEmailConfigured()) return;
  try {
    await sendSecurityAlertEmail({
      to: admin.email,
      name: fullName(admin),
      resetLink: buildResetLink(admin),
    });
  } catch (error) {
    console.warn("[auth-lockout-email-failed]", { adminId: String(admin._id), code: error.code });
  }
};

const failLogin = async (res, identifier, admin = null) => {
  const failure = registerLoginFailure(identifier);
  if (failure.locked) await sendLockoutNotification(admin);
  if (failure.delayMs) await wait(failure.delayMs);
  return res.status(401).json({ success: false, message: LOGIN_FAILURE_MESSAGE });
};

exports.login = async (req, res, next) => {
  try {
    const validation = validateAuthBody(loginSchema, req.body, "login", req);
    if (!validation.ok) {
      return res.status(400).json({ success: false, message: LOGIN_FAILURE_MESSAGE });
    }

    const identifier = validation.data.email;
    const email = normalizeEmail(identifier);
    const employeeId = normalizeEmployeeId(identifier);
    const { password } = validation.data;

    const loginState = getLoginState(identifier);
    if (loginState.blocked) {
      if (loginState.delayMs) await wait(Math.min(loginState.delayMs, 10000));
      return res.status(401).json({ success: false, message: LOGIN_FAILURE_MESSAGE });
    }

    let admin = await Admin.findOne({
      $or: [{ email }, { employeeId }],
    }).populate("customRole");

    const bootstrapAccounts = [
      {
        email: process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD,
        firstName: process.env.SUPER_ADMIN_FIRST_NAME || "Super",
        lastName: process.env.SUPER_ADMIN_LAST_NAME || "Admin",
        role: ROLE_NAMES.SUPER_ADMIN,
      },
      {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        firstName: process.env.ADMIN_FIRST_NAME || "Admin",
        lastName: process.env.ADMIN_LAST_NAME || "User",
        role: ROLE_NAMES.ADMIN,
      },
      {
        email: process.env.MANAGER_EMAIL,
        password: process.env.MANAGER_PASSWORD,
        firstName: process.env.MANAGER_FIRST_NAME || "Manager",
        lastName: process.env.MANAGER_LAST_NAME || "User",
        role: ROLE_NAMES.MANAGER,
      },
      {
        email: process.env.ACCOUNTANT_EMAIL,
        password: process.env.ACCOUNTANT_PASSWORD,
        firstName: process.env.ACCOUNTANT_FIRST_NAME || "Accountant",
        lastName: process.env.ACCOUNTANT_LAST_NAME || "User",
        role: ROLE_NAMES.ACCOUNTANT,
      },
      {
        email: process.env.EMPLOYEE_EMAIL,
        password: process.env.EMPLOYEE_PASSWORD,
        firstName: process.env.EMPLOYEE_FIRST_NAME || "Employee",
        lastName: process.env.EMPLOYEE_LAST_NAME || "User",
        role: ROLE_NAMES.EMPLOYEE,
      },
    ].filter((account) => account.email && account.password);

    // Auto-create configured portal accounts from .env on first login.
    if (!admin) {
      const bootstrapAccount = bootstrapAccounts.find(
        (account) => email === account.email.toLowerCase() && constantTimeEqual(password, account.password)
      );
      if (bootstrapAccount) {
        admin = await Admin.create({
          email: bootstrapAccount.email,
          password,
          firstName: bootstrapAccount.firstName,
          lastName: bootstrapAccount.lastName,
          department: "Administration",
          role: bootstrapAccount.role,
          status: "Active",
        });
      } else {
        return failLogin(res, identifier);
      }
    }

    if (admin.status !== "Active") {
      await writeAudit({ ...req, admin }, "LOGIN_BLOCKED", "AUTH", `Blocked login for ${admin.email}: ${admin.status}`);
      return failLogin(res, identifier, admin);
    }

    const isMatch = await verifyAndMigratePassword(admin, password);
    if (!isMatch) return failLogin(res, identifier, admin);

    clearLoginFailures(identifier);
    admin.lastLogin = new Date();
    await admin.save();

    await writeAudit({ ...req, admin }, "LOGIN", "AUTH", `${admin.email} signed in`);
    const session = signToken(admin._id, req);
    res.json({ success: true, token: session.token, expiresIn: session.expiresIn, admin: publicUser(admin) });
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
    const validation = validateAuthBody(passwordChangeSchema, req.body, "password-change", req);
    if (!validation.ok) {
      return res.status(400).json({ success: false, message: PASSWORD_UPDATE_FAILURE_MESSAGE });
    }
    const { currentPassword, newPassword, confirmPassword } = validation.data;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_UPDATE_FAILURE_MESSAGE,
      });
    }

    const isCurrentPasswordValid = await verifyAndMigratePassword(req.admin, currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: PASSWORD_UPDATE_FAILURE_MESSAGE,
      });
    }

    const isSamePassword = await verifyAndMigratePassword(req.admin, newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_UPDATE_FAILURE_MESSAGE,
      });
    }

    req.admin.password = newPassword;
    req.admin.mustChangePassword = false;
    await req.admin.save();

    await writeAudit(req, "PASSWORD_CHANGED", "AUTH", `${req.admin.email} changed password`);
    res.json({ success: true, message: "Password updated successfully", admin: publicUser(req.admin) });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const validation = validateAuthBody(forgotPasswordSchema, req.body, "forgot-password", req);
    if (!validation.ok) {
      return res.json({ success: true, message: PASSWORD_RESET_RESPONSE });
    }
    const email = normalizeEmail(validation.data.email);

    const admin = await Admin.findOne({ email });
    if (admin) {
      if (!isEmailConfigured()) {
        return res.status(503).json({ success: false, message: "Email service is not configured yet" });
      }
      const otp = await saveOtp(admin, "forgot-password");
      await sendOtpEmail({
        to: admin.email,
        name: fullName(admin),
        otp,
        purpose: "forgot password reset",
      });
      await writeAudit({ ...req, admin }, "PASSWORD_RESET_OTP_SENT", "AUTH", `${admin.email} requested password reset OTP`);
    }

    res.json({
      success: true,
      message: PASSWORD_RESET_RESPONSE,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPasswordWithOtp = async (req, res, next) => {
  try {
    const validation = validateAuthBody(passwordResetSchema, req.body, "password-reset", req);
    if (!validation.ok) {
      return res.status(400).json({ success: false, message: PASSWORD_UPDATE_FAILURE_MESSAGE });
    }
    const email = normalizeEmail(validation.data.email);
    const newEmail = normalizeEmail(validation.data.newEmail);
    const { otp, password, confirmPassword } = validation.data;

    if (password !== confirmPassword) return res.status(400).json({ success: false, message: PASSWORD_UPDATE_FAILURE_MESSAGE });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ success: false, message: PASSWORD_UPDATE_FAILURE_MESSAGE });

    const otpError = validateOtp(admin, otp, "forgot-password");
    if (otpError) return res.status(400).json({ success: false, message: PASSWORD_UPDATE_FAILURE_MESSAGE });

    if (newEmail && newEmail !== admin.email) {
      const existing = await Admin.findOne({ email: newEmail, _id: { $ne: admin._id } });
      if (existing) return res.status(409).json({ success: false, message: PASSWORD_UPDATE_FAILURE_MESSAGE });
      admin.email = newEmail;
    }

    admin.password = password;
    admin.mustChangePassword = false;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    clearOtp(admin);
    await admin.save();

    await writeAudit({ ...req, admin }, "PASSWORD_RESET_COMPLETED", "AUTH", `${admin.email} reset password with OTP`);
    res.json({ success: true, message: "Password updated successfully. Please sign in again." });
  } catch (err) {
    if (err.code === 11000) err.message = PASSWORD_UPDATE_FAILURE_MESSAGE;
    next(err);
  }
};

exports.sendProfileUpdateOtp = async (req, res, next) => {
  try {
    if (!isEmailConfigured()) {
      return res.status(503).json({ success: false, message: "Email service is not configured yet" });
    }

    const otp = await saveOtp(req.admin, "profile-update");
    await sendOtpEmail({
      to: req.admin.email,
      name: fullName(req.admin),
      otp,
      purpose: "profile, email, phone, image, or password update",
    });
    await writeAudit(req, "PROFILE_UPDATE_OTP_SENT", "AUTH", `${req.admin.email} requested profile update OTP`);
    res.json({ success: true, message: `OTP sent to ${req.admin.email}` });
  } catch (err) {
    next(err);
  }
};

exports.updateProfileWithOtp = async (req, res, next) => {
  try {
    const validation = validateAuthBody(profileUpdateSchema, req.body, "profile-update", req);
    if (!validation.ok) {
      return res.status(400).json({ success: false, message: PROFILE_UPDATE_FAILURE_MESSAGE });
    }
    const { otp, phone, profileImage, password, confirmPassword } = validation.data;
    const email = normalizeEmail(validation.data.email);
    const otpError = validateOtp(req.admin, otp, "profile-update");
    if (otpError) return res.status(400).json({ success: false, message: PROFILE_UPDATE_FAILURE_MESSAGE });

    if (email && email !== req.admin.email) {
      const existing = await Admin.findOne({ email, _id: { $ne: req.admin._id } });
      if (existing) return res.status(409).json({ success: false, message: PROFILE_UPDATE_FAILURE_MESSAGE });
      req.admin.email = email;
    }

    if (phone !== undefined) req.admin.phone = phone;
    let previousProfileImagePublicId = "";
    if (profileImage !== undefined) {
      if (isDataImage(profileImage)) {
        previousProfileImagePublicId = req.admin.profileImagePublicId;
        const uploaded = await uploadProfileImage(profileImage);
        req.admin.profileImage = uploaded.secure_url;
        req.admin.profileImagePublicId = uploaded.public_id;
      } else {
        req.admin.profileImage = profileImage;
      }
    }

    if (password || confirmPassword) {
      if (!password || !confirmPassword) {
        return res.status(400).json({ success: false, message: PROFILE_UPDATE_FAILURE_MESSAGE });
      }
      if (password.length < 8) return res.status(400).json({ success: false, message: PROFILE_UPDATE_FAILURE_MESSAGE });
      if (password !== confirmPassword) return res.status(400).json({ success: false, message: PROFILE_UPDATE_FAILURE_MESSAGE });
      req.admin.password = password;
      req.admin.mustChangePassword = false;
    }

    clearOtp(req.admin);
    await req.admin.save();
    if (previousProfileImagePublicId) await deleteProfileImage(previousProfileImagePublicId);
    await writeAudit(req, "PROFILE_UPDATED", "AUTH", `${req.admin.email} updated profile with OTP`);
    res.json({ success: true, message: "Profile updated successfully", admin: publicUser(req.admin) });
  } catch (err) {
    if (err.code === 11000) err.message = PROFILE_UPDATE_FAILURE_MESSAGE;
    next(err);
  }
};
