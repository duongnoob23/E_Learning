const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const { authorizeByRole } = require("../../middleware/authorizeMiddleware");
const VocabularyAdminController = require("../controllers/vocabularyAdminController");
const { uploadWordImage, uploadWordAudio } = require("../../middleware/vocabularyUploadMiddleware");

// ============================================
// ERROR HANDLER WRAPPER
// ============================================
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(`[VOCABULARY ADMIN ERROR] ${req.method} ${req.path}:`, error.message);
      next(error);
    }
  };
};

const wrapController = (controller) => asyncHandler(controller);

// ============================================
// STATISTICS ROUTES (không cần auth - tạm thời để test)
// ============================================

// GET - Lấy thống kê vocabulary
router.get("/statistics", wrapController(VocabularyAdminController.getStatistics));

// ============================================
// WORD ROUTES
// ============================================

// GET - Lấy danh sách từ vựng (có phân trang, filter, search)
router.get("/words", wrapController(VocabularyAdminController.getWords));

// GET - Lấy chi tiết từ vựng (preview)
router.get("/words/:word_id", wrapController(VocabularyAdminController.getWordDetail));

// POST - Tạo từ vựng mới
router.post(
  "/words",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.createWord)
);

// PATCH - Cập nhật từ vựng
router.patch(
  "/words/:word_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.updateWord)
);

// DELETE - Xóa từ vựng (soft delete mặc định, ?hard=true để xóa cứng)
router.delete(
  "/words/:word_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.deleteWord)
);

// PATCH - Toggle active/inactive từ vựng
router.patch(
  "/words/:word_id/toggle-active",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.toggleWordActive)
);

// PATCH - Khôi phục từ vựng đã xóa
router.patch(
  "/words/:word_id/restore",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.restoreWord)
);

// ============================================
// BATCH OPERATIONS
// ============================================

// POST - Import nhiều từ vựng
router.post(
  "/words/batch-import",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.batchImportWords)
);

// POST - Kiểm tra từ trùng lặp
router.post(
  "/words/check-duplicates",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.checkDuplicates)
);

// POST - Xóa hàng loạt
router.post(
  "/words/batch-delete",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.batchDeleteWords)
);

// POST - Toggle active hàng loạt
router.post(
  "/words/batch-toggle-active",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.batchToggleActive)
);

// ============================================
// TOPIC ROUTES
// ============================================

// GET - Lấy tất cả topics (không phân trang - cho dropdown)
router.get("/topics/all", wrapController(VocabularyAdminController.getAllTopics));

// GET - Lấy danh sách chủ đề (có phân trang)
router.get("/topics", wrapController(VocabularyAdminController.getTopics));

// POST - Tạo chủ đề mới
router.post(
  "/topics",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.createTopic)
);

// PATCH - Cập nhật chủ đề
router.patch(
  "/topics/:topic_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.updateTopic)
);

// DELETE - Xóa mềm chủ đề
router.delete(
  "/topics/:topic_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.deleteTopic)
);

// PATCH - Toggle active chủ đề
router.patch(
  "/topics/:topic_id/toggle-active",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(VocabularyAdminController.toggleTopicActive)
);

// ============================================
// UPLOAD ROUTES
// ============================================

// POST - Upload ảnh cho từ vựng
router.post(
  "/upload/image",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  uploadWordImage.single("image"),
  wrapController(VocabularyAdminController.uploadWordImage)
);

// POST - Upload audio cho từ vựng
router.post(
  "/upload/audio",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  uploadWordAudio.single("audio"),
  wrapController(VocabularyAdminController.uploadWordAudio)
);

module.exports = router;

