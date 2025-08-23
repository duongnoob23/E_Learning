// Auth Slice - Quản lý trạng thái đăng nhập (Dùng chung)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../common/services/Auth/authApi";
import {
  normalizeAuthResponse,
  normalizeError,
} from "../../Helper/responseHandler";
// Helper functions
const tokenHelper = {
  getAccessToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  },

  getRefreshToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  },

  getUserInfo: () => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("user_info");
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  },

  setTokens: (accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }
    }
  },

  setUserInfo: (userInfo) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_info", JSON.stringify(userInfo));
    }
  },

  removeTokens: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
    }
  },

  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  isAuthenticated: () => {
    const token = tokenHelper.getAccessToken();
    return token && !tokenHelper.isTokenExpired(token);
  },
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await authApi.login(credentials);
      const { EM, EC, DT } = normalizeAuthResponse(res);

      if (EC !== "0" || !DT) {
        return rejectWithValue({ EM, EC, DT });
      }

      const { access_token, refresh_token, user } = DT || {};
      if (!access_token || !refresh_token || !user) {
        return rejectWithValue({
          EM: "Thiếu access_token, refresh_token hoặc user",
          EC: "-2",
          DT: null,
        });
      }

      tokenHelper.setTokens(access_token, refresh_token);
      tokenHelper.setUserInfo(user);

      return { EM, EC, DT };
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      const { EM, EC, DT } = normalizeAuthResponse(response);

      if (EC !== "0" || !DT) {
        return rejectWithValue({ EM, EC, DT });
      }

      return { EM, EC, DT };
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // await authApi.logout()
      // tạm thời không cần gọi api logout chỉ  cần xóa token thôi
      console.log("🚀 ~ logout:");
      tokenHelper.removeTokens();
      return true;
    } catch (error) {
      tokenHelper.removeTokens(); // Vẫn xóa token dù API lỗi
      return rejectWithValue(
        error.response?.data?.message || "Đăng xuất thất bại"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = tokenHelper.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await authApi.refreshToken(refreshToken);
      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      tokenHelper.setTokens(newToken, newRefreshToken);
      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      tokenHelper.removeTokens();
      return rejectWithValue("Phiên đăng nhập đã hết hạn");
    }
  }
);

const initialState = {
  user: tokenHelper.getUserInfo(),
  token: tokenHelper.getAccessToken(),
  refreshToken: tokenHelper.getRefreshToken(),
  isAuthenticated: tokenHelper.isAuthenticated(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { token, refreshToken, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = true;

      // Lưu vào localStorage
      tokenHelper.setTokens(token, refreshToken);
      tokenHelper.setUserInfo(user);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      tokenHelper.removeTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        console.log("🚀 ~ action.payload:", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log("🚀 ~ action.payload:", action.payload);
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setCredentials, clearCredentials } =
  authSlice.actions;
export default authSlice.reducer;
