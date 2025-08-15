// API Endpoints - Định nghĩa các endpoint API cho e-learning
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    VALIDATE_TOKEN: "/auth/validate",
    CURRENT_USER: "/auth/me",
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    DASHBOARD_STATS: "/admin/dashboard/stats",
    LEARNING_ANALYTICS: "/admin/dashboard/analytics",
    USERS: "/admin/users",
    FLASHCARDS: "/admin/flashcards",
    STUDY_SESSIONS: "/admin/study-sessions",
  },

  // Client endpoints
  CLIENT: {
    USER_PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
    UPLOAD_AVATAR: "/user/upload-avatar",
    LEARNING_PROGRESS: "/user/learning-progress",
    FLASHCARDS: "/flashcards",
    STUDY_SESSIONS: "/study-sessions",
  },

  // Common endpoints
  COMMON: {
    UPLOAD: "/upload",
    NOTIFICATIONS: "/notifications",
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng",
  UNAUTHORIZED: "Bạn không có quyền truy cập",
  FORBIDDEN: "Truy cập bị từ chối",
  NOT_FOUND: "Không tìm thấy tài nguyên",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ",
  SERVER_ERROR: "Lỗi máy chủ nội bộ",
  TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn",
};
