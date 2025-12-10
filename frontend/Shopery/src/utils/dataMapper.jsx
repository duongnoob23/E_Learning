// Mapper để chuyển đổi dữ liệu từ API sang format giao diện
export const mapCourseData = (apiCourse) => {
  // ✅ Xử lý mock course (có thể không có Instructor/Category/Level objects)
  return {
    id: apiCourse.course_id,
    title: apiCourse.title,
    instructor: apiCourse.Instructor?.name || apiCourse.instructor || "Unknown",
    instructorId: apiCourse.Instructor?.instructor_id || null,
    desc: apiCourse.short_description || apiCourse.description || "",
    rating: parseFloat(apiCourse.rating) || 0,
    reviews: apiCourse.rating_count || apiCourse.reviews || 0,
    price: parseFloat(apiCourse.price) || 0,
    oldPrice: parseFloat(apiCourse.old_price) || apiCourse.old_price || 0,
    bestSeller: apiCourse.is_best_seller || false,
    discount: apiCourse.discount_percent || apiCourse.discount || 0,
    image: apiCourse.image || apiCourse.thumbnail_url,
    category: apiCourse.Category?.name || apiCourse.category || "Unknown",
    categoryId: apiCourse.Category?.category_id || null,
    level: apiCourse.Level?.name || apiCourse.level || "Unknown",
    levelId: apiCourse.Level?.level_id || null,
    duration: apiCourse.total_duration || "N/A",
    students: apiCourse.total_students || apiCourse.students || 0,
    lessons: apiCourse.total_lessons || apiCourse.lessons || 0,
    isFree: apiCourse.is_free !== undefined ? apiCourse.is_free : (apiCourse.price === 0),
    // Thêm các field khác nếu cần
    slug: apiCourse.slug,
    description: apiCourse.description,
    videoPreview: apiCourse.video_preview,
    videoDuration: apiCourse.video_duration,
    totalLessons: apiCourse.total_lessons || apiCourse.lessons,
    status: apiCourse.status,
    publishedAt: apiCourse.published_at,
  };
};

export const mapCoursesData = (apiResponse) => {
  // Kiểm tra cấu trúc response từ API
  console.log("API Response:", apiResponse);

  if (!apiResponse?.DT?.courses) {
    console.log("No courses found in response");
    return {
      courses: [],
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 12,
      },
    };
  }

  return {
    courses: apiResponse.DT.courses.map(mapCourseData),
    pagination: apiResponse.DT.pagination || {
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      items_per_page: 12,
    },
  };
};

// Mapper cho filter options - nhận courses đã được map
export const mapFilterOptions = (courses) => {
  const categories = {};
  const instructors = {};
  const levels = {};

  courses.forEach((course) => {
    // Categories - courses đã được map nên dùng trực tiếp
    const categoryName = course.category || "Unknown";
    categories[categoryName] = (categories[categoryName] || 0) + 1;

    // Instructors - courses đã được map nên dùng trực tiếp
    const instructorName = course.instructor || "Unknown";
    instructors[instructorName] = (instructors[instructorName] || 0) + 1;

    // Levels - courses đã được map nên dùng trực tiếp
    const levelName = course.level || "Unknown";
    levels[levelName] = (levels[levelName] || 0) + 1;
  });

  return {
    categories: Object.entries(categories).map(([name, count]) => ({
      name,
      count,
    })),
    instructors: Object.entries(instructors).map(([name, count]) => ({
      name,
      count,
    })),
    levels: Object.entries(levels).map(([name, count]) => ({
      name,
      count,
    })),
  };
};
