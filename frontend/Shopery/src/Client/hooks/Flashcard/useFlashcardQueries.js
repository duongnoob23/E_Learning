import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { flashcardApi } from "../../api/Flashcard/flashcardApi";
// Query Keys
export const flashcardKeys = {
  all: ["flashcards"],

  exploreTopics: (params) => [...flashcardKeys.all, "exploreTopics", params],
  userTopics: () => [...flashcardKeys.all, "userTopics"],
  topicDetail: (topicId) => [...flashcardKeys.all, "topicDetail", topicId],
  wordsByTopic: () => [...flashcardKeys.all, "wordsByTopic"],
};

// Hook để lấy danh sách topics cho phần khám phá
export const useExploreTopics = (params = {}) => {
  return useQuery({
    queryKey: flashcardKeys.exploreTopics(params),
    queryFn: () => flashcardApi.getExploreTopics(params),
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
    retry: 2,
    onError: (error) => {
      console.error("Error fetching explore topics:", error);
      toast.error("Không thể tải danh sách topics khám phá");
    },
  });
};

// Hook để lấy danh sách topics của user (List từ của tôi)
export const useUserTopics = (params = {}) => {
  return useQuery({
    queryKey: flashcardKeys.userTopics,
    queryFn: async () => {
      console.log("Fetching user topics with params:", params);
      const result = await flashcardApi.getUserTopics(params);
      console.log("User topics API response:", result);
      return result;
    },
    staleTime: 2 * 60 * 1000, // 2 phút
    cacheTime: 5 * 60 * 1000, // 5 phút
    retry: 2,
    onError: (error) => {
      console.error("Error fetching user topics:", error);
      console.error("Error details:", error.response?.data);
      toast.error("Không thể tải danh sách topics của bạn");
    },
  });
};

// Hook để tạo topic mới
export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flashcardApi.createTopic,
    onSuccess: (data) => {
      console.log("Topic created successfully, updating cache...");
      console.log("Created topic data:", data);

      // Tạo topic object mới
      const newTopic = {
        id: data.DT?.id || Date.now(), // Fallback ID
        title: data.DT?.topic_name || "New Topic",
        description: data.DT?.description || "Chưa có mô tả",
        wordCount: data.DT?.word_count || 0,
        isUserCreated: true,
        createdBy: {
          name: "You",
          avatar: null,
        },
        logo: null,
        viewCount: 0,
      };

      // Cập nhật tất cả user topics queries trong cache
      queryClient.setQueriesData(
        { queryKey: flashcardKeys.userTopics, exact: false },
        (oldData) => {
          if (!oldData) return oldData;
          console.log("Updating cache with new topic:", newTopic);
          return {
            ...oldData,
            DT: {
              ...oldData.DT,
              topics: [newTopic, ...(oldData.DT?.topics || [])],
            },
          };
        }
      );

      // Invalidate để đảm bảo sync với server
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.userTopics,
        exact: false,
      });

      console.log("Cache updated and queries invalidated");
      toast.success(data.EM || "Tạo topic thành công!");
    },
    onError: (error) => {
      console.error("Error creating topic:", error);
      toast.error("Không thể tạo topic mới");
    },
  });
};

// Hook để cập nhật topic
export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, topicData }) =>
      flashcardApi.updateTopic(topicId, topicData),
    onSuccess: (data) => {
      // Invalidate và refetch tất cả user topics queries
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.userTopics,
        exact: false,
      });
      toast.success(data.EM || "Cập nhật topic thành công!");
    },
    onError: (error) => {
      console.error("Error updating topic:", error);
      toast.error("Không thể cập nhật topic");
    },
  });
};

// Hook để xóa topic
export const useDeleteTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flashcardApi.deleteTopic,
    onSuccess: (data) => {
      // Invalidate và refetch tất cả user topics queries
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.userTopics,
        exact: false,
      });

      toast.success(data.EM || "Xóa topic thành công!");
    },
    onError: (error) => {
      console.error("Error deleting topic:", error);
      toast.error("Không thể xóa topic");
    },
  });
};

// Hook để lấy chi tiết topic
export const useTopicDetail = (topicId) => {
  return useQuery({
    queryKey: flashcardKeys.topicDetail(topicId),
    queryFn: () => flashcardApi.getTopicDetail(topicId),
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Error fetching topic detail:", error);
      toast.error("Không thể tải chi tiết topic");
    },
  });
};

// Hook để lấy danh sách words theo topic
export const useWordsByTopic = (topicId, params = {}) => {
  return useQuery({
    queryKey: flashcardKeys.wordsByTopic(),
    queryFn: () => flashcardApi.getWordsByTopic(topicId, params),
    enabled: !!topicId,
    staleTime: 2 * 60 * 1000, // 2 phút
    cacheTime: 5 * 60 * 1000, // 5 phút
    retry: 2,
    onError: (error) => {
      console.error("Error fetching words by topic:", error);
      toast.error("Không thể tải danh sách từ vựng");
    },
  });
};

// Hook để thêm từ vào topic
export const useAddWordToTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, wordData }) =>
      flashcardApi.addWordToTopic(topicId, wordData),
    onSuccess: (data) => {
      // Invalidate words query để refresh danh sách từ
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.wordsByTopic(),
        exact: false,
      });

      // Invalidate user topics để cập nhật word count
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.userTopics(),
        exact: false,
      });

      toast.success(data.EM || "Thêm từ thành công!");
    },
    onError: (error) => {
      console.error("Error adding word to topic:", error);
      toast.error("Không thể thêm từ vào topic");
    },
  });
};
