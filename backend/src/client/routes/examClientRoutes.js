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

router.get("/tests", authMiddleware, ExamClientController.getTests);

// router.get("/tests/:testId", authMiddleware, ExamClientController.getTestDetail);

// router.get("/tests/:testId/start", authMiddleware, ExamClientController.startTest);

// router.get("/tests/practice/:testId", authMiddleware, ExamClientController.getPracticeTests);

// router.post("/tests/:testId/submit", authMiddleware, ExamClientController.submitTest);

// router.post("/tests/:testId/practice/submit", authMiddleware, ExamClientController.submitPracticeTest);

module.exports = router;
