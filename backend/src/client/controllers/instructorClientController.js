const InstructorService = require("../services/instructorClientService");

// ✅ Lấy danh sách khóa học
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const result = await InstructorService.getInstructorCourses(
      user_id,
      page,
      limit
    );
    res.json(result);
  } catch (error) {
    console.error("Lỗi trong getInstructorCourses controller:", error);
    next(error);
  }
};

// ✅ Tạo khóa học mới
exports.createCourse = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const result = await InstructorService.createCourse(
      instructor_id,
      req.body
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ✅ Tạo khóa học với đầy đủ thông tin (Course + CourseDetail + Tags + Modules + Lessons)
exports.createCourseWithDetails = async (req, res, next) => {
  try {
    const user_id = req.user.userId;

    // Log để debug payload size
    const payloadSize = JSON.stringify(req.body).length;
    console.log("=".repeat(50));
    console.log("📦 CREATE COURSE WITH DETAILS - PAYLOAD INFO");
    console.log("=".repeat(50));
    console.log(
      `📊 Total payload size: ${(payloadSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`📊 Total payload size: ${payloadSize} bytes`);

    // Log modules và lessons count
    if (req.body.modules) {
      const totalLessons = req.body.modules.reduce(
        (sum, m) => sum + (m.lessons?.length || 0),
        0
      );
      console.log(`Modules count: ${req.body.modules.length}`);
      console.log(`📖 Total lessons: ${totalLessons}`);
    }

    console.log("=".repeat(50));

    const result = await InstructorService.createCourseWithDetails(
      user_id,
      req.body
    );
    res.json(result);
  } catch (error) {
    console.error("Lỗi trong createCourseWithDetails controller:", error);
    next(error);
  }
};

// ✅ Cập nhật khóa học
exports.updateCourse = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const course_id = req.params.course_id;
    const result = await InstructorService.updateCourse(
      instructor_id,
      course_id,
      req.body
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ✅ Xóa (hoặc lưu trữ) khóa học
exports.deleteCourse = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const course_id = req.params.course_id;
    const result = await InstructorService.deleteCourse(
      instructor_id,
      course_id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ✅ Thêm module
exports.addModule = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const course_id = req.params.course_id;
    const result = await InstructorService.addModule(
      instructor_id,
      course_id,
      req.body
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ✅ Cập nhật module
exports.updateModule = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const module_id = req.params.module_id;
    const result = await InstructorService.updateModule(
      instructor_id,
      module_id,
      req.body
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ✅ Xóa module
exports.deleteModule = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const module_id = req.params.module_id;
    const result = await InstructorService.deleteModule(
      instructor_id,
      module_id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách module của khóa học
exports.getModulesByCourse = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const { id } = req.params;
    const result = await InstructorService.getModulesByCourse(
      instructor_id,
      id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Thêm bài học
exports.addLesson = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const { id } = req.params; // module_id
    const result = await InstructorService.addLesson(
      instructor_id,
      id,
      req.body
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [PATCH] Cập nhật bài học
exports.updateLesson = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const { id } = req.params;
    const result = await InstructorService.updateLesson(
      instructor_id,
      id,
      req.body
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [DELETE] Xóa bài học
exports.deleteLesson = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const { id } = req.params;
    const result = await InstructorService.deleteLesson(instructor_id, id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
// [PATCH] Instructor gửi khóa học lên để phê duyệt
exports.submitCourseForReview = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const { id } = req.params;

    const result = await InstructorService.submitCourseForReview(
      instructor_id,
      id
    );
    res.json(result);
  } catch (error) {
    console.error("Lỗi trong submitCourseForReview controller:", error);
    next(error);
  }
};
// [GET] Lấy danh sách đánh giá khóa học của giảng viên
exports.getCourseReviewsByInstructor = async (req, res, next) => {
  try {
    const instructor_id = req.user.userId;
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await InstructorService.getCourseReviewsByInstructor(
      instructor_id,
      id,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    console.error("Lỗi trong getCourseReviewsByInstructor controller:", error);
    next(error);
  }
};

// ✅ Upload image cho lesson
exports.uploadLessonImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        EM: "Không có file ảnh được upload",
        EC: "1",
        DT: null,
      });
    }

    // Tạo URL đơn giản (tương tự như avatar)
    const imageUrl = `/uploads/images/${req.file.filename}`;
    
    res.json({
      EM: "Upload ảnh thành công",
      EC: "0",
      DT: {
        image_url: imageUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Lỗi trong uploadLessonImage controller:", error);
    next(error);
  }
};