-- ============================================
-- QUICK TEST - Thêm 1 lesson Multiple Choice
-- Để test nhanh, chỉ cần chạy câu lệnh này
-- ============================================

-- ⚠️ LƯU Ý: Thay đổi module_id và course_id phù hợp với database của bạn!

INSERT INTO lessons (
  module_id, 
  course_id, 
  title, 
  description, 
  content,
  video_url,
  video_duration,
  exercise_type,
  exercise_data,
  exercise_duration,
  pass_score,
  max_score,
  sort_order,
  lesson_type,
  has_exercise,
  is_free,
  is_active,
  view_count,
  created_at,
  updated_at
) VALUES (
  1,  -- ⚠️ THAY ĐỔI: module_id của bạn
  1,  -- ⚠️ THAY ĐỔI: course_id của bạn
  'TEST: Bài tập Trắc nghiệm',
  'Bài tập test để kiểm tra hệ thống exercises.',
  'Đây là bài tập test. Hãy chọn đáp án đúng cho mỗi câu hỏi.',
  '',
  '',
  'multiple_choice',
  '{"questions": [{"question": "Chọn cách phát âm đúng của từ \"seat\".", "options": ["/ɪ/", "/iː/"], "answer": "/iː/", "explanation": "Từ \"seat\" có âm dài /iː/"}, {"question": "Âm trong từ \"bed\" là gì?", "options": ["/ɪ/", "/e/"], "answer": "/e/", "explanation": "Từ \"bed\" có âm /e/"}]}',
  10,
  70,
  100,
  999,  -- sort_order cao để dễ tìm
  'quiz',
  1,
  1,
  1,
  0,
  NOW(),
  NOW()
);

-- ============================================
-- Sau khi chạy, kiểm tra:
-- ============================================
-- SELECT lesson_id, title, exercise_type, has_exercise 
-- FROM lessons 
-- WHERE title LIKE 'TEST:%';

