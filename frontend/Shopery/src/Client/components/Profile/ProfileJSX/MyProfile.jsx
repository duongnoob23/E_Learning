// Client/components/Profile/ProfileJSX/MyProfile.jsx
import React, { useState } from "react";
import "../ProfileCSS/MyProfile.css";

const MyProfile = () => {
  const [formData, setFormData] = useState({
    username: "xyz@12345",
    fullName: "",
    location: "Kathmandu, Nepal",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    website: "xyz@12345",
    language: "English",
    about: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleAvatarUpdate = () => {
    // Handle avatar update logic
    console.log("Update avatar");
  };

  const handleAvatarRemove = () => {
    // Handle avatar remove logic
    console.log("Remove avatar");
  };

  return (
    <div className="my-profile">
      {/* Avatar Section */}
      <div className="my-profile__avatar-section">
        <div className="my-profile__avatar-wrapper">
          <img
            src="https://images.unsplash.com/photo-1757351122515-21a7b61d682e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
            alt="Profile Avatar"
            className="my-profile__avatar"
          />
        </div>
        <div className="my-profile__avatar-buttons">
          <button
            type="button"
            className="my-profile__btn my-profile__btn--update"
            onClick={handleAvatarUpdate}
          >
            Update
          </button>
          <button
            type="button"
            className="my-profile__btn my-profile__btn--remove"
            onClick={handleAvatarRemove}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="my-profile__form">
        <div className="my-profile__form-grid">
          {/* Left Column */}
          <div className="my-profile__form-column">
            {/* User name */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">
                User name<span className="my-profile__required">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="xyz@12345"
                className="my-profile__input"
              />
            </div>

            {/* Location */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Location</label>
              <div className="my-profile__input-wrapper">
                <span className="my-profile__input-icon">📍</span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Kathmandu, Nepal"
                  className="my-profile__input my-profile__input--with-icon"
                />
                <span className="my-profile__dropdown-arrow">▼</span>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Date of Birth</label>
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                className="my-profile__input"
              />
            </div>

            {/* Website */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="xyz@12345"
                className="my-profile__input"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="my-profile__form-column">
            {/* Full Name */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="my-profile__input"
              />
            </div>

            {/* Phone Number */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="my-profile__input"
              />
            </div>

            {/* Gender */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Gender</label>
              <div className="my-profile__radio-group">
                <label className="my-profile__radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="my-profile__radio"
                  />
                  <span>Male</span>
                </label>
                <label className="my-profile__radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="my-profile__radio"
                  />
                  <span>Female</span>
                </label>
                <label className="my-profile__radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                    className="my-profile__radio"
                  />
                  <span>Other</span>
                </label>
              </div>
            </div>

            {/* Language */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Language</label>
              <div className="my-profile__input-wrapper">
                <span className="my-profile__input-icon">🌐</span>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="English"
                  className="my-profile__input my-profile__input--with-icon"
                />
                <span className="my-profile__dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* About Section - Full Width */}
        <div className="my-profile__form-group my-profile__form-group--full">
          <label className="my-profile__label">
            Tell us something about yourself
          </label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tell us something about yourself…"
            className="my-profile__textarea"
            rows="5"
          />
        </div>

        {/* Submit Button */}
        <div className="my-profile__form-actions">
          <button type="submit" className="my-profile__submit-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;

