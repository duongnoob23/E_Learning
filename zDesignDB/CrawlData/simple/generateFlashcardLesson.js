const fs = require("fs");
const path = require("path");

// Đọc file từ vựng
const wordsFile = path.join(__dirname, "words_with_images.json");
const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));

console.log(`📚 Đã đọc ${words.length} từ vựng`);

// Hàm chuyển đổi pos sang dạng ngắn
function normalizePos(pos) {
  if (!pos) return "";
  const posLower = pos.toLowerCase().trim();
  const posMap = {
    "verb": "v",
    "v.": "v",
    "noun": "n",
    "n.": "n",
    "adjective": "adj",
    "adj.": "adj",
    "adverb": "adv",
    "adv.": "adv",
    "preposition": "prep",
    "prep.": "prep",
    "conjunction": "conj",
    "conj.": "conj",
    "pronoun": "pron",
    "pron.": "pron",
    "interjection": "interj",
    "interj.": "interj",
  };
  return posMap[posLower] || posLower.replace(/\.$/, "");
}

// Chuyển đổi từ vựng sang format flashcard
const flashcards = words.map((word, index) => {
  // Xử lý examples - tách example_en thành mảng nếu có nhiều câu
  let examples = [];
  
  if (word.example_en) {
    // Tách các câu ví dụ (có thể ngăn cách bởi dấu chấm hoặc xuống dòng)
    const exampleSentences = word.example_en
      .split(/[.!?]\s+/)
      .filter(s => s.trim().length > 0)
      .slice(0, 3); // Lấy tối đa 3 ví dụ
    
    const exampleViSentences = word.example_vi
      ? word.example_vi.split(/[.!?]\s+/).filter(s => s.trim().length > 0)
      : [];
    
    examples = exampleSentences.map((en, idx) => {
      // Tìm từ trong câu và đánh dấu bằng [word]
      const wordInSentence = word.word.toLowerCase();
      let exampleText = en.trim();
      
      // Thêm [word] vào câu nếu chưa có
      if (!exampleText.includes(`[${word.word}]`)) {
        const regex = new RegExp(`\\b${word.word}\\b`, "gi");
        exampleText = exampleText.replace(regex, `[${word.word}]`);
      }
      
      return {
        example_en: exampleText,
        example_vi: exampleViSentences[idx] || "",
        audio: word.audio || null
      };
    });
  } else {
    // Nếu không có example_en, tạo 1 ví dụ từ definition
    examples = [{
      example_en: `[${word.word}]`,
      example_vi: word.meaning_vi || "",
      audio: word.audio || null
    }];
  }

  return {
    id: index + 1,
    word: word.word,
    pos: normalizePos(word.pos),
    phonetic: word.phonetic || "",
    phonetic_uk: word.phonetic || "", // Có thể tách UK/US sau
    phonetic_us: word.phonetic || "",
    audio: word.audio || null,
    definition_vi: word.meaning_vi || "",
    definition_en: word.definition || "",
    examples: examples,
    image_url: word.image_url || null
  };
});

// Tạo câu lệnh SQL - exercise_data là mảng trực tiếp các từ vựng
// Escape JSON cho MySQL
const exerciseDataJson = JSON.stringify(flashcards).replace(/'/g, "''");

// Tạo SQL INSERT
const sql = `-- ============================================
-- INSERT LESSON: Flashcard Từ vựng TOEIC
-- Lesson ID: 70
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
    70,
    12,
    4,
    'Flashcard: 80 Từ vựng TOEIC với hình ảnh',
    'Học 80 từ vựng TOEIC thông qua flashcard với hình ảnh minh họa. Mỗi flashcard bao gồm: từ vựng, phiên âm, định nghĩa tiếng Anh và tiếng Việt, ví dụ, audio phát âm và hình ảnh.',
    'Học từ vựng TOEIC hiệu quả với phương pháp flashcard kết hợp hình ảnh. Lật thẻ để xem nghĩa, nghe phát âm và xem ví dụ. Hình ảnh minh họa giúp ghi nhớ từ vựng lâu hơn.',
    NULL,
    NULL,
    NULL,
    1,  -- sort_order (thay đổi nếu cần)
    'quiz',  -- lesson_type (dùng 'quiz' cho bài tập)
    TRUE,  -- has_exercise
    'flashcard',  -- exercise_type
    '${exerciseDataJson}',  -- exercise_data (JSON)
    ${words.length * 2},  -- exercise_duration (ước tính: 2 phút/từ)
    0,  -- pass_score
    0,  -- max_score
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
    JSON_LENGTH(exercise_data) as total_flashcards
FROM lessons 
WHERE lesson_id = 70;
`;

// Lưu vào file
const outputFile = path.join(__dirname, "insert_flashcard_lesson.sql");
fs.writeFileSync(outputFile, sql, "utf8");

console.log(`✅ Đã tạo file SQL: ${outputFile}`);
console.log(`📊 Tổng số flashcard: ${flashcards.length}`);
console.log(`\n💡 Lưu ý: File SQL rất lớn (${Math.round(sql.length / 1024)} KB)`);
console.log(`   Bạn có thể cần chỉnh sửa exercise_data nếu quá lớn cho MySQL.`);

