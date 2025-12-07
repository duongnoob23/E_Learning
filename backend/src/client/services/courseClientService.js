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
const CourseEnrollment = require("../../models").CourseEnrollment; // Bảng trung gian user - course
const LessonProgress = require("../../models").LessonProgress;
const CourseDetail = require("../../models").CourseDetail;

const vnd = n => n == null ? null : n.toLocaleString("vi-VN") + "₫";
// ==================== COURSE DETAIL ==================== //
exports.getCourseDetail = async (course_id) => {
  try {
    const course = await Course.findByPk(course_id, {
      include: [
        { model: Category, attributes: ["name"] },
        { model: Instructor, attributes: ["name", "avatar", "bio"] },
        { model: Level, attributes: ["name"] },
      ],
    });

    if (!course) {
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
    }

    return { EM: "Lấy chi tiết khóa học thành công", EC: "0", DT: course };
  } catch (error) {
    console.error("Lỗi trong getCourseDetail service:", error);
    return { EM: "Có lỗi xảy ra khi lấy chi tiết khóa học", EC: "-2", DT: null };
  }
};
// ==================== COURSE STRUCTURE ==================== //
exports.getCourseStructure = async (user_id, course_id) => {
  try {
    const course = await Course.findByPk(course_id);
    if (!course) return { EM: "Khóa học không tồn tại", EC: "2", DT: null };

    const modules = await Module.findAll({
      where: { course_id },
      order: [["sort_order", "ASC"]],
      attributes: ["module_id", "title", "sort_order"],
      include: [{
        model: Lesson,
        as: "lessons",
        where: { is_active: true },  // ✅ Chỉ lấy lessons đang active
        required: false,  // LEFT JOIN để vẫn lấy module dù không có lesson
        attributes: ["lesson_id", "title","content", "sort_order", "lesson_type", "is_free","video_url","has_exercise",
            "exercise_type",
            "exercise_data",
            "exercise_duration",
            "pass_score",
            "max_score"],
        order: [["sort_order", "ASC"]]
      }]
    });

    return {
      EM: "Lấy cấu trúc khóa học thành công",
      EC: "0",
      DT: {
        course: {
          course_id: course.course_id,
          title: course.title,
        },
        modules
      }
    };
  } catch (error) {
    console.error("Lỗi getCourseStructure:", error);
    return { EM: "Lỗi khi lấy dữ liệu khóa học", EC: "-2", DT: null };
  }
};

// COURSE PREVIEW
exports.getCoursePreview = async (course_id) => {
  try {
    const course = await Course.findOne({
      where: { course_id },
      include: [
        // Instructor
        { model: Instructor, as: "instructor", attributes: ["name", "avatar"] },

        // Category
        { model: Category, as: "category", attributes: ["name"] },

        // ⭐ Course Detail (alias phải là 'detail')
        {
          model: CourseDetail,
          as: "detail",
          attributes: [
            "about_content",
            "learning_outcomes",
            "skills_covered",
            "requirements",
            "achievements",
            "certificate_info",
            "last_updated",
            "language",
            "target_audience"
          ]
        },

        // Modules + Lessons
        {
          model: Module,
          as: "modules",
          attributes: [
            "module_id",
            "title",
            "total_lectures",
            "total_duration",
            "sort_order"
          ],
          include: [
            {
              model: Lesson,
              as: "lessons",
              attributes: [
                "lesson_id",
                "title",
                "video_duration",
                "sort_order",
                "is_free"
              ]
            }
          ]
        },

        // Course Review
        {
          model: CourseReview,
          as: "reviews",
          where: { status: "approved" },
          required: false,
          attributes: ["review_id", "rating", "content", "created_at"],
          include: [
            { model: User, attributes: ["full_name", "avatar_url"] }
          ]
        }
      ],
      attributes: [
        "course_id",
        "title",
        "short_description",
        "description",
        "image",
        "video_preview",
        "video_duration",
        "video_progress",

        // Sẽ tính realtime, nhưng vẫn trả ra nếu đã có
        "total_lessons",
        "total_duration",

        "rating",
        "rating_count",
        "price",
        "old_price",
        "discount_percent",
        "is_free"
      ]
    });

    if (!course) return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };

    // -----------------------------
    // ⭐ PARSE COURSE DETAIL
    // -----------------------------
    const detail = course.detail;

    const parseJson = (value) => {
      try {
        if (!value) return [];
        return Array.isArray(value) ? value : JSON.parse(value);
      } catch {
        return [];
      }
    };

    const courseDetails = {
      about: detail?.about_content || "",
      learning_outcomes: parseJson(detail?.learning_outcomes),
      skills: parseJson(detail?.skills_covered),
      requirements: parseJson(detail?.requirements),
      achievements: parseJson(detail?.achievements),
      certificate: detail?.certificate_info || null,
      last_updated: detail?.last_updated,
      language: detail?.language || "Không rõ",
      target_audience: detail?.target_audience || ""
    };

    // -----------------------------
    // ⭐ CALC MODULES + LESSONS REALTIME
    // -----------------------------
    let totalLessonReal = 0;
    const modules = (course.modules || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((m) => {
        const lessons = (m.lessons || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((l) => ({
            lesson_id: l.lesson_id,
            title: l.title,
            duration: l.video_duration,
            is_free: l.is_free
          }));

        totalLessonReal += lessons.length;

        return {
          module_id: m.module_id,
          title: m.title,
          lectures: lessons.length,
          total_duration: m.total_duration,
          lessons
        };
      });

    // -----------------------------
    // ⭐ CALC REVIEWS REALTIME
    // -----------------------------
    const reviews = (course.reviews || []).map((r) => ({
      id: r.review_id,
      rating: r.rating,
      content: r.content,
      user: r.User?.full_name,
      avatar: r.User?.avatar_url,
      time: r.created_at
    }));

    const ratingCountReal = reviews.length;

    // -----------------------------
    // ⭐ FORMAT FINAL RESPONSE
    // -----------------------------
    return {
      EM: "Lấy chi tiết khóa học thành công",
      EC: "0",
      DT: {
        course: {
          course_id: course.course_id,
          title: course.title,
          category: course.category?.name || null,
          short_description: course.short_description,
          description: course.description,

          // Instructor
          instructor: course.instructor,

          // Video
          image: course.image,
          video_preview: course.video_preview,
          video_duration: course.video_duration,
          video_progress: Number(course.video_progress),

          // Real-time
          total_lessons: totalLessonReal,
          total_reviews: ratingCountReal,

          // Rating
          rating: Number(course.rating || 0),
          rating_count: ratingCountReal,

          // Pricing
          price: Number(course.price),
          old_price: course.old_price,
          discount_percent: course.discount_percent,
          is_free: course.is_free,

          // Details & Modules & Reviews
          details: courseDetails,
          modules,
          reviews
        }
      }
    };

  } catch (err) {
    console.error("getCoursePreview error:", err);
    return { EM: "Lỗi server", EC: "-1", DT: null };
  }
};


// ==================== ENROLL COURSE ==================== //
exports.enrollCourse = async (user_id, course_id) => {
  try {
    const course = await Course.findByPk(course_id);
    if (!course)
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };

    let enrollment = await CourseEnrollment.findOne({ where: { user_id, course_id } });

    if (!enrollment) {
      enrollment = await CourseEnrollment.create({
        user_id,
        course_id,
        enrolled_at: new Date(),
        status: "active",
        payment_status: course.is_free ? "paid" : "pending",
      });
    }

    return { 
      EM: course.is_free 
          ? "Bạn đã tham gia khóa học miễn phí" 
          : "Khóa học cần thanh toán", 
      EC: "0", 
      DT: {
        course_id,
        is_free: course.is_free,
        payment_status: enrollment.payment_status,
        enrollment_id: enrollment.enrollment_id,
      }
    };

  } catch (error) {
    console.error("Lỗi trong enrollCourse service:", error);
    return { EM: "Có lỗi xảy ra khi đăng ký khóa học", EC: "-2", DT: null };
  }
};


// ==================== USER COURSES ==================== //
exports.getUserCourses = async (user_id) => {
  try {
    const CourseEnrollments = await CourseEnrollment.findAll({
      where: { user_id },
      include: [
        {
          model: Course,
          as: "course_detail",
          include: [
            { model: Instructor, attributes: ["name"] },
            { model: Category, attributes: ["name"] },
          ],
        },
      ],
      order: [["enrolled_at", "DESC"]],
    });

    return { EM: "Lấy danh sách khóa học của bạn thành công", EC: "0", DT: CourseEnrollments };
  } catch (error) {
    console.error("Lỗi trong getUserCourses service:", error);
    return { EM: "Có lỗi xảy ra khi lấy khóa học người dùng", EC: "-2", DT: null };
  }
};

// ==================== COURSE PROGRESS ==================== //
exports.getLearningProgress = async (user_id, course_id) => {
  try {
    const lessons = await Lesson.findAll({ where: { course_id } });
    const progress = await LessonProgress.findAll({
      where: { user_id, course_id },
      attributes: ["lesson_id", "completion_percent"],
    });

    const total = lessons.length;
    const completed = progress.filter((p) => p.is_completed).length;
    const percentage = total > 0 ? (completed / total).toFixed(2) : 0;

    return {
      EM: "Lấy tiến độ học thành công",
      EC: "0",
      DT: { total_lessons: total, completed_lessons: completed, progress: percentage },
    };
  } catch (error) {
    console.error("Lỗi trong getLearningProgress service:", error);
    return { EM: "Có lỗi xảy ra khi lấy tiến độ học", EC: "-2", DT: null };
  }
};

// ==================== UPDATE LESSON PROGRESS ==================== //
exports.updateLessonProgress = async (user_id, lesson_id, progress) => {
  try {
    // 1️⃣ Tìm lesson để biết nó thuộc course nào
    const lesson = await Lesson.findByPk(lesson_id, {
      attributes: ["lesson_id", "course_id"],
    });

    if (!lesson) {
      return {
        EM: "Không tìm thấy bài học",
        EC: "404",
        DT: null,
      };
    }

    const course_id = lesson.course_id;

    // 2️⃣ Tìm hoặc tạo bản ghi tiến độ học
    const [record, created] = await LessonProgress.findOrCreate({
      where: { user_id, lesson_id },
      defaults: {
        course_id,
        completion_percent: progress, // dùng đúng cột của bạn
      },
    });

    // 3️⃣ Nếu đã tồn tại, cập nhật lại tiến độ
    if (!created) {
      record.completion_percent = progress;
      await record.save();
    }

    // 4️⃣ Cập nhật tiến độ tổng thể trong course_enrollments (nếu cần)
    // Bạn có thể cộng dồn % hoặc tính trung bình
    const allLessons = await LessonProgress.findAll({
      where: { user_id, course_id },
      attributes: ["completion_percent"],
    });

    const avgProgress =
      allLessons.reduce((sum, l) => sum + parseFloat(l.completion_percent || 0), 0) /
      allLessons.length;

    await CourseEnrollment.update(
      { progress_percent: avgProgress.toFixed(2) },
      { where: { user_id, course_id } }
    );

    return {
      EM: "Cập nhật tiến độ bài học thành công",
      EC: "0",
      DT: {
        lesson_id,
        course_id,
        progress: progress,
      },
    };
  } catch (error) {
    console.error("Lỗi trong updateLessonProgress service:", error);
    return {
      EM: "Có lỗi xảy ra khi cập nhật tiến độ bài học",
      EC: "-2",
      DT: null,
    };
  }
};
// ==================== START LESSON ==================== //
exports.startLesson = async ({ user_id, course_id, lesson_id, total_duration }) => {
  try {
    let progress = await LessonProgress.findOne({
      where: { user_id, course_id, lesson_id }
    });

    // Chưa có → tạo mới
    if (!progress) {
      progress = await LessonProgress.create({
        user_id,
        course_id,
        lesson_id,
        total_duration,
        watched_duration: 0,
        completion_percent: 0,
        status: "in_progress",
        started_at: new Date(),
        last_accessed_at: new Date()
      });
    } else {
      // Có rồi → cập nhật last accessed
      await progress.update({
        total_duration: total_duration || progress.total_duration,
        last_accessed_at: new Date()
      });
    }

    return { EM: "Bắt đầu bài học", EC: "0", DT: progress };
  } catch (err) {
    console.error("startLesson:", err);
    return { EM: "Lỗi server", EC: "-1", DT: null };
  }
};
// ==================== UPDATE PROGRESS ==================== //
exports.updateProgress = async ({ user_id, lesson_id, watched_duration }) => {
  try {
    const progress = await LessonProgress.findOne({
      where: { user_id, lesson_id }
    });

    if (!progress) {
      return { EM: "Chưa start bài học", EC: "2", DT: null };
    }

    const total = progress.total_duration || 1;

    const newPercent = Math.min(100, Math.round((watched_duration / total) * 100));

    await progress.update({
      watched_duration,
      completion_percent: newPercent,
      status: newPercent >= 90 ? "completed" : "in_progress",
      last_accessed_at: new Date(),
      completed_at: newPercent >= 90 && !progress.completed_at ? new Date() : progress.completed_at
    });

    return { EM: "Cập nhật tiến độ", EC: "0", DT: progress };
  } catch (err) {
    return { EM: "Lỗi server", EC: "-1", DT: null };
  }
};

// ==================== COMPLETE LESSON ==================== //
exports.completeLesson = async ({ user_id, lesson_id }) => {
  try {
    const progress = await LessonProgress.findOne({
      where: { user_id, lesson_id }
    });

    if (!progress) {
      return { EM: "Chưa start bài học", EC: "2", DT: null };
    }

    await progress.update({
      status: "completed",
      completion_percent: 100,
      watched_duration: progress.total_duration,
      completed_at: new Date()
    });

    return { EM: "Hoàn thành bài học", EC: "0", DT: progress };
  } catch (err) {
    return { EM: "Lỗi server", EC: "-1", DT: null };
  }
};
// ==================== GET COURSE PROGRESS ==================== //
exports.getCourseProgress = async (user_id, course_id) => {
  try {
    const course = await Course.findByPk(course_id);
    if (!course) {
      return {
        EM: "Không tìm thấy khóa học",
        EC: "2",
        DT: null
      };
    }

    // 1️⃣ Lấy tổng số bài học thực tế
    const totalLessons = await Lesson.count({ where: { course_id } });

    // Nếu khóa học không có bài học
    if (totalLessons === 0) {
      return {
        EM: "Khóa học chưa có bài học nào",
        EC: "0",
        DT: {
          course_id,
          completed_lessons: 0,
          total_lessons: 0,
          progress_percent: 0,
          lessons: []
        }
      };
    }

    // 2️⃣ Lấy danh sách tiến độ của user
    const progressList = await LessonProgress.findAll({
      where: { user_id, course_id },
      attributes: [
        "lesson_id",
        "status",
        "watched_duration",
        "total_duration",
        "completion_percent",
        "last_accessed_at"
      ]
    });

    // Nếu user chưa học bài nào → trả đúng format
    if (!progressList || progressList.length === 0) {
      return {
        EM: "User chưa học bài nào",
        EC: "0",
        DT: {
          course_id,
          completed_lessons: 0,
          total_lessons: totalLessons,
          progress_percent: 0,
          lessons: []
        }
      };
    }

    // 3️⃣ Tính số bài completed
    const completedLessons = progressList.filter(
      p => p.status === "completed"
    ).length;

    // 4️⃣ % progress
    const progressPercent = Math.round(
      (completedLessons / totalLessons) * 100
    );

    return {
      EM: "Lấy tiến độ khóa học thành công",
      EC: "0",
      DT: {
        course_id,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        progress_percent: progressPercent,
        lessons: progressList
      }
    };
  } catch (err) {
    console.error("getCourseProgress error:", err);
    return {
      EM: "Lỗi server",
      EC: "-1",
      DT: null
    };
  }
};



exports.getLessonProgress = async ({ user_id, lesson_id }) => {
  const progress = await LessonProgress.findOne({
    where: { user_id, lesson_id }
  });

  return {
    EM: "OK",
    EC: "0",
    DT: progress
  };
};

// ==================== LESSON DETAIL ==================== //
exports.getLessonDetail = async (user_id, lesson_id) => {
  try {
    // 1. Lấy thông tin bài học và course_id của nó
    const lesson = await Lesson.findByPk(lesson_id, {
      attributes: ["lesson_id", "title", "description", "video_url", "course_id"],
    });

    if (!lesson) {
      return {
        EM: "Không tìm thấy bài học",
        EC: "404",
        DT: null,
      };
    }

    const course_id = lesson.course_id;

    // 2. Kiểm tra xem user đã đăng ký khóa học này chưa
    const enrollment = await CourseEnrollment.findOne({
      where: { user_id, course_id },
    });

    if (!enrollment) {
      return {
        EM: "Người dùng chưa đăng ký khóa học này",
        EC: "403",
        DT: null,
      };
    }

    // 3. Trả thông tin chi tiết bài học
    return {
      EM: "Lấy thông tin bài học thành công",
      EC: "0",
      DT: lesson,
    };
  } catch (error) {
    console.error("Lỗi trong getLessonDetail service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy chi tiết bài học",
      EC: "-2",
      DT: null,
    };
  }
};

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
