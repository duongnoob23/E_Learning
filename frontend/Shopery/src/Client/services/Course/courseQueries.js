// frontend/Shopery/src/Client/services/Course/courseQueries.js
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/queryKeys";
import { courseApi } from "../../api/Course/courseApi";

// Query để lấy danh sách khóa học với filter
export const useCourses = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.course.list(filters),
    queryFn: () => courseApi.getCourses(filters),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy chi tiết khóa học
export const useCourseDetail = (courseId, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.course.detail(courseId),
    queryFn: () => courseApi.getCourseById(courseId),
    enabled: enabled && !!courseId,
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy khóa học theo category
export const useCoursesByCategory = (categoryId, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.course.all, "byCategory", categoryId],
    queryFn: () => courseApi.getCoursesByCategory(categoryId),
    enabled: enabled && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query để lấy khóa học theo level
export const useCoursesByLevel = (levelId, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.course.all, "byLevel", levelId],
    queryFn: () => courseApi.getCoursesByLevel(levelId),
    enabled: enabled && !!levelId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query để lấy khóa học theo instructor
export const useCoursesByInstructor = (instructorId, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.course.all, "byInstructor", instructorId],
    queryFn: () => courseApi.getCoursesByInstructor(instructorId),
    enabled: enabled && !!instructorId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query để lấy tất cả categories
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.course.categories(),
    queryFn: () => courseApi.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy tất cả instructors
export const useInstructors = () => {
  return useQuery({
    queryKey: queryKeys.course.instructors(),
    queryFn: () => courseApi.getInstructors(),
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy tất cả levels
export const useLevels = () => {
  return useQuery({
    queryKey: queryKeys.course.levels(),
    queryFn: () => courseApi.getLevels(),
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};
