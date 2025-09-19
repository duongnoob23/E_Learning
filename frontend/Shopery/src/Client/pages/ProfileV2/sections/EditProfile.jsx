import React from "react";
import { useSelector } from "react-redux";
import { useUpdateProfile } from "../../../services/Profile/profileMutations";

const EditProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = React.useState({
    username: user?.username || "",
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    avatar_url: user?.avatar_url || "",
  });

  const updateProfile = useUpdateProfile();
  const [avatarFile, setAvatarFile] = React.useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate(form);
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Edit Profile</h3>
      <div className="section-card" style={{ textAlign: "center" }}>
        <div className="profilev2-avatar" style={{ margin: "0 auto" }}>
          {form.avatar_url ? (
            <img src={form.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            (form.full_name?.[0] || form.username?.[0] || "U").toUpperCase()
          )}
        </div>
        <div className="actions" style={{ justifyContent: "center" }}>
          <input type="file" accept="image/*" onChange={(e)=>{
            const file = e.target.files?.[0];
            if (!file) return;
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = () => setForm({ ...form, avatar_url: reader.result });
            reader.readAsDataURL(file);
          }} />
        </div>
      </div>

      <form onSubmit={onSubmit} className="form-row">
        <label>User name</label>
        <input value={form.username} onChange={(e)=>setForm({ ...form, username: e.target.value })} />
        <label>Full name</label>
        <input value={form.full_name} onChange={(e)=>setForm({ ...form, full_name: e.target.value })} />
        <label>Phone Number</label>
        <input value={form.phone_number} onChange={(e)=>setForm({ ...form, phone_number: e.target.value })} />
        <div className="actions">
          <button className="btn-primary" type="submit" disabled={updateProfile.isPending} onClick={(e)=>{
            e.preventDefault();
            updateProfile.mutate({ ...form, avatarFile, isFormData: !!avatarFile });
          }}>Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;


