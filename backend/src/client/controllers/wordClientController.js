const wordClientService = require("../services/wordClientService");


// [GET] Lấy danh sách từ vựng
exports.getWord = async (req, res, next) => {
  try {
    const response = await wordClientService.getWord();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách chủ đề
exports.getTopic = async (req, res, next) => {
  try {
    const response = await wordClientService.getTopic();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy danh sách từ vựng theo chủ đề
exports.getWordByTopic = async (req, res, next) => {
  try {
    const response = await wordClientService.getWordByTopic(req.params.topic_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};