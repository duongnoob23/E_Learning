import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { wordsAdminApi } from "../api/wordsAdminApi";
import { adminVocabKeys } from "./useWordsAdminQueries";

const isOk = (data) => (data?.EC ?? data?.data?.EC) === "0";
const em = (data, fallback) => data?.EM || data?.data?.EM || fallback;

export const useCreateWord = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wordsAdminApi.createWord,
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Tạo từ vựng thành công"));
        qc.invalidateQueries({ queryKey: adminVocabKeys.words() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Tạo từ vựng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi tạo từ vựng"),
  });
};

/**
 * Hook cập nhật từ vựng
 */
export const useUpdateWord = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ wordId, payload }) =>
      wordsAdminApi.updateWord(wordId, payload),
    onSuccess: (data, vars) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật từ vựng thành công"));
        qc.invalidateQueries({
          queryKey: adminVocabKeys.wordDetail(vars.wordId),
        });
        qc.invalidateQueries({ queryKey: adminVocabKeys.words() });
      } else {
        toast.error(em(data, "Cập nhật từ vựng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật từ vựng"),
  });
};

/**
 * Hook xóa từ vựng (soft delete mặc định, hard=true để xóa cứng)
 */
export const useDeleteWord = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ wordId, hard = false, delete_reason = null }) =>
      wordsAdminApi.deleteWord(wordId, hard, delete_reason),
    onSuccess: (data, variables) => {
      if (isOk(data)) {
        toast.success(
          em(
            data,
            variables.hard
              ? "Xóa vĩnh viễn từ vựng thành công"
              : "Xóa từ vựng thành công"
          )
        );
        qc.invalidateQueries({ queryKey: adminVocabKeys.words() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Xóa từ vựng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa từ vựng"),
  });
};

/**
 * Hook toggle active/inactive từ vựng
 */
export const useToggleWordActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (wordId) => wordsAdminApi.toggleWordActive(wordId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Thay đổi trạng thái thành công"));
        qc.invalidateQueries({ queryKey: adminVocabKeys.words() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Thay đổi trạng thái thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra"),
  });
};

/**
 * Hook khôi phục từ vựng đã xóa
 */
export const useRestoreWord = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (wordId) => wordsAdminApi.restoreWord(wordId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Khôi phục từ vựng thành công"));
        qc.invalidateQueries({ queryKey: adminVocabKeys.words() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Khôi phục từ vựng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi khôi phục từ vựng"),
  });
};

export const useBatchImportWords = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ words, topic_id }) =>
      wordsAdminApi.batchImportWords(words, topic_id),
    onSuccess: (data) => {
      if (isOk(data)) {
        const { success, duplicates, errors } = data.DT || {};
        toast.success(em(data, `Import thành công ${success?.length || 0} từ`));
        if (duplicates?.length > 0) {
          toast.warning(`${duplicates.length} từ bị trùng`);
        }
        qc.invalidateQueries({ queryKey: adminVocabKeys.words() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Import thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi import từ vựng"),
  });
};

/**
 * Hook xóa hàng loạt
 */
export const useBatchDeleteWords = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ word_ids, hard = false }) =>
      wordsAdminApi.batchDeleteWords(word_ids, hard),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xóa hàng loạt thành công"));
        qc.invalidateQueries({ queryKey: adminVocabKeys.words() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Xóa hàng loạt thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra"),
  });
};

/**
 * Hook toggle active hàng loạt
 */
export const useBatchToggleActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ word_ids, is_active }) =>
      wordsAdminApi.batchToggleActive(word_ids, is_active),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Thay đổi trạng thái hàng loạt thành công"));
        qc.invalidateQueries({ queryKey: adminVocabKeys.words() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Thay đổi trạng thái thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra"),
  });
};

export const useCreateTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wordsAdminApi.createTopic,
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Tạo chủ đề thành công"));
        qc.invalidateQueries({ queryKey: adminVocabKeys.topics() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Tạo chủ đề thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi tạo chủ đề"),
  });
};

/**
 * Hook cập nhật topic
 */
export const useUpdateTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, payload }) =>
      wordsAdminApi.updateTopic(topicId, payload),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật chủ đề thành công"));
        qc.invalidateQueries({ queryKey: adminVocabKeys.topics() });
      } else {
        toast.error(em(data, "Cập nhật chủ đề thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật chủ đề"),
  });
};

/**
 * Hook xóa topic (soft delete mặc định, hard=true để xóa cứng)
 */
export const useDeleteTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, hard = false, delete_reason = null }) =>
      wordsAdminApi.deleteTopic(topicId, hard, delete_reason),
    onSuccess: (data, variables) => {
      if (isOk(data)) {
        toast.success(
          em(
            data,
            variables.hard
              ? "Xóa vĩnh viễn chủ đề thành công"
              : "Xóa chủ đề thành công"
          )
        );
        qc.invalidateQueries({ queryKey: adminVocabKeys.topics() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Xóa chủ đề thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa chủ đề"),
  });
};

/**
 * Hook toggle active topic
 */
export const useToggleTopicActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (topicId) => wordsAdminApi.toggleTopicActive(topicId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Thay đổi trạng thái chủ đề thành công"));
        qc.invalidateQueries({ queryKey: adminVocabKeys.topics() });
        qc.invalidateQueries({ queryKey: adminVocabKeys.statistics() });
      } else {
        toast.error(em(data, "Thay đổi trạng thái thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra"),
  });
};

export default {
  useCreateWord,
  useUpdateWord,
  useDeleteWord,
  useToggleWordActive,
  useRestoreWord,
  useBatchImportWords,
  useBatchDeleteWords,
  useBatchToggleActive,
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic,
  useToggleTopicActive,
};
