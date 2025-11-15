// Client/components/Profile/ProfileJSX/AccountSecurity.jsx
import React, { useState } from "react";
import "../ProfileCSS/AccountSecurity.css";

const AccountSecurity = () => {
  const [showCurrentPasswordEmail, setShowCurrentPasswordEmail] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReTypePassword, setShowReTypePassword] = useState(false);

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    reTypePassword: "",
  });

  const handleEmailChange = (e) => {
    setEmailForm({
      ...emailForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle email change logic here
    console.log("Email change:", emailForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Password change:", passwordForm);
  };

  return (
    <div className="account-security">
      {/* Email Address Card */}
      <div className="account-security__card">
        <h2 className="account-security__card-title">Email address</h2>
        <div className="account-security__current-email">
          <span className="account-security__current-email-label">Current email:</span>
          <span className="account-security__current-email-value">textxyz@gmail.com</span>
        </div>

        <form onSubmit={handleEmailSubmit} className="account-security__form">
          <div className="account-security__form-group">
            <label className="account-security__label">Enter a new email address</label>
            <input
              type="email"
              name="newEmail"
              value={emailForm.newEmail}
              onChange={handleEmailChange}
              placeholder="Enter a new email address"
              className="account-security__input"
            />
          </div>

          <div className="account-security__form-group">
            <label className="account-security__label">Current password</label>
            <div className="account-security__input-wrapper">
              <input
                type={showCurrentPasswordEmail ? "text" : "password"}
                name="currentPassword"
                value={emailForm.currentPassword}
                onChange={handleEmailChange}
                placeholder="Enter your current password"
                className="account-security__input"
              />
              <button
                type="button"
                className="account-security__eye-btn"
                onClick={() => setShowCurrentPasswordEmail(!showCurrentPasswordEmail)}
              >
                {showCurrentPasswordEmail ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p className="account-security__helper-text">
              For safety reasons, enter your current password.
            </p>
          </div>

          <button type="submit" className="account-security__save-btn">
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div className="account-security__card">
        <h2 className="account-security__card-title">Password</h2>
        <p className="account-security__description">
          Change your password. We recommend using a secure password you don't use anywhere else.
        </p>

        <form onSubmit={handlePasswordSubmit} className="account-security__form">
          <div className="account-security__form-group">
            <label className="account-security__label">Current password</label>
            <div className="account-security__input-wrapper">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                className="account-security__input"
              />
              <button
                type="button"
                className="account-security__eye-btn"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <p className="account-security__helper-text">
              For safety reasons, enter your current password.
            </p>
          </div>

          <div className="account-security__form-group">
            <label className="account-security__label">New password</label>
            <div className="account-security__input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                className="account-security__input"
              />
              <button
                type="button"
                className="account-security__eye-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="account-security__form-group">
            <label className="account-security__label">Re-type new password</label>
            <div className="account-security__input-wrapper">
              <input
                type={showReTypePassword ? "text" : "password"}
                name="reTypePassword"
                value={passwordForm.reTypePassword}
                onChange={handlePasswordChange}
                placeholder="Re-type your new password"
                className="account-security__input"
              />
              <button
                type="button"
                className="account-security__eye-btn"
                onClick={() => setShowReTypePassword(!showReTypePassword)}
              >
                {showReTypePassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button type="submit" className="account-security__save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSecurity;

