import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { roleLabel } from "../permissions";
import EnableNotifications from "./EnableNotifications";

const fadeIn = keyframes`from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const Shell = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.canvas};
  font-family: ${({ theme }) => theme.typography.fontBody};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    height: 100vh;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.adminHeader};
  }
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 220px;
  background:
    radial-gradient(circle at 0% 0%, rgba(32, 118, 255, 0.18), transparent 38%),
    linear-gradient(180deg, #041b43 0%, #05285f 48%, #04245a 100%);
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.header};
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.22), 10px 0 34px rgba(2, 20, 54, 0.18);
  transition: transform ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.spring};

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(-100%)")};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SidebarLogo = styled.div`
  padding: 20px 18px 18px;
  min-height: 72px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255,255,255,0.12);

  h1 {
    margin: 0;
    color: #fff;
    font-size: 0.92rem;
    line-height: 1.15;
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    letter-spacing: 0;
  }

  span {
    display: block;
    margin-top: 5px;
    color: rgba(255,255,255,0.58);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 18px 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 5px;
  color: rgba(255,255,255,0.92);
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  transition: all ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.standard};
  animation: ${fadeIn} 0.3s ease both;

  &:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
  }

  &.active {
    background: linear-gradient(90deg, rgba(25, 100, 218, 0.96), rgba(0, 170, 255, 0.96));
    color: #fff;
    box-shadow: 0 12px 26px rgba(0, 128, 255, 0.28);
  }

  &.active::after {
    content: "";
    position: absolute;
    top: 3px;
    right: -1px;
    width: 4px;
    height: calc(100% - 6px);
    border-radius: 999px;
    background: #08d8ff;
    box-shadow: 0 0 14px rgba(8, 216, 255, 0.9);
  }

  svg { width: 15px; height: 15px; flex-shrink: 0; stroke-width: 1.9; }
`;

const NavLabel = styled.span`
  min-width: 0;
  flex: 1;
`;

const CountBadge = styled.span`
  min-width: 17px;
  height: 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border-radius: 999px;
  background: #176dff;
  color: #ffffff;
  font-size: 0.62rem;
  font-weight: 900;
  line-height: 1;
`;

const SidebarFooter = styled.div`
  margin: 0 16px;
  padding: 20px 0 24px;
  border-top: 1px solid rgba(255,255,255,0.16);
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 34px;
  padding: 0 0;
  border-radius: 5px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.92);
  font-size: 0.78rem;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing.standard};
  font-family: inherit;
  &:hover { color: #fff; }

  svg { width: 15px; height: 15px; stroke-width: 1.9; }
`;

const Main = styled.div`
  margin-left: 220px;
  flex: 1;
  min-width: 0;
  width: auto;
  max-width: calc(100% - 220px);
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    margin-left: 0;
    max-width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
  }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[16]};
  padding: 0 ${({ theme }) => theme.spacing[24]};
  min-width: 0;
  max-width: 100%;
  height: 72px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileHeader = styled.header`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    z-index: ${({ theme }) => theme.zIndex.header};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing[16]};
    min-height: 88px;
    padding: 12px 18px 14px;
    background: radial-gradient(circle at 72% 0%, rgba(12, 92, 173, 0.34), transparent 36%), ${({ theme }) => theme.colors.adminHeader};
    color: #ffffff;
  }
`;

const MobileHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;

  h1 {
    margin: 0;
    color: #ffffff;
    font-size: ${({ theme }) => theme.typography.size.xl};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  }

  p {
    margin: ${({ theme }) => theme.spacing[4]} 0 0;
    color: rgba(255, 255, 255, 0.78);
    font-size: ${({ theme }) => theme.typography.size.xs};
  }
`;

const MobileAdmin = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};
  min-width: 0;
  flex-shrink: 0;

  strong {
    display: block;
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ffffff;
    font-size: ${({ theme }) => theme.typography.size.xs};
  }

  span {
    display: block;
    color: rgba(255, 255, 255, 0.76);
    font-size: ${({ theme }) => theme.typography.size.xs};
    margin-top: 2px;
  }
`;

const MenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #0d2244;
  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) { display: flex; align-items: center; }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const AdminInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.text};
  span { font-weight: ${({ theme }) => theme.typography.weight.semibold}; color: ${({ theme }) => theme.colors.ink}; }
`;

const NotificationBtn = styled(NavLink)`
  width: 32px; height: 32px;
  border-radius: ${({ theme }) => theme.radius.pill};
  display: flex; align-items: center; justify-content: center;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.primarySoft};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  svg { width: 16px; height: 16px; }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed; inset: 0; background: ${({ theme }) => theme.colors.overlay}; z-index: ${({ theme }) => theme.zIndex.overlay};
  }
`;

const AvatarLink = styled(NavLink)`
  width: 32px; height: 32px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary}, ${({ theme }) => theme.colors.primary});
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: ${({ theme }) => theme.typography.size.sm}; font-weight: ${({ theme }) => theme.typography.weight.bold};
  text-decoration: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Content = styled.main`
  padding: ${({ theme }) => theme.spacing[24]};
  font-size: ${({ theme }) => theme.typography.size.sm};
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    top: 94px;
    bottom: 0;
    z-index: ${({ theme }) => theme.zIndex.sticky};
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    margin-top: 0;
    padding: 16px 12px 106px;
    border-radius: ${({ theme }) => theme.radius.xxl} ${({ theme }) => theme.radius.xxl} 0 0;
    background: ${({ theme }) => theme.colors.adminCanvas};
  }
`;

const AnimatedPage = styled.div`
  animation: ${fadeUp} 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const MobileBottomNav = styled.nav`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    left: 10px;
    right: 10px;
    width: auto;
    max-width: calc(100% - 20px);
    bottom: 8px;
    z-index: ${({ theme }) => theme.zIndex.header};
    display: grid;
    grid-template-columns: repeat(${({ $count }) => $count || 5}, minmax(0, 1fr));
    gap: 2px;
    padding: 10px 8px 8px;
    border-radius: ${({ theme }) => theme.radius.xxl};
    background: rgba(255, 255, 255, 0.96);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    backdrop-filter: blur(16px);
  }
`;

const BottomNavItem = styled(NavLink)`
  position: relative;
  display: grid;
  place-items: center;
  gap: 4px;
  min-width: 0;
  color: ${({ theme }) => theme.colors.subtle};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};

  svg {
    width: 20px;
    height: 20px;
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active svg {
    width: 34px;
    height: 34px;
    padding: 8px;
    border-radius: ${({ theme }) => theme.radius.input};
    color: #ffffff;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary}, ${({ theme }) => theme.colors.primary});
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const BottomIconWrap = styled.span`
  position: relative;
  display: inline-flex;

  ${CountBadge} {
    position: absolute;
    top: -7px;
    right: -9px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    font-size: 0.56rem;
    border: 2px solid #ffffff;
  }
`;

const navLinks = [
  {
    to: "/admin/dashboard", label: "Dashboard",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>,
  },
  {
    to: "/admin/leads", label: "Leads",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    to: "/admin/clients", label: "Client Management",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    to: "/admin/tasks", label: "Tasks",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    to: "/admin/employees", label: "Employees",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h3M15 12h3M7 16h4"/></svg>,
  },
  {
    to: "/admin/notifications", label: "Notifications",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
  {
    to: "/admin/settings", label: "Settings",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.2.36.3.75.3 1.15V10.3A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/></svg>,
  },
];

const mobileLinksByRole = (role) => {
  const home = navLinks.find((item) => item.to === "/admin/dashboard");
  const leads = navLinks.find((item) => item.to === "/admin/leads");
  const clients = navLinks.find((item) => item.to === "/admin/clients");
  const tasks = navLinks.find((item) => item.to === "/admin/tasks");
  const employees = navLinks.find((item) => item.to === "/admin/employees");

  if (["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role)) {
    return [home, leads, clients, tasks, employees].filter(Boolean);
  }
  return [home, leads, clients, tasks].filter(Boolean);
};

const pageTitle = (pathname) => {
  const match = navLinks.find((link) => pathname.startsWith(link.to));
  return match?.label === "Client Management" ? "Clients" : match?.label || "Dashboard";
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navCounts, setNavCounts] = useState({ leads: 0, tasks: 0, notifications: 0 });
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const adminIdentity = admin?.id || admin?._id || admin?.email || "";
  const mobileLinks = mobileLinksByRole(admin?.role);
  const touchStartRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadCounts = async () => {
      try {
        const [leadStats, taskRes, notificationRes] = await Promise.allSettled([
          api.get("/leads/stats"),
          api.get("/tasks"),
          api.get("/notifications"),
        ]);
        if (!mounted) return;
        const leads =
          leadStats.status === "fulfilled" && leadStats.value?.success
            ? Number(leadStats.value.stats?.pending || 0)
            : 0;
        const tasks =
          taskRes.status === "fulfilled" && taskRes.value?.success
            ? (taskRes.value.tasks || []).filter((task) => task.workStatus !== "Completed").length
            : 0;
        const notifications =
          notificationRes.status === "fulfilled" && notificationRes.value?.success
            ? (notificationRes.value.notifications || []).length
            : 0;
        setNavCounts({ leads, tasks, notifications });
      } catch {
        if (mounted) setNavCounts({ leads: 0, tasks: 0, notifications: 0 });
      }
    };

    if (adminIdentity) {
      loadCounts();
    }
    return () => {
      mounted = false;
    };
  }, [adminIdentity, location.pathname]);

  const badgeFor = (path) => {
    if (path === "/admin/leads") return navCounts.leads;
    if (path === "/admin/tasks") return navCounts.tasks;
    if (path === "/admin/notifications") return navCounts.notifications;
    return 0;
  };

  const handleLogout = () => { logout(); navigate("/admin/login"); };
  const handleTouchStart = (event) => {
    if (window.innerWidth > 760) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      width: window.innerWidth,
    };
  };
  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || window.innerWidth > 760) return;

    const target = event.target;
    if (target?.closest?.("input, textarea, select, button, a")) return;

    const touch = event.changedTouches?.[0];
    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const edgeSize = 28;
    const isLeftEdgeBack = start.x <= edgeSize && deltaX > 72;
    const isRightEdgeBack = start.x >= start.width - edgeSize && deltaX < -72;

    if (Math.abs(deltaY) < 55 && (isLeftEdgeBack || isRightEdgeBack)) {
      navigate(-1);
    }
  };

  return (
    <Shell onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <Overlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <Sidebar $open={sidebarOpen}>
        <SidebarLogo>
          <h1>ARP Associates</h1>
          <span>Admin Panel</span>
        </SidebarLogo>
        <Nav>
          {navLinks.map((l) => (
            <NavItem key={l.to} to={l.to} onClick={() => setSidebarOpen(false)}>
              {l.icon}
              <NavLabel>{l.label}</NavLabel>
              {badgeFor(l.to) > 0 && <CountBadge>{badgeFor(l.to)}</CountBadge>}
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
        <MobileHeader>
          <MobileHeaderLeft>
            <div>
              <h1>ARP Admin</h1>
              <p>{pageTitle(location.pathname)}</p>
            </div>
          </MobileHeaderLeft>
          <MobileAdmin>
            <NotificationBtn to="/admin/notifications" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </NotificationBtn>
            <AvatarLink to="/admin/settings" title="Open profile" aria-label="Open profile">
              {admin?.profileImage ? (
                <img src={admin.profileImage} alt={admin?.name || "Admin"} />
              ) : (
                admin?.name?.[0]?.toUpperCase() || admin?.email?.[0]?.toUpperCase() || "A"
              )}
            </AvatarLink>
          </MobileAdmin>
        </MobileHeader>
        <Header>
          <MenuBtn onClick={() => setSidebarOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </MenuBtn>
          <HeaderTitle>Admin Dashboard</HeaderTitle>
          <AdminInfo>
            <NotificationBtn to="/admin/notifications" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </NotificationBtn>
            <AvatarLink to="/admin/settings" title="Open profile" aria-label="Open profile">
              {admin?.profileImage ? (
                <img src={admin.profileImage} alt={admin?.name || "Admin"} />
              ) : (
                admin?.name?.[0]?.toUpperCase() || admin?.email?.[0]?.toUpperCase() || "A"
              )}
            </AvatarLink>
            <div>
              <span>{admin?.name || admin?.email || "Admin"}</span>
              <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>{roleLabel(admin?.role)}</div>
            </div>
          </AdminInfo>
        </Header>
        <Content data-page-scroll-container>
          <AnimatedPage key={`${location.pathname}${location.search}`}>
            <EnableNotifications />
            <Outlet />
          </AnimatedPage>
        </Content>
      </Main>
      <MobileBottomNav $count={mobileLinks.length}>
        {mobileLinks.map((link) => (
          <BottomNavItem key={link.to} to={link.to}>
            <BottomIconWrap>
              {link.icon}
              {badgeFor(link.to) > 0 && <CountBadge>{badgeFor(link.to)}</CountBadge>}
            </BottomIconWrap>
            <span>{link.label === "Dashboard" ? "Home" : link.label === "Client Management" ? "Clients" : link.label}</span>
          </BottomNavItem>
        ))}
      </MobileBottomNav>
    </Shell>
  );
}
