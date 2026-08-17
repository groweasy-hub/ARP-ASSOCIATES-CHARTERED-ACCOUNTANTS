import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { disableTaskPushNotifications } from "../services/pushNotifications";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("arp_admin_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/verify")
      .then((res) => { if (res.success) setAdmin(res.admin); else localStorage.removeItem("arp_admin_token"); })
      .catch(() => localStorage.removeItem("arp_admin_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.success) {
      localStorage.setItem("arp_admin_token", res.token);
      setAdmin(res.admin);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await disableTaskPushNotifications();
      await api.post("/auth/logout", {});
    } catch {
      // Logout should still clear local state if the server is unreachable.
    }
    localStorage.removeItem("arp_admin_token");
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
