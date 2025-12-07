import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/queryKeys";
import { dictionaryApi } from "./dictionary.service";

/**
 * Word Detail Query Hook
 * Lấy chi tiết đầy đủ của 1 từ (khi click vào từ trong list)
 * 
 * @param {string} word - Từ cần lấy chi tiết
 * @param {string} type - Loại tra: "en-vi" | "vi-en"
 * @returns {Object} Query result từ TanStack Query
 */
export const useWordDetail = (word, type = "en-vi") => {
  return useQuery({
    queryKey: [...queryKeys.dictionary.search(word, type), "detail"],
    queryFn: () => dictionaryApi.getDetail(word, type),
    enabled: !!word && word.trim() !== "",
    staleTime: 1000 * 60 * 10, // Cache 10 phút
    gcTime: 1000 * 60 * 30, // Giữ cache 30 phút
    retry: 1,
  });
};

