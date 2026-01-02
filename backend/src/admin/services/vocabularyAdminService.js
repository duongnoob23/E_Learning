const { Op } = require("sequelize");
const { Word, Topic, User, sequelize } = require("../../models");

/**
 * Vocabulary Admin Service
 * Quản lý từ vựng và chủ đề từ phía admin
 */
class VocabularyAdminService {
  // ==================== WORD OPERATIONS ====================

  /**
   * Lấy danh sách từ vựng với phân trang, filter, search
   */
  async getWords({ page = 1, limit = 10, search, topic_id, is_active, sort_by = "created_at", sort_order = "DESC" }) {
    const offset = (page - 1) * limit;
    const where = {};

    // Search theo word hoặc meaning_vi
    if (search) {
      where[Op.or] = [
        { word: { [Op.like]: `%${search}%` } },
        { meaning_vi: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter theo topic
    if (topic_id) {
      where.topic_id = topic_id;
    }

    // Filter theo trạng thái active
    if (is_active !== undefined && is_active !== null && is_active !== "") {
      where.is_active = is_active === "true" || is_active === true;
    }

    // Tất cả các cột trong DB
    const attributes = [
      "word_id", "topic_id", "word", "part_of_speech",
      "pronunciation", "meaning_vi", "example_en", "example_vi",
      "image_url", "notes", "word_type", "created_by",
      "is_active", "created_at", "updated_at", "audio_url"
    ];

    // Validate sort_by
    const validSortColumns = ["word_id", "word", "topic_id", "created_at", "is_active"];
    const safeSortBy = validSortColumns.includes(sort_by) ? sort_by : "created_at";

    const { rows: words, count: total } = await Word.findAndCountAll({
      where,
      attributes,
      include: [
        { model: Topic, attributes: ["topic_id", "topic_name", "image_url"] },
        { model: User, as: "wordCreator", attributes: ["user_id", "username", "email"] },
      ],
      order: [[safeSortBy, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset,
    });

    return {
      EC: "0",
      EM: "Lấy danh sách từ vựng thành công",
      DT: {
        words,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: parseInt(limit),
        },
      },
    };
  }

  /**
   * Lấy chi tiết từ vựng
   */
  async getWordDetail(word_id) {
    const word = await Word.findByPk(word_id, {
      include: [
        { model: Topic, attributes: ["topic_id", "topic_name", "image_url", "description"] },
        { model: User, as: "wordCreator", attributes: ["user_id", "username", "email"] },
      ],
    });

    if (!word) {
      return { EC: "1", EM: "Không tìm thấy từ vựng", DT: null };
    }

    return { EC: "0", EM: "Lấy chi tiết từ vựng thành công", DT: word };
  }

  /**
   * Tạo từ vựng mới
   */
  async createWord(data, created_by) {
    // Kiểm tra topic tồn tại
    const topic = await Topic.findByPk(data.topic_id);
    if (!topic) {
      return { EC: "1", EM: "Chủ đề không tồn tại", DT: null };
    }

    // Kiểm tra từ trùng lặp trong topic
    const existingWord = await Word.findOne({
      where: { word: data.word, topic_id: data.topic_id },
    });
    if (existingWord) {
      return { EC: "2", EM: "Từ này đã tồn tại trong chủ đề", DT: existingWord };
    }

    const word = await Word.create({
      topic_id: data.topic_id,
      word: data.word,
      part_of_speech: data.part_of_speech || null,
      pronunciation: data.pronunciation || null,
      meaning_vi: data.meaning_vi,
      example_en: data.example_sentence || data.example_en || null,
      example_vi: data.example_translation || data.example_vi || null,
      image_url: data.image_url || null,
      audio_url: data.audio_url || null,
      notes: data.notes || null,
      word_type: data.word_type || "system",
      created_by: created_by || null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Cập nhật word_count của topic
    await topic.increment("word_count");

    return { EC: "0", EM: "Tạo từ vựng thành công", DT: word };
  }

  /**
   * Cập nhật từ vựng
   */
  async updateWord(word_id, data) {
    const word = await Word.findByPk(word_id);
    if (!word) {
      return { EC: "1", EM: "Không tìm thấy từ vựng", DT: null };
    }

    // Kiểm tra từ trùng lặp nếu đổi tên từ
    if (data.word && data.word !== word.word) {
      const existingWord = await Word.findOne({
        where: { word: data.word, topic_id: data.topic_id || word.topic_id, word_id: { [Op.ne]: word_id } },
        attributes: ["word_id", "word"],
      });
      if (existingWord) {
        return { EC: "2", EM: "Từ này đã tồn tại trong chủ đề", DT: existingWord };
      }
    }

    // Update các field
    const updateData = { updated_at: new Date() };
    const allowedFields = [
      "word", "pronunciation", "meaning_vi", "part_of_speech",
      "image_url", "audio_url", "notes", "is_active", "topic_id"
    ];
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    // Handle alias fields
    if (data.example_sentence !== undefined) updateData.example_en = data.example_sentence;
    if (data.example_translation !== undefined) updateData.example_vi = data.example_translation;
    if (data.example_en !== undefined) updateData.example_en = data.example_en;
    if (data.example_vi !== undefined) updateData.example_vi = data.example_vi;

    await word.update(updateData);

    return { EC: "0", EM: "Cập nhật từ vựng thành công", DT: word };
  }

  /**
   * Xóa mềm từ vựng (is_active = false)
   */
  async softDeleteWord(word_id) {
    const word = await Word.findByPk(word_id);
    if (!word) {
      return { EC: "1", EM: "Không tìm thấy từ vựng", DT: null };
    }

    await word.update({ is_active: false, updated_at: new Date() });

    // Giảm word_count của topic
    const topic = await Topic.findByPk(word.topic_id);
    if (topic && topic.word_count > 0) {
      await topic.decrement("word_count");
    }

    return { EC: "0", EM: "Xóa từ vựng thành công", DT: word };
  }

  /**
   * Xóa cứng từ vựng (xóa hoàn toàn khỏi DB)
   */
  async hardDeleteWord(word_id) {
    const word = await Word.findByPk(word_id);
    if (!word) {
      return { EC: "1", EM: "Không tìm thấy từ vựng", DT: null };
    }

    const topic_id = word.topic_id;
    await word.destroy();

    // Giảm word_count của topic
    const topic = await Topic.findByPk(topic_id);
    if (topic && topic.word_count > 0) {
      await topic.decrement("word_count");
    }

    return { EC: "0", EM: "Xóa vĩnh viễn từ vựng thành công", DT: null };
  }

  /**
   * Toggle trạng thái active/inactive
   */
  async toggleWordActive(word_id) {
    const word = await Word.findByPk(word_id);
    if (!word) {
      return { EC: "1", EM: "Không tìm thấy từ vựng", DT: null };
    }

    const newStatus = !word.is_active;
    await word.update({ is_active: newStatus, updated_at: new Date() });

    // Cập nhật word_count của topic
    const topic = await Topic.findByPk(word.topic_id);
    if (topic) {
      if (newStatus) {
        await topic.increment("word_count");
      } else if (topic.word_count > 0) {
        await topic.decrement("word_count");
      }
    }

    return {
      EC: "0",
      EM: newStatus ? "Kích hoạt từ vựng thành công" : "Vô hiệu hóa từ vựng thành công",
      DT: word,
    };
  }

  /**
   * Khôi phục từ vựng đã xóa mềm
   */
  async restoreWord(word_id) {
    const word = await Word.findByPk(word_id);
    if (!word) {
      return { EC: "1", EM: "Không tìm thấy từ vựng", DT: null };
    }

    await word.update({ is_active: true, updated_at: new Date() });

    // Tăng word_count của topic
    const topic = await Topic.findByPk(word.topic_id);
    if (topic) {
      await topic.increment("word_count");
    }

    return { EC: "0", EM: "Khôi phục từ vựng thành công", DT: word };
  }

  // ==================== TOPIC OPERATIONS ====================

  /**
   * Lấy danh sách chủ đề với phân trang
   */
  async getTopics({ page = 1, limit = 10, search, is_active, topic_type }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { topic_name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (is_active !== undefined) {
      where.is_active = is_active === "true" || is_active === true;
    }

    if (topic_type) {
      where.topic_type = topic_type;
    }

    const { rows: topics, count: total } = await Topic.findAndCountAll({
      where,
      include: [
        { model: User, as: "creator", attributes: ["user_id", "username", "email"] },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    return {
      EC: "0",
      EM: "Lấy danh sách chủ đề thành công",
      DT: {
        topics,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: parseInt(limit),
        },
      },
    };
  }

  /**
   * Lấy tất cả topics (không phân trang) - dùng cho dropdown
   */
  async getAllTopics() {
    const topics = await Topic.findAll({
      where: { is_active: true },
      attributes: ["topic_id", "topic_name", "image_url", "word_count"],
      order: [["topic_name", "ASC"]],
    });

    return { EC: "0", EM: "Lấy danh sách chủ đề thành công", DT: topics };
  }

  /**
   * Tạo chủ đề mới
   */
  async createTopic(data, created_by) {
    // Kiểm tra tên trùng
    const existingTopic = await Topic.findOne({
      where: { topic_name: data.topic_name },
    });
    if (existingTopic) {
      return { EC: "1", EM: "Tên chủ đề đã tồn tại", DT: existingTopic };
    }

    const topic = await Topic.create({
      ...data,
      created_by,
      topic_type: "system",
      is_active: true,
      is_public: true,
      word_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { EC: "0", EM: "Tạo chủ đề thành công", DT: topic };
  }

  /**
   * Cập nhật chủ đề
   */
  async updateTopic(topic_id, data) {
    const topic = await Topic.findByPk(topic_id);
    if (!topic) {
      return { EC: "1", EM: "Không tìm thấy chủ đề", DT: null };
    }

    // Kiểm tra tên trùng
    if (data.topic_name && data.topic_name !== topic.topic_name) {
      const existingTopic = await Topic.findOne({
        where: { topic_name: data.topic_name, topic_id: { [Op.ne]: topic_id } },
      });
      if (existingTopic) {
        return { EC: "2", EM: "Tên chủ đề đã tồn tại", DT: existingTopic };
      }
    }

    await topic.update({ ...data, updated_at: new Date() });

    return { EC: "0", EM: "Cập nhật chủ đề thành công", DT: topic };
  }

  /**
   * Xóa mềm chủ đề (chỉ topic có is_active, word không có)
   */
  async softDeleteTopic(topic_id) {
    const topic = await Topic.findByPk(topic_id);
    if (!topic) {
      return { EC: "1", EM: "Không tìm thấy chủ đề", DT: null };
    }

    await topic.update({ is_active: false, updated_at: new Date() });

    // Không update is_active của Word vì column không tồn tại trong DB

    return { EC: "0", EM: "Xóa chủ đề thành công", DT: topic };
  }

  /**
   * Toggle trạng thái chủ đề
   */
  async toggleTopicActive(topic_id) {
    const topic = await Topic.findByPk(topic_id);
    if (!topic) {
      return { EC: "1", EM: "Không tìm thấy chủ đề", DT: null };
    }

    const newStatus = !topic.is_active;
    await topic.update({ is_active: newStatus, updated_at: new Date() });

    return {
      EC: "0",
      EM: newStatus ? "Kích hoạt chủ đề thành công" : "Vô hiệu hóa chủ đề thành công",
      DT: topic,
    };
  }

  // ==================== STATISTICS ====================

  /**
   * Lấy thống kê vocabulary
   */
  async getStatistics() {
    const [wordStats, topicStats] = await Promise.all([
      Word.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("word_id")), "total_words"],
          [sequelize.fn("SUM", sequelize.literal("CASE WHEN is_active = 1 THEN 1 ELSE 0 END")), "active_words"],
          [sequelize.fn("SUM", sequelize.literal("CASE WHEN is_active = 0 THEN 1 ELSE 0 END")), "inactive_words"],
        ],
        raw: true,
      }),
      Topic.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("topic_id")), "total_topics"],
          [sequelize.fn("SUM", sequelize.literal("CASE WHEN is_active = 1 THEN 1 ELSE 0 END")), "active_topics"],
          [sequelize.fn("SUM", sequelize.literal("CASE WHEN topic_type = 'system' THEN 1 ELSE 0 END")), "system_topics"],
        ],
        raw: true,
      }),
    ]);

    // Từ được thêm hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNewWords = await Word.count({
      where: { created_at: { [Op.gte]: today } },
    });

    return {
      EC: "0",
      EM: "Lấy thống kê thành công",
      DT: {
        total_words: parseInt(wordStats[0]?.total_words) || 0,
        active_words: parseInt(wordStats[0]?.active_words) || 0,
        inactive_words: parseInt(wordStats[0]?.inactive_words) || 0,
        total_topics: parseInt(topicStats[0]?.total_topics) || 0,
        active_topics: parseInt(topicStats[0]?.active_topics) || 0,
        system_topics: parseInt(topicStats[0]?.system_topics) || 0,
        today_new_words: todayNewWords,
      },
    };
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Import nhiều từ vựng cùng lúc
   */
  async batchImportWords(words, topic_id, created_by) {
    const topic = await Topic.findByPk(topic_id);
    if (!topic) {
      return { EC: "1", EM: "Chủ đề không tồn tại", DT: null };
    }

    const results = { success: [], duplicates: [], errors: [] };

    for (const wordData of words) {
      try {
        // Kiểm tra từ trùng
        const existing = await Word.findOne({
          where: { word: wordData.word, topic_id },
        });
        if (existing) {
          results.duplicates.push({ word: wordData.word, reason: "Đã tồn tại" });
          continue;
        }

        const word = await Word.create({
          topic_id,
          word: wordData.word,
          part_of_speech: wordData.part_of_speech || null,
          pronunciation: wordData.pronunciation || null,
          meaning_vi: wordData.meaning_vi,
          example_en: wordData.example_en || wordData.example_sentence || null,
          example_vi: wordData.example_vi || wordData.example_translation || null,
          image_url: wordData.image_url || null,
          audio_url: wordData.audio_url || null,
          notes: wordData.notes || null,
          word_type: "system",
          created_by: created_by || null,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });
        results.success.push(word);
      } catch (error) {
        results.errors.push({ word: wordData.word, reason: error.message });
      }
    }

    // Cập nhật word_count
    if (results.success.length > 0) {
      await topic.increment("word_count", { by: results.success.length });
    }

    return {
      EC: "0",
      EM: `Import thành công ${results.success.length}/${words.length} từ`,
      DT: results,
    };
  }

  /**
   * Kiểm tra từ trùng lặp
   */
  async checkDuplicates(words, topic_id) {
    const duplicates = [];

    for (const word of words) {
      const existing = await Word.findOne({
        where: { word, topic_id },
        attributes: ["word_id", "word"],
      });
      if (existing) {
        duplicates.push({ word, existing });
      }
    }

    return {
      EC: "0",
      EM: `Tìm thấy ${duplicates.length} từ trùng lặp`,
      DT: { duplicates, hasDuplicates: duplicates.length > 0 },
    };
  }

  /**
   * Xóa hàng loạt từ vựng (soft delete)
   */
  async batchDeleteWords(word_ids, soft = true) {
    if (soft) {
      await Word.update(
        { is_active: false, updated_at: new Date() },
        { where: { word_id: { [Op.in]: word_ids } } }
      );
    } else {
      await Word.destroy({ where: { word_id: { [Op.in]: word_ids } } });
    }

    return {
      EC: "0",
      EM: `Xóa thành công ${word_ids.length} từ`,
      DT: { deleted_count: word_ids.length },
    };
  }

  /**
   * Toggle active hàng loạt
   */
  async batchToggleActive(word_ids, is_active) {
    await Word.update(
      { is_active, updated_at: new Date() },
      { where: { word_id: { [Op.in]: word_ids } } }
    );

    return {
      EC: "0",
      EM: is_active ? `Kích hoạt ${word_ids.length} từ` : `Vô hiệu hóa ${word_ids.length} từ`,
      DT: { updated_count: word_ids.length },
    };
  }
}

module.exports = new VocabularyAdminService();

