const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const { authorizeByRole } = require("../../middleware/authorizeMiddleware");
const UserAdminController = require("../controllers/userAdminController");

// ------- Quản lý tài khoản --------- //
//GET /api/admin/:user_id
// POST /api/admin
// PATCH /api/admin/:user_id
// DELETE /api/admin/:user_id
// ------- Quản lý trạng thái tài khoản --------- //
// PATCH /api/admin/:user_id/ban

// PATCH /api/admin/:user_id/unban
// PATCH /api/admin/:user_id/status
// ------- Quản lý xác thực email & phone --------- //
// PATCH /api/admin/:user_id/verify-phone
// Quản lý bảo mật & đăng nhập
// -------- Tìm kiếm & lọc nâng cao ---------- //
// GET /api/admin/search?keyword=phong
// GET /api/admin?from=2025-01-01&to=2025-12-31
// 6. Thống kê phân tích
// GET /api/admin/stats thống kê
// GET /api/admin/stats/status

// TODO: TẠM THỜI TẮT MIDDLEWARE - BẬT LẠI SAU KHI CÓ ADMIN LOGIN
// gán role cho 1 user
/**
 * @route POST /api/admin/users/:user_id/roles
 * @desc Gán role cho user
 * @body { role_id }
 */
router.post(
  "/users/:user_id/roles",
  // authMiddleware,
  // authorizeByRole("admin"),
  UserAdminController.assignRoleToUser
);
//--- Quản lý tài khoản ---//
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

//--- Quản lý xác thực email & phone ---//
router.patch("/:user_id/verify-phone", UserAdminController.verifyPhone);

//--- Quản lý bảo mật & đăng nhập ---//
router.patch("/:user_id/verify-email", UserAdminController.verifyEmail);

//--- Lấy khóa học đã đăng ký và giao dịch của user ---//
/**
 * @route GET /api/admin/users/:user_id/enrollments
 * @desc Lấy danh sách khóa học đã đăng ký của user
 * @query page, limit, status (active|completed|cancelled|expired)
 */
router.get("/:user_id/enrollments", UserAdminController.getUserEnrollments);

/**
 * @route GET /api/admin/users/:user_id/payments
 * @desc Lấy danh sách giao dịch của user
 * @query page, limit, payment_status (pending|completed|failed|cancelled|refunded)
 */
router.get("/:user_id/payments", UserAdminController.getUserPayments);

/**
 * @route GET /api/admin/users/:user_id/flashcard-progress
 * @desc Lấy tiến độ học flashcard của user
 */
router.get("/:user_id/flashcard-progress", UserAdminController.getUserFlashcardProgress);

/**
 * @route GET /api/admin/users/:user_id/created-topics
 * @desc Lấy danh sách topics user đã tạo
 */
router.get("/:user_id/created-topics", UserAdminController.getUserCreatedTopics);

/**
 * @route GET /api/admin/users/:user_id/exams
 * @desc Lấy lịch sử làm bài thi của user
 * @query page, limit
 */
router.get("/:user_id/exams", UserAdminController.getUserExams);

/**
 * @route GET /api/admin/users/:user_id/exam-statistics
 * @desc Lấy thống kê exam của user
 */
router.get("/:user_id/exam-statistics", UserAdminController.getUserExamStatistics);

/**
 * @route GET /api/admin/users/:user_id/course-progress
 * @desc Lấy tiến độ học course của user (chi tiết hơn enrollments)
 * @query page, limit
 */
router.get("/:user_id/course-progress", UserAdminController.getUserCourseProgress);

/**
 * @route GET /api/admin/users/:user_id/exam-results/:exam_session_id
 * @desc Lấy kết quả chi tiết bài thi của user theo exam_session_id
 */
router.get("/:user_id/exam-results/:exam_session_id", UserAdminController.getUserExamResult);

module.exports = router;
