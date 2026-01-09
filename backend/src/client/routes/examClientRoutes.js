const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../../middleware/authMiddleware");
const { authorizeByRole } = require("../../middleware/authorizeMiddleware");
const speakingValidator = require("../validators/speakingWritingValidator");
const ExamClientController = require("../controllers/examClientController");

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../../uploads/speaking_audio");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log("📁 Multer destination:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log(
      "📝 Multer filename:",
      filename,
      "Original:",
      file.originalname
    );
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/mpeg",
      "audio/mp3",
      "audio/mp4",
      "audio/m4a",
      "audio/webm",
      "audio/ogg",
    ];
    console.log("🔍 File filter check:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
        ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
        : "unknown",
      isAllowed: allowedMimes.includes(file.mimetype),
    });
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error(
        "❌ Invalid file type:",
        file.mimetype,
        "for file:",
        file.originalname
      );
      cb(new Error("Invalid audio format"));
    }
  },
});

// ------------ Listening and Reading Routes ------------ //
// Test Routes
router.get(
  "/tests",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getTests
);
router.get(
  "/tests/:test_id",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getTestDetail
);
router.get(
  "/tests/:test_id/parts",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getTestParts
);
router.get(
  "/tests/:test_id/result",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getPracticeTestResult
);
// Part Routes
router.get(
  "/parts/:part_id/questions",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getPartQuestions
);
// Exam Session Routes
router.post(
  "/exam-sessions/start",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.startExamSession
);
router.post(
  "/exam-sessions/:session_id/submit",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.submitExamSession
);
router.get(
  "/exam-sessions/:session_id/result",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getExamResult
);
router.get(
  "/exam-sessions/:session_id/review",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.reviewExamSession
);
router.post(
  "/exam-sessions/:session_id/retry-wrong",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.retryWrongAnswers
);
router.get(
  "/user/statistics",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getUserStatistics
);

router.get(
  "/exam-sessions/:session_id/result-by-tags",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getResultByTags
); // New

// Update exam session (for writing completion)
router.patch(
  "/exam-sessions/:session_id/update",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.updateExamSession
);

// ========== REDIS CACHE APIs ==========
// Auto-save đáp án vào cache
router.post(
  "/exam-sessions/:session_id/auto-save",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.autoSaveAnswer
);

// Restore đáp án từ cache
router.get(
  "/exam-sessions/:session_id/restore",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.restoreAnswers
);

// Hủy phiên thi
router.post(
  "/exam-sessions/:session_id/cancel",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.cancelExamSession
);

// Lấy tất cả active sessions
router.get(
  "/exam-sessions/active",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getAllActiveSessions
);

// Debug: Kiểm tra Redis cache (chỉ dùng để debug)
router.get(
  "/exam-sessions/:session_id/debug-cache",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.debugCache
);

// Discussion Routes
router.get(
  "/discussions/test/:test_id",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.getTestDiscussions
);
router.post(
  "/discussions",
  authMiddleware,
  authorizeByRole("student"),
  ExamClientController.createDiscussion
);
router.post(
  "/discussions/:discussion_id/comments",
  authMiddleware,
  ExamClientController.addComment
);

// ------------ Speaking and Writing Routes ------------ //

// Speaking Routes
router.post(
  "/speaking/upload",
  authMiddleware,
  upload.single("audio_file"),
  speakingValidator.validateAudioFile,
  speakingValidator.handleValidationErrors,
  ExamClientController.uploadSpeakingAudio
);

router.get(
  "/speaking/session/:session_id/responses",
  authMiddleware,
  ExamClientController.getSessionSpeakingResponses
);

router.post(
  "/llmservice/score",
  authMiddleware,
  ExamClientController.gradeExam
);

// Writing Routes
router.post(
  "/writing/submit",
  authMiddleware,
  ExamClientController.submitWritingText
);

router.get(
  "/writing/session/:session_id/responses",
  authMiddleware,
  ExamClientController.getSessionWritingResponses
);

module.exports = router;
