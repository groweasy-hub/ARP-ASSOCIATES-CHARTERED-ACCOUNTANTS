const Role = require("../models/Role");
const Admin = require("../models/Admin");
const { PERMISSION_GROUPS, ROLE_NAMES, DEFAULT_ROLE_PERMISSIONS } = require("../config/permissions");
const { writeAudit } = require("../utils/audit");

exports.listRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().sort({ type: -1, name: 1 }).lean();
    const counts = await Admin.aggregate([{ $group: { _id: "$customRole", count: { $sum: 1 } } }]);
    const countMap = new Map(counts.map((item) => [String(item._id), item.count]));

    const systemRoles = [
      {
        id: ROLE_NAMES.SUPER_ADMIN,
        name: "Super Admin",
        description: "Full system access",
        type: "SYSTEM",
        status: "Active",
        permissions: DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN,
        members: await Admin.countDocuments({ role: ROLE_NAMES.SUPER_ADMIN }),
      },
      {
        id: ROLE_NAMES.ADMIN,
        name: "Admin",
        description: "Operational access",
        type: "SYSTEM",
        status: "Active",
        permissions: DEFAULT_ROLE_PERMISSIONS.ADMIN,
        members: await Admin.countDocuments({ role: ROLE_NAMES.ADMIN, customRole: null }),
      },
      {
        id: ROLE_NAMES.TEAM_MEMBER,
        name: "Team Member",
        description: "Default team access",
        type: "SYSTEM",
        status: "Active",
        permissions: DEFAULT_ROLE_PERMISSIONS.TEAM_MEMBER,
        members: await Admin.countDocuments({ role: ROLE_NAMES.TEAM_MEMBER, customRole: null }),
      },
    ];

    res.json({
      success: true,
      permissionGroups: PERMISSION_GROUPS,
      roles: [
        ...systemRoles,
        ...roles.map((role) => ({ ...role, id: role._id, members: countMap.get(String(role._id)) || 0 })),
      ],
    });
  } catch (err) {
    next(err);
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const { name, description, permissions = [], baseRole = ROLE_NAMES.TEAM_MEMBER, status = "Active" } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Role name is required" });

    const role = await Role.create({ name, description, permissions, baseRole, status, type: "CUSTOM" });
    await writeAudit(req, "ROLE_CREATED", "ROLES", `${req.admin.email} created role ${role.name}`);
    res.status(201).json({ success: true, role });
  } catch (err) {
    if (err.code === 11000) err.message = "A role with this name already exists";
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    if (role.type === "SYSTEM") return res.status(400).json({ success: false, message: "System roles cannot be edited" });

    ["name", "description", "permissions", "baseRole", "status"].forEach((field) => {
      if (req.body[field] !== undefined) role[field] = req.body[field];
    });
    await role.save();
    await writeAudit(req, "ROLE_UPDATED", "ROLES", `${req.admin.email} updated role ${role.name}`);
    res.json({ success: true, role });
  } catch (err) {
    next(err);
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    if (role.type === "SYSTEM") return res.status(400).json({ success: false, message: "System roles cannot be deleted" });
    const members = await Admin.countDocuments({ customRole: role._id });
    if (members) return res.status(400).json({ success: false, message: "Move members before deleting this role" });

    await role.deleteOne();
    await writeAudit(req, "ROLE_DELETED", "ROLES", `${req.admin.email} deleted role ${role.name}`);
    res.json({ success: true, message: "Role deleted" });
  } catch (err) {
    next(err);
  }
};
