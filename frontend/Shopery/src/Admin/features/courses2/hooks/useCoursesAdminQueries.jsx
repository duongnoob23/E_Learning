import { useQuery } from "@tanstack/react-query";
import { coursesAdminApi } from "../api/coursesAdminApi";

// Query keys scoped to admin courses
export const adminCoursesKeys = {
  all: ["admin", "courses"],
  courses: () => [...adminCoursesKeys.all, "list"],
  courseList: (filters) => [...adminCoursesKeys.courses(), filters],
  courseDetail: (id) => [...adminCoursesKeys.all, "detail", id],
  instructors: () => [...adminCoursesKeys.all, "instructors"],
  instructorList: (filters) => [...adminCoursesKeys.instructors(), filters],
  // Instructor courses
  instructorCourses: () => [...adminCoursesKeys.all, "instructor", "courses"],
  instructorCourseList: (filters) => [
    ...adminCoursesKeys.instructorCourses(),
    filters,
  ],
  // Modules
  modules: (courseId) => [
    ...adminCoursesKeys.courseDetail(courseId),
    "modules",
  ],
  // Lessons
  lessons: (moduleId) => [...adminCoursesKeys.all, "lessons", moduleId],
  // Reviews
  courseReviews: (courseId) => [
    ...adminCoursesKeys.courseDetail(courseId),
    "reviews",
  ],
};

// ==================== ADMIN COURSES QUERIES ==================== //

// Lấy danh sách khóa học (có filter) - Admin
export const useAdminCourses = (filters = {}, enabled = true) =>
  useQuery({
    queryKey: adminCoursesKeys.courseList(filters),
    queryFn: () => coursesAdminApi.getCourses(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Lấy danh sách khóa học từ client API (backup)
export const useClientCourses = (filters = {}, enabled = true) =>
  useQuery({
    queryKey: ["ListCourses"],
    queryFn: () => coursesAdminApi.getClientCourses(filters),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

// Lấy chi tiết khóa học (dùng client API)
export const useAdminCourseDetail = (courseId, enabled = true) =>
  useQuery({
    queryKey: adminCoursesKeys.courseDetail(courseId),
    queryFn: () => coursesAdminApi.getCourseDetail(courseId),
    enabled: enabled && !!courseId,
    staleTime: 5 * 60 * 1000,
  });

// Lấy cấu trúc khóa học (modules + lessons) - dùng client API
export const useAdminCourseStructure = (courseId, enabled = true) =>
  useQuery({
    queryKey: [...adminCoursesKeys.courseDetail(courseId), "structure"],
    queryFn: () => coursesAdminApi.getCourseStructure(courseId),
    enabled: enabled && !!courseId,
    staleTime: 5 * 60 * 1000,
  });

// ==================== ADMIN INSTRUCTORS QUERIES ==================== //

// Lấy danh sách giảng viên
export const useAdminInstructors = (filters = {}, enabled = true) =>
  useQuery({
    queryKey: adminCoursesKeys.instructorList(filters),
    queryFn: () => coursesAdminApi.getInstructors(filters),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

// ==================== INSTRUCTOR COURSES QUERIES ==================== //

// Lấy danh sách khóa học của instructor
export const useInstructorCourses = (filters = {}, enabled = true) =>
  useQuery({
    queryKey: adminCoursesKeys.instructorCourseList(filters),
    queryFn: () => coursesAdminApi.getInstructorCourses(filters),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

// ==================== MODULES QUERIES ==================== //

// Lấy danh sách modules của khóa học
export const useModulesByCourse = (courseId, enabled = true) =>
  useQuery({
    queryKey: adminCoursesKeys.modules(courseId),
    queryFn: () => coursesAdminApi.getModulesByCourse(courseId),
    enabled: enabled && !!courseId,
    staleTime: 5 * 60 * 1000,
  });

// ==================== COURSE REVIEWS QUERIES ==================== //

// Lấy danh sách đánh giá khóa học của instructor
export const useCourseReviewsByInstructor = (
  courseId,
  filters = {},
  enabled = true
) =>
  useQuery({
    queryKey: adminCoursesKeys.courseReviews(courseId),
    queryFn: () =>
      coursesAdminApi.getCourseReviewsByInstructor(courseId, filters),
    enabled: enabled && !!courseId,
    staleTime: 5 * 60 * 1000,
  });
