# TOEIC Speaking Exam Editor - Complete Development Guide

## Tổng quan

Tài liệu này mô tả chi tiết luồng tạo và chỉnh sửa nội dung cho **TOEIC Speaking Exam** trong hệ thống quản trị. Speaking Exam có cấu trúc khác với Listening/Reading Exam:

- **Số lượng Parts**: Tối đa **5 parts** (Part 1 → Part 5)
- **Số câu hỏi mỗi Part**:
  - Part 1: **2 câu hỏi**
  - Part 2: **2 câu hỏi**
  - Part 3: **1 câu hỏi**
  - Part 4: **1 câu hỏi**
  - Part 5: **1 câu hỏi**
- **Cấu trúc câu hỏi**: Mỗi câu hỏi chỉ có:
  - `question_text`: Nội dung câu hỏi (text)
  - Không có choices (không phải multiple choice)
  - Học viên sẽ thu âm câu trả lời

---

## 1. Cấu trúc dữ liệu

### 1.1. Database Schema

#### Table: `parts`

```sql
part_id (BIGINT, PK)
test_id (BIGINT, FK)
part_number (INTEGER) -- 1-5 cho Speaking
part_name (VARCHAR)
part_type (ENUM: 'LISTENING', 'READING', 'SPEAKING', 'WRITING')
duration_minutes (INTEGER)
```

#### Table: `questions`

```sql
question_id (BIGINT, PK)
part_id (BIGINT, FK)
question_number (INTEGER)
question_text (TEXT) -- Nội dung câu hỏi
question_type (ENUM: 'SPEAKING')
audio_file (VARCHAR) -- Optional: Sample audio
image_file (VARCHAR) -- Optional: Image for Part 2 (Describe Picture)
transcript (TEXT) -- Optional: Sample transcript
explanation (TEXT) -- Optional: Instructions/hints
```

**Lưu ý**: Speaking questions **KHÔNG có** table `choices` vì không phải multiple choice.

### 1.2. Data Structure trong Frontend

```javascript
// Part Data
{
  part_id: null, // null khi tạo mới
  part_number: 1, // 1-5
  part_name: "Part 1: Read a text aloud",
  part_type: "SPEAKING",
  duration_minutes: 45,
  questions: [
    {
      id: "speaking_p1_q1_...",
      question_number: 1,
      question_text: "The city's annual summer festival...",
      audio_file: "", // Optional
      image_file: "", // Optional (Part 2 only)
      transcript: "", // Optional
      explanation: "", // Optional
    },
    // Part 1 có 2 câu hỏi
  ]
}
```

---

## 2. Luồng tạo Speaking Exam

### 2.1. Bước 1: Tạo Exam cơ bản

1. Admin vào **Courses Page** → Click **"Create New Exam"**
2. Điền thông tin cơ bản:
   - Exam Name
   - Description
   - Duration
   - **Exam Type**: Chọn **"SPEAKING"**
3. Click **"Next"** → Chuyển sang tab **"Create Content"**

### 2.2. Bước 2: Chọn Exam Type Section

Trong tab **"Create Content"**:

- Admin thấy 3 options: **"Listening & Reading"**, **"Speaking"**, **"Writing"**
- Chọn **"Speaking"**

### 2.3. Bước 3: Tạo Parts (Tối đa 5 Parts)

#### 3.1. Auto-generate Part Structure

Khi admin click **"Add Part"**:

- Hệ thống **TỰ ĐỘNG** xác định Part tiếp theo:
  - Nếu chưa có Part nào → Tạo **Part 1**
  - Nếu đã có Part 1 → Tạo **Part 2**
  - ... → Tối đa **Part 5**
- **Không cho phép**:
  - Thêm Part trùng số
  - Thêm Part > 5
  - Thêm Part < 1

#### 3.2. Part Naming Convention

- **Part 1**: "Part 1: Read a text aloud"
- **Part 2**: "Part 2: Describe a picture"
- **Part 3**: "Part 3: Respond to questions"
- **Part 4**: "Part 4: Respond to questions using information provided"
- **Part 5**: "Part 5: Propose a solution"

#### 3.3. Part Editor Modal

Khi click **"Add Part"** hoặc **"Edit Part"**, mở modal `PartEditor`:

- **Part Number**: Auto-filled, readonly
- **Part Name**: Auto-filled dựa trên part_number
- **Part Type**: "SPEAKING" (readonly)
- **Duration (minutes)**: Input number
- **Button**: **"Add Questions"** → Mở `QuestionEditor`

### 2.4. Bước 4: Tạo Questions cho mỗi Part

#### 4.1. Question Editor Modal

Khi click **"Add Questions"** trong `PartEditor`, mở modal `QuestionEditor`:

- `QuestionEditor` nhận props:
  - `partType`: "SPEAKING"
  - `partNumber`: 1-5
  - `questions`: Array of questions
  - `onSave`: Callback khi save
  - `onCancel`: Callback khi cancel

#### 4.2. Routing trong QuestionEditor

```javascript
// QuestionEditor.jsx
const renderEditor = () => {
  if (partType === "SPEAKING") {
    switch (partNumber) {
      case 1:
        return (
          <ExamSpeakingPart1Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      case 2:
        return (
          <ExamSpeakingPart2Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      case 3:
        return (
          <ExamSpeakingPart3Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      case 4:
        return (
          <ExamSpeakingPart4Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      case 5:
        return (
          <ExamSpeakingPart5Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      default:
        return <div>Invalid Speaking Part</div>;
    }
  }
  // ... Listening/Reading, Writing
};
```

#### 4.3. Speaking Part Editor Components

Mỗi Part Editor (`ExamSpeakingPartXEditor`) có:

**Features chung:**

1. **Question Tabs**: Hiển thị danh sách câu hỏi dạng tabs
2. **Add/Remove Questions**:
   - Part 1, 2: Tối đa 2 câu, tối thiểu 2 câu
   - Part 3, 4, 5: Tối đa 1 câu, tối thiểu 1 câu
3. **Question Form**:
   - `question_text` (textarea, required)
   - `audio_file` (optional, cho Part 1, 3, 4, 5)
   - `image_file` (optional, chỉ Part 2)
   - `transcript` (optional)
   - `explanation` (optional)
4. **Preview Mode**:
   - Toggle preview để xem giao diện học viên
   - Hiển thị question text
   - Hiển thị textarea "Write notes / outline"
   - Hiển thị button "RECORD" (màu đỏ)
5. **JSON Import**:
   - Import câu hỏi từ JSON
   - Format JSON tương tự Listening/Reading nhưng không có choices

**Cấu trúc mỗi Editor:**

```javascript
// ExamSpeakingPart1Editor.jsx
export default function ExamSpeakingPart1Editor({ questions = [], onChange }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);

  // State management
  // Map state to exam data
  // Map exam data to state
  // Add/Remove questions (max 2, min 2)
  // Update question fields
  // JSON import
  // Preview mode

  return (
    <div className="exam-speaking-p1-editor">
      {/* Toolbar: Preview, Import JSON */}
      {/* Question Tabs */}
      {/* Question Form */}
      {/* Preview Modal */}
    </div>
  );
}
```

#### 4.4. Question Limits Validation

```javascript
// Part 1, 2: 2 questions required
const MAX_QUESTIONS_PART_1_2 = 2;
const MIN_QUESTIONS_PART_1_2 = 2;

// Part 3, 4, 5: 1 question required
const MAX_QUESTIONS_PART_3_4_5 = 1;
const MIN_QUESTIONS_PART_3_4_5 = 1;

function validateQuestionCount(partNumber, questionCount) {
  if (partNumber === 1 || partNumber === 2) {
    return (
      questionCount >= MIN_QUESTIONS_PART_1_2 &&
      questionCount <= MAX_QUESTIONS_PART_1_2
    );
  } else {
    return (
      questionCount >= MIN_QUESTIONS_PART_3_4_5 &&
      questionCount <= MAX_QUESTIONS_PART_3_4_5
    );
  }
}
```

---

## 3. Data Transformation

### 3.1. Map State to Exam Data

```javascript
const mapStateToExamData = useCallback((qs) => {
  return qs.map((q, idx) => ({
    question_id: q.id,
    question_number: q.question_number || idx + 1,
    question_text: q.question_text || "",
    question_type: "SPEAKING",
    audio_file: q.audio_file || "",
    image_file: q.image_file || "", // Only Part 2
    transcript: q.transcript || "",
    explanation: q.explanation || "",
    // NO choices array
  }));
}, []);
```

### 3.2. Map Exam Data to State

```javascript
const mapExamDataToState = useCallback(
  (examQuestions) => {
    if (!Array.isArray(examQuestions) || examQuestions.length === 0) {
      return [createEmptyQuestion()];
    }

    return examQuestions.map((q, idx) => ({
      id:
        q.question_id ||
        q.id ||
        `speaking_p${partNumber}_q${idx}_${Date.now()}`,
      question_number: q.question_number || idx + 1,
      question_text: q.question_text || "",
      audio_file: q.audio_file || "",
      image_file: q.image_file || "",
      transcript: q.transcript || "",
      explanation: q.explanation || "",
    }));
  },
  [partNumber]
);
```

---

## 4. Preview Mode

### 4.1. Preview Layout

Preview mode hiển thị giao diện giống học viên:

```
┌─────────────────────────────────────────────────┐
│ Part 1 - TOEIC Speaking                         │
├─────────────────────────────────────────────────┤
│ [Question Navigation: Q1] [Q2]                 │
├──────────────────────┬──────────────────────────┤
│ Question Content     │ Answer Section          │
│ (Left 65%)           │ (Right 35%)              │
│                      │                          │
│ ┌──────────────────┐ │ ┌──────────────────────┐ │
│ │ Question 1       │ │ │ 1                    │ │
│ │                  │ │ │                      │ │
│ │ The city's       │ │ │ [Write notes...]     │ │
│ │ annual summer    │ │ │                      │ │
│ │ festival...      │ │ │ [THU ÂM] (red btn)   │ │
│ └──────────────────┘ │ └──────────────────────┘ │
└──────────────────────┴──────────────────────────┘
```

### 4.2. Preview Components

- **QuestionCard**: Hiển thị `question_text`, `image_file` (nếu có)
- **NotesAndRecorder**:
  - Textarea "Write notes / outline"
  - Button "RECORD" (màu đỏ #f44336)
  - Không cần implement recording logic trong preview (chỉ UI)

---

## 5. JSON Import Format

### 5.1. JSON Structure

```json
[
  {
    "question_id": "speaking_p1_q1",
    "question_number": 1,
    "question_text": "The city's annual summer festival will take place next Saturday and Sunday. There will be activities that are fun for the whole family.",
    "audio_file": "https://example.com/audio.mp3",
    "transcript": "Sample transcript...",
    "explanation": "Instructions for students..."
  },
  {
    "question_id": "speaking_p1_q2",
    "question_number": 2,
    "question_text": "Another question text...",
    "audio_file": "",
    "transcript": "",
    "explanation": ""
  }
]
```

### 5.2. Import Logic

```javascript
const handleImportJSON = () => {
  if (!jsonInput.trim()) {
    setJsonError("Please enter JSON content.");
    return;
  }

  let jsonData;
  try {
    jsonData = JSON.parse(jsonInput);
  } catch (e) {
    setJsonError("JSON parsing error: " + e.message);
    return;
  }

  const arr = Array.isArray(jsonData) ? jsonData : [jsonData];

  // Validate question count
  const partNumber = /* current part number */;
  const maxQuestions = (partNumber === 1 || partNumber === 2) ? 2 : 1;

  if (arr.length > maxQuestions) {
    setJsonError(`This part can only have ${maxQuestions} question(s).`);
    return;
  }

  const mapped = arr.map((q, idx) => ({
    id: q.question_id || `speaking_p${partNumber}_q_${idx}_${Date.now()}`,
    question_number: q.question_number || idx + 1,
    question_text: q.question_text || "",
    audio_file: q.audio_file || "",
    image_file: q.image_file || "", // Only Part 2
    transcript: q.transcript || "",
    explanation: q.explanation || "",
  }));

  setCurrentQuestions(mapped);
  setCurrentIndex(0);
  setShowImportJSON(false);
  setJsonInput("");
  setJsonError(null);
};
```

---

## 6. Integration với ExamContentBuilder

### 6.1. Part Limit Validation

Trong `ExamContentBuilder.jsx`:

```javascript
const handleAddPart = () => {
  const examType = examInfo.exam_type_selected; // "SPEAKING"

  if (examType === "SPEAKING") {
    const existingParts = examInfo.parts.filter(
      (p) => p.part_type === "SPEAKING"
    );
    if (existingParts.length >= 5) {
      alert("Speaking exam can only have maximum 5 parts.");
      return;
    }

    // Auto-generate next part number
    const nextPartNumber = existingParts.length + 1;
    // Open PartEditor with part_number = nextPartNumber
  }
};
```

### 6.2. Part Auto-naming

```javascript
const getPartName = (partNumber, partType) => {
  if (partType === "SPEAKING") {
    const names = {
      1: "Part 1: Read a text aloud",
      2: "Part 2: Describe a picture",
      3: "Part 3: Respond to questions",
      4: "Part 4: Respond to questions using information provided",
      5: "Part 5: Propose a solution",
    };
    return names[partNumber] || `Part ${partNumber}`;
  }
  // ... other types
};
```

---

## 7. API Integration

### 7.1. Save Exam với Speaking Parts

Khi submit exam, payload gửi lên API:

```javascript
{
  test: {
    title: "TOEIC Speaking Test",
    description: "...",
    exam_type: "TOEIC",
    total_duration: 120,
    // ...
  },
  parts: [
    {
      part_number: 1,
      part_name: "Part 1: Read a text aloud",
      part_type: "SPEAKING",
      duration_minutes: 45,
      questions: [
        {
          question_number: 1,
          question_text: "The city's annual summer festival...",
          question_type: "SPEAKING",
          audio_file: "",
          transcript: "",
          explanation: "",
        },
        {
          question_number: 2,
          question_text: "Another question...",
          question_type: "SPEAKING",
          // ...
        },
      ],
    },
    // ... Part 2-5
  ],
}
```

### 7.2. API Endpoints

- `POST /api/admin/exams/create-full`: Tạo exam với parts và questions
- `GET /api/admin/exams/:testId/parts`: Lấy danh sách parts
- `GET /api/admin/exams/parts/:partId/questions`: Lấy danh sách questions của part

---

## 8. Component Files Structure

```
frontend/Shopery/src/Admin/features/courses/components/CreateExam/
├── QuestionEditor.jsx (Router)
├── PartEditor.jsx
├── editors/
│   ├── ExamSpeakingPart1Editor.jsx
│   ├── ExamSpeakingPart1Editor.css
│   ├── ExamSpeakingPart2Editor.jsx
│   ├── ExamSpeakingPart2Editor.css
│   ├── ExamSpeakingPart3Editor.jsx
│   ├── ExamSpeakingPart3Editor.css
│   ├── ExamSpeakingPart4Editor.jsx
│   ├── ExamSpeakingPart4Editor.css
│   ├── ExamSpeakingPart5Editor.jsx
│   └── ExamSpeakingPart5Editor.css
└── ...
```

---

## 9. Testing Checklist

- [ ] Tạo Speaking exam với đầy đủ 5 parts
- [ ] Part 1, 2: Thêm đúng 2 câu hỏi
- [ ] Part 3, 4, 5: Thêm đúng 1 câu hỏi
- [ ] Không cho thêm Part > 5
- [ ] Không cho thêm câu hỏi vượt quá giới hạn
- [ ] Preview mode hiển thị đúng giao diện
- [ ] JSON import hoạt động đúng
- [ ] Save exam thành công
- [ ] Load lại exam và edit questions
- [ ] Validation: question_text required

---

## 10. Notes

- Speaking questions **KHÔNG có choices**, chỉ có `question_text`
- Part 2 có thể có `image_file` (Describe Picture)
- Các Part khác có thể có `audio_file` (Sample audio)
- Preview mode chỉ hiển thị UI, không cần implement recording logic
- Tất cả text trong UI phải là **tiếng Anh**

---

## Kết luận

Tài liệu này mô tả đầy đủ luồng tạo Speaking Exam Editor với 5 parts, mỗi part có số câu hỏi giới hạn. Các editor components được thiết kế tương tự Listening/Reading editors nhưng đơn giản hơn (không có choices, chỉ có question_text và optional fields).
