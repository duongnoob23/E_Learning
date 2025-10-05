const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const ExamClientController = require("../controllers/examClientController");

router.get("/", authMiddleware, ExamClientController.getExams);

router.get("/tests/:testId", authMiddleware, ExamClientController.getTestDetail);

// router.get("/results/:testId", ExamClientController.getResults);

router.get("/tests/:testId/start", authMiddleware, ExamClientController.startTest);

router.get("/tests/practice/:testId", authMiddleware, ExamClientController.getPracticeTests);

router.post("/tests/:testId/submit", authMiddleware, ExamClientController.submitTest);

router.post("/tests/:testId/practice/submit", authMiddleware, ExamClientController.submitPracticeTest);

module.exports = router;
