// Auth API - API calls cho Authentication cơ bản
import axiosInstance from "../axiosInstance";

export const authApi = {
  // Đăng nhập
  login: async (credentials) => {
    return await axiosInstance.post("/auth/login", credentials);
  },

  // Đăng ký
  register: async (userData) => {
    return await axiosInstance.post("/auth/register", userData);
  },

  // Đăng xuất
  logout: async () => {
    return await axiosInstance.post("/auth/logout");
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return await axiosInstance.post("/auth/refresh", { refreshToken });
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    return await axiosInstance.post("/auth/forgot-password", { email });
  },

  // Reset mật khẩu
  resetPassword: async (token, newPassword) => {
    return await axiosInstance.post("/auth/reset-password", {
      token,
      newPassword,
    });
  },

  // Xác thực email
  verifyEmail: async (token) => {
    return await axiosInstance.post("/auth/verify-email", { token });
  },

  // Gửi lại email xác thực
  resendVerification: async (email) => {
    return await axiosInstance.post("/auth/resend-verification", { email });
  },

  // Kiểm tra token có hợp lệ không
  validateToken: async () => {
    return await axiosInstance.get("/auth/validate");
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    return await axiosInstance.get("/auth/me");
  },
};
