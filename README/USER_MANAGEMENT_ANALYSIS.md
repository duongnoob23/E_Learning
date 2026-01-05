# User Management - Phân tích & Đề xuất cải thiện

## Tổng quan
Document này phân tích phần quản lý User hiện tại và đề xuất các cải thiện để quản lý toàn diện hơn.

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### 1.1. Thông tin hiện có trong UserDetailModal

**Tab: Info (Thông tin cơ bản)**
- User ID
- Username
- Full Name
- Email (với verified status)
- Phone (với verified status)
- Status (active/banned/inactive)
- Created At
- Updated At
- Last Login

**Tab: Enrollments (Khóa học)**
- Danh sách khóa học đã đăng ký
- Giá khóa học
- Tiến độ học tập (%)
- Trạng thái enrollment
- Ngày đăng ký

**Tab: Payments (Giao dịch)**
- Mã đơn hàng
- Khóa học trong đơn
- Số tiền
- Phương thức thanh toán
- Trạng thái thanh toán
- Ngày tạo

**Stats Summary:**
- Tổng số khóa học
- Số khóa học đã hoàn thành
- Tổng chi tiêu

---

### 1.2. Thông tin THIẾU (cần bổ sung)

#### A. EXAM/TEST RESULTS (Kết quả bài thi)
**Hiện tại:** ❌ Không có

**Cần có:**
- Danh sách bài thi đã làm
- Điểm số từng bài thi
- Điểm trung bình
- Số lần làm bài
- Thời gian làm bài
- Ngày làm bài
- Chi tiết từng phần (Listening, Reading, Speaking, Writing)
- Lịch sử cải thiện điểm số

**Database có sẵn:**
- `exam_sessions` - Lưu session làm bài
- `user_exam_statistics` - Thống kê tổng quan
- `user_answers` - Câu trả lời chi tiết
- `part_statistics` - Thống kê theo phần

**API cần:**
```
GET /admin/users/:user_id/exams
GET /admin/users/:user_id/exam-statistics
GET /admin/users/:user_id/exam-history
```

---

#### B. FLASHCARD LEARNING PROGRESS (Tiến độ học Flashcard)
**Hiện tại:** ❌ Không có

**Cần có:**
- Danh sách topics đã học
- Số từ đã học (learned)
- Số từ đang học
- Số từ chưa học
- Tiến độ từng topic (%)
- Số ngày học liên tiếp (streak)
- Tổng thời gian học
- Từ khó nhất (sai nhiều nhất)
- Từ dễ nhất (thuộc nhanh nhất)

**Database có sẵn:**
- `user_word_status` - Trạng thái học từ (is_learned, marked_at)
- `favorite_topics` - Topics yêu thích
- `topics` - Topics (có thể filter theo created_by để tìm topics user tạo)

**API cần:**
```
GET /admin/users/:user_id/flashcard-progress
GET /admin/users/:user_id/flashcard-topics
GET /admin/users/:user_id/flashcard-statistics
GET /admin/users/:user_id/flashcard-streak
```

---

#### C. USER-CREATED TOPICS (Topics người dùng tạo)
**Hiện tại:** ❌ Không có

**Cần có:**
- Danh sách topics user đã tạo
- Số từ trong mỗi topic
- Số người học topic đó
- Trạng thái topic (active/inactive)
- Ngày tạo topic

**Database có sẵn:**
- `topics` - Filter theo `created_by = user_id` và `topic_type = 'user_created'`

**API cần:**
```
GET /admin/users/:user_id/created-topics
```

---

#### D. LEARNING ACTIVITY TIMELINE (Timeline hoạt động)
**Hiện tại:** ❌ Không có

**Cần có:**
- Timeline các hoạt động:
  - Đăng ký khóa học
  - Hoàn thành lesson
  - Làm bài thi
  - Học flashcard
  - Tạo topic
- Sắp xếp theo thời gian
- Filter theo loại hoạt động

**API cần:**
```
GET /admin/users/:user_id/activity-timeline
```

---

#### E. PERFORMANCE METRICS (Chỉ số hiệu suất)
**Hiện tại:** ⚠️ Chỉ có cơ bản

**Cần bổ sung:**
- **Course Performance:**
  - Completion rate (%)
  - Average study time per course
  - Courses in progress
  - Courses completed
  - Courses dropped
  
- **Exam Performance:**
  - Average score
  - Best score
  - Worst score
  - Improvement trend
  - Most practiced exam type
  
- **Flashcard Performance:**
  - Words learned per day
  - Retention rate
  - Study consistency (streak)
  - Favorite topics

**API cần:**
```
GET /admin/users/:user_id/performance-metrics
```

---

## 2. ĐỀ XUẤT CẢI THIỆN

### 2.1. Cấu trúc UserDetailModal mới

```
┌─────────────────────────────────────────┐
│  User Details - [Username]              │
├─────────────────────────────────────────┤
│  [Stats Cards]                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Courses│ │ Exams │ │Words │ │Topics│  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│  [Tabs]                                  │
│  Info | Courses | Exams | Flashcards |  │
│  Topics | Activity | Performance        │
└─────────────────────────────────────────┘
```

### 2.2. Tab mới cần thêm

#### Tab: Exams
**Nội dung:**
- **Summary Stats:**
  - Tổng số bài thi đã làm
  - Điểm trung bình
  - Điểm cao nhất
  - Điểm thấp nhất
  - Số lần làm bài
  
- **Exam History Table:**
  - Exam name
  - Exam type (TOEIC/IELTS)
  - Date taken
  - Score (tổng điểm)
  - Listening score
  - Reading score
  - Speaking score (nếu có)
  - Writing score (nếu có)
  - Duration
  - Status (completed/incomplete)
  - Actions (View Details)

- **Score Trend Chart:**
  - Line chart hiển thị điểm số theo thời gian
  - Có thể filter theo exam type

- **Performance by Part:**
  - Bar chart hiển thị điểm trung bình từng phần
  - So sánh với điểm trung bình hệ thống

**UI Components:**
- Stats cards
- Data table với pagination
- Chart (Line chart, Bar chart)
- Filter dropdown (by exam type, date range)

---

#### Tab: Flashcards
**Nội dung:**
- **Summary Stats:**
  - Tổng số từ đã học
  - Tổng số topics đã học
  - Study streak (ngày liên tiếp)
  - Tổng thời gian học
  - Retention rate (%)
  
- **Topics Progress Table:**
  - Topic name
  - Total words
  - Words learned
  - Words learning
  - Progress (%)
  - Last studied
  - Actions (View Details)

- **Learning Activity:**
  - Calendar view hiển thị ngày học
  - Words learned per day chart
  - Study time per day chart

- **Challenging Words:**
  - Top 10 từ sai nhiều nhất
  - Top 10 từ học lâu nhất mới thuộc

**UI Components:**
- Stats cards
- Progress bars
- Calendar component
- Chart (Bar chart, Line chart)
- Data table

---

#### Tab: Created Topics
**Nội dung:**
- **Summary:**
  - Tổng số topics đã tạo
  - Tổng số từ trong các topics
  - Số người học topics của user
  
- **Topics Table:**
  - Topic name
  - Description
  - Word count
  - Learners count
  - Status (active/inactive)
  - Created date
  - Actions (View, Edit, Delete)

**UI Components:**
- Stats cards
- Data table với actions
- Link đến topic detail

---

#### Tab: Activity Timeline
**Nội dung:**
- **Timeline View:**
  - Chronological list of activities
  - Group by date
  - Filter by activity type:
    - Course enrollment
    - Lesson completion
    - Exam taken
    - Flashcard studied
    - Topic created
    - Payment made

- **Activity Types với Icons:**
  - 📚 Course enrollment
  - ✅ Lesson completed
  - 📝 Exam taken
  - 📖 Flashcard studied
  - 📁 Topic created
  - 💳 Payment made

**UI Components:**
- Timeline component
- Filter chips
- Date range picker
- Activity cards

---

#### Tab: Performance
**Nội dung:**
- **Overall Performance Score:**
  - Composite score (0-100) dựa trên:
    - Course completion rate
    - Exam average score
    - Flashcard retention rate
    - Study consistency

- **Course Performance:**
  - Completion rate chart
  - Study time distribution
  - Courses by status (pie chart)

- **Exam Performance:**
  - Score trend (line chart)
  - Score distribution (histogram)
  - Performance by exam type (bar chart)
  - Improvement rate

- **Flashcard Performance:**
  - Learning curve
  - Retention rate over time
  - Study consistency (streak calendar)

- **Recommendations:**
  - AI-powered suggestions:
    - "Your exam scores are improving! Try a harder exam."
    - "You haven't studied flashcards in 3 days. Continue your streak!"
    - "Complete this course to unlock new content."

**UI Components:**
- Score cards
- Multiple chart types (Line, Bar, Pie, Histogram)
- Recommendation cards
- Progress indicators

---

## 3. BACKEND API CẦN BỔ SUNG

### 3.1. Exam APIs

```javascript
// GET /admin/users/:user_id/exams
// Trả về danh sách bài thi user đã làm
{
  exams: [
    {
      exam_session_id,
      test_id,
      test_name,
      exam_type,
      started_at,
      completed_at,
      duration_minutes,
      total_score,
      listening_score,
      reading_score,
      speaking_score,
      writing_score,
      status
    }
  ],
  pagination: {...},
  statistics: {
    total_exams: 10,
    average_score: 85.5,
    best_score: 95,
    worst_score: 70,
    improvement_rate: 5.2 // %
  }
}

// GET /admin/users/:user_id/exam-statistics
// Thống kê chi tiết về exam performance
{
  overall: {
    total_exams: 10,
    average_score: 85.5,
    best_score: 95,
    worst_score: 70
  },
  by_type: {
    TOEIC: { count: 7, average: 87 },
    IELTS: { count: 3, average: 82 }
  },
  by_part: {
    LISTENING: { average: 88, best: 95 },
    READING: { average: 83, best: 90 },
    SPEAKING: { average: 85, best: 92 },
    WRITING: { average: 80, best: 88 }
  },
  trend: [
    { date: "2024-01-01", score: 75 },
    { date: "2024-01-15", score: 80 },
    { date: "2024-02-01", score: 85 }
  ]
}
```

---

### 3.2. Flashcard APIs

```javascript
// GET /admin/users/:user_id/flashcard-progress
// Tiến độ học flashcard
{
  overall: {
    total_words_learned: 500,
    total_topics_studied: 15,
    study_streak: 7, // days
    total_study_time_minutes: 1200,
    retention_rate: 85.5 // %
  },
  topics: [
    {
      topic_id,
      topic_name,
      total_words: 50,
      words_learned: 40,
      words_learning: 5,
      words_new: 5,
      progress_percent: 80,
      last_studied_at
    }
  ],
  challenging_words: [
    {
      word_id,
      word,
      meaning_vi,
      times_wrong: 10,
      times_studied: 15
    }
  ],
  learning_activity: [
    { date: "2024-01-01", words_learned: 10, study_time: 30 },
    { date: "2024-01-02", words_learned: 15, study_time: 45 }
  ]
}

// GET /admin/users/:user_id/flashcard-statistics
// Thống kê chi tiết
{
  words_learned_per_day: [10, 15, 12, ...],
  study_time_per_day: [30, 45, 35, ...],
  retention_rate_trend: [
    { date: "2024-01-01", rate: 80 },
    { date: "2024-01-15", rate: 85 }
  ],
  streak_history: [
    { start_date: "2024-01-01", end_date: "2024-01-07", days: 7 }
  ]
}
```

---

### 3.3. Created Topics API

```javascript
// GET /admin/users/:user_id/created-topics
{
  topics: [
    {
      topic_id,
      topic_name,
      description,
      word_count: 50,
      learners_count: 100, // Số người học topic này
      is_active: true,
      created_at,
      updated_at
    }
  ],
  statistics: {
    total_topics: 5,
    total_words: 250,
    total_learners: 500,
    average_words_per_topic: 50
  }
}
```

---

### 3.4. Activity Timeline API

```javascript
// GET /admin/users/:user_id/activity-timeline
{
  activities: [
    {
      activity_id,
      activity_type: "course_enrollment" | "lesson_completion" | 
                     "exam_taken" | "flashcard_studied" | 
                     "topic_created" | "payment_made",
      title: "Enrolled in TOEIC Course",
      description: "User enrolled in TOEIC Preparation Course",
      related_id: 123, // course_id, exam_session_id, etc.
      related_type: "course",
      created_at
    }
  ],
  pagination: {...}
}
```

---

### 3.5. Performance Metrics API

```javascript
// GET /admin/users/:user_id/performance-metrics
{
  overall_score: 85.5, // Composite score 0-100
  course_performance: {
    completion_rate: 75, // %
    average_study_time: 120, // minutes per course
    courses_in_progress: 3,
    courses_completed: 5,
    courses_dropped: 1
  },
  exam_performance: {
    average_score: 85.5,
    best_score: 95,
    worst_score: 70,
    improvement_rate: 5.2, // % per month
    most_practiced_type: "TOEIC"
  },
  flashcard_performance: {
    words_learned_per_day: 12.5,
    retention_rate: 85.5, // %
    study_consistency: 0.8, // 0-1, based on streak
    favorite_topics: ["Business", "Travel"]
  },
  recommendations: [
    {
      type: "exam",
      message: "Your exam scores are improving! Try a harder exam.",
      action_url: "/exams?filter=advanced"
    },
    {
      type: "flashcard",
      message: "You haven't studied flashcards in 3 days. Continue your streak!",
      action_url: "/flashcards"
    }
  ]
}
```

---

## 4. IMPLEMENTATION PLAN

### Phase 1: Backend APIs (Ưu tiên cao)
1. ✅ Exam APIs
   - `getUserExams(user_id)`
   - `getUserExamStatistics(user_id)`
   
2. ✅ Flashcard APIs
   - `getUserFlashcardProgress(user_id)`
   - `getUserFlashcardStatistics(user_id)`
   
3. ✅ Created Topics API
   - `getUserCreatedTopics(user_id)`
   
4. ✅ Activity Timeline API
   - `getUserActivityTimeline(user_id)`
   
5. ✅ Performance Metrics API
   - `getUserPerformanceMetrics(user_id)`

### Phase 2: Frontend Components
1. ✅ Update `UserDetailModal.jsx`
   - Thêm tabs mới: Exams, Flashcards, Topics, Activity, Performance
   - Tạo components cho từng tab
   
2. ✅ Create Chart Components
   - LineChart (score trend)
   - BarChart (performance by part)
   - PieChart (course status)
   - Calendar (study activity)
   
3. ✅ Create Stats Cards
   - Reusable stat card component
   
4. ✅ Update API hooks
   - `useUserExams(userId)`
   - `useUserFlashcardProgress(userId)`
   - `useUserCreatedTopics(userId)`
   - `useUserActivityTimeline(userId)`
   - `useUserPerformanceMetrics(userId)`

### Phase 3: UI/UX Enhancements
1. ✅ Loading states
2. ✅ Error handling
3. ✅ Empty states
4. ✅ Tooltips & help text
5. ✅ Responsive design

---

## 5. DATABASE QUERIES (Sử dụng bảng có sẵn)

### 5.1. Exam Queries

```sql
-- Lấy danh sách exam sessions của user
SELECT 
  es.exam_session_id,
  t.test_id,
  t.test_name,
  t.exam_type,
  es.started_at,
  es.completed_at,
  es.total_score,
  es.listening_score,
  es.reading_score,
  es.speaking_score,
  es.writing_score,
  es.status
FROM exam_sessions es
JOIN tests t ON es.test_id = t.test_id
WHERE es.user_id = ?
ORDER BY es.started_at DESC;

-- Thống kê exam
SELECT 
  COUNT(*) as total_exams,
  AVG(total_score) as average_score,
  MAX(total_score) as best_score,
  MIN(total_score) as worst_score
FROM exam_sessions
WHERE user_id = ? AND status = 'completed';
```

### 5.2. Flashcard Queries

```sql
-- Tiến độ học flashcard theo topic
SELECT 
  t.topic_id,
  t.topic_name,
  COUNT(DISTINCT w.word_id) as total_words,
  COUNT(DISTINCT CASE WHEN uws.is_learned = 1 THEN w.word_id END) as words_learned,
  COUNT(DISTINCT CASE WHEN uws.is_learned = 0 AND uws.user_id IS NOT NULL THEN w.word_id END) as words_learning,
  COUNT(DISTINCT CASE WHEN uws.user_id IS NULL THEN w.word_id END) as words_new,
  MAX(uws.marked_at) as last_studied_at
FROM topics t
LEFT JOIN words w ON t.topic_id = w.topic_id AND w.is_active = 1
LEFT JOIN user_word_status uws ON w.word_id = uws.word_id AND uws.user_id = ?
WHERE t.is_active = 1
GROUP BY t.topic_id, t.topic_name;

-- Study streak
SELECT 
  DATE(marked_at) as study_date,
  COUNT(*) as words_studied
FROM user_word_status
WHERE user_id = ? AND is_learned = 1
GROUP BY DATE(marked_at)
ORDER BY study_date DESC;
```

### 5.3. Created Topics Query

```sql
-- Topics user đã tạo
SELECT 
  t.topic_id,
  t.topic_name,
  t.description,
  t.word_count,
  t.is_active,
  t.created_at,
  COUNT(DISTINCT uws.user_id) as learners_count
FROM topics t
LEFT JOIN words w ON t.topic_id = w.topic_id
LEFT JOIN user_word_status uws ON w.word_id = uws.word_id
WHERE t.created_by = ? AND t.topic_type = 'user_created'
GROUP BY t.topic_id;
```

---

## 6. UI MOCKUP SUGGESTIONS

### Tab: Exams
```
┌─────────────────────────────────────────┐
│  Exam Performance                      │
├─────────────────────────────────────────┤
│  [10 Exams] [85.5 Avg] [95 Best] [70]  │
├─────────────────────────────────────────┤
│  Score Trend                            │
│  [Line Chart: Score over time]          │
├─────────────────────────────────────────┤
│  Exam History                           │
│  ┌──────────────────────────────────┐  │
│  │ Exam Name | Type | Date | Score  │  │
│  │ TOEIC #1  | TOEIC| 1/1  | 85    │  │
│  │ TOEIC #2  | TOEIC| 1/15 | 90    │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Tab: Flashcards
```
┌─────────────────────────────────────────┐
│  Flashcard Progress                     │
├─────────────────────────────────────────┤
│  [500 Words] [15 Topics] [7 Day Streak] │
├─────────────────────────────────────────┤
│  Topics Progress                        │
│  ┌──────────────────────────────────┐  │
│  │ Topic | Words | Progress | Last  │  │
│  │ Business | 50/50 | 100% | Today  │  │
│  │ Travel  | 30/40 | 75%  | 2d ago │  │
│  └──────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  Study Calendar                         │
│  [Calendar with highlighted study days] │
└─────────────────────────────────────────┘
```

---

## 7. PRIORITY IMPLEMENTATION

### High Priority (Làm ngay):
1. ✅ **Exam Tab** - Quan trọng nhất, user cần xem điểm số
2. ✅ **Flashcard Tab** - User học flashcard nhiều
3. ✅ **Created Topics Tab** - User tạo topics

### Medium Priority:
4. ⚠️ **Activity Timeline** - Nice to have
5. ⚠️ **Performance Tab** - Tổng hợp, có thể làm sau

---

## 8. KẾT LUẬN

Phần quản lý User hiện tại chỉ mới có thông tin cơ bản và khóa học. Cần bổ sung:
- ✅ Exam results & statistics
- ✅ Flashcard learning progress
- ✅ User-created topics
- ✅ Activity timeline
- ✅ Performance metrics

Tất cả đều có thể implement bằng cách query từ các bảng đã có sẵn, không cần thêm bảng mới.

