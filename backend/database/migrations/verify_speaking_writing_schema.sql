-- Script kiểm tra và so sánh schema speaking_responses và writing_responses
-- Chạy script này để xác nhận schema đã đúng chưa

USE e_learnning6;

-- ============================================
-- 1. KIỂM TRA speaking_responses
-- ============================================
SELECT 
    'speaking_responses' as table_name,
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'elearn5'
  AND TABLE_NAME = 'speaking_responses'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra các cột điểm số có tồn tại không
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'elearn5' 
            AND TABLE_NAME = 'speaking_responses' 
            AND COLUMN_NAME = 'pronunciation_score'
        ) THEN '✅ pronunciation_score exists'
        ELSE '❌ pronunciation_score MISSING'
    END as check_pronunciation_score,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'elearn5' 
            AND TABLE_NAME = 'speaking_responses' 
            AND COLUMN_NAME = 'fluency_score'
        ) THEN '✅ fluency_score exists'
        ELSE '❌ fluency_score MISSING'
    END as check_fluency_score,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'elearn5' 
            AND TABLE_NAME = 'speaking_responses' 
            AND COLUMN_NAME = 'prosody_score'
        ) THEN '✅ prosody_score exists'
        ELSE '❌ prosody_score MISSING'
    END as check_prosody_score,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'elearn5' 
            AND TABLE_NAME = 'speaking_responses' 
            AND COLUMN_NAME = 'transcript'
        ) THEN '✅ transcript exists'
        ELSE '❌ transcript MISSING'
    END as check_transcript,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'elearn5' 
            AND TABLE_NAME = 'speaking_responses' 
            AND COLUMN_NAME = 'detailed_feedback'
        ) THEN '✅ detailed_feedback exists'
        ELSE '❌ detailed_feedback MISSING'
    END as check_detailed_feedback;

-- ============================================
-- 2. KIỂM TRA writing_responses
-- ============================================
SELECT 
    'writing_responses' as table_name,
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'elearn5'
  AND TABLE_NAME = 'writing_responses'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra các cột điểm số có tồn tại không
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'elearn5' 
            AND TABLE_NAME = 'writing_responses' 
            AND COLUMN_NAME = 'task_completion_score'
        ) THEN '✅ task_completion_score exists'
        ELSE '❌ task_completion_score MISSING'
    END as check_task_completion_score,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'elearn5' 
            AND TABLE_NAME = 'writing_responses' 
            AND COLUMN_NAME = 'spelling_score'
        ) THEN '✅ spelling_score exists'
        ELSE '❌ spelling_score MISSING'
    END as check_spelling_score,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'elearn5' 
            AND TABLE_NAME = 'writing_responses' 
            AND COLUMN_NAME = 'detailed_feedback'
        ) THEN '✅ detailed_feedback exists'
        ELSE '❌ detailed_feedback MISSING'
    END as check_detailed_feedback;

-- ============================================
-- 3. KIỂM TRA ENUM của questions và parts
-- ============================================
SELECT 
    'questions.question_type' as enum_name,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'elearn5'
  AND TABLE_NAME = 'questions'
  AND COLUMN_NAME = 'question_type';

SELECT 
    'parts.part_type' as enum_name,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'elearn5'
  AND TABLE_NAME = 'parts'
  AND COLUMN_NAME = 'part_type';

-- ============================================
-- 4. TỔNG KẾT
-- ============================================
SELECT 
    'Schema verification completed!' as status,
    'Check the results above to see if any columns are missing.' as note;

