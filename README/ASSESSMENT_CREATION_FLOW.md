# 📝 LUỒNG TẠO MỚI BÀI THI (ASSESSMENT CREATION FLOW)

## 🎯 TỔNG QUAN

Tài liệu này mô tả **toàn bộ luồng tạo mới bài thi (Assessment/Exam)** từ đầu đến cuối, bao gồm:
- Nhập thông tin chi tiết bài thi
- Validate các trường thuộc tính
- Chọn loại bài thi (Listening & Reading, Speaking, Writing)
- Tạo nội dung cho bài thi (Part → Question → Choice)

**Điểm khác biệt so với Course:**
- **Course**: Chỉ có 2 loại (Listening, Reading) → Tạo lesson với editor part1-part7
- **Assessment**: Có 3 dạng chính:
  1. **Listening & Reading** - Tạo part và questions tương tự course
  2. **Speaking** - Tạo part và questions cho speaking
  3. **Writing** - Tạo part và questions cho writing

---

## 📋 MỐI QUAN HỆ CƠ SỞ DỮ LIỆU

### Cấu trúc Database

```
Test (tests)
├── test_id (PK)
├── title
├── description
├── exam_type (ENUM: 'TOEIC', 'IELTS', 'HSK', 'THPT')
├── total_duration (minutes)
├── total_questions
├── total_parts
├── difficulty_level (ENUM: 'EASY', 'MEDIUM', 'HARD')
└── created_by

Part (parts)
├── part_id (PK)
├── test_id (FK → tests)
├── part_number (1, 2, 3, ...)
├── part_name
├── part_type (ENUM: 'LISTENING', 'READING', 'SPEAKING', 'WRITING')
├── question_count
├── duration_minutes
├── description
└── display_template

Question (questions)
├── question_id (PK)
├── part_id (FK → parts)
├── question_number
├── question_text
├── question_type (ENUM: 'MULTIPLE_CHOICE', 'FILL_BLANK', 'READING_COMPREHENSION', 'SPEAKING', 'WRITING')
├── audio_file (cho Listening/Speaking)
├── image_file (cho Part 1, Writing Part 1)
├── transcript
├── explanation
└── grammar_notes

Choice (choices)
├── choice_id (PK)
├── question_id (FK → questions)
├── choice_letter (ENUM: 'A', 'B', 'C', 'D')
├── choice_text
├── choice_translation
├── choice_explanation
└── is_correct (BOOLEAN)
```

### Quan hệ giữa các bảng

```
Test (1) ──→ (N) Part
Part (1) ──→ (N) Question
Question (1) ──→ (N) Choice
```

**Lưu ý quan trọng:**
- Một Test có nhiều Part
- Một Part có nhiều Question
- Một Question có nhiều Choice (thường là 4 choices: A, B, C, D)
- Part có `part_type` để phân biệt kỹ năng (LISTENING, READING, SPEAKING, WRITING)
- Question có `question_type` để phân biệt loại câu hỏi

---

## 🔄 LUỒNG TẠO MỚI BÀI THI TỔNG QUAN

```
1. Tạo mới bài thi (Test)
   ↓
2. Nhập thông tin chi tiết bài thi
   - Title, Description
   - Exam Type (TOEIC, IELTS, HSK, THPT)
   - Total Duration (minutes)
   - Difficulty Level (EASY, MEDIUM, HARD)
   ↓
3. Validate các trường thuộc tính
   - Title: required, max 255 chars
   - Exam Type: required, phải là một trong ENUM
   - Total Duration: required, > 0
   - Difficulty Level: required
   ↓
4. Chọn loại bài thi
   - Listening & Reading (có thể chọn cả 2 hoặc từng cái)
   - Speaking
   - Writing
   ↓
5. Tạo nội dung cho bài thi
   - Tạo Part (theo loại đã chọn)
   - Tạo Questions cho từng Part
   - Tạo Choices cho từng Question (nếu là Multiple Choice)
   ↓
6. Lưu vào Database
   - Lưu Test
   - Lưu Parts
   - Lưu Questions
   - Lưu Choices
```

---

## 📝 CÁC BƯỚC CHI TIẾT

### Bước 1: Tạo mới bài thi (Test)

**Frontend Component:**
- `frontend/Shopery/src/Admin/features/exams/components/CreateExam/ExamBuilderTab.jsx` (tương tự CourseBuilderTab)

**UI Flow:**
```
Admin → Exam Management Page
  ↓
Click "Tạo bài thi mới"
  ↓
Mở Exam Builder Modal/Page
  ↓
Tab 1: Thông tin chi tiết bài thi
```

**State Management:**
```javascript
const [examInfo, setExamInfo] = useState({
  title: "",
  description: "",
  exam_type: "TOEIC", // Default
  total_duration: 120, // minutes
  difficulty_level: "MEDIUM", // Default
});
```

**Validation:**
```javascript
const validateExamInfo = (info) => {
  const errors = {};
  
  if (!info.title || info.title.trim().length === 0) {
    errors.title = "Tiêu đề bài thi là bắt buộc";
  }
  if (info.title && info.title.length > 255) {
    errors.title = "Tiêu đề không được vượt quá 255 ký tự";
  }
  
  if (!info.exam_type || !["TOEIC", "IELTS", "HSK", "THPT"].includes(info.exam_type)) {
    errors.exam_type = "Loại bài thi không hợp lệ";
  }
  
  if (!info.total_duration || info.total_duration <= 0) {
    errors.total_duration = "Thời gian làm bài phải lớn hơn 0";
  }
  
  if (!info.difficulty_level || !["EASY", "MEDIUM", "HARD"].includes(info.difficulty_level)) {
    errors.difficulty_level = "Mức độ khó không hợp lệ";
  }
  
  return errors;
};
```

---

### Bước 2: Chọn loại bài thi

**UI Component:**
- `frontend/Shopery/src/Admin/features/exams/components/CreateExam/ExamTypeSelectionModal.jsx` (tương tự LessonTypeSelectionModal)

**Các loại bài thi:**

#### 2.1. Listening & Reading
- **Mô tả**: Bài thi nghe và đọc hiểu
- **Part Types**: LISTENING, READING
- **Question Types**: MULTIPLE_CHOICE, FILL_BLANK, READING_COMPREHENSION
- **Có Choices**: Có (A, B, C, D)
- **Editor tương tự**: Có thể tái sử dụng editor từ course (part1-part7)

#### 2.2. Speaking
- **Mô tả**: Bài thi nói
- **Part Types**: SPEAKING
- **Question Types**: SPEAKING
- **Có Choices**: Không (trả lời bằng audio)
- **Editor riêng**: Cần tạo editor riêng cho Speaking

#### 2.3. Writing
- **Mô tả**: Bài thi viết
- **Part Types**: WRITING
- **Question Types**: WRITING
- **Có Choices**: Không (trả lời bằng text)
- **Editor riêng**: Cần tạo editor riêng cho Writing

**UI Flow:**
```
Sau khi nhập thông tin chi tiết
  ↓
Click "Tiếp theo" hoặc "Chọn loại bài thi"
  ↓
Mở ExamTypeSelectionModal
  ↓
Hiển thị 3 options:
  - Listening & Reading
  - Speaking
  - Writing
  ↓
User chọn loại bài thi
  ↓
Lưu vào state: selectedExamType
```

**State Management:**
```javascript
const [selectedExamType, setSelectedExamType] = useState(null);
// Values: "LISTENING_READING", "SPEAKING", "WRITING"

const EXAM_TYPES = [
  {
    id: "LISTENING_READING",
    name: "Listening & Reading",
    icon: HiBookOpen,
    description: "Bài thi nghe và đọc hiểu",
    partTypes: ["LISTENING", "READING"],
  },
  {
    id: "SPEAKING",
    name: "Speaking",
    icon: HiMicrophone,
    description: "Bài thi nói",
    partTypes: ["SPEAKING"],
  },
  {
    id: "WRITING",
    name: "Writing",
    icon: HiPencil,
    description: "Bài thi viết",
    partTypes: ["WRITING"],
  },
];
```

---

### Bước 3: Tạo nội dung cho bài thi

Sau khi chọn loại bài thi, bước tiếp theo là tạo nội dung (Part → Question → Choice).

#### 3.1. Tạo Part

**UI Component:**
- `frontend/Shopery/src/Admin/features/exams/components/CreateExam/PartEditor.jsx` (tương tự lesson editor)

**Flow tạo Part:**

```
Chọn loại bài thi
  ↓
Nếu là Listening & Reading:
  - Hiển thị danh sách Part có sẵn (Part 1-7 cho TOEIC)
  - Hoặc cho phép tạo Part mới
  ↓
Nếu là Speaking:
  - Hiển thị danh sách Part Speaking (Part 1-5 cho TOEIC)
  - Hoặc cho phép tạo Part mới
  ↓
Nếu là Writing:
  - Hiển thị danh sách Part Writing (Part 1-3 cho TOEIC)
  - Hoặc cho phép tạo Part mới
```

**Form tạo Part:**
```javascript
const [partData, setPartData] = useState({
  part_number: 1,
  part_name: "",
  part_type: "LISTENING", // hoặc READING, SPEAKING, WRITING
  question_count: 0, // Sẽ tự động tính khi tạo questions
  duration_minutes: 0,
  description: "",
  display_template: null, // Optional
});
```

**Validation Part:**
```javascript
const validatePart = (part) => {
  const errors = {};
  
  if (!part.part_name || part.part_name.trim().length === 0) {
    errors.part_name = "Tên Part là bắt buộc";
  }
  
  if (!part.part_type || !["LISTENING", "READING", "SPEAKING", "WRITING"].includes(part.part_type)) {
    errors.part_type = "Loại Part không hợp lệ";
  }
  
  if (part.duration_minutes < 0) {
    errors.duration_minutes = "Thời gian không được âm";
  }
  
  return errors;
};
```

#### 3.2. Tạo Questions cho Part

**UI Component:**
- `frontend/Shopery/src/Admin/features/exams/components/CreateExam/QuestionEditor.jsx`

**Tái sử dụng Editor từ Course:**

**Có thể tái sử dụng:**
- Editor cho Listening & Reading (part1-part7) từ course
- Logic tạo questions tương tự
- **Lưu ý**: Mục đích cuối cùng chỉ là lưu vào DB đúng format, không cần hiển thị giống course

**Không thể tái sử dụng:**
- Editor cho Speaking (cần editor riêng)
- Editor cho Writing (cần editor riêng)

**Flow tạo Questions:**

```
Chọn Part
  ↓
Click "Thêm câu hỏi" hoặc "Tạo nội dung Part"
  ↓
Mở QuestionEditor Modal
  ↓
Nếu là Listening & Reading:
  - Sử dụng editor tương tự course (ToeicPart1Editor, ToeicPart2Editor, ...)
  - Tạo questions với choices
  ↓
Nếu là Speaking:
  - Sử dụng SpeakingQuestionEditor
  - Tạo questions (không có choices)
  ↓
Nếu là Writing:
  - Sử dụng WritingQuestionEditor
  - Tạo questions (không có choices)
```

**State Management cho Questions:**
```javascript
// Listening & Reading
const [questions, setQuestions] = useState([]);
// Format tương tự course editor

// Speaking
const [speakingQuestions, setSpeakingQuestions] = useState([]);
// Format: [{ question_id, question_number, question_text, audio_file, transcript, ... }]

// Writing
const [writingQuestions, setWritingQuestions] = useState([]);
// Format: [{ question_id, question_number, question_text, image_file, ... }]
```

#### 3.3. Tạo Choices cho Questions (chỉ Listening & Reading)

**UI Component:**
- Tích hợp trong QuestionEditor (tương tự course editor)

**Flow tạo Choices:**

```
Tạo Question (Multiple Choice)
  ↓
Tự động tạo 4 choices (A, B, C, D)
  ↓
User nhập:
  - choice_text (cho mỗi choice)
  - choice_translation (optional)
  - choice_explanation (optional)
  - is_correct (chọn đáp án đúng)
```

**State Management cho Choices:**
```javascript
// Trong QuestionEditor
const [currentQuestion, setCurrentQuestion] = useState({
  question_id: "",
  question_number: 1,
  question_text: "",
  question_type: "MULTIPLE_CHOICE",
  audio_file: "",
  image_file: "",
  transcript: "",
  explanation: "",
  choices: [
    { choice_letter: "A", choice_text: "", is_correct: false },
    { choice_letter: "B", choice_text: "", is_correct: false },
    { choice_letter: "C", choice_text: "", is_correct: false },
    { choice_letter: "D", choice_text: "", is_correct: false },
  ],
});
```

**Validation Choices:**
```javascript
const validateChoices = (choices) => {
  const errors = {};
  
  // Phải có đúng 4 choices
  if (!choices || choices.length !== 4) {
    errors.choices = "Phải có đúng 4 đáp án (A, B, C, D)";
    return errors;
  }
  
  // Mỗi choice phải có text
  choices.forEach((choice, index) => {
    if (!choice.choice_text || choice.choice_text.trim().length === 0) {
      errors[`choice_${index}`] = `Đáp án ${choice.choice_letter} không được để trống`;
    }
  });
  
  // Phải có đúng 1 đáp án đúng
  const correctCount = choices.filter(c => c.is_correct).length;
  if (correctCount !== 1) {
    errors.correct_answer = "Phải có đúng 1 đáp án đúng";
  }
  
  return errors;
};
```

---

## 🔧 TÁI SỬ DỤNG EDITOR TỪ COURSE

### Có thể tái sử dụng

**Editor cho Listening & Reading (part1-part7):**

**Files có thể tái sử dụng:**
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart1Editor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart2Editor.jsx`
- ... (part3-part7)

**Cách tái sử dụng:**

1. **Tạo wrapper component mới:**
```javascript
// ExamPartEditor.jsx
import ToeicPart1Editor from "../../Lesson/Creators/editors/ToeicPart1Editor";

const ExamPartEditor = ({ partType, partNumber, data, onChange }) => {
  // Map data từ exam format sang lesson format
  const mapExamDataToLessonData = (examData) => {
    // Convert questions từ exam format → lesson format
    return {
      type: `toeic_part_${partNumber}`,
      questions: examData.questions.map(q => ({
        question_id: q.question_id,
        question_number: q.question_number,
        // ... map các fields khác
      })),
    };
  };
  
  // Map data từ lesson format sang exam format
  const mapLessonDataToExamData = (lessonData) => {
    // Convert questions từ lesson format → exam format
    return {
      questions: lessonData.questions.map(q => ({
        question_id: q.question_id,
        question_number: q.question_number,
        // ... map các fields khác
      })),
    };
  };
  
  const lessonData = mapExamDataToLessonData(data);
  
  const handleChange = (newLessonData) => {
    const examData = mapLessonDataToExamData(newLessonData);
    onChange(examData);
  };
  
  return <ToeicPart1Editor data={lessonData} onChange={handleChange} />;
};
```

2. **Lưu vào DB:**
```javascript
// Sau khi user tạo questions trong editor
// Map lại sang format exam và lưu vào DB
const saveQuestions = async (partId, questions) => {
  // questions từ editor (lesson format)
  // Map sang exam format
  const examQuestions = questions.map((q, index) => ({
    part_id: partId,
    question_number: index + 1,
    question_text: q.question_text || "",
    question_type: "MULTIPLE_CHOICE",
    audio_file: q.audio_file || "",
    image_file: q.image_file || "",
    transcript: q.transcript || "",
    explanation: q.explanation || "",
  }));
  
  // Lưu questions
  const savedQuestions = await Promise.all(
    examQuestions.map(q => Question.createQuestion(q))
  );
  
  // Lưu choices
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const savedQuestion = savedQuestions[i];
    
    const choices = question.choices.map(c => ({
      question_id: savedQuestion.question_id,
      choice_letter: c.choice_letter,
      choice_text: c.choice_text,
      choice_translation: c.choice_translation || "",
      choice_explanation: c.choice_explanation || "",
      is_correct: c.is_correct,
    }));
    
    await Choice.createChoices(savedQuestion.question_id, choices);
  }
};
```

### Không thể tái sử dụng

**Editor cho Speaking và Writing:**

Cần tạo editor riêng vì:
- Format dữ liệu khác (không có choices)
- UI/UX khác (không cần hiển thị giống course)
- Logic lưu vào DB khác

**Files cần tạo mới:**
- `frontend/Shopery/src/Admin/features/exams/components/CreateExam/SpeakingQuestionEditor.jsx`
- `frontend/Shopery/src/Admin/features/exams/components/CreateExam/WritingQuestionEditor.jsx`

---

## 💾 LƯU VÀO DATABASE

### Flow lưu toàn bộ bài thi

```
1. Lưu Test
   POST /admin/exams/tests
   Body: {
     title: "TOEIC Practice Test 1",
     description: "...",
     exam_type: "TOEIC",
     total_duration: 120,
     difficulty_level: "MEDIUM",
   }
   ↓
   Response: { test_id: 1 }
   
2. Lưu Parts
   POST /admin/exams/tests/:test_id/parts
   Body: {
     parts: [
       {
         part_number: 1,
         part_name: "Part 1: Picture Description",
         part_type: "LISTENING",
         duration_minutes: 5,
         description: "...",
       },
       // ... more parts
     ]
   }
   ↓
   Response: { parts: [{ part_id: 1, ... }, ...] }
   
3. Lưu Questions
   POST /admin/exams/parts/:part_id/questions
   Body: {
     questions: [
       {
         question_number: 1,
         question_text: "...",
         question_type: "MULTIPLE_CHOICE",
         audio_file: "...",
         image_file: "...",
         transcript: "...",
         explanation: "...",
       },
       // ... more questions
     ]
   }
   ↓
   Response: { questions: [{ question_id: 1, ... }, ...] }
   
4. Lưu Choices (chỉ cho Listening & Reading)
   POST /admin/exams/questions/:question_id/choices
   Body: {
     choices: [
       {
         choice_letter: "A",
         choice_text: "...",
         choice_translation: "...",
         choice_explanation: "...",
         is_correct: false,
       },
       // ... more choices (B, C, D)
     ]
   }
   ↓
   Response: { choices: [{ choice_id: 1, ... }, ...] }
```

### Backend Service

**File:**
- `backend/src/admin/services/examAdminService.js` (hoặc tương tự)

**Functions:**
```javascript
// 1. Tạo Test
async createTest(data) {
  const test = await Test.createTest({
    title: data.title,
    description: data.description,
    exam_type: data.exam_type,
    total_duration: data.total_duration,
    difficulty_level: data.difficulty_level,
    created_by: data.user_id,
  });
  
  return test;
}

// 2. Tạo Parts
async createParts(testId, partsData) {
  const parts = await Promise.all(
    partsData.map(partData => 
      Part.createPart({
        test_id: testId,
        part_number: partData.part_number,
        part_name: partData.part_name,
        part_type: partData.part_type,
        duration_minutes: partData.duration_minutes,
        description: partData.description,
        display_template: partData.display_template,
        question_count: 0, // Sẽ cập nhật sau khi tạo questions
      })
    )
  );
  
  return parts;
}

// 3. Tạo Questions
async createQuestions(partId, questionsData) {
  const questions = await Promise.all(
    questionsData.map(qData =>
      Question.createQuestion({
        part_id: partId,
        question_number: qData.question_number,
        question_text: qData.question_text,
        question_type: qData.question_type,
        audio_file: qData.audio_file || null,
        image_file: qData.image_file || null,
        transcript: qData.transcript || null,
        explanation: qData.explanation || null,
        grammar_notes: qData.grammar_notes || null,
      })
    )
  );
  
  // Cập nhật question_count trong Part
  await Part.updatePart(partId, {
    question_count: questions.length,
  });
  
  return questions;
}

// 4. Tạo Choices
async createChoices(questionId, choicesData) {
  const choices = await Promise.all(
    choicesData.map(cData =>
      Choice.createChoice({
        question_id: questionId,
        choice_letter: cData.choice_letter,
        choice_text: cData.choice_text,
        choice_translation: cData.choice_translation || null,
        choice_explanation: cData.choice_explanation || null,
        is_correct: cData.is_correct,
      })
    )
  );
  
  return choices;
}

// 5. Tạo toàn bộ bài thi (wrapper function)
async createFullExam(data) {
  const { testInfo, parts } = data;
  
  // 1. Tạo Test
  const test = await this.createTest(testInfo);
  
  // 2. Tạo Parts
  const createdParts = await this.createParts(test.test_id, parts);
  
  // 3. Tạo Questions và Choices cho mỗi Part
  for (const part of createdParts) {
    const partData = parts.find(p => p.part_number === part.part_number);
    
    if (partData.questions && partData.questions.length > 0) {
      // Tạo Questions
      const questions = await this.createQuestions(part.part_id, partData.questions);
      
      // Tạo Choices (chỉ cho Listening & Reading)
      if (part.part_type === "LISTENING" || part.part_type === "READING") {
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          const questionData = partData.questions[i];
          
          if (questionData.choices && questionData.choices.length > 0) {
            await this.createChoices(question.question_id, questionData.choices);
          }
        }
      }
    }
  }
  
  // 4. Cập nhật total_questions và total_parts trong Test
  const totalQuestions = createdParts.reduce((sum, part) => sum + part.question_count, 0);
  await Test.updateTest(test.test_id, {
    total_questions: totalQuestions,
    total_parts: createdParts.length,
  });
  
  return test;
}
```

---

## ✅ VALIDATION TỔNG HỢP

### Validation Test Info

```javascript
const validateTestInfo = (info) => {
  const errors = {};
  
  // Title
  if (!info.title || info.title.trim().length === 0) {
    errors.title = "Tiêu đề bài thi là bắt buộc";
  } else if (info.title.length > 255) {
    errors.title = "Tiêu đề không được vượt quá 255 ký tự";
  }
  
  // Exam Type
  const validExamTypes = ["TOEIC", "IELTS", "HSK", "THPT"];
  if (!info.exam_type || !validExamTypes.includes(info.exam_type)) {
    errors.exam_type = "Loại bài thi không hợp lệ";
  }
  
  // Total Duration
  if (!info.total_duration || info.total_duration <= 0) {
    errors.total_duration = "Thời gian làm bài phải lớn hơn 0";
  }
  
  // Difficulty Level
  const validDifficultyLevels = ["EASY", "MEDIUM", "HARD"];
  if (!info.difficulty_level || !validDifficultyLevels.includes(info.difficulty_level)) {
    errors.difficulty_level = "Mức độ khó không hợp lệ";
  }
  
  return errors;
};
```

### Validation Part

```javascript
const validatePart = (part) => {
  const errors = {};
  
  // Part Name
  if (!part.part_name || part.part_name.trim().length === 0) {
    errors.part_name = "Tên Part là bắt buộc";
  } else if (part.part_name.length > 100) {
    errors.part_name = "Tên Part không được vượt quá 100 ký tự";
  }
  
  // Part Type
  const validPartTypes = ["LISTENING", "READING", "SPEAKING", "WRITING"];
  if (!part.part_type || !validPartTypes.includes(part.part_type)) {
    errors.part_type = "Loại Part không hợp lệ";
  }
  
  // Duration
  if (part.duration_minutes < 0) {
    errors.duration_minutes = "Thời gian không được âm";
  }
  
  return errors;
};
```

### Validation Question

```javascript
const validateQuestion = (question, partType) => {
  const errors = {};
  
  // Question Text (optional cho một số loại)
  if (partType === "LISTENING" || partType === "READING") {
    // Question text có thể để trống nếu có audio/image
  } else if (partType === "SPEAKING" || partType === "WRITING") {
    if (!question.question_text || question.question_text.trim().length === 0) {
      errors.question_text = "Nội dung câu hỏi là bắt buộc";
    }
  }
  
  // Question Type
  const validQuestionTypes = [
    "MULTIPLE_CHOICE",
    "FILL_BLANK",
    "READING_COMPREHENSION",
    "SPEAKING",
    "WRITING",
  ];
  if (!question.question_type || !validQuestionTypes.includes(question.question_type)) {
    errors.question_type = "Loại câu hỏi không hợp lệ";
  }
  
  // Audio File (cho Listening/Speaking)
  if ((partType === "LISTENING" || partType === "SPEAKING") && !question.audio_file) {
    // Có thể optional tùy vào part cụ thể
  }
  
  // Image File (cho Part 1, Writing Part 1)
  if (partType === "LISTENING" && question.question_type === "MULTIPLE_CHOICE" && !question.image_file) {
    // Part 1 cần image
  }
  
  return errors;
};
```

### Validation Choices (chỉ cho Listening & Reading)

```javascript
const validateChoices = (choices) => {
  const errors = {};
  
  // Phải có đúng 4 choices
  if (!choices || !Array.isArray(choices) || choices.length !== 4) {
    errors.choices = "Phải có đúng 4 đáp án (A, B, C, D)";
    return errors;
  }
  
  // Mỗi choice phải có text
  choices.forEach((choice, index) => {
    if (!choice.choice_text || choice.choice_text.trim().length === 0) {
      errors[`choice_${index}`] = `Đáp án ${choice.choice_letter} không được để trống`;
    }
    
    // Choice letter phải là A, B, C, hoặc D
    if (!["A", "B", "C", "D"].includes(choice.choice_letter)) {
      errors[`choice_${index}_letter`] = `Đáp án ${choice.choice_letter} không hợp lệ`;
    }
  });
  
  // Phải có đúng 1 đáp án đúng
  const correctCount = choices.filter(c => c.is_correct === true).length;
  if (correctCount !== 1) {
    errors.correct_answer = "Phải có đúng 1 đáp án đúng";
  }
  
  return errors;
};
```

---

## 🎨 UI/UX FLOW

### Tổng quan UI Flow

```
1. Exam Management Page
   └─> Click "Tạo bài thi mới"
       └─> Exam Builder Modal/Page
           ├─> Tab 1: Thông tin chi tiết
           │   ├─> Form nhập: Title, Description, Exam Type, Duration, Difficulty
           │   └─> Button "Tiếp theo"
           │
           ├─> Tab 2: Chọn loại bài thi
           │   ├─> ExamTypeSelectionModal
           │   │   ├─> Option 1: Listening & Reading
           │   │   ├─> Option 2: Speaking
           │   │   └─> Option 3: Writing
           │   └─> Button "Tiếp theo"
           │
           └─> Tab 3: Tạo nội dung
               ├─> Part List (hiển thị các Part đã tạo)
               ├─> Button "Thêm Part"
               │   └─> Part Editor Modal
               │       ├─> Form nhập Part info
               │       └─> Button "Tạo Questions"
               │           └─> Question Editor Modal
               │               ├─> Nếu Listening & Reading:
               │               │   └─> Tái sử dụng editor từ course (part1-part7)
               │               ├─> Nếu Speaking:
               │               │   └─> SpeakingQuestionEditor
               │               └─> Nếu Writing:
               │                   └─> WritingQuestionEditor
               └─> Button "Lưu bài thi"
                   └─> API: POST /admin/exams/tests/full
                       └─> Lưu toàn bộ vào DB
```

### Component Structure

```
ExamBuilderTab.jsx
├─> ExamInfoForm.jsx (Tab 1)
├─> ExamTypeSelectionModal.jsx (Tab 2)
└─> ExamContentBuilder.jsx (Tab 3)
    ├─> PartList.jsx
    ├─> PartEditor.jsx
    └─> QuestionEditor.jsx
        ├─> ListeningReadingEditor.jsx (tái sử dụng từ course)
        ├─> SpeakingQuestionEditor.jsx (mới)
        └─> WritingQuestionEditor.jsx (mới)
```

---

## 📊 SO SÁNH VỚI COURSE FLOW

| Tiêu chí | Course | Assessment |
|----------|--------|------------|
| **Số loại** | 2 (Listening, Reading) | 3 (Listening & Reading, Speaking, Writing) |
| **Cấu trúc** | Course → Module → Lesson | Test → Part → Question → Choice |
| **Editor** | Lesson Editor (part1-part7) | Part Editor (có thể tái sử dụng) |
| **Lưu vào DB** | `lessons` table với `lesson_data` JSON | `tests`, `parts`, `questions`, `choices` tables |
| **Validation** | Validate `lesson_data` theo `lesson_type` | Validate từng bảng riêng biệt |
| **Hiển thị** | LessonComponentMapper | QuestionComponentMapper (khi làm bài) |

---

## 🔄 TÓM TẮT LUỒNG HOÀN CHỈNH

### Phase 1: Tạo Test Info

```
1. Admin mở Exam Builder
2. Nhập thông tin chi tiết:
   - Title: "TOEIC Practice Test 1"
   - Description: "..."
   - Exam Type: TOEIC
   - Total Duration: 120 minutes
   - Difficulty Level: MEDIUM
3. Validate các trường
4. Click "Tiếp theo"
```

### Phase 2: Chọn loại bài thi

```
1. Mở ExamTypeSelectionModal
2. Chọn loại bài thi:
   - Listening & Reading
   - Speaking
   - Writing
3. Lưu vào state: selectedExamType
4. Click "Tiếp theo"
```

### Phase 3: Tạo nội dung

```
1. Hiển thị Part List (rỗng ban đầu)
2. Click "Thêm Part"
3. Mở Part Editor Modal
4. Nhập thông tin Part:
   - Part Number: 1
   - Part Name: "Part 1: Picture Description"
   - Part Type: LISTENING (hoặc READING, SPEAKING, WRITING)
   - Duration: 5 minutes
5. Click "Tạo Questions"
6. Mở Question Editor Modal:
   
   Nếu Listening & Reading:
   - Tái sử dụng editor từ course (ToeicPart1Editor, ...)
   - Tạo questions với choices (A, B, C, D)
   
   Nếu Speaking:
   - Sử dụng SpeakingQuestionEditor
   - Tạo questions (không có choices)
   
   Nếu Writing:
   - Sử dụng WritingQuestionEditor
   - Tạo questions (không có choices)
   
7. Lưu Part và Questions vào state
8. Lặp lại cho các Part khác
9. Click "Lưu bài thi"
10. API: POST /admin/exams/tests/full
    - Lưu Test
    - Lưu Parts
    - Lưu Questions
    - Lưu Choices (nếu có)
```

---

## 📝 CHECKLIST IMPLEMENTATION

### ✅ Phase 1: Setup cơ bản

- [ ] Tạo ExamBuilderTab component
- [ ] Tạo ExamInfoForm component (Tab 1)
- [ ] Tạo ExamTypeSelectionModal component (Tab 2)
- [ ] Tạo ExamContentBuilder component (Tab 3)
- [ ] Tạo PartList component
- [ ] Tạo PartEditor component

### ✅ Phase 2: Editor cho Questions

- [ ] Tạo wrapper để tái sử dụng editor từ course (Listening & Reading)
- [ ] Tạo SpeakingQuestionEditor component
- [ ] Tạo WritingQuestionEditor component
- [ ] Tạo QuestionEditor component (router)

### ✅ Phase 3: Backend API

- [ ] Tạo route: POST /admin/exams/tests
- [ ] Tạo route: POST /admin/exams/tests/:test_id/parts
- [ ] Tạo route: POST /admin/exams/parts/:part_id/questions
- [ ] Tạo route: POST /admin/exams/questions/:question_id/choices
- [ ] Tạo route: POST /admin/exams/tests/full (wrapper)
- [ ] Tạo examAdminService với các functions:
  - createTest
  - createParts
  - createQuestions
  - createChoices
  - createFullExam

### ✅ Phase 4: Validation

- [ ] Validate Test Info
- [ ] Validate Part
- [ ] Validate Question
- [ ] Validate Choices (cho Listening & Reading)

### ✅ Phase 5: Testing

- [ ] Test tạo Test với Listening & Reading
- [ ] Test tạo Test với Speaking
- [ ] Test tạo Test với Writing
- [ ] Test validate các trường
- [ ] Test lưu vào DB đúng format
- [ ] Test load lại bài thi đã tạo

---

## 🎯 KẾT LUẬN

Luồng tạo mới bài thi (Assessment) tương tự như luồng tạo course, nhưng có một số điểm khác biệt:

1. **Cấu trúc dữ liệu**: Assessment sử dụng nhiều bảng (tests, parts, questions, choices) thay vì một bảng với JSON column như course
2. **Loại bài thi**: Assessment có 3 loại (Listening & Reading, Speaking, Writing) thay vì 2 loại như course
3. **Tái sử dụng editor**: Có thể tái sử dụng editor từ course cho Listening & Reading, nhưng cần tạo editor riêng cho Speaking và Writing
4. **Validation**: Validation phức tạp hơn vì phải validate nhiều bảng riêng biệt

**Mục đích cuối cùng**: Lưu vào database đúng format để hiển thị thành công khi học viên làm bài thi.

---

**Tài liệu được tạo:** `2024-12-XX`  
**Phiên bản:** `1.0.0`  
**Trạng thái:** ✅ Complete - Tài liệu phân tích đầy đủ luồng tạo mới Assessment

