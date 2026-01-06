// frontend/Shopery/src/Client/services/Word/wordQueries.js
import { useQuery } from "@tanstack/react-query";
import { wordApi } from "../../api/Word/wordApi";

// =============================
// WORDS - SYSTEM & USER WORDS
// =============================

// Query để lấy danh sách từ vựng hệ thống theo topic
export const useWordsByTopic = (filters = {}, enabled = true) => {
  return useQuery({
    queryKey: ["words", "system", filters],
    queryFn: () => wordApi.getWordsByTopic(filters),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy chi tiết từ vựng hệ thống
export const useWordDetail = (wordId, enabled = true) => {
  return useQuery({
    queryKey: ["words", "system", wordId],
    queryFn: () => wordApi.getWordDetail(wordId),
    enabled: enabled && !!wordId,
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy danh sách từ vựng cá nhân
export const useUserWords = (filters = {}, enabled = true) => {
  return useQuery({
    queryKey: ["words", "user", filters],
    queryFn: () => wordApi.getUserWords(filters),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// =============================
// FLASHCARD SYSTEM
// =============================

// Query để lấy danh sách topic công khai (hệ thống)
export const usePublicTopics = (enabled = true) => {
  return useQuery({
    queryKey: ["flashcard", "topics", "public"],
    queryFn: () => wordApi.getPublicTopics(),
    enabled: enabled,
    staleTime: 10 * 60 * 1000, // 10 phút
    gcTime: 30 * 60 * 1000, // 30 phút
  });
};

// Query để lấy danh sách topic của user
export const useUserTopics = (enabled = true) => {
  return useQuery({
    queryKey: ["flashcard", "topics", "user"],
    queryFn: () => wordApi.getUserTopics(),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Query để lấy chi tiết set (topic)
export const useSetDetail = (setId, enabled = true) => {
  return useQuery({
    queryKey: ["flashcard", "set", setId],
    queryFn: () => wordApi.getSetDetail(setId),
    enabled: enabled && !!setId,
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy danh sách từ vựng trong set
export const useWordsBySet = (setId, page = 1, limit = 50, enabled = true) => {
  return useQuery({
    queryKey: ["flashcard", "set", setId, "words", page, limit],
    queryFn: () => wordApi.getWordsBySet(setId, page, limit),
    enabled: enabled && !!setId,
    staleTime: 5 * 60 * 1000, // 5 phút
    keepPreviousData: true, // Giữ data cũ khi chuyển trang
  });
};

// Query để lấy flashcard tiếp theo trong set
export const useNextFlashcard = (setId, enabled = true) => {
  return useQuery({
    queryKey: ["flashcard", "next", setId],
    queryFn: () => wordApi.getNextFlashcard(setId),
    enabled: enabled && !!setId,
    staleTime: 0, // Không cache (luôn fetch mới)
    refetchOnWindowFocus: false,
  });
};

// =============================
// SRS (SPACED REPETITION)
// =============================

// Query để lấy danh sách từ vựng cần học hôm nay
export const useTodayWords = (enabled = true) => {
  return useQuery({
    queryKey: ["words", "learning", "today"],
    queryFn: () => wordApi.getTodayWords(),
    enabled: enabled,
    staleTime: 1 * 60 * 1000, // 1 phút (cập nhật thường xuyên)
    refetchOnWindowFocus: true,
  });
};

// Query để lấy từ vựng tiếp theo cần học
export const useNextWord = (enabled = true) => {
  return useQuery({
    queryKey: ["words", "learning", "next"],
    queryFn: () => wordApi.getNextWord(),
    enabled: enabled,
    staleTime: 0, // Không cache (luôn fetch mới)
    refetchOnWindowFocus: false,
  });
};

// =============================
// PROGRESS
// =============================

// Query để lấy tổng quan tiến độ học
export const useWordOverview = (enabled = true) => {
  return useQuery({
    queryKey: ["words", "progress", "overview"],
    queryFn: () => wordApi.getOverview(),
    enabled: enabled,
    staleTime: 2 * 60 * 1000, // 2 phút
    refetchOnWindowFocus: true,
  });
};

// Query để lấy tiến độ học theo ngày
export const useDailyProgress = (enabled = true) => {
  return useQuery({
    queryKey: ["words", "progress", "daily"],
    queryFn: () => wordApi.getDailyProgress(),
    enabled: enabled,
    staleTime: 2 * 60 * 1000, // 2 phút
    refetchOnWindowFocus: true,
  });
};

// Query để lấy tiến độ học theo topic
export const useProgressByTopic = (topicId, enabled = true) => {
  return useQuery({
    queryKey: ["words", "progress", "topic", topicId],
    queryFn: () => wordApi.getProgressByTopic(topicId),
    enabled: enabled && !!topicId,
    staleTime: 2 * 60 * 1000, // 2 phút
    refetchOnWindowFocus: true,
  });
};

// =============================
// PRACTICE (QUIZ)
// =============================

// Query để tạo quiz từ vựng
export const useVocabQuiz = (topicId, enabled = true) => {
  return useQuery({
    queryKey: ["words", "quiz", topicId],
    queryFn: () => wordApi.getVocabQuiz(topicId),
    enabled: enabled && !!topicId,
    staleTime: 0, // Không cache quiz
  });
};

// =============================
// PRONUNCIATION ASSESSMENT
// =============================

// Query để lấy lịch sử chấm điểm phát âm
export const usePronunciationHistory = (wordId, enabled = true) => {
  return useQuery({
    queryKey: ["words", "pronunciation", "history", wordId],
    queryFn: () => wordApi.getPronunciationHistory(wordId),
    enabled: enabled && !!wordId,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Query để lấy thống kê phát âm
export const usePronunciationStats = (topicId = null, enabled = true) => {
  return useQuery({
    queryKey: ["words", "pronunciation", "stats", topicId],
    queryFn: () => wordApi.getPronunciationStats(topicId),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};
