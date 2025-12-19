const fs = require("fs");
const path = require("path");

// Đọc file từ vựng
const wordsFile = path.join(__dirname, "words_with_images.json");
const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));

console.log(`📚 Đã đọc ${words.length} từ vựng`);

// Hàm tạo câu hỏi từ example_en
function createQuestion(word, allWords, index) {
  // Lấy example_en, nếu không có thì tạo từ definition
  let questionText = word.example_en || word.definition || "";
  
  if (!questionText.trim()) {
    questionText = `Fill in the blank: ${word.word} means ${word.meaning_vi || word.definition}`;
  }
  
  // Tìm và thay từ vựng bằng ____ (chỉ thay 1 lần duy nhất)
  let replaced = false;
  
  // Ưu tiên thay từ gốc trước
  const wordRegex = new RegExp(`\\b${word.word}\\b`, "i");
  if (wordRegex.test(questionText)) {
    questionText = questionText.replace(wordRegex, "____");
    replaced = true;
  } else {
    // Nếu không tìm thấy từ gốc, thử các dạng từ khác
    const wordVariations = [
      new RegExp(`\\b${word.word}ed\\b`, "i"),
      new RegExp(`\\b${word.word}ing\\b`, "i"),
      new RegExp(`\\b${word.word}s\\b`, "i"),
      new RegExp(`\\b${word.word}es\\b`, "i")
    ];
    
    for (const regex of wordVariations) {
      if (regex.test(questionText)) {
        questionText = questionText.replace(regex, "____");
        replaced = true;
        break; // Chỉ thay 1 lần
      }
    }
  }
  
  if (!replaced) {
    // Nếu không tìm thấy từ trong câu, tạo câu mới
    if (word.meaning_vi) {
      questionText = `Fill in the blank: ${word.meaning_vi} = ____`;
    } else {
      questionText = `Fill in the blank: ${word.definition} = ____`;
    }
  }
  
  // Tạo 4 options: 1 đúng + 3 sai
  const correctAnswer = word.word;
  const wrongOptions = [];
  
  // Lấy 3 từ ngẫu nhiên khác (tránh trùng)
  const otherWords = allWords.filter(w => w.word !== correctAnswer);
  const shuffled = otherWords.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < 3 && i < shuffled.length; i++) {
    wrongOptions.push(shuffled[i].word);
  }
  
  // Nếu không đủ 3 từ, thêm các từ mặc định
  while (wrongOptions.length < 3) {
    wrongOptions.push(`option${wrongOptions.length + 1}`);
  }
  
  // Trộn options
  const allOptions = [correctAnswer, ...wrongOptions];
  const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
  
  // Tạo hint từ definition
  const hint = word.meaning_vi || word.definition || "";
  
  return {
    question_id: index + 1,
    question: questionText.trim(),
    options: shuffledOptions,
    answer: correctAnswer,
    hint: hint,
    explanation: word.meaning_vi ? `${word.word}: ${word.meaning_vi}` : word.definition
  };
}

// Tạo tất cả câu hỏi
const questions = words.map((word, index) => {
  return createQuestion(word, words, index);
});

console.log(`✅ Đã tạo ${questions.length} câu hỏi`);

// Tạo exercise_data - mảng các câu hỏi (bỏ key)
const exerciseData = questions;

// Escape JSON cho MySQL
const exerciseDataJson = JSON.stringify(exerciseData).replace(/'/g, "''");

// Tạo SQL INSERT
const sql = `-- ============================================
-- INSERT LESSON: Trắc nghiệm Từ vựng TOEIC
-- Lesson ID: 71
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
    71,
    12,
    4,
    'Trắc nghiệm: 80 Từ vựng TOEIC',
    'Bài tập trắc nghiệm 80 câu hỏi về từ vựng TOEIC. Mỗi câu hỏi có một câu ví dụ với từ vựng được để trống, học viên cần chọn đáp án đúng trong 4 lựa chọn.',
    'Luyện tập từ vựng TOEIC thông qua bài tập trắc nghiệm. Mỗi câu hỏi dựa trên ví dụ thực tế, giúp học viên hiểu cách sử dụng từ vựng trong ngữ cảnh. Hoàn thành bài tập để nắm vững 80 từ vựng quan trọng cho kỳ thi TOEIC.',
    NULL,
    NULL,
    NULL,
    2,  -- sort_order (sau flashcard lesson)
    'quiz',  -- lesson_type
    TRUE,  -- has_exercise
    'multiple_choice',  -- exercise_type
    '${exerciseDataJson}',  -- exercise_data (JSON)
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
WHERE lesson_id = 71;
`;

// Lưu vào file
const outputFile = path.join(__dirname, "insert_multiple_choice_lesson.sql");
fs.writeFileSync(outputFile, sql, "utf8");

console.log(`✅ Đã tạo file SQL: ${outputFile}`);
console.log(`📊 Tổng số câu hỏi: ${questions.length}`);
console.log(`📝 Mẫu câu hỏi đầu tiên:`);
console.log(`   Question: ${questions[0].question}`);
console.log(`   Options: ${questions[0].options.join(", ")}`);
console.log(`   Answer: ${questions[0].answer}`);
console.log(`   Hint: ${questions[0].hint}`);
console.log(`\n💡 Lưu ý: File SQL rất lớn (${Math.round(sql.length / 1024)} KB)`);

