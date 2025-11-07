const Course = require("../services/courseClientService");

// ==================== CATEGORY / LEVEL / INSTRUCTOR ==================== //

// [GET] /api/courses/categories - Lấy danh sách danh mục
exports.getCategories = async (req, res, next) => {
  try {
    const result = await Course.getAllCategories();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
// [GET] /api/courses/:id/preview - Lấy chi tiết khóa học
exports.getCoursePreview = async (req, res) => {
  const { id } = req.params;
  const data = await Course.getCoursePreview(id);
  res.json(data);
};
// [GET] /api/courses/instructors - Lấy danh sách giảng viên
exports.getInstructors = async (req, res, next) => {
  try {
    const result = await Course.getAllInstructors();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/courses/levels - Lấy danh sách trình độ
exports.getLevels = async (req, res, next) => {
  try {
    const result = await Course.getAllLevels();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ==================== COURSE LIST & DETAIL ==================== //

// [GET] /api/courses - Lấy danh sách khóa học (có filter)
exports.getCourse = async (req, res, next) => {
  try {
    const {
      title,
      category,
      instructor,
      level,
      price_type, // 'free', 'paid', 'all'
      min_price,
      max_price,
      rating,
      sort_by, // 'newest', 'popular', 'price_asc', 'price_desc', 'rating'
      page = 1,
      limit = 12,
    } = req.query;

    const filters = {
      title,
      category,
      instructor,
      level,
      price_type,
      min_price,
      max_price,
      rating,
      sort_by,
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await Course.findAllWithFilters(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/courses/:course_id - Lấy chi tiết khóa học
exports.getCourseById = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const result = await Course.findbyId(course_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/courses/:course_id/curriculum - Lấy chương trình học
exports.getCourseCurriculum = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const result = await Course.getCourseCurriculum(course_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/courses/:course_id/reviews - Lấy đánh giá khóa học
exports.getCourseReviews = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await Course.getCourseReviews(
      course_id,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/courses/:course_id/discussions - Lấy thảo luận khóa học
exports.getCourseDiscussions = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await Course.getCourseDiscussions(
      course_id,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/courses/suggested - Lấy khóa học gợi ý
exports.getSuggestedCourses = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    const result = await Course.getSuggestedCourses(parseInt(limit));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ==================== ENROLLMENT & LEARNING ==================== //

// [POST] /api/courses/:course_id/enroll - Đăng ký khóa học
exports.enrollCourse = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { course_id } = req.params;
    const result = await Course.enrollCourse(user_id, course_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/courses/:course_id/progress - Lấy tiến độ học của user trong khóa học
exports.getLearningProgress = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { course_id } = req.params;
    const result = await Course.getLearningProgress(user_id, course_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ==================== LESSON ==================== //

// [GET] /api/courses/lessons/:lesson_id - Lấy chi tiết bài học
exports.getLessonDetail = async (req, res, next) => {
  try {
    const { lesson_id } = req.params;
    const user_id = req.user.userId;
    const result = await Course.getLessonDetail(user_id, lesson_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] /api/courses/lessons/:lesson_id/progress - Cập nhật tiến độ bài học
exports.updateLessonProgress = async (req, res, next) => {
  try {
    const { lesson_id } = req.params;
    const user_id = req.user.userId;
    const { progress } = req.body; // % hoặc trạng thái hoàn thành
    const result = await Course.updateLessonProgress(user_id, lesson_id, progress);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ==================== USER COURSES ==================== //

// [GET] /api/courses/user/my-courses - Lấy danh sách khóa học đã đăng ký
exports.getUserCourses = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const result = await Course.getUserCourses(user_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
