# 📊 PHÂN TÍCH CẤU TRÚC DATABASE VÀ MỐI QUAN HỆ - CHUẨN BỊ VẼ ERD

## 🎯 TỔNG QUAN DỰ ÁN

Dự án này là một **hệ thống E-Learning** với các tính năng chính:

1. **Quản lý khóa học** (Course Management) - Tạo, quản lý, học khóa học với nhiều loại bài học
2. **Hệ thống thi** (Exam System) - Làm bài thi TOEIC/IELTS với 4 kỹ năng (Listening, Reading, Speaking, Writing)
3. **Hệ thống từ vựng** (Vocabulary System) - Flashcard, học từ vựng với SRS (Spaced Repetition System)
4. **Quản lý người dùng** (User Management) - Authentication, Authorization với Role-Based Access Control
5. **AI Scoring** - Chấm điểm tự động cho Speaking và Writing

---

## 📋 DANH SÁCH CÁC BẢNG VÀ MỐI QUAN HỆ

### 1. 🔐 HỆ THỐNG XÁC THỰC VÀ PHÂN QUYỀN (Authentication & Authorization)

#### 1.1. **users** (Bảng người dùng)
- **Primary Key**: `user_id` (BIGINT, AUTO_INCREMENT)
- **Các trường chính**:
  - `username` (STRING, UNIQUE, NOT NULL)
  - `email` (STRING, UNIQUE, NOT NULL)
  - `password_hash` (STRING, NOT NULL)
  - `full_name` (STRING)
  - `phone_number` (STRING)
  - `avatar_url` (STRING)
  - `status` (STRING)
- **Quan hệ**:
  - `1:N` → `user_roles` (một user có nhiều roles)
  - `1:N` → `course_enrollments` (một user đăng ký nhiều khóa học)
  - `1:N` → `lesson_progress` (một user có nhiều tiến độ bài học)
  - `1:N` → `course_reviews` (một user viết nhiều đánh giá)
  - `1:N` → `exam_sessions` (một user làm nhiều bài thi)
  - `1:N` → `user_words` (một user có nhiều từ vựng cá nhân)
  - `1:N` → `user_word_status` (một user có nhiều trạng thái từ vựng)
  - `1:N` → `topics` (một user tạo nhiều topics - created_by)
  - `1:N` → `words` (một user tạo nhiều words - created_by)
  - `1:1` → `instructors` (một user có thể là một instructor)

#### 1.2. **roles** (Bảng vai trò)
- **Primary Key**: `role_id` (BIGINT, AUTO_INCREMENT)
- **Các trường chính**:
  - `role_name` (STRING, UNIQUE, NOT NULL)
  - `description` (TEXT)
  - `is_active` (BOOLEAN)
- **Quan hệ**:
  - `N:M` → `users` (qua bảng trung gian `user_roles`)
  - `N:M` → `permissions` (qua bảng trung gian `role_permissions`)

#### 1.3. **permissions** (Bảng quyền)
- **Primary Key**: `permission_id` (BIGINT, AUTO_INCREMENT)
- **Các trường chính**:
  - `permission_name` (STRING, UNIQUE, NOT NULL)
  - `description` (TEXT)
  - `resource` (STRING) - Tài nguyên (courses, exams, users...)
  - `action` (STRING) - Hành động (create, read, update, delete...)
  - `is_active` (BOOLEAN)
- **Quan hệ**:
  - `N:M` → `roles` (qua bảng trung gian `role_permissions`)

#### 1.4. **user_roles** (Bảng trung gian User-Role)
- **Primary Key**: Composite (user_id, role_id)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `role_id` → `roles.role_id`

#### 1.5. **role_permissions** (Bảng trung gian Role-Permission)
- **Primary Key**: Composite (role_id, permission_id)
- **Foreign Keys**:
  - `role_id` → `roles.role_id`
  - `permission_id` → `permissions.permission_id`

#### 1.6. **otp_codes** (Mã OTP)
- **Primary Key**: `otp_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `user_id` → `users.user_id`
- **Mục đích**: Lưu mã OTP cho xác thực email, đổi mật khẩu

#### 1.7. **email_verifications** (Xác thực email)
- **Primary Key**: `verification_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `user_id` → `users.user_id`

#### 1.8. **password_reset_tokens** (Token reset mật khẩu)
- **Primary Key**: `token_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `user_id` → `users.user_id`

#### 1.9. **refresh_tokens** (Token làm mới)
- **Primary Key**: `token_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `user_id` → `users.user_id`

#### 1.10. **login_history** (Lịch sử đăng nhập)
- **Primary Key**: `login_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `user_id` → `users.user_id`

---

### 2. 📚 HỆ THỐNG KHÓA HỌC (Course System)

#### 2.1. **categories** (Danh mục khóa học)
- **Primary Key**: `category_id` (BIGINT, AUTO_INCREMENT)
- **Các trường chính**:
  - `name` (STRING, NOT NULL)
  - `slug` (STRING, UNIQUE, NOT NULL)
  - `description` (TEXT)
  - `icon`, `color`, `image` (STRING)
  - `sort_order` (INTEGER)
- **Quan hệ**:
  - `1:N` → `courses` (một category có nhiều khóa học)

#### 2.2. **levels** (Cấp độ khóa học)
- **Primary Key**: `level_id` (BIGINT, AUTO_INCREMENT)
- **Các trường chính**:
  - `name` (STRING, NOT NULL)
  - `slug` (STRING, UNIQUE, NOT NULL)
  - `description` (TEXT)
  - `color` (STRING)
  - `sort_order` (INTEGER)
- **Quan hệ**:
  - `1:N` → `courses` (một level có nhiều khóa học)

#### 2.3. **instructors** (Giảng viên)
- **Primary Key**: `instructor_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `user_id` → `users.user_id` (nullable)
- **Các trường chính**:
  - `name` (STRING, NOT NULL)
  - `avatar` (STRING)
  - `bio` (TEXT)
  - `experience_years` (INTEGER)
  - `specializations`, `education`, `achievements` (TEXT)
  - `social_links` (JSON)
  - `is_featured`, `is_verified`, `is_active` (BOOLEAN)
- **Quan hệ**:
  - `1:N` → `courses` (một instructor dạy nhiều khóa học)

#### 2.4. **courses** (Khóa học)
- **Primary Key**: `course_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `category_id` → `categories.category_id`
  - `level_id` → `levels.level_id`
  - `instructor_id` → `instructors.instructor_id`
- **Các trường chính**:
  - `title` (STRING, NOT NULL)
  - `slug` (STRING, UNIQUE, NOT NULL)
  - `short_description`, `description` (TEXT)
  - `image`, `video_preview` (STRING)
  - `total_lessons`, `total_students` (INTEGER)
  - `rating`, `rating_count` (DECIMAL, INTEGER)
  - `price`, `old_price`, `discount_percent` (DECIMAL)
  - `is_free`, `is_best_seller`, `is_featured` (BOOLEAN)
  - `status` (ENUM: draft, published, archived, pending_review, rejected)
- **Quan hệ**:
  - `1:1` → `course_details` (một khóa học có một chi tiết)
  - `1:N` → `modules` (một khóa học có nhiều modules)
  - `1:N` → `lessons` (một khóa học có nhiều lessons)
  - `1:N` → `course_enrollments` (một khóa học có nhiều đăng ký)
  - `1:N` → `course_reviews` (một khóa học có nhiều đánh giá)
  - `1:N` → `course_wishlists` (một khóa học có nhiều yêu thích)
  - `1:N` → `course_coupons` (một khóa học có nhiều coupon)
  - `1:N` → `course_certificates` (một khóa học có nhiều chứng chỉ)
  - `1:N` → `course_tag_relations` (một khóa học có nhiều tags)

#### 2.5. **course_details** (Chi tiết khóa học)
- **Primary Key**: `course_detail_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `course_id` → `courses.course_id` (UNIQUE)
- **Các trường chính**:
  - `about_content` (TEXT)
  - `learning_outcomes`, `skills_covered`, `requirements`, `achievements` (JSON)
  - `certificate_info` (TEXT)
  - `language`, `target_audience` (STRING)

#### 2.6. **modules** (Module trong khóa học)
- **Primary Key**: `module_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `course_id` → `courses.course_id`
- **Các trường chính**:
  - `title` (STRING, NOT NULL)
  - `description` (TEXT)
  - `sort_order` (INTEGER, NOT NULL)
  - `total_lectures` (INTEGER)
  - `total_duration` (STRING)
  - `is_active` (BOOLEAN)
- **Quan hệ**:
  - `1:N` → `lessons` (một module có nhiều lessons)

#### 2.7. **lessons** (Bài học)
- **Primary Key**: `lesson_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `module_id` → `modules.module_id`
  - `course_id` → `courses.course_id`
- **Các trường chính**:
  - `title` (STRING, NOT NULL)
  - `description`, `content` (TEXT)
  - `video_url`, `video_duration` (STRING)
  - `file_attachment` (STRING)
  - `sort_order` (INTEGER, NOT NULL)
  - `lesson_type` (ENUM):
    - `video`, `document`, `quiz`, `assignment`, `live`
    - `vocabulary_list`, `vocabulary_matching`, `vocabulary_translation`
    - `vocabulary_quiz`, `vocabulary_listening`, `vocabulary_image_choice`
    - `vocabulary_sentence_completion`, `grammar_theory`
    - `toeic_part_1` đến `toeic_part_7`
  - `lesson_data` (JSON) - Dữ liệu động theo lesson_type
  - `metadata` (JSON) - Metadata bổ sung
  - `is_free`, `is_active` (BOOLEAN)
  - `view_count` (INTEGER)
- **Quan hệ**:
  - `1:N` → `lesson_progress` (một lesson có nhiều tiến độ của users)
  - `1:N` → `course_enrollments` (last_accessed_lesson_id)

#### 2.8. **course_enrollments** (Đăng ký khóa học)
- **Primary Key**: `enrollment_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `course_id` → `courses.course_id`
  - `last_accessed_lesson_id` → `lessons.lesson_id` (nullable)
- **Các trường chính**:
  - `status` (ENUM: active, completed, cancelled, expired)
  - `enrolled_at`, `completed_at`, `expires_at` (DATE)
  - `progress_percent` (DECIMAL)
  - `last_accessed_at` (DATE)
  - `payment_amount`, `payment_method` (DECIMAL, STRING)
  - `payment_status` (ENUM: pending, paid, failed, refunded)
  - `transaction_id` (STRING)
- **Quan hệ**:
  - `1:N` → `course_certificates` (một enrollment có thể có certificate)

#### 2.9. **lesson_progress** (Tiến độ bài học)
- **Primary Key**: `lesson_progress_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `lesson_id` → `lessons.lesson_id`
  - `course_id` → `courses.course_id`
- **Các trường chính**:
  - `status` (ENUM: not_started, in_progress, completed)
  - `watched_duration`, `total_duration` (INTEGER)
  - `completion_percent` (DECIMAL)
  - `started_at`, `completed_at`, `last_accessed_at` (DATE)

#### 2.10. **course_reviews** (Đánh giá khóa học)
- **Primary Key**: `review_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `course_id` → `courses.course_id`
- **Các trường chính**:
  - `rating` (INTEGER, NOT NULL) - 1-5 sao
  - `title`, `content` (STRING, TEXT)
  - `is_verified` (BOOLEAN)
  - `status` (ENUM: pending, approved, rejected)

#### 2.11. **course_wishlists** (Yêu thích khóa học)
- **Primary Key**: `wishlist_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `course_id` → `courses.course_id`

#### 2.12. **course_discussions** (Thảo luận khóa học)
- **Primary Key**: `discussion_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `course_id` → `courses.course_id`
  - `user_id` → `users.user_id`
  - `parent_id` → `course_discussions.discussion_id` (nullable) - Self-referencing cho replies

#### 2.13. **coupons** (Mã giảm giá)
- **Primary Key**: `coupon_id` (BIGINT, AUTO_INCREMENT)
- **Các trường chính**:
  - `code` (STRING, UNIQUE, NOT NULL)
  - `name`, `description` (STRING, TEXT)
  - `discount_type` (ENUM: percentage, fixed_amount)
  - `discount_value` (DECIMAL)
  - `minimum_amount`, `max_uses`, `max_uses_per_user` (DECIMAL, INTEGER)
  - `valid_from`, `valid_until` (DATE)
  - `applicable_courses`, `applicable_categories` (JSON)
- **Quan hệ**:
  - `1:N` → `course_coupons` (một coupon áp dụng cho nhiều khóa học)

#### 2.14. **course_coupons** (Coupon áp dụng cho khóa học)
- **Primary Key**: `course_coupon_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `course_id` → `courses.course_id`
  - `coupon_id` → `coupons.coupon_id`

#### 2.15. **course_certificates** (Chứng chỉ khóa học)
- **Primary Key**: `certificate_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `course_id` → `courses.course_id`
  - `enrollment_id` → `course_enrollments.enrollment_id`
- **Các trường chính**: certificate_url, issued_at, etc.

#### 2.16. **course_tags** (Tags khóa học)
- **Primary Key**: `tag_id` (BIGINT, AUTO_INCREMENT)
- **Các trường chính**: `tag_name`, `description`, etc.

#### 2.17. **course_tag_relations** (Quan hệ Course-Tag)
- **Primary Key**: `relation_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `course_id` → `courses.course_id`
  - `tag_id` → `course_tags.tag_id`

---

### 3. 📝 HỆ THỐNG THI (Exam System)

#### 3.1. **tests** (Bài thi)
- **Primary Key**: `test_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Key**: `created_by` → `users.user_id` (nullable)
- **Các trường chính**:
  - `title` (STRING, NOT NULL)
  - `description` (TEXT)
  - `exam_type` (ENUM: TOEIC, IELTS, HSK, THPT)
  - `total_duration` (INTEGER) - phút
  - `total_questions`, `total_parts` (INTEGER)
  - `difficulty_level` (ENUM: EASY, MEDIUM, HARD)
- **Quan hệ**:
  - `1:N` → `parts` (một test có nhiều parts)
  - `1:N` → `exam_sessions` (một test có nhiều phiên thi)
  - `1:N` → `test_category_relations` (một test có nhiều categories)
  - `1:N` → `test_discussions` (một test có nhiều thảo luận)

#### 3.2. **parts** (Phần thi)
- **Primary Key**: `part_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Key**: `test_id` → `tests.test_id`
- **Các trường chính**:
  - `part_number` (INTEGER, NOT NULL) - Số thứ tự part (1, 2, 3...)
  - `part_name` (STRING, NOT NULL)
  - `part_type` (ENUM: LISTENING, READING, SPEAKING, WRITING)
  - `question_count` (INTEGER, NOT NULL)
  - `duration_minutes` (INTEGER, NOT NULL)
  - `description` (TEXT)
  - `display_template` (STRING)
- **Quan hệ**:
  - `1:N` → `questions` (một part có nhiều câu hỏi)
  - `1:N` → `part_statistics` (một part có nhiều thống kê của users)

#### 3.3. **questions** (Câu hỏi)
- **Primary Key**: `question_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Key**: `part_id` → `parts.part_id`
- **Các trường chính**:
  - `question_number` (INTEGER, NOT NULL)
  - `question_text` (TEXT)
  - `question_type` (ENUM: MULTIPLE_CHOICE, FILL_BLANK, READING_COMPREHENSION, SPEAKING, WRITING)
  - `audio_file`, `image_file` (STRING)
  - `transcript`, `explanation`, `grammar_notes` (TEXT)
- **Quan hệ**:
  - `1:N` → `choices` (một question có nhiều lựa chọn)
  - `1:N` → `user_answers` (một question có nhiều câu trả lời của users)
  - `1:N` → `speaking_responses` (một question có nhiều phản hồi speaking)
  - `1:N` → `writing_responses` (một question có nhiều phản hồi writing)
  - `1:N` → `question_tags` (một question có nhiều tags)

#### 3.4. **choices** (Lựa chọn)
- **Primary Key**: `choice_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Key**: `question_id` → `questions.question_id`
- **Các trường chính**:
  - `choice_letter` (ENUM: A, B, C, D)
  - `choice_text`, `choice_translation`, `choice_explanation` (TEXT)
  - `is_correct` (BOOLEAN, NOT NULL)
- **Quan hệ**:
  - `1:N` → `user_answers` (một choice được chọn bởi nhiều users)

#### 3.5. **exam_sessions** (Phiên làm bài)
- **Primary Key**: `exam_session_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `test_id` → `tests.test_id`
- **Các trường chính**:
  - `session_type` (ENUM: FULL_TEST, PRACTICE, REVIEW)
  - `start_time`, `end_time` (DATE)
  - `duration_seconds` (INTEGER)
  - `total_score`, `correct_answers`, `wrong_answers`, `skipped_answers` (INTEGER)
  - `status` (ENUM: IN_PROGRESS, COMPLETED, ABANDONED)
  - `selected_parts` (JSON) - Mảng các part_number được chọn [1, 2, 3, 4]
  - `time_limit_minutes` (INTEGER)
- **Quan hệ**:
  - `1:N` → `user_answers` (một session có nhiều câu trả lời)
  - `1:N` → `speaking_responses` (một session có nhiều phản hồi speaking)
  - `1:N` → `writing_responses` (một session có nhiều phản hồi writing)
  - `1:N` → `user_statistics` (một session có một thống kê tổng)
  - `1:N` → `part_statistics` (một session có nhiều thống kê theo part)

#### 3.6. **user_answers** (Câu trả lời của user)
- **Primary Key**: `user_answer_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `exam_session_id` → `exam_sessions.exam_session_id`
  - `question_id` → `questions.question_id`
  - `selected_choice_id` → `choices.choice_id` (nullable)
- **Các trường chính**:
  - `answer_time` (DATE)
  - `is_correct` (BOOLEAN) - Được tính tự động khi submit

#### 3.7. **speaking_responses** (Phản hồi Speaking)
- **Primary Key**: `response_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `session_id` → `exam_sessions.exam_session_id`
  - `question_id` → `questions.question_id`
  - `user_id` → `users.user_id`
- **Các trường chính**:
  - `audio_file_path` (STRING, NOT NULL)
  - `transcription`, `transcript` (TEXT) - Kết quả từ Whisper và MultiPA
  - `confidence_score` (FLOAT) - Độ tin cậy từ Whisper
  - `duration_seconds` (FLOAT)
  - `language_detected` (STRING)
  - `processing_status` (ENUM: PENDING, PROCESSING, COMPLETED, FAILED)
  - `score` (FLOAT) - Điểm tổng (0-100)
  - `pronunciation_score`, `fluency_score`, `prosody_score` (FLOAT) - Từ MultiPA
  - `grammar_score`, `vocabulary_score`, `coherence_score` (FLOAT)
  - `feedback`, `detailed_feedback` (TEXT, JSON)

#### 3.8. **writing_responses** (Phản hồi Writing)
- **Primary Key**: `response_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `session_id` → `exam_sessions.exam_session_id`
  - `question_id` → `questions.question_id`
  - `user_id` → `users.user_id`
- **Các trường chính**:
  - `written_text` (TEXT, NOT NULL)
  - `word_count` (INTEGER)
  - `processing_status` (ENUM: PENDING, PROCESSING, COMPLETED, FAILED)
  - `score` (FLOAT) - Điểm tổng (0-100)
  - `grammar_score`, `coherence_score`, `vocabulary_score` (FLOAT)
  - `task_completion_score`, `spelling_score` (FLOAT)
  - `feedback`, `detailed_feedback` (TEXT, JSON)

#### 3.9. **user_statistics** (Thống kê tổng của user)
- **Primary Key**: `statistics_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `exam_session_id` → `exam_sessions.exam_session_id` (nullable)
- **Các trường chính**: Tổng điểm, số bài đã làm, điểm trung bình, etc.

#### 3.10. **part_statistics** (Thống kê theo part)
- **Primary Key**: `part_statistics_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `part_id` → `parts.part_id`
  - `exam_session_id` → `exam_sessions.exam_session_id` (nullable)
- **Các trường chính**: Điểm theo part, số câu đúng/sai, etc.

#### 3.11. **test_categories** (Danh mục bài thi)
- **Primary Key**: `exam_category_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Các trường chính**: `category_name`, `description`, etc.

#### 3.12. **test_category_relations** (Quan hệ Test-Category)
- **Primary Key**: `relation_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `test_id` → `tests.test_id`
  - `exam_category_id` → `test_categories.exam_category_id`

#### 3.13. **exam_tags** (Tags bài thi)
- **Primary Key**: `exam_tag_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Các trường chính**: `tag_name`, `description`, etc.

#### 3.14. **question_tags** (Quan hệ Question-Tag)
- **Primary Key**: `question_tag_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `question_id` → `questions.question_id`
  - `exam_tag_id` → `exam_tags.exam_tag_id`

#### 3.15. **test_discussions** (Thảo luận bài thi)
- **Primary Key**: `discussion_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `test_id` → `tests.test_id`
  - `user_id` → `users.user_id`
- **Quan hệ**:
  - `1:N` → `test_comments` (một discussion có nhiều comments)

#### 3.16. **test_comments** (Bình luận bài thi)
- **Primary Key**: `comment_id` (BIGINT UNSIGNED, AUTO_INCREMENT)
- **Foreign Keys**:
  - `test_discussion_id` → `test_discussions.discussion_id`
  - `user_id` → `users.user_id`
  - `parent_comment_id` → `test_comments.comment_id` (nullable) - Self-referencing cho replies

---

### 4. 🎴 HỆ THỐNG TỪ VỰNG (Vocabulary System)

#### 4.1. **topics** (Chủ đề từ vựng)
- **Primary Key**: `topic_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Key**: `created_by` → `users.user_id` (nullable)
- **Các trường chính**:
  - `topic_name` (STRING, NOT NULL)
  - `description` (TEXT)
  - `image_url`, `logo_url` (STRING)
  - `topic_type` (ENUM: system, user_created)
  - `is_public`, `is_active` (BOOLEAN)
  - `word_count` (INTEGER)
- **Quan hệ**:
  - `1:N` → `words` (một topic có nhiều words)
  - `1:N` → `user_words` (một topic có nhiều user words)
  - `1:N` → `user_word_status` (một topic có nhiều trạng thái)
  - `1:N` → `favorite_topics` (một topic được yêu thích bởi nhiều users)
  - `1:N` → `batch_imports` (một topic có nhiều lần import)

#### 4.2. **words** (Từ vựng hệ thống)
- **Primary Key**: `word_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `topic_id` → `topics.topic_id`
  - `created_by` → `users.user_id` (nullable)
- **Các trường chính**:
  - `word` (STRING, NOT NULL)
  - `part_of_speech` (STRING)
  - `pronunciation` (STRING)
  - `meaning_vi` (TEXT, NOT NULL)
  - `example_en`, `example_vi` (TEXT)
  - `audio_url`, `image_url` (STRING)
  - `notes` (TEXT)
  - `word_type` (ENUM: system, user_created)
  - `is_active` (BOOLEAN)
- **Quan hệ**:
  - `1:N` → `user_word_status` (một word có nhiều trạng thái của users)
  - `1:N` → `user_words` (qua from_system_word_id)

#### 4.3. **user_words** (Từ vựng cá nhân)
- **Primary Key**: `user_word_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `topic_id` → `topics.topic_id`
  - `from_system_word_id` → `words.word_id` (nullable) - Nếu copy từ hệ thống
- **Các trường chính**:
  - `word` (STRING, NOT NULL)
  - `part_of_speech`, `pronunciation` (STRING)
  - `meaning_vi` (TEXT, NOT NULL)
  - `example_en`, `example_vi` (TEXT)
  - `audio_url`, `image_url` (STRING)
  - `notes` (TEXT)
  - `is_starred` (TINYINT)
  - `is_active` (BOOLEAN)
- **Quan hệ**:
  - `1:N` → `user_word_status` (một user word có một trạng thái)
  - `1:N` → `import_details` (một user word được tạo từ import)

#### 4.4. **user_word_status** (Trạng thái học từ vựng - SRS)
- **Primary Key**: `status_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `topic_id` → `topics.topic_id`
  - `word_id` → `words.word_id` (nullable) - Cho system words
  - `user_word_id` → `user_words.user_word_id` (nullable) - Cho user words
- **Các trường chính**:
  - `is_learned` (BOOLEAN)
  - `marked_at` (DATE)
  - `review_count` (INTEGER)
  - `intervall` (INTEGER) - Khoảng thời gian đến lần review tiếp theo (ngày)
  - `ease_factor` (FLOAT) - Hệ số dễ dàng (mặc định 2.5)
  - `last_reviewed`, `next_review` (DATE)
- **Mục đích**: Spaced Repetition System (SRS) để học từ vựng hiệu quả

#### 4.5. **favorite_topics** (Yêu thích topic)
- **Primary Key**: `favorite_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `topic_id` → `topics.topic_id`

#### 4.6. **batch_imports** (Import hàng loạt)
- **Primary Key**: `import_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `user_id` → `users.user_id`
  - `topic_id` → `topics.topic_id`
- **Các trường chính**: `file_name`, `total_words`, `success_count`, `error_count`, etc.
- **Quan hệ**:
  - `1:N` → `import_details` (một import có nhiều chi tiết)

#### 4.7. **import_details** (Chi tiết import)
- **Primary Key**: `detail_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**:
  - `import_id` → `batch_imports.import_id`
  - `created_word_id` → `user_words.user_word_id` (nullable)
- **Các trường chính**: `row_number`, `word_data`, `status`, `error_message`, etc.

#### 4.8. **pronunciation_assessments** (Đánh giá phát âm)
- **Primary Key**: `assessment_id` (BIGINT, AUTO_INCREMENT)
- **Foreign Keys**: Có thể liên kết với `words` hoặc `user_words`
- **Các trường chính**: `audio_file_path`, `pronunciation_score`, `feedback`, etc.

#### 4.9. **study_modes** (Chế độ học)
- **Primary Key**: `study_mode_id` (BIGINT, AUTO_INCREMENT)
- **Các trường chính**: `mode_name`, `description`, `settings` (JSON)

---

## 🔗 TÓM TẮT MỐI QUAN HỆ CHÍNH

### Quan hệ 1:1
- `courses` ↔ `course_details`
- `users` ↔ `instructors` (optional, qua user_id)

### Quan hệ 1:N (One-to-Many)
- `users` → `course_enrollments`, `lesson_progress`, `course_reviews`, `exam_sessions`, `user_words`, `topics`, `words`
- `categories` → `courses`
- `levels` → `courses`
- `instructors` → `courses`
- `courses` → `modules`, `lessons`, `course_enrollments`, `course_reviews`
- `modules` → `lessons`
- `lessons` → `lesson_progress`
- `tests` → `parts`, `exam_sessions`
- `parts` → `questions`, `part_statistics`
- `questions` → `choices`, `user_answers`, `speaking_responses`, `writing_responses`
- `exam_sessions` → `user_answers`, `speaking_responses`, `writing_responses`
- `topics` → `words`, `user_words`, `user_word_status`
- `words` → `user_word_status`
- `user_words` → `user_word_status`, `import_details`
- `batch_imports` → `import_details`

### Quan hệ N:M (Many-to-Many)
- `users` ↔ `roles` (qua `user_roles`)
- `roles` ↔ `permissions` (qua `role_permissions`)
- `courses` ↔ `course_tags` (qua `course_tag_relations`)
- `courses` ↔ `coupons` (qua `course_coupons`)
- `tests` ↔ `test_categories` (qua `test_category_relations`)
- `questions` ↔ `exam_tags` (qua `question_tags`)

### Quan hệ Self-referencing (Recursive)
- `course_discussions` → `course_discussions` (parent_id)
- `test_comments` → `test_comments` (parent_comment_id)

---

## 📊 CÁC NHÓM BẢNG CHÍNH

### Nhóm 1: Authentication & Authorization (10 bảng)
- users, roles, permissions, user_roles, role_permissions
- otp_codes, email_verifications, password_reset_tokens, refresh_tokens, login_history

### Nhóm 2: Course System (17 bảng)
- categories, levels, instructors, courses, course_details
- modules, lessons, course_enrollments, lesson_progress
- course_reviews, course_wishlists, course_discussions
- coupons, course_coupons, course_certificates
- course_tags, course_tag_relations

### Nhóm 3: Exam System (16 bảng)
- tests, parts, questions, choices
- exam_sessions, user_answers, speaking_responses, writing_responses
- user_statistics, part_statistics
- test_categories, test_category_relations
- exam_tags, question_tags
- test_discussions, test_comments

### Nhóm 4: Vocabulary System (9 bảng)
- topics, words, user_words, user_word_status
- favorite_topics, batch_imports, import_details
- pronunciation_assessments, study_modes

**Tổng cộng: ~52 bảng**

---

## 🎨 GỢI Ý VẼ ERD

### Cách tổ chức ERD:

1. **Phần trên cùng**: Authentication & Authorization
   - users ở giữa, kết nối với roles, permissions qua các bảng trung gian

2. **Phần giữa trái**: Course System
   - courses ở trung tâm, kết nối với categories, levels, instructors
   - courses → modules → lessons
   - courses → course_enrollments → users
   - courses → course_reviews, course_wishlists

3. **Phần giữa phải**: Exam System
   - tests ở trung tâm, kết nối với parts → questions → choices
   - exam_sessions kết nối users với tests
   - user_answers, speaking_responses, writing_responses kết nối exam_sessions với questions

4. **Phần dưới**: Vocabulary System
   - topics ở trung tâm, kết nối với words, user_words
   - user_word_status kết nối users với words/user_words
   - batch_imports và import_details cho tính năng import

### Màu sắc đề xuất:
- 🔵 Xanh dương: Bảng chính (users, courses, tests, topics)
- 🟢 Xanh lá: Bảng trung gian (user_roles, course_enrollments, exam_sessions)
- 🟡 Vàng: Bảng thống kê (lesson_progress, user_statistics, part_statistics)
- 🔴 Đỏ: Bảng phản hồi (speaking_responses, writing_responses, course_reviews)
- ⚪ Trắng: Bảng hỗ trợ (categories, levels, tags)

---

## 📝 LƯU Ý KHI VẼ ERD

1. **Foreign Keys**: Tất cả các mũi tên phải chỉ rõ hướng (1 → N)
2. **Bảng trung gian**: Vẽ rõ ràng các bảng N:M (user_roles, role_permissions, etc.)
3. **Self-referencing**: Vẽ mũi tên cong cho các quan hệ đệ quy
4. **JSON Fields**: Các trường JSON (lesson_data, selected_parts) không cần vẽ như bảng riêng
5. **Optional Relationships**: Đánh dấu các quan hệ nullable (0..1 hoặc 0..N)
6. **Cardinality**: Ghi rõ 1:1, 1:N, N:M trên các mũi tên

---

**Tài liệu được tạo:** `2024-12-XX`  
**Mục đích:** Chuẩn bị vẽ ERD Diagram  
**Tổng số bảng:** ~52 bảng











