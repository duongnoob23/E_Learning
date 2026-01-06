const examAdminService = require("../services/examAdminService");

// Lấy danh sách đề thi
exports.getTests = async (req, res, next) => {
  try {
    const response = await examAdminService.getTest();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết đề thi
exports.getTestDetail = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const response = await examAdminService.getTestDetail(test_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Tạo đề thi
exports.createTest = async (req, res, next) => {
  try {
    const {
      title,
      duration,
      description,
      total_questions,
      total_parts,
      difficulty_level,
      exam_type,
      category_ids,
    } = req.body;
    const created_by = req.user?.user_id || null;
    const response = await examAdminService.createTest({
      title,
      duration,
      description,
      total_questions,
      total_parts,
      difficulty_level,
      exam_type,
      category_ids,
      created_by,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Tạo toàn bộ bài thi (Test + Parts + Questions + Choices)
exports.createFullExam = async (req, res, next) => {
  try {
    const { testInfo, parts } = req.body;
    const created_by = req.user?.user_id || null;

    // Validation
    if (!testInfo || !testInfo.title) {
      return res.status(400).json({
        EM: "Thông tin bài thi không hợp lệ",
        EC: "-1",
        DT: null,
      });
    }

    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({
        EM: "Phải có ít nhất 1 Part",
        EC: "-1",
        DT: null,
      });
    }

    const response = await examAdminService.createFullExam({
      testInfo,
      parts,
      created_by,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Cập nhật đề thi
exports.updateTest = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const { title, duration, description } = req.body;
    const response = await examAdminService.updateTest(test_id, {
      title,
      duration,
      description,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Xóa đề thi
exports.deleteTest = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const response = await examAdminService.deleteTest(test_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Thêm part vào đề thi
exports.addPartToTest = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const {
      part_name,
      part_type,
      part_number,
      question_count,
      duration_minutes,
      description,
      display_template,
    } = req.body;
    const response = await examAdminService.addPartToTest(test_id, {
      part_name,
      part_type,
      part_number,
      question_count,
      duration_minutes,
      description,
      display_template,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Thêm câu hỏi vào part và thêm choice vào câu hỏi
exports.addQuestionToPart = async (req, res, next) => {
  try {
    const { part_id } = req.params;
    const { questions } = req.body;

    const response = await examAdminService.addMultipleQuestionsToPart(
      part_id,
      questions
    );
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Cập nhật câu hỏi
exports.updateQuestion = async (req, res, next) => {
  try {
    const { question_id } = req.params;
    const {
      question_text,
      question_type,
      audio_file,
      image_file,
      transcript,
      explanation,
      grammar_notes,
    } = req.body;
    const response = await examAdminService.updateQuestion(question_id, {
      question_text,
      question_type,
      audio_file,
      image_file,
      transcript,
      explanation,
      grammar_notes,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Xóa câu hỏi
exports.deleteQuestion = async (req, res, next) => {
  try {
    const { question_id } = req.params;
    const response = await examAdminService.deleteQuestion(question_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Danh sách session của người dùng (user_id, score, duration)
exports.getTestSessions = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const response = await examAdminService.getTestSessions(test_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Lấy thông tin chi tiết của session (user_id, score, duration, answers, part_statistics)
exports.getExamSessionDetail = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const response = await examAdminService.getExamSessionDetail(session_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Xem thống kê bài thi
exports.getTestStatistics = async (req, res, next) => {
  try {
    const { test_id } = req.params;
    const response = await examAdminService.getTestStatistics(test_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
