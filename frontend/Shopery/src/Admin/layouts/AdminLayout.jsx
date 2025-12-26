import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../shared/components/Sidebar";
import { useAdminAuthStore } from "../stores/adminAuthStore";
import { adminAuthApi } from "../api/adminAuthApi";
import "./AdminLayout.scss";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { adminUser, adminRefreshToken, logout } = useAdminAuthStore();

  const handleLogout = async () => {
    try {
      if (adminRefreshToken) {
        await adminAuthApi.logout(adminRefreshToken);
      }
      logout();
      toast.success("Đăng xuất thành công!");
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn logout dù API fail
      logout();
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-layout__main">
        <header className="admin-layout__header">
          <h1 className="admin-layout__title">Admin Dashboard</h1>
          <div className="admin-layout__user">
            {adminUser && (
              <>
                <img
                  src={adminUser.avatar_url || "https://i.pravatar.cc/40"}
                  alt="Admin"
                  className="admin-layout__avatar"
                />
                <span className="admin-layout__username">
                  {adminUser.full_name || adminUser.username || "Admin"}
                </span>
                <button
                  onClick={handleLogout}
                  className="admin-layout__logout-btn"
                  title="Đăng xuất"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </header>

        <div className="admin-layout__content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
