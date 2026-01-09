const wordClientService = require("../services/wordClientService");
// [GET] Words hệ thống theo topic + tìm kiếm
exports.getWordsByTopic = async (req, res, next) => {
  try {
    const { topicId, q, page, limit } = req.query;
    const result = await wordClientService.getWordsByTopic({
      topicId: topicId ? parseInt(topicId) : undefined,
      q,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Topic
exports.getTopicPublic = async (req, res, next) => {
  try {

    const result = await wordClientService.getTopicPublic();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Chi tiết word theo id
exports.getWordDetail = async (req, res, next) => {
  try {
    const { word_id } = req.params;
    const result = await wordClientService.getWordDetail(word_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// [GET] Tìm từ theo tên
exports.findWordByName = async (req, res, next) => {
  try {
    const { word } = req.query;
    const result = await wordClientService.findWordByName(word);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// [GET] User words theo cas nhan
exports.getWordsByUser = async (req, res, next) => {
  try{
    const topicId = req.params.topicId;
    const userId = req.user.userId;
    const { page, limit } = req.query;
    const result = await wordClientService.getWordsbyUser({
      userId,
      topicId,
      page,
      limit,
    });
    res.json(result);
  }catch(error){
    next(error);
  }

};

// [POST] Thêm từ cá nhân
exports.postWordToUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let  {word, meaning_vi, topic_id, meaning, example_en, example_vi, example = null, partOfSpeech = null, pronunciation = null, imageUrl = null, fromSystemWordId = null, notes = null } = req.body;
    word = word.trim().toLowerCase();

    // Support both camelCase and snake_case
    const finalMeaningVi = meaning_vi || meaning;
    const finalTopicId =  topic_id;
    const finalExampleEn = example_en || example;
    const finalExampleVi = example_vi || null;

    const result = await wordClientService.postWordToUser({
      user_id: userId,
      topic_id: finalTopicId,
      word,
      meaning_vi: finalMeaningVi,
      example_en: finalExampleEn,
      example_vi: finalExampleVi,
      part_of_speech: partOfSpeech,
      pronunciation,
      image_url: imageUrl,
      from_system_word_id: fromSystemWordId,
      notes,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [PATCH] sủa từ vựng cá nhân
exports.patchWordToUser = async (req, res, next) => {
  try {
    const userWordId = req.params.user_word_id;
    const { 
      word, 
      partOfSpeech, 
      pronunciation, 
      meaningVi, 
      exampleEn, 
      exampleVi, 
      imageUrl, 
      fromSystemWordId,
    } = req.body;

    const result = await wordClientService.patchWordToUser({
      user_word_id: userWordId,
      word,
      part_of_speech: partOfSpeech,
      pronunciation,
      meaning_vi: meaningVi,
      example_en: exampleEn,
      example_vi: exampleVi,
      image_url: imageUrl || null,
      from_system_word_id: fromSystemWordId,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [PATCH] xóa từ vựng cá nhân
exports.deleteWordToUser = async (req, res, next) => {
  try {
    const userWordId = req.params.user_word_id;
    const result = await wordClientService.deleteWordToUser(userWordId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] đánh dấu đã học
exports.markLearned = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { word_id, topic_id } = req.body;
    const result = await wordClientService.markLearned(userId, word_id, topic_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] đánh dấu chưa học
exports.unmarkLearned = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { word_id, topic_id } = req.body;
    const result = await wordClientService.unmarkLearned(userId, word_id, topic_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// ---------- Flashcard Routes ---------- //

// [GET] Lấy danh sách topic của user
exports.getTopicByUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await wordClientService.getTopicByUser(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Tạo set
exports.createSet = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { topic_name, description, image_url, logo_url } = req.body;
    const result = await wordClientService.createSet(
      userId, 
      topic_name, 
      description, 
      image_url, 
      logo_url
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Chi tiết set theo id
exports.getSetDetail = async (req, res, next) => {
  try {
    const set_id = req.params.set_id;
    const result = await wordClientService.getSetDetail(set_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách từ vựng trong set theo id
exports.getWordsBySet = async (req, res, next) => {
  try {
    const set_id = req.params.set_id;
    const userId = req.user?.userId || req.user?.user_id; // Lấy user_id từ authenticated user (support cả userId và user_id)
    const { page = 1, limit = 50 } = req.query; // Thêm pagination params
    
    // Debug log
    console.log(`[getWordsBySet Controller] set_id: ${set_id}, userId: ${userId}, page: ${page}, limit: ${limit}`);
    
    const result = await wordClientService.getWordsBySet(set_id, userId, {
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    // Debug log response
    console.log(`[getWordsBySet Controller] Response EC: ${result.EC}, DT length: ${result.DT?.length || 0}`);
    
    res.json(result);
  } catch (error) {
    console.error("[getWordsBySet Controller] Error:", error);
    next(error);
  }
};


// [GET] Lấy flashcard tiếp theo
exports.getNextFlashcard = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { set_id } = req.query;
    const result = await wordClientService.getNextFlashcard(userId, set_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


//---- SRS (SPACED REPETITION) ----//

// [GET] Lấy danh sách từ vựng hôm nay
exports.getTodayWords = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await wordClientService.getTodayWords(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
// [GET] Lấy từ vựng tiếp theo
exports.getNextWord = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await wordClientService.getNextWord(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Gửi feedback cho từ vựng
exports.submitFeedback = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const word_id = req.params.word_id;
    const { feedback } = req.body;
    const result = await wordClientService.submitFeedback(userId, word_id, feedback);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


//---- PROGRESS (TIẾN ĐỘ HỌC) ----//

// [GET] Tổng quan tiến độ học
exports.getOverview = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await wordClientService.getOverview(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Tiến độ học theo chủ đề
exports.getProgressByTopic = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const topicId = req.params.topic_id;
    const result = await wordClientService.getProgressByTopic(userId, topicId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Tiến độ học theo ngày
exports.getDailyProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await wordClientService.getDailyProgress(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


/**
 * =============================
 *  PRACTICE (QUIZ)
 * =============================
 */

// [GET] Tạo quiz
exports.getVocabQuiz = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { topic_id } = req.query;

    if (!userId || !topic_id) {
      return res.status(400).json({
        EM: "Thiếu userId hoặc topic_id",
        EC: "-1",
        DT: null
      });
    }

    const data = await wordClientService.generateQuiz(userId, topic_id);
    return res.json(data);

  } catch (err) {
    next(err);
  }
};

exports.submitVocabQuiz = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { answers } = req.body;

    const data = await wordClientService.submitQuiz(userId, answers);
    return res.json(data);

  } catch (err) {
    next(err);
  }
};

/**
 * =============================
 *  PRONUNCIATION ASSESSMENT
 * =============================
 */

// [POST] Chấm điểm phát âm
exports.assessPronunciation = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { word_id } = req.body;
    const audioFile = req.file;

    if (!word_id || !audioFile) {
      return res.status(400).json({
        EM: "Thiếu word_id hoặc audio file",
        EC: "-1",
        DT: null
      });
    }

    // Tạo object audioFile với thông tin cần thiết
    const audioFileData = {
      path: audioFile.path,
      filename: audioFile.filename,
      mimetype: audioFile.mimetype,
      size: audioFile.size,
      url: `/uploads/audio/${audioFile.filename}`
    };

    const data = await wordClientService.assessPronunciation(
      userId,
      word_id,
      audioFileData
    );

    return res.json(data);
  } catch (err) {
    next(err);
  }
};

// [GET] Lấy lịch sử chấm điểm phát âm
exports.getPronunciationHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { word_id } = req.params;

    if (!word_id) {
      return res.status(400).json({
        EM: "Thiếu word_id",
        EC: "-1",
        DT: null
      });
    }

    const data = await wordClientService.getPronunciationHistory(userId, word_id);
    return res.json(data);
  } catch (err) {
    next(err);
  }
};

// [GET] Lấy thống kê phát âm
exports.getPronunciationStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { topic_id } = req.query;

    const data = await wordClientService.getPronunciationStats(userId, topic_id);
    return res.json(data);
  } catch (err) {
    next(err);
  }
};
