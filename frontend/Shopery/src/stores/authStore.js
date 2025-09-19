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

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,

      // Actions
      setCredentials: (credentials) => {
        const { token, refreshToken, user } = credentials;
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      clearCredentials: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Check auth status từ localStorage
      checkAuth: () => {
        const token = localStorage.getItem("access_token");
        const user = localStorage.getItem("user");

        if (token && user && !isTokenExpired(token)) {
          set({
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
          });
          return true;
        } else {
          get().clearCredentials();
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
