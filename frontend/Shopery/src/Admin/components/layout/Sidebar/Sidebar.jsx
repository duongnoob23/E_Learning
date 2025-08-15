// Admin Sidebar Component
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: "📊",
      label: "Dashboard",
      active: location.pathname === "/admin/dashboard",
    },
    {
      path: "/admin/users",
      icon: "👥",
      label: "Quản lý Users",
      active: location.pathname.startsWith("/admin/users"),
    },
    {
      path: "/admin/products",
      icon: "📦",
      label: "Quản lý Sản phẩm",
      active: location.pathname.startsWith("/admin/products"),
    },
    {
      path: "/admin/categories",
      icon: "📂",
      label: "Danh mục",
      active: location.pathname.startsWith("/admin/categories"),
    },
    {
      path: "/admin/orders",
      icon: "🛒",
      label: "Đơn hàng",
      active: location.pathname.startsWith("/admin/orders"),
    },
    {
      path: "/admin/analytics",
      icon: "📈",
      label: "Thống kê",
      active: location.pathname.startsWith("/admin/analytics"),
    },
    {
      path: "/admin/settings",
      icon: "⚙️",
      label: "Cài đặt",
      active: location.pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🛡️</span>
          {!collapsed && <span className="logo-text">Admin Panel</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={`nav-link ${item.active ? "active" : ""}`}
                title={collapsed ? item.label : ""}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          className="toggle-btn"
          onClick={onToggle}
          title={collapsed ? "Mở rộng" : "Thu gọn"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
