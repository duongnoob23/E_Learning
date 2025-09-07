// Client Header Component
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../../redux/slices/authSlice";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
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
              <Link
                to="/"
                className="header__nav-link header__nav-link--active"
              >
                Home
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="course" className="header__nav-link">
                Course
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/flashcard" className="header__nav-link">
                Flashcard
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/blog" className="header__nav-link">
                Blog
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/instructor" className="header__nav-link">
                Instructor
              </Link>
            </li>
            {/* <li className="header__nav-item">
              <Link to="/courses" className="header__nav-link">
                Courses
              </Link>
            </li> */}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="header__auth">
          {isAuthenticated ? (
            <div className="header__user-menu">
              <span className="header__user-name">Hi, {user?.username}</span>
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
          className={`header__menu-toggle ${
            isMenuOpen ? "header__menu-toggle--open" : ""
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
