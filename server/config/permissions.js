const ROLE_NAMES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  SENIOR_ACCOUNTANT: "SENIOR_ACCOUNTANT",
  ACCOUNTS_AND_AUDIT_EXECUTIVE: "ACCOUNTS_AND_AUDIT_EXECUTIVE",
  ACCOUNTANT: "ACCOUNTANT",
  EMPLOYEE: "EMPLOYEE",
  PAID_ASSISTANT: "PAID_ASSISTANT",
  ARTICLE_ASSISTANT: "ARTICLE_ASSISTANT",
  INTERN: "INTERN",
};

const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  SENIOR_ACCOUNTANT: "Senior Accountant",
  ACCOUNTS_AND_AUDIT_EXECUTIVE: "Accounts and Audit Executive",
  ACCOUNTANT: "Accountant",
  EMPLOYEE: "Employee",
  PAID_ASSISTANT: "Paid Assistant",
  ARTICLE_ASSISTANT: "Article Assistant",
  INTERN: "Intern",
};

// Higher index = higher level. Cannot delete/edit same or higher level.
const ROLE_HIERARCHY = [
  "INTERN",
  "ARTICLE_ASSISTANT",
  "PAID_ASSISTANT",
  "EMPLOYEE",
  "ACCOUNTS_AND_AUDIT_EXECUTIVE",
  "ACCOUNTANT",
  "SENIOR_ACCOUNTANT",
  "MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
];

const roleLevel = (role) => {
  const idx = ROLE_HIERARCHY.indexOf(role);
  return idx === -1 ? 0 : idx;
};

const isTopAdmin = (role) => [ROLE_NAMES.SUPER_ADMIN, ROLE_NAMES.ADMIN].includes(role);

const canManageUser = (actor, target) => {
  if (!actor || !target) return false;
  return roleLevel(actor.role) > roleLevel(target.role);
};

// Everyone gets full access — no permission restrictions
const resolvePermissions = () => ["*"];

module.exports = {
  ROLE_NAMES,
  ROLE_LABELS,
  ROLE_HIERARCHY,
  roleLevel,
  isTopAdmin,
  canManageUser,
  resolvePermissions,
};
