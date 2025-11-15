// Client/pages/Profile/Profile.jsx
import React, { useState } from "react";
import AccountSecurity from "../../components/Profile/ProfileJSX/AccountSecurity";
import DeleteAccount from "../../components/Profile/ProfileJSX/DeleteAccount";
import MyProfile from "../../components/Profile/ProfileJSX/MyProfile";
import Notification from "../../components/Profile/ProfileJSX/Notification";
import Privacy from "../../components/Profile/ProfileJSX/Privacy";
import "./Profile.css";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("account-security");

  // Tab titles mapping
  const tabTitles = {
    "my-profile": "My Profile",
    "my-courses": "My Courses",
    wishlists: "Wishlists",
    "account-security": "Account Security",
    privacy: "Privacy",
    notifications: "Notifications",
    "delete-account": "Delete Account",
  };

  // Navigation menu items
  const menuItems = [
    { id: "my-profile", label: "My Profile", icon: "👤" },
    { id: "my-courses", label: "My Courses", icon: "📚" },
    { id: "wishlists", label: "Wishlists", icon: "❤️" },
    { id: "account-security", label: "Account Security", icon: "✓" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "delete-account", label: "Delete Account", icon: "🗑️" },
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "account-security":
        return <AccountSecurity />;
      case "my-profile":
        return <MyProfile />;
      case "my-courses":
        return (
          <div className="profile-content-placeholder">My Courses Content</div>
        );
      case "wishlists":
        return (
          <div className="profile-content-placeholder">Wishlists Content</div>
        );
      case "privacy":
        return <Privacy />;
      case "notifications":
        return <Notification />;
      case "delete-account":
        return <DeleteAccount />;
      default:
        return <AccountSecurity />;
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1 className="profile-header__title">
          {tabTitles[activeTab] || "Account Security"}
        </h1>
      </div>

      {/* Main Container */}
      <div className="profile-container">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-card__avatar">
              <img
                src="https://images.unsplash.com/photo-1757351122515-21a7b61d682e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
                alt="Profile"
                className="profile-card__avatar-img"
              />
            </div>
            <h2 className="profile-card__name">Christine A. Watkins</h2>
            <div className="profile-card__location">
              <span className="profile-card__location-icon">📍</span>
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="profile-card__username">@Christine</div>
            <button className="profile-card__edit-btn">
              <span className="profile-card__edit-icon">✏️</span>
              Edit Profile
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="profile-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`profile-nav__item ${
                  activeTab === item.id ? "profile-nav__item--active" : ""
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="profile-nav__icon">{item.icon}</span>
                <span className="profile-nav__label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="profile-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
