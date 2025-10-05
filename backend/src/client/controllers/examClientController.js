const examClientService = require("../services/examClientService");

// Lấy danh sách bài thi
exports.getExams = async (req, res, next) => {
  try {
    const response = await examClientService.getExams();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết bài thi
exports.getTestDetail = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { userId } = req.user;
    const response = await examClientService.getTestDetail(testId, userId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
 
// Lấy kết quả bài thi
exports.getResults = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { userId } = req.user;
    let parts = req.query.part;
    if (parts) {
      if (!Array.isArray(parts)) {
        parts = [parts]; 
      }
      parts = parts.map(Number); 
    }
    const response = await examClientService.getResults(userId, testId, parts);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Lấy bài luyện tập
exports.getPracticeTests = async (req, res, next) => {
  try {
    const testId = req.params.testId;
    const parts = req.query.parts; // [ '729', '730', '731' ]
    const response = await examClientService.getPracticeTests(testId, parts);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Bắt đầu làm bài thi
exports.startTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const response = await examClientService.startTest(testId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Nộp bài thi
exports.submitTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { userId } = req.user;
    const { answers } = req.body;
    const response = await examClientService.submitTest(testId, answers);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Nộp bài luyện tập
exports.submitPracticeTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { userId } = req.user;
    const { answers } = req.body;
    const response = await examClientService.submitPracticeTest(testId, userId, answers);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
