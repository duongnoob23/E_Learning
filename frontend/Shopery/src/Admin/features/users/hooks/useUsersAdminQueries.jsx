import { useQuery } from "@tanstack/react-query";
import { usersAdminApi } from "../api/usersAdminApi";

// Query keys scoped to admin users
export const adminUsersKeys = {
  all: ["admin", "users"],
  users: () => [...adminUsersKeys.all, "list"],
  userList: (filters) => [...adminUsersKeys.users(), filters],
  userDetail: (id) => [...adminUsersKeys.all, "detail", id],
  stats: () => [...adminUsersKeys.all, "stats"],
  statsByStatus: () => [...adminUsersKeys.all, "stats", "status"],
  search: (keyword) => [...adminUsersKeys.all, "search", keyword],
};

// ==================== USERS QUERIES ==================== //

// Lấy danh sách users (có pagination)
export const useAdminUsers = (filters = {}, enabled = true) =>
  useQuery({
    queryKey: adminUsersKeys.userList(filters),
    queryFn: () => usersAdminApi.getUsers(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Lấy chi tiết user
export const useAdminUserDetail = (userId, enabled = true) =>
  useQuery({
    queryKey: adminUsersKeys.userDetail(userId),
    queryFn: () => usersAdminApi.getUserDetail(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });

// ==================== STATS QUERIES ==================== //

// Thống kê tổng quan users
export const useAdminUsersStats = (enabled = true) =>
  useQuery({
    queryKey: adminUsersKeys.stats(),
    queryFn: () => usersAdminApi.getUsersStats(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

// Thống kê users theo trạng thái
export const useAdminUsersStatsByStatus = (enabled = true) =>
  useQuery({
    queryKey: adminUsersKeys.statsByStatus(),
    queryFn: () => usersAdminApi.getUsersStatsByStatus(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

// ==================== SEARCH QUERIES ==================== //

// Tìm kiếm users
export const useSearchUsers = (keyword, enabled = true) =>
  useQuery({
    queryKey: adminUsersKeys.search(keyword),
    queryFn: () => usersAdminApi.searchUsers(keyword),
    enabled: enabled && !!keyword && keyword.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes cho search
  });

// ==================== FLASHCARD PROGRESS QUERIES ==================== //

// Lấy tiến độ học flashcard của user
export const useUserFlashcardProgress = (userId, enabled = true) =>
  useQuery({
    queryKey: [...adminUsersKeys.userDetail(userId), "flashcard-progress"],
    queryFn: () => usersAdminApi.getUserFlashcardProgress(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });

// Lấy danh sách topics user đã tạo
export const useUserCreatedTopics = (userId, enabled = true) =>
  useQuery({
    queryKey: [...adminUsersKeys.userDetail(userId), "created-topics"],
    queryFn: () => usersAdminApi.getUserCreatedTopics(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });

// ==================== EXAM PROGRESS QUERIES ==================== //

// Lấy lịch sử làm bài thi của user
export const useUserExams = (userId, params = {}, enabled = true) =>
  useQuery({
    queryKey: [...adminUsersKeys.userDetail(userId), "exams", params],
    queryFn: () => usersAdminApi.getUserExams(userId, params),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });

// Lấy thống kê exam của user
export const useUserExamStatistics = (userId, enabled = true) =>
  useQuery({
    queryKey: [...adminUsersKeys.userDetail(userId), "exam-statistics"],
    queryFn: () => usersAdminApi.getUserExamStatistics(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });

// ==================== COURSE PROGRESS QUERIES ==================== //

// Lấy tiến độ học course của user (chi tiết)
export const useUserCourseProgress = (userId, params = {}, enabled = true) =>
  useQuery({
    queryKey: [...adminUsersKeys.userDetail(userId), "course-progress", params],
    queryFn: () => usersAdminApi.getUserCourseProgress(userId, params),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });

// Lấy danh sách khóa học đã đăng ký của user (từ course_enrollment)
export const useUserEnrollments = (userId, params = {}, enabled = true) =>
  useQuery({
    queryKey: [...adminUsersKeys.userDetail(userId), "enrollments", params],
    queryFn: () => usersAdminApi.getUserEnrollments(userId, params),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });

