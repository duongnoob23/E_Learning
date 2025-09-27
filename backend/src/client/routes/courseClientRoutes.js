const express = require("express");
const router = express.Router();
const controller = require("../controllers/courseClientController");

router.get("/categories", controller.getCategories);

router.get("/levels", controller.getLevels);

router.get("/instructors", controller.getInstructors);

router.get("/", controller.getCourse);

router.get("/:course_id", controller.getCourseById);

router.get("/:course_id/curriculum", controller.getCourseCurriculum);

router.get("/:course_id/reviews", controller.getCourseReviews);

router.get("/:course_id/discussions", controller.getCourseDiscussions);

router.get("/suggested", controller.getSuggestedCourses);

module.exports = router;
