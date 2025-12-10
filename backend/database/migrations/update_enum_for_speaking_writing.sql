-- Migration: Update ENUM cho questions và parts để hỗ trợ SPEAKING và WRITING
-- Chạy file này để cập nhật database schema

USE elearn5;

-- ============================================
-- 1. UPDATE question_type ENUM trong bảng questions
-- ============================================
-- Thêm 'SPEAKING' và 'WRITING' vào enum question_type
ALTER TABLE questions 
MODIFY COLUMN question_type ENUM(
    'MULTIPLE_CHOICE',
    'FILL_BLANK',
    'READING_COMPREHENSION',
    'SPEAKING',
    'WRITING'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại câu hỏi';

-- ============================================
-- 2. UPDATE part_type ENUM trong bảng parts
-- ============================================
-- Thêm 'SPEAKING' và 'WRITING' vào enum part_type
ALTER TABLE parts 
MODIFY COLUMN part_type ENUM(
    'LISTENING',
    'READING',
    'SPEAKING',
    'WRITING'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại phần thi';

-- ============================================
-- 3. VERIFY CHANGES
-- ============================================
-- Kiểm tra enum đã được update chưa
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'elearn5'
  AND TABLE_NAME = 'questions'
  AND COLUMN_NAME = 'question_type';

SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'elearn5'
  AND TABLE_NAME = 'parts'
  AND COLUMN_NAME = 'part_type';

-- ============================================
-- Migration completed successfully!
-- ============================================
SELECT 'ENUM update migration completed successfully!' as status;

