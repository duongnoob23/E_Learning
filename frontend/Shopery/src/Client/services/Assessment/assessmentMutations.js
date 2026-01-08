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
        // toast.success(EM || "Lưu bài viết thành công!"); // Suppress for individual questions
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
        // toast.success(EM || "Chấm điểm thành công!"); // Suppress for individual questions
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

// ========== SPEAKING MUTATIONS ==========

// Mutation để upload audio file cho speaking
export const useSubmitSpeakingAudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => assessmentApi.submitSpeakingAudio(formData),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        // toast.success(EM || "Tải lên audio thành công!"); // Suppress for individual questions
        queryClient.invalidateQueries({ queryKey: queryKeys.assessment.all });
      } else {
        toast.error(EM || "Tải lên audio thất bại!");
      }
    },
    onError: (error) => {
      console.error("Submit speaking audio error:", error);
      toast.error("Có lỗi xảy ra khi tải lên audio");
    },
  });
};

// Mutation để chấm điểm speaking
export const useScoreSpeaking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => assessmentApi.scoreSpeaking(data),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        // toast.success(EM || "Chấm điểm thành công!"); // Suppress for individual questions
        queryClient.invalidateQueries({ queryKey: queryKeys.assessment.all });
      } else {
        toast.error(EM || "Chấm điểm thất bại!");
      }
    },
    onError: (error) => {
      console.error("Score speaking error:", error);
      toast.error("Có lỗi xảy ra khi chấm điểm");
    },
  });
};

// ========== REDIS CACHE MUTATIONS ==========

// Mutation để auto-save đáp án (silent - không hiển thị toast)
export const useAutoSaveAnswer = () => {
  return useMutation({
    mutationFn: ({ sessionId, questionId, selectedChoiceId }) =>
      assessmentApi.autoSaveAnswer(sessionId, questionId, selectedChoiceId),
    onSuccess: (data) => {
      // Silent success - không hiển thị toast để không gây phiền
      if (data.EC !== "0") {
        console.warn("[AutoSave] Failed:", data.EM);
      }
    },
    onError: (error) => {
      // Silent error - không gián đoạn UX
      console.warn("[AutoSave] Error:", error.message);
    },
  });
};

// Mutation để restore đáp án từ cache
export const useRestoreAnswers = () => {
  return useMutation({
    mutationFn: (sessionId) => assessmentApi.restoreAnswers(sessionId),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0" && DT?.count > 0) {
        console.log(`[Restore] Restored ${DT.count} answers from cache`);
      }
    },
    onError: (error) => {
      console.error("[Restore] Error:", error);
    },
  });
};

// Mutation để hủy phiên thi
export const useCancelExamSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId) => assessmentApi.cancelExamSession(sessionId),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Đã hủy phiên thi");
        queryClient.invalidateQueries({ queryKey: queryKeys.assessment.all });
      } else {
        toast.error(EM || "Hủy phiên thi thất bại!");
      }
    },
    onError: (error) => {
      console.error("Cancel exam session error:", error);
      toast.error("Có lỗi xảy ra khi hủy phiên thi");
    },
  });
};

// Mutation để lấy active sessions (dùng mutation vì cần trigger thủ công)
export const useGetActiveSessions = () => {
  return useMutation({
    mutationFn: () => assessmentApi.getAllActiveSessions(),
    onError: (error) => {
      console.error("Get active sessions error:", error);
    },
  });
};