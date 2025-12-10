-- ============================================
-- Script kiểm tra sau khi migration
-- Database: elearn5
-- ============================================

USE elearn5;

-- ✅ 1. Kiểm tra số lượng record (phải giữ nguyên)
SELECT 
    'Tổng số lessons' AS check_type,
    COUNT(*) AS count_value,
    'Phải giữ nguyên như trước migration' AS note
FROM lessons;

-- ✅ 2. Kiểm tra phân bố lesson_type
SELECT 
    lesson_type,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM lessons), 2) AS percentage
FROM lessons
GROUP BY lesson_type
ORDER BY count DESC;

-- ✅ 3. Kiểm tra dữ liệu video cũ (phải còn đầy đủ)
SELECT 
    'Video lessons có video_url' AS check_type,
    COUNT(*) AS count_value
FROM lessons
WHERE lesson_type = 'video' AND video_url IS NOT NULL AND video_url != '';

-- ✅ 4. Kiểm tra cột mới đã được thêm
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'elearn5' 
  AND TABLE_NAME = 'lessons'
  AND COLUMN_NAME IN ('lesson_data', 'lesson_data_type', 'metadata')
ORDER BY ORDINAL_POSITION;

-- ✅ 5. Kiểm tra lesson_data (phải NULL cho record cũ)
SELECT 
    'Lessons có lesson_data' AS check_type,
    COUNT(*) AS count_value,
    'Record cũ sẽ là NULL (OK)' AS note
FROM lessons
WHERE lesson_data IS NOT NULL;

SELECT 
    'Lessons có lesson_data = NULL' AS check_type,
    COUNT(*) AS count_value,
    'Đây là record cũ (OK)' AS note
FROM lessons
WHERE lesson_data IS NULL;

-- ✅ 6. Kiểm tra một vài record cụ thể
SELECT 
    lesson_id,
    title,
    lesson_type,
    video_url IS NOT NULL AS has_video_url,
    content IS NOT NULL AS has_content,
    lesson_data IS NOT NULL AS has_lesson_data
FROM lessons
ORDER BY lesson_id
LIMIT 10;

-- ✅ 7. Kiểm tra index đã được tạo
SHOW INDEX FROM lessons WHERE Key_name IN ('idx_lesson_type', 'idx_lesson_data_type');

-- ============================================
-- ✅ KẾT QUẢ MONG ĐỢI:
-- ============================================
-- 1. Tổng số lessons: Giữ nguyên
-- 2. lesson_type: Chủ yếu là 'video' (record cũ)
-- 3. Video lessons: Có video_url đầy đủ
-- 4. lesson_data: NULL cho tất cả record cũ (OK)
-- 5. Index: Đã được tạo thành công
-- ============================================

