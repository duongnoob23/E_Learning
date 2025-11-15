const { Op } = require("sequelize");
const { Course, Module, Lesson, CourseReview, User, Instructor } = require("../../models");

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

    const newCourse = await Course.create({
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
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
      EM: "Có lỗi xảy ra khi tạo khóa học: " + (error.message || error.original?.message || "Unknown error"),
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
      return { EM: "Không tìm thấy khóa học hoặc không có quyền", EC: "2", DT: null };
    }

    await course.update({ status: "archived", updated_at: new Date() });

    return { EM: "Khóa học đã được lưu trữ", EC: "0", DT: course };
  } catch (error) {
    console.error("Lỗi trong deleteCourse service:", error);
    return { EM: "Có lỗi xảy ra khi lưu trữ khóa học", EC: "-2", DT: null };
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

    const course = await Course.findOne({
      where: { course_id, instructor_id },
    });

    if (!course) {
      return { EM: "Không tìm thấy khóa học hoặc không có quyền", EC: "2", DT: null };
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
    return { EM: "Có lỗi xảy ra khi thêm module", EC: "-2", DT: null };
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
      return { EM: "Không tìm thấy khóa học hoặc không có quyền", EC: "2", DT: null };
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
    if (!module) return { EM: "Không tìm thấy module", EC: "2", DT: null };

    const course = await Course.findByPk(module.course_id);
    if (!course || course.instructor_id !== instructor_id)
      return { EM: "Không có quyền thêm bài học vào module này", EC: "3", DT: null };

    const { title, video_url, video_duration, sort_order, lesson_type, is_free } = data;

    const newLesson = await Lesson.create({
      module_id,
      course_id: module.course_id,
      title,
      video_url,
      video_duration: video_duration || null,
      sort_order: sort_order || 1,
      lesson_type: lesson_type || "video",
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
      EM: "Có lỗi xảy ra khi thêm bài học",
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

    await lesson.update({
      title: data.title ?? lesson.title,
      video_url: data.video_url ?? lesson.video_url,
      video_duration: data.video_duration ?? lesson.video_duration,
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
      return { EM: "Chỉ có thể gửi khóa học ở trạng thái 'draft' hoặc 'rejected'", EC: "4", DT: null };
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
    return { EM: "Có lỗi xảy ra khi gửi khóa học phê duyệt", EC: "-2", DT: null };
  }
};
// [GET] Lấy danh sách đánh giá khóa học của giảng viên
exports.getCourseReviewsByInstructor = async (instructor_id, course_id, page = 1, limit = 10) => {
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
      return { EM: "Bạn không có quyền xem đánh giá khóa học này", EC: "3", DT: null };
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
      attributes: ["review_id", "rating", "title", "content", "is_verified", "created_at"],
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
    return { EM: "Có lỗi xảy ra khi lấy danh sách đánh giá", EC: "-2", DT: null };
  }
};