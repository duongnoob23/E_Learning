import { useQuery } from "@tanstack/react-query";
import { wordsAdminApi } from "../api/wordsAdminApi";

/**
 * Query keys scoped to admin vocabulary
 */
export const adminVocabKeys = {
  all: ["admin", "vocabulary"],
  words: () => [...adminVocabKeys.all, "words"],
  wordList: (params) => [...adminVocabKeys.words(), "list", params],
  wordDetail: (id) => [...adminVocabKeys.words(), "detail", id],
  topics: () => [...adminVocabKeys.all, "topics"],
  topicList: (params) => [...adminVocabKeys.topics(), "list", params],
  allTopics: () => [...adminVocabKeys.topics(), "all"],
  statistics: () => [...adminVocabKeys.all, "statistics"],
};

/**
 * Hook lấy danh sách từ vựng với phân trang, filter, search
 */
export const useAdminWords = (params = {}) => {
  return useQuery({
    queryKey: adminVocabKeys.wordList(params),
    queryFn: () => wordsAdminApi.getWords(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
};

/**
 * Hook lấy chi tiết từ vựng (preview)
 */
export const useAdminWordDetail = (wordId, enabled = true) => {
  return useQuery({
    queryKey: adminVocabKeys.wordDetail(wordId),
    queryFn: () => wordsAdminApi.getWordDetail(wordId),
    enabled: enabled && !!wordId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook lấy tất cả topics (không phân trang - cho dropdown)
 */
export const useAdminAllTopics = () => {
  return useQuery({
    queryKey: adminVocabKeys.allTopics(),
    queryFn: () => wordsAdminApi.getAllTopics(),
    staleTime: 10 * 60 * 1000, // 10 minutes - topics ít thay đổi
  });
};

/**
 * Hook lấy danh sách topics với phân trang
 */
export const useAdminTopics = (params = {}) => {
  return useQuery({
    queryKey: adminVocabKeys.topicList(params),
    queryFn: () => wordsAdminApi.getTopics(params),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
};

/**
 * Hook lấy thống kê vocabulary
 */
export const useAdminVocabStats = () => {
  return useQuery({
    queryKey: adminVocabKeys.statistics(),
    queryFn: () => wordsAdminApi.getStatistics(),
    staleTime: 2 * 60 * 1000, // 2 minutes - stats cần refresh thường xuyên hơn
  });
};

export default {
  useAdminWords,
  useAdminWordDetail,
  useAdminAllTopics,
  useAdminTopics,
  useAdminVocabStats,
  adminVocabKeys,
};

