const Admin = require("../models/Admin");
const Role = require("../models/Role");
const { ROLE_NAMES, ROLE_LABELS, resolvePermissions } = require("../config/permissions");
const { writeAudit } = require("../utils/audit");

const canManageTarget = (actor, target) => {
  if (!target) return true;
  if (actor.role === ROLE_NAMES.SUPER_ADMIN) return true;
  return target.role !== ROLE_NAMES.SUPER_ADMIN;
};

const serialize = (user, actor) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
  email: user.email,
  phone: user.phone,
  employeeId: user.employeeId,
  department: user.department,
  role: user.role,
  roleLabel: ROLE_LABELS[user.role] || user.role,
  customRole: user.customRole,
  permissions: resolvePermissions(user),
  status: user.status,
  profileImage: user.profileImage,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  protected: user.role === ROLE_NAMES.SUPER_ADMIN && actor?.role !== ROLE_NAMES.SUPER_ADMIN,
});

const sanitizeRoleInput = async (actor, body) => {
  if (body.role === ROLE_NAMES.SUPER_ADMIN && actor.role !== ROLE_NAMES.SUPER_ADMIN) {
    const error = new Error("Only Super Admin can create or assign Super Admin accounts");
    error.statusCode = 403;
    throw error;
  }

  let customRole = body.customRole || null;
  let role = body.role || ROLE_NAMES.TEAM_MEMBER;
  if (customRole) {
    const roleDoc = await Role.findById(customRole);
    if (!roleDoc || roleDoc.status !== "Active") {
      const error = new Error("Selected custom role is unavailable");
      error.statusCode = 400;
      throw error;
    }
    role = roleDoc.baseRole || ROLE_NAMES.TEAM_MEMBER;
  }
  return { role, customRole };
};

exports.listUsers = async (req, res, next) => {
  try {
    const { search = "", role = "", status = "" } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }, { department: regex }];
    }

    const users = await Admin.find(filter).populate("customRole").sort({ createdAt: -1 });
    res.json({ success: true, users: users.map((user) => serialize(user, req.admin)) });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, department, phone, employeeId, status, profileImage, permissions = [] } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

    const { role, customRole } = await sanitizeRoleInput(req.admin, req.body);
    const user = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      department,
      phone,
      employeeId,
      role,
      customRole,
      status: status || "Active",
      profileImage,
      permissions,
    });

    await writeAudit(req, "USER_CREATED", "TEAM", `${req.admin.email} created ${user.email}`);
    res.status(201).json({ success: true, user: serialize(await user.populate("customRole"), req.admin) });
  } catch (err) {
    if (err.code === 11000) err.message = "A user with this email already exists";
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.params.id).populate("customRole");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({
      success: true,
      user: serialize(user, req.admin),
      assignedClients: [],
      assignedTasks: [],
      activity: [],
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.params.id).populate("customRole");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!canManageTarget(req.admin, user)) {
      return res.status(403).json({ success: false, message: "Admin users cannot manage Super Admin accounts" });
    }

    const protectedFields = ["password", "passwordResetToken", "passwordResetExpires"];
    protectedFields.forEach((field) => delete req.body[field]);

    if (req.body.role || req.body.customRole !== undefined) {
      const roleInfo = await sanitizeRoleInput(req.admin, req.body);
      user.role = roleInfo.role;
      user.customRole = roleInfo.customRole;
    }

    ["firstName", "lastName", "phone", "employeeId", "department", "status", "profileImage", "permissions"].forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    await user.save();
    await writeAudit(req, "USER_UPDATED", "TEAM", `${req.admin.email} updated ${user.email}`);
    res.json({ success: true, user: serialize(await user.populate("customRole"), req.admin) });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!canManageTarget(req.admin, user)) {
      return res.status(403).json({ success: false, message: "Admin users cannot reset Super Admin passwords" });
    }

    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    user.password = password;
    await user.save();
    await writeAudit(req, "PASSWORD_RESET", "TEAM", `${req.admin.email} reset password for ${user.email}`);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (String(user._id) === String(req.admin._id)) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account" });
    }
    if (!canManageTarget(req.admin, user)) {
      return res.status(403).json({ success: false, message: "Admin users cannot delete Super Admin accounts" });
    }

    await user.deleteOne();
    await writeAudit(req, "USER_DELETED", "TEAM", `${req.admin.email} deleted ${user.email}`);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
