const express = require("express");
const router = express.Router();

const controller = require("../controllers/wordClientController");
const middleware = require("../../middleware/authMiddleware");
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
router.get("/topics/user", middleware, controller.getTopicByUser);
router.post("/topics/sets",middleware, controller.createSet);
router.get("/flashcard/set/:set_id",middleware, controller.getSetDetail);
router.patch("/flashcard/user/:user_word_id",middleware, controller.patchWordToUser);
router.delete("/flashcard/user/:user_word_id",middleware, controller.deleteWordToUser);
router.post("/flashcard/set/item",middleware, controller.postWordToUser);
router.get("/flashcard/set/:set_id/words", middleware, controller.getWordsBySet);

/**
 * =============================
 *  SRS (SPACED REPETITION)
 * Mục đích: Học từ theo thuật toán lặp lại ngắt quãng.
 * =============================
 */
router.get("/learning/today",middleware, controller.getTodayWords);
router.get("/learning/next",middleware, controller.getNextWord);
router.post("/learning/:word_id/feedback",middleware, controller.submitFeedback);

/**
 * =============================
 *  PRACTICE (QUIZ)
 * =============================
 */
router.get("/practice/vocab",middleware, controller.getVocabQuiz);
router.post("/practice/vocab/submit",middleware, controller.submitVocabQuiz);

/**
 * =============================
 *  PROGRESS (TIẾN ĐỘ HỌC)
 * =============================
 */
router.get("/progress/overview",middleware, controller.getOverview);
// router.get("/progress/topic/:topic_id",middleware, controller.getProgressByTopic);
router.get("/progress/daily",middleware, controller.getDailyProgress);

module.exports = router;
