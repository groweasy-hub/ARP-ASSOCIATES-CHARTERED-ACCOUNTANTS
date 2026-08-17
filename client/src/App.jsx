import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import MainLayout from "./layouts/MainLayout";
import GlobalStyles from "./styles/GlobalStyles";
import theme, { adminTheme } from "./styles/theme";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import ServiceDetail from "./pages/ServiceDetail/ServiceDetail";
import Team from "./pages/Team/Team";
import Links from "./pages/Links/Links";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";

import { AuthProvider } from "./admin/context/AuthContext";
import { ToastContainer } from "./admin/components/Toast";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import Leads from "./admin/pages/Leads";
import ClientManagement from "./admin/pages/ClientManagement";
import Tasks from "./admin/pages/Tasks";
import Messages from "./admin/pages/Messages";
import Settings from "./admin/pages/Settings";
import TeamManagement from "./admin/pages/TeamManagement";
import UserProfile from "./admin/pages/UserProfile";
import Notifications from "./admin/pages/Notifications";
import Unauthorized from "./admin/pages/Unauthorized";

function RouteDocumentState() {
  const location = useLocation();

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/login";
    document.documentElement.classList.toggle("admin-route", isAdminRoute);
    document.body.classList.toggle("admin-route", isAdminRoute);

    return () => {
      document.documentElement.classList.remove("admin-route");
      document.body.classList.remove("admin-route");
    };
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <RouteDocumentState />
          <ScrollToTop />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/team" element={<Team />} />
              <Route path="/links" element={<Links />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            <Route
              path="/login"
              element={
                <ThemeProvider theme={adminTheme}>
                  <AdminLogin />
                </ThemeProvider>
              }
            />
            <Route
              path="/admin/login"
              element={
                <ThemeProvider theme={adminTheme}>
                  <AdminLogin />
                </ThemeProvider>
              }
            />
            <Route
              path="/admin"
              element={
                <ThemeProvider theme={adminTheme}>
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                </ThemeProvider>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="clients" element={<ClientManagement />} />
              <Route path="clients/:id" element={<ClientManagement />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="messages" element={<Messages />} />
              <Route path="employees" element={<TeamManagement />} />
              <Route path="employees/:id" element={<UserProfile />} />
              <Route path="team" element={<Navigate to="/admin/employees" replace />} />
              <Route path="team/:id" element={<UserProfile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="change-password" element={<Settings forcePasswordChange />} />
              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
