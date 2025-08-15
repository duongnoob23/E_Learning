// Public Route Component - Route cho user chưa đăng nhập
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
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
