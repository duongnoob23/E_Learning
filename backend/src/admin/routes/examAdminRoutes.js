const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const { authorizeByRole } = require("../../middleware/authorizeMiddleware");
const ExamAdminController = require("../controllers/examAdminController");

// ============================================
// ERROR HANDLER WRAPPER với Debug Logging
// ============================================
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    // Tạo custom next để catch errors từ next(error)
    const customNext = (error) => {
      if (error) {
        handleError(error, req, res);
      } else {
        next();
      }
    };

    try {
      await fn(req, res, customNext);
    } catch (error) {
      handleError(error, req, res);
    }
  };
};

// Hàm xử lý lỗi tập trung
const handleError = (error, req, res) => {
  // Log chi tiết lỗi
  const errorInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body,
    user: req.user || null,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      code: error.code,
      statusCode: error.statusCode || error.status || 500,
    },
  };

  // Console log với format đẹp (chỉ trong development)
  if (process.env.NODE_ENV === "development") {
    console.error("\n" + "=".repeat(80));
    console.error("❌ ERROR OCCURRED - Exam Admin API");
    console.error("=".repeat(80));
    console.error(`📍 Endpoint: ${errorInfo.method} ${errorInfo.url}`);
    console.error(`⏰ Timestamp: ${errorInfo.timestamp}`);
    console.error(`👤 User: ${errorInfo.user ? JSON.stringify(errorInfo.user, null, 2) : "Anonymous"}`);
    console.error(`🌐 IP: ${errorInfo.ip}`);
    console.error(`📦 Params:`, JSON.stringify(errorInfo.params, null, 2));
    console.error(`🔍 Query:`, JSON.stringify(errorInfo.query, null, 2));
    console.error(`📝 Body:`, JSON.stringify(errorInfo.body, null, 2));
    console.error(`\n💥 Error Details:`);
    console.error(`   Name: ${errorInfo.error.name}`);
    console.error(`   Message: ${errorInfo.error.message}`);
    console.error(`   Status Code: ${errorInfo.error.statusCode}`);
    if (errorInfo.error.stack) {
      console.error(`\n📚 Stack Trace:`);
      console.error(errorInfo.error.stack);
    }
    console.error("=".repeat(80) + "\n");
  } else {
    // Production: Log ngắn gọn hơn
    console.error(
      `[ERROR] ${errorInfo.method} ${errorInfo.url} - ${errorInfo.error.statusCode} - ${errorInfo.error.message}`
    );
  }

  // Format response đẹp
  const statusCode = error.statusCode || error.status || 500;
  const response = {
    success: false,
    error: {
      message: error.message || "Internal Server Error",
      code: error.code || "INTERNAL_ERROR",
      statusCode: statusCode,
    },
  };

  // Thêm thông tin debug trong development
  if (process.env.NODE_ENV === "development") {
    response.debug = {
      endpoint: `${errorInfo.method} ${errorInfo.url}`,
      timestamp: errorInfo.timestamp,
      errorName: errorInfo.error.name,
      stack: error.stack,
      request: {
        params: errorInfo.params,
        query: errorInfo.query,
        body: errorInfo.body,
      },
    };
  }

  // Đảm bảo response chưa được gửi
  if (!res.headersSent) {
    res.status(statusCode).json(response);
  }
};

// Wrapper tất cả controller functions
const wrapController = (controller) => {
  return asyncHandler(controller);
};

// Admin	Tạo bài thi mới	POST	/api/admin/tests
// Admin	Cập nhật bài thi	PATCH	/api/admin/tests/{test_id}
// Admin	Xóa bài thi	DELETE	/api/admin/tests/{test_id}
// Admin	Thêm Part vào bài thi	POST	/api/admin/tests/{test_id}/parts
// Admin	Thêm câu hỏi	POST	/api/admin/parts/{part_id}/questions
// Admin	Cập nhật câu hỏi	PATCH	/api/admin/questions/{question_id}
// Admin	Xóa câu hỏi	DELETE	/api/admin/questions/{question_id}
// Admin	Lấy danh sách thí sinh đã thi	GET	/api/admin/tests/{test_id}/sessions
// Admin	Xem kết quả chi tiết của user	GET	/api/admin/exam-sessions/{session_id}
// Admin	Xem thống kê bài thi	GET	/api/admin/tests/{test_id}/statistics

// ============================================
// ROUTES - Tất cả đều được wrap với error handler
// ============================================

// GET - Lấy danh sách đề thi
router.get("/tests", wrapController(ExamAdminController.getTests));

// GET - Lấy chi tiết đề thi
router.get("/tests/detail/:test_id", wrapController(ExamAdminController.getTestDetail));

// PATCH - Cập nhật đề thi
router.patch(
  "/tests/:test_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.updateTest)
);

// DELETE - Xóa đề thi
router.delete(
  "/tests/:test_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.deleteTest)
);

// POST - Tạo bài test mới
router.post(
  "/tests",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.createTest)
);

// POST - Tạo toàn bộ bài thi (Test + Parts + Questions + Choices)
router.post(
  "/tests/full",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.createFullExam)
);

// POST - Thêm Part vào bài thi
router.post(
  "/tests/:test_id/parts",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.addPartToTest)
);

// POST - Thêm câu hỏi vào Part
router.post(
  "/parts/:part_id/questions",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.addQuestionToPart)
);

// PATCH - Cập nhật câu hỏi
router.patch(
  "/questions/:question_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.updateQuestion)
);

// DELETE - Xóa câu hỏi
router.delete(
  "/questions/:question_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.deleteQuestion)
);

// GET - Lấy danh sách session của bài thi
router.get(
  "/tests/:test_id/sessions",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.getTestSessions)
);

// GET - Lấy chi tiết session
router.get(
  "/exam-sessions/:session_id",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.getExamSessionDetail)
);

// GET - Xem thống kê bài thi
router.get(
  "/tests/:test_id/statistics",
  authMiddleware,
  authorizeByRole(["admin", "teacher"]),
  wrapController(ExamAdminController.getTestStatistics)
);

module.exports = router;
