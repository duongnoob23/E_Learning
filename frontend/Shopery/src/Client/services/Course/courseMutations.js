import { useMutation } from "@tanstack/react-query";
import { courseApi } from "../../api/Course/courseApi";

export const useEnrollCourse = () => {
  return useMutation({
    mutationFn: ({ userId, courseId }) =>
      courseApi.enrollCourse(userId, courseId),
  });
};

