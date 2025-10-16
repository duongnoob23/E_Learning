// D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce\frontend\Shopery\src\Client\api\Assessment\assessmentApi.jsx
import axiosInstance from "../../../lib/axiosInstance";

export const assessmentApi = {
  // GET /api/tests - Lấy danh sách đề thi
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

  // GET /api/tests/{test_id} - Lấy chi tiết đề thi
  getTestDetail: async (testId) => {
    const response = await axiosInstance.get(`/exam/tests/${testId}`);
    return response.data;
  },

  // GET /api/tests/{test_id}/parts - Lấy danh sách parts của đề thi
  getTestParts: async (testId) => {
    const response = await axiosInstance.get(`/exam/tests/${testId}/parts`);
    return response.data;
  },

  // GET /api/tests/{test_id}/result - Lấy kết quả thi của đề thi
  getPracticeTestResult: async (testId) => {
    const response = await axiosInstance.get(`/exam/tests/${testId}/result`);
    return response.data;
  },

  // GET /api/parts/{part_id}/questions - Lấy danh sách câu hỏi của part
  getPartQuestions: async (partId) => {
    const response = await axiosInstance.get(`/exam/parts/${partId}/questions`);
    return response.data;
  },

  // POST /api/exam-sessions/start - Bắt đầu phiên thi
  startExamSession: async (sessionData) => {
    const response = await axiosInstance.post(
      "/exam/exam-sessions/start",
      sessionData
    );
    return response.data;
  },

  // POST /api/exam-sessions/{session_id}/submit - Nộp bài thi
  submitExamSession: async (sessionId, answers) => {
    const response = await axiosInstance.post(
      `/exam/exam-sessions/${sessionId}/submit`,
      {
        answers,
      }
    );
    return response.data;
  },

  // GET /api/exam-sessions/{session_id}/result - Lấy kết quả thi
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

  // GET /api/discussions/test/{test_id} - Lấy thảo luận của đề thi
  getTestDiscussions: async (testId, options = {}) => {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    const response = await axiosInstance.get(
      `/exam/discussions/test/${testId}?${params.toString()}`
    );
    return response.data;
  },

  // POST /api/discussions - Tạo thảo luận mới
  createDiscussion: async (discussionData) => {
    const response = await axiosInstance.post(
      "/exam/discussions",
      discussionData
    );
    return response.data;
  },

  // POST /api/discussions/{discussion_id}/comments - Thêm bình luận
  addComment: async (discussionId, commentData) => {
    const response = await axiosInstance.post(
      `/exam/discussions/${discussionId}/comments`,
      commentData
    );
    return response.data;
  },
};
