-- Script: Update existing Speaking and Writing test data
-- Run this AFTER running 001-add-speaking-writing-to-part-type.sql

-- =====================================================
-- OPTION 1: Update by Test Title Pattern
-- =====================================================

-- Update Speaking tests based on title
UPDATE parts 
SET part_type = 'SPEAKING' 
WHERE test_id IN (
  SELECT test_id FROM tests 
  WHERE LOWER(title) LIKE '%speaking%'
);

-- Update Writing tests based on title
UPDATE parts 
SET part_type = 'WRITING'
WHERE test_id IN (
  SELECT test_id FROM tests
  WHERE LOWER(title) LIKE '%writing%'
);

-- =====================================================
-- OPTION 2: Update by specific Test IDs (if you know them)
-- =====================================================
-- Uncomment and replace with your actual test_ids:

-- UPDATE parts SET part_type = 'SPEAKING' WHERE test_id IN (101, 102, 103);
-- UPDATE parts SET part_type = 'WRITING' WHERE test_id IN (201, 202, 203);

-- =====================================================
-- OPTION 3: Update by Part Number Pattern
-- =====================================================
-- If Speaking tests use specific part numbers (e.g., Speaking parts are numbered 1-5)
-- Uncomment and adjust as needed:

-- UPDATE parts 
-- SET part_type = 'SPEAKING'
-- WHERE test_id IN (SELECT test_id FROM tests WHERE LOWER(title) LIKE '%speaking%')
-- AND part_number BETWEEN 1 AND 5;

-- UPDATE parts 
-- SET part_type = 'WRITING'
-- WHERE test_id IN (SELECT test_id FROM tests WHERE LOWER(title) LIKE '%writing%')
-- AND part_number BETWEEN 1 AND 3;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check all test types
SELECT 
  t.test_id,
  t.title,
  t.exam_type,
  COUNT(p.part_id) as total_parts,
  GROUP_CONCAT(DISTINCT p.part_type) as part_types
FROM tests t
LEFT JOIN parts p ON t.test_id = p.test_id
GROUP BY t.test_id
ORDER BY t.test_id;

-- Check Speaking tests specifically
SELECT 
  t.test_id,
  t.title,
  p.part_number,
  p.part_name,
  p.part_type,
  p.question_count
FROM tests t
JOIN parts p ON t.test_id = p.test_id
WHERE p.part_type = 'SPEAKING'
ORDER BY t.test_id, p.part_number;

-- Check Writing tests specifically  
SELECT 
  t.test_id,
  t.title,
  p.part_number,
  p.part_name,
  p.part_type,
  p.question_count
FROM tests t
JOIN parts p ON t.test_id = p.test_id
WHERE p.part_type = 'WRITING'
ORDER BY t.test_id, p.part_number;

-- Check for any NULL part_types
SELECT 
  t.test_id,
  t.title,
  p.part_id,
  p.part_number,
  p.part_type
FROM tests t
JOIN parts p ON t.test_id = p.test_id
WHERE p.part_type IS NULL;

