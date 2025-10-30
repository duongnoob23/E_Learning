const examClientService = require("../services/examClientService");
const { TestDiscussion } = require('../../models');

// GET /api/tests - Lấy danh sách đề thi
exports.getTests = async (req, res, next) => {
  try {
    const { exam_type, difficulty_level, page, limit } = req.query;
    const response = await examClientService.getTests({
      exam_type,
      difficulty_level,
      page,
      limit,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET /api/tests/{test_id} - Lấy chi tiết đề thi
exports.getTestDetail = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const response = await examClientService.getTestDetail(test_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET /api/tests/{test_id}/parts - Lấy danh sách parts của đề thi
exports.getTestParts = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const response = await examClientService.getTestParts(test_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET /api/tests/{test_id}/result - Lấy kết quả thi của đề thi
exports.getPracticeTestResult = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const user_id = req.user.userId;
    const response = await examClientService.getPracticeTestResult(
      test_id,
      user_id
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};
// GET /api/parts/{part_id}/questions - Lấy danh sách câu hỏi của part
exports.getPartQuestions = async (req, res, next) => {
  try {
    const { part_id } = req.params;
    const response = await examClientService.getPartQuestions(part_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// POST /api/exam-sessions/start - Bắt đầu phiên thi
exports.startExamSession = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { test_id, session_type, selected_parts, time_limit_minutes } =
      req.body;
    const response = await examClientService.startExamSession({
      user_id,
      test_id,
      session_type,
      selected_parts,
      time_limit_minutes,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// POST /api/exam-sessions/{session_id}/submit - Nộp bài thi
exports.submitExamSession = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.userId;
    const { answers, examId } = req.body;
    console.log(user_id, answers, examId);
    const response = await examClientService.submitExamSession(
      session_id,
      user_id,
      answers,
      examId
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET /api/exam-sessions/{session_id}/result - Lấy kết quả thi
exports.getExamResult = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.userId;
    const response = await examClientService.getExamResult(session_id, user_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET /api/exam-sessions/{session_id}/review - Xem lại bài thi
exports.reviewExamSession = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.userId;
    const response = await examClientService.reviewExamSession(
      session_id,
      user_id
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// POST /api/exam-sessions/{session_id}/retry-wrong - Làm lại câu sai
exports.retryWrongAnswers = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.userId;
    console.log("🚀 ~ retryWrongAnswers ~ user_id:", user_id);
    const response = await examClientService.retryWrongAnswers(
      session_id,
      user_id
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET /api/user/statistics - Lấy thống kê người dùng
exports.getUserStatistics = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const response = await examClientService.getUserStatistics(user_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET /api/discussions/test/{test_id} - Lấy thảo luận của đề thi
exports.getTestDiscussions = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const { page, limit } = req.query;
    const response = await examClientService.getTestDiscussions(test_id, {
      page,
      limit,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// POST /api/discussions - Tạo thảo luận mới (REST API fallback)
exports.createDiscussion = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { test_id, title, content } = req.body;
    const response = await examClientService.createDiscussion({
      test_id,
      user_id,
      title,
      content,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// POST /api/discussions/{discussion_id}/comments - Thêm bình luận (REST API fallback)
exports.addComment = async (req, res, next) => {
  try {
    const { discussion_id } = req.params;
    const user_id = req.user.userId;
    const { content, parent_comment_id } = req.body;
    const response = await examClientService.addComment({
      test_discussion_id: discussion_id,
      user_id,
      content,
      parent_comment_id,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};



// --------- Speaking Routes --------- //
// POST /api/speaking/upload - Tải lên tệp âm thanh speaking
exports.uploadSpeakingAudio = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { session_id, question_id, language } = req.body;
    const audio_file_path = req.file.path;

    console.log("=== uploadSpeakingAudio ===");
    console.log("File path from multer:", audio_file_path);
    console.log("File info:", {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const response = await examClientService.uploadSpeakingAudio({
      user_id,
      session_id,
      question_id,
      audio_file_path,
      language
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET /api/speaking/session/{session_id}/responses - Lấy danh sách phản hồi speaking của phiên thi
exports.getSessionSpeakingResponses = async (req, res, next) => {
  try {
        const user_id = req.user.userId;
        const { text, type, language } = req.body;

        const response = await examClientService.scoreResponse({
            user_id,
            text,
            type,
            language
        });

        res.json(response);
    } catch (error) {
        next(error);
    }
};

// POST /api/llmservice/score - Chấm điểm speaking/writing response
exports.gradeExam = async (req, res, next) => {
    try {
        const {response_id, type, text, language } = req.body;
        const user_id = req.user.userId;

        let response;
        if (type === "WRITING") {
            response = await examClientService.gradeWriting({response_id, user_id, text, language });
        } else if (type === "SPEAKING") {
            response = await examClientService.gradeSpeaking({response_id, user_id, text, language });
        } else {
            return res.status(400).json({ EM: "Loại bài không hợp lệ", EC: "-1", DT: null });
        }

        res.json(response);
    } catch (error) {
        next(error);
    }
};
