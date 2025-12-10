const { Lesson, Module, Course, User } = require("../../models");
const { Op } = require("sequelize");

const lessonClientService = {
  // Lấy chi tiết bài học
  findById: async (lessonId) => {
    return await Lesson.findOne({
      where: { lesson_id: lessonId, is_active: true },
      attributes: {
        include: ["lesson_data", "metadata"], // Thêm lesson_data và metadata vào attributes
      },
      include: [
        {
          model: Module,
          as: "module",
          attributes: ["module_id", "title", "sort_order"]
        },
        {
          model: Course,
          as: "course",
          attributes: ["course_id", "title", "instructor_id"]
        }
      ]
    });
  },

  // Lấy danh sách bài học theo module
  findByModule: async (moduleId, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Lesson.findAndCountAll({
      where: { 
        module_id: moduleId, 
        is_active: true 
      },
      order: [["sort_order", "ASC"]],
      limit: parseInt(limit),
      offset: offset,
      attributes: [
        "lesson_id", "title", "description", "video_duration", 
        "lesson_type", "lesson_data", "metadata", "is_free", "view_count", "sort_order"
      ]
    });

    return {
      lessons: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  },

  // Lấy danh sách bài học theo khóa học
  findByCourse: async (courseId, page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Lesson.findAndCountAll({
      where: { 
        course_id: courseId, 
        is_active: true 
      },
      attributes: {
        include: ["lesson_data", "metadata"], // Thêm lesson_data và metadata
      },
      include: [
        {
          model: Module,
          as: "module",
          attributes: ["module_id", "title", "sort_order"]
        }
      ],
      order: [
        [{ model: Module, as: "module" }, "sort_order", "ASC"],
        ["sort_order", "ASC"]
      ],
      limit: parseInt(limit),
      offset: offset
    });

    return {
      lessons: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  },

  // Cập nhật view count
  incrementViewCount: async (lessonId) => {
    return await Lesson.increment('view_count', {
      where: { lesson_id: lessonId }
    });
  }
};

module.exports = lessonClientService;