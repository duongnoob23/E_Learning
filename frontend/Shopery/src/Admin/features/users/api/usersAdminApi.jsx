import axiosInstance from "../../../../lib/axiosInstance";

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
    return (await axiosInstance.get(url)).data;
  },

  // Lấy chi tiết user
  getUserDetail: async (userId) =>
    (await axiosInstance.get(`/admin/users/${userId}`)).data,

  // Tạo user mới
  createUser: async (payload) =>
    (await axiosInstance.post("/admin/users", payload)).data,

  // Cập nhật user
  updateUser: async (userId, payload) =>
    (await axiosInstance.patch(`/admin/users/${userId}`, payload)).data,

  // Xóa user
  deleteUser: async (userId) =>
    (await axiosInstance.delete(`/admin/users/${userId}`)).data,

  // ==================== QUẢN LÝ TRẠNG THÁI ==================== //

  // Chặn user
  banUser: async (userId) =>
    (await axiosInstance.patch(`/admin/users/${userId}/ban`)).data,

  // Bỏ chặn user
  unbanUser: async (userId) =>
    (await axiosInstance.patch(`/admin/users/${userId}/unban`)).data,

  // Cập nhật trạng thái
  updateUserStatus: async (userId, status) =>
    (await axiosInstance.patch(`/admin/users/${userId}/status`, { status })).data,

  // ==================== XÁC THỰC ==================== //

  // Xác thực email
  verifyEmail: async (userId) =>
    (await axiosInstance.patch(`/admin/users/${userId}/verify-email`)).data,

  // Xác thực số điện thoại
  verifyPhone: async (userId) =>
    (await axiosInstance.patch(`/admin/users/${userId}/verify-phone`)).data,

  // ==================== TÌM KIẾM & LỌC ==================== //

  // Tìm kiếm users
  searchUsers: async (keyword) => {
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append("keyword", keyword);
    const queryString = queryParams.toString();
    const url = `/admin/users/search${queryString ? `?${queryString}` : ""}`;
    return (await axiosInstance.get(url)).data;
  },

  // Lọc users theo ngày
  filterUsers: async (from, to) => {
    const queryParams = new URLSearchParams();
    if (from) queryParams.append("from", from);
    if (to) queryParams.append("to", to);
    const queryString = queryParams.toString();
    const url = `/admin/users/filter${queryString ? `?${queryString}` : ""}`;
    return (await axiosInstance.get(url)).data;
  },

  // ==================== THỐNG KÊ ==================== //

  // Thống kê tổng quan
  getUsersStats: async () =>
    (await axiosInstance.get("/admin/users/stats")).data,

  // Thống kê theo trạng thái
  getUsersStatsByStatus: async () =>
    (await axiosInstance.get("/admin/users/stats/status")).data,

  // ==================== GÁN ROLE ==================== //

  // Gán role cho user
  assignRoleToUser: async (userId, roleId) =>
    (await axiosInstance.post(`/admin/users/users/${userId}/roles`, { role_id: roleId })).data,
};

