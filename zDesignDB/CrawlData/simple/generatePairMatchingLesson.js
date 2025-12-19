const fs = require("fs");
const path = require("path");

// Đọc file từ vựng
const wordsFile = path.join(__dirname, "words_with_images.json");
const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));

console.log(`📚 Đã đọc ${words.length} từ vựng`);

// Chia 80 từ thành 10 câu hỏi, mỗi câu 8 từ (4 cặp)
const wordsPerQuestion = 8;
const totalQuestions = Math.ceil(words.length / wordsPerQuestion);

console.log(`📊 Sẽ tạo ${totalQuestions} câu hỏi, mỗi câu ${wordsPerQuestion} từ (${wordsPerQuestion / 2} cặp)`);

// Tạo các câu hỏi
const questions = [];

for (let q = 0; q < totalQuestions; q++) {
  const startIndex = q * wordsPerQuestion;
  const endIndex = Math.min(startIndex + wordsPerQuestion, words.length);
  const questionWords = words.slice(startIndex, endIndex);
  
  // Tạo các cặp từ (không cần id, có thêm image_url)
  const pairs = questionWords.map((word) => {
    return {
      word: word.word,
      meaning: word.meaning_vi || word.definition || "",
      image_url: word.image_url || null
    };
  });
  
  questions.push({
    question_id: q + 1,
    pairs: pairs,
    shuffle: true
  });
}

console.log(`✅ Đã tạo ${questions.length} câu hỏi`);

// Tạo exercise_data - mảng các câu hỏi
const exerciseData = questions;

// Escape JSON cho MySQL
const exerciseDataJson = JSON.stringify(exerciseData).replace(/'/g, "''");

// Tạo SQL INSERT
const sql = `-- ============================================
-- INSERT LESSON: Tìm cặp Từ vựng TOEIC
-- Lesson ID: 72
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
    72,
    12,
    4,
    'Tìm cặp: 80 Từ vựng TOEIC',
    'Bài tập ghép từ tiếng Anh với nghĩa tiếng Việt tương ứng. Mỗi câu hỏi có 8 từ (4 cặp), học viên cần ghép đúng từ với nghĩa của nó.',
    'Luyện tập từ vựng TOEIC thông qua bài tập tìm cặp. Ghép các từ tiếng Anh ở cột trái với nghĩa tiếng Việt ở cột phải. Click vào từ để chọn, sau đó click vào nghĩa tương ứng để ghép cặp. Mỗi câu hỏi có 8 từ (4 cặp).',
    NULL,
    NULL,
    NULL,
    3,  -- sort_order (sau flashcard và multiple choice)
    'quiz',  -- lesson_type
    TRUE,  -- has_exercise
    'pair_matching',  -- exercise_type
    '${exerciseDataJson}',  -- exercise_data (JSON)
    ${Math.ceil(questions.length * 3)},  -- exercise_duration (ước tính: 3 phút/câu)
    60,  -- pass_score (60%)
    ${questions.length * 4},  -- max_score (4 điểm/câu, mỗi cặp = 1 điểm)
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
WHERE lesson_id = 72;
`;

// Lưu vào file
const outputFile = path.join(__dirname, "insert_pair_matching_lesson.sql");
fs.writeFileSync(outputFile, sql, "utf8");

console.log(`✅ Đã tạo file SQL: ${outputFile}`);
console.log(`📊 Tổng số câu hỏi: ${questions.length}`);
console.log(`📝 Mẫu câu hỏi đầu tiên:`);
console.log(`   Question ID: ${questions[0].question_id}`);
console.log(`   Số cặp: ${questions[0].pairs.length}`);
console.log(`   Các cặp:`);
questions[0].pairs.forEach(pair => {
  console.log(`     - ${pair.word} = ${pair.meaning}`);
});
console.log(`\n💡 Lưu ý: File SQL rất lớn (${Math.round(sql.length / 1024)} KB)`);

