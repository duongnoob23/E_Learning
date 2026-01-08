// Client/pages/Profile/Profile.jsx
import React, { useState } from "react";
import AccountSecurity from "../../components/Profile/ProfileJSX/AccountSecurity";
import DeleteAccount from "../../components/Profile/ProfileJSX/DeleteAccount";
import MyProfile from "../../components/Profile/ProfileJSX/MyProfile";
import Notification from "../../components/Profile/ProfileJSX/Notification";
import Privacy from "../../components/Profile/ProfileJSX/Privacy";
import { useGetProfile } from "../../services/Profile/profileQueries";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("my-profile");

  // Lấy thông tin profile từ API
  const { data: profileData, isLoading, error } = useGetProfile();

  // Debug logging
  console.log("profileData:", profileData);
  console.log("isLoading:", isLoading);
  console.log("error:", error);

  const profile = profileData?.DT || null;
  console.log("PROFILE (extracted):", profile);
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
    { id: "my-courses", label: "My Courses", icon: "" },
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
        return <MyProfile />;
    }
  };

  // Xử lý khi click Edit <Profile></Profile>
  const handleEditProfile = () => {
    setActiveTab("my-profile");
  };

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Đang tải thông tin profile...</div>
      </div>
    );
  }

  // Hiển thị error
  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          Có lỗi xảy ra khi tải thông tin profile. Vui lòng thử lại sau.
        </div>
      </div>
    );
  }

  // Lấy thông tin hiển thị
  const displayName = profile?.full_name || profile?.username || "User";
  const displayUsername = profile?.username
    ? `@${profile.username}`
    : "@username";
  const avatarUrl = profile?.avatar_url
    ? `http://localhost:5000${profile.avatar_url}`
    : "https://images.unsplash.com/photo-1757351122515-21a7b61d682e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1 className="profile-header__title">
          {tabTitles[activeTab] || "My Profile"}
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
                src={avatarUrl}
                alt="Profile"
                className="profile-card__avatar-img"
              />
            </div>
            <h2 className="profile-card__name">{displayName}</h2>
            <div className="profile-card__location">
              <span className="profile-card__location-icon">📍</span>
              <span>{profile?.email || "No email"}</span>
            </div>
            <div className="profile-card__username">{displayUsername}</div>
            <button
              className="profile-card__edit-btn"
              onClick={handleEditProfile}
            >
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
