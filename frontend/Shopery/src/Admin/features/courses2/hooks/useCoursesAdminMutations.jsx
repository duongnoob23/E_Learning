import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { coursesAdminApi } from "../api/coursesAdminApi";
import { adminCoursesKeys } from "./useCoursesAdminQueries";

// Helpers
const isOk = (data) => (data?.EC ?? data?.data?.EC) === "0";
const em = (data, fallback) => data?.EM || data?.data?.EM || fallback;

// ==================== ADMIN COURSES MUTATIONS ==================== //

// Duyệt khóa học
export const useAdminApproveCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, payload }) =>
      coursesAdminApi.approveCourse(courseId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Duyệt khóa học thành công"));
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.courseDetail(vars.courseId),
        });
        qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.instructorCourses(),
        });
      } else {
        toast.error(em(data, "Duyệt khóa học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi duyệt khóa học"),
  });
};

// Từ chối khóa học
export const useAdminRejectCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, payload }) =>
      coursesAdminApi.rejectCourse(courseId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Từ chối khóa học thành công"));
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.courseDetail(vars.courseId),
        });
        qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.instructorCourses(),
        });
      } else {
        toast.error(em(data, "Từ chối khóa học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi từ chối khóa học"),
  });
};

// Xóa/Archive khóa học
export const useAdminRemoveCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId) => coursesAdminApi.removeCourse(courseId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xóa khóa học thành công"));
        qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.instructorCourses(),
        });
      } else {
        toast.error(em(data, "Xóa khóa học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa khóa học"),
  });
};

// ==================== INSTRUCTOR COURSES MUTATIONS ==================== //

// Tạo khóa học mới
export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => coursesAdminApi.createCourse(payload),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Tạo khóa học thành công"));
        qc.invalidateQueries({
          queryKey: ["ListCourses"],
        });
        qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
      } else {
        toast.error(em(data, "Tạo khóa học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi tạo khóa học"),
  });
};

// Cập nhật khóa học
export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, payload }) =>
      coursesAdminApi.updateCourse(courseId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật khóa học thành công"));
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.courseDetail(vars.courseId),
        });
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.instructorCourses(),
        });
        qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
      } else {
        toast.error(em(data, "Cập nhật khóa học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật khóa học"),
  });
};

// Xóa khóa học
export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId) => coursesAdminApi.deleteCourse(courseId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xóa khóa học thành công"));
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.instructorCourses(),
        });
        qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
      } else {
        toast.error(em(data, "Xóa khóa học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa khóa học"),
  });
};

// Submit khóa học để phê duyệt
export const useSubmitCourseForReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId) => coursesAdminApi.submitCourseForReview(courseId),
    onSuccess: (data, courseId) => {
      if (isOk(data)) {
        toast.success(em(data, "Gửi khóa học để phê duyệt thành công"));
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.courseDetail(courseId),
        });
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.instructorCourses(),
        });
        qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
      } else {
        toast.error(em(data, "Gửi khóa học để phê duyệt thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi gửi khóa học để phê duyệt"),
  });
};

// ==================== MODULES MUTATIONS ==================== //

// Thêm module vào khóa học
export const useAddModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, payload }) =>
      coursesAdminApi.addModule(courseId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Thêm module thành công"));
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.modules(vars.courseId),
        });
        qc.invalidateQueries({
          queryKey: adminCoursesKeys.courseDetail(vars.courseId),
        });
        qc.invalidateQueries({
          queryKey: ["ListCourses"],
        });
      } else {
        toast.error(em(data, "Thêm module thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi thêm module"),
  });
};

// Cập nhật module
export const useUpdateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, payload, courseId }) =>
      coursesAdminApi.updateModule(moduleId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật module thành công"));
        if (vars.courseId) {
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.modules(vars.courseId),
          });
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.courseDetail(vars.courseId),
          });
        }
      } else {
        toast.error(em(data, "Cập nhật module thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật module"),
  });
};

// Xóa module
export const useDeleteModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, courseId }) =>
      coursesAdminApi.deleteModule(moduleId),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Xóa module thành công"));
        if (vars.courseId) {
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.modules(vars.courseId),
          });
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.courseDetail(vars.courseId),
          });
        }
      } else {
        toast.error(em(data, "Xóa module thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa module"),
  });
};

// ==================== LESSONS MUTATIONS ==================== //

// Thêm lesson vào module
export const useAddLesson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, payload, courseId }) =>
      coursesAdminApi.addLesson(moduleId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Thêm bài học thành công"));
        if (vars.courseId) {
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.modules(vars.courseId),
          });
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.courseDetail(vars.courseId),
          });
          qc.invalidateQueries({
            queryKey: ["ListCourses"],
          });
        }
      } else {
        toast.error(em(data, "Thêm bài học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi thêm bài học"),
  });
};

// Cập nhật lesson
export const useUpdateLesson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, payload, courseId }) =>
      coursesAdminApi.updateLesson(lessonId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật bài học thành công"));
        if (vars.courseId) {
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.modules(vars.courseId),
          });
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.courseDetail(vars.courseId),
          });
        }
      } else {
        toast.error(em(data, "Cập nhật bài học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật bài học"),
  });
};

// Xóa lesson
export const useDeleteLesson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, courseId }) =>
      coursesAdminApi.deleteLesson(lessonId),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Xóa bài học thành công"));
        if (vars.courseId) {
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.modules(vars.courseId),
          });
          qc.invalidateQueries({
            queryKey: adminCoursesKeys.courseDetail(vars.courseId),
          });
        }
      } else {
        toast.error(em(data, "Xóa bài học thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa bài học"),
  });
};

export default {
  useAdminApproveCourse,
  useAdminRejectCourse,
  useAdminRemoveCourse,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useSubmitCourseForReview,
  useAddModule,
  useUpdateModule,
  useDeleteModule,
  useAddLesson,
  useUpdateLesson,
  useDeleteLesson,
};
