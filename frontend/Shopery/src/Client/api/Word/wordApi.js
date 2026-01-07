import axiosInstance from "../../../lib/axiosInstance";

export const wordApi = {
  getWordsByTopic: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });
    const response = await axiosInstance.get(
      `/word/system?${params.toString()}`
    );
    return response.data;
  },

  getWordDetail: async (wordId) => {
    const response = await axiosInstance.get(`/word/system/${wordId}`);
    return response.data;
  },

  findWordByName: async (wordName) => {
    const response = await axiosInstance.get(
      `/word/system/search?word=${encodeURIComponent(wordName)}`
    );
    return response.data;
  },

  getUserWords: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });
    const response = await axiosInstance.get(`/word/user?${params.toString()}`);
    return response.data;
  },

  getPublicTopics: async () => {
    const response = await axiosInstance.get("/word/topics");
    return response.data;
  },

  getUserTopics: async () => {
    const response = await axiosInstance.get("/word/topics/user");
    return response.data;
  },

  createSet: async (data) => {
    const response = await axiosInstance.post("/word/topics/sets", {
      topic_name: data.topic_name,
      description: data.description,
      image_url: data.image_url,
      logo_url: data.logo_url,
    });
    return response.data;
  },

  getSetDetail: async (setId) => {
    const response = await axiosInstance.get(`/word/flashcard/set/${setId}`);
    return response.data;
  },

  getWordsBySet: async (setId, page = 1, limit = 50) => {
    const response = await axiosInstance.get(
      `/word/flashcard/set/${setId}/words`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  getNextFlashcard: async (setId) => {
    const response = await axiosInstance.get("/word/flashcard/next", {
      params: { set_id: setId },
    });
    return response.data;
  },

  addWordToSet: async (data) => {
    const response = await axiosInstance.post("/word/flashcard/set/item", {
      word: data.word,
      meaning_vi: data.meaning_vi,
      topic_id: data.topic_id,
      meaning: data.meaning,
      example_en: data.example_en,
      example_vi: data.example_vi,
      example: data.example,
      partOfSpeech: data.partOfSpeech,
      pronunciation: data.pronunciation,
      imageUrl: data.imageUrl,
      fromSystemWordId: data.fromSystemWordId,
      notes: data.notes,
    });
    return response.data;
  },

  updateUserWord: async (userWordId, data) => {
    const response = await axiosInstance.patch(
      `/word/flashcard/user/${userWordId}`,
      {
        word: data.word,
        partOfSpeech: data.partOfSpeech,
        pronunciation: data.pronunciation,
        meaningVi: data.meaningVi,
        exampleEn: data.exampleEn,
        exampleVi: data.exampleVi,
        imageUrl: data.imageUrl,
        fromSystemWordId: data.fromSystemWordId,
      }
    );
    return response.data;
  },

  deleteUserWord: async (userWordId) => {
    const response = await axiosInstance.delete(
      `/word/flashcard/user/${userWordId}`
    );
    return response.data;
  },

  markLearned: async (data) => {
    const response = await axiosInstance.post("/word/status/mark", {
      word_id: data.word_id,
      topic_id: data.topic_id,
    });
    return response.data;
  },

  unmarkLearned: async (data) => {
    const response = await axiosInstance.post("/word/status/unmark", {
      word_id: data.word_id,
      topic_id: data.topic_id,
    });
    return response.data;
  },

  getTodayWords: async () => {
    const response = await axiosInstance.get("/word/learning/today");
    return response.data;
  },

  getNextWord: async () => {
    const response = await axiosInstance.get("/word/learning/next");
    return response.data;
  },

  submitFeedback: async (wordId, feedback) => {
    const response = await axiosInstance.post(
      `/word/learning/${wordId}/feedback`,
      {
        feedback: feedback,
      }
    );
    return response.data;
  },

  getOverview: async () => {
    const response = await axiosInstance.get("/word/progress/overview");
    return response.data;
  },

  getDailyProgress: async () => {
    const response = await axiosInstance.get("/word/progress/daily");
    return response.data;
  },

  getProgressByTopic: async (topicId) => {
    const response = await axiosInstance.get(`/word/progress/topic/${topicId}`);
    return response.data;
  },

  getVocabQuiz: async (topicId) => {
    const response = await axiosInstance.get("/word/practice/vocab", {
      params: { topic_id: topicId },
    });
    return response.data;
  },

  submitVocabQuiz: async (answers) => {
    const response = await axiosInstance.post("/word/practice/vocab/submit", {
      answers: answers,
    });
    return response.data;
  },

  assessPronunciation: async (wordId, audioFile) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("word_id", wordId);
    const response = await axiosInstance.post(
      "/word/pronunciation/assess",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getPronunciationHistory: async (wordId) => {
    const response = await axiosInstance.get(
      `/word/pronunciation/history/${wordId}`
    );
    return response.data;
  },

  getPronunciationStats: async (topicId = null) => {
    const params = topicId ? { topic_id: topicId } : {};
    const response = await axiosInstance.get("/word/pronunciation/stats", {
      params,
    });
    return response.data;
  },
};
