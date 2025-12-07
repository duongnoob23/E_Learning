-- ============================================
-- UPGRADE DICTIONARY - Tối ưu và nâng cấp
-- ============================================

-- 1. Thêm indexes để tối ưu tìm kiếm
CREATE INDEX idx_words_word ON words(word);
CREATE INDEX idx_words_word_lower ON words(LOWER(word));
CREATE INDEX idx_words_is_active ON words(is_active);
CREATE INDEX idx_words_topic_id ON words(topic_id);
CREATE INDEX idx_words_part_of_speech ON words(part_of_speech);

-- 2. Full-text index cho meaning_vi (MySQL 5.6+)
-- Cho phép tìm kiếm nhanh trong nghĩa tiếng Việt
ALTER TABLE words ADD FULLTEXT INDEX ft_meaning_vi (meaning_vi);

-- 3. Full-text index cho word (tìm kiếm từ)
ALTER TABLE words ADD FULLTEXT INDEX ft_word (word);

-- 4. Composite index cho tìm kiếm thường dùng
CREATE INDEX idx_words_active_word ON words(is_active, word);

-- 5. Index cho audio_url và image_url (nếu cần filter)
CREATE INDEX idx_words_audio ON words(audio_url(255));
CREATE INDEX idx_words_image ON words(image_url(255));

-- ============================================
-- NOTES:
-- - Indexes sẽ cải thiện tốc độ tìm kiếm đáng kể
-- - Full-text index cho phép tìm kiếm nâng cao trong meaning_vi
-- - Composite index tối ưu cho query: WHERE is_active=1 AND word LIKE '...'
-- ============================================

