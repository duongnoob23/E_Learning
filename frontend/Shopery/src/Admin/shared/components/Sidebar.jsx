import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Courses", path: "/admin/courses", icon: "📚" },
    { name: "Students", path: "/admin/students", icon: "👩‍🎓" },
    { name: "Earnings", path: "/admin/earnings", icon: "💰" },
    { name: "Reports", path: "/admin/reports", icon: "📈" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <h2 className="sidebar__title">Admin</h2>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar__item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                }
              >
                <span className="sidebar__icon">{item.icon}</span>
                <span className="sidebar__text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
