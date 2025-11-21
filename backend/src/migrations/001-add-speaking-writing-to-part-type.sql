-- Migration: Add SPEAKING and WRITING to part_type ENUM
-- Run this script to update your database schema

-- Step 1: Add SPEAKING and WRITING to part_type ENUM
ALTER TABLE parts 
MODIFY COLUMN part_type ENUM('LISTENING', 'READING', 'SPEAKING', 'WRITING') NOT NULL;

-- Step 2: Update existing Speaking test data
-- Replace test titles according to your actual data
UPDATE parts 
SET part_type = 'SPEAKING' 
WHERE test_id IN (
  SELECT test_id FROM tests 
  WHERE LOWER(title) LIKE '%speaking%'
);

-- Step 3: Update existing Writing test data
UPDATE parts 
SET part_type = 'WRITING'
WHERE test_id IN (
  SELECT test_id FROM tests
  WHERE LOWER(title) LIKE '%writing%'
);

-- Verify the changes
SELECT t.test_id, t.title, p.part_number, p.part_name, p.part_type
FROM tests t
JOIN parts p ON t.test_id = p.test_id
WHERE p.part_type IN ('SPEAKING', 'WRITING')
ORDER BY t.test_id, p.part_number;

-- If you need to rollback (use with caution):
-- ALTER TABLE parts 
-- MODIFY COLUMN part_type ENUM('LISTENING', 'READING') NOT NULL;

