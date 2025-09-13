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


