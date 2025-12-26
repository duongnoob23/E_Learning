# 📚 TÀI LIỆU IMPLEMENTATION API FLASHCARD

## 🎯 TỔNG QUAN

Đã tạo đầy đủ API, service và hook cho hệ thống Flashcard theo pattern của các module khác trong hệ thống.

---

## 📁 CÁC FILE ĐÃ TẠO

### 1. **API Layer** (`frontend/Shopery/src/Client/api/Word/wordApi.js`)

File này chứa tất cả các API calls cho flashcard và word system:

#### **Flashcard APIs:**
- `getPublicTopics()` - Lấy danh sách topic công khai (hệ thống)
- `getUserTopics()` - Lấy danh sách topic của user
- `createSet()` - Tạo set (topic) mới
- `getSetDetail(setId)` - Lấy chi tiết set
- `getWordsBySet(setId)` - Lấy danh sách từ vựng trong set
- `addWordToSet(data)` - Thêm từ vựng vào set
- `updateUserWord(userWordId, data)` - Cập nhật từ vựng cá nhân
- `deleteUserWord(userWordId)` - Xóa từ vựng cá nhân

#### **Learn Status APIs:**
- `markLearned(data)` - Đánh dấu đã học
- `unmarkLearned(data)` - Bỏ đánh dấu đã học

#### **SRS (Spaced Repetition) APIs:**
- `getTodayWords()` - Lấy từ vựng cần học hôm nay
- `getNextWord()` - Lấy từ vựng tiếp theo
- `submitFeedback(wordId, feedback)` - Gửi feedback (forget/remember/easy/hard)

#### **Progress APIs:**
- `getOverview()` - Tổng quan tiến độ học
- `getDailyProgress()` - Tiến độ học theo ngày

#### **Practice (Quiz) APIs:**
- `getVocabQuiz(topicId)` - Tạo quiz từ vựng
- `submitVocabQuiz(answers)` - Nộp bài quiz

#### **Pronunciation APIs:**
- `assessPronunciation(wordId, audioFile)` - Chấm điểm phát âm
- `getPronunciationHistory(wordId)` - Lịch sử chấm điểm
- `getPronunciationStats(topicId)` - Thống kê phát âm

---

### 2. **Queries Layer** (`frontend/Shopery/src/Client/services/Word/wordQueries.js`)

File này chứa các React Query hooks để fetch data:

#### **Hooks chính:**
- `usePublicTopics()` - Hook để lấy danh sách topic công khai
- `useUserTopics()` - Hook để lấy danh sách topic của user
- `useSetDetail(setId)` - Hook để lấy chi tiết set
- `useWordsBySet(setId)` - Hook để lấy từ vựng trong set
- `useTodayWords()` - Hook để lấy từ vựng cần học hôm nay
- `useNextWord()` - Hook để lấy từ vựng tiếp theo
- `useWordOverview()` - Hook để lấy tổng quan tiến độ
- `useDailyProgress()` - Hook để lấy tiến độ theo ngày

**Tính năng:**
- Tự động cache data
- Tự động refetch khi cần
- Hỗ trợ `enabled` để control khi nào fetch
- `staleTime` và `gcTime` được config hợp lý

---

### 3. **Mutations Layer** (`frontend/Shopery/src/Client/services/Word/wordMutations.js`)

File này chứa các React Query mutations để thực hiện các thao tác thay đổi data:

#### **Mutations chính:**
- `useCreateSet()` - Tạo set mới
- `useAddWordToSet()` - Thêm từ vào set
- `useUpdateUserWord()` - Cập nhật từ vựng
- `useDeleteUserWord()` - Xóa từ vựng
- `useMarkLearned()` - Đánh dấu đã học
- `useUnmarkLearned()` - Bỏ đánh dấu đã học
- `useSubmitFeedback()` - Gửi feedback cho từ vựng
- `useSubmitVocabQuiz()` - Nộp bài quiz
- `useAssessPronunciation()` - Chấm điểm phát âm

**Tính năng:**
- Tự động hiển thị toast notification (success/error)
- Tự động invalidate queries để refetch data mới
- Error handling tự động

---

### 4. **Component Updates**

#### **Flashcard.jsx** (`frontend/Shopery/src/Client/pages/Flashcard/Flashcard.jsx`)

**Thay đổi:**
- ✅ Thay thế fake data bằng API calls thật
- ✅ Sử dụng `usePublicTopics()` cho tab "explore"
- ✅ Sử dụng `useUserTopics()` cho tab "my-lists"
- ✅ Thêm loading state
- ✅ Thêm empty state khi không có data
- ✅ Transform data từ API sang format component

#### **FlashcardDetail.jsx** (`frontend/Shopery/src/Client/components/Flashcard/FlashcardDetail/FlashcardDetail.jsx`)

**Thay đổi:**
- ✅ Sử dụng `useWordsBySet(setId)` để lấy từ vựng
- ✅ Transform word data từ API sang format component
- ✅ Thêm loading state
- ✅ Thêm empty state khi không có từ vựng
- ✅ Fallback về fake data nếu API fail

---

## 🔄 LUỒNG HOẠT ĐỘNG

### **Luồng Flashcard Hệ Thống:**

```
1. User vào trang Flashcard
   └─> Flashcard.jsx
       └─> usePublicTopics() (nếu tab "explore")
           └─> wordApi.getPublicTopics()
               └─> GET /word/topics
                   └─> Backend: wordClientService.getTopicPublic()
                       └─> Trả về danh sách topics hệ thống
                           └─> Transform data → Render FlashcardCard
```

### **Luồng Flashcard Cá Nhân:**

```
1. User vào tab "my-lists"
   └─> Flashcard.jsx
       └─> useUserTopics()
           └─> wordApi.getUserTopics()
               └─> GET /word/topics/user
                   └─> Backend: wordClientService.getTopicByUser(userId)
                       └─> Trả về danh sách topics của user
                           └─> Transform data → Render FlashcardCard
```

### **Luồng Xem Chi Tiết Set:**

```
1. User click vào một topic
   └─> FlashcardDetail.jsx
       └─> useWordsBySet(setId)
           └─> wordApi.getWordsBySet(setId)
               └─> GET /word/flashcard/set/:set_id/words
                   └─> Backend: wordClientService.getWordsBySet(setId)
                       └─> Trả về danh sách words trong set
                           └─> Transform data → Render Flashcard UI
```

### **Luồng Tạo Set Mới:**

```
1. User click "Tạo set mới"
   └─> useCreateSet()
       └─> wordApi.createSet({ topic_name, description })
           └─> POST /word/topics/sets
               └─> Backend: wordClientService.createSet(userId, topic_name, description)
                   └─> Tạo Topic mới trong DB
                       └─> Trả về topic mới
                           └─> Invalidate queries → Refetch danh sách topics
```

---

## 📊 BACKEND API ENDPOINTS

Tất cả các API endpoints đã có sẵn trong backend:

### **Routes:** `backend/src/client/routes/wordClientRoute.js`

```
GET    /word/topics                    - Lấy danh sách topic công khai
GET    /word/topics/user               - Lấy danh sách topic của user
POST   /word/topics/sets               - Tạo set mới
GET    /word/flashcard/set/:set_id     - Lấy chi tiết set
GET    /word/flashcard/set/:set_id/words - Lấy từ vựng trong set
POST   /word/flashcard/set/item        - Thêm từ vào set
PATCH  /word/flashcard/user/:user_word_id - Cập nhật từ vựng
DELETE /word/flashcard/user/:user_word_id - Xóa từ vựng
POST   /word/status/mark               - Đánh dấu đã học
POST   /word/status/unmark             - Bỏ đánh dấu đã học
GET    /word/learning/today            - Từ vựng cần học hôm nay
GET    /word/learning/next              - Từ vựng tiếp theo
POST   /word/learning/:word_id/feedback - Gửi feedback
GET    /word/progress/overview          - Tổng quan tiến độ
GET    /word/progress/daily             - Tiến độ theo ngày
GET    /word/practice/vocab             - Tạo quiz
POST   /word/practice/vocab/submit      - Nộp bài quiz
POST   /word/pronunciation/assess       - Chấm điểm phát âm
GET    /word/pronunciation/history/:word_id - Lịch sử chấm điểm
GET    /word/pronunciation/stats        - Thống kê phát âm
```

---

## 🎨 CÁCH SỬ DỤNG

### **1. Sử dụng trong Component:**

```javascript
import { usePublicTopics, useWordsBySet } from "../../services/Word/wordQueries";
import { useCreateSet, useAddWordToSet } from "../../services/Word/wordMutations";

function MyComponent() {
  // Fetch data
  const { data, isLoading, error } = usePublicTopics();
  
  // Mutations
  const createSetMutation = useCreateSet();
  
  const handleCreateSet = () => {
    createSetMutation.mutate({
      topic_name: "My Set",
      description: "Description"
    });
  };
  
  return (
    // Render UI
  );
}
```

### **2. Sử dụng API trực tiếp:**

```javascript
import { wordApi } from "../../api/Word/wordApi";

// Trong async function
const topics = await wordApi.getPublicTopics();
const words = await wordApi.getWordsBySet(setId);
```

---

## ✅ CHECKLIST

- [x] Tạo file `wordApi.js` với đầy đủ API calls
- [x] Tạo file `wordQueries.js` với React Query hooks
- [x] Tạo file `wordMutations.js` với mutations và error handling
- [x] Cập nhật `Flashcard.jsx` để sử dụng API thật
- [x] Cập nhật `FlashcardDetail.jsx` để sử dụng API thật
- [x] Thêm loading states
- [x] Thêm empty states
- [x] Transform data từ API sang format component
- [x] Error handling và toast notifications

---

## 🔍 LƯU Ý

1. **Import Path:** 
   - API: `import { wordApi } from "../../api/Word/wordApi"`
   - Queries: `import { usePublicTopics } from "../../services/Word/wordQueries"`
   - Mutations: `import { useCreateSet } from "../../services/Word/wordMutations"`

2. **Data Format:**
   - Backend trả về format: `{ EM, EC, DT }`
   - Component cần transform sang format riêng

3. **Error Handling:**
   - Mutations tự động hiển thị toast
   - Queries cần check `data?.EC === "0"` trước khi dùng

4. **Cache:**
   - Queries tự động cache theo `staleTime`
   - Mutations tự động invalidate queries để refetch

---

## 📝 TODO (Nếu cần)

- [ ] Thêm API để lấy word count và view count cho topics
- [ ] Thêm API riêng cho "learning" topics
- [ ] Thêm pagination cho danh sách topics
- [ ] Thêm search/filter cho topics
- [ ] Thêm API để shuffle words trong set
- [ ] Thêm API để đánh dấu "favorite" cho topics

---

**Tài liệu được tạo:** `2024-01-XX`  
**Phiên bản:** `1.0.0`  
**Trạng thái:** ✅ Hoàn tất implementation




























