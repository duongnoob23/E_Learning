# 📚 Phân Tích Mở Rộng Bảng Lessons

## 🎯 Vấn Đề

Hiện tại `lessons` chỉ hỗ trợ khóa học video. Cần mở rộng để hỗ trợ:

- ✅ Khóa học video (hiện tại)
- 🆕 Khóa học từ vựng (8 dạng bài tập)
- 🆕 Khóa học ngữ pháp (lý thuyết + bài tập)

## 📋 Các Dạng Bài Tập Từ Vựng

1. **Danh sách từ mới** (list/flashcard)
   - Dữ liệu: Array of words với image, vi, en
2. **Tìm cặp** (4x4 matrix)
   - Dữ liệu: 8 cặp (image+vi) + 8 từ (en), matrix layout
3. **Dịch nghĩa** (nhập text)
   - Dữ liệu: Image, vi_text, correct_answer (en)
4. **Trắc nghiệm từ** (multiple choice)
   - Dữ liệu: Question (en), 4 choices (vi)
5. **Nghe từ vựng** (audio + 3x3 matrix)
   - Dữ liệu: Audio URL, 9 cells (image+vi)
6. **Chọn ảnh** (en -> image)
   - Dữ liệu: Question (en), 4 images
7. **Hoàn thiện câu** (drag & drop)
   - Dữ liệu: Sentence structure, shuffled words
8. **Lý thuyết** (text content)
   - Dữ liệu: Rich text content

## 🔍 Phân Tích Các Giải Pháp

### ❌ Giải Pháp 1: Thêm Cột Cho Mỗi Loại

```sql
ALTER TABLE lessons ADD COLUMN quiz_data JSON;
ALTER TABLE lessons ADD COLUMN matching_data JSON;
ALTER TABLE lessons ADD COLUMN translation_data JSON;
-- ... 8 cột nữa
```

**Vấn đề:**

- Quá nhiều cột NULL
- Khó mở rộng thêm loại mới
- Không tối ưu

### ✅ Giải Pháp 2: JSON Column (RECOMMENDED)

```sql
ALTER TABLE lessons ADD COLUMN lesson_data JSON COMMENT 'Dữ liệu động theo lesson_type';
```

**Ưu điểm:**

- ✅ Flexible, dễ mở rộng
- ✅ Không cần thay đổi schema khi thêm loại mới
- ✅ MySQL 5.7+ hỗ trợ JSON tốt
- ✅ Có thể query JSON
- ✅ Giữ nguyên các field hiện tại (video_url, content)

**Nhược điểm:**

- ⚠️ Khó validate schema
- ⚠️ Cần validate ở application layer

**Cấu trúc JSON cho từng loại:**

```json
// 1. Danh sách từ mới
{
  "type": "vocabulary_list",
  "display_mode": "list" | "flashcard",
  "words": [
    { "word_id": 1, "en": "happy", "vi": "vui mừng", "image": "url", "audio": "url" }
  ]
}

// 2. Tìm cặp (4x4)
{
  "type": "vocabulary_matching",
  "grid_size": "4x4",
  "pairs": [
    { "id": 1, "image": "url", "vi": "vui mừng", "en": "happy" },
    { "id": 2, "image": "url", "vi": "buồn", "en": "sad" }
    // ... 8 cặp
  ]
}

// 3. Dịch nghĩa
{
  "type": "vocabulary_translation",
  "image": "url",
  "vi_text": "vui mừng",
  "correct_answer": "happy",
  "hints": ["h", "ha", "hap"]
}

// 4. Trắc nghiệm từ
{
  "type": "vocabulary_quiz",
  "question": { "en": "happy", "audio": "url" },
  "choices": [
    { "id": 1, "vi": "vui mừng", "is_correct": true },
    { "id": 2, "vi": "buồn", "is_correct": false },
    { "id": 3, "vi": "giận", "is_correct": false },
    { "id": 4, "vi": "sợ", "is_correct": false }
  ]
}

// 5. Nghe từ vựng
{
  "type": "vocabulary_listening",
  "audio_url": "url",
  "grid": {
    "rows": 3,
    "cols": 3,
    "cells": [
      { "id": 1, "image": "url", "vi": "vui mừng", "is_correct": true },
      { "id": 2, "image": "url", "vi": "buồn", "is_correct": false }
      // ... 9 cells
    ]
  }
}

// 6. Chọn ảnh
{
  "type": "vocabulary_image_choice",
  "question": { "en": "happy", "audio": "url" },
  "images": [
    { "id": 1, "url": "url1", "is_correct": true },
    { "id": 2, "url": "url2", "is_correct": false },
    { "id": 3, "url": "url3", "is_correct": false },
    { "id": 4, "url": "url4", "is_correct": false }
  ]
}

// 7. Hoàn thiện câu (drag & drop)
{
  "type": "vocabulary_sentence_completion",
  "sentence_template": "I am {word1} because {word2}",
  "correct_order": ["happy", "today"],
  "shuffled_words": [
    { "id": 1, "text": "happy", "position": null },
    { "id": 2, "text": "today", "position": null },
    { "id": 3, "text": "sad", "position": null },
    { "id": 4, "text": "yesterday", "position": null }
  ],
  "blanks": [
    { "id": "word1", "correct_word_id": 1 },
    { "id": "word2", "correct_word_id": 2 }
  ]
}

// 8. Lý thuyết
{
  "type": "grammar_theory",
  "content": "<p>Rich HTML content...</p>",
  "sections": [
    { "title": "Định nghĩa", "content": "..." },
    { "title": "Cách dùng", "content": "..." }
  ]
}
```

### ❌ Giải Pháp 3: Polymorphic Association

```sql
CREATE TABLE lesson_vocabulary_data (...);
CREATE TABLE lesson_grammar_data (...);
CREATE TABLE lesson_quiz_data (...);
```

**Vấn đề:**

- Quá nhiều bảng
- JOIN phức tạp
- Khó query tổng hợp

### ❌ Giải Pháp 4: EAV (Entity-Attribute-Value)

**Vấn đề:**

- Quá phức tạp
- Performance kém
- Không phù hợp với use case này

## ✅ Giải Pháp Đề Xuất: Hybrid Approach

### 1. Cập nhật ENUM `lesson_type`

```sql
ALTER TABLE lessons
MODIFY COLUMN lesson_type ENUM(
  'video',           -- Video bài giảng (hiện tại)
  'document',        -- Tài liệu
  'quiz',            -- Quiz
  'assignment',      -- Bài tập
  'live',            -- Live stream
  'vocabulary_list',              -- Danh sách từ vựng
  'vocabulary_matching',           -- Tìm cặp
  'vocabulary_translation',        -- Dịch nghĩa
  'vocabulary_quiz',               -- Trắc nghiệm từ
  'vocabulary_listening',          -- Nghe từ vựng
  'vocabulary_image_choice',       -- Chọn ảnh
  'vocabulary_sentence_completion', -- Hoàn thiện câu
  'grammar_theory'                 -- Lý thuyết ngữ pháp
) DEFAULT 'video';
```

### 2. Thêm cột JSON cho dữ liệu động

```sql
ALTER TABLE lessons
ADD COLUMN lesson_data JSON COMMENT 'Dữ liệu động theo lesson_type (vocabulary, grammar, quiz...)';

-- Giữ nguyên các field cũ cho backward compatibility
-- video_url, content vẫn dùng cho lesson_type = 'video'
```

### 3. Cấu trúc dữ liệu

**Cho video (backward compatible):**

- `video_url` → vẫn dùng như cũ
- `content` → vẫn dùng như cũ
- `lesson_data` → NULL hoặc `{}`

**Cho vocabulary/grammar:**

- `video_url` → NULL
- `content` → NULL hoặc mô tả ngắn
- `lesson_data` → JSON với cấu trúc trên

## 📝 SQL Migration

```sql
-- 1. Mở rộng lesson_type
ALTER TABLE lessons
MODIFY COLUMN lesson_type ENUM(
  'video',
  'document',
  'quiz',
  'assignment',
  'live',
  'vocabulary_list',
  'vocabulary_matching',
  'vocabulary_translation',
  'vocabulary_quiz',
  'vocabulary_listening',
  'vocabulary_image_choice',
  'vocabulary_sentence_completion',
  'grammar_theory'
) DEFAULT 'video';

-- 2. Thêm cột lesson_data
ALTER TABLE lessons
ADD COLUMN lesson_data JSON COMMENT 'Dữ liệu động theo lesson_type'
AFTER content;

-- 3. Thêm index cho JSON (MySQL 5.7+)
ALTER TABLE lessons
ADD INDEX idx_lesson_type (lesson_type);

-- 4. (Optional) Generated column để query dễ hơn
ALTER TABLE lessons
ADD COLUMN lesson_data_type VARCHAR(50)
GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(lesson_data, '$.type')))
STORED
AFTER lesson_data;
```

## 🎨 Frontend Component Mapping

```javascript
const LessonComponentMapper = {
  video: VideoPlayer,
  vocabulary_list: VocabularyList,
  vocabulary_matching: VocabularyMatching,
  vocabulary_translation: VocabularyTranslation,
  vocabulary_quiz: VocabularyQuiz,
  vocabulary_listening: VocabularyListening,
  vocabulary_image_choice: VocabularyImageChoice,
  vocabulary_sentence_completion: VocabularySentenceCompletion,
  grammar_theory: GrammarTheory,
};
```

## ✅ Ưu Điểm Của Giải Pháp

1. **Backward Compatible**: Không ảnh hưởng code video hiện tại
2. **Flexible**: Dễ thêm loại bài tập mới
3. **Clean**: Không có quá nhiều cột NULL
4. **Queryable**: MySQL JSON hỗ trợ query tốt
5. **Type-safe**: Có thể validate schema ở application layer

## ⚠️ Lưu Ý

1. **Validation**: Validate JSON schema ở backend trước khi save
2. **Migration**: Migrate dữ liệu cũ (nếu có) sang format mới
3. **Indexing**: Sử dụng generated column để index nếu cần query nhiều
4. **Versioning**: Có thể thêm `lesson_data_version` để handle migration JSON schema
