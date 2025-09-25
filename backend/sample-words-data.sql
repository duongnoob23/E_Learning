-- Sample data cho words table
-- Chạy file này để thêm dữ liệu mẫu cho words

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM words WHERE word IN ('hello', 'world', 'computer', 'programming', 'database', 'application', 'software', 'hardware', 'network', 'internet');

-- Thêm dữ liệu mẫu cho words (topic_id = 1 - Từ vựng tiếng Anh văn phòng)
INSERT INTO words (topic_id, word, part_of_speech, pronunciation, meaning_vi, example_en, example_vi, image_url, notes, word_type, created_by, is_active, created_at, updated_at) VALUES
(1, 'meeting', 'noun', '/ˈmiːtɪŋ/', 'cuộc họp', 'We have a meeting at 2 PM today.', 'Chúng ta có cuộc họp lúc 2 giờ chiều hôm nay.', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300', 'Từ vựng văn phòng cơ bản', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'deadline', 'noun', '/ˈdedlaɪn/', 'hạn chót', 'The deadline for this project is next Friday.', 'Hạn chót cho dự án này là thứ Sáu tuần sau.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300', 'Từ vựng quan trọng trong công việc', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'presentation', 'noun', '/ˌprezənˈteɪʃn/', 'bài thuyết trình', 'She gave an excellent presentation about the new product.', 'Cô ấy đã có một bài thuyết trình xuất sắc về sản phẩm mới.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300', 'Kỹ năng thuyết trình', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'budget', 'noun', '/ˈbʌdʒɪt/', 'ngân sách', 'We need to stay within our budget for this quarter.', 'Chúng ta cần giữ trong ngân sách cho quý này.', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300', 'Từ vựng tài chính', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'schedule', 'noun', '/ˈʃedjuːl/', 'lịch trình', 'Please check my schedule before booking the meeting.', 'Vui lòng kiểm tra lịch trình của tôi trước khi đặt cuộc họp.', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300', 'Quản lý thời gian', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'colleague', 'noun', '/ˈkɒliːɡ/', 'đồng nghiệp', 'My colleague helped me with the report.', 'Đồng nghiệp của tôi đã giúp tôi với báo cáo.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300', 'Mối quan hệ công việc', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'efficient', 'adjective', '/ɪˈfɪʃnt/', 'hiệu quả', 'This new system is much more efficient.', 'Hệ thống mới này hiệu quả hơn nhiều.', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300', 'Tính từ mô tả hiệu suất', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'negotiate', 'verb', '/nɪˈɡəʊʃieɪt/', 'thương lượng', 'We need to negotiate the terms of the contract.', 'Chúng ta cần thương lượng các điều khoản của hợp đồng.', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300', 'Kỹ năng thương lượng', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'priority', 'noun', '/praɪˈɒrəti/', 'ưu tiên', 'This task is our top priority this week.', 'Nhiệm vụ này là ưu tiên hàng đầu của chúng ta tuần này.', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300', 'Quản lý ưu tiên', 'system', NULL, TRUE, NOW(), NOW()),

(1, 'feedback', 'noun', '/ˈfiːdbæk/', 'phản hồi', 'I would appreciate your feedback on this proposal.', 'Tôi sẽ đánh giá cao phản hồi của bạn về đề xuất này.', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300', 'Giao tiếp hiệu quả', 'system', NULL, TRUE, NOW(), NOW()),

-- Thêm dữ liệu cho topic_id = 2 (Từ vựng tiếng Anh giao tiếp trung cấp)
(2, 'conversation', 'noun', '/ˌkɒnvəˈseɪʃn/', 'cuộc trò chuyện', 'We had a long conversation about our future plans.', 'Chúng tôi đã có một cuộc trò chuyện dài về kế hoạch tương lai.', 'https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=300', 'Giao tiếp hàng ngày', 'system', NULL, TRUE, NOW(), NOW()),

(2, 'apologize', 'verb', '/əˈpɒlədʒaɪz/', 'xin lỗi', 'I apologize for being late to the meeting.', 'Tôi xin lỗi vì đến muộn cuộc họp.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 'Lịch sự trong giao tiếp', 'system', NULL, TRUE, NOW(), NOW()),

(2, 'appreciate', 'verb', '/əˈpriːʃieɪt/', 'đánh giá cao', 'I really appreciate your help with this project.', 'Tôi thực sự đánh giá cao sự giúp đỡ của bạn với dự án này.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300', 'Thể hiện lòng biết ơn', 'system', NULL, TRUE, NOW(), NOW()),

(2, 'suggest', 'verb', '/səˈdʒest/', 'đề xuất', 'I suggest we meet again next week.', 'Tôi đề xuất chúng ta gặp lại vào tuần sau.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300', 'Đưa ra ý kiến', 'system', NULL, TRUE, NOW(), NOW()),

(2, 'disagree', 'verb', '/ˌdɪsəˈɡriː/', 'không đồng ý', 'I disagree with that approach.', 'Tôi không đồng ý với cách tiếp cận đó.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300', 'Thể hiện quan điểm', 'system', NULL, TRUE, NOW(), NOW()),

-- Thêm dữ liệu cho topic_id = 3 (Từ vựng Tiếng Anh giao tiếp cơ bản)
(3, 'hello', 'interjection', '/həˈləʊ/', 'xin chào', 'Hello, how are you today?', 'Xin chào, hôm nay bạn thế nào?', 'https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=300', 'Lời chào cơ bản', 'system', NULL, TRUE, NOW(), NOW()),

(3, 'thank you', 'phrase', '/θæŋk juː/', 'cảm ơn', 'Thank you for your help.', 'Cảm ơn bạn đã giúp đỡ.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300', 'Lời cảm ơn', 'system', NULL, TRUE, NOW(), NOW()),

(3, 'please', 'adverb', '/pliːz/', 'xin vui lòng', 'Please sit down.', 'Xin vui lòng ngồi xuống.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 'Lịch sự trong giao tiếp', 'system', NULL, TRUE, NOW(), NOW()),

(3, 'excuse me', 'phrase', '/ɪkˈskjuːs miː/', 'xin lỗi', 'Excuse me, where is the bathroom?', 'Xin lỗi, nhà vệ sinh ở đâu?', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300', 'Cách xin lỗi lịch sự', 'system', NULL, TRUE, NOW(), NOW()),

(3, 'goodbye', 'interjection', '/ˌɡʊdˈbaɪ/', 'tạm biệt', 'Goodbye, see you tomorrow!', 'Tạm biệt, hẹn gặp lại ngày mai!', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300', 'Lời chào tạm biệt', 'system', NULL, TRUE, NOW(), NOW());

-- Kiểm tra dữ liệu đã được thêm
SELECT w.word_id, w.word, w.meaning_vi, w.example_en, t.topic_name 
FROM words w 
JOIN topics t ON w.topic_id = t.topic_id 
ORDER BY w.topic_id, w.word;
