// D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce\frontend\Shopery\src\Client\services\Assessment\assessmentQueries.js
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/queryKeys";
import { assessmentApi } from "../../api/Assessment/assessmentApi";

// Query để lấy danh sách đề thi với filter
export const useTests = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.assessment.list(filters),
    queryFn: () => assessmentApi.getTests(filters),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy chi tiết đề thi
export const useTestDetail = (testId, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.assessment.detail(testId),
    queryFn: () => assessmentApi.getTestDetail(testId),
    enabled: enabled && !!testId,
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy danh sách parts của đề thi
export const useTestParts = (testId, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.assessment.all, "parts", testId],
    queryFn: () => assessmentApi.getTestParts(testId),
    enabled: enabled && !!testId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query để lấy kết quả thi của đề thi
export const usePracticeTestResult = (testId, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.assessment.all, "result", testId],
    queryFn: () => assessmentApi.getPracticeTestResult(testId),
    enabled: enabled && !!testId,
    staleTime: 2 * 60 * 1000, // 2 phút
  });
};

// Query để lấy danh sách câu hỏi của part
export const usePartQuestions = (partId, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.assessment.all, "questions", partId],
    queryFn: () => assessmentApi.getPartQuestions(partId),
    enabled: enabled && !!partId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query để lấy kết quả thi
export const useExamResult = (sessionId, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.assessment.all, "session", "result", sessionId],
    queryFn: () => assessmentApi.getExamResult(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 2 * 60 * 1000,
  });
};

// Query để xem lại bài thi
export const useReviewExamSession = (sessionId, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.assessment.all, "session", "review", sessionId],
    queryFn: () => assessmentApi.reviewExamSession(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query để lấy thống kê người dùng
export const useUserStatistics = () => {
  return useQuery({
    queryKey: queryKeys.assessment.statistics(),
    queryFn: () => assessmentApi.getUserStatistics(),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// ========== DISCUSSION QUERIES ==========

export const useDiscussions = (testId) => {
  return useQuery({
    queryKey: ["discussions"],
    queryFn: () => {
      console.log("COMMENT - SERVICE - 2");
      return assessmentApi.getTestDiscussions(testId);
    },
  });
};

// Query để lấy thảo luận của đề thi
export const useTestDiscussions = (testId) => {
  return useQuery({
    // queryKey: [...queryKeys.assessment.all, "discussions", testId, options],
    queryKey: ["discussions"],
    queryFn: () => {
      console.log("COMMENT - SERVICE");
      return assessmentApi.getTestDiscussions(testId);
    },
    enabled: !!testId,
  });
};

export const useResultByTags = (sessionId, enabled = true) => {
  return useQuery({
    queryKey: ["result-by-tags", sessionId],
    queryFn: () => assessmentApi.getResultByTags(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};
