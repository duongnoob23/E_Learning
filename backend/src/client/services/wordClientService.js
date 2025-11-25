const { Word,Topic, UserWord, UserWordStatus } = require("../../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

// Lấy danh sách từ vựng theo topic + tìm kiếm
exports.getWordsByTopic = async (filters) => {
  try {
    const { topicId,q, page = 1, limit = 10 } = filters;
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
        topic_type : "system",
      },
      attributes: ["topic_id", "topic_name", "description", "image_url"],
    });

    return {
      EM: "Lấy danh sách chủ đề thành công",
      EC: "0",
      DT: topics, 
    };
  }
  catch (error) {
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

// Tao du tu vung moi ca nhan
exports.postWordToUser = async (data) => {
  try {
    const { user_id, topic_id, word, part_of_speech, pronunciation, meaning_vi, example_en, example_vi, image_url, from_system_word_id, notes } = data;
    // ===== Step 1: Kiểm tra từ hệ thống ===== //
    const systemWord = await Word.findByWord(data.word);
    if(systemWord){
      const alreadySaved = await UserWord.findByWord(
        data.user_id,
        systemWord.word_id
      )

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
        review_count: 0,
        intervall: 1,
        ease_factor: 2.5,
        last_reviewed: null,
        next_review: new Date(),
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
        pronunciation: pronunciation || existingPersonal.pronunciation,
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
      const newUserWordStatus = await UserWordStatus.create({
        user_id: user_id,
        topic_id: existingPersonal.topic_id,
        word_id: existingPersonal.word_id,
        user_word_id: newUserWord.user_word_id,
        is_learned: false,
        review_count: 0,
        intervalll: 1,
        ease_factor: 2.5,
        last_reviewed: null,
        next_review: new Date(),
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
    const newUserWordStatus = await UserWordStatus.create({
      user_id: user_id,
      topic_id: topic_id,
      word_id: null,
      user_word_id: newUserWord.user_word_id,
      is_learned: false,
      review_count: 0,
      intervall: 1,
      ease_factor: 2.5,
      last_reviewed: null,
      next_review: new Date(),
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
  }catch (error) {
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
  }
  catch (error) {
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
    if(set.topic_type === "system"){
      const words = await Word.findAll({
        where: {
          topic_id: set_id,
          is_active: true,
        }
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
        }
      });
      return {
        EM: "Lấy danh sách từ vựng trong set thành công",
        EC: "0",
        DT: words,
      };
    }
  }
  catch (error) {
    console.error("Lỗi trong getWordsBySet service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách từ vựng trong set",
      EC: "-2",
      DT: null,
    };
  }
};

// ----------- SRS (SPACED REPETITION) ----------- //

// Lấy danh sách từ vựng hôm nay
exports.getTodayWords = async (userId) => {
  try {
    const today = new Date();
    const words = await UserWordStatus.findAll({
      where: {
        user_id: userId,
        next_review: { [Op.lte]: today }
      },
      include: [
        { model: UserWord, as: "user_words" },
        { model: Word, as: "words" }
      ]
    });
    return {
      EM: "Lấy danh sách từ vựng hôm nay thành công",
      EC: "0",
      DT: words,
    };
  }
  catch (error) {
    console.error("Lỗi trong getTodayWords service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách từ vựng hôm nay",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy từ vựng tiếp theo
exports.getNextWord = async (userId) => {
  try {
    const now = new Date();
    let nextWord = await UserWordStatus.findOne({
      where: {
        user_id: userId,
        next_review: { [Op.lte]: now }
      },
      order: [["next_review", "ASC"]],
      include: [
        { model: UserWord, as: "user_words" },
        { model: Word, as: "words" }
      ]
    });

    if(!nextWord){
      nextWord = await UserWordStatus.findOne({
        where: {
          user_id: userId,
        },
        order: [["next_review", "ASC"]],
        include: [
          { model: UserWord, as: "user_words" },
          { model: Word, as: "words" }
        ]
      });
    }

    if(!nextWord){
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
  }
  catch (error) {
    console.error("Lỗi trong getNextWord service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy từ vựng tiếp theo",
      EC: "-2",
      DT: null,
    };
  }
};

// Gửi feedback cho từ vựng
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

    let { review_count, intervall, ease_factor } = status;

    const MIN_EASE_FACTOR = 1.3;

    switch (feedback) {
      case "forget":
        review_count = 0;
        intervall = 1;
        ease_factor = Math.max(MIN_EASE_FACTOR, ease_factor - 0.2);
        break;

      case "remember":
        review_count += 1;
        intervall = Math.ceil(intervall * ease_factor);
        break;

      case "easy":
        review_count += 1;
        ease_factor += 0.15;
        intervall = Math.ceil(intervall * ease_factor * 1.2);
        break;

      case "hard":
        review_count += 1;
        ease_factor = Math.max(MIN_EASE_FACTOR, ease_factor - 0.15);
        intervall = Math.ceil(intervall * ease_factor * 0.8);
        break;

      default:
        return {
          EM: "Feedback không hợp lệ",
          EC: "2",
          DT: null,
        };
    }

    const now = new Date();
    const next_review = new Date(now.getTime() + intervall * 24 * 60 * 60 * 1000);

    await status.update({
      review_count,
      intervall,
      ease_factor,
      last_reviewed: now,
      next_review
    });

    return {
      EM: "Gửi feedback thành công",
      EC: "0",
      DT: {
        last_reviewed: now,
        next_review: next_review
      },
    };
  }
  catch (error) {
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
      where: { user_id }
    });
    const newCount = statusCount.filter(s => s.review_count === 0).length;
    const learningCount = statusCount.filter(s => s.review_count > 0 && s.review_count < 5).length;
    const masteredCount = statusCount.filter(s => s.review_count >= 5).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueToday = await UserWordStatus.count({
      where: {
        user_id,
        next_review: { [Op.lte]: today }
      }
    });

    const reviewedToday = await UserWordStatus.count({
      where: {
        user_id,
        last_reviewed: { [Op.gte]: today }
      }
    });

    return {
      "EM": "Lấy tổng quan tiến độ học thành công",
      "EC": "0",
      "DT": {
        "totalWords": totalWords,
        "newCount": newCount,
        "learningCount": learningCount,
        "masteredCount": masteredCount,
        "dueToday": dueToday,
        "reviewedToday": reviewedToday
      }
    };
  } catch (error) {
    console.error("Lỗi trong getOverview service:", error);
    return {
      "EM": "Có lỗi xảy ra trong quá trình lấy tổng quan tiến độ học",
      "EC": "-2",
      "DT": null
    };
  }
};

// Tiến độ học theo ngày
exports.getDailyProgress = async (user_id) => {
  try {
    const today = new Date();
  today.setHours(0,0,0,0);

  // Từ thêm hôm nay
  const addedToday = await UserWord.count({
    where: {
      user_id,
      created_at: { [Op.gte]: today }
    }
  });

  // Từ review hôm nay
  const reviewedToday = await UserWordStatus.count({
    where: {
      user_id,
      last_reviewed: { [Op.gte]: today }
    }
  });

  // Biểu đồ 7 ngày
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - i);
    const nextDay = new Date(d.getTime() + 86400000);

    const learned = await UserWord.count({
      where: {
        user_id,
        created_at: { [Op.gte]: d, [Op.lt]: nextDay }
      }
    });

    const reviewed = await UserWordStatus.count({
      where: {
        user_id,
        last_reviewed: { [Op.gte]: d, [Op.lt]: nextDay }
      }
    });

    result.push({
      date: d.toISOString().slice(0, 10),
      learned,
      reviewed
    });
  }
    return {
      "EM": "Lấy tiến độ học theo ngày thành công",
      "EC": "0",
      "DT": {
        addedToday,
        reviewedToday,
        history7days: result
      }
    };
  }
  catch (error) {
    console.error("Lỗi trong getDailyProgress service:", error);
    return {
      "EM": "Có lỗi xảy ra trong quá trình lấy tiến độ học theo ngày",
      "EC": "-2",
      "DT": null
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
      where: { user_id, topic_id }
    });
    console.log(`[generateQuiz] userWords count: ${userWords.length}`);

    const allWords = [
      ...systemWords.map(w => ({ ...w.dataValues, is_user: false })),
      ...userWords.map(u => ({ ...u.dataValues, is_user: true }))
    ];
    console.log(`[generateQuiz] allWords count: ${allWords.length}`);

    if (allWords.length === 0) {
      return {
        "EM": "Không có từ vựng nào trong chủ đề này",
        "EC": "1",
        "DT": null
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
        .filter(w => w.word_id !== word.word_id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.meaning_vi);

      // Nếu không đủ 3 đáp án sai, bỏ qua câu này
      if (wrongOptions.length === 0) continue;

      questions.push({
        question_id: uuidv4(),
        type: "choose_meaning",
        word: word.word,
        audio_url: word.audio_url || null,
        correct_answer: word.meaning_vi,
        options: shuffle([word.meaning_vi, ...wrongOptions])
      });
    }

    if (questions.length === 0) {
      return {
        "EM": "Không thể tạo quiz với các từ hiện có",
        "EC": "1",
        "DT": null
      };
    }

    return {
      "EM": "Tạo quiz thành công",
      "EC": "0",
      "DT": questions
    };
  } catch (error) {
    console.error("Lỗi trong generateQuiz service:", error);
    return {
      "EM": error.message || "Có lỗi xảy ra trong quá trình tạo quiz",
      "EC": "-2",
      "DT": null
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
    const correct = answers.filter(a => a.is_correct).length;
    const wrong = answers.length - correct;

    const score = correct; 
    return {
      "EM": "Nộp bài quiz thành công",
      "EC": "0",
      "DT": {
        correct,
        wrong,
        score
      }
    };
    } catch (error) {
    console.error("Lỗi trong submitQuiz service:", error);
    return {
      "EM": "Có lỗi xảy ra trong quá trình nộp bài quiz",
      "EC": "-2",
      "DT": null
    };
  }
};


