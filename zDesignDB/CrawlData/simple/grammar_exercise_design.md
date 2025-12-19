# Thiết kế Database cho Bài tập Ngữ pháp

## Mô tả bài tập
- Một đoạn văn (paragraph) với các từ được highlight
- Mỗi từ có nhiều lựa chọn (ví dụ: singular/plural)
- User cần chọn đúng dạng từ trong ngữ cảnh

## Cấu trúc exercise_data trong lessons table

### Option 1: Cấu trúc đơn giản (Recommended)

```json
{
  "paragraph": "Halloween is a **celebration / celebrations** on the night of 31st October. **Children / Childrens** wear **costume / costumes**...",
  "questions": [
    {
      "question_id": 1,
      "word": "celebration",
      "position": 15,  // Vị trí trong paragraph (character index)
      "options": [
        {
          "text": "celebration",
          "is_correct": true
        },
        {
          "text": "celebrations",
          "is_correct": false
        }
      ],
      "explanation": "Dùng số ít vì đây là một lễ hội cụ thể"
    },
    {
      "question_id": 2,
      "word": "Children",
      "position": 55,
      "options": [
        {
          "text": "Children",
          "is_correct": true
        },
        {
          "text": "Childrens",
          "is_correct": false
        }
      ],
      "explanation": "Children là dạng số nhiều bất quy tắc của child"
    }
  ]
}
```

### Option 2: Cấu trúc với markers trong text

```json
{
  "paragraph": "Halloween is a {1} on the night of 31st October. {2} wear {3} and they go to people's homes...",
  "questions": [
    {
      "question_id": 1,
      "marker": "{1}",
      "options": [
        {
          "text": "celebration",
          "is_correct": true
        },
        {
          "text": "celebrations",
          "is_correct": false
        }
      ],
      "explanation": "Dùng số ít vì đây là một lễ hội cụ thể"
    },
    {
      "question_id": 2,
      "marker": "{2}",
      "options": [
        {
          "text": "Children",
          "is_correct": true
        },
        {
          "text": "Childrens",
          "is_correct": false
        }
      ],
      "explanation": "Children là dạng số nhiều bất quy tắc của child"
    }
  ]
}
```

### Option 3: Cấu trúc với highlighted text (như trong hình)

```json
{
  "paragraph": "Halloween is a **celebration / celebrations** on the night of 31st October. **Children / Childrens** wear **costume / costumes**...",
  "questions": [
    {
      "question_id": 1,
      "highlighted_text": "**celebration / celebrations**",
      "options": [
        {
          "text": "celebration",
          "is_correct": true
        },
        {
          "text": "celebrations",
          "is_correct": false
        }
      ],
      "explanation": "Dùng số ít vì đây là một lễ hội cụ thể"
    },
    {
      "question_id": 2,
      "highlighted_text": "**Children / Childrens**",
      "options": [
        {
          "text": "Children",
          "is_correct": true
        },
        {
          "text": "Childrens",
          "is_correct": false
        }
      ],
      "explanation": "Children là dạng số nhiều bất quy tắc của child"
    }
  ]
}
```

## Recommendation: Option 3

**Lý do:**
- Dễ hiển thị: Paragraph đã có format sẵn với highlight
- Dễ parse: Tìm `highlighted_text` trong paragraph và thay thế
- Linh hoạt: Có thể có nhiều hơn 2 options
- Dễ maintain: Không cần tính toán position

## Cấu trúc SQL INSERT

```sql
INSERT INTO lessons (
    lesson_id,
    module_id,
    course_id,
    title,
    description,
    content,
    lesson_type,
    has_exercise,
    exercise_type,
    exercise_data,
    exercise_duration,
    pass_score,
    max_score,
    ...
) VALUES (
    76,
    12,
    4,
    'Ngữ pháp: Singular/Plural',
    'Bài tập chọn dạng từ đúng (số ít/số nhiều) trong ngữ cảnh',
    'Luyện tập ngữ pháp về dạng số ít và số nhiều của danh từ trong ngữ cảnh thực tế.',
    'quiz',
    TRUE,
    'grammar_choice',  -- exercise_type mới
    '{
      "paragraph": "Halloween is a **celebration / celebrations** on the night of 31st October...",
      "questions": [
        {
          "question_id": 1,
          "highlighted_text": "**celebration / celebrations**",
          "options": [
            {"text": "celebration", "is_correct": true},
            {"text": "celebrations", "is_correct": false}
          ],
          "explanation": "Dùng số ít vì đây là một lễ hội cụ thể"
        }
      ]
    }',
    15,
    60,
    10
);
```

## Frontend Implementation

1. Parse paragraph và tìm các `highlighted_text`
2. Thay thế `highlighted_text` bằng dropdown/radio buttons
3. Khi user chọn, highlight màu xanh (đúng) hoặc đỏ (sai)
4. Hiển thị explanation khi check đáp án

## Lưu ý

- `exercise_type`: Có thể dùng `grammar_choice` hoặc `grammar_fill_blank`
- Có thể mở rộng cho các dạng ngữ pháp khác: verb tense, articles, prepositions, etc.
- Có thể thêm `grammar_topic` field để phân loại (singular/plural, tense, etc.)


