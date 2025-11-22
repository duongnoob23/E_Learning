// D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce\frontend\Shopery\src\Client\api\Profile\profileApi.js
import axiosInstance from "../../../lib/axiosInstance";

export const profileApi = {
  // GET /user/profile - Lấy thông tin profile của user hiện tại - DONE
  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error Response:", error?.response?.data);
      throw error;
    }
  },

  // PATCH /user/profile - Cập nhật thông tin profile - DONE
  updateProfile: async (payload) => {
    // Nếu có file (avatar) thì gửi FormData
    if (payload && (payload.avatarFile || payload instanceof FormData)) {
      const formData = payload instanceof FormData ? payload : new FormData();

      if (!(payload instanceof FormData)) {
        if (payload.username !== undefined)
          formData.append("username", payload.username);
        if (payload.full_name !== undefined)
          formData.append("full_name", payload.full_name);
        if (payload.phone_number !== undefined)
          formData.append("phone_number", payload.phone_number);
        if (payload.avatarFile) formData.append("avatar", payload.avatarFile);
        if (payload.avatar_url && !payload.avatarFile)
          formData.append("avatar_url", payload.avatar_url);
      }

      const response = await axiosInstance.patch("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    // Nếu không có file, gửi JSON
    const response = await axiosInstance.patch("/user/profile", payload);
    return response.data;
  },

  // GET /user/stats - Lấy thống kê của user - DONE
  getUserStats: async () => {
    const response = await axiosInstance.get("/user/stats");
    return response.data;
  },

  // PATCH /user/change-password - Đổi mật khẩu - DONE
  changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    const response = await axiosInstance.patch("/user/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  // POST /user/upload-avatar - Upload avatar riêng - DONE
  uploadAvatar: async (avatarFile) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await axiosInstance.post("/user/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // PATCH /user/change-email - Đổi email (bước 1: gửi OTP) - DONE
  changeEmail: async ({ newEmail, currentPassword }) => {
    const response = await axiosInstance.patch("/user/change-email", {
      newEmail,
      currentPassword,
    });
    return response.data;
  },

  // POST /user/verify-email - Xác thực OTP đổi email (bước 2) - DONE
  verifyEmailOtp: async ({ email, otp }) => {
    const response = await axiosInstance.post("/user/verify-email", {
      email,
      otp,
    });
    return response.data;
  },
};
