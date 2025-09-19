import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const PrivateRoute = ({ children, requiredRole, requiredPermissions = [] }) => {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const location = useLocation();

  // Check auth status khi component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("🚀 ~ PrivateRoute ~ user:", user);
  console.log("🚀 ~ PrivateRoute ~ isAuthenticated:", isAuthenticated);

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
