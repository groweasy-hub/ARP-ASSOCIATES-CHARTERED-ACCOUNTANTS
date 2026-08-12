import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import MainLayout from "./layouts/MainLayout";
import GlobalStyles from "./styles/GlobalStyles";
import theme from "./styles/theme";

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
import Messages from "./admin/pages/Messages";
import Settings from "./admin/pages/Settings";
import TeamManagement from "./admin/pages/TeamManagement";
import UserProfile from "./admin/pages/UserProfile";
import RolesPermissions from "./admin/pages/RolesPermissions";
import AuditLogs from "./admin/pages/AuditLogs";
import Notifications from "./admin/pages/Notifications";
import Unauthorized from "./admin/pages/Unauthorized";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
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

            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute permissions={["dashboard.view"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<ProtectedRoute permissions={["dashboard.view"]}><Dashboard /></ProtectedRoute>} />
              <Route path="leads" element={<ProtectedRoute permissions={["clients.view"]}><Leads /></ProtectedRoute>} />
              <Route path="messages" element={<ProtectedRoute permissions={["clients.view"]}><Messages /></ProtectedRoute>} />
              <Route path="team" element={<ProtectedRoute permissions={["team.view"]}><TeamManagement /></ProtectedRoute>} />
              <Route path="team/:id" element={<ProtectedRoute permissions={["team.view"]}><UserProfile /></ProtectedRoute>} />
              <Route path="roles" element={<ProtectedRoute permissions={["roles.view"]}><RolesPermissions /></ProtectedRoute>} />
              <Route path="audit-logs" element={<ProtectedRoute permissions={["audit_logs.view"]}><AuditLogs /></ProtectedRoute>} />
              <Route path="notifications" element={<ProtectedRoute permissions={["notifications.view"]}><Notifications /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute permissions={["settings.view"]}><Settings /></ProtectedRoute>} />
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
