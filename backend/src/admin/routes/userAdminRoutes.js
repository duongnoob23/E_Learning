const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const { authorizeByRole } = require("../../middleware/authorizeMiddleware");
const UserAdminController = require("../controllers/userAdminController");

router.post(
  "/users/:user_id/roles",
  UserAdminController.assignRoleToUser
);
router.get("/", UserAdminController.getUsers);
router.get("/stats", UserAdminController.getUsersStats);
router.get("/stats/status", UserAdminController.getUsersStatsByStatus);
router.get("/search", UserAdminController.searchUsers);
router.get("/filter", UserAdminController.filterUsers);
router.get("/:user_id", UserAdminController.getUserDetail);
router.post("/", UserAdminController.createUser);
router.patch("/:user_id", UserAdminController.updateUser);
router.delete("/:user_id", UserAdminController.deleteUser);

//--- Quản lý trạng thái tài khoản ---//
router.patch("/:user_id/ban", UserAdminController.banUser);
router.patch("/:user_id/unban", UserAdminController.unbanUser);
router.patch("/:user_id/status", UserAdminController.updateUserStatus);

router.patch("/:user_id/verify-phone", UserAdminController.verifyPhone);

router.patch("/:user_id/verify-email", UserAdminController.verifyEmail);

router.get("/:user_id/enrollments", UserAdminController.getUserEnrollments);

router.get("/:user_id/payments", UserAdminController.getUserPayments);

router.get("/:user_id/flashcard-progress", UserAdminController.getUserFlashcardProgress);

router.get("/:user_id/created-topics", UserAdminController.getUserCreatedTopics);

router.get("/:user_id/exams", UserAdminController.getUserExams);

router.get("/:user_id/exam-statistics", UserAdminController.getUserExamStatistics);

router.get("/:user_id/course-progress", UserAdminController.getUserCourseProgress);

router.get("/:user_id/exam-results/:exam_session_id", UserAdminController.getUserExamResult);

module.exports = router;
