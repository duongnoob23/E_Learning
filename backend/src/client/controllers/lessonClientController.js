const lessonClientService = require("../services/lessonClientService");

// [GET] Lấy chi tiết bài học
exports.getLessonById = async (req, res, next) => {
  try {
    const { lesson_id } = req.params;
    const lesson = await lessonClientService.findById(lesson_id);
    
    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        message: "Bài học không tồn tại" 
      });
    }

    // Tăng view count
    await lessonClientService.incrementViewCount(lesson_id);

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách bài học theo module
exports.getLessonsByModule = async (req, res, next) => {
  try {
    const { module_id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await lessonClientService.findByModule(module_id, page, limit);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách bài học theo khóa học
exports.getLessonsByCourse = async (req, res, next) => {
  try {
    const { course_id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const result = await lessonClientService.findByCourse(course_id, page, limit);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};