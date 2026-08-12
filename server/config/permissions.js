const PERMISSIONS = [
  "dashboard.view",
  "clients.view",
  "clients.create",
  "clients.edit",
  "clients.delete",
  "compliance.view",
  "compliance.create",
  "compliance.assign",
  "compliance.update",
  "compliance.complete",
  "notices.view",
  "notices.create",
  "notices.assign",
  "notices.update",
  "billing.view",
  "billing.create",
  "billing.edit",
  "payments.view",
  "payments.create",
  "payments.edit",
  "tasks.view",
  "tasks.create",
  "tasks.assign",
  "tasks.update",
  "tasks.complete",
  "documents.view",
  "documents.upload",
  "documents.delete",
  "team.view",
  "team.create",
  "team.edit",
  "team.disable",
  "team.delete",
  "roles.view",
  "roles.create",
  "roles.edit",
  "roles.delete",
  "reports.view",
  "settings.view",
  "settings.edit",
  "audit_logs.view",
  "notifications.view",
];

const ROLE_NAMES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  TEAM_MEMBER: "TEAM_MEMBER",
};

const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  TEAM_MEMBER: "Team Member",
};

const DEFAULT_ROLE_PERMISSIONS = {
  SUPER_ADMIN: PERMISSIONS,
  ADMIN: PERMISSIONS.filter(
    (permission) =>
      !permission.startsWith("roles.") &&
      !["settings.edit", "team.delete"].includes(permission)
  ),
  TEAM_MEMBER: [
    "dashboard.view",
    "clients.view",
    "compliance.view",
    "notices.view",
    "tasks.view",
    "tasks.update",
    "tasks.complete",
    "documents.view",
    "documents.upload",
    "notifications.view",
  ],
};

const PERMISSION_GROUPS = [
  {
    title: "Dashboard",
    permissions: [{ name: "dashboard.view", label: "View Dashboard" }],
  },
  {
    title: "Client Management",
    permissions: [
      { name: "clients.view", label: "View Clients" },
      { name: "clients.create", label: "Create Clients" },
      { name: "clients.edit", label: "Edit Clients" },
      { name: "clients.delete", label: "Delete Clients" },
    ],
  },
  {
    title: "Compliance",
    permissions: [
      { name: "compliance.view", label: "View Compliance" },
      { name: "compliance.create", label: "Create Tasks" },
      { name: "compliance.assign", label: "Assign Tasks" },
      { name: "compliance.update", label: "Update Tasks" },
      { name: "compliance.complete", label: "Complete Tasks" },
    ],
  },
  {
    title: "Notices",
    permissions: [
      { name: "notices.view", label: "View Notices" },
      { name: "notices.create", label: "Create Notices" },
      { name: "notices.assign", label: "Assign Tasks" },
      { name: "notices.update", label: "Update Notices" },
    ],
  },
  {
    title: "Billing",
    permissions: [
      { name: "billing.view", label: "View Billing" },
      { name: "billing.create", label: "Create Invoice" },
      { name: "billing.edit", label: "Edit Invoice" },
    ],
  },
  {
    title: "Payments",
    permissions: [
      { name: "payments.view", label: "View Payments" },
      { name: "payments.create", label: "Record Payments" },
      { name: "payments.edit", label: "Edit Payments" },
    ],
  },
  {
    title: "Tasks",
    permissions: [
      { name: "tasks.view", label: "View Tasks" },
      { name: "tasks.create", label: "Create Tasks" },
      { name: "tasks.assign", label: "Assign Tasks" },
      { name: "tasks.update", label: "Update Tasks" },
      { name: "tasks.complete", label: "Complete Tasks" },
    ],
  },
  {
    title: "Documents",
    permissions: [
      { name: "documents.view", label: "View Documents" },
      { name: "documents.upload", label: "Upload Documents" },
      { name: "documents.delete", label: "Delete Documents" },
    ],
  },
  {
    title: "Team Management",
    permissions: [
      { name: "team.view", label: "View Team" },
      { name: "team.create", label: "Create Team" },
      { name: "team.edit", label: "Edit Team" },
      { name: "team.disable", label: "Disable Team" },
      { name: "team.delete", label: "Delete Team" },
    ],
  },
  {
    title: "Roles & Permissions",
    permissions: [
      { name: "roles.view", label: "View Roles" },
      { name: "roles.create", label: "Create Roles" },
      { name: "roles.edit", label: "Edit Roles" },
      { name: "roles.delete", label: "Delete Roles" },
    ],
  },
  {
    title: "System",
    permissions: [
      { name: "reports.view", label: "View Reports" },
      { name: "settings.view", label: "View Settings" },
      { name: "settings.edit", label: "Edit Settings" },
      { name: "audit_logs.view", label: "View Audit Logs" },
      { name: "notifications.view", label: "View Notifications" },
    ],
  },
];

const uniq = (items) => [...new Set(items.filter(Boolean))];

const getBasePermissions = (role) => DEFAULT_ROLE_PERMISSIONS[role] || DEFAULT_ROLE_PERMISSIONS.TEAM_MEMBER;

const resolvePermissions = (user) => {
  if (!user) return [];
  if (user.role === ROLE_NAMES.SUPER_ADMIN) return PERMISSIONS;
  const customPermissions =
    user.customRole && typeof user.customRole === "object" && user.customRole.status !== "Inactive"
      ? user.customRole.permissions || []
      : [];
  return uniq([...getBasePermissions(user.role), ...customPermissions, ...(user.permissions || [])]);
};

module.exports = {
  PERMISSIONS,
  PERMISSION_GROUPS,
  ROLE_LABELS,
  ROLE_NAMES,
  DEFAULT_ROLE_PERMISSIONS,
  resolvePermissions,
};
