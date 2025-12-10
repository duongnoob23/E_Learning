# 📚 Luồng Làm Bài Thi (Exam Flow)

## 🎯 Tổng Quan

Hệ thống exam hỗ trợ **4 kỹ năng** (Listening, Reading, Speaking, Writing) cho **2 loại bài thi** (TOEIC, IELTS) với cơ chế **map động** các component dựa trên loại bài thi và kỹ năng được chọn.

---

## 📋 Cấu Trúc Dữ Liệu

### 1. Database Models

```
Test (tests)
├── test_id (PK)
├── title
├── exam_type (ENUM: 'TOEIC', 'IELTS', 'HSK', 'THPT')
├── total_duration (minutes)
├── total_questions
└── total_parts

Part (parts)
├── part_id (PK)
├── test_id (FK → tests)
├── part_number (1, 2, 3, ...)
├── part_name
├── part_type (ENUM: 'LISTENING', 'READING', 'SPEAKING', 'WRITING')
├── question_count
└── duration_minutes

Question (questions)
├── question_id (PK)
├── part_id (FK → parts)
├── question_number
├── question_text
├── question_type (ENUM: 'MULTIPLE_CHOICE', 'FILL_BLANK', 'READING_COMPREHENSION')
├── audio_file (cho Listening/Speaking)
├── image_file (cho Part 1, Writing Part 1)
└── transcript

ExamSession (exam_sessions)
├── exam_session_id (PK)
├── user_id (FK → users)
├── test_id (FK → tests)
├── session_type (ENUM: 'FULL_TEST', 'PRACTICE', 'REVIEW')
├── selected_parts (JSON: [1, 2, 3, ...]) ← QUAN TRỌNG
├── status (ENUM: 'IN_PROGRESS', 'COMPLETED', 'ABANDONED')
└── start_time, end_time
```

### 2. Part Types theo Exam Type

#### TOEIC

- **Listening**: Part 1, 2, 3, 4
- **Reading**: Part 5, 6, 7
- **Speaking**: Part 1 (2 câu), Part 2 (2 câu), Part 3-5 (mỗi part 1 câu)
- **Writing**: Part 1 (5 câu), Part 2 (2 câu), Part 3 (1 câu)

#### IELTS

- **Listening**: Part 1, 2, 3, 4 (sẽ implement sau)
- **Reading**: Part 1, 2, 3 (sẽ implement sau)
- **Speaking**: (sẽ implement sau)
- **Writing**: (sẽ implement sau)

---

## 🔄 Luồng Hoạt Động

### Phase 1: Chọn Bài Thi

```
User → Assessment Page (/assessment)
  ↓
Xem danh sách tests (GET /exam/tests)
  ↓
Click vào test → ExamDetail Page (/exam/:id)
  ↓
Xem chi tiết test (GET /exam/tests/:test_id)
  ↓
Xem danh sách parts (GET /exam/tests/:test_id/parts)
  ↓
User chọn parts muốn làm (có thể chọn Listening, Reading, Speaking, Writing riêng hoặc kết hợp)
```

### Phase 2: Bắt Đầu Làm Bài

```
User click "Start Test"
  ↓
POST /exam/exam-sessions/start
Body: {
  test_id: 1,
  selected_parts: [1, 2, 3, 4],  // JSON array
  session_type: 'PRACTICE'
}
  ↓
Backend tạo ExamSession với selected_parts
  ↓
Navigate đến AssessmentTest component
State: {
  sessionData: { exam_session_id, test_id, selected_parts, ... },
  partData: [{ part_id, part_number, part_type, ... }]
}
```

### Phase 3: Render Component Động

```
AssessmentTest Component
  ↓
1. Detect examType (toeic/ielts)
   - Từ sessionData.exam_type
   - Hoặc parse từ test.title
   - Default: "toeic"
  ↓
2. Detect skill (listening/reading/speaking/writing/listening_reading/speaking_writing)
   - Từ partData[].part_type
   - Nếu tất cả parts là LISTENING → skill = "listening"
   - Nếu tất cả parts là READING → skill = "reading"
   - Nếu tất cả parts là SPEAKING → skill = "speaking"
   - Nếu tất cả parts là WRITING → skill = "writing"
   - Nếu có cả LISTENING và READING → skill = "listening_reading"
   - Nếu có cả SPEAKING và WRITING → skill = "speaking_writing"
  ↓
3. Parse selectedParts từ sessionData.selected_parts
   - JSON.parse(selected_parts) → [1, 2, 3, 4]
   - Fallback: lấy từ partData[].part_number
  ↓
4. Render TestHeader (động theo examType)
  ↓
5. Render Part Tabs (dựa trên selectedParts)
  ↓
6. Render Part Component (động theo examType + skill + partNumber)
   - getQuestionComponent(examType, skill, partNumber)
   - QuestionComponentMapper map → Component tương ứng
  ↓
7. Render QuestionNavigator (động theo skill)
```

---

## 🗺️ Component Mapping

### QuestionComponentMapper

File: `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/QuestionComponentMapper.jsx`

```javascript
COMPONENT_MAP = {
  toeic: {
    listening: {
      part1: TOEIC/Listening/Part1,
      part2: TOEIC/Listening/Part2,
      part3: TOEIC/Listening/Part3,
      part4: TOEIC/Listening/Part4,
    },
    reading: {
      part5: TOEIC/Reading/Part5,
      part6: TOEIC/Reading/Part6,
      part7: TOEIC/Reading/Part7,
    },
    speaking: {
      part1: TOEIC/Speaking/Part1,
      part2: TOEIC/Speaking/Part2,
      part3: TOEIC/Speaking/Part3,
      part4: TOEIC/Speaking/Part4,
      part5: TOEIC/Speaking/Part5,
    },
    writing: {
      part1: TOEIC/Writing/Part1,
      part2: TOEIC/Writing/Part2,
      part3: TOEIC/Writing/Part3,
    },
    listening_reading: {  // Backward compatibility
      part1-4: Listening components,
      part5-7: Reading components,
    },
    speaking_writing: {  // Backward compatibility
      part1-5: Speaking components,
      part1-3: Writing components,
    },
  },
  ielts: {
    // Sẽ implement sau
  },
}
```

### Logic Map Component

```javascript
function getQuestionComponent(examType, skill, partNumber) {
  const partKey = `part${partNumber}`;
  return COMPONENT_MAP[examType]?.[skill]?.[partKey];
}
```

---

## 🎨 Component Động

### 1. TestHeader

**File**: `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TestHeader.jsx`

**Hiện tại**: Hiển thị title cố định

```jsx
<TestHeader
  title={`TOEIC Test - Session ${sessionData?.exam_session_id}`}
  onExit={() => alert("Thoát khỏi bài kiểm tra")}
/>
```

**Cần thay đổi**:

- Title động theo `examType` và `skill`
- Ví dụ: "TOEIC Listening Test", "TOEIC Speaking Test", "IELTS Reading Test"
- Có thể thêm icon/color theo exam type

### 2. QuestionNavigator

**File**: `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/QuestionNavigator.jsx`

**Hiện tại**:

- Timer (chưa implement)
- Submit button
- Navigation grid hiển thị số câu hỏi

**Cần thay đổi theo skill**:

#### Listening/Reading:

- Grid hiển thị số câu hỏi (1, 2, 3, ...)
- Màu xanh nếu đã trả lời
- Click để jump đến câu hỏi

#### Speaking/Writing:

- Grid hiển thị số câu hỏi
- Check answer phức tạp hơn:
  - Speaking: có `recording` hoặc `notes` → đã trả lời
  - Writing: có `essay` (có nội dung) hoặc `notes` → đã trả lời
- Có thể hiển thị thêm indicator (🔴 recording, 📝 essay, 📌 notes)

### 3. Part Components

#### Listening/Reading Components

- **Input**: `choiceId` (primitive value)
- **Output**: `onAnswer(questionId, choiceId)`
- **State**: `answers[questionId] = choiceId`

#### Speaking Components

- **Input**: `{ recording: { blob, url, duration }, notes: string }`
- **Output**: `onAnswer(questionId, { recording, notes, type })`
- **State**: `answers[questionId] = { recording, notes }`
- **Layout**: Question (left) + Notes & Recorder (right)

#### Writing Components

- **Input**: `{ essay: string, notes: string }`
- **Output**: `onAnswer(questionId, { essay, notes, type })`
- **State**: `answers[questionId] = { essay, notes }`
- **Layout**: Question (left) + Notes & Essay Editor (right)

---

## 📊 Data Flow

### 1. Load Questions

```
AssessmentTest
  ↓
Render Part Component (e.g., TOEIC/Listening/Part1)
  ↓
Part Component gọi usePartQuestions(partId)
  ↓
GET /exam/parts/:part_id/questions
  ↓
Backend trả về questions với choices
  ↓
Part Component gọi onDataLoaded(partId, questions)
  ↓
AssessmentTest cập nhật questionsData[partNumber] = questions
  ↓
QuestionNavigator nhận partsSummary từ questionsData
```

### 2. Save Answers

#### Listening/Reading:

```
User chọn đáp án
  ↓
Part Component gọi onAnswer(questionId, choiceId)
  ↓
AssessmentTest: setAnswers({ ...prev, [questionId]: choiceId })
  ↓
QuestionNavigator hiển thị màu xanh cho câu đã trả lời
```

#### Speaking:

```
User ghi âm
  ↓
SpeakingPart: handleRecordStop(questionId, blob, duration)
  ↓
onAnswer(questionId, { recording: { blob, url, duration }, type: "recording" })
  ↓
AssessmentTest: setAnswers({ ...prev, [questionId]: { ...existing, recording } })
  ↓
User viết notes
  ↓
onAnswer(questionId, { notes: "text", type: "notes" })
  ↓
AssessmentTest: setAnswers({ ...prev, [questionId]: { ...existing, notes } })
```

#### Writing:

```
User viết essay
  ↓
WritingPart: handleEssayChange(questionId, essayText)
  ↓
onAnswer(questionId, { essay: essayText, type: "essay" })
  ↓
AssessmentTest: setAnswers({ ...prev, [questionId]: { ...existing, essay } })
```

### 3. Submit Exam

```
User click "NỘP BÀI"
  ↓
AssessmentTest: handleSubmit()
  ↓
1. Kiểm tra số câu chưa làm
2. Confirm nếu còn câu chưa làm
3. Transform answers thành format API:
   - Listening/Reading: { question_id, selected_choice_id }
   - Speaking/Writing: { question_id, recording_url, essay, notes }
  ↓
POST /exam/exam-sessions/:session_id/submit
Body: {
  answers: [
    { question_id: 1, selected_choice_id: 5 },
    { question_id: 2, selected_choice_id: null },
    ...
  ],
  examId: test_id
}
  ↓
Backend lưu UserAnswers
  ↓
Navigate đến ExamResult page
```

---

## 🔧 Các Điểm Cần Lưu Ý

### 1. Skill Detection Logic

**File**: `AssessmentTest.jsx` (lines 45-84)

```javascript
const skill = useMemo(() => {
  // Ưu tiên: Lấy từ partData[].part_type
  if (partData && Array.isArray(partData) && partData.length > 0) {
    const partTypes = [...new Set(partData.map((p) => p.part_type))];

    // Single skill
    if (partTypes.length === 1) {
      return partTypes[0].toLowerCase(); // "LISTENING" → "listening"
    }

    // Combined skills
    if (partTypes.includes("LISTENING") && partTypes.includes("READING")) {
      return "listening_reading";
    }
    if (partTypes.includes("SPEAKING") && partTypes.includes("WRITING")) {
      return "speaking_writing";
    }
  }

  return "listening_reading"; // Default
}, [partData]);
```

### 2. Part Number vs Part ID

- **Part Number**: Số thứ tự part trong test (1, 2, 3, ...)
- **Part ID**: Primary key trong database (part_id)

**Mapping**:

```javascript
// Tìm part_id từ part_number
const partId = partData.find((p) => p.part_number === partNumber)?.part_id;

// Tìm part_number từ part_id
const partNumber = partData.find((p) => p.part_id === partId)?.part_number;
```

**Lưu ý**: `selectedParts` trong `sessionData.selected_parts` là **part_number**, không phải part_id!

### 3. Answer State Structure

#### Listening/Reading:

```javascript
answers = {
  1: 5, // question_id: choice_id
  2: 3,
  3: null, // chưa trả lời
};
```

#### Speaking/Writing:

```javascript
answers = {
  1: {
    recording: { blob, url, duration },
    notes: "My notes...",
  },
  2: {
    essay: "My essay...",
    notes: "My notes...",
  },
  3: {
    notes: "Only notes, no recording/essay",
  },
};
```

### 4. QuestionNavigator Answer Check

**File**: `QuestionNavigator.jsx` (lines 80-97)

```javascript
const answer = answers[qid];
let answered = false;

if (answer) {
  if (typeof answer === "object") {
    // Speaking/Writing
    answered = !!(
      answer.recording ||
      (answer.essay && answer.essay.trim()) ||
      (answer.notes && answer.notes.trim()) ||
      answer.selected_choice_id
    );
  } else {
    // Listening/Reading
    answered = true;
  }
}
```

---

## 🚀 API Endpoints

### Test Management

- `GET /exam/tests` - Lấy danh sách tests
- `GET /exam/tests/:test_id` - Lấy chi tiết test
- `GET /exam/tests/:test_id/parts` - Lấy danh sách parts của test

### Part & Questions

- `GET /exam/parts/:part_id/questions` - Lấy danh sách questions của part

### Exam Session

- `POST /exam/exam-sessions/start` - Bắt đầu session
  ```json
  {
    "test_id": 1,
    "selected_parts": [1, 2, 3, 4],
    "session_type": "PRACTICE"
  }
  ```
- `POST /exam/exam-sessions/:session_id/submit` - Nộp bài
  ```json
  {
    "answers": [
      { "question_id": 1, "selected_choice_id": 5 },
      { "question_id": 2, "selected_choice_id": null }
    ],
    "examId": 1
  }
  ```
- `GET /exam/exam-sessions/:session_id/result` - Lấy kết quả
- `GET /exam/exam-sessions/:session_id/review` - Xem lại bài thi

### Speaking/Writing

- `POST /exam/speaking/upload` - Upload audio file
- `GET /exam/speaking/session/:session_id/responses` - Lấy responses
- `POST /exam/llmservice/score` - Chấm điểm (LLM)

---

## 📝 TODO / Cần Cải Thiện

### 1. TestHeader

- [ ] Thêm title động theo examType và skill
- [ ] Thêm icon/color theo exam type
- [ ] Thêm progress indicator

### 2. QuestionNavigator

- [ ] Implement timer countdown
- [ ] Auto-submit khi hết giờ
- [ ] Thêm indicator cho Speaking/Writing (🔴 recording, 📝 essay)
- [ ] Thêm review flag (đánh dấu câu cần xem lại)

### 3. Component Mapping

- [ ] Thêm IELTS components
- [ ] Thêm fallback component khi không tìm thấy
- [ ] Thêm error boundary

### 4. Data Persistence

- [ ] Auto-save answers (localStorage hoặc API)
- [ ] Restore answers khi reload page
- [ ] Handle network errors

### 5. Speaking/Writing

- [ ] Upload audio file khi submit
- [ ] Preview recording trước khi submit
- [ ] Word count validation cho Writing
- [ ] Duration validation cho Speaking

---

## 📚 File Structure

```
frontend/Shopery/src/Client/
├── pages/
│   └── Assessment/
│       └── Assessment.jsx          # Danh sách tests
│   └── Exam/
│       └── ExamDetail.jsx          # Chi tiết test
│
├── components/
│   └── AssessmentTest/
│       └── AssessmentTestJSX/
│           ├── AssessmentTest.jsx           # Component chính
│           ├── TestHeader.jsx               # Header (cần động)
│           ├── QuestionNavigator.jsx        # Navigator (cần động)
│           ├── QuestionComponentMapper.jsx  # Map component
│           └── TOEIC/
│               ├── Listening/
│               │   ├── Part1.jsx
│               │   ├── Part2.jsx
│               │   ├── Part3.jsx
│               │   └── Part4.jsx
│               ├── Reading/
│               │   ├── Part5.jsx
│               │   ├── Part6.jsx
│               │   └── Part7.jsx
│               ├── Speaking/
│               │   ├── SpeakingPart.jsx     # Component chung
│               │   ├── Part1.jsx
│               │   ├── Part2.jsx
│               │   ├── Part3.jsx
│               │   ├── Part4.jsx
│               │   ├── Part5.jsx
│               │   └── components/
│               │       ├── NotesAndRecorder.jsx
│               │       └── QuestionCard.jsx
│               └── Writing/
│                   ├── WritingPart.jsx      # Component chung
│                   ├── Part1.jsx
│                   ├── Part2.jsx
│                   └── Part3.jsx
│
├── services/
│   └── Assessment/
│       ├── assessmentQueries.js    # React Query hooks
│       └── assessmentMutations.js
│
└── api/
    └── Assessment/
        └── assessmentApi.js        # API calls
```

---

## 🎯 Kết Luận

Hệ thống exam sử dụng cơ chế **map động** để render component phù hợp với:

- **Exam Type**: TOEIC, IELTS
- **Skill**: Listening, Reading, Speaking, Writing
- **Part Number**: 1, 2, 3, ...

Các component **TestHeader** và **QuestionNavigator** cần được cập nhật để thay đổi theo loại bài thi và kỹ năng, đảm bảo trải nghiệm người dùng nhất quán và phù hợp với từng loại bài thi.
