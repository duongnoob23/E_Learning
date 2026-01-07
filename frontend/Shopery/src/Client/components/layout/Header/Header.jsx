import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../stores/authStore";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { clearCredentials, isAuthenticated, user } = useAuthStore();
  const handleLogout = async () => {
    clearCredentials();

    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo">
          <div className="header__logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4FD1C7" />
              <path d="M2 17L12 22L22 17" stroke="#4FD1C7" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="#4FD1C7" strokeWidth="2" />
            </svg>
          </div>
          <span className="header__logo-text">TOTC</span>
        </div>

        {/* Navigation Menu */}
        <nav className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? "header__nav-link--active" : ""}`
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/course"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? "header__nav-link--active" : ""}`
                }
              >
                Course
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/flashcard"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? "header__nav-link--active" : ""}`
                }
              >
                Flashcard
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/assessment"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? "header__nav-link--active" : ""}`
                }
              >
                Assessment
              </NavLink>
            </li>

            <li className="header__nav-item">
              <NavLink
                to="/mycourses"
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? "header__nav-link--active" : ""}`
                }
              >
                My Courses
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="header__auth">
          {isAuthenticated ? (
            <div className="header__user-menu">
              <Link to="/profile" className="header__profile-link">
                <span className="header__user-name">Hi, {user?.username}</span>
              </Link>
              <button className="header__logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="header__btn header__btn--login">
                Login
              </Link>
              <Link to="/register" className="header__btn header__btn--signup">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`header__menu-toggle ${isMenuOpen ? "header__menu-toggle--open" : ""
            }`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
