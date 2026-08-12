import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../context/AuthContext";
import { hasAnyPermission, roleLabel } from "../permissions";

const fadeIn = keyframes`from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}`;

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f0f4f8;
  font-family: Inter, "Segoe UI", sans-serif;
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 260px;
  background: #0d2244;
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: transform 300ms cubic-bezier(0.22,1,0.36,1);

  @media (max-width: 900px) {
    transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(-100%)")};
  }
`;

const SidebarLogo = styled.div`
  padding: 28px 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);

  h1 { margin: 0; color: #fff; font-size: 1.1rem; font-weight: 700; letter-spacing: -0.02em; }
  span { color: rgba(255,255,255,0.45); font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 200ms;
  animation: ${fadeIn} 0.3s ease both;

  &:hover { background: rgba(255,255,255,0.08); color: #fff; }
  &.active { background: linear-gradient(135deg,#2c649c,#0254a0); color: #fff; box-shadow: 0 4px 16px rgba(2,84,160,0.35); }

  svg { width: 18px; height: 18px; flex-shrink: 0; }
`;

const SidebarFooter = styled.div`
  padding: 16px 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  font-family: inherit;
  &:hover { background: rgba(255,255,255,0.08); color: #fff; }
`;

const Main = styled.div`
  margin-left: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: 900px) { margin-left: 0; }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 28px;
  height: 64px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(13,34,68,0.08);
  box-shadow: 0 2px 8px rgba(11,31,60,0.06);
`;

const MenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #0d2244;
  @media (max-width: 900px) { display: flex; align-items: center; }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  color: #0d2244;
  font-size: 1rem;
  font-weight: 600;
`;

const AdminInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: #33425e;

  span { font-weight: 600; color: #0d2244; }
`;

const NotificationBtn = styled(NavLink)`
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #0d2244;
  background: #f6fbff;
  border: 1px solid rgba(13,34,68,0.08);
  text-decoration: none;
  svg { width: 18px; height: 18px; }
`;

const Avatar = styled.div`
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg,#2c649c,#0254a0);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 0.875rem; font-weight: 700;
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed; inset: 0; background: rgba(11,31,60,0.5); z-index: 199;
  }
`;

const Content = styled.main`padding: 28px;`;

const navLinks = [
  { to: "/admin/dashboard", label: "Dashboard", permissions: ["dashboard.view"], icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { to: "/admin/leads", label: "Client Management", permissions: ["clients.view"], icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to: "/admin/messages", label: "Messages", permissions: ["clients.view"], icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { to: "/admin/team", label: "Team Management", permissions: ["team.view"], icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to: "/admin/roles", label: "Roles & Permissions", permissions: ["roles.view"], icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-5"/></svg> },
  { to: "/admin/audit-logs", label: "Audit Logs", permissions: ["audit_logs.view"], icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg> },
  { to: "/admin/settings", label: "Settings", permissions: ["settings.view"], icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.2.36.3.75.3 1.15V10.3A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/></svg> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <Shell>
      <Overlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <Sidebar $open={sidebarOpen}>
        <SidebarLogo>
          <h1>ARP Associates</h1>
          <span>Admin Panel</span>
        </SidebarLogo>
        <Nav>
          {navLinks.filter((l) => hasAnyPermission(admin, l.permissions)).map((l) => (
            <NavItem key={l.to} to={l.to} onClick={() => setSidebarOpen(false)}>
              {l.icon}{l.label}
            </NavItem>
          ))}
        </Nav>
        <SidebarFooter>
          <LogoutBtn onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </LogoutBtn>
        </SidebarFooter>
      </Sidebar>

      <Main>
        <Header>
          <MenuBtn onClick={() => setSidebarOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </MenuBtn>
          <HeaderTitle>Admin Dashboard</HeaderTitle>
          <AdminInfo>
            {hasAnyPermission(admin, ["notifications.view"]) && (
              <NotificationBtn to="/admin/notifications" title="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </NotificationBtn>
            )}
            <Avatar>{admin?.name?.[0]?.toUpperCase() || admin?.email?.[0]?.toUpperCase() || "A"}</Avatar>
            <div>
              <span>{admin?.name || admin?.email || "Admin"}</span>
              <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>{roleLabel(admin?.role)}</div>
            </div>
          </AdminInfo>
        </Header>
        <Content><Outlet /></Content>
      </Main>
    </Shell>
  );
}
