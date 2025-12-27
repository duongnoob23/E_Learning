const {
  Word,
  Topic,
  UserWord,
  UserWordStatus,
  PronunciationAssessment,
} = require("../../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const multiPAService = require("./multiPAService");

// Lấy danh sách từ vựng theo topic + tìm kiếm
exports.getWordsByTopic = async (filters) => {
  try {
    const { topicId, q, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (topicId) {
      whereConditions.topic_id = topicId;
    }
    if (q) {
      whereConditions.word = { [Op.like]: `%${q}%` };
    }

    const { count, rows } = await Word.findAndCountAll({
      where: whereConditions,
      limit: limit,
      offset: offset,
    });

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: {
        words: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getWordsByTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách topic
exports.getTopicPublic = async (topic_type) => {
  try {
    const topics = await Topic.findAll({
      where: {
        is_active: true,
        topic_type: "system",
      },
      attributes: ["topic_id", "topic_name", "description", "image_url"],
    });

    return {
      EM: "Lấy danh sách chủ đề thành công",
      EC: "0",
      DT: topics,
    };
  } catch (error) {
    console.error("Lỗi trong getTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy chi tiết word theo id
exports.getWordDetail = async (word_id) => {
  try {
    const word = await Word.findById(word_id);
    if (!word) {
      return {
        EM: "Không tìm thấy từ",
        EC: "2",
        DT: null,
      };
    }

    return {
      EM: "Lấy chi tiết từ thành công",
      EC: "0",
      DT: word,
    };
  } catch (error) {
    console.error("Lỗi trong getWordDetail service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Tìm từ theo tên (word) trong bảng words
exports.findWordByName = async (wordName) => {
  try {
    if (!wordName || !wordName.trim()) {
      return {
        EM: "Tên từ không được để trống",
        EC: "-1",
        DT: null,
      };
    }

    // Tìm từ không phân biệt hoa thường
    const { Sequelize } = require('sequelize');
    const word = await Word.findOne({
      where: {
        word: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('word')),
          wordName.trim().toLowerCase()
        ),
        is_active: true,
      },
    });

    if (!word) {
      return {
        EM: "Không tìm thấy từ trong hệ thống",
        EC: "1",
        DT: null,
      };
    }

    return {
      EM: "Tìm thấy từ trong hệ thống",
      EC: "0",
      DT: word,
    };
  } catch (error) {
    console.error("Lỗi trong findWordByName service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình tìm kiếm",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách từ vựng cá nhân theo topic + tìm kiếm
exports.getWordsbyUser = async (filters) => {
  try {
    const { user_id, topicId, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (user_id) {
      whereConditions.user_id = user_id;
    }
    if (topicId) {
      whereConditions.topic_id = topicId;
    }

    const { count, rows } = await UserWord.findAndCountByFilters({
      where: whereConditions,
      limit: limit,
      offset: offset,
    });

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: {
        words: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getWordsbyUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Helper: Tạo file MP3 từ text bằng gTTS
const generateAudioFile = async (word) => {
  try {
    const uploadsDir = path.join(__dirname, "../../uploads/audio");

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${word.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.mp3`;
    const filepath = path.join(uploadsDir, filename);

    // Gọi Python script để tạo MP3 bằng gTTS
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python", [
        path.join(__dirname, "../../../scripts/generate_audio.py"),
        word,
        filepath,
      ]);

      let errorOutput = "";

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          // Trả về URL tương đối
          const audioUrl = `/uploads/audio/${filename}`;
          resolve(audioUrl);
        } else {
          console.error("Python error:", errorOutput);
          reject(new Error("Không thể tạo file âm thanh"));
        }
      });
    });
  } catch (error) {
    console.error("Lỗi tạo audio:", error);
    return null;
  }
};

// Tao du tu vung moi ca nhan
exports.postWordToUser = async (data) => {
  try {
    const {
      user_id,
      topic_id,
      word,
      part_of_speech,
      pronunciation,
      meaning_vi,
      example_en,
      example_vi,
      image_url,
      from_system_word_id,
      notes,
    } = data;
    // ===== Step 1: Kiểm tra từ hệ thống ===== //
    const systemWord = await Word.findByWord(data.word);
    if (systemWord) {
      const alreadySaved = await UserWord.findByWord(
        data.user_id,
        systemWord.word_id
      );

      if (alreadySaved) {
        return {
          EM: "Từ này đã được lưu",
          EC: "2",
          DT: null,
        };
      }

      const newUserWord = await UserWord.create({
        user_id: user_id,
        topic_id: topic_id || systemWord.topic_id,
        word: systemWord.word,
        part_of_speech: systemWord.part_of_speech,
        pronunciation: systemWord.pronunciation,
        meaning_vi: systemWord.meaning_vi,
        example_en: systemWord.example_en,
        example_vi: systemWord.example_vi,
        image_url: systemWord.image_url,
        notes: null,
        from_system_word_id: systemWord.word_id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const newUserWordStatus = await UserWordStatus.create({
        user_id: user_id,
        topic_id: topic_id || systemWord.topic_id,
        word_id: systemWord.word_id,
        user_word_id: newUserWord.user_word_id,
        is_learned: false,
        marked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return {
        EM: "Thêm từ thành công",
        EC: "0",
        DT: newUserWord,
      };
    }

    // ===== Step 2: Kiểm tra từ cá nhân ===== //
    const existingPersonal = await UserWord.findOne({
      where: { word: data.word },
      order: [["user_word_id", "ASC"]],
    });

    if (existingPersonal) {
      const newUserWord = await UserWord.create({
        user_id: user_id,
        topic_id: existingPersonal.topic_id,
        word: data.word,
        part_of_speech: part_of_speech || existingPersonal.part_of_speech,
        pronunciation: pronunciation || existingPersonal.pronunciation || null,
        meaning_vi: meaning_vi || existingPersonal.meaning_vi,
        example_en: example_en || existingPersonal.example_en,
        example_vi: example_vi || existingPersonal.example_vi,
        image_url: existingPersonal.image_url,
        notes: null,
        from_system_word_id: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await UserWordStatus.create({
        user_id: user_id,
        topic_id: existingPersonal.topic_id,
        word_id: null,
        user_word_id: newUserWord.user_word_id,
        is_learned: false,
        marked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return {
        EM: "Thêm từ thành công",
        EC: "0",
        DT: newUserWord,
      };
    }
    // ===== Step 3: Tạo từ mới nếu không tìm thấy ===== //
    if (!meaning_vi) {
      return {
        EM: "Vui lòng cung cấp nghĩa tiếng Việt",
        EC: "-1",
        DT: null,
      };
    }

    if (!topic_id) {
      return {
        EM: "Vui lòng cung cấp topic_id",
        EC: "-1",
        DT: null,
      };
    }

    const newUserWord = await UserWord.create({
      user_id: user_id,
      topic_id: topic_id,
      word: data.word,
      part_of_speech: part_of_speech || null,
      pronunciation: pronunciation || null,
      meaning_vi: meaning_vi,
      example_en: example_en || null,
      example_vi: example_vi || null,
      image_url: image_url || null,
      notes: notes || null,
      from_system_word_id: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Tạo UserWordStatus cho từ mới
    await UserWordStatus.create({
      user_id: user_id,
      topic_id: topic_id,
      word_id: null,
      user_word_id: newUserWord.user_word_id,
      is_learned: false,
      marked_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      EM: "Thêm từ thành công",
      EC: "0",
      DT: newUserWord,
    };
  } catch (error) {
    console.error("Lỗi trong postWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình thêm từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Sửa từ vựng cá nhân
exports.patchWordToUser = async (data) => {
  try {
    const result = await UserWord.updateWord(data.user_word_id, data);
    return {
      EM: "Cập nhật từ thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi trong patchWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình cập nhật từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Xóa từ vựng cá nhân
exports.deleteWordToUser = async (userWordId) => {
  try {
    const result = await UserWord.deleteWord(userWordId);
    await UserWordStatus.deleteWord(userWordId);
    return {
      EM: "Xóa từ thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi trong deleteWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình xóa từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Đánh dấu đã học
exports.markLearned = async (userId, word_id, topic_id) => {
  try {
    await UserWordStatus.markLearned(userId, word_id, topic_id);
    return {
      EM: "Đánh dấu đã học thành công",
      EC: "0",
      DT: null,
    };
  } catch (error) {
    console.error("Lỗi trong markLearned service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình đánh dấu đã học",
      EC: "-2",
      DT: null,
    };
  }
};

// Đánh dấu chưa học
exports.unmarkLearned = async (userId, word_id, topic_id) => {
  try {
    await UserWordStatus.unmarkLearned(userId, word_id, topic_id);
    return {
      EM: "Đánh dấu chưa học thành công",
      EC: "0",
      DT: null,
    };
  } catch (error) {
    console.error("Lỗi trong unmarkLearned service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình đánh dấu chưa học",
      EC: "-2",
      DT: null,
    };
  }
};

// ----- Flashcard Routes ----- //

// Lấy danh sách topic của user
exports.getTopicByUser = async (userId) => {
  try {
    const topics = await Topic.findAll({
      where: {
        created_by: userId,
        is_active: true,
      },
      attributes: ["topic_id", "topic_name", "description", "image_url"],
    });

    return {
      EM: "Lấy danh sách chủ đề thành công",
      EC: "0",
      DT: topics,
    };
  } catch (error) {
    console.error("Lỗi trong getTopicByUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};
// Tạo set
exports.createSet = async (userId, topic_name, description) => {
  try {
    const newSet = await Topic.createTopic({
      topic_name: topic_name,
      description: description,
      image_url: null,
      topic_type: "user_created",
      created_by: userId,
      is_public: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return {
      EM: "Tạo set thành công",
      EC: "0",
      DT: newSet,
    };
  } catch (error) {
    console.error("Lỗi trong createSet service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình tạo set",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy chi tiết set theo id
exports.getSetDetail = async (set_id) => {
  try {
    const set = await Topic.findOne({
      where: {
        topic_id: set_id,
        is_active: true,
      },
      attributes: ["topic_id", "topic_name", "description", "image_url"],
    });
    return {
      EM: "Lấy chi tiết set thành công",
      EC: "0",
      DT: set,
    };
  } catch (error) {
    console.error("Lỗi trong getSetDetail service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy chi tiết set",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách từ vựng trong set theo id
exports.getWordsBySet = async (set_id) => {
  try {
    const set = await Topic.findOne({
      where: {
        topic_id: set_id,
        is_active: true,
      },
    });
    if (set.topic_type === "system") {
      const words = await Word.findAll({
        where: {
          topic_id: set_id,
          is_active: true,
        },
      });
      return {
        EM: "Lấy danh sách từ vựng trong set thành công",
        EC: "0",
        DT: words,
      };
    } else {
      const words = await UserWord.findAll({
        where: {
          topic_id: set_id,
          is_active: true,
        },
      });
      return {
        EM: "Lấy danh sách từ vựng trong set thành công",
        EC: "0",
        DT: words,
      };
    }
  } catch (error) {
    console.error("Lỗi trong getWordsBySet service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách từ vựng trong set",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy flashcard tiếp theo trong set
exports.getNextFlashcard = async (userId, set_id) => {
  try {
    if (!set_id) {
      return {
        EM: "Thiếu set_id",
        EC: "-1",
        DT: null,
      };
    }

    // Lấy set để kiểm tra type
    const set = await Topic.findOne({
      where: {
        topic_id: set_id,
        is_active: true,
      },
    });

    if (!set) {
      return {
        EM: "Không tìm thấy set",
        EC: "1",
        DT: null,
      };
    }

    // Lấy từ vựng trong set
    let words = [];
    if (set.topic_type === "system") {
      words = await Word.findAll({
        where: {
          topic_id: set_id,
          is_active: true,
        },
        order: [["word_id", "ASC"]],
      });
    } else {
      words = await UserWord.findAll({
        where: {
          topic_id: set_id,
          user_id: userId,
          is_active: true,
        },
        order: [["user_word_id", "ASC"]],
      });
    }

    if (words.length === 0) {
      return {
        EM: "Set không có từ vựng nào",
        EC: "1",
        DT: null,
      };
    }

    // Lấy từ vựng tiếp theo dựa trên UserWordStatus (nếu có)
    // Nếu chưa có status, trả về từ đầu tiên
    const statuses = await UserWordStatus.findAll({
      where: {
        user_id: userId,
        topic_id: set_id,
        is_learned: false, // Ưu tiên từ chưa học
      },
      order: [["created_at", "ASC"]],
    });

    let nextWord = null;
    if (statuses.length > 0) {
      // Tìm từ chưa học đầu tiên
      const nextStatus = statuses[0];
      if (set.topic_type === "system" && nextStatus.word_id) {
        nextWord = words.find((w) => w.word_id === nextStatus.word_id);
      } else if (set.topic_type === "user_created" && nextStatus.user_word_id) {
        nextWord = words.find(
          (w) => w.user_word_id === nextStatus.user_word_id
        );
      }
    }

    // Nếu không tìm thấy, lấy từ đầu tiên
    if (!nextWord) {
      nextWord = words[0];
    }

    return {
      EM: "Lấy flashcard tiếp theo thành công",
      EC: "0",
      DT: {
        word: nextWord,
        total_words: words.length,
        current_index:
          words.findIndex(
            (w) =>
              (set.topic_type === "system" && w.word_id === nextWord.word_id) ||
              (set.topic_type === "user_created" &&
                w.user_word_id === nextWord.user_word_id)
          ) + 1,
      },
    };
  } catch (error) {
    console.error("Lỗi trong getNextFlashcard service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy flashcard tiếp theo",
      EC: "-2",
      DT: null,
    };
  }
};

// Tiến độ học theo topic
exports.getProgressByTopic = async (userId, topicId) => {
  try {
    // Tổng số từ trong topic
    const systemWords = await Word.count({
      where: { topic_id: topicId, is_active: true },
    });
    const userWords = await UserWord.count({
      where: { topic_id: topicId, user_id: userId, is_active: true },
    });
    const totalWords = systemWords + userWords;

    // Số từ đã học
    const learnedCount = await UserWordStatus.count({
      where: {
        user_id: userId,
        topic_id: topicId,
        is_learned: true,
      },
    });

    // Số từ chưa học
    const notLearnedCount = await UserWordStatus.count({
      where: {
        user_id: userId,
        topic_id: topicId,
        is_learned: false,
      },
    });

    // Số từ đã đánh dấu học hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewedToday = await UserWordStatus.count({
      where: {
        user_id: userId,
        topic_id: topicId,
        marked_at: { [Op.gte]: today },
      },
    });

    // Thống kê theo trạng thái học
    const statuses = await UserWordStatus.findAll({
      where: {
        user_id: userId,
        topic_id: topicId,
      },
    });

    const newCount = statuses.filter((s) => !s.is_learned).length;
    const learningCount = 0; // Không còn trường review_count
    const masteredCount = statuses.filter((s) => s.is_learned).length;

    return {
      EM: "Lấy tiến độ học theo topic thành công",
      EC: "0",
      DT: {
        topic_id: topicId,
        total_words: totalWords,
        learned_count: learnedCount,
        new_count: newCount,
        learning_count: learningCount,
        mastered_count: masteredCount,
        due_today: notLearnedCount,
        reviewed_today: reviewedToday,
        progress_percentage:
          totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0,
      },
    };
  } catch (error) {
    console.error("Lỗi trong getProgressByTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy tiến độ học theo topic",
      EC: "-2",
      DT: null,
    };
  }
};

// ----------- SRS (SPACED REPETITION) ----------- //

// Lấy danh sách từ vựng hôm nay (từ chưa học)
exports.getTodayWords = async (userId) => {
  try {
    const words = await UserWordStatus.findAll({
      where: {
        user_id: userId,
        is_learned: false, // Lấy từ chưa học
      },
      include: [
        { model: UserWord, as: "user_words" },
        { model: Word, as: "words" },
      ],
      order: [["created_at", "ASC"]],
      limit: 20, // Giới hạn 20 từ
    });
    return {
      EM: "Lấy danh sách từ vựng hôm nay thành công",
      EC: "0",
      DT: words,
    };
  } catch (error) {
    console.error("Lỗi trong getTodayWords service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách từ vựng hôm nay",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy từ vựng tiếp theo (từ chưa học)
exports.getNextWord = async (userId) => {
  try {
    let nextWord = await UserWordStatus.findOne({
      where: {
        user_id: userId,
        is_learned: false, // Ưu tiên từ chưa học
      },
      order: [["created_at", "ASC"]],
      include: [
        { model: UserWord, as: "user_words" },
        { model: Word, as: "words" },
      ],
    });

    if (!nextWord) {
      // Nếu không có từ chưa học, lấy từ bất kỳ
      nextWord = await UserWordStatus.findOne({
        where: {
          user_id: userId,
        },
        order: [["created_at", "ASC"]],
        include: [
          { model: UserWord, as: "user_words" },
          { model: Word, as: "words" },
        ],
      });
    }

    if (!nextWord) {
      return {
        EM: "Không có từ vựng nào để học",
        EC: "1",
        DT: null,
      };
    }
    return {
      EM: "Lấy từ vựng tiếp theo thành công",
      EC: "0",
      DT: nextWord,
    };
  } catch (error) {
    console.error("Lỗi trong getNextWord service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy từ vựng tiếp theo",
      EC: "-2",
      DT: null,
    };
  }
};

// Gửi feedback cho từ vựng (đơn giản hóa - chỉ cập nhật is_learned)
exports.submitFeedback = async (userId, word_id, feedback) => {
  try {
    let status = await UserWordStatus.findOne({
      where: {
        user_id: userId,
        word_id: word_id,
      },
    });

    if (!status) {
      return {
        EM: "Không tìm thấy từ vựng",
        EC: "1",
        DT: null,
      };
    }

    const now = new Date();

    // Đơn giản hóa: chỉ cập nhật is_learned và marked_at
    switch (feedback) {
      case "remember":
      case "easy":
        // Đánh dấu là đã học
        await status.update({
          is_learned: true,
          marked_at: now,
        });
        break;

      case "forget":
      case "hard":
        // Đánh dấu là chưa học
        await status.update({
          is_learned: false,
          marked_at: null,
        });
        break;

      default:
        return {
          EM: "Feedback không hợp lệ",
          EC: "2",
          DT: null,
        };
    }

    return {
      EM: "Gửi feedback thành công",
      EC: "0",
      DT: {
        is_learned: status.is_learned,
        marked_at: status.marked_at,
      },
    };
  } catch (error) {
    console.error("Lỗi trong submitFeedback service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình gửi feedback",
      EC: "-2",
      DT: null,
    };
  }
};

//------------ PROGRESS (TIẾN ĐỘ HỌC) ------------//

// Lấy tổng quan tiến độ học
exports.getOverview = async (user_id) => {
  try {
    const totalWords = await UserWord.count({ where: { user_id } });

    const statusCount = await UserWordStatus.findAll({
      where: { user_id },
    });
    const newCount = statusCount.filter((s) => !s.is_learned).length;
    const learningCount = 0; // Không còn trường review_count
    const masteredCount = statusCount.filter((s) => s.is_learned).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueToday = await UserWordStatus.count({
      where: {
        user_id,
        is_learned: false, // Từ chưa học
      },
    });

    const reviewedToday = await UserWordStatus.count({
      where: {
        user_id,
        marked_at: { [Op.gte]: today },
      },
    });

    return {
      EM: "Lấy tổng quan tiến độ học thành công",
      EC: "0",
      DT: {
        totalWords: totalWords,
        newCount: newCount,
        learningCount: learningCount,
        masteredCount: masteredCount,
        dueToday: dueToday,
        reviewedToday: reviewedToday,
      },
    };
  } catch (error) {
    console.error("Lỗi trong getOverview service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy tổng quan tiến độ học",
      EC: "-2",
      DT: null,
    };
  }
};

// Tiến độ học theo ngày
exports.getDailyProgress = async (user_id) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Từ thêm hôm nay
    const addedToday = await UserWord.count({
      where: {
        user_id,
        created_at: { [Op.gte]: today },
      },
    });

    // Từ đánh dấu hôm nay
    const reviewedToday = await UserWordStatus.count({
      where: {
        user_id,
        marked_at: { [Op.gte]: today },
      },
    });

    // Biểu đồ 7 ngày
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const nextDay = new Date(d.getTime() + 86400000);

      const learned = await UserWord.count({
        where: {
          user_id,
          created_at: { [Op.gte]: d, [Op.lt]: nextDay },
        },
      });

      const reviewed = await UserWordStatus.count({
        where: {
          user_id,
          marked_at: { [Op.gte]: d, [Op.lt]: nextDay },
        },
      });

      result.push({
        date: d.toISOString().slice(0, 10),
        learned,
        reviewed,
      });
    }
    return {
      EM: "Lấy tiến độ học theo ngày thành công",
      EC: "0",
      DT: {
        addedToday,
        reviewedToday,
        history7days: result,
      },
    };
  } catch (error) {
    console.error("Lỗi trong getDailyProgress service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy tiến độ học theo ngày",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * =============================
 *  PRACTICE (QUIZ)
 * =============================
 */

// Tạo quiz
exports.generateQuiz = async (user_id, topic_id) => {
  try {
    // 1. Lấy từ hệ thống
    const systemWords = await Word.findAll({ where: { topic_id } });
    console.log(`[generateQuiz] systemWords count: ${systemWords.length}`);

    // 2. Lấy từ cá nhân của user có cùng topic
    const userWords = await UserWord.findAll({
      where: { user_id, topic_id },
    });
    console.log(`[generateQuiz] userWords count: ${userWords.length}`);

    const allWords = [
      ...systemWords.map((w) => ({ ...w.dataValues, is_user: false })),
      ...userWords.map((u) => ({ ...u.dataValues, is_user: true })),
    ];
    console.log(`[generateQuiz] allWords count: ${allWords.length}`);

    if (allWords.length === 0) {
      return {
        EM: "Không có từ vựng nào trong chủ đề này",
        EC: "1",
        DT: null,
      };
    }

    // Số câu hỏi = min(10, số từ có sẵn)
    const numQuestions = Math.min(10, allWords.length);

    // 3. Sinh ngẫu nhiên câu hỏi
    const questions = [];

    for (let i = 0; i < numQuestions; i++) {
      const word = allWords[Math.floor(Math.random() * allWords.length)];

      // Lấy tối đa 3 đáp án sai
      const wrongOptions = allWords
        .filter((w) => w.word_id !== word.word_id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => w.meaning_vi);

      // Nếu không đủ 3 đáp án sai, bỏ qua câu này
      if (wrongOptions.length === 0) continue;

      questions.push({
        question_id: uuidv4(),
        type: "choose_meaning",
        word: word.word,
        audio_url: word.audio_url || null,
        correct_answer: word.meaning_vi,
        options: shuffle([word.meaning_vi, ...wrongOptions]),
      });
    }

    if (questions.length === 0) {
      return {
        EM: "Không thể tạo quiz với các từ hiện có",
        EC: "1",
        DT: null,
      };
    }

    return {
      EM: "Tạo quiz thành công",
      EC: "0",
      DT: questions,
    };
  } catch (error) {
    console.error("Lỗi trong generateQuiz service:", error);
    return {
      EM: error.message || "Có lỗi xảy ra trong quá trình tạo quiz",
      EC: "-2",
      DT: null,
    };
  }
};

// Hàm shuffle
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Nộp bài quiz
exports.submitQuiz = async (user_id, answers) => {
  try {
    const correct = answers.filter((a) => a.is_correct).length;
    const wrong = answers.length - correct;

    const score = correct;
    return {
      EM: "Nộp bài quiz thành công",
      EC: "0",
      DT: {
        correct,
        wrong,
        score,
      },
    };
  } catch (error) {
    console.error("Lỗi trong submitQuiz service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình nộp bài quiz",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * =============================
 *  PRONUNCIATION ASSESSMENT
 * =============================
 */

// Chấm điểm phát âm
exports.assessPronunciation = async (userId, wordId, audioFile) => {
  try {
    // 1. Lấy thông tin từ
    const word = await Word.findByPk(wordId);
    if (!word) {
      return {
        EM: "Từ không tồn tại",
        EC: "1",
        DT: null,
      };
    }

    // 2. Gửi audio đến Python service (MultiPA)
    const pronunciationScore = await callMultiPAService(
      audioFile,
      word.pronunciation || word.word
    );

    // 3. Lưu kết quả vào database
    const assessment = await PronunciationAssessment.create({
      user_id: userId,
      word_id: wordId,
      score: pronunciationScore.score,
      pronunciation_score: pronunciationScore.pronunciation_score,
      fluency_score: pronunciationScore.fluency_score,
      feedback: pronunciationScore.feedback,
      audio_url: audioFile.url || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 4. Cập nhật UserWordStatus
    await updateUserWordStatusByPronunciation(
      userId,
      wordId,
      pronunciationScore.score
    );

    return {
      EM: "Chấm điểm thành công",
      EC: "0",
      DT: {
        assessment_id: assessment.assessment_id,
        score: pronunciationScore.score,
        pronunciation_score: pronunciationScore.pronunciation_score,
        fluency_score: pronunciationScore.fluency_score,
        feedback: pronunciationScore.feedback,
        words_to_improve: pronunciationScore.words_to_improve || [],
      }
    };
  } catch (error) {
    console.error("Lỗi trong assessPronunciation:", error);
    return {
      EM: error.message || "Có lỗi xảy ra trong quá trình chấm điểm",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy lịch sử chấm điểm phát âm
exports.getPronunciationHistory = async (userId, wordId) => {
  try {
    const history = await PronunciationAssessment.findAll({
      where: { user_id: userId, word_id: wordId },
      order: [["created_at", "DESC"]],
      limit: 10,
    });

    return {
      EM: "Lấy lịch sử thành công",
      EC: "0",
      DT: history,
    };
  } catch (error) {
    console.error("Lỗi trong getPronunciationHistory:", error);
    return {
      EM: error.message,
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy thống kê phát âm của user
exports.getPronunciationStats = async (userId, topicId = null) => {
  try {
    const whereClause = { user_id: userId };

    if (topicId) {
      const userWords = await UserWord.findAll({
        where: { user_id: userId, topic_id: topicId },
        attributes: ["user_word_id"],
      });
      const userWordIds = userWords.map((w) => w.user_word_id);
      whereClause.user_word_id = { [Op.in]: userWordIds };
    }

    const assessments = await PronunciationAssessment.findAll({
      where: whereClause,
    });

    const totalAssessments = assessments.length;
    const avgScore =
      totalAssessments > 0
        ? (
            assessments.reduce((sum, a) => sum + a.score, 0) / totalAssessments
          ).toFixed(2)
        : 0;

    const scoreDistribution = {
      excellent: assessments.filter((a) => a.score >= 90).length,
      good: assessments.filter((a) => a.score >= 80 && a.score < 90).length,
      average: assessments.filter((a) => a.score >= 70 && a.score < 80).length,
      poor: assessments.filter((a) => a.score < 70).length,
    };

    return {
      EM: "Lấy thống kê thành công",
      EC: "0",
      DT: {
        totalAssessments,
        avgScore,
        scoreDistribution,
      },
    };
  } catch (error) {
    console.error("Lỗi trong getPronunciationStats:", error);
    return {
      EM: error.message,
      EC: "-2",
      DT: null,
    };
  }
};

// Gọi Python MultiPA service (sử dụng spawn Python script)
const callMultiPAService = async (audioFile, referenceText) => {
  try {
    // Kiểm tra file tồn tại
    if (!audioFile.path || !fs.existsSync(audioFile.path)) {
      throw new Error("File audio không tồn tại");
    }

    // Sử dụng multiPAService để gọi Python script
    const result = await multiPAService.scoreSpeaking(audioFile.path, "en");

    // Chỉ lấy các từ cần cải thiện (không lấy tất cả)
    const wordsToImprove = (result.words_to_improve || []).map((w) => ({
      word: w.word,
      score: w.score,
      issues: w.issues || [],
      tips: w.tips || [],
    }));

    return {
      score: result.score || 0,
      pronunciation_score: result.pronunciation_score || 0,
      fluency_score: result.fluency_score || 0,
      prosody_score: result.prosody_score || 0,
      transcript: result.transcript || "",
      words_to_improve: wordsToImprove,
      feedback: result.feedback || "",
    };
  } catch (error) {
    console.error("Lỗi gọi MultiPA service:", error.message);
    throw new Error(error.message || "Không thể chấm điểm phát âm");
  }
};

// Cập nhật UserWordStatus dựa trên điểm phát âm
const updateUserWordStatusByPronunciation = async (
  userId,
  wordId,
  pronunciationScore
) => {
  try {
    const userWordStatus = await UserWordStatus.findOne({
      where: { user_id: userId, word_id: wordId },
    });

    if (!userWordStatus) return;

    // Đơn giản hóa: nếu điểm >= 80 thì đánh dấu là đã học
    if (pronunciationScore >= 80) {
      await userWordStatus.update({
        is_learned: true,
        marked_at: new Date(),
      });
    } else if (pronunciationScore < 60) {
      // Nếu điểm thấp, đánh dấu là chưa học
      await userWordStatus.update({
        is_learned: false,
        marked_at: null,
      });
    }
  } catch (error) {
    console.error("Lỗi cập nhật UserWordStatus:", error);
  }
};
