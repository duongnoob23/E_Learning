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
    const response = await axiosInstance.get(`/course/${courseId}`);
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
};
