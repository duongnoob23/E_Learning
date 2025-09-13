const Course = require("../services/courseClientService");
// [GET] Lấy danh sách khóa học với filter và sort
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
      limit = 12
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
      limit: parseInt(limit)
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
    const { course_id  } = req.params;
    const course = await Course.findbyId(course_id );
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách khóa học theo category
exports.getCourseByCategory = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    const courses = await Course.findByCategory(category_id);
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách khóa học theo level
exports.getCoursebyLevel = async (req, res, next) => {
  try {
    const { level_id } = req.query;
    const courses = await Course.findByLevel(level_id);
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách khóa học theo instructor
exports.getCourseByInstructor = async (req, res, next) => {
  try {
    const { instructor_id } = req.query;
    const courses = await Course.findByInstructor(instructor_id);
    res.json(courses);
  } catch (error) {
    next(error);
  }
};
