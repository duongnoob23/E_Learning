import axiosInstance from '../../../lib/axiosInstance';

const examSessionApi = {
  // Bắt đầu luyện tập (chọn sections cụ thể)
  startPracticeSession: async (testId, sectionIds, timeLimit = null) => {
    const response = await axiosInstance.post(`/exam-session/tests/${testId}/start-practice`, {
      sectionIds,
      timeLimit
    });
    return response.data;
  },

  // Bắt đầu làm full test
  startFullTestSession: async (testId) => {
    const response = await axiosInstance.post(`/exam-session/tests/${testId}/start-fulltest`);
    return response.data;
  },

  // Lấy câu hỏi cho session
  getSessionQuestions: async (userTestId, sectionIds = null) => {
    const params = sectionIds ? { sectionIds: sectionIds.join(',') } : {};
    const response = await axiosInstance.get(`/exam-session/sessions/${userTestId}/questions`, {
      params
    });
    return response.data;
  },

  // Lưu câu trả lời
  saveAnswer: async (userTestId, questionId, answerData) => {
    const response = await axiosInstance.post(
      `/exam-session/sessions/${userTestId}/questions/${questionId}/answer`,
      answerData
    );
    return response.data;
  },

  // Submit bài thi
  submitSession: async (userTestId) => {
    const response = await axiosInstance.post(`/exam-session/sessions/${userTestId}/submit`);
    return response.data;
  },

  // Lưu tiến độ (auto-save)
  saveProgress: async (userTestId, remainingTime, currentQuestionId = null) => {
    const response = await axiosInstance.put(`/exam-session/sessions/${userTestId}/progress`, {
      remainingTime,
      currentQuestionId
    });
    return response.data;
  },

  // Bỏ dở bài thi
  abandonSession: async (userTestId) => {
    const response = await axiosInstance.post(`/exam-session/sessions/${userTestId}/abandon`);
    return response.data;
  },

  // Lấy kết quả bài thi
  getSessionResult: async (userTestId) => {
    const response = await axiosInstance.get(`/exam-session/sessions/${userTestId}/result`);
    return response.data;
  }
};

export default examSessionApi;

