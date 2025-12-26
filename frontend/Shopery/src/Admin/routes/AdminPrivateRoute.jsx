import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuthStore } from "../stores/adminAuthStore";

/**
 * AdminPrivateRoute - Bảo vệ các route admin
 * Chỉ cho phép truy cập khi đã đăng nhập admin
 * Nếu chưa đăng nhập, redirect về /admin/login
 */
const AdminPrivateRoute = ({ children }) => {
  const { isAdminAuthenticated, checkAdminAuth } = useAdminAuthStore();
  const location = useLocation();

  // Check admin auth status khi component mount
  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  // Chưa đăng nhập admin
  if (!isAdminAuthenticated) {
    // Lưu location hiện tại để redirect lại sau khi login
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default AdminPrivateRoute;

