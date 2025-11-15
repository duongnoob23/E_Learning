import axiosInstance from "../../../common/services/axiosInstance";

export const profileApi = {
  getMe: async () => {
    const res = await axiosInstance.get("/user/profile");
    return res.data;
  },

  updateProfile: async (payload) => {
    console.log("updateProfile payload:", payload);

    // Nếu có file (avatar) thì gửi FormData
    if (payload && (payload.avatarFile || payload instanceof FormData)) {
      const formData = payload instanceof FormData ? payload : new FormData();

      if (!(payload instanceof FormData)) {
        if (payload.username !== undefined) formData.append("username", payload.username);
        if (payload.full_name !== undefined) formData.append("full_name", payload.full_name);
        if (payload.phone_number !== undefined) formData.append("phone_number", payload.phone_number);
        if (payload.avatarFile) formData.append("avatar", payload.avatarFile);
        if (payload.avatar_url && !payload.avatarFile) formData.append("avatar_url", payload.avatar_url);
      }

      const res = await axiosInstance.patch("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    }

    const res = await axiosInstance.patch("/user/profile", payload);
    return res.data;
  },

  changeEmail: async ({ newEmail, currentPassword }) => {
    const res = await axiosInstance.patch("/user/change-email", { newEmail, currentPassword });
    return res.data;
  },
  
  changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    const res = await axiosInstance.patch("/user/change-password", { currentPassword, newPassword, confirmPassword });
    return res.data;
  },

  verifyEmailOtp: async ({ email, otp }) => {
    const res = await axiosInstance.post("/user/verify-email", { email, otp });
    return res.data;
  },

  // Privacy settings
  getPrivacySettings: async () => {
    const res = await axiosInstance.get("/user/privacy");
    return res.data;
  },

  updatePrivacySettings: async (settings) => {
    const res = await axiosInstance.patch("/user/privacy", settings);
    return res.data;
  },

  // Notification settings
  getNotificationSettings: async () => {
    const res = await axiosInstance.get("/user/notifications");
    return res.data;
  },

  updateNotificationSettings: async (settings) => {
    const res = await axiosInstance.patch("/user/notifications", settings);
    return res.data;
  },

  // Localization (Language & Currency)
  updateLocalization: async ({ language, currency }) => {
    const res = await axiosInstance.patch("/user/localization", { language, currency });
    return res.data;
  },
};
