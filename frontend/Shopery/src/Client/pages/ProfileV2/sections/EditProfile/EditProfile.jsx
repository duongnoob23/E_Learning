import React, { useEffect, useState } from "react";
import { useUpdateProfile } from "../../../../services/Profile/profileMutations";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../../lib/queryKeys";
import { toast } from "react-toastify";
import "./EditProfile.css";

// Base URL cho backend
const BASE_URL = "http://localhost:5000";

const EditProfile = ({ user }) => {
  const queryClient = useQueryClient();

  // form state
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    phone_number: "",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const updateProfile = useUpdateProfile({
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0" && DT) {
        // Invalidate profile query để tự động refetch dữ liệu mới
        queryClient.invalidateQueries(queryKeys.user.profile);

        // Cập nhật cache trực tiếp để UI phản hồi ngay lập tức
        queryClient.setQueryData(queryKeys.user.profile, (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              DT: DT // DT chứa user data mới từ server
            };
          }
          return oldData;
        });

        // Reset form với dữ liệu mới
        setForm({
          username: DT.username || "",
          full_name: DT.full_name || "",
          phone_number: DT.phone_number || "",
          avatar_url: DT.avatar_url || "",
        });
        setPreviewUrl(DT.avatar_url || "");
        setAvatarFile(null);

        toast.success(EM || "Cập nhật profile thành công!");
      } else {
        toast.error(EM || "Cập nhật profile thất bại!");
      }
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      toast.error("Cập nhật profile thất bại!");
    }
  });

  // populate dữ liệu cũ ngay khi component mount hoặc user thay đổi
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        full_name: user.full_name || "",
        phone_number: user.phone_number || "",
        avatar_url: user.avatar_url || "",
      });
      setPreviewUrl(user.avatar_url || "");
    }
  }, [user]);

  // Xử lý avatar URL để hiển thị đúng
  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return "";
    if (avatarUrl.startsWith("http")) return avatarUrl;
    if (avatarUrl.startsWith("data:")) return avatarUrl; // Base64 data URL
    return BASE_URL + avatarUrl;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (avatarFile) {
      const fd = new FormData();
      fd.append("username", form.username);
      fd.append("full_name", form.full_name);
      fd.append("phone_number", form.phone_number);
      fd.append("avatar_url", form.avatar_url);
      fd.append("avatar", avatarFile);

      updateProfile.mutate(fd);
    } else {
      updateProfile.mutate(form);
    }
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Edit Profile</h3>
      <div className="section-card" style={{ textAlign: "center" }}>
        <div className="profilev2-avatar" style={{ margin: "0 auto", position: "relative" }}>
          {(previewUrl || form.avatar_url) ? (
            <img
              src={getAvatarUrl(previewUrl || form.avatar_url)}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%"
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: "50%",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#666"
            }}>
              {(form.full_name?.[0] || form.username?.[0] || "U").toUpperCase()}
            </div>
          )}
        </div>
        <div className="actions" style={{ justifyContent: "center", marginTop: "1rem" }}>
          <label
            htmlFor="avatar-upload"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {(previewUrl || form.avatar_url) ? "Thay đổi ảnh" : "Chọn ảnh"}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              // Validate file size (max 5MB)
              if (file.size > 5 * 1024 * 1024) {
                toast.error("Kích thước ảnh không được vượt quá 5MB");
                return;
              }

              // Validate file type
              if (!file.type.startsWith('image/')) {
                toast.error("Vui lòng chọn file ảnh");
                return;
              }

              setAvatarFile(file);
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result;
                setPreviewUrl(result);
                setForm({ ...form, avatar_url: result });
              };
              reader.readAsDataURL(file);
            }}
          />
          {(previewUrl || form.avatar_url) && (
            <button
              type="button"
              onClick={() => {
                setPreviewUrl("");
                setForm({ ...form, avatar_url: user?.avatar_url || "" });
                setAvatarFile(null);
              }}
              style={{
                marginLeft: "8px",
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Khôi phục ảnh gốc
            </button>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="form-row">
        <div className="form-group">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Nhập họ và tên đầy đủ"
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="tel"
            value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="actions">
          <button
            className="btn-primary"
            type="submit"
            disabled={updateProfile.isPending}
            style={{
              opacity: updateProfile.isPending ? 0.7 : 1,
              cursor: updateProfile.isPending ? "not-allowed" : "pointer"
            }}
          >
            {updateProfile.isPending ? "Đang cập nhật..." : "Cập nhật Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
