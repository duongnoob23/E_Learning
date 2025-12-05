const express = require("express");
const router = express.Router();

const controller = require("../controllers/wordClientController");
const middleware = require("../../middleware/authMiddleware");
const { authorizeByRole } = require("../../middleware/authorizeMiddleware");
const upload = require("../../middleware/uploadMiddleware");
/**
 * =============================
 *  WORDS – SYSTEM & USER WORDS
 * =============================
 */
router.get("/system", controller.getWordsByTopic);
router.get("/system/:word_id", controller.getWordDetail);
router.get("/user", middleware, controller.getWordsByUser);
/**
 * =============================
 *  LEARN STATUS (learned / unlearned / starred)
 * =============================
 */
router.post("/status/mark",middleware, controller.markLearned);
router.post("/status/unmark",middleware, controller.unmarkLearned);
// router.post("/status/star", controller.markStarred);
// router.post("/status/unstar", controller.unmarkStarred);

/**
 * =============================
 *  FLASHCARD SYSTEM
 * =============================
 */
router.get("/topics", controller.getTopicPublic);
router.get("/topics/user", middleware, authorizeByRole("student"), controller.getTopicByUser);
router.post("/topics/sets", middleware, authorizeByRole("student"), controller.createSet);
router.get("/flashcard/set/:set_id", middleware, authorizeByRole("student"), controller.getSetDetail);
router.patch("/flashcard/user/:user_word_id", middleware, authorizeByRole("student"), controller.patchWordToUser);
router.delete("/flashcard/user/:user_word_id", middleware, authorizeByRole("student"), controller.deleteWordToUser);
router.post("/flashcard/set/item", middleware, authorizeByRole("student"), controller.postWordToUser);
router.get("/flashcard/set/:set_id/words", middleware, authorizeByRole("student"), controller.getWordsBySet);

/**
 * =============================
 *  SRS (SPACED REPETITION)
 * Mục đích: Học từ theo thuật toán lặp lại ngắt quãng.
 * =============================
 */
router.get("/learning/today", middleware, authorizeByRole("student"), controller.getTodayWords);
router.get("/learning/next", middleware, authorizeByRole("student"), controller.getNextWord);
router.post("/learning/:word_id/feedback", middleware, authorizeByRole("student"), controller.submitFeedback);

/**
 * =============================
 *  PRACTICE (QUIZ)
 * =============================
 */
router.get("/practice/vocab", middleware, authorizeByRole("student"), controller.getVocabQuiz);
router.post("/practice/vocab/submit", middleware, authorizeByRole("student"), controller.submitVocabQuiz);

/**
 * =============================
 *  PROGRESS (TIẾN ĐỘ HỌC)
 * =============================
 */
router.get("/progress/overview", middleware, authorizeByRole("student"), controller.getOverview);
// router.get("/progress/topic/:topic_id", middleware, authorizeByRole("student"), controller.getProgressByTopic);
router.get("/progress/daily", middleware, authorizeByRole("student"), controller.getDailyProgress);

/**
 * =============================
 *  PRONUNCIATION ASSESSMENT
 * =============================
 */
router.post("/pronunciation/assess", middleware, authorizeByRole("student"), upload.single("audio"), controller.assessPronunciation);
router.get("/pronunciation/history/:word_id", middleware, authorizeByRole("student"), controller.getPronunciationHistory);
router.get("/pronunciation/stats", middleware, authorizeByRole("student"), controller.getPronunciationStats);

module.exports = router;
