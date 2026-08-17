// Role hierarchy — higher index = higher level
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

export const isTopAdmin = (role) => ["SUPER_ADMIN", "ADMIN"].includes(role);

// Everyone has full access to everything
export const hasPermission = () => true;
export const hasAnyPermission = () => true;

// Can actor manage (edit/delete) target?
// Rule: you cannot delete/edit someone at the same or higher level than you
export const canManageUser = (actor, target) => {
  if (!actor || !target) return false;
  return roleLevel(actor.role) > roleLevel(target.role);
};

export const roleLabel = (role) =>
  ({
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
    "Senior Accountant": "Senior Accountant",
    "Accounts and Audit Executive": "Accounts and Audit Executive",
    "Paid Assistant": "Paid Assistant",
    "Article Assistant": "Article Assistant",
    Intern: "Intern",
  }[role] || role || "Employee");
