const fs = require("fs");
const path = require("path");

// Đọc file từ vựng
const wordsFile = path.join(__dirname, "words_with_images.json");
const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));

console.log(`📚 Đã đọc ${words.length} từ vựng`);

// Tạo 80 câu hỏi điền từ
const questions = [];

words.forEach((word, index) => {
  // Lấy example_en, nếu không có thì dùng definition
  let exampleText = word.example_en || word.definition || "";
  
  // Tìm từ trong example và thay bằng _____ (chỉ thay lần đầu tiên)
  const wordLower = word.word.toLowerCase();
  const wordPattern = new RegExp(`\\b${wordLower}\\w*\\b`, "i");
  
  // Tìm vị trí đầu tiên của từ
  const match = exampleText.match(wordPattern);
  let questionText = exampleText;
  
  if (match) {
    // Thay thế chỉ lần đầu tiên
    questionText = exampleText.replace(wordPattern, "_____");
  } else {
    // Nếu không tìm thấy từ trong example, tạo câu mới
    questionText = `The word _____ means "${word.meaning_vi || word.definition}".`;
  }
  
  // Tạo hint từ definition hoặc meaning_vi
  const hint = word.definition || word.meaning_vi || "";
  
  questions.push({
    question_id: index + 1,
    question: questionText,
    hint: hint,
    correct_answer: word.word
  });
});

console.log(`✅ Đã tạo ${questions.length} câu hỏi`);

// Tạo exercise_data - mảng các câu hỏi trực tiếp (không có wrapper)
const exerciseData = questions;

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
-- INSERT LESSON: Dịch nghĩa điền từ TOEIC
-- Lesson ID: 74
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
    74,
    12,
    4,
    'Điền từ: 80 Từ vựng TOEIC',
    'Bài tập điền từ vào chỗ trống với 80 câu hỏi. Mỗi câu có một câu ví dụ với từ vựng được để trống, học viên cần điền từ đúng vào chỗ trống.',
    'Luyện tập từ vựng TOEIC thông qua bài tập điền từ. Mỗi câu hỏi có một câu ví dụ với từ vựng được để trống. Đọc câu và gợi ý, sau đó điền từ đúng vào chỗ trống. Hoàn thành 80 câu hỏi để nắm vững từ vựng.',
    NULL,
    NULL,
    NULL,
    5,  -- sort_order (sau các lesson khác)
    'quiz',  -- lesson_type
    TRUE,  -- has_exercise
    'translation',  -- exercise_type (dùng translation cho fill blank)
    JSON_QUOTE('${exerciseDataJson.replace(/\\/g, "\\\\").replace(/'/g, "''")}'),  -- exercise_data (JSON) - dùng JSON_QUOTE để đảm bảo JSON hợp lệ
    ${Math.ceil(questions.length * 1.5)},  -- exercise_duration (ước tính: 1.5 phút/câu)
    60,  -- pass_score (60%)
    ${questions.length},  -- max_score (1 điểm/câu)
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
    JSON_LENGTH(exercise_data) as total_questions,
    max_score,
    pass_score
FROM lessons 
WHERE lesson_id = 74;
`;

// Lưu vào file
const outputFile = path.join(__dirname, "insert_fill_blank_lesson.sql");
fs.writeFileSync(outputFile, sql, "utf8");

console.log(`✅ Đã tạo file SQL: ${outputFile}`);
console.log(`📊 Tổng số câu hỏi: ${questions.length}`);
console.log(`📝 Mẫu câu hỏi đầu tiên:`);
console.log(`   Question ID: ${questions[0].question_id}`);
console.log(`   Question: ${questions[0].question}`);
console.log(`   Hint: ${questions[0].hint.substring(0, 50)}...`);
console.log(`   Correct Answer: ${questions[0].correct_answer}`);
console.log(`\n📝 Mẫu câu hỏi thứ 2:`);
console.log(`   Question ID: ${questions[1].question_id}`);
console.log(`   Question: ${questions[1].question}`);
console.log(`   Hint: ${questions[1].hint.substring(0, 50)}...`);
console.log(`   Correct Answer: ${questions[1].correct_answer}`);
console.log(`\n💡 Lưu ý: File SQL rất lớn (${Math.round(sql.length / 1024)} KB)`);

