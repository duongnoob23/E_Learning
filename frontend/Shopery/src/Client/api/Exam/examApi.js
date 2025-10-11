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
    const params = parts ? `?parts=${parts.join(',')}` : '';
    const response = await axiosInstance.get(`/exam/tests/practice/${examId}${params}`);
    return response.data;
  },

  // Nộp bài thi
  submitExam: async (examId, answers) => {
    const response = await axiosInstance.post(`/exam/tests/${examId}/submit`, { answers });
    return response.data;
  },

  // Nộp bài luyện tập
  submitPracticeTest: async (examId, answers) => {
    const response = await axiosInstance.post(`/exam/tests/${examId}/practice/submit`, { answers });
    return response.data;
  },
};
