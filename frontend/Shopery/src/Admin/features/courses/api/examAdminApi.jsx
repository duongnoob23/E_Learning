import axiosInstance from "../../../../lib/axiosInstance";

export const examAdminApi = {
  // Tests
  getTests: async () => (await axiosInstance.get("/admin/exam/tests")).data,
  getTestDetail: async (testId) =>
    (await axiosInstance.get(`/admin/exam/tests/detail/${testId}`)).data,
  createTest: async (payload) =>
    (await axiosInstance.post("/admin/exam/tests", payload)).data,
  updateTest: async (testId, payload) =>
    (await axiosInstance.patch(`/admin/exam/tests/${testId}`, payload)).data,
  deleteTest: async (testId) =>
    (await axiosInstance.delete(`/admin/exam/tests/${testId}`)).data,

  // Parts
  addPartToTest: async (testId, payload) =>
    (await axiosInstance.post(`/admin/exam/tests/${testId}/parts`, payload))
      .data,

  // Questions (bulk create to part)
  addQuestionsToPart: async (partId, questions) =>
    (
      await axiosInstance.post(`/admin/exam/parts/${partId}/questions`, {
        questions,
      })
    ).data,
  updateQuestion: async (questionId, payload) =>
    (await axiosInstance.patch(`/admin/exam/questions/${questionId}`, payload))
      .data,
  deleteQuestion: async (questionId) =>
    (await axiosInstance.delete(`/admin/exam/questions/${questionId}`)).data,

  // Sessions & statistics
  getTestSessions: async (testId) =>
    (await axiosInstance.get(`/admin/exam/tests/${testId}/sessions`)).data,
  getExamSessionDetail: async (sessionId) =>
    (await axiosInstance.get(`/admin/exam/exam-sessions/${sessionId}`)).data,
  getTestStatistics: async (testId) =>
    (await axiosInstance.get(`/admin/exam/tests/${testId}/statistics`)).data,
};
