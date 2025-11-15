# Hướng dẫn tạo TOEIC Speaking và Writing Test

## Vấn đề 1: Tạo Test Speaking/Writing

### Cách 1: Chạy SQL Script (Khuyến nghị)

1. Mở MySQL và chọn database `e_learnning2`
2. Chạy file: `backend/scripts/insert_toeic_speaking_writing.sql`
3. Script sẽ tự động tạo:
   - **TOEIC Speaking Test**: 5 parts, 7 questions
   - **TOEIC Writing Test**: 3 parts, 8 questions

### Cách 2: Sử dụng Admin API (Nếu có quyền admin)

```javascript
// 1. Tạo Test
const testRes = await examAdminApi.createTest({
  title: "TOEIC Speaking Practice Test",
  duration: 20,
  description: "Official TOEIC Speaking Practice Test",
  total_questions: 7,
  total_parts: 5,
  difficulty_level: "EASY"
});

const testId = testRes.DT.test_id;

// 2. Tạo Parts
for (let i = 1; i <= 5; i++) {
  await examAdminApi.addPartToTest(testId, {
    part_name: `Part ${i}`,
    part_type: "LISTENING", // Tạm thời
    part_number: i,
    question_count: i === 1 || i === 2 ? 2 : 1,
    duration_minutes: 4,
    description: "",
    display_template: ""
  });
}

// 3. Tạo Questions (không có choices)
// ... (xem code trong mockTestData.js)
```

## Vấn đề 2: resultByTag không hiển thị dữ liệu

### Nguyên nhân:
- Hàm `getResultByTags` chỉ trả về dữ liệu nếu **questions có tags**
- Code kiểm tra: `if (!question || !question.questionTags) return;`
- Nếu questions không có tags → không có dữ liệu hiển thị

### Giải pháp:

#### Option 1: Thêm tags cho questions (Khuyến nghị)

Chạy script SQL để thêm tags cho questions:

```sql
-- 1. Tạo tags (nếu chưa có)
INSERT INTO exam_tags (name, description, created_at, updated_at)
VALUES 
  ('Part 1 - Read Aloud', 'Questions in Part 1 - Read a text aloud', NOW(), NOW()),
  ('Part 2 - Read Aloud', 'Questions in Part 2 - Read a text aloud', NOW(), NOW()),
  ('Part 3 - Describe Picture', 'Questions in Part 3 - Describe a picture', NOW(), NOW()),
  ('Part 4 - Respond Questions', 'Questions in Part 4 - Respond to questions', NOW(), NOW()),
  ('Part 5 - Propose Solution', 'Questions in Part 5 - Propose a solution', NOW(), NOW());

-- 2. Gán tags cho questions
-- Ví dụ: Gán tag "Part 1 - Read Aloud" cho tất cả questions trong part 1
INSERT INTO question_tags (question_id, exam_tag_id, created_at, updated_at)
SELECT 
  q.question_id,
  et.exam_tag_id,
  NOW(),
  NOW()
FROM questions q
JOIN parts p ON q.part_id = p.part_id
JOIN exam_tags et ON et.name = CONCAT('Part ', p.part_number, ' - Read Aloud')
WHERE p.test_id = @test_id_speaking AND p.part_number = 1;
```

#### Option 2: Sửa code để không yêu cầu tags

Sửa file `backend/src/client/services/examClientService.js`:

```javascript
// Dòng 1178: Thay đổi logic để không skip questions không có tags
userAnswers.forEach((answer) => {
  const question = answer.question;
  if (!question) return;
  
  // Nếu không có tags, tạo tag mặc định theo part
  if (!question.questionTags || question.questionTags.length === 0) {
    // Tạo tag mặc định
    const defaultTag = {
      tag_name: `Part ${question.part_id}`,
      tag_description: 'No tag assigned',
      // ...
    };
    // Xử lý với defaultTag
  } else {
    // Xử lý với tags có sẵn
    question.questionTags.forEach((questionTag) => {
      // ...
    });
  }
});
```

## Lưu ý quan trọng:

1. **part_type**: Hiện tại model chỉ hỗ trợ `LISTENING`, `READING`
   - Tạm thời dùng `LISTENING` cho Speaking
   - Tạm thời dùng `READING` cho Writing
   - Có thể sửa model sau để thêm `SPEAKING`, `WRITING`

2. **Choices**: Questions cho Speaking/Writing **KHÔNG CẦN** choices
   - Script SQL không tạo choices
   - Frontend sẽ xử lý riêng cho Speaking/Writing

3. **question_type**: Hiện tại dùng `MULTIPLE_CHOICE` tạm thời
   - Có thể thêm type mới: `SPEAKING_READ_ALOUD`, `WRITING_ESSAY`, etc.

4. **Tags**: Để hiển thị resultByTag, cần thêm tags cho questions
   - Có thể thêm tags theo part_number
   - Hoặc thêm tags theo nội dung câu hỏi

## Test sau khi tạo:

1. Kiểm tra test đã được tạo:
```sql
SELECT * FROM tests WHERE title LIKE '%Speaking%' OR title LIKE '%Writing%';
```

2. Kiểm tra parts:
```sql
SELECT p.*, t.title 
FROM parts p 
JOIN tests t ON p.test_id = t.test_id 
WHERE t.title LIKE '%Speaking%' OR t.title LIKE '%Writing%';
```

3. Kiểm tra questions:
```sql
SELECT q.*, p.part_number, t.title 
FROM questions q 
JOIN parts p ON q.part_id = p.part_id 
JOIN tests t ON p.test_id = t.test_id 
WHERE t.title LIKE '%Speaking%' OR t.title LIKE '%Writing%';
```

4. Kiểm tra tags (nếu đã thêm):
```sql
SELECT qt.*, q.question_id, et.name as tag_name
FROM question_tags qt
JOIN questions q ON qt.question_id = q.question_id
JOIN exam_tags et ON qt.exam_tag_id = et.exam_tag_id
JOIN parts p ON q.part_id = p.part_id
JOIN tests t ON p.test_id = t.test_id
WHERE t.title LIKE '%Speaking%' OR t.title LIKE '%Writing%';
```

