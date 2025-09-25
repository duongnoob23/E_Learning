const wordClientService = require("../services/wordClientService");



// [GET] Words hệ thống theo topic + tìm kiếm
exports.getWordsByTopic = async (req, res, next) => {
  try {
    const { topicId, page, limit } = req.query;
    const result = await wordClientService.getWordsByTopic({
      topicId,
      page,
      limit,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] User words theo cas nhan
exports.getWordsbyUser = async (req, res, next) => {
  try{
    const topicId = req.params.topicId;
    const { page, limit } = req.query;
    const result = await wordClientService.getWordsbyUser({
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
    const { 
    word, 
    partOfSpeech, 
    pronunciation, 
    meaningVi, 
    exampleEn, 
    exampleVi, 
    imageUrl, 
    fromSystemWordId,
    userId,
    topicId
  } = req.body;

  const result = await wordClientService.postWordToUser({
    user_id: userId,
    topic_id: topicId,
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

// [GET] Lấy danh sách topics cho phần khám phá
exports.getExploreTopics = async (req, res, next) => {
  try {
    const { page, limit, search, topic_type } = req.query;
    const result = await wordClientService.getExploreTopics({
      page,
      limit,
      search,
      topic_type
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách topics của user (List từ của tôi)
exports.getUserTopics = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const userId = req.user?.userId; // Lấy từ JWT token
    
    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await wordClientService.getUserTopics({
      userId,
      page,
      limit,
      search
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Tạo topic mới
exports.createTopic = async (req, res, next) => {
  try {
    const { topic_name, description, topic_type, is_public, is_active, word_count } = req.body;
    const userId = req.user?.userId; // Lấy từ JWT token
    
    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await wordClientService.createTopic({
      topic_name,
      description,
      topic_type: topic_type || 'user_created',
      is_public: is_public !== undefined ? is_public : true,
      is_active: is_active !== undefined ? is_active : true,
      word_count: word_count || 0,
      created_by: userId
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [PUT] Cập nhật topic
exports.updateTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const { topic_name, description, is_public } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await wordClientService.updateTopic({
      topicId,
      topic_name,
      description,
      is_public,
      userId
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [DELETE] Xóa topic
exports.deleteTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await wordClientService.deleteTopic({
      topicId,
      userId
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Thêm từ vào topic
exports.addWordToTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const { 
      word, 
      part_of_speech, 
      pronunciation, 
      meaning_vi, 
      example_en, 
      example_vi, 
      image_url, 
      notes, 
      word_type 
    } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    if (!word || !meaning_vi) {
      return res.status(400).json({
        EM: "Từ và nghĩa tiếng Việt là bắt buộc",
        EC: "2",
        DT: null
      });
    }

    const result = await wordClientService.addWordToTopic({
      topicId,
      word,
      part_of_speech: part_of_speech || 'noun',
      pronunciation,
      meaning_vi,
      example_en,
      example_vi,
      image_url,
      notes,
      word_type: word_type || 'user_created',
      created_by: userId
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách words theo topic_id
exports.getWordsByTopicId = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const { page, limit, search } = req.query;
    
    const result = await wordClientService.getWordsByTopicId({
      topic_id: topicId,
      page,
      limit,
      search
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};
