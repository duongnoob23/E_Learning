const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const controller = require("../controllers/courseClientController");

// ==================== CATEGORIES, LEVELS, INSTRUCTORS ==================== //
router.get("/categories", controller.getCategories);
router.get("/levels", controller.getLevels);
router.get("/instructors", controller.getInstructors);

// ==================== COURSE LIST & DETAIL ==================== //
// Lấy danh sách khóa học (có filter/sort)
router.get("/", controller.getCourse);
// Lấy chi tiết khóa học (preview)
router.get("/courses/:id/preview", controller.getCoursePreview);
// Gợi ý khóa học
router.get("/suggested", controller.getSuggestedCourses);

// Lấy chi tiết 1 khóa học
router.get("/:course_id", controller.getCourseById);

// Lấy chương trình học (modules + lessons)
router.get("/:course_id/curriculum", controller.getCourseCurriculum);

// Lấy đánh giá của khóa học
router.get("/:course_id/reviews", controller.getCourseReviews);

// Lấy thảo luận khóa học
router.get("/:course_id/discussions", controller.getCourseDiscussions);

// ==================== ENROLLMENT & LEARNING ==================== //
// Đăng ký khóa học (free hoặc trả phí)
router.post("/:course_id/enroll", authMiddleware, controller.enrollCourse);

// Lấy tiến độ học trong 1 khóa học
router.get("/:course_id/progress", authMiddleware, controller.getLearningProgress);

// ==================== LESSON ==================== //
// Lấy chi tiết bài học
router.get("/lessons/:lesson_id", authMiddleware, controller.getLessonDetail);

router.get("/:course_id/structure", authMiddleware, controller.getCourseStructure);
// Cập nhật tiến độ học 1 bài
router.post("/lessons/:lesson_id/progress", authMiddleware, controller.updateLessonProgress);

// ==================== USER COURSES ==================== //
// Lấy danh sách khóa học mà user đã đăng ký
router.get("/user/my-courses", authMiddleware, controller.getUserCourses);

router.post("/start", authMiddleware, controller.startLesson);
router.post("/update", authMiddleware, controller.updateProgress);
router.post("/complete", authMiddleware, controller.completeLesson);

router.get("/courseprogress/:course_id", authMiddleware, controller.getCourseProgress);
router.get("/lesson/:lesson_id", authMiddleware, controller.getLessonProgress);

module.exports = router;
