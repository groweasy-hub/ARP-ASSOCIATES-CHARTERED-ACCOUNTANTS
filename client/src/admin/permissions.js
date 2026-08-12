export const hasPermission = (user, permission) =>
  Boolean(user?.role === "SUPER_ADMIN" || user?.permissions?.includes(permission));

export const hasAnyPermission = (user, permissions = []) =>
  permissions.length === 0 || permissions.some((permission) => hasPermission(user, permission));

export const canManageUser = (actor, target) => {
  if (!actor || !target) return false;
  if (actor.role === "SUPER_ADMIN") return true;
  return target.role !== "SUPER_ADMIN";
};

export const roleLabel = (role) =>
  ({
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    TEAM_MEMBER: "Team Member",
  }[role] || role || "Team Member");
