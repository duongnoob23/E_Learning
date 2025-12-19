-- ============================================
-- INSERT MODULE: Từ vựng TOEIC với hình ảnh
-- Module ID: 12
-- Course ID: 4
-- ============================================

-- Phiên bản đơn giản (sort_order = 1, bạn có thể thay đổi)
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
    'Module học từ vựng TOEIC với 80 từ được minh họa bằng hình ảnh. Giúp học viên ghi nhớ từ vựng hiệu quả thông qua hình ảnh trực quan, phù hợp cho việc luyện thi TOEIC. Mỗi từ vựng bao gồm: định nghĩa tiếng Anh, nghĩa tiếng Việt, ví dụ, phiên âm, audio phát âm và hình ảnh minh họa.',
    1,  -- Thay đổi số này theo sort_order bạn muốn
    8,  -- 80 từ / 10 từ mỗi lesson = 8 lessons
    '160 phút',  -- 80 từ × 2 phút/từ = 160 phút
    TRUE,
    NOW(),
    NOW()
);


