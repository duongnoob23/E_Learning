import React from "react";
import { NavLink } from "react-router-dom";
// Heroicons v2 - Modern và đẹp
import {
  HiBookOpen,
  HiChartBar,
  HiDocumentText,
  HiPlusCircle,
  HiUsers,
} from "react-icons/hi2";
// FontAwesome - Đa dạng
import { FaBook, FaCreditCard } from "react-icons/fa";
// Material Design - Phong phú
import { MdMenuBook } from "react-icons/md";
import "./Sidebar.scss";

const Sidebar = () => {
  const menuSections = [
    {
      title: "HOME",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: HiChartBar },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Users", path: "/admin/users", icon: HiUsers },
        { name: "Flashcards", path: "/admin/flashcards", icon: HiBookOpen },
        { name: "Vocabulary", path: "/admin/vocabulary", icon: HiBookOpen },
        { name: "Courses", path: "/admin/courses", icon: FaBook },
        {
          name: "Create Course",
          path: "/admin/create-course",
          icon: HiPlusCircle,
        },
        {
          name: "Assignments",
          path: "/admin/assessment",
          icon: HiDocumentText,
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        { name: "Payments", path: "/admin/payments", icon: FaCreditCard },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <MdMenuBook />
        </div>
        <h2 className="sidebar__title">TOTC</h2>
      </div>

      <div className="sidebar__search">
        <input
          type="text"
          className="sidebar__search-input"
          placeholder="Search"
        />
      </div>

      <nav className="sidebar__nav">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="sidebar__section">
            <div className="sidebar__section-title">{section.title}</div>
            <ul className="sidebar__list">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.path} className="sidebar__item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar__link ${
                          isActive ? "sidebar__link--active" : ""
                        }`
                      }
                    >
                      <span className="sidebar__icon">
                        <IconComponent />
                      </span>
                      <span className="sidebar__text">{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
