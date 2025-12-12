// D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce\frontend\Shopery\src\Client\services\Assessment\assessmentMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryKeys } from "../../../lib/queryKeys";
import { assessmentApi } from "../../api/Assessment/assessmentApi";

// Mutation để bắt đầu phiên thi
export const useStartExamSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assessmentApi.startExamSession,
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Bắt đầu phiên thi thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ queryKey: queryKeys.assessment.all });
      } else {
        toast.error(EM || "Bắt đầu phiên thi thất bại!");
      }
    },
    onError: (error) => {
      console.error("Start exam session error:", error);
      toast.error("Có lỗi xảy ra khi bắt đầu phiên thi");
    },
  });
};

// Mutation để nộp bài thi
export const useSubmitExamSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, answers, examId }) =>
      assessmentApi.submitExamSession(sessionId, answers, examId),
    onSuccess: (data, variables) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Nộp bài thi thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ queryKey: queryKeys.assessment.all });
        queryClient.invalidateQueries({
          queryKey: queryKeys.assessment.statistics(),
        });
      } else {
        toast.error(EM || "Nộp bài thi thất bại!");
      }
    },
    onError: (error) => {
      console.error("Submit exam session error:", error);
      toast.error("Có lỗi xảy ra khi nộp bài thi");
    },
  });
};

// Mutation để làm lại câu sai
export const useRetryWrongAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assessmentApi.retryWrongAnswers,
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Tạo phiên làm lại câu sai thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ queryKey: queryKeys.assessment.all });
      } else {
        toast.error(EM || "Tạo phiên làm lại câu sai thất bại!");
      }
    },
    onError: (error) => {
      console.error("Retry wrong answers error:", error);
      toast.error("Có lỗi xảy ra khi tạo phiên làm lại câu sai");
    },
  });
};
// ========== DISCUSSION MUTATIONS ==========

// Mutation để tạo thảo luận mới
export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assessmentApi.createDiscussion,
    onSuccess: (data, variables) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Tạo thảo luận thành công!");
        // Invalidate discussions query
        queryClient.invalidateQueries({
          queryKey: ["discussions"],
        });
        queryClient.invalidateQueries({
          queryKey: ["assessment", "detail"],
        });
      } else {
        toast.error(EM || "Tạo thảo luận thất bại!");
      }
    },
    onError: (error) => {
      console.error("Create discussion error:", error);
      toast.error("Có lỗi xảy ra khi tạo thảo luận");
    },
  });
};

// Mutation để thêm bình luận
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discussionId, commentData }) =>
      assessmentApi.addComment(discussionId, commentData),
    onSuccess: (data, variables) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Thêm bình luận thành công!");
        // Invalidate discussions query
        queryClient.invalidateQueries({
          queryKey: ["discussions"],
        });
        queryClient.invalidateQueries({
          queryKey: ["assessment", "detail"],
        });
      } else {
        toast.error(EM || "Thêm bình luận thất bại!");
      }
    },
    onError: (error) => {
      console.error("Add comment error:", error);
      toast.error("Có lỗi xảy ra khi thêm bình luận");
    },
  });
};

// ========== WRITING MUTATIONS ==========

// Mutation để nộp bài writing
export const useSubmitWritingText = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => assessmentApi.submitWritingText(data),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Lưu bài viết thành công!");
        queryClient.invalidateQueries({ queryKey: queryKeys.assessment.all });
      } else {
        toast.error(EM || "Lưu bài viết thất bại!");
      }
    },
    onError: (error) => {
      console.error("Submit writing text error:", error);
      toast.error("Có lỗi xảy ra khi lưu bài viết");
    },
  });
};

// Mutation để chấm điểm writing
export const useScoreWriting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => assessmentApi.scoreWriting(data),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Chấm điểm thành công!");
        queryClient.invalidateQueries({ queryKey: queryKeys.assessment.all });
      } else {
        toast.error(EM || "Chấm điểm thất bại!");
      }
    },
    onError: (error) => {
      console.error("Score writing error:", error);
      toast.error("Có lỗi xảy ra khi chấm điểm");
    },
  });
};