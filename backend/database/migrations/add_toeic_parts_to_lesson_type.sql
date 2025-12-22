-- ============================================
-- Migration: Thêm TOEIC Parts (Part 1-7) vào ENUM lesson_type
-- ============================================

-- ✅ BƯỚC 1: Mở rộng ENUM lesson_type để thêm 7 TOEIC parts
ALTER TABLE `lessons` 
MODIFY COLUMN `lesson_type` ENUM(
  -- Loại cũ (giữ nguyên)
  'video',           -- Video bài giảng
  'document',        -- Tài liệu
  'quiz',            -- Quiz
  'assignment',      -- Bài tập
  'live',            -- Live stream
  
  -- Vocabulary types
  'vocabulary_list',              -- 1. Danh sách từ mới (list/flashcard)
  'vocabulary_matching',           -- 2. Tìm cặp (4x4 matrix)
  'vocabulary_translation',        -- 3. Dịch nghĩa (nhập text)
  'vocabulary_quiz',               -- 4. Trắc nghiệm từ
  'vocabulary_listening',          -- 5. Nghe từ vựng (audio + 3x3)
  'vocabulary_image_choice',       -- 6. Chọn ảnh (en -> image)
  'vocabulary_sentence_completion', -- 7. Hoàn thiện câu (drag & drop)
  
  -- Grammar
  'grammar_theory',                 -- 8. Lý thuyết ngữ pháp
  
  -- TOEIC Parts (mới)
  'toeic_part_1',                  -- TOEIC Part 1: Picture Description
  'toeic_part_2',                  -- TOEIC Part 2: Question-Response
  'toeic_part_3',                  -- TOEIC Part 3: Conversations
  'toeic_part_4',                  -- TOEIC Part 4: Talks
  'toeic_part_5',                  -- TOEIC Part 5: Incomplete Sentences
  'toeic_part_6',                  -- TOEIC Part 6: Text Completion
  'toeic_part_7'                   -- TOEIC Part 7: Reading Comprehension
) DEFAULT 'video';

-- ============================================
-- 📝 LƯU Ý:
-- 1. Migration này chỉ thêm các giá trị mới vào ENUM, không ảnh hưởng dữ liệu cũ
-- 2. Các lesson hiện tại vẫn giữ nguyên lesson_type
-- 3. Sau khi chạy migration, có thể tạo lesson với lesson_type = 'toeic_part_1' đến 'toeic_part_7'
-- ============================================

-- ✅ BƯỚC 2: Verify migration (optional - chạy để kiểm tra)
-- SELECT COLUMN_TYPE 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = DATABASE() 
--   AND TABLE_NAME = 'lessons' 
--   AND COLUMN_NAME = 'lesson_type';

