import {
  useCourseDetail,
  useCourses,
  useCoursesByCategory,
  useCoursesByInstructor,
  useCoursesByLevel,
} from "../../Client/services/Course/courseQueries";
import { mapCourseData, mapCoursesData } from "../../utils/dataMapper";

// Custom hook để sử dụng courses với data mapping
export const useCourseQueries = (filters = {}) => {
  const coursesQuery = useCourses(filters);
  const courseDetailQuery = useCourseDetail();
  const coursesByCategoryQuery = useCoursesByCategory();
  const coursesByLevelQuery = useCoursesByLevel();
  const coursesByInstructorQuery = useCoursesByInstructor();

  return {
    // Courses list - nhận filters từ parameter
    courses: {
      ...coursesQuery,
      data: coursesQuery.data ? mapCoursesData(coursesQuery.data) : null,
    },

    // Course detail
    courseDetail: {
      ...courseDetailQuery,
      data: courseDetailQuery.data?.DT
        ? mapCourseData(courseDetailQuery.data.DT)
        : null,
    },

    // Courses by category
    coursesByCategory: {
      ...coursesByCategoryQuery,
      data: coursesByCategoryQuery.data?.DT
        ? coursesByCategoryQuery.data.DT.map(mapCourseData)
        : null,
    },

    // Courses by level
    coursesByLevel: {
      ...coursesByLevelQuery,
      data: coursesByLevelQuery.data?.DT
        ? coursesByLevelQuery.data.DT.map(mapCourseData)
        : null,
    },

    // Courses by instructor
    coursesByInstructor: {
      ...coursesByInstructorQuery,
      data: coursesByInstructorQuery.data?.DT
        ? coursesByInstructorQuery.data.DT.map(mapCourseData)
        : null,
    },
  };
};

// Export riêng useCourses để sử dụng trực tiếp
export { useCourses } from "../../Client/services/Course/courseQueries";
