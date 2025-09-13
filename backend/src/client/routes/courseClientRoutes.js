const express = require("express");
const router = express.Router();
const controller = require("../controllers/courseClientController");
/**
 * Courses – client
 * - GET  /categories                (danh mục)
 * - GET  /levels                    (trình độ)
 * - GET  /instructors               (giảng viên)
 * - GET  /                          (list courses + filter: category_id, level_id, q)
 * - GET  /:course_id                (chi tiết course + details)
 * - GET  /:course_id/curriculum     (modules + lessons)
 */

router.get("/categories", controller.getCourseByCategory);

router.get("/levels", controller.getCoursebyLevel);

router.get("/instructors", controller.getCourseByInstructor);

router.get("/instructors2", controller.getCourseByInstructor);
router.get("/instructors3", controller.getCourseByInstructor);
router.get("/instructors4", controller.getCourseByInstructor);

module.exports = router;
