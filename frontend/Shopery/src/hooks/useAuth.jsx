// useAuth Hook - Custom hook để quản lý authentication (Dùng chung)
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
  clearCredentials,
  setCredentials,
} from "../redux/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  // Đăng nhập - Fix cứng cho tài khoản test
  const login = useCallback(
    async (credentials) => {
      try {
        // Fix cứng tài khoản test
        if (
          credentials.username === "duong4399" &&
          credentials.password === "123"
        ) {
          const mockUser = {
            id: 1,
            username: "duong4399",
            email: "duong4399@example.com",
            role: "client",
            firstName: "Duong",
            lastName: "Nguyen",
          };

          const mockToken = "mock-jwt-token-for-testing";

          // Dispatch action để set credentials
          dispatch(
            setCredentials({
              token: mockToken,
              refreshToken: "mock-refresh-token",
              user: mockUser,
            })
          );

          return { success: true, data: { user: mockUser, token: mockToken } };
        } else {
          return {
            success: false,
            error: "Tên đăng nhập hoặc mật khẩu không đúng",
          };
        }
      } catch (error) {
        return { success: false, error: "Đăng nhập thất bại" };
      }
    },
    [dispatch]
  );

  // Đăng ký
  const register = useCallback(
    async (userData) => {
      try {
        const result = await dispatch(registerUser(userData)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    [dispatch]
  );

  // Đăng xuất
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return { success: true };
    } catch (error) {
      // Vẫn clear credentials dù API lỗi
      dispatch(clearCredentials());
      return { success: true };
    }
  }, [dispatch]);

  // Clear error
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Kiểm tra role
  const isAdmin = useCallback(() => {
    return user?.role === "admin";
  }, [user]);

  const isClient = useCallback(() => {
    return user?.role === "client" || user?.role === "user";
  }, [user]);

  // Kiểm tra permission
  const hasPermission = useCallback(
    (permission) => {
      if (!user || !user.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  // Kiểm tra có đăng nhập không (real-time)
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }, []);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    clearAuthError,

    // Utilities
    isAdmin,
    isClient,
    hasPermission,
    checkAuth,
  };
};
