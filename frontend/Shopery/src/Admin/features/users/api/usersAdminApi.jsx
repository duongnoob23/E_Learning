// Dùng adminAxiosInstance để tự động thêm admin token
import adminAxiosInstance from "../../../api/adminAuthApi";

export const usersAdminApi = {
  // ==================== QUẢN LÝ TÀI KHOẢN ==================== //

  // Lấy danh sách users (có pagination)
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);

    const queryString = queryParams.toString();
    const url = `/admin/users${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },

  // Lấy chi tiết user
  getUserDetail: async (userId) =>
    (await adminAxiosInstance.get(`/admin/users/${userId}`)).data,

  // Tạo user mới
  createUser: async (payload) =>
    (await adminAxiosInstance.post("/admin/users", payload)).data,

  // Cập nhật user
  updateUser: async (userId, payload) =>
    (await adminAxiosInstance.patch(`/admin/users/${userId}`, payload)).data,

  // Xóa user
  deleteUser: async (userId) =>
    (await adminAxiosInstance.delete(`/admin/users/${userId}`)).data,

  // ==================== QUẢN LÝ TRẠNG THÁI ==================== //

  // Chặn user
  banUser: async (userId) =>
    (await adminAxiosInstance.patch(`/admin/users/${userId}/ban`)).data,

  // Bỏ chặn user
  unbanUser: async (userId) =>
    (await adminAxiosInstance.patch(`/admin/users/${userId}/unban`)).data,

  // Cập nhật trạng thái
  updateUserStatus: async (userId, status) =>
    (await adminAxiosInstance.patch(`/admin/users/${userId}/status`, { status })).data,

  // ==================== XÁC THỰC ==================== //

  // Xác thực email
  verifyEmail: async (userId) =>
    (await adminAxiosInstance.patch(`/admin/users/${userId}/verify-email`)).data,

  // Xác thực số điện thoại
  verifyPhone: async (userId) =>
    (await adminAxiosInstance.patch(`/admin/users/${userId}/verify-phone`)).data,

  // ==================== TÌM KIẾM & LỌC ==================== //

  // Tìm kiếm users
  searchUsers: async (keyword) => {
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append("keyword", keyword);
    const queryString = queryParams.toString();
    const url = `/admin/users/search${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },

  // Lọc users theo ngày
  filterUsers: async (from, to) => {
    const queryParams = new URLSearchParams();
    if (from) queryParams.append("from", from);
    if (to) queryParams.append("to", to);
    const queryString = queryParams.toString();
    const url = `/admin/users/filter${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },

  // ==================== THỐNG KÊ ==================== //

  // Thống kê tổng quan
  getUsersStats: async () =>
    (await adminAxiosInstance.get("/admin/users/stats")).data,

  // Thống kê theo trạng thái
  getUsersStatsByStatus: async () =>
    (await adminAxiosInstance.get("/admin/users/stats/status")).data,

  // ==================== GÁN ROLE ==================== //

  // Gán role cho user
  assignRoleToUser: async (userId, roleId) =>
    (await adminAxiosInstance.post(`/admin/users/users/${userId}/roles`, { role_id: roleId })).data,

  // ==================== KHÓA HỌC & GIAO DỊCH ==================== //

  // Lấy danh sách khóa học đã đăng ký của user
  getUserEnrollments: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const url = `/admin/users/${userId}/enrollments${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },

  // Lấy danh sách giao dịch của user
  getUserPayments: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.payment_status) queryParams.append("payment_status", params.payment_status);

    const queryString = queryParams.toString();
    const url = `/admin/users/${userId}/payments${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },

  // ==================== FLASHCARD PROGRESS ==================== //

  // Lấy tiến độ học flashcard của user
  getUserFlashcardProgress: async (userId) =>
    (await adminAxiosInstance.get(`/admin/users/${userId}/flashcard-progress`)).data,

  // Lấy danh sách topics user đã tạo
  getUserCreatedTopics: async (userId) =>
    (await adminAxiosInstance.get(`/admin/users/${userId}/created-topics`)).data,

  // ==================== EXAM PROGRESS ==================== //

  // Lấy lịch sử làm bài thi của user
  getUserExams: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/admin/users/${userId}/exams${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },

  // Lấy thống kê exam của user
  getUserExamStatistics: async (userId) =>
    (await adminAxiosInstance.get(`/admin/users/${userId}/exam-statistics`)).data,

  // Lấy kết quả chi tiết bài thi của user
  getUserExamResult: async (userId, examSessionId) =>
    (await adminAxiosInstance.get(`/admin/users/${userId}/exam-results/${examSessionId}`)).data,

  // ==================== COURSE PROGRESS ==================== //

  // Lấy tiến độ học course của user (chi tiết hơn enrollments)
  getUserCourseProgress: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/admin/users/${userId}/course-progress${queryString ? `?${queryString}` : ""}`;
    return (await adminAxiosInstance.get(url)).data;
  },
};

