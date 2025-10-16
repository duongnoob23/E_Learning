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
router.get("/tests", authMiddleware, ExamClientController.getTests); // Done
router.get("/tests/:test_id", authMiddleware, ExamClientController.getTestDetail); // Done
router.get("/tests/:test_id/parts", authMiddleware, ExamClientController.getTestParts); // Done
router.get("/tests/:test_id/result", authMiddleware, ExamClientController.getPracticeTestResult); // Done

// Part Routes
router.get("/parts/:part_id/questions", authMiddleware, ExamClientController.getPartQuestions); // Done
    
// Exam Session Routes
router.post("/exam-sessions/start", authMiddleware, ExamClientController.startExamSession); // Done
router.post("/exam-sessions/:session_id/submit", authMiddleware, ExamClientController.submitExamSession); // Done
router.get("/exam-sessions/:session_id/result", authMiddleware, ExamClientController.getExamResult); // Done
router.get("/exam-sessions/:session_id/review", authMiddleware, ExamClientController.reviewExamSession); // Done
router.post("/exam-sessions/:session_id/retry-wrong", authMiddleware, ExamClientController.retryWrongAnswers); // Done

// User Statistics Routes
router.get("/user/statistics", authMiddleware, ExamClientController.getUserStatistics); // Done

// Discussion Routes
router.get("/discussions/test/:test_id", authMiddleware, ExamClientController.getTestDiscussions);
router.post("/discussions", authMiddleware, ExamClientController.createDiscussion);
router.post("/discussions/:discussion_id/comments", authMiddleware, ExamClientController.addComment);

module.exports = router;
