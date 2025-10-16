const express = require("express");
const router = express.Router();
const controller = require("../controllers/lessonClientController");

/**
 * Lessons – client
 * - GET  /:lesson_id                    (chi tiết bài học + video)
 * - GET  /module/:module_id             (danh sách bài học theo module)
 * - GET  /course/:course_id             (danh sách bài học theo khóa học)
 */

router.get("/:lesson_id", controller.getLessonById);
router.get("/module/:module_id", controller.getLessonsByModule);
router.get("/course/:course_id", controller.getLessonsByCourse);

module.exports = router;