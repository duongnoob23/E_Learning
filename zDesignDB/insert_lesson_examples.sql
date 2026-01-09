-- ============================================
-- SQL INSERT STATEMENTS - LESSON EXAMPLES
-- Các lesson mẫu với các dạng bài tập khác nhau
-- ============================================

-- Lưu ý: Thay đổi module_id và course_id phù hợp với database của bạn
-- Ví dụ: module_id = 1, course_id = 1

-- ============================================
-- 1. LESSON: Multiple Choice (Trắc nghiệm)
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
  1,  -- Thay đổi module_id
  1,  -- Thay đổi course_id
  'Pronunciation Practice – Bài tập Trắc nghiệm',
  'Bài tập kiểm tra khả năng phân biệt các cặp âm trong tiếng Anh.',
  'Bài tập này giúp học viên ôn lại 5 cặp âm: /ɪ/ vs /iː/, /ɪ/ vs /e/, /e/ vs /eɪ/, /æ/ vs /ʌ/ và /əʊ/ vs /ɔː/. Mỗi câu hỏi sẽ yêu cầu chọn đáp án đúng dựa trên phát âm hoặc ngữ nghĩa.',
  'https://storage.googleapis.com/my-course-videos/example.mp4',
  '15:00',
  'multiple_choice',
  JSON_OBJECT(
    'questions', JSON_ARRAY(
      JSON_OBJECT(
        'question', 'Chọn cách phát âm đúng của từ "seat".',
        'options', JSON_ARRAY('/ɪ/', '/iː/'),
        'answer', '/iː/',
        'explanation', 'Từ "seat" có âm dài /iː/'
      ),
      JSON_OBJECT(
        'question', 'Âm trong từ "bed" là gì?',
        'options', JSON_ARRAY('/ɪ/', '/e/'),
        'answer', '/e/',
        'explanation', 'Từ "bed" có âm /e/'
      ),
      JSON_OBJECT(
        'question', 'Từ "late" chứa âm nào?',
        'options', JSON_ARRAY('/e/', '/eɪ/'),
        'answer', '/eɪ/',
        'explanation', 'Từ "late" có âm đôi /eɪ/'
      ),
      JSON_OBJECT(
        'question', 'Từ "run" có âm chính là?',
        'options', JSON_ARRAY('/æ/', '/ʌ/'),
        'answer', '/ʌ/',
        'explanation', 'Từ "run" có âm /ʌ/'
      ),
      JSON_OBJECT(
        'question', 'Chọn âm đúng trong từ "saw".',
        'options', JSON_ARRAY('/əʊ/', '/ɔː/'),
        'answer', '/ɔː/',
        'explanation', 'Từ "saw" có âm dài /ɔː/'
      )
    )
  ),
  15,  -- exercise_duration (phút)
  70,  -- pass_score (%)
  100, -- max_score
  1,   -- sort_order
  'quiz',
  1,   -- has_exercise
  1,   -- is_free
  1,   -- is_active
  0,   -- view_count
  NOW(),
  NOW()
);

-- ============================================
-- 2. LESSON: Pair Matching (Tìm cặp)
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
  1,  -- Thay đổi module_id
  1,  -- Thay đổi course_id
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
  'quiz',  -- lesson_type: dùng 'quiz' cho bài tập
  1,   -- has_exercise
  1,   -- is_free
  1,   -- is_active
  0,   -- view_count
  NOW(),
  NOW()
);

-- ============================================
-- 3. LESSON: Translation (Dịch nghĩa)
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
  1,  -- Thay đổi module_id
  1,  -- Thay đổi course_id
  'Luyện tập: Dịch nghĩa',
  'Bài tập dịch từ tiếng Anh sang tiếng Việt.',
  'Hãy dịch các từ sau sang tiếng Việt. Nhập đáp án và nhấn "Kiểm tra" để xem kết quả.',
  '',
  '',
  'translation',
  JSON_OBJECT(
    'questions', JSON_ARRAY(
      JSON_OBJECT(
        'word', 'hello',
        'correct_answer', 'xin chào',
        'hint', 'Lời chào thông dụng nhất'
      ),
      JSON_OBJECT(
        'word', 'goodbye',
        'correct_answer', 'tạm biệt',
        'hint', 'Lời chào khi chia tay'
      ),
      JSON_OBJECT(
        'word', 'thank you',
        'correct_answer', 'cảm ơn',
        'hint', 'Dùng để bày tỏ lòng biết ơn'
      ),
      JSON_OBJECT(
        'word', 'please',
        'correct_answer', 'xin vui lòng',
        'hint', 'Dùng để lịch sự khi yêu cầu'
      ),
      JSON_OBJECT(
        'word', 'sorry',
        'correct_answer', 'xin lỗi',
        'hint', 'Dùng để xin lỗi'
      )
    )
  ),
  10,  -- exercise_duration
  0,   -- pass_score
  0,   -- max_score
  3,   -- sort_order
  'quiz',  -- lesson_type: dùng 'quiz' cho bài tập
  1,   -- has_exercise
  1,   -- is_free
  1,   -- is_active
  0,   -- view_count
  NOW(),
  NOW()
);

-- ============================================
-- 4. LESSON: Vocabulary List (Danh sách từ vựng)
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
  1,  -- Thay đổi module_id
  1,  -- Thay đổi course_id
  'Từ vựng: Danh sách từ vựng (Cơ bản)',
  'Danh sách các từ vựng cơ bản thông dụng nhất trong tiếng Anh.',
  'Học và ghi nhớ các từ vựng cơ bản này. Click vào nút  để nghe phát âm.',
  '',
  '',
  'vocabulary_list',
  JSON_OBJECT(
    'topic_id', 1,  -- Thay đổi topic_id nếu có
    'level', 'basic',
    'words', JSON_ARRAY(
      JSON_OBJECT(
        'word_id', 1,
        'word', 'hello',
        'phonetic', '/həˈloʊ/',
        'partOfSpeech', 'interjection',
        'meaning', 'xin chào',
        'example', 'Hello, how are you?',
        'exampleVi', 'Xin chào, bạn khỏe không?',
        'audio', NULL
      ),
      JSON_OBJECT(
        'word_id', 2,
        'word', 'goodbye',
        'phonetic', '/ɡʊdˈbaɪ/',
        'partOfSpeech', 'interjection',
        'meaning', 'tạm biệt',
        'example', 'Goodbye, see you tomorrow!',
        'exampleVi', 'Tạm biệt, hẹn gặp lại ngày mai!',
        'audio', NULL
      ),
      JSON_OBJECT(
        'word_id', 3,
        'word', 'thank you',
        'phonetic', '/θæŋk juː/',
        'partOfSpeech', 'phrase',
        'meaning', 'cảm ơn',
        'example', 'Thank you for your help.',
        'exampleVi', 'Cảm ơn bạn đã giúp đỡ.',
        'audio', NULL
      ),
      JSON_OBJECT(
        'word_id', 4,
        'word', 'please',
        'phonetic', '/pliːz/',
        'partOfSpeech', 'adverb',
        'meaning', 'xin vui lòng',
        'example', 'Please sit down.',
        'exampleVi', 'Xin vui lòng ngồi xuống.',
        'audio', NULL
      ),
      JSON_OBJECT(
        'word_id', 5,
        'word', 'sorry',
        'phonetic', '/ˈsɒri/',
        'partOfSpeech', 'adjective',
        'meaning', 'xin lỗi',
        'example', 'I am sorry for being late.',
        'exampleVi', 'Tôi xin lỗi vì đến muộn.',
        'audio', NULL
      )
    )
  ),
  0,   -- exercise_duration
  0,   -- pass_score
  0,   -- max_score
  4,   -- sort_order
  'document',  -- lesson_type: dùng 'document' cho danh sách từ vựng
  1,   -- has_exercise
  1,   -- is_free
  1,   -- is_active
  0,   -- view_count
  NOW(),
  NOW()
);

-- ============================================
-- 5. LESSON: Full Lý thuyết + Bài tập (Video + Exercise)
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
  1,  -- Thay đổi module_id
  1,  -- Thay đổi course_id
  'Present Simple - Lý thuyết và Bài tập',
  'Học về thì hiện tại đơn kèm bài tập thực hành.',
  '🔷 Cấu trúc: Subject + Verb (s/es) + Object\n\nVí dụ:\n- I play football every day.\n- She goes to school by bus.\n- They study English.\n\n🔷 Cách dùng:\n- Diễn tả thói quen, hành động lặp đi lặp lại\n- Diễn tả sự thật hiển nhiên\n- Diễn tả lịch trình, thời gian biểu',
  'https://storage.googleapis.com/my-course-videos/present-simple.mp4',
  '10:00',
  'multiple_choice',
  JSON_OBJECT(
    'questions', JSON_ARRAY(
      JSON_OBJECT(
        'question', 'Chọn câu đúng:',
        'options', JSON_ARRAY(
          'I go to school every day.',
          'I goes to school every day.',
          'I am go to school every day.'
        ),
        'answer', 'I go to school every day.',
        'explanation', 'Với chủ ngữ "I", động từ giữ nguyên dạng gốc.'
      ),
      JSON_OBJECT(
        'question', 'Chọn câu đúng:',
        'options', JSON_ARRAY(
          'She play tennis.',
          'She plays tennis.',
          'She playing tennis.'
        ),
        'answer', 'She plays tennis.',
        'explanation', 'Với chủ ngữ ngôi thứ 3 số ít (he/she/it), động từ thêm s/es.'
      ),
      JSON_OBJECT(
        'question', 'Chọn câu đúng:',
        'options', JSON_ARRAY(
          'They doesn\'t like coffee.',
          'They don\'t like coffee.',
          'They not like coffee.'
        ),
        'answer', 'They don\'t like coffee.',
        'explanation', 'Với chủ ngữ số nhiều, dùng "don\'t" (do not).'
      )
    )
  ),
  15,  -- exercise_duration
  70,  -- pass_score
  100, -- max_score
  5,   -- sort_order
  'video',
  1,   -- has_exercise
  1,   -- is_free
  1,   -- is_active
  0,   -- view_count
  NOW(),
  NOW()
);

-- ============================================
-- 6. LESSON: Chỉ có Video (không có bài tập)
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
  1,  -- Thay đổi module_id
  1,  -- Thay đổi course_id
  'Past Simple - Lý thuyết',
  'Học về thì quá khứ đơn trong tiếng Anh.',
  '🔷 Cấu trúc: Subject + Verb (V2/ed) + Object\n\nVí dụ:\n- I went to school yesterday.\n- She played tennis last week.\n- They studied English last year.\n\n🔷 Cách dùng:\n- Diễn tả hành động đã xảy ra và kết thúc trong quá khứ\n- Có thời gian xác định trong quá khứ',
  'https://storage.googleapis.com/my-course-videos/past-simple.mp4',
  '12:00',
  '',
  NULL,
  0,
  0,
  0,
  6,
  'video',
  0,   -- has_exercise = 0 (không có bài tập)
  1,
  1,
  0,
  NOW(),
  NOW()
);

-- ============================================
-- HƯỚNG DẪN SỬ DỤNG:
-- ============================================
-- 1. Thay đổi module_id và course_id phù hợp với database của bạn
-- 2. Thay đổi topic_id trong lesson vocabulary_list nếu cần
-- 3. Chạy từng câu lệnh INSERT hoặc chạy tất cả cùng lúc
-- 4. Kiểm tra kết quả:
--    - Lesson 1: Multiple Choice (quiz)
--    - Lesson 2: Pair Matching (exercise)
--    - Lesson 3: Translation (exercise)
--    - Lesson 4: Vocabulary List (exercise)
--    - Lesson 5: Video + Exercise (video với has_exercise = 1)
--    - Lesson 6: Chỉ Video (video với has_exercise = 0)
--
-- ============================================
-- QUERY ĐỂ KIỂM TRA:
-- ============================================
-- SELECT 
--   lesson_id,
--   title,
--   lesson_type,
--   has_exercise,
--   exercise_type,
--   exercise_data
-- FROM lessons 
-- WHERE course_id = 1 
-- ORDER BY sort_order;

