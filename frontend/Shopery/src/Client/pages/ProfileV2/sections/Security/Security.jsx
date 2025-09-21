import React from "react";
import { useChangePassword, useChangeEmail, useUpdateLocalization } from "../../../../services/Profile/profileMutations";
import { toast } from "react-toastify";
import "./Secutity.css";

const Security = () => {
  const [passwordForm, setPasswordForm] = React.useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [emailForm, setEmailForm] = React.useState({ newEmail: "", currentPassword: "" });
  const [localeForm, setLocaleForm] = React.useState({ language: "en", currency: "USD" });

  const changePassword = useChangePassword();
  const changeEmail = useChangeEmail();
  const updateLocalization = useUpdateLocalization();

  // Validation cho password
  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      isValid: minLength && hasLowerCase && hasUpperCase && hasNumber,
      errors: {
        minLength: !minLength ? "Mật khẩu phải có ít nhất 6 ký tự" : null,
        hasLowerCase: !hasLowerCase ? "Mật khẩu phải có ít nhất 1 chữ thường" : null,
        hasUpperCase: !hasUpperCase ? "Mật khẩu phải có ít nhất 1 chữ hoa" : null,
        hasNumber: !hasNumber ? "Mật khẩu phải có ít nhất 1 số" : null,
      }
    };
  };

  const onSubmitPassword = (e) => {
    e.preventDefault();

    // Validation
    if (!passwordForm.currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!passwordForm.newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (!passwordForm.confirmPassword) {
      toast.error("Vui lòng xác nhận mật khẩu mới");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp");
      return;
    }

    const passwordValidation = validatePassword(passwordForm.newPassword);
    if (!passwordValidation.isValid) {
      const errors = Object.values(passwordValidation.errors).filter(Boolean);
      toast.error(errors.join(", "));
      return;
    }

    changePassword.mutate(passwordForm);
  };

  const onSubmitEmail = (e) => {
    e.preventDefault();

    // Validation
    if (!emailForm.newEmail) {
      toast.error("Vui lòng nhập email mới");
      return;
    }

    if (!emailForm.currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail)) {
      toast.error("Email không hợp lệ");
      return;
    }

    changeEmail.mutate(emailForm);
  };

  const onSubmitLocale = (e) => {
    e.preventDefault();
    updateLocalization.mutate(localeForm);
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Account Security</h3>

      <div className="section-card">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Email address</div>
        <form onSubmit={onSubmitEmail} className="form-row">
          <div className="form-group">
            <label>Email mới</label>
            <input
              type="email"
              placeholder="Nhập địa chỉ email mới"
              value={emailForm.newEmail}
              onChange={(e)=>setEmailForm({ ...emailForm, newEmail: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu hiện tại để xác nhận"
              value={emailForm.currentPassword}
              onChange={(e)=>setEmailForm({ ...emailForm, currentPassword: e.target.value })}
              required
            />
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              type="submit"
              disabled={changeEmail.isPending}
              style={{
                opacity: changeEmail.isPending ? 0.7 : 1,
                cursor: changeEmail.isPending ? "not-allowed" : "pointer"
              }}
            >
              {changeEmail.isPending ? "Đang gửi OTP..." : "Đổi Email"}
            </button>
          </div>

          {changeEmail.isSuccess && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              OTP đã được gửi đến email mới. Vui lòng kiểm tra email và xác thực OTP.
            </div>
          )}
        </form>
      </div>

      <div className="section-card">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Password</div>
        <form onSubmit={onSubmitPassword} className="form-row">
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              value={passwordForm.currentPassword}
              onChange={(e)=>setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={passwordForm.newPassword}
              onChange={(e)=>setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            {passwordForm.newPassword && (
              <div style={{ fontSize: '12px', marginTop: '4px', color: '#666' }}>
                Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={passwordForm.confirmPassword}
              onChange={(e)=>setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
            {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
              <div style={{ fontSize: '12px', marginTop: '4px', color: '#dc3545' }}>
                Mật khẩu không khớp
              </div>
            )}
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              type="submit"
              disabled={changePassword.isPending}
              style={{
                opacity: changePassword.isPending ? 0.7 : 1,
                cursor: changePassword.isPending ? "not-allowed" : "pointer"
              }}
            >
              {changePassword.isPending ? "Đang cập nhật..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>

      <div className="section-card">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Language and Currency</div>
        <form onSubmit={onSubmitLocale} className="form-row">
          <select value={localeForm.language} onChange={(e)=>setLocaleForm({ ...localeForm, language: e.target.value })}>
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
          </select>
          <select value={localeForm.currency} onChange={(e)=>setLocaleForm({ ...localeForm, currency: e.target.value })}>
            <option value="USD">$ - US Dollar</option>
            <option value="VND">₫ - Vietnamese Dong</option>
          </select>
          <div className="actions">
            <button className="btn-primary" type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Security;


