// Admin Routes Configuration
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../routes/PrivateRoute";

// Auth Pages
import Login from "../../common/pages/Auth/Login/Login";

// Admin Layout
import Sidebar from "../components/layout/Sidebar/Sidebar";

// Admin Pages
import Dashboard from "../pages/Dashboard/Dashboard";

// Admin Layout Component
const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="admin-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={`admin-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Admin Routes */}
      <Route path="/login" element={<Login isAdmin={true} />} />
      <Route path="/register" element={<Login isAdmin={true} />} />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
