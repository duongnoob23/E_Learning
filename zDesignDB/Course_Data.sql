-- Dữ liệu thực tế cho cơ sở dữ liệu Course
USE Course;

-- Thêm dữ liệu Users
INSERT INTO users (username, email, password_hash, full_name, avatar, phone, gender, role, status) VALUES
('admin', 'admin@totc.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin TOTC', 'https://randomuser.me/api/portraits/men/1.jpg', '0123456789', 'male', 'admin', 'active'),
('lamtienduong', 'lamtienduong@totc.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lâm Tiến Dưỡng', 'https://randomuser.me/api/portraits/men/2.jpg', '0123456790', 'male', 'instructor', 'active'),
('vudanhphong', 'vudanhphong@totc.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vũ Danh Phong', 'https://randomuser.me/api/portraits/men/3.jpg', '0123456791', 'male', 'instructor', 'active'),
('vucongduy', 'vucongduy@totc.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vũ Công Duy', 'https://randomuser.me/api/portraits/men/4.jpg', '0123456792', 'male', 'instructor', 'active'),
('vuhoaithu', 'vuhoaithu@totc.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vũ Hoài Thư', 'https://randomuser.me/api/portraits/women/1.jpg', '0123456793', 'female', 'instructor', 'active'),
('nguyenvandung', 'nguyenvandung@totc.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn Dũng', 'https://randomuser.me/api/portraits/men/5.jpg', '0123456794', 'male', 'instructor', 'active'),
('student1', 'student1@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Thị Lan', 'https://randomuser.me/api/portraits/women/2.jpg', '0123456795', 'female', 'student', 'active'),
('student2', 'student2@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn An', 'https://randomuser.me/api/portraits/men/6.jpg', '0123456796', 'male', 'student', 'active'),
('student3', 'student3@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phạm Thị Hồng', 'https://randomuser.me/api/portraits/women/3.jpg', '0123456797', 'female', 'student', 'active');

-- Thêm dữ liệu Categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Toeic 2 kĩ năng', 'toeic-2-ky-nang', 'Khóa học TOEIC 2 kỹ năng Listening và Reading', 'fa-headphones', '#FF6B35', 1),
('Toeic 4 kĩ năng', 'toeic-4-ky-nang', 'Khóa học TOEIC 4 kỹ năng toàn diện', 'fa-microphone', '#4ECDC4', 2),
('IELTS', 'ielts', 'Khóa học IELTS chuyên sâu', 'fa-graduation-cap', '#45B7D1', 3),
('Tiếng anh cơ bản', 'tieng-anh-co-ban', 'Khóa học tiếng Anh cơ bản cho người mới bắt đầu', 'fa-book', '#96CEB4', 4);

-- Thêm dữ liệu Levels
INSERT INTO levels (name, slug, description, color, sort_order) VALUES
('Beginner', 'beginner', 'Trình độ cơ bản cho người mới bắt đầu', '#28A745', 1),
('Intermediate', 'intermediate', 'Trình độ trung cấp', '#FFC107', 2),
('Expert', 'expert', 'Trình độ nâng cao', '#DC3545', 3);

-- Thêm dữ liệu Instructors
INSERT INTO instructors (user_id, name, avatar, bio, experience_years, specializations, education, achievements, social_links, is_featured) VALUES
(2, 'Lâm Tiến Dưỡng', 'https://randomuser.me/api/portraits/men/2.jpg', 'Thạc sĩ Ngôn ngữ Anh, 8 năm kinh nghiệm luyện thi TOEIC, IELTS. Đã giúp hơn 1500 học viên đạt mục tiêu điểm số mong muốn.', 8, 'TOEIC, IELTS Writing, Grammar', 'Thạc sĩ Ngôn ngữ Anh - Đại học Ngoại ngữ', 'Giải thưởng Giảng viên xuất sắc 2023', '{"facebook": "#", "youtube": "#", "email": "lamtienduong@totc.com"}', TRUE),
(3, 'Vũ Danh Phong', 'https://randomuser.me/api/portraits/men/3.jpg', 'Thạc sĩ Ngôn ngữ Anh, 6 năm kinh nghiệm luyện thi TOEIC. Chuyên gia về Listening và Reading.', 6, 'TOEIC Listening, Reading, Vocabulary', 'Thạc sĩ Ngôn ngữ Anh - Đại học Sư phạm', 'Chứng chỉ TESOL, CELTA', '{"facebook": "#", "youtube": "#", "email": "vudanhphong@totc.com"}', FALSE),
(4, 'Vũ Công Duy', 'https://randomuser.me/api/portraits/men/4.jpg', 'Thạc sĩ Ngôn ngữ Anh, 10 năm kinh nghiệm luyện thi IELTS. Chuyên gia về Speaking và Writing.', 10, 'IELTS Speaking, Writing, Pronunciation', 'Thạc sĩ Ngôn ngữ Anh - Đại học Quốc gia', 'Giải thưởng Giảng viên xuất sắc 2022', '{"facebook": "#", "youtube": "#", "email": "vucongduy@totc.com"}', TRUE),
(5, 'Vũ Hoài Thư', 'https://randomuser.me/api/portraits/women/1.jpg', 'Thạc sĩ Ngôn ngữ Anh, 7 năm kinh nghiệm giảng dạy tiếng Anh giao tiếp và cơ bản.', 7, 'Tiếng Anh giao tiếp, Pronunciation, Grammar cơ bản', 'Thạc sĩ Ngôn ngữ Anh - Đại học Ngoại thương', 'Chứng chỉ TESOL, TEFL', '{"facebook": "#", "youtube": "#", "email": "vuhoaithu@totc.com"}', FALSE),
(6, 'Nguyễn Văn Dũng', 'https://randomuser.me/api/portraits/men/5.jpg', 'Thạc sĩ Ngôn ngữ Anh, 9 năm kinh nghiệm luyện thi TOEIC và IELTS. Chuyên gia về Reading và Writing.', 9, 'TOEIC Reading, IELTS Writing, Academic English', 'Thạc sĩ Ngôn ngữ Anh - Đại học Khoa học Xã hội', 'Chứng chỉ DELTA, CELTA', '{"facebook": "#", "youtube": "#", "email": "nguyenvandung@totc.com"}', FALSE);

-- Thêm dữ liệu Courses
INSERT INTO courses (title, slug, short_description, description, category_id, level_id, instructor_id, image, video_preview, video_duration, video_progress, total_lessons, total_duration, total_students, rating, rating_count, price, old_price, discount_percent, is_free, is_best_seller, is_featured, status, published_at) VALUES
('TOEIC 2 Kỹ Năng - Listening & Reading', 'toeic-2-ky-nang-listening-reading', 'Khóa học luyện thi TOEIC 2 kỹ năng, phù hợp cho người mới bắt đầu.', 'Khóa học TOEIC 2 kỹ năng được thiết kế dành riêng cho người Việt, giúp bạn cải thiện kỹ năng nghe và đọc để sẵn sàng cho kỳ thi TOEIC.', 1, 1, 1, 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '9:15', 0.1, 24, '4 Tuần', 320, 4.8, 1342, 0.00, 29.00, 100, TRUE, TRUE, TRUE, 'published', '2024-01-15 10:00:00'),
('TOEIC 4 Kỹ Năng - Full Skills', 'toeic-4-ky-nang-full-skills', 'Chinh phục TOEIC 4 kỹ năng với lộ trình bài bản, tài liệu chuẩn quốc tế.', 'Khóa học TOEIC 4 Skills Mastery được thiết kế dành riêng cho người Việt, giúp bạn cải thiện kỹ năng nghe, đọc, nói và viết để sẵn sàng cho kỳ thi TOEIC.', 2, 2, 2, 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '12:30', 0.06, 30, '6 Tuần', 210, 4.6, 980, 19.99, 39.99, 50, FALSE, FALSE, TRUE, 'published', '2024-01-20 10:00:00'),
('IELTS Speaking Master', 'ielts-speaking-master', 'Nâng cao kỹ năng Speaking IELTS với giáo viên bản ngữ, feedback chi tiết.', 'Khóa học IELTS Speaking Master giúp bạn nâng cao kỹ năng nói với phương pháp thực tế và feedback chi tiết từ giảng viên có kinh nghiệm.', 3, 3, 3, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '15:45', 0.08, 28, '8 Tuần', 500, 4.9, 2100, 29.99, 49.99, 40, TRUE, TRUE, TRUE, 'published', '2024-01-25 10:00:00'),
('Tiếng Anh Giao Tiếp Cơ Bản', 'tieng-anh-giao-tiep-co-ban', 'Học tiếng Anh giao tiếp từ con số 0, thực hành qua tình huống thực tế.', 'Khóa học tiếng Anh giao tiếp cơ bản dành cho người mới bắt đầu, giúp bạn tự tin giao tiếp trong các tình huống hàng ngày.', 4, 1, 4, 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '8:20', 0.05, 20, '3 Tuần', 150, 4.3, 800, 0.00, 25.00, 100, FALSE, FALSE, FALSE, 'published', '2024-02-01 10:00:00'),
('IELTS Writing Intensive', 'ielts-writing-intensive', 'Chuyên sâu kỹ năng viết IELTS, sửa bài chi tiết từng câu.', 'Khóa học IELTS Writing Intensive giúp bạn chuyên sâu kỹ năng viết với hướng dẫn chi tiết và sửa bài từng câu.', 3, 2, 1, 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '11:30', 0.07, 25, '5 Tuần', 200, 4.7, 1120, 24.99, 39.99, 38, FALSE, FALSE, FALSE, 'published', '2024-02-05 10:00:00'),
('TOEIC Listening Practice', 'toeic-listening-practice', 'Luyện nghe TOEIC với đề thi thật, cập nhật liên tục.', 'Khóa học luyện nghe TOEIC với các đề thi thật và cập nhật liên tục theo format mới nhất.', 1, 1, 2, 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '7:45', 0.03, 16, '2 Tuần', 110, 4.2, 670, 9.99, 19.99, 50, FALSE, FALSE, FALSE, 'published', '2024-02-10 10:00:00'),
('Tiếng Anh Cho Người Mất Gốc', 'tieng-anh-cho-nguoi-mat-goc', 'Khóa học dành cho người mất gốc, xây nền tảng vững chắc.', 'Khóa học dành riêng cho người mất gốc tiếng Anh, giúp xây dựng nền tảng vững chắc từ con số 0.', 4, 1, 4, 'https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '6:30', 0.04, 18, '4 Tuần', 180, 4.5, 900, 0.00, 20.00, 100, FALSE, FALSE, FALSE, 'published', '2024-02-15 10:00:00'),
('IELTS Reading Tips & Tricks', 'ielts-reading-tips-tricks', 'Bí quyết làm bài Reading IELTS nhanh, chính xác, tiết kiệm thời gian.', 'Khóa học cung cấp các bí quyết và chiến lược làm bài Reading IELTS hiệu quả, giúp bạn tiết kiệm thời gian và đạt điểm cao.', 3, 2, 5, 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '10:15', 0.06, 22, '3 Tuần', 120, 4.4, 650, 14.99, 29.99, 50, FALSE, FALSE, FALSE, 'published', '2024-02-20 10:00:00'),
('TOEIC Speaking & Writing', 'toeic-speaking-writing', 'Luyện nói và viết TOEIC, tăng điểm nhanh chóng.', 'Khóa học luyện nói và viết TOEIC với phương pháp thực tế, giúp bạn tăng điểm nhanh chóng trong kỳ thi.', 2, 3, 1, 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '13:20', 0.09, 26, '6 Tuần', 210, 4.6, 780, 19.99, 34.99, 43, FALSE, FALSE, FALSE, 'published', '2024-02-25 10:00:00'),
('Tiếng Anh Phỏng Vấn Xin Việc', 'tieng-anh-phong-van-xin-viec', 'Chuẩn bị phỏng vấn xin việc bằng tiếng Anh, luyện tập thực tế.', 'Khóa học chuẩn bị phỏng vấn xin việc bằng tiếng Anh với các tình huống thực tế và luyện tập chuyên sâu.', 4, 2, 3, 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '9:45', 0.05, 14, '2 Tuần', 90, 4.1, 400, 7.99, 15.99, 50, FALSE, FALSE, FALSE, 'published', '2024-03-01 10:00:00'),
('IELTS Listening Advanced', 'ielts-listening-advanced', 'Luyện nghe IELTS nâng cao, cập nhật đề mới nhất.', 'Khóa học luyện nghe IELTS nâng cao với các đề thi mới nhất và phương pháp hiệu quả.', 3, 3, 3, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '14:30', 0.08, 32, '7 Tuần', 300, 4.8, 1100, 27.99, 39.99, 30, TRUE, FALSE, TRUE, 'published', '2024-03-05 10:00:00'),
('TOEIC Grammar Foundation', 'toeic-grammar-foundation', 'Nắm vững ngữ pháp TOEIC, luyện tập qua bài tập thực tế.', 'Khóa học ngữ pháp TOEIC cơ bản giúp bạn nắm vững các điểm ngữ pháp quan trọng thông qua bài tập thực tế.', 1, 1, 2, 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80', 'https://www.youtube.com/watch?v=2Xc9gXyf2G4', '5:20', 0.02, 12, '3 Tuần', 80, 4.0, 350, 0.00, 15.00, 100, FALSE, FALSE, FALSE, 'published', '2024-03-10 10:00:00');

-- Thêm dữ liệu Course Details
INSERT INTO course_details (course_id, about_content, learning_outcomes, skills_covered, requirements, achievements, certificate_info, last_updated, target_audience) VALUES
(1, 'Khóa học TOEIC 2 kỹ năng được thiết kế dành riêng cho người Việt, giúp bạn cải thiện kỹ năng nghe và đọc để sẵn sàng cho kỳ thi TOEIC. Với phương pháp giảng dạy thực tế, bạn sẽ được thực hành qua các bài tập sát đề thi và hướng dẫn chi tiết từ giảng viên có kinh nghiệm.', '["Làm quen với cấu trúc đề thi TOEIC", "Phát triển kỹ năng Listening hiệu quả", "Cải thiện kỹ năng Reading", "Tăng vốn từ vựng cơ bản", "Luyện tập với đề thi thật"]', '["Listening", "Reading", "Vocabulary", "Test Strategies", "Time Management"]', '["Kiến thức tiếng Anh cơ bản", "Tai nghe và máy tính để học online", "Sự kiên trì học tập"]', '["Đạt điểm TOEIC từ 400 trở lên", "Hiểu và trả lời các câu hỏi Listening", "Đọc hiểu các đoạn văn cơ bản", "Tự tin tham gia kỳ thi TOEIC"]', 'Chứng chỉ điện tử sau khi hoàn thành khóa học', '2024-01-15', 'Người mới bắt đầu học TOEIC'),
(2, 'Khóa học TOEIC 4 Skills Mastery được thiết kế dành riêng cho người Việt, giúp bạn cải thiện kỹ năng nghe, đọc, nói và viết để sẵn sàng cho kỳ thi TOEIC. Với phương pháp giảng dạy thực tế, bạn sẽ được thực hành qua các bài tập sát đề thi, bài nghe mô phỏng từ người bản xứ và hướng dẫn chi tiết từ giảng viên có kinh nghiệm.', '["Làm quen với cấu trúc đề thi TOEIC", "Phát triển kỹ năng Listening và Reading hiệu quả", "Thực hành Speaking và Writing theo format thực tế", "Tăng vốn từ vựng chuyên sâu cho TOEIC", "Xử lý các câu hỏi khó trong kỳ thi"]', '["Listening", "Reading", "Speaking", "Writing", "Vocabulary", "Test Strategies", "Time Management", "Confidence"]', '["Kiến thức tiếng Anh cơ bản (trình độ A2 trở lên)", "Tai nghe và máy tính để học online", "Sự kiên trì và cam kết học tập hàng ngày"]', '["Đạt điểm TOEIC từ 600 trở lên", "Hiểu và trả lời các câu hỏi Listening chính xác", "Viết bài luận ngắn theo yêu cầu thi", "Tự tin giao tiếp trong môi trường làm việc", "Chuẩn bị tốt cho kỳ thi quốc tế"]', 'Chứng chỉ điện tử sau khi hoàn thành khóa học', '2024-01-20', 'Người có trình độ tiếng Anh trung cấp'),
(3, 'Khóa học IELTS Speaking Master giúp bạn nâng cao kỹ năng nói với phương pháp thực tế và feedback chi tiết từ giảng viên có kinh nghiệm. Bạn sẽ được thực hành qua các tình huống thực tế và nhận phản hồi chi tiết để cải thiện kỹ năng.', '["Luyện phát âm chuẩn", "Thực hành câu hỏi Speaking", "Mô phỏng tình huống thực tế", "Phản hồi và cải thiện", "Tăng sự tự tin khi nói"]', '["Speaking", "Pronunciation", "Fluency", "Vocabulary", "Grammar", "Confidence"]', '["Kiến thức tiếng Anh trung cấp", "Tai nghe và máy tính", "Sự kiên trì luyện tập"]', '["Đạt điểm Speaking 6.0+", "Phát âm chuẩn và tự nhiên", "Tự tin giao tiếp bằng tiếng Anh", "Xử lý tốt các câu hỏi IELTS"]', 'Chứng chỉ điện tử sau khi hoàn thành khóa học', '2024-01-25', 'Người muốn cải thiện kỹ năng Speaking IELTS');

-- Thêm dữ liệu Modules cho khóa học TOEIC 4 Skills (course_id = 2)
INSERT INTO modules (course_id, title, description, sort_order, total_lectures, total_duration, is_active) VALUES
(2, 'Introduction to TOEIC Exam', 'Giới thiệu về kỳ thi TOEIC và cấu trúc đề thi', 1, 3, '30min', TRUE),
(2, 'Listening Skills Development', 'Phát triển kỹ năng nghe hiệu quả', 2, 6, '1hr 15min', TRUE),
(2, 'Reading Skills Mastery', 'Làm chủ kỹ năng đọc hiểu', 3, 5, '1hr', TRUE),
(2, 'Speaking Practice', 'Thực hành kỹ năng nói', 4, 4, '45min', TRUE),
(2, 'Writing Techniques', 'Kỹ thuật viết hiệu quả', 5, 4, '45min', TRUE),
(2, 'Mock Test & Review', 'Đề thi mẫu và ôn tập', 6, 3, '1hr 30min', TRUE);

-- Thêm dữ liệu Lessons cho Module 1 (Introduction to TOEIC Exam)
INSERT INTO lessons (module_id, course_id, title, description, video_url, video_duration, sort_order, lesson_type, is_free) VALUES
(1, 2, 'Giới thiệu về kỳ thi TOEIC', 'Tìm hiểu về kỳ thi TOEIC và tầm quan trọng của nó', 'https://www.youtube.com/watch?v=lesson1', '10:00', 1, 'video', TRUE),
(1, 2, 'Cấu trúc đề thi và cách tính điểm', 'Hiểu rõ cấu trúc đề thi TOEIC và cách tính điểm', 'https://www.youtube.com/watch?v=lesson2', '10:00', 2, 'video', TRUE),
(1, 2, 'Lập kế hoạch học tập hiệu quả', 'Xây dựng lộ trình học tập phù hợp với bản thân', 'https://www.youtube.com/watch?v=lesson3', '10:00', 3, 'video', FALSE);

-- Thêm dữ liệu Lessons cho Module 2 (Listening Skills Development)
INSERT INTO lessons (module_id, course_id, title, description, video_url, video_duration, sort_order, lesson_type, is_free) VALUES
(2, 2, 'Nghe hiểu Part 1 & 2', 'Luyện tập nghe hiểu phần 1 và 2 của TOEIC', 'https://www.youtube.com/watch?v=lesson4', '12:00', 1, 'video', FALSE),
(2, 2, 'Nghe Part 3: Hội thoại ngắn', 'Thực hành nghe hội thoại ngắn trong Part 3', 'https://www.youtube.com/watch?v=lesson5', '12:00', 2, 'video', FALSE),
(2, 2, 'Nghe Part 4: Bài nói dài', 'Luyện tập nghe bài nói dài trong Part 4', 'https://www.youtube.com/watch?v=lesson6', '12:00', 3, 'video', FALSE),
(2, 2, 'Bài tập thực hành Listening', 'Các bài tập thực hành kỹ năng nghe', 'https://www.youtube.com/watch?v=lesson7', '15:00', 4, 'video', FALSE),
(2, 2, 'Mẹo xử lý câu hỏi khó', 'Chia sẻ các mẹo xử lý câu hỏi khó trong Listening', 'https://www.youtube.com/watch?v=lesson8', '12:00', 5, 'video', FALSE),
(2, 2, 'Ôn tập và kiểm tra', 'Ôn tập và kiểm tra kỹ năng Listening', 'https://www.youtube.com/watch?v=lesson9', '12:00', 6, 'video', FALSE);

-- Thêm dữ liệu Lessons cho Module 3 (Reading Skills Mastery)
INSERT INTO lessons (module_id, course_id, title, description, video_url, video_duration, sort_order, lesson_type, is_free) VALUES
(3, 2, 'Đọc hiểu Part 5: Điền từ', 'Luyện tập điền từ vào chỗ trống', 'https://www.youtube.com/watch?v=lesson10', '12:00', 1, 'video', FALSE),
(3, 2, 'Đọc Part 6: Đoạn văn ngắn', 'Thực hành đọc đoạn văn ngắn', 'https://www.youtube.com/watch?v=lesson11', '12:00', 2, 'video', FALSE),
(3, 2, 'Đọc Part 7: Đoạn văn dài', 'Luyện tập đọc đoạn văn dài', 'https://www.youtube.com/watch?v=lesson12', '12:00', 3, 'video', FALSE),
(3, 2, 'Chiến lược làm bài Reading', 'Các chiến lược hiệu quả cho phần Reading', 'https://www.youtube.com/watch?v=lesson13', '12:00', 4, 'video', FALSE),
(3, 2, 'Bài tập thực hành', 'Các bài tập thực hành kỹ năng đọc', 'https://www.youtube.com/watch?v=lesson14', '12:00', 5, 'video', FALSE);

-- Thêm dữ liệu Course Enrollments
INSERT INTO course_enrollments (user_id, course_id, status, enrolled_at, progress_percent, payment_amount, payment_status) VALUES
(7, 1, 'active', '2024-01-20 10:00:00', 25.50, 0.00, 'paid'),
(8, 2, 'active', '2024-01-22 14:30:00', 15.20, 19.99, 'paid'),
(9, 3, 'completed', '2024-01-25 09:15:00', 100.00, 29.99, 'paid'),
(7, 4, 'active', '2024-02-05 16:45:00', 45.80, 0.00, 'paid'),
(8, 5, 'active', '2024-02-10 11:20:00', 30.10, 24.99, 'paid');

-- Thêm dữ liệu Course Reviews
INSERT INTO course_reviews (user_id, course_id, rating, title, content, is_verified, status) VALUES
(7, 1, 5, 'Khóa học rất hay và bổ ích', 'Khóa học này rất hay, mình đã cải thiện kỹ năng nghe rất nhiều. Cảm ơn thầy Dưỡng!', TRUE, 'approved'),
(8, 2, 4, 'Nội dung chất lượng', 'Bài tập Reading rất sát đề thi, rất hữu ích!', TRUE, 'approved'),
(9, 3, 5, 'Giảng viên xuất sắc', 'Mình thích phần Speaking, nhưng cần thêm bài tập thực hành.', TRUE, 'approved'),
(7, 4, 4, 'Phù hợp cho người mới bắt đầu', 'Khóa học rất phù hợp cho người mới bắt đầu như mình', TRUE, 'approved'),
(8, 5, 4, 'Writing skills được cải thiện', 'Kỹ năng viết của mình đã được cải thiện đáng kể', TRUE, 'approved');

-- Thêm dữ liệu Course Discussions
INSERT INTO course_discussions (course_id, user_id, title, content, status) VALUES
(2, 7, 'Câu hỏi về Part 3 Listening', 'Mình gặp khó khăn với Part 3 Listening, có ai có thể chia sẻ kinh nghiệm không?', 'active'),
(2, 8, 'Tài liệu bổ sung', 'Có ai biết tài liệu bổ sung nào cho phần Reading không?', 'active'),
(3, 9, 'Luyện tập Speaking', 'Mình muốn tìm bạn cùng luyện tập Speaking, có ai quan tâm không?', 'active');

-- Thêm dữ liệu Course Wishlist
INSERT INTO course_wishlist (user_id, course_id) VALUES
(7, 3),
(7, 5),
(8, 1),
(8, 4),
(9, 2);

-- Thêm dữ liệu Coupons
INSERT INTO coupons (code, name, description, discount_type, discount_value, minimum_amount, max_uses, valid_from, valid_until, is_active) VALUES
('WELCOME50', 'Giảm 50% cho khóa học đầu tiên', 'Mã giảm giá đặc biệt cho học viên mới', 'percentage', 50.00, 0.00, 100, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE),
('SUMMER30', 'Giảm 30% mùa hè', 'Ưu đãi mùa hè cho tất cả khóa học', 'percentage', 30.00, 10.00, 200, '2024-06-01 00:00:00', '2024-08-31 23:59:59', TRUE),
('TOEIC20', 'Giảm 20% khóa học TOEIC', 'Ưu đãi đặc biệt cho khóa học TOEIC', 'percentage', 20.00, 15.00, 150, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE);

-- Thêm dữ liệu Course Coupons
INSERT INTO course_coupons (course_id, coupon_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(2, 3),
(6, 3),
(9, 3),
(12, 3);

-- Thêm dữ liệu Course Tags
INSERT INTO course_tags (name, color) VALUES
('Best Seller', '#FF6B35'),
('Free', '#28A745'),
('New', '#17A2B8'),
('Popular', '#DC3545'),
('Advanced', '#6F42C1');

-- Thêm dữ liệu Course Tag Relations
INSERT INTO course_tag_relations (course_id, tag_id) VALUES
(1, 1), -- TOEIC 2 Skills - Best Seller
(1, 2), -- TOEIC 2 Skills - Free
(3, 1), -- IELTS Speaking - Best Seller
(11, 1), -- IELTS Listening - Best Seller
(4, 2), -- Tiếng Anh Giao Tiếp - Free
(7, 2), -- Tiếng Anh Mất Gốc - Free
(12, 2), -- TOEIC Grammar - Free
(3, 3), -- IELTS Speaking - New
(11, 3), -- IELTS Listening - New
(3, 4), -- IELTS Speaking - Popular
(11, 4), -- IELTS Listening - Popular
(2, 5), -- TOEIC 4 Skills - Advanced
(3, 5), -- IELTS Speaking - Advanced
(9, 5), -- TOEIC Speaking & Writing - Advanced
(11, 5); -- IELTS Listening - Advanced

-- Thêm dữ liệu Course Related Courses
INSERT INTO course_related_courses (course_id, related_course_id, relation_type) VALUES
(1, 2, 'next_level'), -- TOEIC 2 Skills -> TOEIC 4 Skills
(2, 1, 'prerequisite'), -- TOEIC 4 Skills <- TOEIC 2 Skills
(3, 5, 'similar'), -- IELTS Speaking -> IELTS Writing
(5, 3, 'similar'), -- IELTS Writing -> IELTS Speaking
(4, 7, 'similar'), -- Tiếng Anh Giao Tiếp -> Tiếng Anh Mất Gốc
(7, 4, 'similar'), -- Tiếng Anh Mất Gốc -> Tiếng Anh Giao Tiếp
(2, 6, 'similar'), -- TOEIC 4 Skills -> TOEIC Listening
(6, 2, 'similar'), -- TOEIC Listening -> TOEIC 4 Skills
(3, 11, 'similar'), -- IELTS Speaking -> IELTS Listening
(11, 3, 'similar'); -- IELTS Listening -> IELTS Speaking

-- Cập nhật total_lessons cho các khóa học
UPDATE courses SET total_lessons = 24 WHERE id = 1;
UPDATE courses SET total_lessons = 30 WHERE id = 2;
UPDATE courses SET total_lessons = 28 WHERE id = 3;
UPDATE courses SET total_lessons = 20 WHERE id = 4;
UPDATE courses SET total_lessons = 25 WHERE id = 5;
UPDATE courses SET total_lessons = 16 WHERE id = 6;
UPDATE courses SET total_lessons = 18 WHERE id = 7;
UPDATE courses SET total_lessons = 22 WHERE id = 8;
UPDATE courses SET total_lessons = 26 WHERE id = 9;
UPDATE courses SET total_lessons = 14 WHERE id = 10;
UPDATE courses SET total_lessons = 32 WHERE id = 11;
UPDATE courses SET total_lessons = 12 WHERE id = 12;


-- Create database and default settings
DROP DATABASE IF EXISTS Course;
CREATE DATABASE Course CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Course;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- USERS
CREATE TABLE users (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  username          VARCHAR(50)  NOT NULL UNIQUE,
  email             VARCHAR(100) NOT NULL UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,
  full_name         VARCHAR(100) NOT NULL,
  avatar            VARCHAR(255),
  phone             VARCHAR(20),
  date_of_birth     DATE,
  gender            ENUM('male','female','other'),
  address           TEXT,
  bio               TEXT,
  role              ENUM('admin','instructor','student') DEFAULT 'student',
  status            ENUM('active','inactive','banned')   DEFAULT 'active',
  email_verified    BOOLEAN DEFAULT FALSE,
  phone_verified    BOOLEAN DEFAULT FALSE,
  last_login        DATETIME NULL,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB;

-- CATEGORIES (filter: thể loại)
CREATE TABLE categories (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  slug         VARCHAR(100) NOT NULL UNIQUE,
  description  TEXT,
  icon         VARCHAR(50),
  color        VARCHAR(7),
  image        VARCHAR(255),
  sort_order   INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categories_active (is_active)
) ENGINE=InnoDB;

-- LEVELS (filter: level)
CREATE TABLE levels (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(50) NOT NULL,
  slug         VARCHAR(50) NOT NULL UNIQUE,
  description  TEXT,
  color        VARCHAR(7),
  sort_order   INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_levels_active (is_active)
) ENGINE=InnoDB;

-- INSTRUCTORS (filter: instructor)
CREATE TABLE instructors (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT,
  name              VARCHAR(100) NOT NULL,
  avatar            VARCHAR(255),
  bio               TEXT,
  experience_years  INT,
  specializations   TEXT,
  education         TEXT,
  achievements      TEXT,
  social_links      JSON,
  is_featured       BOOLEAN DEFAULT FALSE,
  is_verified       BOOLEAN DEFAULT FALSE,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_instructors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_instructors_user (user_id),
  INDEX idx_instructors_featured (is_featured),
  INDEX idx_instructors_active (is_active)
) ENGINE=InnoDB;

-- COURSES (trung tâm)
CREATE TABLE courses (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(200) NOT NULL,
  slug             VARCHAR(200) NOT NULL UNIQUE,
  short_description TEXT,
  description      TEXT,
  category_id      INT,
  level_id         INT,
  instructor_id    INT,
  image            VARCHAR(255),
  video_preview    VARCHAR(255),
  video_duration   VARCHAR(20),
  video_progress   DECIMAL(4,2) DEFAULT 0.00,        -- ví dụ 0.10 = 10%
  total_lessons    INT DEFAULT 0,
  total_duration   VARCHAR(50),                      -- ví dụ "15hr 45mins"
  total_students   INT DEFAULT 0,
  rating           DECIMAL(3,2) DEFAULT 0.00,        -- 0..5
  rating_count     INT DEFAULT 0,
  price            DECIMAL(10,2) NOT NULL DEFAULT 0, -- 0 = free
  old_price        DECIMAL(10,2),
  discount_percent INT DEFAULT 0,
  is_free          BOOLEAN DEFAULT FALSE,
  is_best_seller   BOOLEAN DEFAULT FALSE,
  is_featured      BOOLEAN DEFAULT FALSE,
  status           ENUM('draft','published','archived') DEFAULT 'draft',
  published_at     DATETIME NULL,
  meta_title       VARCHAR(200),
  meta_description TEXT,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_courses_category   FOREIGN KEY (category_id)  REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_courses_level      FOREIGN KEY (level_id)     REFERENCES levels(id)     ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id)REFERENCES instructors(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_courses_category (category_id),
  INDEX idx_courses_level (level_id),
  INDEX idx_courses_instructor (instructor_id),
  INDEX idx_courses_status (status),
  INDEX idx_courses_featured (is_featured),
  INDEX idx_courses_bestseller (is_best_seller),
  INDEX idx_courses_isfree (is_free),
  INDEX idx_courses_price (price)
) ENGINE=InnoDB;

-- COURSE DETAILS (About, outcomes, skills, requirements, achievements...)
CREATE TABLE course_details (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  course_id          INT NOT NULL,
  about_content      LONGTEXT,
  learning_outcomes  JSON,     -- ["Làm quen ...", ...]
  skills_covered     JSON,     -- ["Listening","Reading",...]
  requirements       JSON,
  achievements       JSON,
  certificate_info   TEXT,
  last_updated       DATE,
  language           VARCHAR(50) DEFAULT 'Vietnamese',
  target_audience    TEXT,
  created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_course_details_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_course_details_course (course_id)
) ENGINE=InnoDB;

-- MODULES (chương)
CREATE TABLE modules (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  course_id      INT NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT,
  sort_order     INT NOT NULL,
  total_lectures INT DEFAULT 0,
  total_duration VARCHAR(50),
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_modules_course (course_id),
  INDEX idx_modules_sort (sort_order),
  INDEX idx_modules_active (is_active)
) ENGINE=InnoDB;

-- LESSONS (bài học)
CREATE TABLE lessons (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  module_id       INT NOT NULL,
  course_id       INT NOT NULL,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  content         LONGTEXT,
  video_url       VARCHAR(255),
  video_duration  VARCHAR(20),         -- "10:00"
  file_attachment VARCHAR(255),
  sort_order      INT NOT NULL,
  lesson_type     ENUM('video','document','quiz','assignment','live') DEFAULT 'video',
  is_free         BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  view_count      INT DEFAULT 0,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_lessons_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_lessons_module (module_id),
  INDEX idx_lessons_course (course_id),
  INDEX idx_lessons_sort (sort_order),
  INDEX idx_lessons_active (is_active),
  INDEX idx_lessons_isfree (is_free)
) ENGINE=InnoDB;

-- ENROLLMENTS (đăng ký khóa học)
CREATE TABLE course_enrollments (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  user_id                  INT NOT NULL,
  course_id                INT NOT NULL,
  status                   ENUM('active','completed','cancelled','expired') DEFAULT 'active',
  enrolled_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at             DATETIME NULL,
  expires_at               DATETIME NULL,
  progress_percent         DECIMAL(5,2) DEFAULT 0.00,
  last_accessed_lesson_id  INT NULL,
  last_accessed_at         DATETIME NULL,
  payment_amount           DECIMAL(10,2),
  payment_method           VARCHAR(50),
  payment_status           ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  transaction_id           VARCHAR(100),
  created_at               DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at               DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_enroll_user   FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_enroll_course FOREIGN KEY (course_id)REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_enroll_last_lesson FOREIGN KEY (last_accessed_lesson_id) REFERENCES lessons(id) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE KEY uq_enroll (user_id, course_id),
  INDEX idx_enroll_status (status),
  INDEX idx_enroll_payment_status (payment_status)
) ENGINE=InnoDB;

-- LESSON PROGRESS (tiến độ theo bài)
CREATE TABLE lesson_progress (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  user_id            INT NOT NULL,
  lesson_id          INT NOT NULL,
  course_id          INT NOT NULL,
  status             ENUM('not_started','in_progress','completed') DEFAULT 'not_started',
  watched_duration   INT DEFAULT 0,   -- giây
  total_duration     INT DEFAULT 0,   -- giây
  completion_percent DECIMAL(5,2) DEFAULT 0.00,
  started_at         DATETIME NULL,
  completed_at       DATETIME NULL,
  last_accessed_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_progress_user   FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id)REFERENCES lessons(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progress_course FOREIGN KEY (course_id)REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_progress (user_id, lesson_id),
  INDEX idx_progress_status (status)
) ENGINE=InnoDB;

-- REVIEWS (đánh giá)
CREATE TABLE course_reviews (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  course_id    INT NOT NULL,
  rating       INT NOT NULL,       -- 1..5
  title        VARCHAR(200),
  content      TEXT,
  is_verified  BOOLEAN DEFAULT FALSE,
  status       ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_user   FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_course FOREIGN KEY (course_id)REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_review_once (user_id, course_id),
  INDEX idx_reviews_rating (rating),
  INDEX idx_reviews_status (status)
) ENGINE=InnoDB;

-- DISCUSSIONS (thảo luận, có reply)
CREATE TABLE course_discussions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  course_id     INT NOT NULL,
  user_id       INT NOT NULL,
  parent_id     INT NULL,
  title         VARCHAR(200),
  content       TEXT NOT NULL,
  likes_count   INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  status        ENUM('active','hidden','deleted') DEFAULT 'active',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_disc_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_disc_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_disc_parent FOREIGN KEY (parent_id) REFERENCES course_discussions(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_disc_course (course_id),
  INDEX idx_disc_parent (parent_id),
  INDEX idx_disc_status (status)
) ENGINE=InnoDB;

-- WISHLIST
CREATE TABLE course_wishlist (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  course_id  INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wish_user   FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_wish_course FOREIGN KEY (course_id)REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_wishlist (user_id, course_id),
  INDEX idx_wishlist_user (user_id),
  INDEX idx_wishlist_course (course_id)
) ENGINE=InnoDB;

-- COUPONS
CREATE TABLE coupons (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  code                  VARCHAR(50) NOT NULL UNIQUE,
  name                  VARCHAR(100) NOT NULL,
  description           TEXT,
  discount_type         ENUM('percentage','fixed_amount') NOT NULL,
  discount_value        DECIMAL(10,2) NOT NULL,
  minimum_amount        DECIMAL(10,2) DEFAULT 0.00,
  max_uses              INT,
  used_count            INT DEFAULT 0,
  max_uses_per_user     INT DEFAULT 1,
  valid_from            DATETIME NOT NULL,
  valid_until           DATETIME NOT NULL,
  is_active             BOOLEAN DEFAULT TRUE,
  applicable_courses    JSON,
  applicable_categories JSON,
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coupons_active (is_active),
  INDEX idx_coupons_valid_from (valid_from),
  INDEX idx_coupons_valid_until (valid_until)
) ENGINE=InnoDB;

-- COURSE_COUPONS (n-n)
CREATE TABLE course_coupons (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  course_id  INT NOT NULL,
  coupon_id  INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_course_coupons_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_course_coupons_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_course_coupon (course_id, coupon_id),
  INDEX idx_course_coupons_course (course_id),
  INDEX idx_course_coupons_coupon (coupon_id)
) ENGINE=InnoDB;

-- CERTIFICATES
CREATE TABLE course_certificates (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  user_id              INT NOT NULL,
  course_id            INT NOT NULL,
  enrollment_id        INT NOT NULL,
  certificate_number   VARCHAR(100) UNIQUE,
  issued_date          DATETIME DEFAULT CURRENT_TIMESTAMP,
  certificate_url      VARCHAR(255),
  certificate_template VARCHAR(100),
  created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cert_user        FOREIGN KEY (user_id)       REFERENCES users(id)              ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cert_course      FOREIGN KEY (course_id)     REFERENCES courses(id)            ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cert_enrollment  FOREIGN KEY (enrollment_id) REFERENCES course_enrollments(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_cert_user (user_id),
  INDEX idx_cert_course (course_id),
  INDEX idx_cert_number (certificate_number)
) ENGINE=InnoDB;

-- ANALYTICS (thống kê theo ngày)
CREATE TABLE course_analytics (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  course_id    INT NOT NULL,
  date         DATE NOT NULL,
  views        INT DEFAULT 0,
  enrollments  INT DEFAULT 0,
  completions  INT DEFAULT 0,
  revenue      DECIMAL(10,2) DEFAULT 0.00,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_analytics_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_analytics_day (course_id, date),
  INDEX idx_analytics_date (date)
) ENGINE=InnoDB;

-- USER COURSE HISTORY (audit)
CREATE TABLE user_course_history (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  course_id   INT NOT NULL,
  action      ENUM('view','wishlist','enroll','complete','review') NOT NULL,
  action_data JSON,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_hist_user   FOREIGN KEY (user_id)   REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_hist_course FOREIGN KEY (course_id) REFERENCES courses(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_hist_user (user_id),
  INDEX idx_hist_course (course_id),
  INDEX idx_hist_action (action),
  INDEX idx_hist_created (created_at)
) ENGINE=InnoDB;

-- TAGS
CREATE TABLE course_tags (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(50) NOT NULL,
  color      VARCHAR(7),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tag_name (name)
) ENGINE=InnoDB;

-- COURSE-TAG relations (n-n)
CREATE TABLE course_tag_relations (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  course_id  INT NOT NULL,
  tag_id     INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ctr_course FOREIGN KEY (course_id) REFERENCES courses(id)     ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ctr_tag    FOREIGN KEY (tag_id)    REFERENCES course_tags(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_course_tag (course_id, tag_id),
  INDEX idx_ctr_course (course_id),
  INDEX idx_ctr_tag (tag_id)
) ENGINE=InnoDB;

-- PREREQUISITES (điều kiện tiên quyết)
CREATE TABLE course_prerequisites (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  course_id                INT NOT NULL,
  prerequisite_course_id   INT NOT NULL,
  prerequisite_type        ENUM('course','level','skill') DEFAULT 'course',
  created_at               DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pre_course     FOREIGN KEY (course_id)              REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pre_req_course FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_pre (course_id, prerequisite_course_id),
  INDEX idx_pre_course (course_id),
  INDEX idx_pre_req (prerequisite_course_id)
) ENGINE=InnoDB;

-- RELATED COURSES
CREATE TABLE course_related_courses (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  course_id         INT NOT NULL,
  related_course_id INT NOT NULL,
  relation_type     ENUM('similar','next_level','prerequisite') DEFAULT 'similar',
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rel_course   FOREIGN KEY (course_id)         REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rel_related  FOREIGN KEY (related_course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_related (course_id, related_course_id),
  INDEX idx_rel_course (course_id),
  INDEX idx_rel_related (related_course_id)
) ENGINE=InnoDB;