const { Op } = require("sequelize");
const sequelize = require("../../config/database");
const {
  Course,
  Module,
  Lesson,
  CourseReview,
  User,
  Instructor,
  CourseDetail,
  CourseTag,
  CourseTagRelation,
} = require("../../models");

// ======================= //
// 🔍 HELPER FUNCTIONS //
// ======================= //

// Helper function: Validate lesson_data theo lesson_type
const validateLessonData = (lesson_type, lesson_data) => {
  if (!lesson_data) return { valid: true, error: null };

  // Các lesson_type không cần lesson_data
  const typesWithoutData = ["video", "document", "assignment", "live"];
  if (typesWithoutData.includes(lesson_type)) {
    return { valid: true, error: null };
  }

  // Các lesson_type cần lesson_data với format cụ thể
  const vocabularyTypes = [
    "vocabulary_list",
    "vocabulary_matching",
    "vocabulary_translation",
    "vocabulary_quiz",
    "vocabulary_listening",
    "vocabulary_image_choice",
    "vocabulary_sentence_completion",
  ];

  if (vocabularyTypes.includes(lesson_type) || lesson_type === "grammar_theory") {
    if (typeof lesson_data !== "object") {
      return {
        valid: false,
        error: `lesson_data phải là object cho lesson_type: ${lesson_type}`,
      };
    }

    // Kiểm tra format cơ bản
    if (lesson_type === "vocabulary_list" && !lesson_data.words) {
      return {
        valid: false,
        error: "vocabulary_list cần lesson_data.words (array)",
      };
    }

    if (
      [
        "vocabulary_matching",
        "vocabulary_translation",
        "vocabulary_quiz",
        "vocabulary_listening",
        "vocabulary_image_choice",
        "vocabulary_sentence_completion",
      ].includes(lesson_type) &&
      !lesson_data.questions
    ) {
      return {
        valid: false,
        error: `${lesson_type} cần lesson_data.questions (array)`,
      };
    }

    if (lesson_type === "grammar_theory") {
      // grammar_theory có thể có mode: "page" hoặc "structured"
      if (!lesson_data.mode) {
        return {
          valid: false,
          error: "grammar_theory cần lesson_data.mode ('page' hoặc 'structured')",
        };
      }
    }
  }

  return { valid: true, error: null };
};

// ======================= //
// 🎓 GIẢNG VIÊN - KHÓA HỌC //
// ======================= //

// [GET] Lấy danh sách khóa học của giảng viên
exports.getInstructorCourses = async (user_id, page = 1, limit = 10) => {
  try {
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * perPage;

    const { count, rows } = await Course.findAndCountAll({
      where: { instructor_id: user_id },
      order: [["created_at", "DESC"]],
      limit: perPage,
      offset: offset,
      attributes: [
        "course_id",
        "title",
        "short_description",
        "price",
        "is_free",
        "status",
        "total_students",
        "rating",
        "created_at",
      ],
    });

    return {
      EM: "Lấy danh sách khóa học của giảng viên thành công",
      EC: "0",
      DT: {
        courses: rows,
        pagination: {
          current_page: currentPage,
          total_pages: Math.ceil(count / perPage),
          total_items: count,
          items_per_page: perPage,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getInstructorCourses service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy danh sách khóa học của giảng viên",
      EC: "-2",
      DT: null,
    };
  }
};

// [POST] Tạo khóa học mới
exports.createCourse = async (user_id, data) => {
  try {
    const { title, description, price, is_free, category_id, level_id } = data;

    // Workaround: Tìm hoặc tạo instructor từ user_id
    let instructor = await Instructor.findOne({
      where: { user_id },
    });

    // Nếu chưa có instructor, tạo mới
    if (!instructor) {
      // Lấy thông tin user để tạo instructor
      const user = await User.findByPk(user_id);

      instructor = await Instructor.create({
        user_id,
        name: user?.full_name || user?.email || "Admin Instructor",
        avatar: user?.avatar || null,
        bio: "Admin created instructor",
        is_active: true,
        is_verified: true, // Admin tự động verified
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    const instructor_id = instructor.instructor_id;

    // ✅ FIX: Tạo slug unique bằng cách thêm timestamp nếu duplicate
    const baseSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .substring(0, 150); // Giới hạn độ dài
    let slug = baseSlug;
    let counter = 1;

    // Kiểm tra slug đã tồn tại chưa
    while (await Course.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${Date.now()}-${counter}`;
      counter++;
      if (counter > 100) break; // Tránh vòng lặp vô hạn
    }

    const newCourse = await Course.create({
      title,
      slug, // ✅ Slug unique
      description,
      price: is_free ? 0 : price || 0,
      is_free: !!is_free,
      category_id,
      level_id,
      instructor_id,
      status: "draft",
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      EM: "Tạo khóa học thành công",
      EC: "0",
      DT: newCourse,
    };
  } catch (error) {
    console.error("Lỗi trong createCourse service:", error);
    return {
      EM:
        "Có lỗi xảy ra khi tạo khóa học: " +
        (error.message || error.original?.message || "Unknown error"),
      EC: "-2",
      DT: null,
    };
  }
};

// [PATCH] Cập nhật khóa học
exports.updateCourse = async (instructor_id, course_id, data) => {
  const course = await Course.findByPk(course_id);
  if (!course) return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
  // TODO: Bỏ qua permission check tạm thời cho demo - sẽ bật lại sau
  // if (course.instructor_id !== instructor_id)
  //   return { EM: "Không có quyền chỉnh sửa khóa học", EC: "3", DT: null };

  await course.update({
    title: data.title || course.title,
    description: data.description || course.description,
    price: data.price ?? course.price,
    image: data.image || course.image,
    video_preview: data.video_preview || course.video_preview,
    status: data.status || course.status, // 👈 giữ nguyên trạng thái
    updated_at: new Date(),
  });

  return { EM: "Cập nhật khóa học thành công", EC: "0", DT: course };
};

// [DELETE] Xóa (hoặc lưu trữ) khóa học
exports.deleteCourse = async (instructor_id, course_id) => {
  try {
    const course = await Course.findOne({
      where: { course_id, instructor_id },
    });

    if (!course) {
      return {
        EM: "Không tìm thấy khóa học hoặc không có quyền",
        EC: "2",
        DT: null,
      };
    }

    await course.update({ status: "archived", updated_at: new Date() });

    return { EM: "Khóa học đã được lưu trữ", EC: "0", DT: course };
  } catch (error) {
    console.error("Lỗi trong deleteCourse service:", error);
    return { EM: "Có lỗi xảy ra khi lưu trữ khóa học", EC: "-2", DT: null };
  }
};

// [POST] Tạo khóa học với đầy đủ thông tin (Course + CourseDetail + Tags + Modules + Lessons) - Transaction
exports.createCourseWithDetails = async (user_id, data) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate required fields
    if (!data.title || !data.title.trim()) {
      await transaction.rollback();
      return { EM: "Course title is required", EC: "-1", DT: null };
    }
    if (!data.slug || !data.slug.trim()) {
      await transaction.rollback();
      return { EM: "Course slug is required", EC: "-1", DT: null };
    }
    if (!data.about || !data.about.trim()) {
      await transaction.rollback();
      return { EM: "About course is required", EC: "-1", DT: null };
    }
    if (
      !data.modules ||
      !Array.isArray(data.modules) ||
      data.modules.length === 0
    ) {
      await transaction.rollback();
      return { EM: "At least one module is required", EC: "-1", DT: null };
    }

    // 1. Tìm hoặc tạo instructor
    let instructor = await Instructor.findOne({
      where: { user_id },
      transaction,
    });

    if (!instructor) {
      const user = await User.findByPk(user_id, { transaction });
      instructor = await Instructor.create(
        {
          user_id,
          name: user?.full_name || user?.email || "Admin Instructor",
          avatar: user?.avatar || null,
          bio: "Admin created instructor",
          is_active: true,
          is_verified: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction }
      );
    }

    const instructor_id = instructor.instructor_id;

    // 2. Tạo slug unique
    const baseSlug = data.slug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .substring(0, 150);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await Course.findOne({ where: { slug: finalSlug }, transaction })) {
      finalSlug = `${baseSlug}-${Date.now()}-${counter}`;
      counter++;
      if (counter > 100) break;
    }

    // 3. Tính toán total_lessons và total_duration
    let totalLessons = 0;
    let totalDurationMinutes = 0;
    data.modules.forEach((module) => {
      if (module.lessons && Array.isArray(module.lessons)) {
        totalLessons += module.lessons.length;
      }
    });

    // Tính total_duration từ durationHour và durationMinute
    const durationHour = parseInt(data.durationHour) || 0;
    const durationMinute = parseInt(data.durationMinute) || 0;
    totalDurationMinutes = durationHour * 60 + durationMinute;
    const totalDuration = `${Math.floor(totalDurationMinutes / 60)}h ${totalDurationMinutes % 60}m`;

    // 4. Tính old_price và discount_percent
    const regularPrice = parseFloat(data.regularPrice) || 0;
    const discountedPrice = parseFloat(data.discountedPrice) || 0;
    const isFree = data.priceType === "free" || regularPrice === 0;
    let oldPrice = null;
    let discountPercent = 0;

    if (!isFree && discountedPrice > 0 && discountedPrice < regularPrice) {
      oldPrice = regularPrice;
      discountPercent = Math.round(
        ((regularPrice - discountedPrice) / regularPrice) * 100
      );
    }

    // 5. Tạo Course
    const newCourse = await Course.create(
      {
        title: data.title.trim(),
        slug: finalSlug,
        short_description: data.about.trim().substring(0, 500),
        description: data.about.trim(),
        price: isFree ? 0 : discountedPrice || regularPrice,
        old_price: oldPrice,
        discount_percent: discountPercent,
        is_free: isFree,
        category_id: data.category?.category_id || data.category_id || null,
        level_id: null, // Có thể thêm sau
        instructor_id,
        image: null, // Không lưu image
        video_preview: data.videoUrl || null,
        video_duration: null, // Có thể tính từ video sau
        total_lessons: totalLessons,
        total_duration: totalDuration,
        status: "draft",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction }
    );

    const course_id = newCourse.course_id;

    // 6. Parse requirements và description thành array nếu cần
    const requirementsArray = data.requirements
      ? data.requirementsPerLine
        ? data.requirements.split("\n").filter((r) => r.trim())
        : [data.requirements.trim()]
      : [];

    const descriptionArray = data.description
      ? data.descriptionPerLine
        ? data.description.split("\n").filter((d) => d.trim())
        : [data.description.trim()]
      : [];

    // 7. Parse tags thành array
    const tagsArray = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];

    // 8. Tạo CourseDetail
    await CourseDetail.create(
      {
        course_id,
        about_content: data.about.trim(),
        learning_outcomes:
          descriptionArray.length > 0 ? JSON.stringify(descriptionArray) : null,
        skills_covered: tagsArray.length > 0 ? JSON.stringify(tagsArray) : null,
        requirements:
          requirementsArray.length > 0
            ? JSON.stringify(requirementsArray)
            : null,
        language: data.language || "English",
        target_audience: data.targetedAudience || null,
        last_updated: data.startDate || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction }
    );

    // 9. Tạo Tags
    if (tagsArray.length > 0) {
      for (const tagName of tagsArray) {
        if (!tagName) continue;

        // Tìm hoặc tạo tag
        let tag = await CourseTag.findOne({
          where: { name: tagName.toLowerCase() },
          transaction,
        });

        if (!tag) {
          tag = await CourseTag.create(
            {
              name: tagName.toLowerCase(),
              color: null,
              created_at: new Date(),
            },
            { transaction }
          );
        }

        // Tạo relation
        await CourseTagRelation.findOrCreate({
          where: {
            course_id,
            tag_id: tag.tag_id,
          },
          defaults: {
            course_id,
            tag_id: tag.tag_id,
          },
          transaction,
        });
      }
    }

    // 10. Tạo Modules và Lessons
    for (
      let moduleIndex = 0;
      moduleIndex < data.modules.length;
      moduleIndex++
    ) {
      const moduleData = data.modules[moduleIndex];

      if (!moduleData.title || !moduleData.title.trim()) {
        await transaction.rollback();
        return {
          EM: `Module ${moduleIndex + 1} title is required`,
          EC: "-1",
          DT: null,
        };
      }

      if (
        !moduleData.lessons ||
        !Array.isArray(moduleData.lessons) ||
        moduleData.lessons.length === 0
      ) {
        await transaction.rollback();
        return {
          EM: `Module "${moduleData.title}" must have at least one lesson`,
          EC: "-1",
          DT: null,
        };
      }

      const newModule = await Module.create(
        {
          course_id,
          title: moduleData.title.trim(),
          description: moduleData.description || null,
          sort_order: moduleIndex + 1,
          total_lectures: moduleData.lessons.length,
          total_duration: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction }
      );

      const module_id = newModule.module_id;

      // Tạo Lessons cho module
      for (
        let lessonIndex = 0;
        lessonIndex < moduleData.lessons.length;
        lessonIndex++
      ) {
        const lessonData = moduleData.lessons[lessonIndex];

        if (!lessonData.title || !lessonData.title.trim()) {
          await transaction.rollback();
          return {
            EM: `Lesson ${lessonIndex + 1} in module "${moduleData.title}" title is required`,
            EC: "-1",
            DT: null,
          };
        }

        // Validate video URL chỉ khi lesson_type là video
        const lessonType = lessonData.lessonType || "video";
        if (lessonType === "video" && (!lessonData.videoUrl || !lessonData.videoUrl.trim())) {
          await transaction.rollback();
          return {
            EM: `Lesson "${lessonData.title}" video URL is required for video type`,
            EC: "-1",
            DT: null,
          };
        }

        // Lấy lesson_data từ payload (nếu có)
        // lesson_data có thể là object hoặc JSON string
        let lessonDataJson = null;
        if (lessonData.lesson_data) {
          if (typeof lessonData.lesson_data === 'string') {
            try {
              lessonDataJson = JSON.parse(lessonData.lesson_data);
            } catch (e) {
              lessonDataJson = lessonData.lesson_data;
            }
          } else {
            lessonDataJson = lessonData.lesson_data;
          }
        }

        // Validate lesson_data theo lesson_type
        const validation = validateLessonData(lessonType, lessonDataJson);
        if (!validation.valid) {
          await transaction.rollback();
          return {
            EM: `Lesson "${lessonData.title}": ${validation.error}`,
            EC: "-1",
            DT: null,
          };
        }

        // Lấy metadata từ payload (nếu có)
        let metadataJson = null;
        if (lessonData.metadata) {
          if (typeof lessonData.metadata === 'string') {
            try {
              metadataJson = JSON.parse(lessonData.metadata);
            } catch (e) {
              metadataJson = lessonData.metadata;
            }
          } else {
            metadataJson = lessonData.metadata;
          }
        }

        await Lesson.create(
          {
            module_id,
            course_id,
            title: lessonData.title.trim(),
            description: lessonData.description || null,
            content: lessonData.content || null,
            video_url: lessonData.videoUrl || null,
            video_duration: lessonData.videoDuration || null,
            sort_order: lessonIndex + 1,
            lesson_type: lessonType,
            lesson_data: lessonDataJson,
            metadata: metadataJson,
            is_free: !!lessonData.isFree,
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    return {
      EM: "Tạo khóa học thành công",
      EC: "0",
      DT: newCourse,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Lỗi trong createCourseWithDetails service:", error);
    return {
      EM:
        "Có lỗi xảy ra khi tạo khóa học: " +
        (error.message || error.original?.message || "Unknown error"),
      EC: "-2",
      DT: null,
    };
  }
};

// ======================= //
// 🎓 GIẢNG VIÊN - MODULE //
// ======================= //

// [POST] Thêm module mới vào khóa học
exports.addModule = async (user_id, course_id, data) => {
  try {
    // Tìm hoặc tạo instructor từ user_id
    let instructor = await Instructor.findOne({ where: { user_id } });
    if (!instructor) {
      const user = await User.findByPk(user_id);
      instructor = await Instructor.create({
        user_id,
        name: user?.full_name || user?.email || "Admin Instructor",
        avatar: user?.avatar || null,
        bio: "Admin created instructor",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    const instructor_id = instructor.instructor_id;

    // ✅ FIX: Tìm course trước, sau đó check permission
    const course = await Course.findOne({
      where: { course_id },
    });

    if (!course) {
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
    }

    // ✅ FIX: Check permission - course phải thuộc về instructor này
    if (course.instructor_id !== instructor_id) {
      return {
        EM: "Không có quyền thêm module vào khóa học này",
        EC: "3",
        DT: null,
      };
    }

    const { title, description, sort_order } = data;

    const newModule = await Module.create({
      course_id,
      title,
      description: description || null,
      sort_order: sort_order || 1,
      total_lectures: 0,
      total_duration: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { EM: "Thêm module thành công", EC: "0", DT: newModule };
  } catch (error) {
    console.error("Lỗi trong addModule service:", error);
    return {
      EM:
        "Có lỗi xảy ra khi thêm module: " +
        (error.message || error.original?.message || "Unknown error"),
      EC: "-2",
      DT: null,
    };
  }
};

// [PATCH] Cập nhật module
exports.updateModule = async (instructor_id, module_id, data) => {
  try {
    const module = await Module.findByPk(module_id);
    if (!module) {
      return { EM: "Không tìm thấy module", EC: "2", DT: null };
    }

    // Kiểm tra quyền: chỉ giảng viên của khóa học mới được sửa
    const course = await Course.findByPk(module.course_id);
    // TODO: Bỏ qua permission check tạm thời cho demo - sẽ bật lại sau
    // if (!course || course.instructor_id !== instructor_id) {
    //   return { EM: "Không có quyền cập nhật module này", EC: "3", DT: null };
    // }

    await module.update({
      title: data.title ?? module.title,
      description: data.description ?? module.description,
      sort_order: data.sort_order ?? module.sort_order,
      updated_at: new Date(),
    });

    return { EM: "Cập nhật module thành công", EC: "0", DT: module };
  } catch (error) {
    console.error("Lỗi trong updateModule service:", error);
    return { EM: "Có lỗi xảy ra khi cập nhật module", EC: "-2", DT: null };
  }
};

// [DELETE] Xóa module (và bài học con)
exports.deleteModule = async (instructor_id, module_id) => {
  try {
    const module = await Module.findByPk(module_id);
    if (!module) {
      return { EM: "Không tìm thấy module", EC: "2", DT: null };
    }

    const course = await Course.findByPk(module.course_id);
    if (!course || course.instructor_id !== instructor_id) {
      return { EM: "Không có quyền xóa module này", EC: "3", DT: null };
    }

    // Nếu bạn có model Lesson, nên xóa lesson con ở đây:
    await Lesson.destroy({ where: { module_id } });

    await module.destroy();

    return { EM: "Xóa module thành công", EC: "0", DT: null };
  } catch (error) {
    console.error("Lỗi trong deleteModule service:", error);
    return { EM: "Có lỗi xảy ra khi xóa module", EC: "-2", DT: null };
  }
};
// Lấy ra các chương học của khóa học
exports.getModulesByCourse = async (instructor_id, course_id) => {
  try {
    const course = await Course.findOne({
      where: { course_id, instructor_id },
    });

    if (!course) {
      return {
        EM: "Không tìm thấy khóa học hoặc không có quyền",
        EC: "2",
        DT: null,
      };
    }

    const modules = await Module.findAll({
      where: { course_id },
      order: [["sort_order", "ASC"]],
      attributes: ["module_id", "title", "total_lectures", "total_duration"],
    });

    return {
      EM: "Lấy danh sách module thành công",
      EC: "0",
      DT: modules,
    };
  } catch (error) {
    console.error("Lỗi trong getModulesByCourse service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy danh sách module",
      EC: "-2",
      DT: null,
    };
  }
};

// ======================= //
// 🎓 GIẢNG VIÊN - LESSON //
// ======================= //

// [POST] Thêm bài học vào module
exports.addLesson = async (user_id, module_id, data) => {
  try {
    // Tìm hoặc tạo instructor từ user_id
    let instructor = await Instructor.findOne({ where: { user_id } });
    if (!instructor) {
      const user = await User.findByPk(user_id);
      instructor = await Instructor.create({
        user_id,
        name: user?.full_name || user?.email || "Admin Instructor",
        avatar: user?.avatar || null,
        bio: "Admin created instructor",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    const instructor_id = instructor.instructor_id;

    const module = await Module.findByPk(module_id);
    if (!module) {
      return { EM: "Không tìm thấy module", EC: "2", DT: null };
    }

    const course = await Course.findByPk(module.course_id);
    if (!course) {
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
    }

    // ✅ FIX: Check permission
    if (course.instructor_id !== instructor_id) {
      return {
        EM: "Không có quyền thêm bài học vào module này",
        EC: "3",
        DT: null,
      };
    }

    const {
      title,
      video_url,
      video_duration,
      sort_order,
      lesson_type,
      lesson_data,
      metadata,
      is_free,
    } = data;

    // Parse lesson_data nếu là string
    let lessonDataJson = null;
    if (lesson_data) {
      if (typeof lesson_data === 'string') {
        try {
          lessonDataJson = JSON.parse(lesson_data);
        } catch (e) {
          lessonDataJson = lesson_data;
        }
      } else {
        lessonDataJson = lesson_data;
      }
    }

    // Validate lesson_data theo lesson_type
    const lessonType = lesson_type || "video";
    const validation = validateLessonData(lessonType, lessonDataJson);
    if (!validation.valid) {
      return {
        EM: validation.error,
        EC: "-1",
        DT: null,
      };
    }

    // Parse metadata nếu là string
    let metadataJson = null;
    if (metadata) {
      if (typeof metadata === 'string') {
        try {
          metadataJson = JSON.parse(metadata);
        } catch (e) {
          metadataJson = metadata;
        }
      } else {
        metadataJson = metadata;
      }
    }

    const newLesson = await Lesson.create({
      module_id,
      course_id: module.course_id,
      title,
      video_url: video_url || null,
      video_duration: video_duration || null,
      sort_order: sort_order || 1,
      lesson_type: lesson_type || "video",
      lesson_data: lessonDataJson,
      metadata: metadataJson,
      is_free: !!is_free,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      EM: "Thêm bài học thành công",
      EC: "0",
      DT: newLesson,
    };
  } catch (error) {
    console.error("Lỗi trong addLesson service:", error);
    return {
      EM:
        "Có lỗi xảy ra khi thêm bài học: " +
        (error.message || error.original?.message || "Unknown error"),
      EC: "-2",
      DT: null,
    };
  }
};

// [PATCH] Cập nhật bài học
exports.updateLesson = async (instructor_id, lesson_id, data) => {
  try {
    const lesson = await Lesson.findByPk(lesson_id);
    if (!lesson) return { EM: "Không tìm thấy bài học", EC: "2", DT: null };

    const course = await Course.findByPk(lesson.course_id);
    // TODO: Bỏ qua permission check tạm thời cho demo - sẽ bật lại sau
    // if (!course || course.instructor_id !== instructor_id)
    //   return { EM: "Không có quyền chỉnh sửa bài học này", EC: "3", DT: null };

    // Parse lesson_data nếu có
    let lessonDataJson = undefined;
    if (data.lesson_data !== undefined) {
      if (data.lesson_data === null) {
        lessonDataJson = null;
      } else if (typeof data.lesson_data === 'string') {
        try {
          lessonDataJson = JSON.parse(data.lesson_data);
        } catch (e) {
          lessonDataJson = data.lesson_data;
        }
      } else {
        lessonDataJson = data.lesson_data;
      }
    }

    // Validate lesson_data theo lesson_type (nếu có thay đổi)
    const newLessonType = data.lesson_type ?? lesson.lesson_type;
    if (lessonDataJson !== undefined || data.lesson_type) {
      const validation = validateLessonData(newLessonType, lessonDataJson !== undefined ? lessonDataJson : lesson.lesson_data);
      if (!validation.valid) {
        return {
          EM: validation.error,
          EC: "-1",
          DT: null,
        };
      }
    }

    // Parse metadata nếu có
    let metadataJson = undefined;
    if (data.metadata !== undefined) {
      if (data.metadata === null) {
        metadataJson = null;
      } else if (typeof data.metadata === 'string') {
        try {
          metadataJson = JSON.parse(data.metadata);
        } catch (e) {
          metadataJson = data.metadata;
        }
      } else {
        metadataJson = data.metadata;
      }
    }

    await lesson.update({
      title: data.title ?? lesson.title,
      description: data.description !== undefined ? data.description : lesson.description,
      content: data.content !== undefined ? data.content : lesson.content,
      video_url: data.video_url !== undefined ? data.video_url : lesson.video_url,
      video_duration: data.video_duration !== undefined ? data.video_duration : lesson.video_duration,
      lesson_type: data.lesson_type ?? lesson.lesson_type,
      lesson_data: lessonDataJson !== undefined ? lessonDataJson : lesson.lesson_data,
      metadata: metadataJson !== undefined ? metadataJson : lesson.metadata,
      is_free: data.is_free !== undefined ? !!data.is_free : lesson.is_free,
      sort_order: data.sort_order ?? lesson.sort_order,
      updated_at: new Date(),
    });

    return { EM: "Cập nhật bài học thành công", EC: "0", DT: lesson };
  } catch (error) {
    console.error("Lỗi trong updateLesson service:", error);
    return { EM: "Có lỗi xảy ra khi cập nhật bài học", EC: "-2", DT: null };
  }
};

// [DELETE] Xóa bài học
exports.deleteLesson = async (instructor_id, lesson_id) => {
  try {
    const lesson = await Lesson.findByPk(lesson_id);
    if (!lesson) return { EM: "Không tìm thấy bài học", EC: "2", DT: null };

    const course = await Course.findByPk(lesson.course_id);
    if (!course || course.instructor_id !== instructor_id)
      return { EM: "Không có quyền xóa bài học này", EC: "3", DT: null };

    await lesson.destroy();
    return { EM: "Xóa bài học thành công", EC: "0", DT: null };
  } catch (error) {
    console.error("Lỗi trong deleteLesson service:", error);
    return { EM: "Có lỗi xảy ra khi xóa bài học", EC: "-2", DT: null };
  }
};

// [PATCH] Instructor gửi khóa học để phê duyệt
exports.submitCourseForReview = async (instructor_id, course_id) => {
  try {
    const course = await Course.findByPk(course_id);

    // Kiểm tra khóa học có tồn tại không
    if (!course) {
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
    }

    // Kiểm tra quyền sở hữu
    if (course.instructor_id !== instructor_id) {
      return { EM: "Không có quyền gửi khóa học này", EC: "3", DT: null };
    }

    // Kiểm tra trạng thái hiện tại
    if (course.status !== "draft" && course.status !== "rejected") {
      return {
        EM: "Chỉ có thể gửi khóa học ở trạng thái 'draft' hoặc 'rejected'",
        EC: "4",
        DT: null,
      };
    }

    // Cập nhật trạng thái
    await course.update({
      status: "pending_review",
      updated_at: new Date(),
    });

    return {
      EM: "Khóa học đã được gửi lên để phê duyệt",
      EC: "0",
      DT: { course_id, status: "pending_review" },
    };
  } catch (error) {
    console.error("Lỗi trong submitCourseForReview service:", error);
    return {
      EM: "Có lỗi xảy ra khi gửi khóa học phê duyệt",
      EC: "-2",
      DT: null,
    };
  }
};
// [GET] Lấy danh sách đánh giá khóa học của giảng viên
exports.getCourseReviewsByInstructor = async (
  instructor_id,
  course_id,
  page = 1,
  limit = 10
) => {
  try {
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * perPage;

    // Kiểm tra quyền truy cập khóa học
    const course = await Course.findByPk(course_id);
    if (!course) {
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
    }

    if (course.instructor_id !== instructor_id) {
      return {
        EM: "Bạn không có quyền xem đánh giá khóa học này",
        EC: "3",
        DT: null,
      };
    }

    // Truy vấn danh sách đánh giá
    const { count, rows } = await CourseReview.findAndCountAll({
      where: {
        course_id,
        status: "approved",
      },
      include: [
        {
          model: User,
          attributes: ["user_id", "full_name", "avatar_url"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: perPage,
      offset,
      attributes: [
        "review_id",
        "rating",
        "title",
        "content",
        "is_verified",
        "created_at",
      ],
    });

    // Tính điểm trung bình
    const avg = rows.length
      ? rows.reduce((sum, r) => sum + r.rating, 0) / rows.length
      : 0;

    return {
      EM: "Lấy danh sách đánh giá thành công",
      EC: "0",
      DT: {
        course_id,
        average_rating: parseFloat(avg.toFixed(2)),
        total_reviews: count,
        reviews: rows,
        pagination: {
          current_page: currentPage,
          total_pages: Math.ceil(count / perPage),
          total_items: count,
          items_per_page: perPage,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getCourseReviewsByInstructor service:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy danh sách đánh giá",
      EC: "-2",
      DT: null,
    };
  }
};
