import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/queryKeys";
import { dictionaryApi } from "./dictionary.service";

/**
 * Dictionary Query Hook
 * Sử dụng TanStack Query để tra từ điển
 * 
 * @param {string} word - Từ cần tra
 * @param {string} type - Loại tra: "en-vi" | "vi-en" | "thesaurus"
 * @returns {Object} Query result từ TanStack Query
 */
export const useDictionary = (word, type = "en-vi") => {
  return useQuery({
    queryKey: queryKeys.dictionary.search(word, type),
    queryFn: () => dictionaryApi.search(word, type),
    enabled: !!word && word.trim() !== "",
    staleTime: 1000 * 60 * 10, // Cache 10 phút
    gcTime: 1000 * 60 * 30, // Giữ cache 30 phút
    retry: 1, // Chỉ retry 1 lần nếu fail
  });
};
