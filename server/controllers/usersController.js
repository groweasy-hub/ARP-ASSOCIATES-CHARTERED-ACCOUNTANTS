const Admin = require("../models/Admin");
const { ROLE_NAMES, ROLE_LABELS, canManageUser, isTopAdmin, roleLevel } = require("../config/permissions");
const { deleteProfileImage, isDataImage, uploadProfileImage } = require("../config/cloudinary");
const {
  PASSWORD_UPDATE_FAILURE_MESSAGE,
  REGISTRATION_FAILURE_MESSAGE,
  USER_LOOKUP_FAILURE_MESSAGE,
  adminResetPasswordSchema,
  signupSchema,
  userUpdateSchema,
  validateAuthBody,
} = require("../utils/authSecurity");

const normalizeRole = (role) => {
  if (!role) return role;
  if (Object.values(ROLE_NAMES).includes(role)) return role;
  const match = Object.entries(ROLE_LABELS).find(([, label]) => label === role);
  return match ? ROLE_NAMES[match[0]] : role;
};

const normalizeEmployeeId = (employeeId = "") => String(employeeId).trim().toUpperCase();
const isValidEmployeeId = (employeeId) => /^ARP\d{5,}$/.test(employeeId);

const generateEmployeeId = async () => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const employeeId = `ARP${Math.floor(10000 + Math.random() * 90000)}`;
    const existing = await Admin.exists({ employeeId });
    if (!existing) return employeeId;
  }
  throw Object.assign(new Error("Unable to generate a unique employee ID. Please try again."), { statusCode: 500 });
};

const serialize = (user, actor) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
  email: user.email,
  phone: user.phone,
  employeeId: user.employeeId,
  designation: user.designation,
  department: user.department,
  address: user.address,
  dateOfJoining: user.dateOfJoining,
  teamMate: user.teamMate,
  role: user.role,
  status: user.status,
  profileImage: user.profileImage,
  profileImagePublicId: user.profileImagePublicId,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  // tells the frontend whether the current actor can manage this user
  manageable: actor ? canManageUser({ role: actor.role }, { role: user.role }) : false,
});

exports.listUsers = async (req, res, next) => {
  try {
    const { search = "", role = "", status = "" } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }, { employeeId: regex }, { department: regex }];
    }
    const users = await Admin.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, users: users.map((u) => serialize(u, req.admin)) });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const validation = validateAuthBody(signupSchema, req.body, "create-user", req);
    if (!validation.ok) {
      return res.status(400).json({ success: false, message: REGISTRATION_FAILURE_MESSAGE });
    }
    const body = validation.data;
    const { email, password } = body;
    const role = normalizeRole(body.role);

    const nextRole = role || ROLE_NAMES.EMPLOYEE;
    if (roleLevel(req.admin.role) <= roleLevel(nextRole)) {
      return res.status(403).json({ success: false, message: "You can only create employees below your role level" });
    }

    const { firstName, lastName, phone, designation, department,
            address, dateOfJoining, teamMate, status } = body;
    const requestedEmployeeId = normalizeEmployeeId(body.employeeId);
    const employeeId = requestedEmployeeId || await generateEmployeeId();
    if (!isValidEmployeeId(employeeId)) {
      return res.status(400).json({ success: false, message: REGISTRATION_FAILURE_MESSAGE });
    }
    const duplicateEmployeeId = await Admin.exists({ employeeId });
    if (duplicateEmployeeId) {
      return res.status(409).json({ success: false, message: REGISTRATION_FAILURE_MESSAGE });
    }

    let profileImage = body.profileImage;
    let profileImagePublicId = "";
    if (isDataImage(profileImage)) {
      const uploaded = await uploadProfileImage(profileImage);
      profileImage = uploaded.secure_url;
      profileImagePublicId = uploaded.public_id;
    }

    const user = await Admin.create({
      firstName, lastName, email, password,
      phone, employeeId, designation, department,
      address, dateOfJoining, teamMate,
      role: nextRole,
      status: status || "Active",
      profileImage,
      profileImagePublicId,
    });

    res.status(201).json({ success: true, user: serialize(user, req.admin) });
  } catch (err) {
    if (err.code === 11000) err.message = REGISTRATION_FAILURE_MESSAGE;
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: USER_LOOKUP_FAILURE_MESSAGE });
    res.json({ success: true, user: serialize(user, req.admin), assignedClients: [], assignedTasks: [], activity: [] });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const validation = validateAuthBody(userUpdateSchema, req.body, "update-user", req);
    if (!validation.ok) {
      return res.status(400).json({ success: false, message: REGISTRATION_FAILURE_MESSAGE });
    }
    const body = validation.data;
    const user = await Admin.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: USER_LOOKUP_FAILURE_MESSAGE });

    const isSelf = String(user._id) === String(req.admin._id);
    const canEditOwnProfile = isSelf && isTopAdmin(req.admin.role);
    const canManageTarget = canManageUser({ role: req.admin.role }, { role: user.role });

    if (!canManageTarget && !canEditOwnProfile) {
      return res.status(403).json({ success: false, message: "You cannot edit a user at the same or higher level than you" });
    }

    // Prevent escalating role above actor's own level
    if (body.role) body.role = normalizeRole(body.role);
    if (body.role && roleLevel(req.admin.role) <= roleLevel(body.role)) {
      return res.status(403).json({ success: false, message: "You can only assign roles below your role level" });
    }

    const profileFields = ["firstName", "lastName", "phone", "employeeId", "designation",
                       "department", "address", "dateOfJoining", "teamMate", "profileImage"];
    const managementFields = ["role", "status"];
    const updatable = canEditOwnProfile && !canManageTarget
      ? profileFields
      : [...profileFields, ...managementFields];

    if (body.employeeId !== undefined) {
      const employeeId = normalizeEmployeeId(body.employeeId);
      if (employeeId && !isValidEmployeeId(employeeId)) {
        return res.status(400).json({ success: false, message: REGISTRATION_FAILURE_MESSAGE });
      }
      if (employeeId) {
        const duplicateEmployeeId = await Admin.exists({ employeeId, _id: { $ne: user._id } });
        if (duplicateEmployeeId) {
          return res.status(409).json({ success: false, message: REGISTRATION_FAILURE_MESSAGE });
        }
      }
      body.employeeId = employeeId;
    }

    let previousProfileImagePublicId = "";
    if (body.profileImage !== undefined && isDataImage(body.profileImage)) {
      previousProfileImagePublicId = user.profileImagePublicId;
      const uploaded = await uploadProfileImage(body.profileImage);
      body.profileImage = uploaded.secure_url;
      user.profileImagePublicId = uploaded.public_id;
    }

    updatable.forEach((field) => { if (body[field] !== undefined) user[field] = body[field]; });

    await user.save();
    if (previousProfileImagePublicId) await deleteProfileImage(previousProfileImagePublicId);
    res.json({ success: true, user: serialize(user, req.admin) });
  } catch (err) {
    if (err.code === 11000) err.message = REGISTRATION_FAILURE_MESSAGE;
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: PASSWORD_UPDATE_FAILURE_MESSAGE });
    if (!canManageUser({ role: req.admin.role }, { role: user.role })) {
      return res.status(403).json({ success: false, message: "You cannot reset password for a user at the same or higher level" });
    }
    const validation = validateAuthBody(adminResetPasswordSchema, req.body, "admin-reset-password", req);
    if (!validation.ok) return res.status(400).json({ success: false, message: PASSWORD_UPDATE_FAILURE_MESSAGE });
    const { password } = validation.data;
    user.password = password;
    await user.save();
    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.admin.role !== ROLE_NAMES.SUPER_ADMIN) {
      return res.status(403).json({ success: false, message: "Only Super Admin can delete employees" });
    }
    const user = await Admin.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: USER_LOOKUP_FAILURE_MESSAGE });
    if (String(user._id) === String(req.admin._id)) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account" });
    }
    if (!canManageUser({ role: req.admin.role }, { role: user.role })) {
      return res.status(403).json({ success: false, message: "You cannot delete a user at the same or higher level than you" });
    }
    if (user.profileImagePublicId) await deleteProfileImage(user.profileImagePublicId);
    await user.deleteOne();
    res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
};
