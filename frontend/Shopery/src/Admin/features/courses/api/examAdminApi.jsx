// Dùng adminAxiosInstance để tự động thêm admin token
import adminAxiosInstance from "../../../api/adminAuthApi";

export const examAdminApi = {
  // Tests
  getTests: async () => (await adminAxiosInstance.get("/admin/exam/tests")).data,
  getTestDetail: async (testId) =>
    (await adminAxiosInstance.get(`/admin/exam/tests/detail/${testId}`)).data,
  createTest: async (payload) =>
    (await adminAxiosInstance.post("/admin/exam/tests", payload)).data,
  createFullExam: async (payload) =>
    (await adminAxiosInstance.post("/admin/exam/tests/full", payload)).data,
  updateTest: async (testId, payload) =>
    (await adminAxiosInstance.patch(`/admin/exam/tests/${testId}`, payload)).data,
  deleteTest: async (testId) =>
    (await adminAxiosInstance.delete(`/admin/exam/tests/${testId}`)).data,

  // Parts
  addPartToTest: async (testId, payload) =>
    (await adminAxiosInstance.post(`/admin/exam/tests/${testId}/parts`, payload))
      .data,

  // Questions (bulk create to part)
  addQuestionsToPart: async (partId, questions) =>
    (
      await adminAxiosInstance.post(`/admin/exam/parts/${partId}/questions`, {
        questions,
      })
    ).data,
  updateQuestion: async (questionId, payload) =>
    (await adminAxiosInstance.patch(`/admin/exam/questions/${questionId}`, payload))
      .data,
  deleteQuestion: async (questionId) =>
    (await adminAxiosInstance.delete(`/admin/exam/questions/${questionId}`)).data,

  // Sessions & statistics
  getTestSessions: async (testId) =>
    (await adminAxiosInstance.get(`/admin/exam/tests/${testId}/sessions`)).data,
  getExamSessionDetail: async (sessionId) =>
    (await adminAxiosInstance.get(`/admin/exam/exam-sessions/${sessionId}`)).data,
  getTestStatistics: async (testId) =>
    (await adminAxiosInstance.get(`/admin/exam/tests/${testId}/statistics`)).data,
};
