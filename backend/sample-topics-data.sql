-- Sample data cho topics table
-- Chạy file này để thêm dữ liệu mẫu vào database

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM topics WHERE topic_name LIKE 'Từ vựng%' OR topic_name LIKE '900 từ%' OR topic_name LIKE 'GRE%' OR topic_name LIKE 'Academic%';

-- Thêm dữ liệu mẫu cho system topics
INSERT INTO topics (topic_name, description, image_url, logo_url, topic_type, created_by, is_public, is_active, word_count, created_at, updated_at) VALUES
('Từ vựng tiếng Anh văn phòng', 'Bộ từ vựng cơ bản cho môi trường công sở', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 536, NOW(), NOW()),

('Từ vựng tiếng Anh giao tiếp trung cấp', 'Từ vựng cần thiết cho giao tiếp hàng ngày', 'https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 798, NOW(), NOW()),

('Từ vựng Tiếng Anh giao tiếp cơ bản', 'Những từ vựng cơ bản nhất cho người mới bắt đầu', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 993, NOW(), NOW()),

('900 từ TOEFL (có ảnh)', 'Bộ từ vựng TOEFL với hình ảnh minh họa', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 899, NOW(), NOW()),

('900 từ IELTS (có ảnh)', 'Từ vựng IELTS với hình ảnh trực quan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 899, NOW(), NOW()),

('900 từ SAT (có ảnh)', 'Từ vựng SAT cho học sinh trung học', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 860, NOW(), NOW()),

('GRE-GMAT Vocabulary List', 'Từ vựng chuyên ngành cho GRE và GMAT', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 868, NOW(), NOW()),

('Academic word list', 'Từ vựng học thuật cho nghiên cứu', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 570, NOW(), NOW()),

('Từ vựng tiếng Anh du lịch', 'Từ vựng cần thiết khi đi du lịch nước ngoài', 'https://images.unsplash.com/photo-1488646957014-7c0e6d354311?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 245, NOW(), NOW()),

('Từ vựng tiếng Anh y tế', 'Từ vựng chuyên ngành y tế và sức khỏe', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 320, NOW(), NOW()),

('Từ vựng tiếng Anh công nghệ', 'Từ vựng về công nghệ thông tin và máy tính', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 180, NOW(), NOW()),

('Từ vựng tiếng Anh kinh tế', 'Từ vựng về kinh tế và tài chính', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 420, NOW(), NOW());

-- Kiểm tra dữ liệu đã được thêm
SELECT topic_id, topic_name, description, topic_type, word_count, created_at FROM topics WHERE topic_type = 'system' ORDER BY created_at DESC;
