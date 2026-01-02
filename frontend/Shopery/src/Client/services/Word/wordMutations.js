// frontend/Shopery/src/Client/services/Word/wordMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { wordApi } from "../../api/Word/wordApi";

// =============================
// FLASHCARD SYSTEM
// =============================

// Mutation để tạo set (topic) mới
export const useCreateSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => wordApi.createSet(data),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Tạo bộ flashcard thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ queryKey: ["flashcard", "topics", "user"] });
        queryClient.invalidateQueries({ queryKey: ["flashcard", "topics", "public"] });
      } else {
        toast.error(EM || "Tạo bộ flashcard thất bại!");
      }
    },
    onError: (error) => {
      console.error("Create set error:", error);
      toast.error("Có lỗi xảy ra khi tạo bộ flashcard");
    },
  });
};

// Mutation để thêm từ vựng vào set
export const useAddWordToSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => wordApi.addWordToSet(data),
    onSuccess: (data, variables) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Thêm từ vựng thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ 
          queryKey: ["flashcard", "set", variables.topic_id, "words"] 
        });
        queryClient.invalidateQueries({ queryKey: ["words", "user"] });
        queryClient.invalidateQueries({ queryKey: ["flashcard", "set", variables.topic_id] });
      } else {
        toast.error(EM || "Thêm từ vựng thất bại!");
      }
    },
    onError: (error) => {
      console.error("Add word to set error:", error);
      toast.error("Có lỗi xảy ra khi thêm từ vựng");
    },
  });
};

// Mutation để cập nhật từ vựng cá nhân
export const useUpdateUserWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userWordId, data }) => wordApi.updateUserWord(userWordId, data),
    onSuccess: (data, variables) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Cập nhật từ vựng thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ queryKey: ["words", "user"] });
        queryClient.invalidateQueries({ queryKey: ["flashcard", "set"] });
      } else {
        toast.error(EM || "Cập nhật từ vựng thất bại!");
      }
    },
    onError: (error) => {
      console.error("Update user word error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật từ vựng");
    },
  });
};

// Mutation để xóa từ vựng cá nhân
export const useDeleteUserWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userWordId) => wordApi.deleteUserWord(userWordId),
    onSuccess: (data, variables) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Xóa từ vựng thành công!");
        // Invalidate queries liên quan - invalidate tất cả queries bắt đầu bằng ["flashcard", "set"]
        queryClient.invalidateQueries({ queryKey: ["words", "user"] });
        queryClient.invalidateQueries({ queryKey: ["flashcard", "set"] });
        queryClient.invalidateQueries({ queryKey: ["flashcard"] });
      } else {
        toast.error(EM || "Xóa từ vựng thất bại!");
      }
    },
    onError: (error) => {
      console.error("Delete user word error:", error);
      toast.error("Có lỗi xảy ra khi xóa từ vựng");
    },
  });
};

// =============================
// LEARN STATUS
// =============================

// Mutation để đánh dấu đã học
export const useMarkLearned = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => wordApi.markLearned(data),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Đánh dấu đã học thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ queryKey: ["words", "learning"] });
        queryClient.invalidateQueries({ queryKey: ["words", "progress"] });
        queryClient.invalidateQueries({ queryKey: ["words", "user"] });
      } else {
        toast.error(EM || "Đánh dấu đã học thất bại!");
      }
    },
    onError: (error) => {
      console.error("Mark learned error:", error);
      toast.error("Có lỗi xảy ra khi đánh dấu đã học");
    },
  });
};

// Mutation để bỏ đánh dấu đã học
export const useUnmarkLearned = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => wordApi.unmarkLearned(data),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Bỏ đánh dấu đã học thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ queryKey: ["words", "learning"] });
        queryClient.invalidateQueries({ queryKey: ["words", "progress"] });
        queryClient.invalidateQueries({ queryKey: ["words", "user"] });
      } else {
        toast.error(EM || "Bỏ đánh dấu đã học thất bại!");
      }
    },
    onError: (error) => {
      console.error("Unmark learned error:", error);
      toast.error("Có lỗi xảy ra khi bỏ đánh dấu đã học");
    },
  });
};

// =============================
// SRS (SPACED REPETITION)
// =============================

// Mutation để gửi feedback cho từ vựng (forget, remember, easy, hard)
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wordId, feedback }) => wordApi.submitFeedback(wordId, feedback),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        // Không hiển thị toast để tránh spam khi học nhiều từ
        // Invalidate queries để fetch từ tiếp theo
        queryClient.invalidateQueries({ queryKey: ["words", "learning", "today"] });
        queryClient.invalidateQueries({ queryKey: ["words", "learning", "next"] });
        queryClient.invalidateQueries({ queryKey: ["words", "progress"] });
        queryClient.invalidateQueries({ queryKey: ["flashcard", "next"] });
      } else {
        toast.error(EM || "Gửi feedback thất bại!");
      }
    },
    onError: (error) => {
      console.error("Submit feedback error:", error);
      toast.error("Có lỗi xảy ra khi gửi feedback");
    },
  });
};

// =============================
// PRACTICE (QUIZ)
// =============================

// Mutation để nộp bài quiz
export const useSubmitVocabQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answers) => wordApi.submitVocabQuiz(answers),
    onSuccess: (data) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Nộp bài quiz thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ queryKey: ["words", "quiz"] });
        queryClient.invalidateQueries({ queryKey: ["words", "progress"] });
      } else {
        toast.error(EM || "Nộp bài quiz thất bại!");
      }
    },
    onError: (error) => {
      console.error("Submit vocab quiz error:", error);
      toast.error("Có lỗi xảy ra khi nộp bài quiz");
    },
  });
};

// =============================
// PRONUNCIATION ASSESSMENT
// =============================

// Mutation để chấm điểm phát âm
export const useAssessPronunciation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wordId, audioFile }) => wordApi.assessPronunciation(wordId, audioFile),
    onSuccess: (data, variables) => {
      const { EM, EC, DT } = data;
      if (EC === "0") {
        toast.success(EM || "Chấm điểm phát âm thành công!");
        // Invalidate queries liên quan
        queryClient.invalidateQueries({ 
          queryKey: ["words", "pronunciation", "history", variables.wordId] 
        });
        queryClient.invalidateQueries({ queryKey: ["words", "pronunciation", "stats"] });
      } else {
        toast.error(EM || "Chấm điểm phát âm thất bại!");
      }
    },
    onError: (error) => {
      console.error("Assess pronunciation error:", error);
      toast.error("Có lỗi xảy ra khi chấm điểm phát âm");
    },
  });
};

