// Private Route Component - Route cho user đã đăng nhập
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, requiredRole, requiredPermissions = [] }) => {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );
  console.log("🚀 ~ PrivateRoute ~ user:", user);
  console.log("🚀 ~ PrivateRoute ~ isAuthenticated:", isAuthenticated);
  const location = useLocation();

  // Đang loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang xác thực...</p>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // // Kiểm tra role nếu được yêu cầu
  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/" replace />;
  // }

  // // Kiểm tra permissions nếu được yêu cầu
  // if (requiredPermissions.length > 0) {
  //   const hasAllPermissions = requiredPermissions.every((permission) =>
  //     user?.permissions?.includes(permission)
  //   );

  //   if (!hasAllPermissions) {
  //     return <Navigate to="/" replace />;
  //   }
  // }

  return children;
};

export default PrivateRoute;

// trang admin không cần phải đẩy về login, chỉ có client cần thế thôi, tại vì admin không truy cập được trang nào khác ngoài login cảcả

// phải hỏi kĩ lại nội dung của private routesroutes
