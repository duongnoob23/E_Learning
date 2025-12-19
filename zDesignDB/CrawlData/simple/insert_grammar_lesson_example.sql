-- ============================================
-- INSERT LESSON: Ngữ pháp - Singular/Plural
-- Lesson ID: 76
-- Module ID: 12 (hoặc module_id bạn muốn)
-- Course ID: 4
-- ============================================

INSERT INTO lessons (
    lesson_id,
    module_id,
    course_id,
    title,
    description,
    content,
    video_url,
    video_duration,
    file_attachment,
    sort_order,
    lesson_type,
    has_exercise,
    exercise_type,
    exercise_data,
    exercise_duration,
    pass_score,
    max_score,
    is_free,
    is_active,
    view_count,
    created_at,
    updated_at
) VALUES (
    76,
    12,
    4,
    'Ngữ pháp: Singular/Plural - Halloween',
    'Bài tập chọn dạng từ đúng (số ít/số nhiều) trong ngữ cảnh về Halloween',
    'Luyện tập ngữ pháp về dạng số ít và số nhiều của danh từ trong ngữ cảnh thực tế. Đọc đoạn văn và chọn dạng từ đúng cho mỗi vị trí được highlight.',
    NULL,
    NULL,
    NULL,
    7,  -- sort_order
    'quiz',  -- lesson_type
    TRUE,  -- has_exercise
    'grammar_choice',  -- exercise_type
    '{
      "paragraph": "Halloween is a **celebration / celebrations** on the night of 31st October. **Children / Childrens** wear **costume / costumes** and they go to people''s homes and they say, ''Trick or Treat!''. At each **house / houses** they demand **sweet / sweets**, **snack / snacks**, or a small **gift / gifts**. If they do not get it, they threaten to the **inhabitant / inhabitants** of the house. Halloween can be also celebrated by **adult / adults** who plan **parties / party**, watch horror **film / films**, or create haunted **house / houses**.",
      "questions": [
        {
          "question_id": 1,
          "highlighted_text": "**celebration / celebrations**",
          "options": [
            {"text": "celebration", "is_correct": true},
            {"text": "celebrations", "is_correct": false}
          ],
          "explanation": "Dùng số ít vì đây là một lễ hội cụ thể (Halloween)"
        },
        {
          "question_id": 2,
          "highlighted_text": "**Children / Childrens**",
          "options": [
            {"text": "Children", "is_correct": true},
            {"text": "Childrens", "is_correct": false}
          ],
          "explanation": "Children là dạng số nhiều bất quy tắc của child (không có dạng childrens)"
        },
        {
          "question_id": 3,
          "highlighted_text": "**costume / costumes**",
          "options": [
            {"text": "costume", "is_correct": false},
            {"text": "costumes", "is_correct": true}
          ],
          "explanation": "Dùng số nhiều vì nhiều trẻ em, mỗi đứa mặc một bộ trang phục"
        },
        {
          "question_id": 4,
          "highlighted_text": "**house / houses**",
          "options": [
            {"text": "house", "is_correct": true},
            {"text": "houses", "is_correct": false}
          ],
          "explanation": "Dùng số ít vì 'each' đi với danh từ số ít"
        },
        {
          "question_id": 5,
          "highlighted_text": "**sweet / sweets**",
          "options": [
            {"text": "sweet", "is_correct": false},
            {"text": "sweets", "is_correct": true}
          ],
          "explanation": "Dùng số nhiều vì đây là danh từ đếm được và có thể có nhiều kẹo"
        },
        {
          "question_id": 6,
          "highlighted_text": "**snack / snacks**",
          "options": [
            {"text": "snack", "is_correct": false},
            {"text": "snacks", "is_correct": true}
          ],
          "explanation": "Dùng số nhiều vì có thể có nhiều món ăn vặt"
        },
        {
          "question_id": 7,
          "highlighted_text": "**gift / gifts**",
          "options": [
            {"text": "gift", "is_correct": false},
            {"text": "gifts", "is_correct": true}
          ],
          "explanation": "Dùng số nhiều vì có thể có nhiều quà tặng"
        },
        {
          "question_id": 8,
          "highlighted_text": "**inhabitant / inhabitants**",
          "options": [
            {"text": "inhabitant", "is_correct": false},
            {"text": "inhabitants", "is_correct": true}
          ],
          "explanation": "Dùng số nhiều vì một ngôi nhà có thể có nhiều người ở"
        },
        {
          "question_id": 9,
          "highlighted_text": "**adult / adults**",
          "options": [
            {"text": "adult", "is_correct": false},
            {"text": "adults", "is_correct": true}
          ],
          "explanation": "Dùng số nhiều vì có nhiều người lớn"
        },
        {
          "question_id": 10,
          "highlighted_text": "**parties / party**",
          "options": [
            {"text": "parties", "is_correct": true},
            {"text": "party", "is_correct": false}
          ],
          "explanation": "Dùng số nhiều vì có thể tổ chức nhiều bữa tiệc"
        },
        {
          "question_id": 11,
          "highlighted_text": "**film / films**",
          "options": [
            {"text": "film", "is_correct": false},
            {"text": "films", "is_correct": true}
          ],
          "explanation": "Dùng số nhiều vì có thể xem nhiều phim"
        },
        {
          "question_id": 12,
          "highlighted_text": "**house / houses**",
          "options": [
            {"text": "house", "is_correct": false},
            {"text": "houses", "is_correct": true}
          ],
          "explanation": "Dùng số nhiều vì có thể tạo nhiều ngôi nhà ma ám"
        }
      ]
    }',
    20,  -- exercise_duration (phút)
    60,  -- pass_score (60%)
    12,  -- max_score (1 điểm/câu)
    FALSE,  -- is_free
    TRUE,  -- is_active
    0,  -- view_count
    NOW(),
    NOW()
);

-- Kiểm tra kết quả
SELECT 
    lesson_id,
    module_id,
    course_id,
    title,
    lesson_type,
    exercise_type,
    has_exercise,
    JSON_LENGTH(JSON_EXTRACT(exercise_data, '$.questions')) as total_questions,
    max_score,
    pass_score
FROM lessons 
WHERE lesson_id = 76;


