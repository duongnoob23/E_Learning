const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const ExamAdminController = require("../controllers/examAdminController");

// Admin	Tạo bài thi mới	POST	/api/admin/tests
// Admin	Cập nhật bài thi	PATCH	/api/admin/tests/{test_id}
// Admin	Xóa bài thi	DELETE	/api/admin/tests/{test_id}
// Admin	Thêm Part vào bài thi	POST	/api/admin/tests/{test_id}/parts
// Admin	Thêm câu hỏi	POST	/api/admin/parts/{part_id}/questions
// Admin	Cập nhật câu hỏi	PATCH	/api/admin/questions/{question_id}
// Admin	Xóa câu hỏi	DELETE	/api/admin/questions/{question_id}
// Admin	Lấy danh sách thí sinh đã thi	GET	/api/admin/tests/{test_id}/sessions
// Admin	Xem kết quả chi tiết của user	GET	/api/admin/exam-sessions/{session_id}
// Admin	Xem thống kê bài thi	GET	/api/admin/tests/{test_id}/statistics

router.get("/tests", authMiddleware, ExamAdminController.getTests); // Done
router.get("/tests/detail/:test_id", authMiddleware, ExamAdminController.getTestDetail); // Done
router.patch("/tests/:test_id", authMiddleware, ExamAdminController.updateTest); // Done
router.delete("/tests/:test_id", authMiddleware, ExamAdminController.deleteTest); // Done

// ------ Tạo 1 bài test mới ------ //
router.post("/tests", authMiddleware, ExamAdminController.createTest); // Done
router.post("/tests/:test_id/parts", authMiddleware, ExamAdminController.addPartToTest); // Done
router.post("/parts/:part_id/questions", authMiddleware, ExamAdminController.addQuestionToPart);
// ------- End ---------- //

router.patch("/questions/:question_id", authMiddleware, ExamAdminController.updateQuestion);
router.delete("/questions/:question_id", authMiddleware, ExamAdminController.deleteQuestion);
router.get("/tests/:test_id/sessions", authMiddleware, ExamAdminController.getTestSessions);
router.get("/exam-sessions/:session_id", authMiddleware, ExamAdminController.getExamSessionDetail);
router.get("/tests/:test_id/statistics", authMiddleware, ExamAdminController.getTestStatistics); // Xem thống kê bài thi


module.exports = router;
