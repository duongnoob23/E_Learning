import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import CoursesPage from "../features/courses/pages/CoursesPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

const AdminRoutes = () => {
  return (
    // <PrivateRoute requiredRole="admin">
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        {/* Có thể thêm nhiều route khác ở đây */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
    // </PrivateRoute>
  );
};

export default AdminRoutes;
