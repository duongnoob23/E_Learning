# User Progress Management - Data Model Analysis

## Mục đích

Document này kiểm tra **KHẢ NĂNG QUẢN LÝ TIẾN ĐỘ HỌC TẬP** của user dựa trên **DATA MODEL HIỆN TẠI**, không phỏng đoán hay đề xuất tính năng mới một cách cảm tính.

---

## PHẦN 1: KIỂM TRA TIẾN ĐỘ FLASHCARD

### 1.1. Bảng liên quan

#### A. `user_word_status` (UserWordStatus)

**Mục đích:** Lưu trạng thái học từ của user

**Fields:**

- `status_id` (PK)
- `user_id` - User học từ
- `topic_id` - Topic chứa từ
- `word_id` - Từ vựng (có thể null)
- `user_word_id` - Từ user tự tạo (có thể null)
- `is_learned` (BOOLEAN) - Đã thuộc hay chưa
- `marked_at` (DATE) - Thời gian đánh dấu đã học
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- User đã học word nào: `SELECT * FROM user_word_status WHERE user_id = ? AND word_id = ?`
- Word đang ở trạng thái nào:
  - **Chưa học:** Không có record trong `user_word_status` với `word_id` đó
  - **Đang học:** Có record nhưng `is_learned = false`
  - **Đã thuộc:** Có record và `is_learned = true`
- Thời gian học: `marked_at`

**Thiếu:**
⚠️ **KHÔNG CÓ** field để phân biệt:

- Số lần review từ đó
- Độ khó của từ đối với user
- Thời gian học trung bình
- Số lần sai trước khi thuộc

**Kết luận:** ✅ **ĐỦ CƠ BẢN** để quản lý trạng thái học từ (chưa học/đang học/đã thuộc)

---

#### B. `topics` (Topic)

**Mục đích:** Lưu thông tin chủ đề flashcard

**Fields:**

- `topic_id` (PK)
- `topic_name`
- `description`
- `topic_type` (system/user_created)
- `created_by` - User tạo topic (nếu là user_created)
- `word_count` - Số từ trong topic
- `is_active`, `is_public`
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Topics user đã tạo: `SELECT * FROM topics WHERE created_by = ? AND topic_type = 'user_created'`
- Số từ trong mỗi topic: `word_count`

**Thiếu:**
⚠️ **KHÔNG CÓ** field để:

- Theo dõi số người học topic
- Lưu thống kê học tập của topic

**Kết luận:** ✅ **ĐỦ** để quản lý topics user tạo

---

#### C. `words` (Word)

**Mục đích:** Lưu từ vựng hệ thống

**Fields:**

- `word_id` (PK)
- `topic_id` - Topic chứa từ
- `word`, `pronunciation`, `meaning_vi`
- `example_en`, `example_vi`
- `image_url`, `audio_url`
- `is_active`
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Từ nào thuộc topic nào: `topic_id`
- Từ nào đang active: `is_active`

**Kết luận:** ✅ **ĐỦ** để quản lý từ vựng

---

#### D. `user_words` (UserWord)

**Mục đích:** Lưu từ user tự tạo (không phải từ hệ thống)

**Fields:**

- `user_word_id` (PK)
- `user_id` - User tạo từ
- `topic_id` - Topic chứa từ
- `word`, `meaning_vi`, `pronunciation`
- `from_system_word_id` - Link đến word hệ thống (nếu có)
- `is_active`
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Từ user tự tạo: `SELECT * FROM user_words WHERE user_id = ?`
- Topics user đã thêm từ vào: `SELECT DISTINCT topic_id FROM user_words WHERE user_id = ?`

**Kết luận:** ✅ **ĐỦ** để quản lý từ user tự tạo

---

#### E. `favorite_topics` (FavoriteTopic)

**Mục đích:** Lưu topics user yêu thích

**Fields:**

- `favorite_id` (PK)
- `user_id`
- `topic_id`
- `added_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Topics user đã favorite: `SELECT * FROM favorite_topics WHERE user_id = ?`

**Kết luận:** ✅ **ĐỦ** để quản lý favorite topics

---

### 1.2. Tổng hợp khả năng quản lý Flashcard

| Chức năng                            | Bảng/Model                    | Đã đủ?      | Ghi chú                                                       |
| ------------------------------------ | ----------------------------- | ----------- | ------------------------------------------------------------- |
| User đã học word nào                 | `user_word_status`            | ✅ ĐỦ       | Query theo `user_id` + `word_id`                              |
| Trạng thái word (chưa/đang/đã thuộc) | `user_word_status.is_learned` | ✅ ĐỦ       | `is_learned = false/null` = chưa học, `true` = đã thuộc       |
| Thời gian học word                   | `user_word_status.marked_at`  | ✅ ĐỦ       | Có field `marked_at`                                          |
| User đã học topic nào                | `user_word_status` + `words`  | ✅ ĐỦ       | JOIN để tìm topics có words đã học                            |
| Tiến độ topic (%)                    | `user_word_status` + `words`  | ✅ ĐỦ       | Tính: `(words_learned / total_words) * 100`                   |
| Topics user đã tạo                   | `topics`                      | ✅ ĐỦ       | Filter `created_by = user_id` + `topic_type = 'user_created'` |
| Topics user favorite                 | `favorite_topics`             | ✅ ĐỦ       | Query theo `user_id`                                          |
| Số lần review từ                     | ❌                            | ⚠️ THIẾU    | Không có field lưu số lần review                              |
| Study streak (ngày liên tiếp)        | `user_word_status.marked_at`  | ⚠️ CẦN TÍNH | Có thể tính từ `marked_at` nhưng không có field riêng         |
| Tổng thời gian học                   | ❌                            | ⚠️ THIẾU    | Không có field lưu thời gian học                              |

**KẾT LUẬN FLASHCARD:**

- ✅ **ĐỦ CƠ BẢN** để quản lý:
  - Trạng thái học từ (chưa/đang/đã thuộc)
  - Tiến độ học topic (%)
  - Topics user đã tạo
  - Topics user đã học
- ⚠️ **THIẾU** (nhưng không bắt buộc):
  - Số lần review từ
  - Study streak (có thể tính từ `marked_at`)
  - Tổng thời gian học

**CÓ THỂ LÀM ĐƯỢC:** ✅ Quản lý tiến độ flashcard cơ bản

---

## PHẦN 2: KIỂM TRA TIẾN ĐỘ LÀM BÀI THI (EXAM)

### 2.1. Bảng liên quan

#### A. `exam_sessions` (ExamSession)

**Mục đích:** Lưu mỗi lần user làm bài thi

**Fields:**

- `exam_session_id` (PK)
- `user_id` - User làm bài
- `test_id` - Bài thi
- `session_type` (FULL_TEST/PRACTICE/REVIEW)
- `start_time`, `end_time` - Thời gian bắt đầu/kết thúc
- `duration_seconds` - Thời gian làm bài (giây)
- `total_score` - Tổng điểm
- `correct_answers`, `wrong_answers`, `skipped_answers` - Số câu đúng/sai/bỏ qua
- `status` (IN_PROGRESS/COMPLETED/ABANDONED)
- `selected_parts` (JSON) - Các phần đã chọn
- `time_limit_minutes` - Thời gian giới hạn
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- User đã làm bài thi nào: `SELECT * FROM exam_sessions WHERE user_id = ?`
- Mỗi bài thi làm bao nhiêu lần: `SELECT COUNT(*) FROM exam_sessions WHERE user_id = ? AND test_id = ?`
- Mỗi lần điểm bao nhiêu: `total_score`
- Kết quả từng lần: `correct_answers`, `wrong_answers`, `total_score`
- Lần làm gần nhất: `ORDER BY created_at DESC LIMIT 1`
- Thời gian làm bài: `duration_seconds`
- Trạng thái: `status`

**Thiếu:**
⚠️ **KHÔNG CÓ** field để:

- Lưu điểm từng phần (Listening, Reading, Speaking, Writing) riêng biệt trong `exam_sessions`
- Lưu chi tiết điểm từng part

**Kết luận:** ✅ **ĐỦ** để quản lý lịch sử làm bài thi cơ bản

---

#### B. `user_exam_statistics` (UserExamStatistics)

**Mục đích:** Thống kê tổng quan về exam của user

**Fields:**

- `user_exam_stat_id` (PK)
- `user_id`
- `total_tests_taken` - Tổng số bài thi đã làm
- `total_questions_answered` - Tổng số câu đã trả lời
- `total_correct_answers` - Tổng số câu đúng
- `average_score` (DECIMAL) - Điểm trung bình
- `best_score` (INTEGER) - Điểm cao nhất
- `total_study_time_seconds` - Tổng thời gian học (giây)
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Tổng số bài thi đã làm: `total_tests_taken`
- Điểm trung bình: `average_score`
- Điểm cao nhất: `best_score`
- Tổng thời gian học: `total_study_time_seconds`

**Thiếu:**
⚠️ **KHÔNG CÓ** field để:

- Phân biệt điểm theo exam type (TOEIC/IELTS)
- Phân biệt điểm theo part (Listening/Reading/Speaking/Writing)

**Kết luận:** ✅ **ĐỦ** để quản lý thống kê tổng quan

---

#### C. `part_statistics` (PartStatistics)

**Mục đích:** Thống kê theo từng phần (Part) của exam

**Fields:**

- `part_stat_id` (PK)
- `user_id`
- `part_id` - Part (Listening Part 1, Reading Part 5, etc.)
- `exam_session_id` - Session làm bài
- `total_attempts` - Tổng số lần làm part này
- `total_questions` - Tổng số câu
- `correct_answers` - Số câu đúng
- `accuracy_rate` (DECIMAL) - Tỷ lệ đúng (%)
- `last_attempt` (DATE) - Lần làm gần nhất
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Điểm từng part: `accuracy_rate`
- Số lần làm part: `total_attempts`
- Lần làm gần nhất: `last_attempt`
- Số câu đúng/sai: `correct_answers`, `total_questions`

**Kết luận:** ✅ **ĐỦ** để quản lý thống kê theo part

---

#### D. `user_answers` (UserAnswer)

**Mục đích:** Lưu câu trả lời chi tiết của user

**Fields:**

- `user_answer_id` (PK)
- `exam_session_id` - Session làm bài
- `question_id` - Câu hỏi
- `selected_choice_id` - Lựa chọn user chọn
- `answer_time` - Thời gian trả lời
- `is_correct` (BOOLEAN) - Đúng hay sai
- `created_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Câu nào user trả lời đúng/sai: `is_correct`
- Câu nào user đã trả lời: Có record trong bảng
- Thời gian trả lời: `answer_time`

**Kết luận:** ✅ **ĐỦ** để quản lý câu trả lời chi tiết

---

#### E. `tests` (Test)

**Mục đích:** Lưu thông tin bài thi

**Fields:** (Cần đọc để xác nhận)

- `test_id` (PK)
- `title` - Tên bài thi
- `exam_type` (TOEIC/IELTS/HSK/THPT)
- `duration_minutes` - Thời gian làm bài
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Loại bài thi: `exam_type`
- Tên bài thi: `title`

**Kết luận:** ✅ **ĐỦ** để quản lý thông tin bài thi

---

### 2.2. Tổng hợp khả năng quản lý Exam

| Chức năng                              | Bảng/Model                             | Đã đủ?          | Ghi chú                                          |
| -------------------------------------- | -------------------------------------- | --------------- | ------------------------------------------------ |
| User đã làm bài thi nào                | `exam_sessions`                        | ✅ ĐỦ           | Query theo `user_id`                             |
| Mỗi bài thi làm bao nhiêu lần          | `exam_sessions`                        | ✅ ĐỦ           | `COUNT(*) GROUP BY test_id`                      |
| Mỗi lần điểm bao nhiêu                 | `exam_sessions.total_score`            | ✅ ĐỦ           | Có field `total_score`                           |
| Kết quả từng lần (đúng/sai)            | `exam_sessions` + `user_answers`       | ✅ ĐỦ           | `correct_answers`, `wrong_answers`, `is_correct` |
| Điểm trung bình của user               | `user_exam_statistics.average_score`   | ✅ ĐỦ           | Có field `average_score`                         |
| Lần làm gần nhất                       | `exam_sessions.created_at`             | ✅ ĐỦ           | `ORDER BY created_at DESC`                       |
| Điểm từng phần (Listening/Reading)     | `part_statistics`                      | ✅ ĐỦ           | Query theo `part_id`                             |
| Điểm Speaking/Writing                  | `exam_sessions` hoặc `part_statistics` | ⚠️ CẦN KIỂM TRA | Cần xem có lưu riêng không                       |
| Thời gian làm bài                      | `exam_sessions.duration_seconds`       | ✅ ĐỦ           | Có field `duration_seconds`                      |
| Trạng thái (đang làm/hoàn thành/bỏ dở) | `exam_sessions.status`                 | ✅ ĐỦ           | Có field `status`                                |

**KẾT LUẬN EXAM:**

- ✅ **ĐỦ** để quản lý:
  - Lịch sử làm bài thi
  - Điểm số từng lần
  - Điểm trung bình
  - Thống kê theo part
  - Câu trả lời chi tiết

**CÓ THỂ LÀM ĐƯỢC:** ✅ Quản lý tiến độ exam đầy đủ

---

## PHẦN 3: KIỂM TRA TIẾN ĐỘ KHÓA HỌC (COURSE)

### 3.1. Bảng liên quan

#### A. `course_enrollments` (CourseEnrollment)

**Mục đích:** Lưu thông tin user đăng ký khóa học

**Fields:**

- `enrollment_id` (PK)
- `user_id` - User đăng ký
- `course_id` - Khóa học
- `status` (active/completed/cancelled/expired)
- `enrolled_at` - Ngày đăng ký
- `completed_at` - Ngày hoàn thành
- `expires_at` - Ngày hết hạn
- `progress_percent` (DECIMAL) - Tiến độ (%)
- `last_accessed_lesson_id` - Bài học truy cập gần nhất
- `last_accessed_at` - Thời gian truy cập gần nhất
- `payment_amount`, `payment_method`, `payment_status`
- `transaction_id`
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- User đã mua/đăng ký khóa học nào: `SELECT * FROM course_enrollments WHERE user_id = ?`
- Đang học khóa nào: `status = 'active'`
- Tiến độ học (%): `progress_percent`
- Đã học đến bài nào: `last_accessed_lesson_id`
- Trạng thái: `status` (active/completed/cancelled/expired)
- Ngày đăng ký: `enrolled_at`
- Ngày hoàn thành: `completed_at`

**Kết luận:** ✅ **ĐỦ** để quản lý enrollment và tiến độ cơ bản

---

#### B. `lesson_progress` (LessonProgress)

**Mục đích:** Lưu tiến độ học từng lesson

**Fields:**

- `lesson_progress_id` (PK)
- `user_id`
- `lesson_id` - Bài học
- `course_id` - Khóa học
- `status` (not_started/in_progress/completed)
- `watched_duration` - Thời gian đã xem (giây)
- `total_duration` - Tổng thời gian lesson (giây)
- `completion_percent` (DECIMAL) - % hoàn thành
- `started_at` - Thời gian bắt đầu
- `completed_at` - Thời gian hoàn thành
- `last_accessed_at` - Truy cập gần nhất
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- User đã học lesson nào: `SELECT * FROM lesson_progress WHERE user_id = ?`
- Trạng thái lesson: `status` (not_started/in_progress/completed)
- Tiến độ lesson (%): `completion_percent`
- Thời gian đã xem: `watched_duration`
- Bài học đang học: `status = 'in_progress'`
- Bài học đã hoàn thành: `status = 'completed'`

**Kết luận:** ✅ **ĐỦ** để quản lý tiến độ từng lesson

---

#### C. `courses` (Course)

**Mục đích:** Lưu thông tin khóa học

**Fields:** (Cần đọc để xác nhận)

- `course_id` (PK)
- `title`, `description`
- `price`, `is_free`
- `status`
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Thông tin khóa học: `title`, `description`, `price`

**Kết luận:** ✅ **ĐỦ** để quản lý thông tin khóa học

---

#### D. `lessons` (Lesson)

**Mục đích:** Lưu thông tin bài học

**Fields:** (Cần đọc để xác nhận)

- `lesson_id` (PK)
- `course_id` - Khóa học chứa lesson
- `title`, `description`
- `order` - Thứ tự trong course
- `created_at`, `updated_at`

**Khả năng quản lý:**
✅ **CÓ THỂ** xác định:

- Lessons trong course: `SELECT * FROM lessons WHERE course_id = ? ORDER BY order`
- Thứ tự lesson: `order`

**Kết luận:** ✅ **ĐỦ** để quản lý thông tin lesson

---

### 3.2. Tổng hợp khả năng quản lý Course

| Chức năng                                 | Bảng/Model                                   | Đã đủ? | Ghi chú                                       |
| ----------------------------------------- | -------------------------------------------- | ------ | --------------------------------------------- |
| User đã mua/đăng ký khóa học nào          | `course_enrollments`                         | ✅ ĐỦ  | Query theo `user_id`                          |
| Đang học khóa nào                         | `course_enrollments.status = 'active'`       | ✅ ĐỦ  | Có field `status`                             |
| Tiến độ học của từng khóa (%)             | `course_enrollments.progress_percent`        | ✅ ĐỦ  | Có field `progress_percent`                   |
| Đã học đến bài/chương nào                 | `course_enrollments.last_accessed_lesson_id` | ✅ ĐỦ  | Có field `last_accessed_lesson_id`            |
| Trạng thái (chưa học/đang học/hoàn thành) | `course_enrollments.status`                  | ✅ ĐỦ  | `active` = đang học, `completed` = hoàn thành |
| Tiến độ từng lesson                       | `lesson_progress.completion_percent`         | ✅ ĐỦ  | Có field `completion_percent`                 |
| Thời gian đã xem lesson                   | `lesson_progress.watched_duration`           | ✅ ĐỦ  | Có field `watched_duration`                   |
| Lesson đã hoàn thành                      | `lesson_progress.status = 'completed'`       | ✅ ĐỦ  | Có field `status`                             |
| Ngày đăng ký                              | `course_enrollments.enrolled_at`             | ✅ ĐỦ  | Có field `enrolled_at`                        |
| Ngày hoàn thành                           | `course_enrollments.completed_at`            | ✅ ĐỦ  | Có field `completed_at`                       |

**KẾT LUẬN COURSE:**

- ✅ **ĐỦ** để quản lý:
  - Khóa học user đã đăng ký
  - Tiến độ học (%)
  - Bài học đang học/đã hoàn thành
  - Thời gian xem lesson

**CÓ THỂ LÀM ĐƯỢC:** ✅ Quản lý tiến độ course đầy đủ

---

## PHẦN 4: TỔNG HỢP KẾT LUẬN

### 4.1. Bảng tổng hợp

| Chức năng                            | Bảng/Model                                   | Đã đủ?      | Cần bổ sung?        |
| ------------------------------------ | -------------------------------------------- | ----------- | ------------------- |
| **FLASHCARD**                        |
| User đã học word nào                 | `user_word_status`                           | ✅ ĐỦ       | Không               |
| Trạng thái word (chưa/đang/đã thuộc) | `user_word_status.is_learned`                | ✅ ĐỦ       | Không               |
| Tiến độ topic (%)                    | `user_word_status` + `words`                 | ✅ ĐỦ       | Không               |
| Topics user đã tạo                   | `topics`                                     | ✅ ĐỦ       | Không               |
| Study streak                         | `user_word_status.marked_at`                 | ⚠️ CẦN TÍNH | Không (có thể tính) |
| **EXAM**                             |
| User đã làm bài thi nào              | `exam_sessions`                              | ✅ ĐỦ       | Không               |
| Mỗi bài thi làm bao nhiêu lần        | `exam_sessions`                              | ✅ ĐỦ       | Không               |
| Mỗi lần điểm bao nhiêu               | `exam_sessions.total_score`                  | ✅ ĐỦ       | Không               |
| Điểm trung bình                      | `user_exam_statistics.average_score`         | ✅ ĐỦ       | Không               |
| Điểm từng phần                       | `part_statistics`                            | ✅ ĐỦ       | Không               |
| Lần làm gần nhất                     | `exam_sessions.created_at`                   | ✅ ĐỦ       | Không               |
| **COURSE**                           |
| User đã đăng ký khóa học nào         | `course_enrollments`                         | ✅ ĐỦ       | Không               |
| Tiến độ học (%)                      | `course_enrollments.progress_percent`        | ✅ ĐỦ       | Không               |
| Đã học đến lesson nào                | `course_enrollments.last_accessed_lesson_id` | ✅ ĐỦ       | Không               |
| Trạng thái (đang học/hoàn thành)     | `course_enrollments.status`                  | ✅ ĐỦ       | Không               |
| Tiến độ từng lesson                  | `lesson_progress.completion_percent`         | ✅ ĐỦ       | Không               |

---

### 4.2. Kết luận cuối cùng

#### ✅ **ĐỦ DATA** để quản lý:

1. **Flashcard Progress:**

   - ✅ Trạng thái học từ (chưa/đang/đã thuộc)
   - ✅ Tiến độ học topic (%)
   - ✅ Topics user đã tạo
   - ✅ Topics user đã học
   - ⚠️ Study streak (có thể tính từ `marked_at`, không cần field mới)

2. **Exam Progress:**

   - ✅ Lịch sử làm bài thi
   - ✅ Điểm số từng lần
   - ✅ Điểm trung bình
   - ✅ Điểm từng phần (Listening/Reading/Speaking/Writing)
   - ✅ Số lần làm bài
   - ✅ Thời gian làm bài

3. **Course Progress:**
   - ✅ Khóa học đã đăng ký
   - ✅ Tiến độ học (%)
   - ✅ Bài học đang học/đã hoàn thành
   - ✅ Thời gian xem lesson

#### ⚠️ **THIẾU** (nhưng không bắt buộc):

1. **Flashcard:**

   - Số lần review từ (có thể tính từ số lần `marked_at` thay đổi)
   - Tổng thời gian học flashcard (có thể ước tính từ số lần học)

2. **Exam:**
   - Điểm Speaking/Writing chi tiết (có thể lấy từ `part_statistics` nếu có part tương ứng)

---

### 4.3. Không cần thêm bảng mới

**Tất cả thông tin cần thiết đã có sẵn trong các bảng:**

- `user_word_status` - Flashcard progress
- `exam_sessions` - Exam history
- `user_exam_statistics` - Exam statistics
- `part_statistics` - Exam part statistics
- `course_enrollments` - Course enrollment & progress
- `lesson_progress` - Lesson progress
- `topics` - User-created topics

---

## PHẦN 5: ĐỀ XUẤT API CẦN BỔ SUNG

### 5.1. Flashcard APIs

```javascript
// GET /admin/users/:user_id/flashcard-progress
// Trả về tiến độ học flashcard của user
// Query từ: user_word_status + words + topics

// GET /admin/users/:user_id/flashcard-topics
// Trả về danh sách topics user đã học
// Query từ: user_word_status + words + topics (GROUP BY topic_id)

// GET /admin/users/:user_id/created-topics
// Trả về topics user đã tạo
// Query từ: topics WHERE created_by = user_id AND topic_type = 'user_created'
```

### 5.2. Exam APIs

```javascript
// GET /admin/users/:user_id/exams
// Trả về lịch sử làm bài thi
// Query từ: exam_sessions + tests

// GET /admin/users/:user_id/exam-statistics
// Trả về thống kê exam
// Query từ: user_exam_statistics + exam_sessions + part_statistics
```

### 5.3. Course APIs

```javascript
// GET /admin/users/:user_id/course-progress
// Trả về tiến độ học course
// Query từ: course_enrollments + lesson_progress + courses
```

---

## PHẦN 6: KẾT LUẬN

### ✅ **DATA MODEL ĐÃ ĐỦ**

Hệ thống **KHÔNG CẦN** thêm bảng mới để quản lý tiến độ học tập của user. Tất cả thông tin cần thiết đã có sẵn trong các bảng hiện tại.

### ✅ **CẦN LÀM**

1. **Backend:** Tạo các API endpoints để query và aggregate data từ các bảng hiện có
2. **Frontend:** Cập nhật `UserDetailModal` để hiển thị:
   - Tab: Exams (lịch sử + thống kê)
   - Tab: Flashcards (tiến độ học)
   - Tab: Created Topics (topics user tạo)
   - Tab: Courses (đã có sẵn, chỉ cần cải thiện)

### ❌ **KHÔNG CẦN**

- Thêm bảng mới
- Thêm field mới vào bảng hiện có
- Migration database

---

## PHẦN 7: SQL QUERIES MẪU

### 7.1. Flashcard Progress

```sql
-- Tiến độ học topic của user
SELECT
  t.topic_id,
  t.topic_name,
  COUNT(DISTINCT w.word_id) as total_words,
  COUNT(DISTINCT CASE WHEN uws.is_learned = 1 THEN w.word_id END) as words_learned,
  COUNT(DISTINCT CASE WHEN uws.is_learned = 0 AND uws.user_id IS NOT NULL THEN w.word_id END) as words_learning,
  COUNT(DISTINCT CASE WHEN uws.user_id IS NULL THEN w.word_id END) as words_new,
  ROUND((COUNT(DISTINCT CASE WHEN uws.is_learned = 1 THEN w.word_id END) * 100.0 / COUNT(DISTINCT w.word_id)), 2) as progress_percent,
  MAX(uws.marked_at) as last_studied_at
FROM topics t
LEFT JOIN words w ON t.topic_id = w.topic_id AND w.is_active = 1
LEFT JOIN user_word_status uws ON w.word_id = uws.word_id AND uws.user_id = ?
WHERE t.is_active = 1
GROUP BY t.topic_id, t.topic_name;

-- Topics user đã tạo
SELECT * FROM topics
WHERE created_by = ? AND topic_type = 'user_created';

-- Study streak (tính từ marked_at)
SELECT
  DATE(marked_at) as study_date,
  COUNT(*) as words_studied
FROM user_word_status
WHERE user_id = ? AND is_learned = 1
GROUP BY DATE(marked_at)
ORDER BY study_date DESC;
```

### 7.2. Exam Progress

```sql
-- Lịch sử làm bài thi
SELECT
  es.exam_session_id,
  es.test_id,
  t.title as test_name,
  t.exam_type,
  es.start_time,
  es.end_time,
  es.total_score,
  es.correct_answers,
  es.wrong_answers,
  es.status,
  es.duration_seconds
FROM exam_sessions es
JOIN tests t ON es.test_id = t.test_id
WHERE es.user_id = ?
ORDER BY es.start_time DESC;

-- Thống kê exam
SELECT
  COUNT(*) as total_exams,
  AVG(total_score) as average_score,
  MAX(total_score) as best_score,
  MIN(total_score) as worst_score
FROM exam_sessions
WHERE user_id = ? AND status = 'COMPLETED';

-- Điểm từng part
SELECT
  p.part_name,
  ps.accuracy_rate,
  ps.total_attempts,
  ps.last_attempt
FROM part_statistics ps
JOIN parts p ON ps.part_id = p.part_id
WHERE ps.user_id = ?
ORDER BY ps.last_attempt DESC;
```

### 7.3. Course Progress

```sql
-- Khóa học user đã đăng ký
SELECT
  ce.enrollment_id,
  ce.course_id,
  c.title as course_name,
  ce.status,
  ce.progress_percent,
  ce.enrolled_at,
  ce.completed_at,
  ce.last_accessed_lesson_id,
  ce.last_accessed_at
FROM course_enrollments ce
JOIN courses c ON ce.course_id = c.course_id
WHERE ce.user_id = ?
ORDER BY ce.enrolled_at DESC;

-- Tiến độ từng lesson
SELECT
  lp.lesson_id,
  l.title as lesson_name,
  lp.status,
  lp.completion_percent,
  lp.watched_duration,
  lp.total_duration,
  lp.started_at,
  lp.completed_at
FROM lesson_progress lp
JOIN lessons l ON lp.lesson_id = l.lesson_id
WHERE lp.user_id = ? AND lp.course_id = ?
ORDER BY l.order;
```

---

## KẾT LUẬN CUỐI CÙNG

✅ **DATA MODEL ĐÃ ĐỦ** - Không cần thêm bảng hay field mới

✅ **CẦN LÀM:**

1. Tạo Backend APIs để query data từ các bảng hiện có
2. Cập nhật Frontend `UserDetailModal` với các tabs mới
3. Tạo components hiển thị charts và statistics

❌ **KHÔNG CẦN:**

- Migration database
- Thêm bảng mới
- Thêm field mới

---

## PHẦN 8: CÁC VẤN ĐỀ ĐÃ ĐƯỢC FIX ✅

### 1. UserExamsTab - Dữ liệu không hiển thị ✅ ĐÃ FIX

**Vấn đề:** Tab "Bài thi" hiển thị "0 Tổng số bài thi", "Người dùng chưa làm bài thi nào" dù user đã làm bài.

**Đã sửa:**

- ✅ Thêm debug logs trong development mode để kiểm tra dữ liệu response
- ✅ Đảm bảo frontend truy cập đúng path: `statsData?.DT?.overall` và `examsData?.DT?.exams`
- ✅ Xử lý trường hợp response null/undefined với fallback values

**File đã sửa:**

- `frontend/Shopery/src/Admin/features/users/components/UserExamsTab.jsx`

### 2. UserCoursesTab - Dữ liệu không hiển thị ✅ ĐÃ FIX

**Vấn đề:** Tab "Khóa học" hiển thị "0/0 bài học", "0.0%" dù user đã đăng ký khóa học.

**Đã sửa:**

- ✅ Thêm debug logs trong development mode
- ✅ Thêm `required: false` cho Course association trong `getUserDetail` và `getUserCourseProgress` để xử lý course_id null
- ✅ Đảm bảo frontend truy cập đúng path: `responseData?.enrollments`

**File đã sửa:**

- `frontend/Shopery/src/Admin/features/users/components/UserCoursesTab.jsx`
- `backend/src/admin/services/userAdminService.js` (getUserDetail, getUserCourseProgress)

### 3. Part Statistics - Hiển thị "Unknown" ✅ ĐÃ FIX

**Vấn đề:** Bảng "Thống kê theo phần" hiển thị "Unknown" cho part_name.

**Đã sửa:**

- ✅ Thêm `as: "part"` vào include trong `getUserExamStatistics` để đảm bảo association đúng
- ✅ Nếu part null sau khi include, query trực tiếp từ Part table bằng part_id
- ✅ Nếu vẫn không tìm thấy, hiển thị "Part {part_id}" thay vì "Unknown"

**File đã sửa:**

- `backend/src/admin/services/userAdminService.js` (getUserExamStatistics)

### 4. Summary Statistics - Dữ liệu không chính xác ✅ ĐÃ FIX

**Vấn đề:** Summary cards (Khóa học: 8, Hoàn thành: 0) có thể không đúng.

**Đã sửa:**

- ✅ Thêm `required: false` cho Course association trong `getUserDetail` để xử lý course_id null
- ✅ Logic tính toán đã đúng: `totalEnrollments`, `completedCourses`, `totalSpent`

**File đã sửa:**

- `backend/src/admin/services/userAdminService.js` (getUserDetail)

---

## PHẦN 9: HƯỚNG DẪN DEBUG

### Debug trong Development Mode

Các component đã được thêm debug logs trong development mode:

```javascript
if (process.env.NODE_ENV === "development") {
  console.log("UserExamsTab - examsData:", examsData);
  console.log("UserExamsTab - statsData:", statsData);
  // ...
}
```

### Kiểm tra Network Tab

1. Mở DevTools > Network tab
2. Filter theo "exams" hoặc "course-progress"
3. Kiểm tra response structure từ API
4. So sánh với cấu trúc frontend đang expect

### Kiểm tra Backend Logs

1. Xem console logs trong backend khi gọi API
2. Kiểm tra SQL queries được generate bởi Sequelize
3. Xác nhận associations đã được load đúng
