import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import CoursesPage from "../features/courses/pages/CoursesPage";
import CoursesPage2 from "../features/courses2/pages/CoursesPage2";
import CreateCoursePage from "../features/courses2/pages/CreateCoursePage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import UsersPage from "../features/users/pages/UsersPage";
const AdminRoutes = () => {
  return (
    // <PrivateRoute requiredRole="admin">
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessment" element={<CoursesPage />} />
        <Route path="/courses" element={<CoursesPage2 />} />
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path ="/users" element={<UsersPage />} />
        {/* Có thể thêm nhiều route khác ở đây */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
    // </PrivateRoute>
  );
};

export default AdminRoutes;
