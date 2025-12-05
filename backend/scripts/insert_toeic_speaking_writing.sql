-- ============================================
-- Script để tạo TOEIC Speaking và Writing Test
-- ============================================
-- Lưu ý: 
-- 1. part_type hiện tại chỉ có 'LISTENING', 'READING'
--    - Tạm thời dùng 'LISTENING' cho Speaking
--    - Tạm thời dùng 'READING' cho Writing
-- 2. Questions cho Speaking/Writing không có choices (không cần tạo bảng choices)
-- 3. question_type: dùng 'MULTIPLE_CHOICE' tạm thời (hoặc có thể thêm type mới sau)
-- ============================================

USE e_learnning2;

-- ============================================
-- 1. TẠO TOEIC SPEAKING TEST
-- ============================================
-- Test: TOEIC Speaking Practice Test
-- 5 parts, 7 questions total
-- Part 1: 2 questions (Q1-2)
-- Part 2: 2 questions (Q3-4)
-- Part 3: 1 question (Q5)
-- Part 4: 1 question (Q6)
-- Part 5: 1 question (Q7)

-- Insert Test
INSERT INTO tests (
    title,
    description,
    exam_type,
    total_duration,
    total_questions,
    total_parts,
    difficulty_level,
    created_by,
    created_at,
    updated_at
) VALUES (
    'TOEIC Speaking Practice Test',
    'Official TOEIC Speaking Practice Test - 5 parts, 7 questions',
    'TOEIC',
    20, -- 20 minutes
    7,  -- 7 questions
    5,  -- 5 parts
    'EASY',
    1,  -- created_by (thay đổi theo user_id của bạn)
    NOW(),
    NOW()
);

-- Lấy test_id vừa tạo (thay @test_id_speaking bằng giá trị thực tế sau khi insert)
SET @test_id_speaking = LAST_INSERT_ID();

-- Insert Parts cho Speaking
-- Part 1: 2 questions
INSERT INTO parts (
    test_id,
    part_number,
    part_name,
    part_type,
    question_count,
    duration_minutes,
    description,
    display_template,
    created_at,
    updated_at
) VALUES (
    @test_id_speaking,
    1,
    'Part 1 - Read a text aloud',
    'LISTENING', -- Tạm thời dùng LISTENING
    2,
    4,
    'Read a text aloud - 2 questions',
    'speaking_part1',
    NOW(),
    NOW()
);

SET @part_speaking_1 = LAST_INSERT_ID();

-- Part 2: 2 questions
INSERT INTO parts (
    test_id,
    part_number,
    part_name,
    part_type,
    question_count,
    duration_minutes,
    description,
    display_template,
    created_at,
    updated_at
) VALUES (
    @test_id_speaking,
    2,
    'Part 2 - Read a text aloud',
    'LISTENING',
    2,
    4,
    'Read a text aloud - 2 questions',
    'speaking_part2',
    NOW(),
    NOW()
);

SET @part_speaking_2 = LAST_INSERT_ID();

-- Part 3: 1 question
INSERT INTO parts (
    test_id,
    part_number,
    part_name,
    part_type,
    question_count,
    duration_minutes,
    description,
    display_template,
    created_at,
    updated_at
) VALUES (
    @test_id_speaking,
    3,
    'Part 3 - Describe a picture',
    'LISTENING',
    1,
    3,
    'Describe a picture - 1 question',
    'speaking_part3',
    NOW(),
    NOW()
);

SET @part_speaking_3 = LAST_INSERT_ID();

-- Part 4: 1 question
INSERT INTO parts (
    test_id,
    part_number,
    part_name,
    part_type,
    question_count,
    duration_minutes,
    description,
    display_template,
    created_at,
    updated_at
) VALUES (
    @test_id_speaking,
    4,
    'Part 4 - Respond to questions',
    'LISTENING',
    1,
    3,
    'Respond to questions - 1 question',
    'speaking_part4',
    NOW(),
    NOW()
);

SET @part_speaking_4 = LAST_INSERT_ID();

-- Part 5: 1 question
INSERT INTO parts (
    test_id,
    part_number,
    part_name,
    part_type,
    question_count,
    duration_minutes,
    description,
    display_template,
    created_at,
    updated_at
) VALUES (
    @test_id_speaking,
    5,
    'Part 5 - Propose a solution',
    'LISTENING',
    1,
    3,
    'Propose a solution - 1 question',
    'speaking_part5',
    NOW(),
    NOW()
);

SET @part_speaking_5 = LAST_INSERT_ID();

-- Insert Questions cho Speaking
-- Part 1: Question 1
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_speaking_1,
    1,
    'The city''s annual summer festival will take place next Saturday and Sunday. There will be activities that are fun for the whole family. You can try a variety of food, hear different kinds of music, and enjoy games for all ages. Tickets cost fifteen dollars at the gate. However, if you buy your ticket in advance, you will get a ten percent discount. Tickets are available at many local stores, as well as at City Hall. Don''t miss this fun event!',
    'MULTIPLE_CHOICE', -- Tạm thời
    NULL,
    NULL,
    'The city''s annual summer festival will take place next Saturday and Sunday. There will be activities that are fun for the whole family. You can try a variety of food, hear different kinds of music, and enjoy games for all ages. Tickets cost fifteen dollars at the gate. However, if you buy your ticket in advance, you will get a ten percent discount. Tickets are available at many local stores, as well as at City Hall. Don''t miss this fun event!',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Part 1: Question 2
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_speaking_1,
    2,
    'Could we have your attention, please? We''d like to take this time to thank you for attending this athletic banquet. This has been a fantastic year for our team and our athletes. We now hold a new record for most wins in our states division. Your support has allowed us to purchase new uniforms and a new scoreboard for our field. To show our appreciation for the coaches, the staff, and our fans, we''d like to invite you to view the new scoreboard, enjoy some refreshments, and meet the team. Let''s give a round of applause for the three candidates for player of the year.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    'Could we have your attention, please? We''d like to take this time to thank you for attending this athletic banquet. This has been a fantastic year for our team and our athletes. We now hold a new record for most wins in our states division. Your support has allowed us to purchase new uniforms and a new scoreboard for our field. To show our appreciation for the coaches, the staff, and our fans, we''d like to invite you to view the new scoreboard, enjoy some refreshments, and meet the team. Let''s give a round of applause for the three candidates for player of the year.',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Part 2: Question 3
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_speaking_2,
    3,
    'Good morning, everyone. I''m pleased to announce that our company has achieved record sales this quarter. This success is due to the hard work and dedication of all our employees. We will be hosting a celebration dinner next Friday evening at the Grand Hotel. All staff members and their families are invited. Please RSVP by Wednesday so we can make the necessary arrangements. Thank you for your continued commitment to excellence.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    'Good morning, everyone. I''m pleased to announce that our company has achieved record sales this quarter. This success is due to the hard work and dedication of all our employees. We will be hosting a celebration dinner next Friday evening at the Grand Hotel. All staff members and their families are invited. Please RSVP by Wednesday so we can make the necessary arrangements. Thank you for your continued commitment to excellence.',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Part 2: Question 4
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_speaking_2,
    4,
    'Attention all passengers. Flight 345 to New York has been delayed due to weather conditions. The new departure time is 3:30 PM. We apologize for any inconvenience this may cause. Please check the information board for updates. Passengers with connecting flights should speak to a gate agent immediately. Refreshments will be available at the food court on the second floor.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    'Attention all passengers. Flight 345 to New York has been delayed due to weather conditions. The new departure time is 3:30 PM. We apologize for any inconvenience this may cause. Please check the information board for updates. Passengers with connecting flights should speak to a gate agent immediately. Refreshments will be available at the food court on the second floor.',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Part 3: Question 5
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_speaking_3,
    5,
    'Welcome to the monthly staff meeting. Today we''ll be discussing several important topics including the upcoming product launch, budget allocations for next quarter, and the new employee training program. We''ll also have time for questions and suggestions at the end. Please make sure your phones are on silent mode. Let''s begin with the first item on the agenda.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    'Welcome to the monthly staff meeting. Today we''ll be discussing several important topics including the upcoming product launch, budget allocations for next quarter, and the new employee training program. We''ll also have time for questions and suggestions at the end. Please make sure your phones are on silent mode. Let''s begin with the first item on the agenda.',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Part 4: Question 6
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_speaking_4,
    6,
    'The library will be closed this weekend for renovations. We apologize for any inconvenience. During this time, you can return books using the drop box located outside the main entrance. All due dates have been extended by one week. The library will reopen on Monday with new study rooms and updated computer facilities. We look forward to serving you with improved services.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    'The library will be closed this weekend for renovations. We apologize for any inconvenience. During this time, you can return books using the drop box located outside the main entrance. All due dates have been extended by one week. The library will reopen on Monday with new study rooms and updated computer facilities. We look forward to serving you with improved services.',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Part 5: Question 7
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_speaking_5,
    7,
    'Thank you for calling Tech Support. All our representatives are currently busy assisting other customers. Your call is important to us. Please hold and the next available representative will be with you shortly. For faster service, you can visit our website at www.techsupport.com or send us an email at support@techsupport.com. Estimated wait time is approximately five minutes.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    'Thank you for calling Tech Support. All our representatives are currently busy assisting other customers. Your call is important to us. Please hold and the next available representative will be with you shortly. For faster service, you can visit our website at www.techsupport.com or send us an email at support@techsupport.com. Estimated wait time is approximately five minutes.',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- ============================================
-- 2. TẠO TOEIC WRITING TEST
-- ============================================
-- Test: TOEIC Writing Practice Test
-- 3 parts, 8 questions total
-- Part 1: 5 questions (Q1-5) - Describe Picture
-- Part 2: 2 questions (Q6-7) - Respond to Email
-- Part 3: 1 question (Q8) - Write Essay

-- Insert Test
INSERT INTO tests (
    title,
    description,
    exam_type,
    total_duration,
    total_questions,
    total_parts,
    difficulty_level,
    created_by,
    created_at,
    updated_at
) VALUES (
    'TOEIC Writing Practice Test',
    'Official TOEIC Writing Practice Test - 3 parts, 8 questions',
    'TOEIC',
    60, -- 60 minutes
    8,  -- 8 questions
    3,  -- 3 parts
    'EASY',
    1,  -- created_by (thay đổi theo user_id của bạn)
    NOW(),
    NOW()
);

SET @test_id_writing = LAST_INSERT_ID();

-- Insert Parts cho Writing
-- Part 1: 5 questions
INSERT INTO parts (
    test_id,
    part_number,
    part_name,
    part_type,
    question_count,
    duration_minutes,
    description,
    display_template,
    created_at,
    updated_at
) VALUES (
    @test_id_writing,
    1,
    'Part 1 - Write a sentence based on a picture',
    'READING', -- Tạm thời dùng READING
    5,
    20,
    'Write a sentence based on a picture - 5 questions',
    'writing_part1',
    NOW(),
    NOW()
);

SET @part_writing_1 = LAST_INSERT_ID();

-- Part 2: 2 questions
INSERT INTO parts (
    test_id,
    part_number,
    part_name,
    part_type,
    question_count,
    duration_minutes,
    description,
    display_template,
    created_at,
    updated_at
) VALUES (
    @test_id_writing,
    2,
    'Part 2 - Respond to an email',
    'READING',
    2,
    20,
    'Respond to an email - 2 questions',
    'writing_part2',
    NOW(),
    NOW()
);

SET @part_writing_2 = LAST_INSERT_ID();

-- Part 3: 1 question
INSERT INTO parts (
    test_id,
    part_number,
    part_name,
    part_type,
    question_count,
    duration_minutes,
    description,
    display_template,
    created_at,
    updated_at
) VALUES (
    @test_id_writing,
    3,
    'Part 3 - Write an essay',
    'READING',
    1,
    20,
    'Write an essay - 1 question',
    'writing_part3',
    NOW(),
    NOW()
);

SET @part_writing_3 = LAST_INSERT_ID();

-- Insert Questions cho Writing
-- Part 1: Questions 1-5 (Describe Picture)
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES 
-- Question 1
(@part_writing_1, 1, 'Write a sentence based on the picture.', 'MULTIPLE_CHOICE', NULL, 'https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600', NULL, NULL, NULL, NOW(), NOW()),
-- Question 2
(@part_writing_1, 2, 'Write a sentence based on the picture.', 'MULTIPLE_CHOICE', NULL, 'https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600', NULL, NULL, NULL, NOW(), NOW()),
-- Question 3
(@part_writing_1, 3, 'Write a sentence based on the picture.', 'MULTIPLE_CHOICE', NULL, 'https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600', NULL, NULL, NULL, NOW(), NOW()),
-- Question 4
(@part_writing_1, 4, 'Write a sentence based on the picture.', 'MULTIPLE_CHOICE', NULL, 'https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600', NULL, NULL, NULL, NOW(), NOW()),
-- Question 5
(@part_writing_1, 5, 'Write a sentence based on the picture.', 'MULTIPLE_CHOICE', NULL, 'https://images.unsplash.com/photo-1601825085812-548b1c4d94b1?w=600', NULL, NULL, NULL, NOW(), NOW());

-- Part 2: Question 6 (Respond to Email)
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_writing_2,
    6,
    'From: update@dailyjobseeker.com\nTo: Anna Billings\nSubject: Daily Jobseeker update\nSent: March 14, 20-\n\nDear Daily Jobseeker subscriber,\n\nHere is the most recent job opening:\n\nMarleyhome Inc. is looking for an experienced accountant to fill a vacancy in its Accounting Department. The company needs someone with an accounting degree and at least three years of experience. Contact Ralph Kramer, r_kramer@marleyhome.com.\n\nDirections: Respond to the e-mail as if you are interested in applying for the position. Make ONE statement about your professional background and TWO requests for information about the job.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Part 2: Question 7 (Respond to Email)
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_writing_2,
    7,
    'From: events@cityhall.gov\nTo: Residents\nSubject: Community Meeting Invitation\nSent: April 5, 20-\n\nDear Residents,\n\nWe would like to invite you to attend a community meeting to discuss the proposed park renovation project. The meeting will be held on April 15th at 7 PM in the Community Center. Your input is valuable to us.\n\nDirections: Respond to the e-mail as if you plan to attend. Make ONE statement about your interest in the project and TWO questions about the meeting details.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- Part 3: Question 8 (Write Essay)
INSERT INTO questions (
    part_id,
    question_number,
    question_text,
    question_type,
    audio_file,
    image_file,
    transcript,
    explanation,
    grammar_notes,
    created_at,
    updated_at
) VALUES (
    @part_writing_3,
    8,
    'Do you agree or disagree with the following statement? "Technology has made our lives more complicated rather than simpler." Use specific reasons and examples to support your answer.',
    'MULTIPLE_CHOICE',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- ============================================
-- KẾT THÚC
-- ============================================
-- Sau khi chạy script này, bạn sẽ có:
-- 1. TOEIC Speaking Test (test_id = @test_id_speaking)
--    - 5 parts, 7 questions
-- 2. TOEIC Writing Test (test_id = @test_id_writing)
--    - 3 parts, 8 questions
--
-- Lưu ý: 
-- - Questions không có choices (phù hợp với Speaking/Writing)
-- - part_type tạm thời dùng LISTENING/READING (có thể sửa model sau)
-- - Cần thêm tags cho questions nếu muốn hiển thị resultByTag

SELECT 
    'TOEIC Speaking Test created with test_id:' as message,
    @test_id_speaking as test_id
UNION ALL
SELECT 
    'TOEIC Writing Test created with test_id:' as message,
    @test_id_writing as test_id;

