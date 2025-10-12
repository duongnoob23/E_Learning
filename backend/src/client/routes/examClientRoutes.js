const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const ExamClientController = require("../controllers/examClientController");

// GET	/api/tests  Lấy danh sách đề thi
// GET	/api/tests/{test_id}
// POST	/api/exam-sessions/start
// POST	/api/exam-sessions/{session_id}/submit
// GET	/api/exam-sessions/{session_id}/result
// GET	/api/exam-sessions/{session_id}/review
// POST	/api/exam-sessions/{session_id}/retry-wrong
// GET	/api/tests/{test_id}/parts
// GET	/api/parts/{part_id}/questions
// GET	/api/discussions/test/{test_id}
// POST	/api/discussions/{discussion_id}/comments
// POST	/api/discussions
// GET	/api/user/statistics 

// Test Routes
router.get("/tests", authMiddleware, ExamClientController.getTests);
router.get("/tests/:test_id", authMiddleware, ExamClientController.getTestDetail);
router.get("/tests/:test_id/parts", authMiddleware, ExamClientController.getTestParts);

// Part Routes
router.get("/parts/:part_id/questions", authMiddleware, ExamClientController.getPartQuestions);

// Exam Session Routes
router.post("/exam-sessions/start", authMiddleware, ExamClientController.startExamSession);
router.post("/exam-sessions/:session_id/submit", authMiddleware, ExamClientController.submitExamSession);
router.get("/exam-sessions/:session_id/result", authMiddleware, ExamClientController.getExamResult);
router.get("/exam-sessions/:session_id/review", authMiddleware, ExamClientController.reviewExamSession);
router.post("/exam-sessions/:session_id/retry-wrong", authMiddleware, ExamClientController.retryWrongAnswers);

// User Statistics Routes
router.get("/user/statistics", authMiddleware, ExamClientController.getUserStatistics);

// Discussion Routes
router.get("/discussions/test/:test_id", authMiddleware, ExamClientController.getTestDiscussions);
router.post("/discussions", authMiddleware, ExamClientController.createDiscussion);
router.post("/discussions/:discussion_id/comments", authMiddleware, ExamClientController.addComment);

module.exports = router;
