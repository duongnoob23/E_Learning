import axiosInstance from "../../../common/services/axiosInstance";

export const profileApi = {
  getMe: async () => {
    const res = await axiosInstance.get("/user/profile");
    return res.data;
  },

  updateProfile: async (payload) => {
    const res = await axiosInstance.patch("/user/profile", payload);
    return res.data;
  },

  changeEmail: async ({ newEmail, currentPassword }) => {
    const res = await axiosInstance.put("/user/change-email", { newEmail, currentPassword });
    return res.data;
  },
  
  changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    const res = await axiosInstance.put("/user/change-password", { currentPassword, newPassword, confirmPassword });
    return res.data;
  },
};
