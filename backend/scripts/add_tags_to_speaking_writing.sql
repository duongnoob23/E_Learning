-- ============================================
-- Script để thêm Tags cho TOEIC Speaking và Writing Questions
-- Chạy script này SAU KHI đã chạy insert_toeic_speaking_writing.sql
-- ============================================

USE e_learnning2;

-- Lấy test_id của Speaking và Writing test (thay đổi theo test_id thực tế của bạn)
-- Hoặc tìm tự động:
SET @test_id_speaking = (SELECT test_id FROM tests WHERE title = 'TOEIC Speaking Practice Test' LIMIT 1);
SET @test_id_writing = (SELECT test_id FROM tests WHERE title = 'TOEIC Writing Practice Test' LIMIT 1);

-- ============================================
-- 1. TẠO TAGS CHO SPEAKING
-- ============================================

-- Tạo tags cho Speaking parts
INSERT INTO exam_tags (name, description, created_at, updated_at)
VALUES 
  ('[Part 1] Read a text aloud', 'TOEIC Speaking Part 1 - Read a text aloud questions', NOW(), NOW()),
  ('[Part 2] Read a text aloud', 'TOEIC Speaking Part 2 - Read a text aloud questions', NOW(), NOW()),
  ('[Part 3] Describe a picture', 'TOEIC Speaking Part 3 - Describe a picture questions', NOW(), NOW()),
  ('[Part 4] Respond to questions', 'TOEIC Speaking Part 4 - Respond to questions', NOW(), NOW()),
  ('[Part 5] Propose a solution', 'TOEIC Speaking Part 5 - Propose a solution questions', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Lấy tag_id cho Speaking
SET @tag_speaking_1 = (SELECT exam_tag_id FROM exam_tags WHERE name = '[Part 1] Read a text aloud' LIMIT 1);
SET @tag_speaking_2 = (SELECT exam_tag_id FROM exam_tags WHERE name = '[Part 2] Read a text aloud' LIMIT 1);
SET @tag_speaking_3 = (SELECT exam_tag_id FROM exam_tags WHERE name = '[Part 3] Describe a picture' LIMIT 1);
SET @tag_speaking_4 = (SELECT exam_tag_id FROM exam_tags WHERE name = '[Part 4] Respond to questions' LIMIT 1);
SET @tag_speaking_5 = (SELECT exam_tag_id FROM exam_tags WHERE name = '[Part 5] Propose a solution' LIMIT 1);

-- Gán tags cho questions trong Speaking test
-- Part 1 questions
INSERT INTO question_tags (question_id, exam_tag_id, created_at)
SELECT q.question_id, @tag_speaking_1, NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id = @test_id_speaking AND p.part_number = 1
ON DUPLICATE KEY UPDATE created_at = NOW();

-- Part 2 questions
INSERT INTO question_tags (question_id, exam_tag_id, created_at)
SELECT q.question_id, @tag_speaking_2, NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id = @test_id_speaking AND p.part_number = 2
ON DUPLICATE KEY UPDATE created_at = NOW();

-- Part 3 questions
INSERT INTO question_tags (question_id, exam_tag_id, created_at)
SELECT q.question_id, @tag_speaking_3, NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id = @test_id_speaking AND p.part_number = 3
ON DUPLICATE KEY UPDATE created_at = NOW();

-- Part 4 questions
INSERT INTO question_tags (question_id, exam_tag_id, created_at)
SELECT q.question_id, @tag_speaking_4, NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id = @test_id_speaking AND p.part_number = 4
ON DUPLICATE KEY UPDATE created_at = NOW();

-- Part 5 questions
INSERT INTO question_tags (question_id, exam_tag_id, created_at)
SELECT q.question_id, @tag_speaking_5, NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id = @test_id_speaking AND p.part_number = 5
ON DUPLICATE KEY UPDATE created_at = NOW();

-- ============================================
-- 2. TẠO TAGS CHO WRITING
-- ============================================

-- Tạo tags cho Writing parts
INSERT INTO exam_tags (name, description, created_at, updated_at)
VALUES 
  ('[Part 1] Write a sentence based on a picture', 'TOEIC Writing Part 1 - Write a sentence based on a picture', NOW(), NOW()),
  ('[Part 2] Respond to an email', 'TOEIC Writing Part 2 - Respond to an email', NOW(), NOW()),
  ('[Part 3] Write an essay', 'TOEIC Writing Part 3 - Write an essay', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Lấy tag_id cho Writing
SET @tag_writing_1 = (SELECT exam_tag_id FROM exam_tags WHERE name = '[Part 1] Write a sentence based on a picture' LIMIT 1);
SET @tag_writing_2 = (SELECT exam_tag_id FROM exam_tags WHERE name = '[Part 2] Respond to an email' LIMIT 1);
SET @tag_writing_3 = (SELECT exam_tag_id FROM exam_tags WHERE name = '[Part 3] Write an essay' LIMIT 1);

-- Gán tags cho questions trong Writing test
-- Part 1 questions
INSERT INTO question_tags (question_id, exam_tag_id, created_at)
SELECT q.question_id, @tag_writing_1, NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id = @test_id_writing AND p.part_number = 1
ON DUPLICATE KEY UPDATE created_at = NOW();

-- Part 2 questions
INSERT INTO question_tags (question_id, exam_tag_id, created_at)
SELECT q.question_id, @tag_writing_2, NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id = @test_id_writing AND p.part_number = 2
ON DUPLICATE KEY UPDATE created_at = NOW();

-- Part 3 questions
INSERT INTO question_tags (question_id, exam_tag_id, created_at)
SELECT q.question_id, @tag_writing_3, NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id = @test_id_writing AND p.part_number = 3
ON DUPLICATE KEY UPDATE created_at = NOW();

-- ============================================
-- KIỂM TRA KẾT QUẢ
-- ============================================

-- Kiểm tra tags đã được gán
SELECT 
    t.title as test_title,
    p.part_number,
    p.part_name,
    q.question_number,
    q.question_id,
    et.name as tag_name
FROM questions q
JOIN parts p ON q.part_id = p.part_id
JOIN tests t ON p.test_id = t.test_id
LEFT JOIN question_tags qt ON q.question_id = qt.question_id
LEFT JOIN exam_tags et ON qt.exam_tag_id = et.exam_tag_id
WHERE t.test_id IN (@test_id_speaking, @test_id_writing)
ORDER BY t.test_id, p.part_number, q.question_number;

-- ============================================
-- KẾT THÚC
-- ============================================
SELECT 
    'Tags đã được thêm thành công!' as message,
    COUNT(DISTINCT qt.question_id) as questions_with_tags,
    COUNT(DISTINCT et.exam_tag_id) as total_tags
FROM question_tags qt
JOIN exam_tags et ON qt.exam_tag_id = et.exam_tag_id
JOIN questions q ON qt.question_id = q.question_id
JOIN parts p ON q.part_id = p.part_id
WHERE p.test_id IN (@test_id_speaking, @test_id_writing);

