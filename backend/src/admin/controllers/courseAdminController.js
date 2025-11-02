const courseAdminService = require("../services/courseAdminService");

// [GET] /api/admin/courses
exports.getCourses = async (req, res, next) => {
  try {
    const { status, category_id, instructor_id, keyword, page, limit } = req.query;
    const response = await courseAdminService.getCourses({
      status,
      category_id,
      instructor_id,
      keyword,
      page,
      limit,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/admin/courses/:id
exports.getCourseDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await courseAdminService.getCourseDetail(id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [PATCH] /api/admin/courses/:id/approve
exports.approveCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    // Nếu sau này token có role admin và userId, có thể truyền admin_user_id để audit
    const admin_user_id = req.user?.userId;
    const response = await courseAdminService.approveCourse(id, { comment, admin_user_id });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [PATCH] /api/admin/courses/:id/reject
exports.rejectCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const admin_user_id = req.user?.userId;
    const response = await courseAdminService.rejectCourse(id, { comment, admin_user_id });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [DELETE] /api/admin/courses/:id
exports.removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await courseAdminService.removeCourse(id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [GET] /api/admin/instructors
exports.getInstructors = async (req, res, next) => {
  try {
    const { page, limit, keyword, status } = req.query;
    const response = await courseAdminService.getInstructors({
      page,
      limit,
      keyword,
      status,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};
