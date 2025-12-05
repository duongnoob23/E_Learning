// Client/components/Profile/ProfileJSX/Privacy.jsx
import React, { useState } from "react";
import "../ProfileCSS/Privacy.css";

const Privacy = () => {
  const [profileVisibility, setProfileVisibility] = useState("everyone");
  const [nameVisibility, setNameVisibility] = useState("profile");

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Profile visibility:", profileVisibility);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    console.log("Name visibility:", nameVisibility);
  };

  return (
    <div className="privacy">
      <div className="privacy__grid">
        {/* Left Block: Profile */}
        <div className="privacy__card">
          <h2 className="privacy__title">Profile</h2>
          <p className="privacy__subtitle">Who can see your profile?</p>

          <form onSubmit={handleProfileSubmit} className="privacy__form">
            <div className="privacy__options">
              <label className="privacy__option">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="everyone"
                  checked={profileVisibility === "everyone"}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="privacy__radio"
                />
                <span className="privacy__option-text">Everyone</span>
              </label>

              <label className="privacy__option">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="coursewhiz"
                  checked={profileVisibility === "coursewhiz"}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="privacy__radio"
                />
                <span className="privacy__option-text">CourseWhiz users</span>
              </label>

              <label className="privacy__option">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="me"
                  checked={profileVisibility === "me"}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="privacy__radio"
                />
                <span className="privacy__option-text">Only me</span>
              </label>
            </div>

            <button type="submit" className="privacy__save-btn">
              Save Changes
            </button>
          </form>
        </div>

        {/* Right Block: Name */}
        <div className="privacy__card">
          <h2 className="privacy__title">Name</h2>
          <p className="privacy__subtitle">Who can see your name?</p>

          <form onSubmit={handleNameSubmit} className="privacy__form">
            <div className="privacy__options">
              <label className="privacy__option">
                <input
                  type="radio"
                  name="nameVisibility"
                  value="profile"
                  checked={nameVisibility === "profile"}
                  onChange={(e) => setNameVisibility(e.target.value)}
                  className="privacy__radio"
                />
                <span className="privacy__option-text">
                  Everyone who can see my profile
                </span>
              </label>

              <label className="privacy__option">
                <input
                  type="radio"
                  name="nameVisibility"
                  value="me"
                  checked={nameVisibility === "me"}
                  onChange={(e) => setNameVisibility(e.target.value)}
                  className="privacy__radio"
                />
                <span className="privacy__option-text">Only me</span>
              </label>
            </div>

            <button type="submit" className="privacy__save-btn">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
