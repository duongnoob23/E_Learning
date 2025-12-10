const { Op } = require("sequelize");
const {
  Course,
  Category,
  Instructor,
  Module,
  Lesson,
  User,
  CourseReview,
} = require("../../models");

// GET /api/admin/courses
exports.getCourses = async (filters = {}) => {
  try {
    const {
      status,           // 'draft' | 'pending_review' | 'published' | 'archived'
      category_id,
      instructor_id,
      keyword,          // tìm theo title/slug
      page = 1,
      limit = 20,
    } = filters;

    const where = {};
    if (status) where.status = status;
    if (category_id) where.category_id = category_id;
    if (instructor_id) where.instructor_id = instructor_id;
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { slug:  { [Op.like]: `%${keyword}%` } },
      ];
    }

    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 20;
    const offset = (currentPage - 1) * perPage;

    const { count, rows } = await Course.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: perPage,
      offset,
      attributes: [
        "course_id",
        "title",
        "slug",
        "status",
        "created_at",
        "price",
        "is_free",
        "total_students",
        "rating",
        "rating_count",
      ],
      include: [
        {
          model: Instructor,
          attributes: ["instructor_id", "name", "is_verified"],
        },
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
      ],
    });

    return {
      EM: "Lấy danh sách khóa học thành công",
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
    console.error("Lỗi getCourses (admin):", error);
    return { EM: "Có lỗi khi lấy danh sách khóa học", EC: "-2", DT: null };
  }
};

// GET /api/admin/courses/:id
exports.getCourseDetail = async (course_id) => {
  try {
    const course = await Course.findOne({
      where: { course_id },
      attributes: {
        exclude: [], // lấy tất cả fields của course
      },
      include: [
        {
          model: Instructor,
          attributes: ["instructor_id", "name", "avatar", "is_verified"],
          include: [
            { model: User, attributes: ["user_id", "email", "full_name"] },
          ],
        },
        { model: Category, attributes: ["category_id", "name"] },
        {
          model: Module,
          as: "modules",
          where: { is_active: true },
          required: false,
          attributes: [
            "module_id",
            "title",
            "description",
            "sort_order",
            "total_lectures",
            "total_duration",
          ],
          include: [
            {
              model: Lesson,
              as: "lessons",
              where: { is_active: true },
              required: false,
              attributes: [
                "lesson_id",
                "title",
                "description",
                "lesson_type",
                "lesson_data",
                "metadata",
                "video_url",
                "video_duration",
                "is_free",
                "sort_order",
              ],
            },
          ],
        },
      ],
    });

    if (!course) {
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
    }

    return { EM: "Lấy chi tiết khóa học thành công", EC: "0", DT: course };
  } catch (error) {
    console.error("Lỗi getCourseDetail (admin):", error);
    return { EM: "Có lỗi khi lấy chi tiết khóa học", EC: "-2", DT: null };
  }
};

// PATCH /api/admin/courses/:id/approve
exports.approveCourse = async (course_id, { comment, admin_user_id }) => {
  try {
    const course = await Course.findByPk(course_id);
    if (!course) return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };

    // Chỉ cho phép approve khi đang pending_review hoặc draft
    if (!["pending_review", "draft"].includes(course.status)) {
      return {
        EM: "Trạng thái hiện tại không thể duyệt",
        EC: "4",
        DT: { status: course.status },
      };
    }

    await course.update({
      status: "published",
      published_at: new Date(),
      updated_at: new Date(),
    });

    // Ghi nhận lịch sử duyệt (tùy chọn – audit)
    if (comment) {
      await CourseReview.create({
        user_id: admin_user_id || 0,    // nếu có admin id
        course_id: course_id,
        rating: 5,                      // mặc định 5 để đánh dấu approve log (hoặc để null nếu bạn muốn)
        title: "Admin approve",
        content: comment,
        is_verified: false,
        status: "approved",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return {
      EM: "Duyệt khóa học thành công",
      EC: "0",
      DT: { course_id, status: "published" },
    };
  } catch (error) {
    console.error("Lỗi approveCourse (admin):", error);
    return { EM: "Có lỗi khi duyệt khóa học", EC: "-2", DT: null };
  }
};

// PATCH /api/admin/courses/:id/reject
exports.rejectCourse = async (course_id, { comment, admin_user_id }) => {
  try {
    const course = await Course.findByPk(course_id);
    if (!course) return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };

    // Khi reject: đưa về draft
    await course.update({
      status: "draft",
      updated_at: new Date(),
    });

    // Ghi lý do từ chối vào course_reviews
    await CourseReview.create({
      user_id: admin_user_id || 0,
      course_id,
      rating: 0,
      title: "Admin reject",
      content: comment || "Khóa học bị từ chối",
      is_verified: false,
      status: "rejected",
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      EM: "Từ chối khóa học thành công",
      EC: "0",
      DT: { course_id, status: "draft" },
    };
  } catch (error) {
    console.error("Lỗi rejectCourse (admin):", error);
    return { EM: "Có lỗi khi từ chối khóa học", EC: "-2", DT: null };
  }
};

// DELETE /api/admin/courses/:id
exports.removeCourse = async (course_id) => {
  try {
    const course = await Course.findByPk(course_id);
    if (!course) return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };

    await course.update({
      status: "archived",
      updated_at: new Date(),
    });

    return {
      EM: "Gỡ (archive) khóa học thành công",
      EC: "0",
      DT: { course_id, status: "archived" },
    };
  } catch (error) {
    console.error("Lỗi removeCourse (admin):", error);
    return { EM: "Có lỗi khi gỡ khóa học", EC: "-2", DT: null };
  }
};

// GET /api/admin/instructors
exports.getInstructors = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      keyword, // tìm theo instructor name hoặc user email
      status,  // is_active: true/false
    } = filters;

    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 20;
    const offset = (currentPage - 1) * perPage;

    const where = {};
    if (typeof status !== "undefined") {
      // status có thể là 'active'|'inactive' hoặc true/false
      if (status === "active") where.is_active = true;
      else if (status === "inactive") where.is_active = false;
      else where.is_active = !!status;
    }

    // Tạo include join với User để lọc theo email nếu có keyword
    const include = [
      {
        model: User,
        attributes: ["user_id", "email", "full_name"],
        required: false,
        where: keyword
          ? { email: { [Op.like]: `%${keyword}%` } }
          : undefined,
      },
    ];

    // Nếu keyword áp dụng cho name của Instructor
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { count, rows } = await Instructor.findAndCountAll({
      where,
      include,
      order: [["created_at", "DESC"]],
      limit: perPage,
      offset,
      attributes: [
        "instructor_id",
        "name",
        "is_active",
        "is_verified",
        "experience_years",
        "created_at",
      ],
    });

    // Lấy tổng số khóa/giảng viên (1 lượt) — tối giản: đếm theo instructor_id
    // (Nếu performance cần tối ưu, có thể dùng subquery hoặc raw)
    const instructorIds = rows.map((r) => r.instructor_id);
    let coursesByInstructor = {};
    if (instructorIds.length) {
      const courses = await Course.findAll({
        where: { instructor_id: { [Op.in]: instructorIds } },
        attributes: ["instructor_id", "course_id"],
      });
      for (const c of courses) {
        const key = String(c.instructor_id);
        coursesByInstructor[key] = (coursesByInstructor[key] || 0) + 1;
      }
    }

    // Gắn total_courses
    const result = rows.map((r) => {
      const total = coursesByInstructor[String(r.instructor_id)] || 0;
      return {
        ...r.toJSON(),
        total_courses: total,
      };
    });

    return {
      EM: "Lấy danh sách giảng viên thành công",
      EC: "0",
      DT: {
        instructors: result,
        pagination: {
          current_page: currentPage,
          total_pages: Math.ceil(count / perPage),
          total_items: count,
          items_per_page: perPage,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi getInstructors (admin):", error);
    return { EM: "Có lỗi khi lấy danh sách giảng viên", EC: "-2", DT: null };
  }
};
