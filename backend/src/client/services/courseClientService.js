const Course = require("../../models").Course;
const { Op } = require("sequelize");
const Category = require("../../models").Category;
const Instructor = require("../../models").Instructor;
const Level = require("../../models").Level;
const Module = require("../../models").Module;
const Lesson = require("../../models").Lesson;
const CourseReview = require("../../models").CourseReview;
const User = require("../../models").User;
const CourseDiscussion = require("../../models").CourseDiscussion;

// ==================== CATEGORIES ====================

// Lấy tất cả categories
exports.getAllCategories = async () => {
  try {
    const categories = await Category.findAll({
      where: {
        is_active: true,
      },
      order: [
        ["sort_order", "ASC"],
        ["name", "ASC"],
      ],
      attributes: [
        "category_id",
        "name",
        "slug",
        "description",
        "icon",
        "color",
        "image",
      ],
    });

    return {
      EM: "Lấy danh sách danh mục thành công",
      EC: "0",
      DT: categories,
    };
  } catch (error) {
    console.error("Lỗi trong getAllCategories service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy danh sách danh mục",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== LEVELS ====================

exports.getAllLevels = async () => {
  try {
    const levels = await Level.findAll({
      where: {
        is_active: true,
      },
      order: [
        ["sort_order", "ASC"],
        ["name", "ASC"],
      ],
      attributes: ["level_id", "name", "slug", "description", "color"],
    });

    return {
      EM: "Lấy danh sách trình độ thành công",
      EC: "0",
      DT: levels,
    };
  } catch (error) {
    console.error("Lỗi trong getAllLevels service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy danh sách trình độ",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== INSTRUCTORS ====================

// Lấy tất cả instructors
exports.getAllInstructors = async () => {
  try {
    const instructors = await Instructor.findAll({
      where: {
        is_active: true,
      },
      order: [
        ["is_featured", "DESC"],
        ["name", "ASC"],
      ],
      attributes: [
        "instructor_id",
        "name",
        "avatar",
        "bio",
        "experience_years",
        "specializations",
        "education",
        "achievements",
        "is_featured",
        "is_verified",
      ],
    });

    return {
      EM: "Lấy danh sách giảng viên thành công",
      EC: "0",
      DT: instructors,
    };
  } catch (error) {
    console.error("Lỗi trong getAllInstructors service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy danh sách giảng viên",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách khóa học
exports.findAll = async () => {
  try {
    const courses = await Course.findAll();
    return {
      EM: "Truy vấn thành công",
      EC: "0", // success
      DT: courses,
    };
  } catch (error) {
    console.error("Lỗi trong findAllCourses service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2", // lỗi hệ thống
      DT: null,
    };
  }
};

// Lấy danh sách khóa học theo tiêu đề
exports.findByTitle = async (title) => {
  try {
    const course = await Course.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      },
    });

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: course,
    };
  } catch (error) {
    console.error("Lỗi trong findByTitle service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách khóa học theo id
exports.findbyId = async (id) => {
  try {
    const course = await Course.findbyId(id);
    if (!course) {
      return {
        EM: "Không tìm thấy khóa học",
        EC: "2",
        DT: null,
      };
    } else {
      return {
        EM: "Truy vấn thành công",
        EC: "0",
        DT: course,
      };
    }
  } catch (error) {
    console.error("Lỗi trong findbyId service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách khóa học với filter và sort
exports.findAllWithFilters = async (filters) => {
  try {
    const {
      title,
      category,
      instructor,
      level,
      price_type,
      min_price,
      max_price,
      rating,
      sort_by,
      page,
      limit,
    } = filters;

    // Build where conditions
    const whereConditions = {};

    if (title) {
      whereConditions.title = {
        [Op.like]: `%${title}%`,
      };
    }

    if (category) {
      whereConditions.category_id = category;
    }

    if (instructor) {
      whereConditions.instructor_id = instructor;
    }

    if (level) {
      whereConditions.level_id = level;
    }

    if (price_type === "free") {
      whereConditions.is_free = true;
    } else if (price_type === "paid") {
      whereConditions.is_free = false;
    }

    if (min_price && max_price) {
      whereConditions.price = {
        [Op.between]: [parseFloat(min_price), parseFloat(max_price)],
      };
    } else if (min_price) {
      whereConditions.price = {
        [Op.gte]: parseFloat(min_price),
      };
    } else if (max_price) {
      whereConditions.price = {
        [Op.lte]: parseFloat(max_price),
      };
    }

    if (rating) {
      whereConditions.average_rating = {
        [Op.gte]: parseFloat(rating),
      };
    }

    // Build order conditions
    let orderConditions = [];
    switch (sort_by) {
      case "newest":
        orderConditions = [["created_at", "DESC"]];
        break;
      case "popular":
        orderConditions = [["total_students", "DESC"]];
        break;
      case "price_asc":
        orderConditions = [["price", "ASC"]];
        break;
      case "price_desc":
        orderConditions = [["price", "DESC"]];
        break;
      case "rating":
        orderConditions = [["average_rating", "DESC"]];
        break;
      default:
        orderConditions = [["created_at", "DESC"]];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Course.findAndCountAll({
      where: whereConditions,
      order: orderConditions,
      limit: limit,
      offset: offset,
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Instructor,
          attributes: ["instructor_id", "name"],
        },
        {
          model: Level,
          attributes: ["level_id", "name"],
        },
      ],
    });

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: {
        courses: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong findAllWithFilters service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy curriculum (modules + lessons) của course
exports.getCourseCurriculum = async (course_id) => {
  try {
    console.log("run 22");
    // Kiểm tra course có tồn tại không
    const course = await Course.findByPk(course_id);
    if (!course) {
      return {
        EM: "Không tìm thấy khóa học",
        EC: "2",
        DT: null,
      };
    }

    // Lấy modules và lessons
    const modules = await Module.findAll({
      where: {
        course_id: course_id,
        is_active: true,
      },
      order: [["sort_order", "ASC"]],
      include: [
        {
          model: Lesson,
          where: {
            is_active: true,
          },
          order: [["sort_order", "ASC"]],
          attributes: [
            "lesson_id",
            "title",
            "description",
            "video_duration",
            "lesson_type",
            "is_free",
            "sort_order",
          ],
          required: false,
        },
      ],
      attributes: [
        "module_id",
        "title",
        "description",
        "total_lectures",
        "total_duration",
        "sort_order",
      ],
    });

    return {
      EM: "Lấy chương trình học thành công",
      EC: "0",
      DT: {
        course_id: course_id,
        course_title: course.title,
        modules: modules,
      },
    };
  } catch (error) {
    console.error("Lỗi trong getCourseCurriculum service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy chương trình học",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== COURSE REVIEWS ====================

// Lấy đánh giá khóa học
exports.getCourseReviews = async (course_id, page = 1, limit = 10) => {
  try {
    // Kiểm tra course có tồn tại không
    const course = await Course.findByPk(course_id);
    if (!course) {
      return {
        EM: "Không tìm thấy khóa học",
        EC: "2",
        DT: null,
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await CourseReview.findAndCountAll({
      where: {
        course_id: course_id,
        status: "approved",
      },
      order: [["created_at", "DESC"]],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ["user_id", "full_name", "avatar_url"],
        },
      ],
      attributes: [
        "review_id",
        "rating",
        "title",
        "content",
        "is_verified",
        "created_at",
      ],
    });

    return {
      EM: "Lấy đánh giá khóa học thành công",
      EC: "0",
      DT: {
        reviews: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getCourseReviews service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy đánh giá khóa học",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== COURSE DISCUSSIONS ====================

// Lấy thảo luận khóa học
exports.getCourseDiscussions = async (course_id, page = 1, limit = 10) => {
  try {
    // Kiểm tra course có tồn tại không
    const course = await Course.findByPk(course_id);
    if (!course) {
      return {
        EM: "Không tìm thấy khóa học",
        EC: "2",
        DT: null,
      };
    }

    const offset = (page - 1) * limit;

    // Lấy discussions chính (parent_id = null)
    const { count, rows } = await CourseDiscussion.findAndCountAll({
      where: {
        course_id: course_id,
        parent_id: null,
        status: "active",
      },
      order: [["created_at", "DESC"]],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ["user_id", "full_name", "avatar_url"],
        },
        {
          model: CourseDiscussion,
          as: "replies",
          where: {
            status: "active",
          },
          required: false,
          include: [
            {
              model: User,
              attributes: ["user_id", "full_name", "avatar_url"],
            },
          ],
          attributes: ["discussion_id", "content", "likes_count", "created_at"],
        },
      ],
      attributes: [
        "discussion_id",
        "title",
        "content",
        "likes_count",
        "replies_count",
        "created_at",
      ],
    });

    return {
      EM: "Lấy thảo luận khóa học thành công",
      EC: "0",
      DT: {
        discussions: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getCourseDiscussions service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy thảo luận khóa học",
      EC: "-2",
      DT: null,
    };
  }
};

// ==================== SUGGESTED COURSES ====================

// Lấy khóa học gợi ý
exports.getSuggestedCourses = async (limit = 6) => {
  try {
    const courses = await Course.findAll({
      where: {
        status: "published",
        is_featured: true,
      },
      order: [
        ["rating", "DESC"],
        ["total_students", "DESC"],
      ],
      limit: limit,
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: Instructor,
          attributes: ["instructor_id", "name"],
        },
        {
          model: Level,
          attributes: ["level_id", "name"],
        },
      ],
      attributes: [
        "course_id",
        "title",
        "short_description",
        "image",
        "price",
        "old_price",
        "discount_percent",
        "rating",
        "rating_count",
        "total_students",
        "is_free",
        "is_best_seller",
      ],
    });

    return {
      EM: "Lấy khóa học gợi ý thành công",
      EC: "0",
      DT: courses,
    };
  } catch (error) {
    console.error("Lỗi trong getSuggestedCourses service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy khóa học gợi ý",
      EC: "-2",
      DT: null,
    };
  }
};
