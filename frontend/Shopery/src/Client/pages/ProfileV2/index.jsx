import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import "./profile.css";

// Components
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileHeader from "./components/ProfileHeader";

// Sections
import MyProfile from "./sections/MyProfile";
import Security from "./sections/Security";
import Privacy from "./sections/Privacy";
import Notification from "./sections/Notification";
import EditProfile from "./sections/EditProfile";

const tabs = [
  { key: "profile", label: "My Profile", component: MyProfile },
  { key: "edit", label: "Edit Profile", component: EditProfile },
  { key: "security", label: "Account Security", component: Security },
  { key: "privacy", label: "Privacy", component: Privacy },
  { key: "notifications", label: "Notifications", component: Notification },
];

const ProfilePageV2 = () => {
    const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  });

  const [activeKey, setActiveKey] = React.useState("profile");

  const ActiveSection = useMemo(() => {
    const found = tabs.find((t) => t.key === activeKey);
    return found ? found.component : Security;
  }, [activeKey]);

  return (
    <div className="profilev2-container">
      <ProfileHeader user={user} />
      <div className="profilev2-content">
        <aside className="profilev2-sidebar">
          <ProfileSidebar
            user={user}
            activeKey={activeKey}
            onChange={(k) => setActiveKey(k)}
            items={tabs}
          />
        </aside>
        <section className="profilev2-section">
          <ActiveSection user={user} />
        </section>
      </div>
    </div>
  );
};

export default ProfilePageV2;


