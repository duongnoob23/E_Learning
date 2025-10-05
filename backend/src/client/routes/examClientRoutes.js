const express = require('express');
const router = express.Router();
const examController = require('../controllers/examClientController');
const examDetailController = require('../controllers/examDetailController');
const authMiddleware = require('../../middleware/authMiddleware');

router.use(authMiddleware);

// Tests
router.get('/tests', examController.getAllTests);
router.get('/tests/:testId', examController.getTestById);
router.post('/tests', examController.createTest);
router.put('/tests/:testId', examController.updateTest);
router.delete('/tests/:testId', examController.deleteTest);

// Tags
router.get('/tags', examController.getAllTags);
router.get('/tags/:tagId', examController.getTagById);
router.post('/tags', examController.createTag);
router.put('/tags/:tagId', examController.updateTag);
router.delete('/tags/:tagId', examController.deleteTag);

// Relations
router.get('/tests/:testId/tags', examController.getTestTags);
router.post('/tests/:testId/tags/:tagId', examController.addTagToTest);
router.delete('/tests/:testId/tags/:tagId', examController.removeTagFromTest);

// Search / Filter
router.get('/tests/search', examController.searchTests);
router.get('/tests/filter', examController.filterTests);

// Exam Detail APIs
router.get('/tests/:testId/detail', examDetailController.getExamDetail);
router.post('/tests/:testId/start', examDetailController.startExam);
router.put('/exam/save-progress', examDetailController.saveExamProgress);
router.post('/exam/submit', examDetailController.submitExam);
router.post('/exam/abandon', examDetailController.abandonExam);
router.get('/history', examDetailController.getUserExamHistory);


module.exports = router;


