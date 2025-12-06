-- ============================================
-- Migration: Mở rộng bảng lessons để hỗ trợ
-- nhiều loại khóa học (video, vocabulary, grammar)
-- ============================================

-- ✅ BƯỚC 1: Mở rộng ENUM lesson_type
-- Thêm các loại bài tập từ vựng và ngữ pháp
ALTER TABLE `lessons` 
MODIFY COLUMN `lesson_type` ENUM(
  -- Loại cũ (giữ nguyên)
  'video',           -- Video bài giảng
  'document',        -- Tài liệu
  'quiz',            -- Quiz
  'assignment',      -- Bài tập
  'live',            -- Live stream
  
  -- Loại mới: Vocabulary
  'vocabulary_list',              -- 1. Danh sách từ mới (list/flashcard)
  'vocabulary_matching',           -- 2. Tìm cặp (4x4 matrix)
  'vocabulary_translation',        -- 3. Dịch nghĩa (nhập text)
  'vocabulary_quiz',               -- 4. Trắc nghiệm từ
  'vocabulary_listening',          -- 5. Nghe từ vựng (audio + 3x3)
  'vocabulary_image_choice',       -- 6. Chọn ảnh (en -> image)
  'vocabulary_sentence_completion', -- 7. Hoàn thiện câu (drag & drop)
  
  -- Loại mới: Grammar
  'grammar_theory'                 -- 8. Lý thuyết ngữ pháp
) DEFAULT 'video';

-- ✅ BƯỚC 2: Thêm cột JSON cho dữ liệu động
-- Cột này sẽ chứa dữ liệu đặc thù cho từng loại bài tập
ALTER TABLE `lessons` 
ADD COLUMN `lesson_data` JSON COMMENT 'Dữ liệu động theo lesson_type (vocabulary, grammar, quiz...)'
AFTER `content`;

-- ✅ BƯỚC 3: Thêm index cho performance
ALTER TABLE `lessons` 
ADD INDEX `idx_lesson_type` (`lesson_type`);

-- ✅ BƯỚC 4: (Optional) Generated column để query dễ hơn
-- Giúp query lesson_data.type mà không cần JSON_EXTRACT
ALTER TABLE `lessons`
ADD COLUMN `lesson_data_type` VARCHAR(50) 
GENERATED ALWAYS AS (
  CASE 
    WHEN `lesson_data` IS NULL THEN NULL
    ELSE JSON_UNQUOTE(JSON_EXTRACT(`lesson_data`, '$.type'))
  END
) STORED 
AFTER `lesson_data`;

-- ✅ BƯỚC 5: Thêm index cho generated column
ALTER TABLE `lessons`
ADD INDEX `idx_lesson_data_type` (`lesson_data_type`);

-- ✅ BƯỚC 6: (Optional) Thêm cột metadata cho tracking
ALTER TABLE `lessons`
ADD COLUMN `metadata` JSON COMMENT 'Metadata bổ sung (tags, difficulty, etc.)'
AFTER `lesson_data`;

-- ============================================
-- 📝 LƯU Ý:
-- 1. Các field cũ (video_url, content) vẫn giữ nguyên
--    để backward compatible với code video hiện tại
-- 2. lesson_data chỉ dùng cho các loại bài tập mới
-- 3. Cần validate JSON schema ở application layer
-- ============================================

