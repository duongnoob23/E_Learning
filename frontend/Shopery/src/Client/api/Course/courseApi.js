// frontend/Shopery/src/Client/api/Course/courseApi.js
import axiosInstance from "../../../lib/axiosInstance";

export const courseApi = {
  // Lấy danh sách khóa học với filter
  getCourses: async (filters = {}) => {
    const params = new URLSearchParams();

    // Thêm các filter vào params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    const response = await axiosInstance.get(`/course?${params.toString()}`);
    return response.data;
  },

  // Lấy chi tiết khóa học
  getCourseById: async (courseId) => {
    const response = await axiosInstance.get(`/course/courses/${courseId}/preview`);
    return response.data;
  },

  // Lấy cấu trúc khóa học
  getCourseStructure: async (courseId) => {
    const response = await axiosInstance.get(`/course/${courseId}/structure`);
    return response.data;
  },

  // Lấy khóa học theo category
  getCoursesByCategory: async (categoryId) => {
    const response = await axiosInstance.get(
      `/course/categories?category_id=${categoryId}`
    );
    return response.data;
  },

  // Lấy khóa học theo level
  getCoursesByLevel: async (levelId) => {
    const response = await axiosInstance.get(
      `/course/levels?level_id=${levelId}`
    );
    return response.data;
  },

  // Lấy khóa học theo instructor
  getCoursesByInstructor: async (instructorId) => {
    const response = await axiosInstance.get(
      `/course/instructors?instructor_id=${instructorId}`
    );
    return response.data;
  },

  // Lấy tất cả categories
  getCategories: async () => {
    const response = await axiosInstance.get(`/course/categories`);
    return response.data;
  },

  // Lấy tất cả instructors
  getInstructors: async () => {
    const response = await axiosInstance.get(`/course/instructors`);
    return response.data;
  },

  // Lấy tất cả levels
  getLevels: async () => {
    const response = await axiosInstance.get(`/course/levels`);
    return response.data;
  },
  // Đăng ký khóa học
  enrollCourse: async (userId, courseId) => {
    const response = await axiosInstance.post(`/course/${courseId}/enroll`, {
      user_id: userId,
    });
    return response.data;
  },  
  // Lấy danh sách khóa học đã đăng ký
  getUserCourses: async (userId) => {
    const response = await axiosInstance.get(`/course/user/my-courses`, {
      params: { user_id: userId },
    });
    return response.data;
  },
  // Lesson Progress
  startLesson: async (data) => {
    const res = await axiosInstance.post("/course/start", data);
    return res.data;
  },
  updateLessonProgress: async (data) => {
    const res = await axiosInstance.post("/course/update", data);
    return res.data;
  },
  completeLesson: async (data) => {
    const res = await axiosInstance.post("/course/complete", data);
    return res.data;
  },
  getLessonProgress: async (lesson_id, user_id) => {
    const res = await axiosInstance.get(`/course/lesson/${lesson_id}?user_id=${user_id}`);
    return res.data;
  },
  getCourseProgress: async (course_id, user_id) => {
    const res = await axiosInstance.get(`/course/course/${course_id}?user_id=${user_id}`);
    return res.data;
  },
  
};
