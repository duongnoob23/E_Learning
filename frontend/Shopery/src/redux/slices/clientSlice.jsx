// redux/slices/clientSlice.jsx (sửa lại cho web học tiếng Anh)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clientApi } from "../../Client/services/clientApi";

// Async thunks cho Flashcard
export const fetchFlashcardTopics = createAsyncThunk(
  "client/fetchFlashcardTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientApi.getFlashcardTopics();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải chủ đề flashcard"
      );
    }
  }
);

export const fetchMyTopics = createAsyncThunk(
  "client/fetchMyTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientApi.getMyTopics();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải chủ đề của tôi"
      );
    }
  }
);

export const fetchLearningTopics = createAsyncThunk(
  "client/fetchLearningTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientApi.getLearningTopics();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải chủ đề đang học"
      );
    }
  }
);

export const createTopic = createAsyncThunk(
  "client/createTopic",
  async (topicData, { rejectWithValue }) => {
    try {
      const response = await clientApi.createTopic(topicData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo chủ đề"
      );
    }
  }
);

export const addWordToTopic = createAsyncThunk(
  "client/addWordToTopic",
  async (wordData, { rejectWithValue }) => {
    try {
      const response = await clientApi.addWordToTopic(wordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi thêm từ"
      );
    }
  }
);

export const getTopicDetail = createAsyncThunk(
  "client/getTopicDetail",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await clientApi.getTopicDetail(topicId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải chi tiết chủ đề"
      );
    }
  }
);

// Async thunks cho Study Sessions
export const startStudySession = createAsyncThunk(
  "client/startStudySession",
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await clientApi.startStudySession(sessionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi bắt đầu phiên học"
      );
    }
  }
);

export const endStudySession = createAsyncThunk(
  "client/endStudySession",
  async ({ sessionId, results }, { rejectWithValue }) => {
    try {
      const response = await clientApi.endStudySession(sessionId, results);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi kết thúc phiên học"
      );
    }
  }
);

export const getStudyHistory = createAsyncThunk(
  "client/getStudyHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientApi.getStudyHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải lịch sử học"
      );
    }
  }
);

const initialState = {
  // Flashcard Topics
  flashcardTopics: [],
  myTopics: [],
  learningTopics: [],
  currentTopic: null,

  // Study Sessions
  currentSession: null,
  studyHistory: [],

  // Learning Progress
  learningProgress: {
    totalWordsLearned: 0,
    totalSessions: 0,
    streakDays: 0,
    averageScore: 0,
  },

  // Search
  searchResults: [],
  searchQuery: "",

  // Filters
  filters: {
    category: "",
    difficulty: "all",
    sortBy: "newest",
  },

  // Loading states
  isLoading: false,
  isTopicsLoading: false,
  isSessionLoading: false,

  // Error states
  error: null,
  topicsError: null,
  sessionError: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.topicsError = null;
      state.sessionError = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentTopic: (state) => {
      state.currentTopic = null;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
    updateLearningProgress: (state, action) => {
      state.learningProgress = { ...state.learningProgress, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Flashcard Topics
      .addCase(fetchFlashcardTopics.pending, (state) => {
        state.isTopicsLoading = true;
        state.topicsError = null;
      })
      .addCase(fetchFlashcardTopics.fulfilled, (state, action) => {
        state.isTopicsLoading = false;
        state.flashcardTopics = action.payload;
        state.topicsError = null;
      })
      .addCase(fetchFlashcardTopics.rejected, (state, action) => {
        state.isTopicsLoading = false;
        state.topicsError = action.payload;
      })

      // My Topics
      .addCase(fetchMyTopics.fulfilled, (state, action) => {
        state.myTopics = action.payload;
      })

      // Learning Topics
      .addCase(fetchLearningTopics.fulfilled, (state, action) => {
        state.learningTopics = action.payload;
      })

      // Create Topic
      .addCase(createTopic.fulfilled, (state, action) => {
        state.myTopics.unshift(action.payload);
      })

      // Add Word to Topic
      .addCase(addWordToTopic.fulfilled, (state, action) => {
        const { topicId, word } = action.payload;
        const topic = state.myTopics.find((t) => t.id === topicId);
        if (topic) {
          topic.words.push(word);
          topic.wordCount += 1;
        }
      })

      // Get Topic Detail
      .addCase(getTopicDetail.fulfilled, (state, action) => {
        state.currentTopic = action.payload;
      })

      // Study Sessions
      .addCase(startStudySession.pending, (state) => {
        state.isSessionLoading = true;
        state.sessionError = null;
      })
      .addCase(startStudySession.fulfilled, (state, action) => {
        state.isSessionLoading = false;
        state.currentSession = action.payload;
        state.sessionError = null;
      })
      .addCase(startStudySession.rejected, (state, action) => {
        state.isSessionLoading = false;
        state.sessionError = action.payload;
      })

      .addCase(endStudySession.fulfilled, (state, action) => {
        state.currentSession = null;
        // Update learning progress based on session results
        const { score, wordsLearned } = action.payload;
        state.learningProgress.totalSessions += 1;
        state.learningProgress.totalWordsLearned += wordsLearned;
        // Calculate new average score
        const currentTotal =
          state.learningProgress.averageScore *
          (state.learningProgress.totalSessions - 1);
        state.learningProgress.averageScore =
          (currentTotal + score) / state.learningProgress.totalSessions;
      })

      .addCase(getStudyHistory.fulfilled, (state, action) => {
        state.studyHistory = action.payload;
      });
  },
});

export const {
  clearError,
  setSearchQuery,
  setFilters,
  clearCurrentTopic,
  clearCurrentSession,
  updateLearningProgress,
} = clientSlice.actions;

export default clientSlice.reducer;
