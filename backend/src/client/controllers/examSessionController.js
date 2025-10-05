const examSessionService = require('../services/examSessionService');

// [POST] Bắt đầu luyện tập (chọn sections cụ thể)
exports.startPracticeSession = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { sectionIds, timeLimit } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    if (!sectionIds || !Array.isArray(sectionIds) || sectionIds.length === 0) {
      return res.status(400).json({
        EM: "Vui lòng chọn ít nhất một phần thi",
        EC: "2",
        DT: null
      });
    }

    const result = await examSessionService.startPracticeSession({
      testId,
      userId,
      sectionIds,
      timeLimit
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Bắt đầu làm full test
exports.startFullTestSession = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await examSessionService.startFullTestSession({
      testId,
      userId
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy câu hỏi cho session
exports.getSessionQuestions = async (req, res, next) => {
  try {
    const { userTestId } = req.params;
    const { sectionIds } = req.query;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const parsedSectionIds = sectionIds ? sectionIds.split(',').map(id => parseInt(id)) : null;

    const result = await examSessionService.getSessionQuestions({
      userTestId,
      userId,
      sectionIds: parsedSectionIds
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Lưu câu trả lời
exports.saveAnswer = async (req, res, next) => {
  try {
    const { userTestId, questionId } = req.params;
    const { answer_text, choice_id, is_draft } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await examSessionService.saveAnswer({
      userTestId,
      userId,
      questionId,
      answerData: {
        answer_text,
        choice_id,
        is_draft
      }
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Submit bài thi
exports.submitSession = async (req, res, next) => {
  try {
    const { userTestId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await examSessionService.submitSession({
      userTestId,
      userId
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy kết quả bài thi
exports.getSessionResult = async (req, res, next) => {
  try {
    const { userTestId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const result = await examSessionService.getSessionResult({
      userTestId,
      userId
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [PUT] Lưu tiến độ (auto-save)
exports.saveProgress = async (req, res, next) => {
  try {
    const { userTestId } = req.params;
    const { remainingTime, currentQuestionId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    // Cập nhật remaining time và current question
    const { UserTest } = require('../../models');
    
    await UserTest.updateUserTest(userTestId, {
      remaining_time: remainingTime,
      last_saved_at: new Date()
    });

    res.json({
      EM: "Lưu tiến độ thành công",
      EC: "0",
      DT: null
    });
  } catch (error) {
    next(error);
  }
};

// [POST] Bỏ dở bài thi
exports.abandonSession = async (req, res, next) => {
  try {
    const { userTestId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        EM: "Chưa đăng nhập",
        EC: "1",
        DT: null
      });
    }

    const { UserTest } = require('../../models');
    
    await UserTest.updateUserTest(userTestId, {
      status: 'abandoned',
      last_saved_at: new Date()
    });

    res.json({
      EM: "Bỏ dở bài thi thành công",
      EC: "0",
      DT: null
    });
  } catch (error) {
    next(error);
  }
};
