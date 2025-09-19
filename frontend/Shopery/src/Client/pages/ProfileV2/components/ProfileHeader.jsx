import React from "react";

const ProfileHeader = ({ user }) => {
  return (
    <div className="profilev2-header">
      <div className="profilev2-avatar">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          (user?.full_name?.[0] || user?.username?.[0] || "U").toUpperCase()
        )}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 20 }}>{user?.full_name || user?.username || "User"}</div>
        <div style={{ opacity: 0.8 }}>{user?.email}</div>
      </div>
    </div>
  );
};

export default ProfileHeader;


