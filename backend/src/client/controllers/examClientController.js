const examClientService = require("../services/examClientService");
const { TestDiscussion } = require("../../models");
const { transcribeAudio } = require("../services/whisperService");

// Helper function để log lỗi
const logError = (functionName, error, context = {}) => {
  console.error(`[EXAM_CONTROLLER] ${functionName} | ${error.message}`);
  if (Object.keys(context).length > 0) {
    console.error("Context:", context);
  }
};

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
    console.log("🚀 ~ user_id:", user_id);

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

exports.getResultByTags = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.userId;
    const response = await examClientService.getResultByTags(
      session_id,
      user_id
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// --------- Speaking Routes --------- //
// POST /api/speaking/upload - Tải lên tệp âm thanh speaking
exports.uploadSpeakingAudio = async (req, res, next) => {
  const startTime = Date.now();
  try {
    console.log("=== uploadSpeakingAudio Controller ===");
    console.log("Request received at:", new Date().toISOString());
    console.log("Request headers:", {
      "content-type": req.headers["content-type"],
      "content-length": req.headers["content-length"],
      authorization: req.headers["authorization"] ? "Present" : "Missing",
    });

    const user_id = req.user.userId;
    const { session_id, question_id, language } = req.body;

    console.log("Form data:", { session_id, question_id, language });
    console.log(
      "File info:",
      req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            size: req.file.size,
            size_mb: (req.file.size / (1024 * 1024)).toFixed(2) + " MB",
            destination: req.file.destination,
            filename: req.file.filename,
            path: req.file.path,
          }
        : "NO FILE RECEIVED"
    );

    if (!req.file) {
      console.error("❌ No file received in request");
      return res.status(400).json({
        EM: "Không có file audio được upload",
        EC: "-1",
        DT: null,
      });
    }

    const audio_file_path = req.file.path;
    const uploadDuration = Date.now() - startTime;
    console.log(
      `✅ File uploaded successfully in ${uploadDuration}ms (${(uploadDuration / 1000).toFixed(2)}s)`
    );
    console.log("File path from multer:", audio_file_path);

    // Transcribe audio
    console.log("🔄 Starting transcription...");
    const transcribeStartTime = Date.now();
    let transcription = "";
    try {
      transcription = await transcribeAudio(audio_file_path, language);
      const transcribeDuration = Date.now() - transcribeStartTime;
      console.log(
        `✅ Transcription completed in ${transcribeDuration}ms (${(transcribeDuration / 1000).toFixed(2)}s)`
      );
      console.log(
        "Transcription preview:",
        transcription.substring(0, 100) + "..."
      );
    } catch (transcribeError) {
      const transcribeDuration = Date.now() - transcribeStartTime;
      console.error(
        `❌ Transcription failed after ${transcribeDuration}ms:`,
        transcribeError.message
      );
      logError("uploadSpeakingAudio.transcribe", transcribeError, {
        audio_file_path,
        language,
      });
      return res.status(500).json({
        EM: `Lỗi xử lý âm thanh: ${transcribeError.message}`,
        EC: "-3",
        DT: null,
      });
    }

    // Create response
    console.log("💾 Creating SpeakingResponse in database...");
    const dbStartTime = Date.now();
    const response = await examClientService.uploadSpeakingAudio({
      user_id,
      session_id,
      question_id,
      audio_file_path,
      language,
    });
    const dbDuration = Date.now() - dbStartTime;
    console.log(`✅ Database operation completed in ${dbDuration}ms`);

    const totalDuration = Date.now() - startTime;
    console.log(
      `✅ Total request time: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`
    );
    console.log("Response:", {
      EM: response.EM,
      EC: response.EC,
      response_id: response.DT?.response_id,
    });

    res.json(response);
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ Error after ${totalDuration}ms:`, error);
    next(error);
  }
};

// GET /api/speaking/session/{session_id}/responses - Lấy danh sách phản hồi speaking của phiên thi
exports.getSessionSpeakingResponses = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { status, page, limit } = req.query;

    const response = await examClientService.getSessionSpeakingResponses(
      session_id,
      { status, page, limit }
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// POST /api/llmservice/score - Chấm điểm speaking response using MultiPA
exports.gradeExam = async (req, res, next) => {
  try {
    const { response_id, type, audio_file_path, text, language } = req.body;
    const user_id = req.user.userId;

    console.log("=== gradeExam Controller ===");
    console.log("Request body:", {
      response_id,
      type,
      audio_file_path: audio_file_path
        ? audio_file_path.substring(0, 50) + "..."
        : null,
      text: text ? text.substring(0, 100) + "..." : null,
      language,
    });
    console.log("User ID:", user_id);

    if (!response_id || !type) {
      console.log("❌ Validation failed - Missing response_id or type");
      return res.status(400).json({
        EM: "Thiếu thông tin: response_id, type",
        EC: "-1",
        DT: null,
      });
    }

    let response;
    if (type === "WRITING") {
      if (!text) {
        console.log("❌ Validation failed - Missing text for WRITING");
        return res.status(400).json({
          EM: "Thiếu text cho WRITING type",
          EC: "-1",
          DT: null,
        });
      }
      console.log("📝 Grading WRITING response...");
      response = await examClientService.gradeWriting({
        response_id,
        user_id,
        text,
        language,
      });
    } else if (type === "SPEAKING") {
      if (!audio_file_path) {
        console.log(
          "❌ Validation failed - Missing audio_file_path for SPEAKING"
        );
        return res.status(400).json({
          EM: "Thiếu audio_file_path cho SPEAKING type",
          EC: "-1",
          DT: null,
        });
      }
      console.log("🎤 Grading SPEAKING response...");
      response = await examClientService.gradeSpeaking({
        response_id,
        user_id,
        audio_file_path,
        language,
      });
    } else {
      console.log("❌ Invalid type:", type);
      return res.status(400).json({
        EM: "Loại bài không hợp lệ (SPEAKING/WRITING)",
        EC: "-1",
        DT: null,
      });
    }

    console.log("Response:", {
      EM: response.EM,
      EC: response.EC,
      score: response.DT?.score,
    });
    res.json(response);
  } catch (error) {
    console.error("❌ Error in gradeExam controller:", error);
    next(error);
  }
};

// --------- Writing Routes --------- //
// POST /api/writing/submit - Lưu bài viết writing
exports.submitWritingText = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { session_id, question_id, written_text, language } = req.body;

    console.log("=== submitWritingText Controller ===");
    console.log("Request body:", {
      session_id,
      question_id,
      written_text: written_text?.substring(0, 50) + "...",
      language,
    });
    console.log("User ID:", user_id);

    if (!session_id || !question_id || !written_text) {
      console.log("❌ Validation failed - Missing required fields");
      return res.status(400).json({
        EM: "Thiếu thông tin: session_id, question_id, written_text",
        EC: "-1",
        DT: null,
      });
    }

    const response = await examClientService.submitWritingText({
      user_id,
      session_id,
      question_id,
      written_text,
      language,
    });

    console.log("Response:", { EM: response.EM, EC: response.EC });
    res.json(response);
  } catch (error) {
    console.error("❌ Error in submitWritingText controller:", error);
    next(error);
  }
};

// GET /api/writing/session/{session_id}/responses - Lấy danh sách phản hồi writing của phiên thi
exports.getSessionWritingResponses = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { status, page, limit } = req.query;

    const response = await examClientService.getSessionWritingResponses(
      session_id,
      { status, page, limit }
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/exam-sessions/:session_id/update - Cập nhật exam session (cho writing)
exports.updateExamSession = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.userId;
    const { status, total_score, correct_answers, wrong_answers } = req.body;

    console.log("=== updateExamSession ===");
    console.log("Session ID:", session_id);
    console.log("User ID:", user_id);
    console.log("Update data:", {
      status,
      total_score,
      correct_answers,
      wrong_answers,
    });

    const result = await examClientService.updateExamSession({
      session_id: parseInt(session_id),
      user_id,
      status,
      total_score,
      correct_answers,
      wrong_answers,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};
