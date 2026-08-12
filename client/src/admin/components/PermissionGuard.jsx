import { hasAnyPermission } from "../permissions";
import { useAuth } from "../context/AuthContext";

export default function PermissionGuard({ permissions = [], children, fallback = null }) {
  const { admin } = useAuth();
  return hasAnyPermission(admin, permissions) ? children : fallback;
}
