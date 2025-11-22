// Client/components/Profile/ProfileJSX/AccountSecurity.jsx
import React, { useState } from "react";
import { useGetProfile } from "../../../services/Profile/profileQueries";
import {
  useChangePassword,
  useChangeEmail,
  useVerifyEmailOtp,
} from "../../../services/Profile/profileMutations";
import "../ProfileCSS/AccountSecurity.css";

const AccountSecurity = () => {
  // Lấy thông tin profile để hiển thị email hiện tại
  const { data: profileData } = useGetProfile();
  const profile = profileData?.DT || null;
  const currentEmail = profile?.email || "";

  // Mutations
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();
  const { mutateAsync: changeEmail, isPending: isChangingEmail } =
    useChangeEmail();
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } =
    useVerifyEmailOtp();

  // Password visibility states
  const [showCurrentPasswordEmail, setShowCurrentPasswordEmail] =
    useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReTypePassword, setShowReTypePassword] = useState(false);

  // Email form state
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    reTypePassword: "",
  });

  // OTP state (hiển thị sau khi gửi email change request)
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi API change email (bước 1: gửi OTP)
      await changeEmail({
        newEmail: emailForm.newEmail,
        currentPassword: emailForm.currentPassword,
      });

      // Nếu thành công, hiển thị form nhập OTP
      setShowOtpInput(true);
      setPendingEmail(emailForm.newEmail);
      // Reset form
      setEmailForm({
        newEmail: "",
        currentPassword: "",
      });
    } catch (error) {
      console.error("Error changing email:", error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi API verify OTP (bước 2: xác thực)
      await verifyOtp({
        email: pendingEmail,
        otp: otp,
      });

      // Nếu thành công, reset form và ẩn OTP input
      setShowOtpInput(false);
      setOtp("");
      setPendingEmail("");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.reTypePassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.reTypePassword,
      });

      // Reset form sau khi thành công
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        reTypePassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="account-security">
      {/* Email Address Card */}
      <div className="account-security__card">
        <h2 className="account-security__card-title">Email address</h2>
        <div className="account-security__current-email">
          <span className="account-security__current-email-label">
            Current email:
          </span>
          <span className="account-security__current-email-value">
            {currentEmail || "Loading..."}
          </span>
        </div>

        {!showOtpInput ? (
          <form onSubmit={handleEmailSubmit} className="account-security__form">
            <div className="account-security__form-group">
              <label className="account-security__label">
                Enter a new email address
              </label>
              <input
                type="email"
                name="newEmail"
                value={emailForm.newEmail}
                onChange={handleEmailChange}
                placeholder="Enter a new email address"
                className="account-security__input"
                required
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
                  required
                />
                <button
                  type="button"
                  className="account-security__eye-btn"
                  onClick={() =>
                    setShowCurrentPasswordEmail(!showCurrentPasswordEmail)
                  }
                >
                  {showCurrentPasswordEmail ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <p className="account-security__helper-text">
                For safety reasons, enter your current password.
              </p>
            </div>

            <button
              type="submit"
              className="account-security__save-btn"
              disabled={isChangingEmail}
            >
              {isChangingEmail ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="account-security__form">
            <div className="account-security__form-group">
              <label className="account-security__label">
                Enter OTP sent to {pendingEmail}
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="account-security__input"
                maxLength={6}
                required
              />
              <p className="account-security__helper-text">
                Vui lòng kiểm tra email để lấy mã OTP.
              </p>
            </div>

            <div className="account-security__form-actions">
              <button
                type="submit"
                className="account-security__save-btn"
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                className="account-security__cancel-btn"
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp("");
                  setPendingEmail("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
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

          <button
            type="submit"
            className="account-security__save-btn"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "Changing..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSecurity;

