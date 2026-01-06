import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminPrivateRoute from "./AdminPrivateRoute";
import AdminLoginPage from "../pages/AdminLoginPage";

// Pages
import CoursesPage from "../features/courses/pages/CoursesPage";
import CoursesPage2 from "../features/courses2/pages/CoursesPage2";
import CreateCoursePage from "../features/courses2/pages/CreateCoursePage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import UsersPage from "../features/users/pages/UsersPage";
import WordsPage from "../features/words/pages/WordsPage";
import StatisticsPage from "../features/statistics/pages/StatisticsPage";
import TransactionsPage from "../features/transactions/pages/TransactionsPage";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public route - Admin Login */}
      <Route path="/login" element={<AdminLoginPage />} />

      {/* Protected routes - Cần đăng nhập admin */}
      <Route
        path="/*"
        element={
          <AdminPrivateRoute>
            <AdminLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/assessment" element={<CoursesPage />} />
                <Route path="/courses" element={<CoursesPage2 />} />
                <Route path="/create-course" element={<CreateCoursePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/vocabulary" element={<WordsPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                {/* Có thể thêm nhiều route khác ở đây */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </AdminPrivateRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
