const fs = require("fs");
const path = require("path");

// Đọc file từ vựng
const wordsFile = path.join(__dirname, "words_with_images.json");
const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));

console.log(`📚 Đã đọc ${words.length} từ vựng`);

// Tạo danh sách từ vựng trực tiếp (không chia thành questions)
const vocabularyWords = words.map((word) => {
  return {
    word: word.word,
    meaning: word.meaning_vi || word.definition || "",
    phonetic: word.phonetic || "",
    audio: word.audio || null,
    image_url: word.image_url || null
  };
});

console.log(`✅ Đã tạo ${vocabularyWords.length} từ vựng`);

// Tạo exercise_data - mảng các từ vựng trực tiếp (không có question_id)
const exerciseData = vocabularyWords;

// Escape JSON cho MySQL
const exerciseDataJson = JSON.stringify(exerciseData).replace(/'/g, "''");

// Tạo SQL INSERT
const sql = `-- ============================================
-- INSERT LESSON: Nghe Từ vựng TOEIC
-- Lesson ID: 73
-- Module ID: 12
-- Course ID: 4
-- ============================================

INSERT INTO lessons (
    lesson_id,
    module_id,
    course_id,
    title,
    description,
    content,
    video_url,
    video_duration,
    file_attachment,
    sort_order,
    lesson_type,
    has_exercise,
    exercise_type,
    exercise_data,
    exercise_duration,
    pass_score,
    max_score,
    is_free,
    is_active,
    view_count,
    created_at,
    updated_at
) VALUES (
    73,
    12,
    4,
    'Nghe từ vựng: 80 Từ vựng TOEIC',
    'Bài tập nghe từ vựng TOEIC với audio phát âm. Hiển thị grid 3x3 với 9 từ vựng, nghe audio và chọn từ đúng. Khi chọn đúng, từ đó biến mất và thay bằng từ tiếp theo.',
    'Luyện tập từ vựng TOEIC thông qua bài tập nghe. Nghe audio của từ và chọn từ đúng trong grid 3x3. Khi chọn đúng, từ đó sẽ biến mất và được thay thế bằng từ tiếp theo. Hoàn thành tất cả 80 từ để kết thúc bài tập.',
    NULL,
    NULL,
    NULL,
    4,  -- sort_order (sau flashcard, multiple choice, pair matching)
    'quiz',  -- lesson_type
    TRUE,  -- has_exercise
    'vocabulary_listening',  -- exercise_type
    '${exerciseDataJson}',  -- exercise_data (JSON) - mảng các từ vựng
    ${Math.ceil(vocabularyWords.length / 9 * 2)},  -- exercise_duration (ước tính: 2 phút/9 từ)
    0,  -- pass_score (không có điểm)
    0,  -- max_score (không có điểm)
    FALSE,  -- is_free
    TRUE,  -- is_active
    0,  -- view_count
    NOW(),
    NOW()
);

-- Kiểm tra kết quả
SELECT 
    lesson_id,
    module_id,
    course_id,
    title,
    lesson_type,
    exercise_type,
    has_exercise,
    JSON_LENGTH(exercise_data) as total_words
FROM lessons 
WHERE lesson_id = 73;
`;

// Lưu vào file
const outputFile = path.join(__dirname, "insert_listening_vocabulary_lesson.sql");
fs.writeFileSync(outputFile, sql, "utf8");

console.log(`✅ Đã tạo file SQL: ${outputFile}`);
console.log(`📊 Tổng số từ vựng: ${vocabularyWords.length}`);
console.log(`📝 Mẫu các từ đầu tiên:`);
vocabularyWords.slice(0, 5).forEach(w => {
  console.log(`   - ${w.word} (${w.meaning}) - Audio: ${w.audio ? 'Có' : 'Không'}`);
});
console.log(`\n💡 Lưu ý: File SQL rất lớn (${Math.round(sql.length / 1024)} KB)`);

