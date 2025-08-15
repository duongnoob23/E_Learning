// Admin Routes Configuration
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Auth Pages
import Login from "../common/pages/Auth/Login/Login";

// Admin Layout
import Sidebar from "../Admin/components/layout/Sidebar/Sidebar";

// Admin Pages
//import Dashboard from "../Admin/pages/Dashboard/Dashboard";
// import UsersList from '../Admin/pages/Users/UsersList'
// import ProductsList from '../Admin/pages/Products/ProductsList'

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
      <Route
        path="/admin/login"
        element={
          <PublicRoute restricted={true} redirectPath="/admin/dashboard">
            <Login isAdmin={true} />
          </PublicRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin" fallbackPath="/admin/login">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Users Management */}
        {/* <Route path="users" element={<UsersList />} /> */}

        {/* Products Management */}
        {/* <Route path="products" element={<ProductsList />} /> */}
      </Route>

      {/* Catch all admin routes */}
      <Route
        path="/admin/*"
        element={<Navigate to="/admin/dashboard" replace />}
      />
    </Routes>
  );
};

export default AdminRoutes;
