-- ============================================
-- Migration: Mở rộng bảng lessons (AN TOÀN - KHÔNG MẤT DỮ LIỆU)
-- Database: elearn5
-- ============================================

-- ✅ BƯỚC 1: Backup dữ liệu (OPTIONAL - nên làm trước khi chạy migration)
-- CREATE TABLE lessons_backup AS SELECT * FROM lessons;

-- ✅ BƯỚC 2: Mở rộng ENUM lesson_type
-- LƯU Ý: ALTER TABLE ... MODIFY COLUMN ENUM sẽ KHÔNG mất dữ liệu
-- Các giá trị cũ vẫn giữ nguyên, chỉ thêm giá trị mới vào
ALTER TABLE `lessons` 
MODIFY COLUMN `lesson_type` ENUM(
  -- Loại cũ (giữ nguyên - không thay đổi)
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

-- ✅ BƯỚC 3: Thêm cột JSON cho dữ liệu động
-- LƯU Ý: ADD COLUMN với allowNull: true sẽ KHÔNG ảnh hưởng dữ liệu cũ
-- Tất cả record cũ sẽ có lesson_data = NULL (hoàn toàn OK)
ALTER TABLE `lessons` 
ADD COLUMN `lesson_data` JSON 
COMMENT 'Dữ liệu động theo lesson_type (vocabulary, grammar, quiz...)'
AFTER `content`;

-- ✅ BƯỚC 4: Thêm index cho performance
-- LƯU Ý: ADD INDEX không ảnh hưởng dữ liệu, chỉ tạo index
ALTER TABLE `lessons` 
ADD INDEX `idx_lesson_type` (`lesson_type`);

-- ✅ BƯỚC 5: (Optional) Generated column để query dễ hơn
-- LƯU Ý: Generated column tự động tính toán, không ảnh hưởng dữ liệu
ALTER TABLE `lessons`
ADD COLUMN `lesson_data_type` VARCHAR(50) 
GENERATED ALWAYS AS (
  CASE 
    WHEN `lesson_data` IS NULL THEN NULL
    ELSE JSON_UNQUOTE(JSON_EXTRACT(`lesson_data`, '$.type'))
  END
) STORED 
COMMENT 'Auto-generated từ lesson_data.type để query dễ hơn'
AFTER `lesson_data`;

-- ✅ BƯỚC 6: Thêm index cho generated column
ALTER TABLE `lessons`
ADD INDEX `idx_lesson_data_type` (`lesson_data_type`);

-- ✅ BƯỚC 7: (Optional) Thêm cột metadata cho tracking
ALTER TABLE `lessons`
ADD COLUMN `metadata` JSON 
COMMENT 'Metadata bổ sung (tags, difficulty, etc.)'
AFTER `lesson_data`;

-- ============================================
-- ✅ KIỂM TRA SAU KHI CHẠY:
-- ============================================
-- SELECT COUNT(*) FROM lessons; -- Đảm bảo số lượng record không đổi
-- SELECT lesson_type, COUNT(*) FROM lessons GROUP BY lesson_type; -- Kiểm tra phân bố
-- SELECT * FROM lessons WHERE lesson_id = 1; -- Kiểm tra 1 record cụ thể
-- 
-- ============================================
-- ⚠️ ROLLBACK (nếu cần):
-- ============================================
-- ALTER TABLE `lessons` DROP COLUMN `metadata`;
-- ALTER TABLE `lessons` DROP INDEX `idx_lesson_data_type`;
-- ALTER TABLE `lessons` DROP COLUMN `lesson_data_type`;
-- ALTER TABLE `lessons` DROP INDEX `idx_lesson_type`;
-- ALTER TABLE `lessons` DROP COLUMN `lesson_data`;
-- ALTER TABLE `lessons` MODIFY COLUMN `lesson_type` ENUM('video','document','quiz','assignment','live') DEFAULT 'video';
-- 
-- ============================================
-- 📝 LƯU Ý QUAN TRỌNG:
-- ============================================
-- 1. ✅ TẤT CẢ các lệnh trên CHỈ THÊM, KHÔNG XÓA/SỬA dữ liệu cũ
-- 2. ✅ Dữ liệu video hiện tại (video_url, content) vẫn giữ nguyên 100%
-- 3. ✅ lesson_data = NULL cho tất cả record cũ (hoàn toàn OK)
-- 4. ✅ Code video hiện tại vẫn chạy bình thường
-- 5. ✅ Có thể rollback an toàn nếu cần
-- ============================================

