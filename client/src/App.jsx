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

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
