import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
const Sidebar = () => {
  // ✅ Group menu items theo section
  const menuSections = [
    {
      title: "HOME",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
        { name: "Calendars", path: "/admin/calendars", icon: "📅" },
        { name: "Discussions", path: "/admin/discussions", icon: "💬" },
        { name: "Live Sessions", path: "/admin/live-sessions", icon: "📹" },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Users", path: "/admin/users", icon: "👥" },
        { name: "Courses", path: "/admin/courses", icon: "📚" },
        { name: "Assignments", path: "/admin/assessment", icon: "📝" },
      ],
    },
    {
      title: "OTHER",
      items: [
        { name: "Certificates", path: "/admin/certificates", icon: "🏆" },
        { name: "Payments", path: "/admin/payments", icon: "💳" },
        { name: "Reports", path: "/admin/reports", icon: "📊" },
        { name: "Settings", path: "/admin/settings", icon: "⚙️" },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      {/* ✅ Logo với icon */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">📖</div>
        <h2 className="sidebar__title">TOTC</h2>
      </div>

      {/* ✅ Search bar */}
      <div className="sidebar__search">
        <input
          type="text"
          className="sidebar__search-input"
          placeholder="Search"
        />
      </div>

      {/* ✅ Navigation với sections */}
      <nav className="sidebar__nav">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="sidebar__section">
            <div className="sidebar__section-title">{section.title}</div>
            <ul className="sidebar__list">
              {section.items.map((item) => (
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
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
