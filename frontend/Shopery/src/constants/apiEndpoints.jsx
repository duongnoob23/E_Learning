// API Endpoints - Định nghĩa các endpoint API (Dùng chung)
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    VALIDATE_TOKEN: '/auth/validate',
    CURRENT_USER: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    UPDATE_PROFILE: '/auth/profile',
    UPLOAD_AVATAR: '/auth/upload-avatar',
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    DASHBOARD_STATS: '/admin/dashboard/stats',
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    CATEGORIES: '/admin/categories',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },

  // Client endpoints
  CLIENT: {
    PRODUCTS: '/client/products',
    FEATURED_PRODUCTS: '/client/products/featured',
    PRODUCT_SEARCH: '/client/products/search',
    CATEGORIES: '/client/categories',
    CART: '/client/cart',
    CART_ADD: '/client/cart/add',
    ORDERS: '/client/orders',
    WISHLIST: '/client/wishlist',
    REVIEWS: '/client/reviews',
    ADDRESSES: '/client/addresses',
  },

  // Common endpoints
  COMMON: {
    UPLOAD: '/upload',
    SEARCH: '/search',
    NOTIFICATIONS: '/notifications',
  },
}

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
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  UNAUTHORIZED: 'Bạn không có quyền truy cập',
  FORBIDDEN: 'Truy cập bị từ chối',
  NOT_FOUND: 'Không tìm thấy tài nguyên',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  SERVER_ERROR: 'Lỗi máy chủ nội bộ',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
}
