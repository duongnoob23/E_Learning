const Course = require("../services/courseClientService");
// [GET] Lấy danh sách khóa học với filter và sort

// [GET] Lấy danh sách khóa học theo category
exports.getCategories = async (req, res, next) => {
  try {
    const result = await Course.getAllCategories();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách khóa học theo instructor
exports.getInstructors = async (req, res, next) => {
  try {
    const result = await Course.getAllInstructors();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách khóa học theo level
exports.getLevels = async (req, res, next) => {
  try {
    const result = await Course.getAllLevels();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

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

// [GET] Lấy danh sách khóa học theo id
exports.getCourseById = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const course = await Course.findbyId(course_id);
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy curriculum (modules + lessons) của course
exports.getCourseCurriculum = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const result = await Course.getCourseCurriculum(course_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
