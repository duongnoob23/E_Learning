// Client/components/Profile/ProfileJSX/MyProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useGetProfile } from "../../../services/Profile/profileQueries";
import { useUpdateProfile } from "../../../services/Profile/profileMutations";
import "../ProfileCSS/MyProfile.css";

const MyProfile = () => {
  // Lấy thông tin profile từ API
  const { data: profileData, isLoading } = useGetProfile();
  const profile = profileData?.DT || null;

  // Mutations
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateProfile();

  // File input ref
  const fileInputRef = useRef(null);

  // Form state - các trường từ API và các trường local
  const [formData, setFormData] = useState({
    // Các trường từ API (sẽ được load từ profile)
    username: "",
    full_name: "",
    phone_number: "",
    // Các trường local (không có trong database - giữ nguyên)
    location: "Kathmandu, Nepal",
    dateOfBirth: "",
    gender: "",
    website: "",
    language: "English",
    about: "",
  });

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Load profile data vào form khi có data (chỉ các trường có trong database)
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev, // Giữ nguyên các trường local
        // Chỉ update các trường từ API
        username: profile.username || "",
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
      }));

      // Set avatar preview từ API
      if (profile.avatar_url) {
        setAvatarPreview(`http://localhost:5000${profile.avatar_url}`);
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chỉ gửi các trường có trong database lên API
      const payload = {
        username: formData.username,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
      };

      // Nếu có avatar file mới, thêm vào payload
      if (avatarFile) {
        payload.avatarFile = avatarFile;
      }

      // Cập nhật profile (chỉ các trường có trong database)
      await updateProfile(payload);
      
      // Các trường local (location, dateOfBirth, gender, website, language, about)
      // không được gửi lên API, chỉ lưu ở local state
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarUpdate = () => {
    // Trigger file input click
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File ảnh không được vượt quá 5MB");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="my-profile">Đang tải thông tin profile...</div>;
  }

  // Default avatar URL
  const defaultAvatarUrl =
    "https://images.unsplash.com/photo-1757351122515-21a7b61d682e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="my-profile">
      {/* Avatar Section */}
      <div className="my-profile__avatar-section">
        <div className="my-profile__avatar-wrapper">
          <img
            src={avatarPreview || defaultAvatarUrl}
            alt="Profile Avatar"
            className="my-profile__avatar"
          />
        </div>
        <div className="my-profile__avatar-buttons">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarFileChange}
          />
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
            disabled={!avatarPreview && !profile?.avatar_url}
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
            {/* User name - từ API */}
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
                required
              />
            </div>

            {/* Location - local (không có trong database) */}
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

            {/* Date of Birth - local (không có trong database) */}
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

            {/* Website - local (không có trong database) */}
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
            {/* Full Name - từ API */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="my-profile__input"
              />
            </div>

            {/* Phone Number - từ API */}
            <div className="my-profile__form-group">
              <label className="my-profile__label">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="my-profile__input"
              />
            </div>

            {/* Gender - local (không có trong database) */}
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

            {/* Language - local (không có trong database) */}
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

        {/* About Section - Full Width - local (không có trong database) */}
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
          <button
            type="submit"
            className="my-profile__submit-btn"
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;

