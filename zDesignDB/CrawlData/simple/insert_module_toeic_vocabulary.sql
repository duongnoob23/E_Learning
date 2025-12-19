-- ============================================
-- INSERT MODULE: Từ vựng TOEIC với hình ảnh
-- Module ID: 12
-- Course ID: 4
-- ============================================

-- Kiểm tra và xóa module cũ nếu đã tồn tại (tùy chọn)
-- DELETE FROM modules WHERE module_id = 12;

-- Lấy sort_order tiếp theo cho course_id = 4
-- Nếu muốn tự động, có thể dùng: (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM modules WHERE course_id = 4)
-- Ở đây tạm đặt sort_order = 1 (bạn có thể thay đổi theo nhu cầu)

-- INSERT module mới
INSERT INTO modules (
    module_id,
    course_id,
    title,
    description,
    sort_order,
    total_lectures,
    total_duration,
    is_active,
    created_at,
    updated_at
) VALUES (
    12,
    4,
    'Từ vựng TOEIC với hình ảnh',
    'Module học từ vựng TOEIC với 80 từ được minh họa bằng hình ảnh. Giúp học viên ghi nhớ từ vựng hiệu quả thông qua hình ảnh trực quan, phù hợp cho việc luyện thi TOEIC. Mỗi từ vựng bao gồm: định nghĩa tiếng Anh, nghĩa tiếng Việt, ví dụ, phiên âm, audio phát âm và hình ảnh minh họa. Module này tập trung vào các từ vựng thường xuất hiện trong đề thi TOEIC, giúp học viên nâng cao vốn từ vựng và tự tin hơn trong kỳ thi.',
    (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM modules WHERE course_id = 4),
    8,  -- 80 từ / 10 từ mỗi lesson = 8 lessons
    '160 phút',  -- 80 từ × 2 phút/từ = 160 phút
    TRUE,
    NOW(),
    NOW()
);

-- Kiểm tra kết quả
SELECT 
    module_id,
    course_id,
    title,
    description,
    sort_order,
    total_lectures,
    total_duration,
    is_active,
    created_at
FROM modules 
WHERE module_id = 12;


