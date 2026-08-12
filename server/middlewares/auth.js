const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Role = require("../models/Role");
const { ROLE_NAMES, resolvePermissions } = require("../config/permissions");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).populate("customRole");
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin account not found" });
    }
    if (admin.status !== "Active") {
      return res.status(403).json({ success: false, message: "Account is not active" });
    }
    admin.effectivePermissions = resolvePermissions(admin);
    req.admin = admin;
    next();
  } catch (err) {
    next(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"
      ? Object.assign(new Error("Token invalid or expired"), { statusCode: 401 })
      : err);
  }
};

const hasPermission = (...permissions) => (req, res, next) => {
  if (req.admin?.role === ROLE_NAMES.SUPER_ADMIN) return next();
  const allowed = permissions.some((permission) => req.admin?.effectivePermissions?.includes(permission));
  if (!allowed) {
    return res.status(403).json({ success: false, message: "You don't have permission to perform this action" });
  }
  next();
};

const ensureRoles = async () => {
  const systemRoles = [
    { name: "Admin", type: "SYSTEM", baseRole: ROLE_NAMES.ADMIN },
    { name: "Team Member", type: "SYSTEM", baseRole: ROLE_NAMES.TEAM_MEMBER },
    { name: "GST Executive", type: "CUSTOM", baseRole: ROLE_NAMES.TEAM_MEMBER },
    { name: "Income Tax Executive", type: "CUSTOM", baseRole: ROLE_NAMES.TEAM_MEMBER },
    { name: "TDS Executive", type: "CUSTOM", baseRole: ROLE_NAMES.TEAM_MEMBER },
    { name: "ROC / MCA Executive", type: "CUSTOM", baseRole: ROLE_NAMES.TEAM_MEMBER },
    { name: "Notice Executive", type: "CUSTOM", baseRole: ROLE_NAMES.TEAM_MEMBER },
    { name: "Billing Executive", type: "CUSTOM", baseRole: ROLE_NAMES.TEAM_MEMBER },
    { name: "Accountant", type: "CUSTOM", baseRole: ROLE_NAMES.TEAM_MEMBER },
    { name: "Senior Accountant", type: "CUSTOM", baseRole: ROLE_NAMES.TEAM_MEMBER },
  ];

  await Promise.all(
    systemRoles.map((role) =>
      Role.updateOne({ name: role.name }, { $setOnInsert: role }, { upsert: true })
    )
  );
};

module.exports = { protect, hasPermission, ensureRoles };
