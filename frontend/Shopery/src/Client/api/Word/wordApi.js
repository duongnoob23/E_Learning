// frontend/Shopery/src/Client/api/Word/wordApi.js
import axiosInstance from "../../../lib/axiosInstance";

export const wordApi = {
  // =============================
  // WORDS - SYSTEM & USER WORDS
  // =============================

  // Lấy danh sách từ vựng hệ thống theo topic
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

  // Lấy chi tiết từ vựng hệ thống
  getWordDetail: async (wordId) => {
    const response = await axiosInstance.get(`/word/system/${wordId}`);
    return response.data;
  },

  // Tìm từ theo tên trong hệ thống
  findWordByName: async (wordName) => {
    const response = await axiosInstance.get(`/word/system/search?word=${encodeURIComponent(wordName)}`);
    return response.data;
  },

  // Lấy danh sách từ vựng cá nhân của user
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

  // =============================
  // FLASHCARD SYSTEM
  // =============================

  // Lấy danh sách topic công khai (hệ thống)
  getPublicTopics: async () => {
    const response = await axiosInstance.get("/word/topics");
    return response.data;
  },

  // Lấy danh sách topic của user
  getUserTopics: async () => {
    const response = await axiosInstance.get("/word/topics/user");
    return response.data;
  },

  // Tạo set (topic) mới
  createSet: async (data) => {
    const response = await axiosInstance.post("/word/topics/sets", {
      topic_name: data.topic_name,
      description: data.description,
    });
    return response.data;
  },

  // Lấy chi tiết set (topic)
  getSetDetail: async (setId) => {
    const response = await axiosInstance.get(`/word/flashcard/set/${setId}`);
    return response.data;
  },

  // Lấy danh sách từ vựng trong set
  getWordsBySet: async (setId) => {
    const response = await axiosInstance.get(
      `/word/flashcard/set/${setId}/words`
    );
    return response.data;
  },

  // Lấy flashcard tiếp theo trong set
  getNextFlashcard: async (setId) => {
    const response = await axiosInstance.get("/word/flashcard/next", {
      params: { set_id: setId },
    });
    return response.data;
  },

  // Thêm từ vựng vào set (user)
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

  // Cập nhật từ vựng cá nhân
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

  // Xóa từ vựng cá nhân
  deleteUserWord: async (userWordId) => {
    const response = await axiosInstance.delete(
      `/word/flashcard/user/${userWordId}`
    );
    return response.data;
  },

  // =============================
  // LEARN STATUS
  // =============================

  // Đánh dấu đã học
  markLearned: async (data) => {
    const response = await axiosInstance.post("/word/status/mark", {
      word_id: data.word_id,
      topic_id: data.topic_id,
    });
    return response.data;
  },

  // Bỏ đánh dấu đã học
  unmarkLearned: async (data) => {
    const response = await axiosInstance.post("/word/status/unmark", {
      word_id: data.word_id,
      topic_id: data.topic_id,
    });
    return response.data;
  },

  // =============================
  // SRS (SPACED REPETITION)
  // =============================

  // Lấy danh sách từ vựng cần học hôm nay
  getTodayWords: async () => {
    const response = await axiosInstance.get("/word/learning/today");
    return response.data;
  },

  // Lấy từ vựng tiếp theo cần học
  getNextWord: async () => {
    const response = await axiosInstance.get("/word/learning/next");
    return response.data;
  },

  // Gửi feedback cho từ vựng (forget, remember, easy, hard)
  submitFeedback: async (wordId, feedback) => {
    const response = await axiosInstance.post(
      `/word/learning/${wordId}/feedback`,
      {
        feedback: feedback, // "forget", "remember", "easy", "hard"
      }
    );
    return response.data;
  },

  // =============================
  // PROGRESS
  // =============================

  // Lấy tổng quan tiến độ học
  getOverview: async () => {
    const response = await axiosInstance.get("/word/progress/overview");
    return response.data;
  },

  // Lấy tiến độ học theo ngày
  getDailyProgress: async () => {
    const response = await axiosInstance.get("/word/progress/daily");
    return response.data;
  },

  // Lấy tiến độ học theo topic
  getProgressByTopic: async (topicId) => {
    const response = await axiosInstance.get(`/word/progress/topic/${topicId}`);
    return response.data;
  },

  // =============================
  // PRACTICE (QUIZ)
  // =============================

  // Tạo quiz từ vựng
  getVocabQuiz: async (topicId) => {
    const response = await axiosInstance.get("/word/practice/vocab", {
      params: { topic_id: topicId },
    });
    return response.data;
  },

  // Nộp bài quiz
  submitVocabQuiz: async (answers) => {
    const response = await axiosInstance.post("/word/practice/vocab/submit", {
      answers: answers, // Array of { question_id, selected_answer, is_correct }
    });
    return response.data;
  },

  // =============================
  // PRONUNCIATION ASSESSMENT
  // =============================

  // Chấm điểm phát âm
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

  // Lấy lịch sử chấm điểm phát âm
  getPronunciationHistory: async (wordId) => {
    const response = await axiosInstance.get(
      `/word/pronunciation/history/${wordId}`
    );
    return response.data;
  },

  // Lấy thống kê phát âm
  getPronunciationStats: async (topicId = null) => {
    const params = topicId ? { topic_id: topicId } : {};
    const response = await axiosInstance.get("/word/pronunciation/stats", {
      params,
    });
    return response.data;
  },
};
