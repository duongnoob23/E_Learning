import axiosInstance from "../../../../lib/axiosInstance";

export const coursesAdminApi = {
  // ==================== ADMIN COURSES ==================== //

  // Lấy danh sách khóa học (có filter) - Admin
  getCourses: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.category_id)
      queryParams.append("category_id", params.category_id);
    if (params.instructor_id)
      queryParams.append("instructor_id", params.instructor_id);
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/admin/courses${queryString ? `?${queryString}` : ""}`;
    return (await axiosInstance.get(url)).data;
  },

  // Lấy danh sách khóa học từ client API (backup)
  getClientCourses: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.title) queryParams.append("title", params.title);
    if (params.category) queryParams.append("category", params.category);
    if (params.instructor) queryParams.append("instructor", params.instructor);
    if (params.level) queryParams.append("level", params.level);
    if (params.price_type) queryParams.append("price_type", params.price_type);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/course${queryString ? `?${queryString}` : ""}`;
    return (await axiosInstance.get(url)).data;
  },

  // Lấy chi tiết khóa học
  getCourseDetail: async (courseId) =>
    (await axiosInstance.get(`/admin/courses/${courseId}`)).data,

  // Duyệt khóa học
  approveCourse: async (courseId, payload) =>
    (await axiosInstance.patch(`/admin/courses/${courseId}/approve`, payload))
      .data,

  // Từ chối khóa học
  rejectCourse: async (courseId, payload) =>
    (await axiosInstance.patch(`/admin/courses/${courseId}/reject`, payload))
      .data,

  // Xóa/Archive khóa học
  removeCourse: async (courseId) =>
    (await axiosInstance.delete(`/admin/courses/${courseId}`)).data,

  // ==================== ADMIN INSTRUCTORS ==================== //

  // Lấy danh sách giảng viên
  getInstructors: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const url = `/admin/instructors${queryString ? `?${queryString}` : ""}`;
    return (await axiosInstance.get(url)).data;
  },

  // ==================== INSTRUCTOR COURSES ==================== //

  // Lấy danh sách khóa học của instructor
  getInstructorCourses: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/instructor/my-courses${queryString ? `?${queryString}` : ""}`;
    return (await axiosInstance.get(url)).data;
  },

  // Tạo khóa học mới
  createCourse: async (payload) =>
    (await axiosInstance.post("/instructor/courses", payload)).data,

  // Cập nhật khóa học
  updateCourse: async (courseId, payload) =>
    (await axiosInstance.patch(`/instructor/courses/${courseId}`, payload))
      .data,

  // Xóa khóa học
  deleteCourse: async (courseId) =>
    (await axiosInstance.delete(`/instructor/courses/${courseId}`)).data,

  // Submit khóa học để phê duyệt
  submitCourseForReview: async (courseId) =>
    (await axiosInstance.patch(`/instructor/courses/${courseId}/submit`)).data,

  // ==================== MODULES ==================== //

  // Lấy danh sách modules của khóa học
  getModulesByCourse: async (courseId) =>
    (await axiosInstance.get(`/instructor/courses/${courseId}/modules`)).data,

  // Thêm module vào khóa học
  addModule: async (courseId, payload) =>
    (
      await axiosInstance.post(
        `/instructor/courses/${courseId}/modules`,
        payload
      )
    ).data,

  // Cập nhật module
  updateModule: async (moduleId, payload) =>
    (await axiosInstance.patch(`/instructor/modules/${moduleId}`, payload))
      .data,

  // Xóa module
  deleteModule: async (moduleId) =>
    (await axiosInstance.delete(`/instructor/modules/${moduleId}`)).data,

  // ==================== LESSONS ==================== //

  // Thêm lesson vào module
  addLesson: async (moduleId, payload) =>
    (
      await axiosInstance.post(
        `/instructor/modules/${moduleId}/lessons`,
        payload
      )
    ).data,

  // Cập nhật lesson
  updateLesson: async (lessonId, payload) =>
    (await axiosInstance.patch(`/instructor/lessons/${lessonId}`, payload))
      .data,

  // Xóa lesson
  deleteLesson: async (lessonId) =>
    (await axiosInstance.delete(`/instructor/lessons/${lessonId}`)).data,

  // ==================== COURSE REVIEWS ==================== //

  // Lấy danh sách đánh giá khóa học của instructor
  getCourseReviewsByInstructor: async (courseId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/instructor/courses/${courseId}/reviews${
      queryString ? `?${queryString}` : ""
    }`;
    return (await axiosInstance.get(url)).data;
  },
};
