import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examApi } from "../../api/Exam/examApi";
import { toast } from "react-toastify";

// Query keys
export const examKeys = {
  all: ['exams'],
  lists: () => [...examKeys.all, 'list'],
  list: (filters) => [...examKeys.lists(), { filters }],
  details: () => [...examKeys.all, 'detail'],
  detail: (id) => [...examKeys.details(), id],
};

// Queries
export const useExams = () => {
  return useQuery({
    queryKey: examKeys.lists(),
    queryFn: examApi.getExams,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useExamDetail = (examId) => {
  return useQuery({
    queryKey: examKeys.detail(examId),
    queryFn: () => examApi.getExamDetail(examId),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStartExam = (examId) => {
  return useQuery({
    queryKey: [...examKeys.detail(examId), 'start'],
    queryFn: () => examApi.startExam(examId),
    enabled: !!examId,
    staleTime: 0, // Always fresh for exam start
  });
};

export const usePracticeTests = (examId, parts) => {
  return useQuery({
    queryKey: [...examKeys.detail(examId), 'practice', parts],
    queryFn: () => examApi.getPracticeTests(examId, parts),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ examId, answers }) => examApi.submitExam(examId, answers),
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") {
        toast.success(EM || "Nộp bài thành công!");
        // Invalidate exam queries to refresh data
        queryClient.invalidateQueries({ queryKey: examKeys.all });
      } else {
        toast.error(EM || "Nộp bài thất bại!");
      }
    },
    onError: (error) => {
      console.error("Submit exam error:", error);
      toast.error("Có lỗi xảy ra khi nộp bài!");
    },
  });
};

export const useSubmitPracticeTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ examId, answers }) => examApi.submitPracticeTest(examId, answers),
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") {
        toast.success(EM || "Nộp bài luyện tập thành công!");
        queryClient.invalidateQueries({ queryKey: examKeys.all });
      } else {
        toast.error(EM || "Nộp bài luyện tập thất bại!");
      }
    },
    onError: (error) => {
      console.error("Submit practice test error:", error);
      toast.error("Có lỗi xảy ra khi nộp bài luyện tập!");
    },
  });
};
