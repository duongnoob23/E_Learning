import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "../../api/Course/courseApi";
import { queryKeys } from "../../../lib/queryKeys";

/**
 * ======================================
 *   PROGRESS QUERIES & MUTATIONS
 *   Dành cho Lesson Progress (Udemy style)
 * ======================================
 */

/* -----------------------
 * Lấy tiến trình 1 bài học
 * ----------------------- */
export const useLessonProgress = (lessonId, userId) => {
  return useQuery({
    queryKey: queryKeys.progress.lesson(lessonId, userId),
    queryFn: () => courseApi.getLessonProgress(lessonId, userId),
    enabled: !!lessonId && !!userId,
    staleTime: 60 * 1000, // cache 1 phút
  });
};

/* -----------------------
 * Lấy tiến trình toàn khóa
 * ----------------------- */
export const useCourseProgress = (courseId, userId) => {
  return useQuery({
    queryKey: queryKeys.progress.course(courseId, userId),
    queryFn: () => courseApi.getCourseProgress(courseId, userId),
    enabled: !!courseId && !!userId,
    staleTime: 60 * 1000,
  });
};

/* -----------------------
 * Bắt đầu bài học (start)
 * ----------------------- */
export const useStartLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => courseApi.startLesson(payload),
    onSuccess: (data, variables) => {
      // refetch lesson progress
      queryClient.invalidateQueries(
        queryKeys.progress.lesson(variables.lesson_id, variables.user_id)
      );

      // refetch course progress
      queryClient.invalidateQueries(
        queryKeys.progress.course(variables.course_id, variables.user_id)
      );
    },
  });
};

/* -----------------------
 * Cập nhật tiến độ (update)
 * ----------------------- */
export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => courseApi.updateLessonProgress(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(
        queryKeys.progress.lesson(variables.lesson_id, variables.user_id)
      );
    },
  });
};

/* -----------------------------
 * Hoàn thành bài học (complete)
 * ----------------------------- */
export const useCompleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => courseApi.completeLesson(payload),
    onSuccess: (data, variables) => {
      // invalidate bài học đang học
      queryClient.invalidateQueries(
        queryKeys.progress.lesson(variables.lesson_id, variables.user_id)
      );

      // invalidate toàn khóa
      queryClient.invalidateQueries(
        queryKeys.progress.course(variables.course_id, variables.user_id)
      );
    },
  });
};
