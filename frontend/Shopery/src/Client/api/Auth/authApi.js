import axiosInstance from "../../../lib/axiosInstance";

export const authApi1 = {
  login: async (credentials) => {
    return await axiosInstance.post("/auth/login", credentials);
  },

  register: async (userData) => {
    return await axiosInstance.post("/auth/register", userData);
  },

  verifyEmail: async ({ email, otp }) => {
    const res = await axiosInstance.post("/auth/verify-email", {
      email,
      otp,
    });
    return res.data;
  },
};

export const authApi = {
  // Login - giữ nguyên Redux
  login: async (credentials) => {
    return await axiosInstance.post("/auth/login", credentials);
  },

  // Register - giữ nguyên Redux
  register: async (userData) => {
    return await axiosInstance.post("/auth/register", userData);
  },

  // Verify Email - dùng TanStack Query
  verifyEmail: async ({ email, otp }) => {
    const response = await axiosInstance.post("/auth/verify-email", {
      email,
      otp,
    });
    return response.data;
  },

  // Forgot Password - dùng TanStack Query
  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  // Reset Password - dùng TanStack Query
  resetPassword: async ({ email, newPassword }) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  },

  // Refresh Token - giữ nguyên Redux
  refreshToken: async (refreshToken) => {
    return await axiosInstance.post("/auth/refresh-token", { refreshToken });
  },

  // Logout - giữ nguyên Redux
  logout: async () => {
    return await axiosInstance.post("/auth/logout");
  },
};
