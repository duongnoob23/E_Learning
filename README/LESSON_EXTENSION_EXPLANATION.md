# 🎓 Giải Thích Chi Tiết: Mở Rộng Bảng Lessons

## 🤔 Tại Sao Chọn Giải Pháp JSON Column?

### Vấn Đề Thực Tế

Mỗi loại bài tập có cấu trúc dữ liệu **hoàn toàn khác nhau**:

| Loại Bài Tập    | Dữ Liệu Cần Lưu                   |
| --------------- | --------------------------------- |
| **Video**       | `video_url`, `video_duration`     |
| **Tìm cặp**     | Matrix 4x4, 8 cặp (image+vi+en)   |
| **Dịch nghĩa**  | Image, vi_text, correct_answer    |
| **Trắc nghiệm** | Question, 4 choices               |
| **Nghe từ**     | Audio URL, 3x3 grid               |
| **Kéo thả**     | Sentence template, shuffled words |
| **Lý thuyết**   | Rich HTML content                 |

→ **Không thể dùng cùng 1 schema cho tất cả!**

### ❌ Tại Sao KHÔNG Dùng Các Giải Pháp Khác?

#### 1. Thêm Cột Cho Mỗi Loại

```sql
ALTER TABLE lessons ADD COLUMN matching_data JSON;
ALTER TABLE lessons ADD COLUMN translation_data JSON;
ALTER TABLE lessons ADD COLUMN quiz_data JSON;
-- ... 8 cột nữa
```

**Vấn đề:**

- 10+ cột, hầu hết là NULL
- Khó maintain
- Không scalable

#### 2. Tạo Bảng Riêng (Polymorphic)

```sql
CREATE TABLE lesson_vocabulary_matching (...);
CREATE TABLE lesson_vocabulary_translation (...);
-- ... 8 bảng nữa
```

**Vấn đề:**

- Quá nhiều bảng (10+ bảng)
- JOIN phức tạp
- Khó query tổng hợp
- Over-engineering

#### 3. EAV (Entity-Attribute-Value)

```sql
CREATE TABLE lesson_attributes (
  lesson_id, attribute_name, attribute_value
);
```

**Vấn đề:**

- Performance rất kém
- Khó query
- Không type-safe
- Phức tạp không cần thiết

### ✅ Tại Sao Chọn JSON Column?

1. **Flexible & Scalable**

   - Thêm loại bài tập mới → chỉ cần update ENUM
   - Không cần ALTER TABLE
   - Schema linh hoạt

2. **Backward Compatible**

   - Code video hiện tại không cần sửa
   - `video_url`, `content` vẫn dùng như cũ
   - Migration dễ dàng

3. **MySQL JSON Support Tốt**

   - MySQL 5.7+ hỗ trợ JSON native
   - Có thể query: `WHERE lesson_data->>'$.type' = 'vocabulary_quiz'`
   - Có thể index với generated column

4. **Clean Schema**
   - Không có nhiều cột NULL
   - Dễ đọc, dễ maintain

## 📊 So Sánh Các Giải Pháp

| Tiêu Chí            | Thêm Cột | Bảng Riêng      | EAV        | **JSON**        |
| ------------------- | -------- | --------------- | ---------- | --------------- |
| **Flexibility**     | ❌ Thấp  | ⚠️ Trung bình   | ✅ Cao     | ✅✅ Rất cao    |
| **Performance**     | ✅✅ Tốt | ✅ Tốt          | ❌ Kém     | ✅ Tốt          |
| **Scalability**     | ❌ Kém   | ⚠️ Trung bình   | ✅ Tốt     | ✅✅ Rất tốt    |
| **Maintainability** | ❌ Khó   | ⚠️ Trung bình   | ❌ Rất khó | ✅✅ Dễ         |
| **Backward Compat** | ✅ Tốt   | ⚠️ Cần sửa code | ✅ Tốt     | ✅✅ Tốt        |
| **Type Safety**     | ✅✅ Tốt | ✅✅ Tốt        | ❌ Không   | ⚠️ Cần validate |

## 🎯 Cấu Trúc Dữ Liệu Chi Tiết

### 1. Vocabulary List (Danh sách từ mới)

```json
{
  "type": "vocabulary_list",
  "display_mode": "flashcard", // "list" | "flashcard"
  "words": [
    {
      "word_id": 1,
      "en": "happy",
      "vi": "vui mừng",
      "image_url": "https://...",
      "audio_url": "https://...",
      "example": "I am happy today"
    }
  ],
  "settings": {
    "auto_play": true,
    "show_translation": false
  }
}
```

### 2. Vocabulary Matching (Tìm cặp 4x4)

```json
{
  "type": "vocabulary_matching",
  "grid_size": { "rows": 4, "cols": 4 },
  "pairs": [
    {
      "pair_id": 1,
      "left": { "type": "image_vi", "image": "url", "text": "vui mừng" },
      "right": { "type": "text", "text": "happy" },
      "matched": false
    }
    // ... 8 cặp
  ],
  "time_limit": 300 // seconds
}
```

### 3. Vocabulary Translation (Dịch nghĩa)

```json
{
  "type": "vocabulary_translation",
  "image_url": "https://...",
  "vi_text": "vui mừng",
  "correct_answer": "happy",
  "hints": ["h", "ha", "hap"],
  "max_attempts": 3,
  "case_sensitive": false
}
```

### 4. Vocabulary Quiz (Trắc nghiệm)

```json
{
  "type": "vocabulary_quiz",
  "question": {
    "en": "happy",
    "audio_url": "https://...",
    "image_url": "https://..." // optional
  },
  "choices": [
    { "id": 1, "vi": "vui mừng", "is_correct": true },
    { "id": 2, "vi": "buồn", "is_correct": false },
    { "id": 3, "vi": "giận", "is_correct": false },
    { "id": 4, "vi": "sợ", "is_correct": false }
  ],
  "shuffle_choices": true
}
```

### 5. Vocabulary Listening (Nghe từ)

```json
{
  "type": "vocabulary_listening",
  "audio_url": "https://...",
  "grid": {
    "rows": 3,
    "cols": 3,
    "cells": [
      {
        "id": 1,
        "image_url": "https://...",
        "vi_text": "vui mừng",
        "is_correct": true,
        "position": { "row": 0, "col": 0 }
      }
      // ... 9 cells (1 correct + 8 distractors)
    ]
  },
  "play_count": 3 // số lần được nghe
}
```

### 6. Vocabulary Image Choice (Chọn ảnh)

```json
{
  "type": "vocabulary_image_choice",
  "question": {
    "en": "happy",
    "audio_url": "https://..."
  },
  "images": [
    { "id": 1, "url": "happy.jpg", "is_correct": true },
    { "id": 2, "url": "sad.jpg", "is_correct": false },
    { "id": 3, "url": "angry.jpg", "is_correct": false },
    { "id": 4, "url": "scared.jpg", "is_correct": false }
  ],
  "layout": "grid" // "grid" | "list"
}
```

### 7. Vocabulary Sentence Completion (Kéo thả)

```json
{
  "type": "vocabulary_sentence_completion",
  "sentence_template": "I am {blank1} because today is {blank2}",
  "correct_order": ["happy", "sunny"],
  "shuffled_words": [
    { "id": 1, "text": "happy", "category": "emotion" },
    { "id": 2, "text": "sunny", "category": "weather" },
    { "id": 3, "text": "sad", "category": "emotion" },
    { "id": 4, "text": "rainy", "category": "weather" }
  ],
  "blanks": [
    { "id": "blank1", "correct_word_id": 1, "hint": "emotion" },
    { "id": "blank2", "correct_word_id": 2, "hint": "weather" }
  ],
  "allow_drag": true
}
```

### 8. Grammar Theory (Lý thuyết)

```json
{
  "type": "grammar_theory",
  "sections": [
    {
      "title": "Định nghĩa",
      "content": "<p>Present Simple là...</p>",
      "order": 1
    },
    {
      "title": "Cách dùng",
      "content": "<p>Dùng để diễn tả...</p>",
      "order": 2
    },
    {
      "title": "Ví dụ",
      "content": "<ul><li>I go to school</li></ul>",
      "order": 3
    }
  ],
  "examples": [
    { "en": "I go to school", "vi": "Tôi đi học" }
  ],
  "exercises": [
    { "type": "fill_blank", "data": {...} }
  ]
}
```

## 🔄 Migration Strategy

### Phase 1: Thêm Cột (Không Ảnh Hưởng Code Cũ)

```sql
-- Chỉ thêm cột, không xóa cột cũ
ALTER TABLE lessons ADD COLUMN lesson_data JSON;
```

✅ Code video hiện tại vẫn chạy bình thường

### Phase 2: Update Model

```javascript
// Backend: Update Lesson model
lesson_data: { type: DataTypes.JSON, allowNull: true }
```

### Phase 3: Tạo Components Mới

```javascript
// Frontend: Tạo components cho từng loại
<VocabularyMatching data={lesson.lesson_data} />
<VocabularyQuiz data={lesson.lesson_data} />
```

### Phase 4: Update Lesson Page

```javascript
// Frontend: Render động theo lesson_type
const component = LessonComponentMapper[lesson.lesson_type];
return <component data={lesson.lesson_data || lesson} />;
```

## ✅ Kết Luận

**Giải pháp JSON Column là tốt nhất vì:**

1. ✅ Không ảnh hưởng code video hiện tại
2. ✅ Dễ mở rộng thêm loại bài tập mới
3. ✅ Schema clean, không có nhiều cột NULL
4. ✅ Performance tốt với MySQL JSON
5. ✅ Type-safe với validation ở application layer

**Lưu ý:**

- Validate JSON schema ở backend trước khi save
- Có thể dùng JSON Schema validator
- Generated column giúp query dễ hơn
