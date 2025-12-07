import axiosInstance from "../../../lib/axiosInstance";

export const examApi = {
  // Lấy danh sách bài thi
  getExams: async () => {
    const response = await axiosInstance.get("/exam");
    return response.data;
  },

  // Lấy chi tiết bài thi
  getExamDetail: async (examId) => {
    const response = await axiosInstance.get(`/exam/tests/${examId}`);
    return response.data;
  },

  // Bắt đầu làm bài thi
  startExam: async (examId) => {
    const response = await axiosInstance.get(`/exam/tests/${examId}/start`);
    return response.data;
  },

  // Lấy bài luyện tập
  getPracticeTests: async (examId, parts) => {
    const params = parts ? `?parts=${parts.join(",")}` : "";
    const response = await axiosInstance.get(
      `/exam/tests/practice/${examId}${params}`
    );
    return response.data;
  },

  // Nộp bài thi
  submitExam: async (examId, answers) => {
    const response = await axiosInstance.post(`/exam/tests/${examId}/submit`, {
      answers,
    });
    return response.data;
  },

  // Nộp bài luyện tập
  submitPracticeTest: async (examId, answers) => {
    const response = await axiosInstance.post(
      `/exam/tests/${examId}/practice/submit`,
      { answers }
    );
    return response.data;
  },

  // ========== Speaking APIs ==========
  // Upload audio cho speaking
  uploadSpeakingAudio: async (formData) => {
    const response = await axiosInstance.post(
      "/exam/speaking/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Lấy danh sách speaking responses
  getSpeakingResponses: async (sessionId, params = {}) => {
    const response = await axiosInstance.get(
      `/exam/speaking/session/${sessionId}/responses`,
      { params }
    );
    return response.data;
  },

  // Chấm điểm speaking
  scoreSpeaking: async (data) => {
    const response = await axiosInstance.post("/exam/llmservice/score", data);
    return response.data;
  },

  // ========== Writing APIs ==========
  // Submit text cho writing
  submitWritingText: async (data) => {
    const response = await axiosInstance.post("/exam/writing/submit", data);
    return response.data;
  },

  // Lấy danh sách writing responses
  getWritingResponses: async (sessionId, params = {}) => {
    const response = await axiosInstance.get(
      `/exam/writing/session/${sessionId}/responses`,
      { params }
    );
    return response.data;
  },

  // Chấm điểm writing
  scoreWriting: async (data) => {
    const response = await axiosInstance.post("/exam/llmservice/score", data);
    return response.data;
  },
};
