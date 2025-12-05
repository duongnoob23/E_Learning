import React, { useState } from "react";
import "./Notification.css";

const Notification = () => {
  const [settings, setSettings] = useState({
    promo: {
      courseRecommendations: false,
      specialOffers: false,
      coursesJoined: false,
      wishlist: false,
      extraInfo: false,
      personalized: false,
    },
    community: {
      someoneFollows: false,
      friendJoins: false,
      liveUpdates: false,
      publishCourse: false,
      priceChanges: false,
    },
    noPromotionalEmails: true,
  });

  const handleChange = (section, field) => {
    if (section === "noPromotionalEmails") {
      setSettings({
        ...settings,
        noPromotionalEmails: !settings.noPromotionalEmails,
      });
    } else {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: !settings[section][field],
        },
      });
    }
  };

  const handleSave = () => {
    console.log("Settings saved:", settings);
    alert("Changes saved!");
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>

      <div className="notifications-card">
        <h3>I want to receive:</h3>

        <div className="section">
          <h4>Notifications about promotions and recommendations</h4>
          <label>
            <input
              type="checkbox"
              checked={settings.promo.courseRecommendations}
              onChange={() =>
                handleChange("promo", "courseRecommendations")
              }
            />
            Course recommendations
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.promo.specialOffers}
              onChange={() => handleChange("promo", "specialOffers")}
            />
            Special offers and new course announcements
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.promo.coursesJoined}
              onChange={() => handleChange("promo", "coursesJoined")}
            />
            About the courses I've joined
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.promo.wishlist}
              onChange={() => handleChange("promo", "wishlist")}
            />
            About courses I've added to my Wishlist
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.promo.extraInfo}
              onChange={() => handleChange("promo", "extraInfo")}
            />
            Extra information about my courses, and other relevant courses or
            products
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.promo.personalized}
              onChange={() => handleChange("promo", "personalized")}
            />
            Personalized course recommendations, promotions, new courses and
            learning tips and tricks to get the most out of your courses
          </label>
        </div>

        <div className="section">
          <h4>Notifications about your courses and community</h4>
          <label>
            <input
              type="checkbox"
              checked={settings.community.someoneFollows}
              onChange={() => handleChange("community", "someoneFollows")}
            />
            Someone follows you
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.community.friendJoins}
              onChange={() => handleChange("community", "friendJoins")}
            />
            A friend you've invited joins CourseWhiz
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.community.liveUpdates}
              onChange={() => handleChange("community", "liveUpdates")}
            />
            Updates about Live sessions for courses you've purchased
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.community.publishCourse}
              onChange={() => handleChange("community", "publishCourse")}
            />
            Someone you follow publishes a course
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.community.priceChanges}
              onChange={() => handleChange("community", "priceChanges")}
            />
            Price changes for courses you're interested in
          </label>
        </div>

        <div className="section">
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={settings.noPromotionalEmails}
              onChange={() => handleChange("noPromotionalEmails")}
            />
            <strong>Don’t send me any promotional emails</strong>
          </label>
          <p className="note">
            If this box is checked, please note that you will continue to
            receive important transactional emails like purchase receipts.
          </p>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Notification;
