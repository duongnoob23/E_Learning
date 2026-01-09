// D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce\frontend\Shopery\src\Client\api\Assessment\assessmentApi.jsx
import axiosInstance from "../../../lib/axiosInstance";

export const assessmentApi = {
  // GET /api/tests - Lấy danh sách đề thi - DONE
  getTests: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    const response = await axiosInstance.get(
      `/exam/tests?${params.toString()}`
    );
    return response.data;
  },

  // GET /api/tests/{test_id} - Lấy chi tiết đề thi - DONE
  getTestDetail: async (testId) => {
    const response = await axiosInstance.get(`/exam/tests/${testId}`);
    return response.data;
  },

  // GET /api/tests/{test_id}/parts - Lấy danh sách parts của đề thi- DONE
  getTestParts: async (testId) => {
    const response = await axiosInstance.get(`/exam/tests/${testId}/parts`);
    return response.data;
  },

  // GET /api/tests/{test_id}/result - Lấy kết quả thi của đề thi - DONE
  getPracticeTestResult: async (testId) => {
    const response = await axiosInstance.get(`/exam/tests/${testId}/result`);
    return response.data;
  },

  // GET /api/parts/{part_id}/questions - Lấy danh sách câu hỏi của part - DONE
  getPartQuestions: async (partId) => {
    const response = await axiosInstance.get(`/exam/parts/${partId}/questions`);
    return response.data;
  },

  // POST /api/exam-sessions/start - Bắt đầu phiên thi - DONE
  startExamSession: async (sessionData) => {
    const response = await axiosInstance.post(
      "/exam/exam-sessions/start",
      sessionData
    );
    return response.data;
  },

  // POST /api/exam-sessions/{session_id}/submit - Nộp bài thi - DONE
  submitExamSession: async (sessionId, answers, examId) => {
    const response = await axiosInstance.post(
      `/exam/exam-sessions/${sessionId}/submit`,
      {
        answers,
        examId,
      }
    );
    return response.data;
  },

  // GET /api/exam-sessions/{session_id}/result - Lấy kết quả thi - DONE
  getExamResult: async (sessionId) => {
    const response = await axiosInstance.get(
      `/exam/exam-sessions/${sessionId}/result`
    );
    return response.data;
  },

  // GET /api/exam-sessions/{session_id}/review - Xem lại bài thi
  reviewExamSession: async (sessionId) => {
    const response = await axiosInstance.get(
      `/exam/exam-sessions/${sessionId}/review`
    );
    return response.data;
  },

  // POST /api/exam-sessions/{session_id}/retry-wrong - Làm lại câu sai
  retryWrongAnswers: async (sessionId) => {
    const response = await axiosInstance.post(
      `/exam/exam-sessions/${sessionId}/retry-wrong`
    );
    return response.data;
  },

  // GET /api/user/statistics - Lấy thống kê người dùng
  getUserStatistics: async () => {
    const response = await axiosInstance.get("/exam/user/statistics");
    return response.data;
  },

  // ========== DISCUSSION APIs ==========

  // GET /api/discussions/test/{test_id} - Lấy thảo luận của đề thi - DONE
  getTestDiscussions: async (testId) => {
    // const params = new URLSearchParams();

    // Object.entries(options).forEach(([key, value]) => {
    //   if (value !== undefined && value !== null && value !== "") {
    //     params.append(key, value);
    //   }
    // });
    // http://localhost:5000/exam/discussions/test/1
    console.log("COMMENT - CHECK TEST ID ", testId);
    const response = await axiosInstance.get(
      `/exam/discussions/test/${testId}`
    );

    console.log("COMMENT - API ", response);
    return response.data;
  },

  // POST /api/discussions - Tạo thảo luận mới  - DONE
  createDiscussion: async (discussionData) => {
    const response = await axiosInstance.post(
      "/exam/discussions",
      discussionData
    );
    return response.data;
  },

  // POST /api/discussions/{discussion_id}/comments - Thêm bình luận - DONE
  addComment: async (discussionId, commentData) => {
    const response = await axiosInstance.post(
      `/exam/discussions/${discussionId}/comments`,
      commentData
    );
    return response.data;
  },
  //  - DONE
  getResultByTags: async (sessionId) => {
    const response = await axiosInstance.get(
      `/exam/exam-sessions/${sessionId}/result-by-tags`
    );
    return response.data;
  },

  // ========== WRITING APIs ==========
  // POST /exam/writing/submit - Nộp bài viết writing
  submitWritingText: async (data) => {
    const response = await axiosInstance.post("/exam/writing/submit", data);
    return response.data;
  },

  // POST /exam/llmservice/score - Chấm điểm writing
  scoreWriting: async (data) => {
    const response = await axiosInstance.post("/exam/llmservice/score", data, {
      timeout: 300000, // 5 phút cho scoring
    });
    return response.data;
  },

  // ========== SPEAKING APIs ==========
  // POST /exam/speaking/upload - Upload audio file cho speaking
  submitSpeakingAudio: async (formData) => {
    const response = await axiosInstance.post("/exam/speaking/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 300000, // 5 phút cho upload và transcription
    });
    return response.data;
  },

  // POST /exam/llmservice/score - Chấm điểm speaking
  scoreSpeaking: async (data) => {
    const response = await axiosInstance.post("/exam/llmservice/score", data, {
      timeout: 300000, // 5 phút cho scoring
    });
    return response.data;
  },

  // PATCH /exam/exam-sessions/:session_id/update - Cập nhật exam session
  updateExamSession: async (sessionId, data) => {
    const response = await axiosInstance.patch(
      `/exam/exam-sessions/${sessionId}/update`,
      data
    );
    return response.data;
  },

  // ========== REDIS CACHE APIs ==========

  // POST /exam/exam-sessions/:session_id/auto-save - Auto-save đáp án vào cache
  autoSaveAnswer: async (sessionId, questionId, selectedChoiceId) => {
    const response = await axiosInstance.post(
      `/exam/exam-sessions/${sessionId}/auto-save`,
      {
        question_id: questionId,
        selected_choice_id: selectedChoiceId,
      }
    );
    return response.data;
  },

  // GET /exam/exam-sessions/:session_id/restore - Restore đáp án từ cache
  restoreAnswers: async (sessionId) => {
    const response = await axiosInstance.get(
      `/exam/exam-sessions/${sessionId}/restore`
    );
    return response.data;
  },

  // POST /exam/exam-sessions/:session_id/cancel - Hủy phiên thi
  cancelExamSession: async (sessionId) => {
    const response = await axiosInstance.post(
      `/exam/exam-sessions/${sessionId}/cancel`
    );
    return response.data;
  },

  // GET /exam/exam-sessions/active - Lấy tất cả active sessions
  getAllActiveSessions: async () => {
    const response = await axiosInstance.get("/exam/exam-sessions/active");
    return response.data;
  },

  // GET /exam/exam-sessions/:session_id/debug-cache - Debug: Kiểm tra Redis cache
  debugCache: async (sessionId) => {
    const response = await axiosInstance.get(
      `/exam/exam-sessions/${sessionId}/debug-cache`
    );
    return response.data;
  },
};
