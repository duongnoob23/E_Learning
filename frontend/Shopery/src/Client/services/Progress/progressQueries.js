import { useQuery, useMutation } from "@tanstack/react-query";
import { courseApi } from "../../api/Course/courseApi";

export const useStartLesson = () => {
  return useMutation({
    mutationFn: (data) => courseApi.startLesson(data)
  });
};

export const useUpdateLessonProgress = () => {
  return useMutation({
    mutationFn: (data) => courseApi.updateLessonProgress(data)
  });
};

export const useCompleteLesson = () => {
  return useMutation({
    mutationFn: (data) => courseApi.completeLesson(data)
  });
};

export const useLessonProgress = (lesson_id, user_id) => {
  return useQuery({
    queryKey: ["lesson-progress", lesson_id, user_id],
    queryFn: () => courseApi.getLessonProgress(lesson_id, user_id),
    enabled: !!lesson_id,
  });
};

export const useCourseProgress = (course_id, user_id) => {
  return useQuery({
    queryKey: ["course-progress", course_id, user_id],
    queryFn: () => courseApi.getCourseProgress(course_id, user_id),
    enabled: !!course_id,
  });
};
