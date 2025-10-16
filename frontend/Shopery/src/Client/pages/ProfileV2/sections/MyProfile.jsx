import React from "react";
import "./MyProfile.css";

// base URL backend, tuỳ theo server bạn đang chạy
const BASE_URL = "http://localhost:5000";

const MyProfile = ({ user }) => {
  console.log("user:", user);

  // xử lý avatar_url
  const avatarSrc = user?.avatar_url
    ? user.avatar_url.startsWith("http")
      ? user.avatar_url
      : BASE_URL + user.avatar_url
    : "/default-avatar.png";

  return (
    <div className="profile-container">
      <h3 className="profile-title">My Profile</h3>

      {/* Avatar + Basic Info */}
      <div className="profile-header">
        <img src={avatarSrc} alt="avatar" className="profile-avatar" />
        <div className="profile-basic">
          <h4>{user?.username}</h4>
          <p>{user?.email}</p>
          <span
            className={`status-badge ${
              user?.status === "verified" ? "verified" : "unverified"
            }`}
          >
            {user?.status}
          </span>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="section-card">
        <div className="section-title">Basic Information</div>

        <div className="info-row">
          <label>Full name</label>
          <span>{user?.full_name || "Not provided"}</span>
        </div>

        <div className="info-row">
          <label>Phone number</label>
          <span>{user?.phone_number || "Not provided"}</span>
        </div>

        <div className="info-row">
          <label>Email verified</label>
          <span>{user?.email_verified ? "Yes ✅" : "No ❌"}</span>
        </div>

        <div className="info-row">
          <label>Phone verified</label>
          <span>{user?.phone_verified ? "Yes ✅" : "No ❌"}</span>
        </div>

        <div className="info-row">
          <label>Last login</label>
          <span>{user?.last_login || "Never"}</span>
        </div>

        <div className="info-row">
          <label>Created at</label>
          <span>{new Date(user?.created_at).toLocaleString()}</span>
        </div>

        <div className="info-row">
          <label>Updated at</label>
          <span>{new Date(user?.updated_at).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
