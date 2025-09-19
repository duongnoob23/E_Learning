// Public Route Component - Route cho user chưa đăng nhập
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Nếu route bị restricted và user đã đăng nhập
  if (restricted && isAuthenticated) {
    // Chỉ redirect nếu không phải trang Home
    if (location.pathname !== "/") {
      const targetPath = user?.role === "admin" ? "/admin/dashboard" : "/";
      return <Navigate to={targetPath} replace />;
    }
  }

  return children;
};

export default PublicRoute;
// public thì cần gì check, tại sao phải check restricted và isAuthenticated ở trong public route
