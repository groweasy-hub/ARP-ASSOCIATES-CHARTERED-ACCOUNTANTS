import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasAnyPermission } from "../permissions";

export default function ProtectedRoute({ children, permissions = [] }) {
  const { admin, loading } = useAuth();
  if (loading) return null;
  if (!admin) return <Navigate to="/admin/login" replace />;
  if (!hasAnyPermission(admin, permissions)) return <Navigate to="/admin/unauthorized" replace />;
  return children;
}
