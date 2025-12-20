# 📊 PHÂN TÍCH API WORD/FLASHCARD SYSTEM

## 🗄️ DATABASE SCHEMA

### 1. **Word** (words table)

```javascript
{
  word_id: BIGINT (PK),
  topic_id: BIGINT (FK → topics),
  word: STRING(255),
  part_of_speech: STRING(50),
  audio_url: STRING(255),
  pronunciation: STRING(255),
  meaning_vi: TEXT,
  example_en: TEXT,
  example_vi: TEXT,
  image_url: STRING(255),
  notes: TEXT,
  word_type: ENUM("system", "user_created"),
  created_by: BIGINT,
  is_active: BOOLEAN,
  created_at: DATE,
  updated_at: DATE
}
```

### 2. **Topic** (topics table)

```javascript
{
  topic_id: BIGINT (PK),
  topic_name: STRING(255),
  description: TEXT,
  image_url: STRING(255),
  logo_url: STRING(255),
  topic_type: ENUM("system", "user_created"),
  created_by: BIGINT,
  is_public: BOOLEAN,
  is_active: BOOLEAN,
  word_count: INTEGER,
  created_at: DATE,
  updated_at: DATE
}
```

### 3. **UserWord** (user_words table)

```javascript
{
  user_word_id: BIGINT (PK),
  user_id: BIGINT (FK → users),
  topic_id: BIGINT (FK → topics),
  word: STRING(255),
  part_of_speech: STRING(50),
  pronunciation: STRING(255),
  meaning_vi: TEXT,
  is_starred: TINYINT,
  audio_url: STRING(255),
  example_en: TEXT,
  example_vi: TEXT,
  image_url: STRING(255),
  notes: TEXT,
  from_system_word_id: BIGINT (FK → words),
  is_active: BOOLEAN,
  created_at: DATE,
  updated_at: DATE
}
```

### 4. **UserWordStatus** (user_word_status table)

```javascript
{
  status_id: BIGINT (PK),
  user_id: BIGINT (FK → users),
  topic_id: BIGINT (FK → topics),
  word_id: BIGINT (FK → words, nullable),
  user_word_id: BIGINT (FK → user_words, nullable),
  is_learned: BOOLEAN,
  marked_at: DATE,
  review_count: INTEGER,
  intervall: INTEGER, // SRS interval (days)
  ease_factor: FLOAT, // SRS ease factor
  last_reviewed: DATE,
  next_review: DATE,
  created_at: DATE,
  updated_at: DATE
}
```

### 5. **PronunciationAssessment** (pronunciation_assessment table)

```javascript
{
  assessment_id: BIGINT (PK),
  user_id: BIGINT (FK → users),
  word_id: BIGINT (FK → words, nullable),
  user_word_id: BIGINT (FK → user_words, nullable),
  score: FLOAT (0-100),
  pronunciation_score: FLOAT,
  fluency_score: FLOAT,
  feedback: JSON,
  audio_url: STRING(255),
  created_at: DATE,
  updated_at: DATE
}
```

---

## 📋 BACKEND ROUTES ANALYSIS

### ✅ **Routes Đã Có và Hoạt Động:**

#### **1. WORDS - SYSTEM & USER WORDS**

- ✅ `GET /word/system` - Lấy từ vựng hệ thống (có filter: topicId, q, page, limit)
- ✅ `GET /word/system/:word_id` - Lấy chi tiết từ vựng hệ thống
- ✅ `GET /word/user` - Lấy từ vựng cá nhân (có filter: topicId, page, limit)

#### **2. LEARN STATUS**

- ✅ `POST /word/status/mark` - Đánh dấu đã học
- ✅ `POST /word/status/unmark` - Bỏ đánh dấu đã học
- ❌ `POST /word/status/star` - **COMMENTED OUT** (chưa implement)
- ❌ `POST /word/status/unstar` - **COMMENTED OUT** (chưa implement)

#### **3. FLASHCARD SYSTEM**

- ✅ `GET /word/topics` - Lấy danh sách topic công khai (hệ thống)
- ✅ `GET /word/topics/user` - Lấy danh sách topic của user
- ✅ `POST /word/topics/sets` - Tạo set (topic) mới
- ✅ `GET /word/flashcard/set/:set_id` - Lấy chi tiết set
- ✅ `GET /word/flashcard/set/:set_id/words` - Lấy từ vựng trong set
- ✅ `POST /word/flashcard/set/item` - Thêm từ vào set
- ✅ `PATCH /word/flashcard/user/:user_word_id` - Cập nhật từ vựng cá nhân
- ✅ `DELETE /word/flashcard/user/:user_word_id` - Xóa từ vựng cá nhân

#### **4. SRS (SPACED REPETITION)**

- ✅ `GET /word/learning/today` - Lấy từ vựng cần học hôm nay
- ✅ `GET /word/learning/next` - Lấy từ vựng tiếp theo
- ✅ `POST /word/learning/:word_id/feedback` - Gửi feedback (forget/remember/easy/hard)

#### **5. PRACTICE (QUIZ)**

- ✅ `GET /word/practice/vocab` - Tạo quiz từ vựng (cần topic_id)
- ✅ `POST /word/practice/vocab/submit` - Nộp bài quiz

#### **6. PROGRESS**

- ✅ `GET /word/progress/overview` - Tổng quan tiến độ học
- ✅ `GET /word/progress/daily` - Tiến độ học theo ngày
- ❌ `GET /word/progress/topic/:topic_id` - **COMMENTED OUT** (có controller nhưng không có route)

#### **7. PRONUNCIATION ASSESSMENT**

- ✅ `POST /word/pronunciation/assess` - Chấm điểm phát âm (upload audio)
- ✅ `GET /word/pronunciation/history/:word_id` - Lịch sử chấm điểm
- ✅ `GET /word/pronunciation/stats` - Thống kê phát âm (có filter topic_id)

---

## ⚠️ **VẤN ĐỀ PHÁT HIỆN**

### 1. **API Có Controller Nhưng Không Có Route:**

#### ❌ `getNextFlashcard`

- **Controller:** `wordClientController.getNextFlashcard` (dòng 207-217)
- **Service:** `wordClientService.getNextFlashcard` (có thể có trong service)
- **Route:** ❌ **THIẾU** - Không có route trong `wordClientRoute.js`
- **Cần thêm:** `GET /word/flashcard/next?set_id=xxx`

#### ❌ `getProgressByTopic`

- **Controller:** `wordClientController.getProgressByTopic` (dòng 270-280)
- **Service:** Có thể có trong service
- **Route:** ❌ **COMMENTED OUT** (dòng 64 trong wordClientRoute.js)
- **Cần thêm:** `GET /word/progress/topic/:topic_id`

### 2. **API Có Route Nhưng Chưa Implement:**

#### ❌ Star/Unstar Words

- **Route:** Commented out (dòng 23-24)
- **Mục đích:** Đánh dấu từ yêu thích
- **Schema:** `UserWord.is_starred` đã có trong DB
- **Cần implement:** Controller và Service

### 3. **API Thiếu Trong Frontend:**

#### ❌ `getNextFlashcard`

- Frontend `wordApi.js` không có API này
- Cần thêm vào `wordApi.js` và `wordQueries.js`

#### ❌ `getProgressByTopic`

- Frontend `wordApi.js` không có API này
- Cần thêm vào `wordApi.js` và `wordQueries.js`

---

## 🔍 **KIỂM TRA CHI TIẾT TỪNG API**

### ✅ **API Hoạt Động Tốt:**

1. **getWordsByTopic** ✅

   - Route: `GET /word/system`
   - Controller: ✅ Có
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

2. **getWordDetail** ✅

   - Route: `GET /word/system/:word_id`
   - Controller: ✅ Có
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

3. **getUserWords** ✅

   - Route: `GET /word/user`
   - Controller: ✅ Có (getWordsByUser)
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

4. **getPublicTopics** ✅

   - Route: `GET /word/topics`
   - Controller: ✅ Có
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

5. **getUserTopics** ✅

   - Route: `GET /word/topics/user`
   - Controller: ✅ Có
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

6. **createSet** ✅

   - Route: `POST /word/topics/sets`
   - Controller: ✅ Có
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

7. **getSetDetail** ✅

   - Route: `GET /word/flashcard/set/:set_id`
   - Controller: ✅ Có
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

8. **getWordsBySet** ✅

   - Route: `GET /word/flashcard/set/:set_id/words`
   - Controller: ✅ Có
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

9. **addWordToSet** ✅

   - Route: `POST /word/flashcard/set/item`
   - Controller: ✅ Có (postWordToUser)
   - Service: ✅ Có
   - Frontend: ✅ Có trong wordApi.js

10. **updateUserWord** ✅

    - Route: `PATCH /word/flashcard/user/:user_word_id`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

11. **deleteUserWord** ✅

    - Route: `DELETE /word/flashcard/user/:user_word_id`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

12. **markLearned** ✅

    - Route: `POST /word/status/mark`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

13. **unmarkLearned** ✅

    - Route: `POST /word/status/unmark`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

14. **getTodayWords** ✅

    - Route: `GET /word/learning/today`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

15. **getNextWord** ✅

    - Route: `GET /word/learning/next`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

16. **submitFeedback** ✅

    - Route: `POST /word/learning/:word_id/feedback`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

17. **getOverview** ✅

    - Route: `GET /word/progress/overview`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

18. **getDailyProgress** ✅

    - Route: `GET /word/progress/daily`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

19. **getVocabQuiz** ✅

    - Route: `GET /word/practice/vocab`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

20. **submitVocabQuiz** ✅

    - Route: `POST /word/practice/vocab/submit`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

21. **assessPronunciation** ✅

    - Route: `POST /word/pronunciation/assess`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

22. **getPronunciationHistory** ✅

    - Route: `GET /word/pronunciation/history/:word_id`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

23. **getPronunciationStats** ✅
    - Route: `GET /word/pronunciation/stats`
    - Controller: ✅ Có
    - Service: ✅ Có
    - Frontend: ✅ Có trong wordApi.js

### ❌ **API Thiếu:**

1. **getNextFlashcard** ❌

   - Controller: ✅ Có
   - Service: ❓ Cần kiểm tra
   - Route: ❌ **THIẾU**
   - Frontend: ❌ **THIẾU**

2. **getProgressByTopic** ❌

   - Controller: ✅ Có
   - Service: ❓ Cần kiểm tra
   - Route: ❌ **COMMENTED OUT**
   - Frontend: ❌ **THIẾU**

3. **markStarred** ❌

   - Controller: ❌ **COMMENTED OUT**
   - Service: ❌ **THIẾU**
   - Route: ❌ **COMMENTED OUT**
   - Frontend: ❌ **THIẾU**

4. **unmarkStarred** ❌
   - Controller: ❌ **COMMENTED OUT**
   - Service: ❌ **THIẾU**
   - Route: ❌ **COMMENTED OUT**
   - Frontend: ❌ **THIẾU**

---

## ✅ **ĐÃ BỔ SUNG**

### **1. Backend - Routes:** ✅ **ĐÃ THÊM**

- ✅ `GET /word/flashcard/next` - Lấy flashcard tiếp theo
- ✅ `GET /word/progress/topic/:topic_id` - Tiến độ học theo topic (đã uncomment)

### **2. Backend - Services:** ✅ **ĐÃ IMPLEMENT**

- ✅ `getNextFlashcard(userId, set_id)` - Logic lấy flashcard tiếp theo dựa trên SRS
- ✅ `getProgressByTopic(userId, topicId)` - Thống kê tiến độ học theo topic

### **3. Frontend - API:** ✅ **ĐÃ THÊM**

- ✅ `wordApi.getNextFlashcard(setId)`
- ✅ `wordApi.getProgressByTopic(topicId)`

### **4. Frontend - Queries:** ✅ **ĐÃ THÊM**

- ✅ `useNextFlashcard(setId)`
- ✅ `useProgressByTopic(topicId)`

---

## 📝 **CẦN BỔ SUNG (Nếu Cần Star Feature)**

### **Star/Unstar APIs (Nice to Have):**

#### **Backend:**

```javascript
// Routes (uncomment trong wordClientRoute.js)
router.post(
  "/status/star",
  middleware,
  authorizeByRole("student"),
  controller.markStarred
);
router.post(
  "/status/unstar",
  middleware,
  authorizeByRole("student"),
  controller.unmarkStarred
);

// Controller (implement)
exports.markStarred = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { user_word_id } = req.body;
    const result = await wordClientService.markStarred(userId, user_word_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Service (implement)
exports.markStarred = async (userId, userWordId) => {
  try {
    await UserWord.update(
      { is_starred: 1 },
      { where: { user_word_id: userWordId, user_id: userId } }
    );
    return {
      EM: "Đánh dấu yêu thích thành công",
      EC: "0",
      DT: null,
    };
  } catch (error) {
    console.error("Lỗi trong markStarred service:", error);
    return {
      EM: "Có lỗi xảy ra",
      EC: "-2",
      DT: null,
    };
  }
};
```

#### **Frontend:**

```javascript
// wordApi.js
markStarred: async (userWordId) => {
  const response = await axiosInstance.post("/word/status/star", {
    user_word_id: userWordId,
  });
  return response.data;
},

// wordMutations.js
export const useMarkStarred = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userWordId) => wordApi.markStarred(userWordId),
    onSuccess: (response) => {
      if (response.EC === "0") {
        toast.success(response.EM || "Đánh dấu yêu thích thành công");
        queryClient.invalidateQueries({ queryKey: ["words", "user"] });
      }
    },
  });
};
```

---

## 📊 **TỔNG KẾT**

### **✅ API Đã Hoạt Động:** 25/27 APIs (92.6%)

### **✅ API Đã Bổ Sung:**

1. ✅ `getNextFlashcard` - **ĐÃ HOÀN THÀNH** (Route + Service + Frontend)
2. ✅ `getProgressByTopic` - **ĐÃ HOÀN THÀNH** (Route + Service + Frontend)

### **❌ API Còn Thiếu (Nice to Have):**

3. `markStarred` - Thiếu hoàn toàn (có schema support, có thể implement sau)
4. `unmarkStarred` - Thiếu hoàn toàn (có schema support, có thể implement sau)

### **🎯 Trạng Thái:**

- ✅ **Core APIs:** 100% hoàn thành
- ✅ **Flashcard APIs:** 100% hoàn thành
- ✅ **Progress APIs:** 100% hoàn thành
- ⚠️ **Star Feature:** Chưa implement (không ảnh hưởng core functionality)

---

**Tài liệu được tạo:** `2024-01-XX`  
**Phiên bản:** `1.0.0`
