const express = require('express');
const router = express.Router();
const examSessionController = require('../controllers/examSessionController');
const authMiddleware = require('../../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Session Management
router.post('/tests/:testId/start-practice', examSessionController.startPracticeSession);
router.post('/tests/:testId/start-fulltest', examSessionController.startFullTestSession);

// Question Management
router.get('/sessions/:userTestId/questions', examSessionController.getSessionQuestions);

// Answer Management
router.post('/sessions/:userTestId/questions/:questionId/answer', examSessionController.saveAnswer);

// Session Control
router.post('/sessions/:userTestId/submit', examSessionController.submitSession);
router.put('/sessions/:userTestId/progress', examSessionController.saveProgress);
router.post('/sessions/:userTestId/abandon', examSessionController.abandonSession);

// Results
router.get('/sessions/:userTestId/result', examSessionController.getSessionResult);

module.exports = router;

