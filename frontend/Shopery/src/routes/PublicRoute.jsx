// Public Route Component - Route cho user chưa đăng nhập
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children, restricted = false, redirectPath = "/" }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Nếu route bị restricted (như login, register) và user đã đăng nhập
  if (restricted && isAuthenticated) {
    // Chỉ redirect nếu không phải trang Home
    if (location.pathname !== "/") {
      const targetPath =
        location.state?.from?.pathname ||
        (isAdmin() ? "/admin/dashboard" : redirectPath);

      return <Navigate to={targetPath} replace />;
    }
  }

  return children;
};

export default PublicRoute;
