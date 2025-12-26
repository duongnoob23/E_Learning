import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper để check token hết hạn
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Helper để check token có phải admin token không
const isAdminToken = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.isAdmin === true;
  } catch (error) {
    return false;
  }
};

export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      // State
      adminUser: null,
      adminToken: null,
      adminRefreshToken: null,
      isAdminAuthenticated: false,
      error: null,

      // Actions
      setAdminCredentials: (credentials) => {
        const { accessToken, refreshToken, user } = credentials;
        set({
          adminUser: user,
          adminToken: accessToken,
          adminRefreshToken: refreshToken,
          isAdminAuthenticated: true,
          error: null,
        });
        // Lưu vào localStorage với key riêng
        localStorage.setItem("admin_access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("admin_refresh_token", refreshToken);
        }
        if (user) {
          localStorage.setItem("admin_user", JSON.stringify(user));
        }
      },

      clearAdminCredentials: () => {
        set({
          adminUser: null,
          adminToken: null,
          adminRefreshToken: null,
          isAdminAuthenticated: false,
          error: null,
        });
        // Xóa khỏi localStorage
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        localStorage.removeItem("admin_user");
      },

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Check admin auth status từ localStorage
      checkAdminAuth: () => {
        const token = localStorage.getItem("admin_access_token");
        const user = localStorage.getItem("admin_user");

        if (token && user && !isTokenExpired(token) && isAdminToken(token)) {
          set({
            adminToken: token,
            adminUser: JSON.parse(user),
            isAdminAuthenticated: true,
          });
          return true;
        } else {
          get().clearAdminCredentials();
          return false;
        }
      },

      // Logout admin
      logout: () => {
        get().clearAdminCredentials();
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        adminUser: state.adminUser,
        adminToken: state.adminToken,
        adminRefreshToken: state.adminRefreshToken,
        isAdminAuthenticated: state.isAdminAuthenticated,
      }),
    }
  )
);

