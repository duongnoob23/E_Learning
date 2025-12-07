-- ============================================
-- FIX: Pair Matching Lesson
-- Đã sửa lesson_type từ 'exercise' thành 'quiz'
-- ============================================

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
  'Luyện tập: Tìm cặp từ vựng',
  'Bài tập ghép từ tiếng Anh với nghĩa tiếng Việt tương ứng.',
  'Hãy ghép các từ tiếng Anh ở cột trái với nghĩa tiếng Việt ở cột phải. Click vào từ để chọn, sau đó click vào nghĩa tương ứng để ghép cặp.',
  '',
  '',
  'pair_matching',
  JSON_OBJECT(
    'pairs', JSON_ARRAY(
      JSON_OBJECT('id', 1, 'word', 'hello', 'meaning', 'xin chào'),
      JSON_OBJECT('id', 2, 'word', 'goodbye', 'meaning', 'tạm biệt'),
      JSON_OBJECT('id', 3, 'word', 'thank you', 'meaning', 'cảm ơn'),
      JSON_OBJECT('id', 4, 'word', 'please', 'meaning', 'xin vui lòng'),
      JSON_OBJECT('id', 5, 'word', 'sorry', 'meaning', 'xin lỗi'),
      JSON_OBJECT('id', 6, 'word', 'welcome', 'meaning', 'chào mừng'),
      JSON_OBJECT('id', 7, 'word', 'yes', 'meaning', 'có'),
      JSON_OBJECT('id', 8, 'word', 'no', 'meaning', 'không')
    ),
    'shuffle', TRUE
  ),
  10,  -- exercise_duration
  0,   -- pass_score
  0,   -- max_score
  2,   -- sort_order
  'quiz',  -- ✅ ĐÃ SỬA: từ 'exercise' thành 'quiz'
  1,   -- has_exercise
  1,   -- is_free
  1,   -- is_active
  0,   -- view_count
  NOW(),
  NOW()
);

