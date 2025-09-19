import React from "react";
import { useChangePassword, useChangeEmail, useUpdateLocalization } from "../../../services/Profile/profileMutations";

const Security = () => {
  const [passwordForm, setPasswordForm] = React.useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [emailForm, setEmailForm] = React.useState({ newEmail: "", currentPassword: "" });
  const [localeForm, setLocaleForm] = React.useState({ language: "en", currency: "USD" });

  const changePassword = useChangePassword();
  const changeEmail = useChangeEmail();
  const updateLocalization = useUpdateLocalization();

  const onSubmitPassword = (e) => {
    e.preventDefault();
    changePassword.mutate(passwordForm);
  };

  const onSubmitEmail = (e) => {
    e.preventDefault();
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
          <input type="email" placeholder="Enter a new email address" value={emailForm.newEmail} onChange={(e)=>setEmailForm({ ...emailForm, newEmail: e.target.value })} />
          <input type="password" placeholder="Current password" value={emailForm.currentPassword} onChange={(e)=>setEmailForm({ ...emailForm, currentPassword: e.target.value })} />
          <div className="actions">
            <button className="btn-primary" type="submit">Save Changes</button>
          </div>
        </form>
      </div>

      <div className="section-card">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Password</div>
        <form onSubmit={onSubmitPassword} className="form-row">
          <input type="password" placeholder="Enter current password" value={passwordForm.currentPassword} onChange={(e)=>setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          <input type="password" placeholder="Enter new password" value={passwordForm.newPassword} onChange={(e)=>setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          <input type="password" placeholder="Re-type new password" value={passwordForm.confirmPassword} onChange={(e)=>setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
          <div className="actions">
            <button className="btn-primary" type="submit">Save Changes</button>
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


