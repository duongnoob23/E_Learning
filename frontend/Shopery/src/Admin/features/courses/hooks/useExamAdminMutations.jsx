import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { examAdminApi } from "../api/examAdminApi";
import { adminExamKeys } from "./useExamAdminQueries";

// Helpers
const isOk = (data) => (data?.EC ?? data?.data?.EC) === "0";
const em = (data, fallback) => data?.EM || data?.data?.EM || fallback;

// Create test
export const useAdminCreateTest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: examAdminApi.createTest,
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Tạo đề thi thành công"));
        qc.invalidateQueries({ queryKey: adminExamKeys.tests() });
        qc.invalidateQueries({ queryKey: ["ListExamsAdmin"] });
      } else toast.error(em(data, "Tạo đề thi thất bại"));
    },
    onError: () => toast.error("Có lỗi xảy ra khi tạo đề thi"),
  });
};

// Create full exam (Test + Parts + Questions + Choices)
export const useAdminCreateFullExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: examAdminApi.createFullExam,
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Exam created successfully"));
        qc.invalidateQueries({ queryKey: adminExamKeys.tests() });
        qc.invalidateQueries({ queryKey: ["ListExamsAdmin"] });
      } else toast.error(em(data, "Failed to create exam"));
    },
    onError: () => toast.error("Error occurred while creating exam"),
  });
};

// Update test
export const useAdminUpdateTest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ testId, payload }) =>
      examAdminApi.updateTest(testId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật đề thi thành công"));
        qc.invalidateQueries({
          queryKey: adminExamKeys.testDetail(vars.testId),
        });
        qc.invalidateQueries({ queryKey: adminExamKeys.tests() });
      } else toast.error(em(data, "Cập nhật đề thi thất bại"));
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật đề thi"),
  });
};

// Delete test
export const useAdminDeleteTest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (testId) => examAdminApi.deleteTest(testId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xóa đề thi thành công"));
        qc.invalidateQueries({ queryKey: adminExamKeys.tests() });
        qc.invalidateQueries({ queryKey: ["ListExamsAdmin"] });
      } else toast.error(em(data, "Xóa đề thi thất bại"));
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa đề thi"),
  });
};

// Add part to test
export const useAdminAddPartToTest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ testId, payload }) =>
      examAdminApi.addPartToTest(testId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Thêm part thành công"));
        qc.invalidateQueries({
          queryKey: adminExamKeys.testDetail(vars.testId),
        });
        qc.invalidateQueries({ queryKey: ["ListExamsAdmin"] });
      } else toast.error(em(data, "Thêm part thất bại"));
    },
    onError: () => toast.error("Có lỗi xảy ra khi thêm part"),
  });
};

// Add multiple questions to part
export const useAdminAddQuestionsToPart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ partId, questions }) =>
      examAdminApi.addQuestionsToPart(partId, questions),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Thêm câu hỏi thành công"));
        // Up to you which detail to refresh (depends on UI showing test/part detail)
        qc.invalidateQueries({ queryKey: adminExamKeys.tests() });
        qc.invalidateQueries({ queryKey: ["ListExamsAdmin"] });
      } else toast.error(em(data, "Thêm câu hỏi thất bại"));
    },
    onError: () => toast.error("Có lỗi xảy ra khi thêm câu hỏi"),
  });
};

// Update one question
export const useAdminUpdateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, payload }) =>
      examAdminApi.updateQuestion(questionId, payload),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật câu hỏi thành công"));
        qc.invalidateQueries({ queryKey: adminExamKeys.tests() });
      } else toast.error(em(data, "Cập nhật câu hỏi thất bại"));
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật câu hỏi"),
  });
};

// Delete one question
export const useAdminDeleteQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (questionId) => examAdminApi.deleteQuestion(questionId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xóa câu hỏi thành công"));
        qc.invalidateQueries({ queryKey: adminExamKeys.tests() });
      } else toast.error(em(data, "Xóa câu hỏi thất bại"));
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa câu hỏi"),
  });
};

export default {
  useAdminCreateTest,
  useAdminCreateFullExam,
  useAdminUpdateTest,
  useAdminDeleteTest,
  useAdminAddPartToTest,
  useAdminAddQuestionsToPart,
  useAdminUpdateQuestion,
  useAdminDeleteQuestion,
};
