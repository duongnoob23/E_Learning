import axiosInstance from "../../../common/services/axiosInstance";

export const profileApi = {
  getMe: async () => {
    const res = await axiosInstance.get("/user/profile");
    return res.data;
  },

  updateProfile: async (payload) => {
    // Nếu có file (avatar) thì gửi FormData
    if (payload && (payload.avatarFile || payload.isFormData)) {
      const formData = new FormData();
      if (payload.username !== undefined) formData.append("username", payload.username);
      if (payload.full_name !== undefined) formData.append("full_name", payload.full_name);
      if (payload.phone_number !== undefined) formData.append("phone_number", payload.phone_number);
      if (payload.avatarFile) formData.append("avatar", payload.avatarFile);
      if (payload.avatar_url && !payload.avatarFile) formData.append("avatar_url", payload.avatar_url);

      const res = await axiosInstance.patch("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    }

    const res = await axiosInstance.patch("/user/profile", payload);
    return res.data;
  },

  changeEmail: async ({ newEmail, currentPassword }) => {
    const res = await axiosInstance.put("/user/change-email", { newEmail, currentPassword });
    return res.data;
  },

  changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    const res = await axiosInstance.patch("/user/change-password", { currentPassword, newPassword, confirmPassword });
    return res.data;
  },

  updateLocalization: async ({ language, currency }) => {
    const res = await axiosInstance.put("/user/localization", { language, currency });
    return res.data;
  },
};


