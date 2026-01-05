const vocabularyAdminService = require("../services/vocabularyAdminService");

/**
 * Vocabulary Admin Controller
 * Xử lý các request quản lý từ vựng từ admin
 */

// ==================== WORD OPERATIONS ====================

/**
 * Lấy danh sách từ vựng
 * GET /admin/vocabulary/words
 */
exports.getWords = async (req, res, next) => {
  try {
    const { page, limit, search, topic_id, is_active, sort_by, sort_order } = req.query;
    const response = await vocabularyAdminService.getWords({
      page, limit, search, topic_id, is_active, sort_by, sort_order,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết từ vựng
 * GET /admin/vocabulary/words/:word_id
 */
exports.getWordDetail = async (req, res, next) => {
  try {
    const { word_id } = req.params;
    const response = await vocabularyAdminService.getWordDetail(word_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo từ vựng mới
 * POST /admin/vocabulary/words
 */
exports.createWord = async (req, res, next) => {
  try {
    const created_by = req.user?.user_id || 1;
    const response = await vocabularyAdminService.createWord(req.body, created_by);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật từ vựng
 * PATCH /admin/vocabulary/words/:word_id
 */
exports.updateWord = async (req, res, next) => {
  try {
    const { word_id } = req.params;
    const response = await vocabularyAdminService.updateWord(word_id, req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa từ vựng
 * DELETE /admin/vocabulary/words/:word_id
 * Query: ?hard=true để xóa cứng (vĩnh viễn)
 */
exports.deleteWord = async (req, res, next) => {
  try {
    const { word_id } = req.params;
    const { hard } = req.query; // ?hard=true để xóa cứng
    const delete_reason = req.body?.delete_reason || null; // Lý do xóa (tùy chọn)
    const deleted_by = req.user?.user_id || 1;
    
    const response = hard === "true"
      ? await vocabularyAdminService.hardDeleteWord(word_id, delete_reason, deleted_by)
      : await vocabularyAdminService.softDeleteWord(word_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle trạng thái active/inactive
 * PATCH /admin/vocabulary/words/:word_id/toggle-active
 */
exports.toggleWordActive = async (req, res, next) => {
  try {
    const { word_id } = req.params;
    const response = await vocabularyAdminService.toggleWordActive(word_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Khôi phục từ vựng đã xóa
 * PATCH /admin/vocabulary/words/:word_id/restore
 */
exports.restoreWord = async (req, res, next) => {
  try {
    const { word_id } = req.params;
    const response = await vocabularyAdminService.restoreWord(word_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== TOPIC OPERATIONS ====================

/**
 * Lấy danh sách chủ đề (có phân trang)
 * GET /admin/vocabulary/topics
 */
exports.getTopics = async (req, res, next) => {
  try {
    const { page, limit, search, is_active, topic_type } = req.query;
    const response = await vocabularyAdminService.getTopics({
      page, limit, search, is_active, topic_type,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy tất cả topics (không phân trang - cho dropdown)
 * GET /admin/vocabulary/topics/all
 */
exports.getAllTopics = async (req, res, next) => {
  try {
    const response = await vocabularyAdminService.getAllTopics();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo chủ đề mới
 * POST /admin/vocabulary/topics
 */
exports.createTopic = async (req, res, next) => {
  try {
    const created_by = req.user?.user_id || 1;
    const response = await vocabularyAdminService.createTopic(req.body, created_by);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật chủ đề
 * PATCH /admin/vocabulary/topics/:topic_id
 */
exports.updateTopic = async (req, res, next) => {
  try {
    const { topic_id } = req.params;
    const response = await vocabularyAdminService.updateTopic(topic_id, req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa chủ đề
 * DELETE /admin/vocabulary/topics/:topic_id
 * Body: { hard: true } để xóa cứng (vĩnh viễn)
 */
exports.deleteTopic = async (req, res, next) => {
  try {
    const { topic_id } = req.params;
    const { hard, delete_reason } = req.body || {};
    const deleted_by = req.user?.user_id || 1;
    
    const response = hard
      ? await vocabularyAdminService.hardDeleteTopic(topic_id, delete_reason, deleted_by)
      : await vocabularyAdminService.softDeleteTopic(topic_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle trạng thái chủ đề
 * PATCH /admin/vocabulary/topics/:topic_id/toggle-active
 */
exports.toggleTopicActive = async (req, res, next) => {
  try {
    const { topic_id } = req.params;
    const response = await vocabularyAdminService.toggleTopicActive(topic_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== STATISTICS ====================

/**
 * Lấy thống kê vocabulary
 * GET /admin/vocabulary/statistics
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const response = await vocabularyAdminService.getStatistics();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== BATCH OPERATIONS ====================

/**
 * Import nhiều từ vựng
 * POST /admin/vocabulary/words/batch-import
 */
exports.batchImportWords = async (req, res, next) => {
  try {
    const { words, topic_id } = req.body;
    const created_by = req.user?.user_id || 1;

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ EC: "1", EM: "Danh sách từ không hợp lệ", DT: null });
    }

    if (!topic_id) {
      return res.status(400).json({ EC: "1", EM: "Chủ đề không được để trống", DT: null });
    }

    const response = await vocabularyAdminService.batchImportWords(words, topic_id, created_by);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Kiểm tra từ trùng lặp
 * POST /admin/vocabulary/words/check-duplicates
 */
exports.checkDuplicates = async (req, res, next) => {
  try {
    const { words, topic_id } = req.body;

    if (!words || !Array.isArray(words)) {
      return res.status(400).json({ EC: "1", EM: "Danh sách từ không hợp lệ", DT: null });
    }

    const response = await vocabularyAdminService.checkDuplicates(words, topic_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa hàng loạt từ vựng
 * POST /admin/vocabulary/words/batch-delete
 */
exports.batchDeleteWords = async (req, res, next) => {
  try {
    const { word_ids, hard } = req.body;

    if (!word_ids || !Array.isArray(word_ids) || word_ids.length === 0) {
      return res.status(400).json({ EC: "1", EM: "Danh sách từ không hợp lệ", DT: null });
    }

    const response = await vocabularyAdminService.batchDeleteWords(word_ids, !hard);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle active hàng loạt
 * POST /admin/vocabulary/words/batch-toggle-active
 */
exports.batchToggleActive = async (req, res, next) => {
  try {
    const { word_ids, is_active } = req.body;

    if (!word_ids || !Array.isArray(word_ids) || word_ids.length === 0) {
      return res.status(400).json({ EC: "1", EM: "Danh sách từ không hợp lệ", DT: null });
    }

    const response = await vocabularyAdminService.batchToggleActive(word_ids, is_active);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== UPLOAD ====================

/**
 * Upload ảnh cho từ vựng
 * POST /admin/vocabulary/upload/image
 */
exports.uploadWordImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        EC: "1",
        EM: "Không có file ảnh được upload",
        DT: null,
      });
    }

    const imageUrl = `/uploads/vocabulary/images/${req.file.filename}`;

    res.json({
      EC: "0",
      EM: "Upload ảnh thành công",
      DT: {
        image_url: imageUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload audio cho từ vựng
 * POST /admin/vocabulary/upload/audio
 */
exports.uploadWordAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        EC: "1",
        EM: "Không có file audio được upload",
        DT: null,
      });
    }

    const audioUrl = `/uploads/vocabulary/audio/${req.file.filename}`;

    res.json({
      EC: "0",
      EM: "Upload audio thành công",
      DT: {
        audio_url: audioUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};
