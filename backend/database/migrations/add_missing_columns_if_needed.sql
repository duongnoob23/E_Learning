-- Migration: Thêm các cột còn thiếu vào speaking_responses và writing_responses
-- Chạy script này nếu kiểm tra thấy thiếu cột

USE elearn5;

-- ============================================
-- 1. THÊM CÁC CỘT CÒN THIẾU VÀO speaking_responses
-- ============================================

-- Thêm pronunciation_score nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'speaking_responses' 
    AND COLUMN_NAME = 'pronunciation_score'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE speaking_responses ADD COLUMN pronunciation_score FLOAT COMMENT ''Pronunciation score (0-100)''',
    'SELECT ''pronunciation_score already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm fluency_score nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'speaking_responses' 
    AND COLUMN_NAME = 'fluency_score'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE speaking_responses ADD COLUMN fluency_score FLOAT COMMENT ''Fluency score (0-100) - from MultiPA''',
    'SELECT ''fluency_score already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm prosody_score nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'speaking_responses' 
    AND COLUMN_NAME = 'prosody_score'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE speaking_responses ADD COLUMN prosody_score FLOAT COMMENT ''Prosody score (0-100) - from MultiPA''',
    'SELECT ''prosody_score already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm transcript nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'speaking_responses' 
    AND COLUMN_NAME = 'transcript'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE speaking_responses ADD COLUMN transcript TEXT COMMENT ''MultiPA transcription result''',
    'SELECT ''transcript already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm grammar_score nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'speaking_responses' 
    AND COLUMN_NAME = 'grammar_score'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE speaking_responses ADD COLUMN grammar_score FLOAT COMMENT ''Grammar score (0-100)''',
    'SELECT ''grammar_score already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm vocabulary_score nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'speaking_responses' 
    AND COLUMN_NAME = 'vocabulary_score'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE speaking_responses ADD COLUMN vocabulary_score FLOAT COMMENT ''Vocabulary score (0-100)''',
    'SELECT ''vocabulary_score already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm coherence_score nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'speaking_responses' 
    AND COLUMN_NAME = 'coherence_score'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE speaking_responses ADD COLUMN coherence_score FLOAT COMMENT ''Coherence/Organization score (0-100)''',
    'SELECT ''coherence_score already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm detailed_feedback nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'speaking_responses' 
    AND COLUMN_NAME = 'detailed_feedback'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE speaking_responses ADD COLUMN detailed_feedback JSON COMMENT ''Detailed feedback for each criterion''',
    'SELECT ''detailed_feedback already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 2. THÊM CÁC CỘT CÒN THIẾU VÀO writing_responses
-- ============================================

-- Thêm task_completion_score nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'writing_responses' 
    AND COLUMN_NAME = 'task_completion_score'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE writing_responses ADD COLUMN task_completion_score FLOAT COMMENT ''Task completion score (0-100)''',
    'SELECT ''task_completion_score already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm spelling_score nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'writing_responses' 
    AND COLUMN_NAME = 'spelling_score'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE writing_responses ADD COLUMN spelling_score FLOAT COMMENT ''Spelling score (0-100)''',
    'SELECT ''spelling_score already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm detailed_feedback nếu chưa có
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'elearn5' 
    AND TABLE_NAME = 'writing_responses' 
    AND COLUMN_NAME = 'detailed_feedback'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE writing_responses ADD COLUMN detailed_feedback JSON COMMENT ''Detailed feedback for each criterion''',
    'SELECT ''detailed_feedback already exists'' as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- Migration completed!
-- ============================================
SELECT 'Missing columns migration completed!' as status;

