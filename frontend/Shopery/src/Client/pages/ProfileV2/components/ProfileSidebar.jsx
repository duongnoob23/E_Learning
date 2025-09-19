import React from "react";

const ProfileSidebar = ({ user, items = [], activeKey, onChange }) => {
  return (
    <div>
      <div className="section-card" style={{ textAlign: "center" }}>
        <div className="profilev2-avatar" style={{ margin: "0 auto" }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            (user?.full_name?.[0] || user?.username?.[0] || "U").toUpperCase()
          )}
        </div>
        <div style={{ marginTop: 8, fontWeight: 700 }}>{user?.full_name || user?.username || "User"}</div>
        <div style={{ color: "#6b7280", fontSize: 12 }}>{user?.email}</div>
      </div>

      <nav className="profilev2-menu">
        {items.map((item) => (
          <button
            key={item.key}
            className={activeKey === item.key ? "active" : ""}
            onClick={() => onChange?.(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar;


