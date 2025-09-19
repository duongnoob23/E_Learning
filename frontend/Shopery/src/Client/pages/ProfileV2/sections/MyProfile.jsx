import React from "react";

const MyProfile = ({ user }) => {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>My Profile</h3>
      <div className="section-card">
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Basic information</div>
        <div className="form-row">
          <label>Full name</label>
          <input defaultValue={user?.full_name || ""} placeholder="Enter your full name" />
        </div>
        <div className="form-row">
          <label>Phone number</label>
          <input defaultValue={user?.phone_number || ""} placeholder="Enter your phone" />
        </div>
        <div className="actions">
          <button className="btn-secondary">Cancel</button>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;


