import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Tạo axios instance riêng cho admin
const adminAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor để thêm admin token
adminAxiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("admin_access_token");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để handle errors
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token hết hạn hoặc không có quyền
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      localStorage.removeItem("admin_user");
      // Redirect về admin login
      if (
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// Admin Auth API
export const adminAuthApi = {
  // Admin Login
  login: async (email, password) => {
    console.log("🔐 [FRONTEND] Admin login attempt");
    console.log("📍 API Base URL:", API_BASE_URL);
    console.log("📍 Full URL:", `${API_BASE_URL}/admin/auth/login`);
    console.log("📍 Email:", email);
    
    try {
      const response = await adminAxiosInstance.post("/admin/auth/login", {
        email,
        password,
      });
      console.log("✅ [FRONTEND] Admin login success:", response.data.EC);
      return response.data;
    } catch (error) {
      console.error("❌ [FRONTEND] Admin login error:");
      console.error("   - Message:", error.message);
      console.error("   - Code:", error.code);
      console.error("   - Response:", error.response?.data);
      console.error("   - Status:", error.response?.status);
      console.error("   - URL:", error.config?.url);
      console.error("   - Base URL:", error.config?.baseURL);
      throw error;
    }
  },

  // Admin Logout
  logout: async (refreshToken) => {
    const response = await adminAxiosInstance.post("/admin/auth/logout", {
      refreshToken,
    });
    return response.data;
  },

  // Refresh Admin Token
  refreshToken: async (refreshToken) => {
    const response = await adminAxiosInstance.post(
      "/admin/auth/refresh-token",
      {
        refreshToken,
      }
    );
    return response.data;
  },

  // Get Current Admin User
  getCurrentAdmin: async () => {
    const response = await adminAxiosInstance.get("/admin/auth/me");
    return response.data;
  },
};

export default adminAxiosInstance;
