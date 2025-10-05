const examDetailService = require('../services/examDetailService');
const { Test } = require('../../models');

// [GET] Lấy thông tin chi tiết exam với sections và user test status
exports.getExamDetail = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const userId = req.user?.userId; // Optional - có thể không đăng nhập vẫn xem được

    if (!testId) {
      return res.status(400).json({
        EM: "Test ID là bắt buộc",
        EC: "2",
        DT: null
      });
    }

    const result = await examDetailService.getExamDetail({
      testId,
      userId
    });
    res.json(result);
  } catch (error) {
    console.error('Error in getExamDetail controller:', error);
    next(error);
  }
};


// [POST] Bắt đầu làm bài
exports.startExam = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { sessionId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    if (!testId) {
      return res.status(400).json({
        EM: "Test ID là bắt buộc",
        EC: "2",
        DT: null
      });
    }

    const result = await examDetailService.startExam({
      testId,
      userId,
      sessionId
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [PUT] Lưu tiến độ làm bài
exports.saveExamProgress = async (req, res, next) => {
  try {
    const { userTestId, remainingTime, currentSection, answers } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    if (!userTestId) {
      return res.status(400).json({
        EM: "User Test ID là bắt buộc",
        EC: "2",
        DT: null
      });
    }

    const result = await examDetailService.saveExamProgress({
      userTestId,
      remainingTime,
      currentSection,
      answers
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Nộp bài
exports.submitExam = async (req, res, next) => {
  try {
    const { userTestId, score, answers } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    if (!userTestId) {
      return res.status(400).json({
        EM: "User Test ID là bắt buộc",
        EC: "2",
        DT: null
      });
    }

    const result = await examDetailService.submitExam({
      userTestId,
      score,
      answers
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Bỏ dở bài thi
exports.abandonExam = async (req, res, next) => {
  try {
    const { userTestId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    if (!userTestId) {
      return res.status(400).json({
        EM: "User Test ID là bắt buộc",
        EC: "2",
        DT: null
      });
    }

    const result = await examDetailService.abandonExam({
      userTestId
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy lịch sử làm bài của user
exports.getUserExamHistory = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { page, limit, status, test_type } = req.query;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await examDetailService.getUserExamHistory({
      userId,
      page,
      limit,
      status,
      test_type
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};
