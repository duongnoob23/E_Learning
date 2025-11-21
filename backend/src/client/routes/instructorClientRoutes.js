const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const instructorController = require("../controllers/instructorClientController");

// Lấy danh sách khóa học của giảng viên
router.get(
  "/my-courses",
  authMiddleware,
  instructorController.getInstructorCourses
);

// Tạo khóa học mới
router.post("/courses", authMiddleware, instructorController.createCourse);

// Cập nhật thông tin khóa học
router.patch(
  "/courses/:course_id",
  authMiddleware,
  instructorController.updateCourse
);

// Xóa khóa học
router.delete(
  "/courses/:course_id",
  authMiddleware,
  instructorController.deleteCourse
);

// Thêm module vào khóa học
router.post(
  "/courses/:course_id/modules",
  authMiddleware,
  instructorController.addModule
);

// Cập nhật module
router.patch(
  "/modules/:module_id",
  authMiddleware,
  instructorController.updateModule
);
// Xóa module
router.delete(
  "/modules/:module_id",
  authMiddleware,
  instructorController.deleteModule
);

// Module routes
router.get(
  "/courses/:id/modules",
  authMiddleware,
  instructorController.getModulesByCourse
);

// Lesson routes
router.post(
  "/modules/:id/lessons",
  authMiddleware,
  instructorController.addLesson
);
router.patch("/lessons/:id", authMiddleware, instructorController.updateLesson);
router.delete(
  "/lessons/:id",
  authMiddleware,
  instructorController.deleteLesson
);
// Sumbit Coure
router.patch(
  "/courses/:id/submit",
  authMiddleware,
  instructorController.submitCourseForReview
);
router.get(
  "/courses/:id/reviews",
  authMiddleware,
  instructorController.getCourseReviewsByInstructor
);

module.exports = router;
