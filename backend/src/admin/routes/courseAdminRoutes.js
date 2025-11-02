const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const controller = require("../controllers/courseAdminController");

// Gắn middleware auth cho toàn bộ route admin
router.use(authMiddleware);

// Admin — Courses
// GET    /api/admin/courses
router.get("/courses", controller.getCourses);

// GET    /api/admin/courses/:id
router.get("/courses/:id", controller.getCourseDetail);

// PATCH  /api/admin/courses/:id/approve
router.patch("/courses/:id/approve", controller.approveCourse);

// PATCH  /api/admin/courses/:id/reject
router.patch("/courses/:id/reject", controller.rejectCourse);

// DELETE /api/admin/courses/:id
router.delete("/courses/:id", controller.removeCourse);

// Admin — Instructors
// GET    /api/admin/instructors
router.get("/instructors", controller.getInstructors);

module.exports = router;
