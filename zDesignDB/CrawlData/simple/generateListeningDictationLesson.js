const fs = require("fs");
const path = require("path");

// Đọc file từ vựng
const wordsFile = path.join(__dirname, "words_with_images.json");
const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));

console.log(`📚 Đã đọc ${words.length} từ vựng`);

// Tạo danh sách từ vựng cho bài nghe chính tả
const vocabularyWords = words.map((word) => {
  return {
    word: word.word,
    meaning_vi: word.meaning_vi || word.definition || "",
    definition: word.definition || "",
    phonetic: word.phonetic || "",
    audio: word.audio || null,
    image_url: word.image_url || null
  };
});

console.log(`✅ Đã tạo ${vocabularyWords.length} từ vựng`);

// Tạo exercise_data - mảng các từ vựng trực tiếp (không có wrapper)
const exerciseData = vocabularyWords;

// Escape JSON cho MySQL
// JSON.stringify đã escape các ký tự đặc biệt trong JSON
let exerciseDataJson = JSON.stringify(exerciseData);

// Validate JSON trước
try {
  JSON.parse(exerciseDataJson);
  console.log("✅ JSON hợp lệ");
} catch (e) {
  console.error("❌ JSON không hợp lệ:", e.message);
  process.exit(1);
}

// Escape cho MySQL string literal:
// 1. Escape backslash trước (vì nếu escape sau sẽ bị double escape)
// 2. Escape dấu nháy đơn (trong string literal, ' phải thành '')
exerciseDataJson = exerciseDataJson.replace(/\\/g, "\\\\").replace(/'/g, "''");

// Tạo SQL INSERT
const sql = `-- ============================================
-- INSERT LESSON: Nghe chính tả TOEIC
-- Lesson ID: 75
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
    75,
    12,
    4,
    'Nghe chính tả: 80 Từ vựng TOEIC',
    'Bài tập nghe chính tả với 80 từ vựng TOEIC. Nghe audio phát âm và gõ từ vựng bạn nghe được. Sau đó click vào nút Check để kiểm tra đáp án.',
    'Luyện tập từ vựng TOEIC thông qua bài tập nghe chính tả. Nghe audio phát âm của từ, sau đó gõ từ vựng bạn nghe được vào ô input. Click "Check kết quả" để kiểm tra đáp án. Từ vựng sẽ hiển thị nghĩa tiếng Việt, định nghĩa tiếng Anh và phiên âm sau khi bạn check đáp án hoặc chuyển câu.',
    NULL,
    NULL,
    NULL,
    6,  -- sort_order (sau các lesson khác)
    'quiz',  -- lesson_type
    TRUE,  -- has_exercise
    'listening_dictation',  -- exercise_type
    '${exerciseDataJson}',  -- exercise_data (JSON) - đã escape backslash và dấu nháy đơn
    ${Math.ceil(vocabularyWords.length * 1)},  -- exercise_duration (ước tính: 1 phút/từ)
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
WHERE lesson_id = 75;
`;

// Lưu vào file
const outputFile = path.join(__dirname, "insert_listening_dictation_lesson.sql");
fs.writeFileSync(outputFile, sql, "utf8");

console.log(`✅ Đã tạo file SQL: ${outputFile}`);
console.log(`📊 Tổng số từ vựng: ${vocabularyWords.length}`);
console.log(`📝 Mẫu từ vựng đầu tiên:`);
console.log(`   Word: ${vocabularyWords[0].word}`);
console.log(`   Meaning VI: ${vocabularyWords[0].meaning_vi.substring(0, 50)}...`);
console.log(`   Definition: ${vocabularyWords[0].definition.substring(0, 50)}...`);
console.log(`   Phonetic: ${vocabularyWords[0].phonetic}`);
console.log(`   Audio: ${vocabularyWords[0].audio ? 'Có' : 'Không'}`);
console.log(`\n💡 Lưu ý: File SQL rất lớn (${Math.round(sql.length / 1024)} KB)`);


