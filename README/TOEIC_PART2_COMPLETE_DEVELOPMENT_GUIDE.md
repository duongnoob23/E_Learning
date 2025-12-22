# TOEIC Part 2 - Hướng dẫn phát triển hoàn chỉnh

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Luồng phát triển từ đầu đến cuối](#luồng-phát-triển-từ-đầu-đến-cuối)
3. [Các bước chi tiết](#các-bước-chi-tiết)
4. [Khác biệt với Part 1](#khác-biệt-với-part-1)
5. [Các lỗi thường gặp và cách fix](#các-lỗi-thường-gặp-và-cách-fix)
6. [Checklist khi phát triển Part 2](#checklist-khi-phát-triển-part-2)

---

## Tổng quan

File này mô tả **toàn bộ quá trình phát triển TOEIC Part 2** từ khi bắt đầu đến khi hoàn thiện.

**Điểm khác biệt chính với Part 1**:
- ❌ **KHÔNG có ảnh (image)** - Chỉ có audio và 3 đáp án
- ✅ **Chỉ có 3 đáp án** (A, B, C) thay vì 4 (A, B, C, D)
- ✅ **Có Transcript và Explanation** giống Part 1

**Mục đích**: Follow theo các bước đã được verify từ Part 1, chỉ điều chỉnh phần UI và data structure.

---

## Luồng phát triển từ đầu đến cuối

### Tổng quan luồng

```
1. Thêm option vào LessonTypeSelectionModal
   ↓
2. Tạo Editor component (ToeicPart2Editor.jsx)
   ↓
3. Tạo Preview trong Editor (KHÔNG có image)
   ↓
4. Tạo Client component (ToeicPart2.jsx) cho view lesson
   ↓
5. Update Database (ENUM lesson_type)
   ↓
6. Update Backend validation
   ↓
7. Update LessonComponentMapper
   ↓
8. Update CourseBuilderTab để load/save data
   ↓
9. Update CourseLessonsModal để hiển thị đúng
   ↓
10. Test toàn bộ flow: Create → Save → Edit → View
```

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:

1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_2",
  name: "TOEIC Part 2",
  icon: HiMicrophone, // hoặc icon phù hợp
  description: "Question-Response - Câu hỏi và đáp án",
}
```

**Lưu ý**:

- Không sửa logic hiện tại của các lesson types cũ
- Chỉ thêm mới vào array

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

### Bước 2: Tạo Editor component

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart2Editor.jsx`

**Cấu trúc cần có**:

#### 2.1. State management

```javascript
const [questions, setQuestions] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [showPreview, setShowPreview] = useState(false);
const [showImportJSON, setShowImportJSON] = useState(false);

// QUAN TRỌNG: Refs để quản lý load data
const isInitialMount = useRef(true);
const hasLoadedInitialData = useRef(false);
const prevDataRef = useRef(null); // Track data reference để detect lesson khác
```

#### 2.2. Helper functions

```javascript
// Tạo question rỗng - KHÔNG có imageUrl
function createEmptyQuestion() {
  const id = `toeic_p2_q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    audioUrl: "",
    // ❌ KHÔNG có imageUrl
    correctChoice: "A",
    // Transcript tiếng Anh cho từng đáp án (chỉ 3 đáp án)
    transcript: {
      A: "",
      B: "",
      C: "",
      // ❌ KHÔNG có D
    },
    // Giải thích tiếng Việt + dịch nghĩa từng đáp án (chỉ 3 đáp án)
    explanation: {
      A: "",
      B: "",
      C: "",
      // ❌ KHÔNG có D
      note: "",
    },
  };
}

// Map state → lesson_data (để save)
const mapStateToLessonData = useCallback((qs) => {
  return {
    type: "toeic_part_2",
    questions: qs.map((q, idx) => ({
      question_id: q.id,
      question_number: idx + 1,
      // ❌ KHÔNG có image_file
      audio_file: q.audioUrl || "",
      correct_choice: q.correctChoice || "A",
      transcript: {
        A: q.transcript?.A || "",
        B: q.transcript?.B || "",
        C: q.transcript?.C || "",
        // ❌ KHÔNG có D
      },
      explanation: {
        A: q.explanation?.A || "",
        B: q.explanation?.B || "",
        C: q.explanation?.C || "",
        // ❌ KHÔNG có D
        note: q.explanation?.note || "",
      },
    })),
  };
}, []);

// Map lesson_data → state (để load)
const mapLessonDataToState = useCallback((lessonData) => {
  const srcQuestions = Array.isArray(lessonData?.questions) ? lessonData.questions : [];
  if (!srcQuestions.length) return [createEmptyQuestion()];

  return srcQuestions.map((q, idx) => ({
    id: q.question_id || `toeic_p2_q_${idx}_${Date.now()}`,
    audioUrl: q.audio_file || "",
    // ❌ KHÔNG có imageUrl
    correctChoice: q.correct_choice || "A",
    transcript: {
      A: q.transcript?.A || "",
      B: q.transcript?.B || "",
      C: q.transcript?.C || "",
      // ❌ KHÔNG có D
    },
    explanation: {
      A: q.explanation?.A || "",
      B: q.explanation?.B || "",
      C: q.explanation?.C || "",
      // ❌ KHÔNG có D
      note: q.explanation?.note || "",
    },
  }));
}, []);
```

#### 2.3. Load initial data (QUAN TRỌNG - giống Part 1)

```javascript
useEffect(() => {
  // QUAN TRỌNG: Reset flag chỉ khi data reference thay đổi VÀ đã load rồi
  const dataReferenceChanged = prevDataRef.current !== data;

  // Chỉ reset flag khi:
  // 1. Data reference thay đổi (có thể là lesson khác)
  // 2. VÀ đã load rồi (không phải lần đầu mount)
  // 3. VÀ có questions trong data mới (không phải empty)
  if (
    dataReferenceChanged &&
    hasLoadedInitialData.current &&
    data?.questions &&
    Array.isArray(data.questions) &&
    data.questions.length > 0
  ) {
    // Kiểm tra xem có phải lesson khác không (so sánh question_id đầu tiên)
    const prevFirstQuestionId =
      prevDataRef.current?.questions?.[0]?.question_id;
    const currentFirstQuestionId = data.questions[0]?.question_id;

    // Nếu question_id đầu tiên khác, đó là lesson khác → reset flag
    if (prevFirstQuestionId !== currentFirstQuestionId) {
      console.log(
        "📌 ToeicPart2Editor - Different lesson detected, resetting load flag"
      );
      hasLoadedInitialData.current = false;
    }
  }

  // Lưu reference mới
  if (dataReferenceChanged) {
    prevDataRef.current = data;
  }

  // Chỉ load một lần khi có data và chưa load
  if (!hasLoadedInitialData.current) {
    if (
      data &&
      data.questions &&
      Array.isArray(data.questions) &&
      data.questions.length > 0
    ) {
      // Có data với questions - load data
      const initialQuestions = mapLessonDataToState(data);
      setQuestions(initialQuestions);
      setCurrentIndex(0);
      hasLoadedInitialData.current = true;
      isInitialMount.current = false;
    } else if (
      data &&
      (!data.questions ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0)
    ) {
      // Có data nhưng không có questions - tạo question mới
      const initialQuestions = mapLessonDataToState(data);
      setQuestions(initialQuestions);
      setCurrentIndex(0);
      hasLoadedInitialData.current = true;
      isInitialMount.current = false;
    } else if (!data && questions.length === 0) {
      // Không có data - tạo question mới
      setQuestions([createEmptyQuestion()]);
      setCurrentIndex(0);
      hasLoadedInitialData.current = true;
      isInitialMount.current = false;
    }
  }
  // QUAN TRỌNG: Chỉ depend vào data, không depend vào mapLessonDataToState
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]);
```

#### 2.4. Push change lên parent (giống Part 1)

```javascript
const pushChange = useCallback(
  (nextQuestions) => {
    if (isInitialMount.current) return; // Không push khi đang mount
    const lessonData = mapStateToLessonData(nextQuestions);
    onChange?.(lessonData);
  },
  [mapStateToLessonData, onChange]
);

// Debounce pushChange để tránh gọi liên tục
useEffect(() => {
  if (isInitialMount.current) return;
  const timer = setTimeout(() => {
    pushChange(questions);
  }, 150);
  return () => clearTimeout(timer);
  // QUAN TRỌNG: Chỉ depend vào questions, không depend vào pushChange
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [questions]);
```

#### 2.5. CRUD Questions (giống Part 1)

```javascript
// Thêm question mới
const handleAddQuestion = () => {
  setQuestions((prev) => {
    const next = [...prev, createEmptyQuestion()];
    // QUAN TRỌNG: Set currentIndex sau khi có questions mới, dùng prev.length
    setCurrentIndex(prev.length);
    return next;
  });
};

// Xóa question
const handleRemoveQuestion = (index) => {
  setQuestions((prev) => {
    const next = prev.filter((_, idx) => idx !== index);
    // Đảm bảo currentIndex không vượt quá length
    if (currentIndex >= next.length) {
      setCurrentIndex(Math.max(0, next.length - 1));
    }
    return next;
  });
};

// Update question hiện tại
const updateCurrentQuestion = (updater) => {
  setQuestions((prev) =>
    prev.map((q, idx) => (idx === currentIndex ? { ...q, ...updater(q) } : q))
  );
};
```

#### 2.6. Form UI trong Editor (KHÁC Part 1)

```javascript
// Chỉ có 2 columns: Audio + Options (KHÔNG có Image column)
<div className="toeic-p2-editor__form">
  {/* Left Column: Audio */}
  <div className="toeic-p2-editor__column">
    <label className="toeic-p2-editor__label">
      Audio (MP3) <span className="required">*</span>
    </label>
    <div className="toeic-p2-editor__field-group">
      <button
        type="button"
        className="toeic-p2-editor__btn"
        onClick={() => audioInputRefs.current[currentQuestion.id]?.click()}
      >
        Upload audio
      </button>
      <input
        type="file"
        ref={(el) => (audioInputRefs.current[currentQuestion.id] = el)}
        accept="audio/*"
        onChange={(e) => handleAudioFileChange(e)}
        style={{ display: "none" }}
      />
      <input
        type="text"
        className="toeic-p2-editor__input"
        placeholder="Hoặc dán URL audio..."
        value={currentQuestion.audioUrl}
        onChange={(e) =>
          updateCurrentQuestion((q) => ({ audioUrl: e.target.value }))
        }
      />
    </div>

    {/* Correct Answer Selection - Chỉ có 3 options */}
    <label className="toeic-p2-editor__label">
      Đáp án đúng <span className="required">*</span>
    </label>
    <div className="toeic-p2-editor__choices-row">
      {["A", "B", "C"].map((letter) => (
        <label key={letter} className="toeic-p2-editor__choice-radio">
          <input
            type="radio"
            name={`correct-${currentQuestion.id}`}
            checked={currentQuestion.correctChoice === letter}
            onChange={() =>
              updateCurrentQuestion((q) => ({ correctChoice: letter }))
            }
          />
          {letter}
        </label>
      ))}
    </div>

    {/* Transcript (EN) - Chỉ có 3 textareas */}
    <label className="toeic-p2-editor__label">Transcript (EN)</label>
    {["A", "B", "C"].map((letter) => (
      <div key={letter} className="toeic-p2-editor__field-group">
        <label className="toeic-p2-editor__sub-label">({letter})</label>
        <textarea
          className="toeic-p2-editor__textarea"
          placeholder={`Nội dung tiếng Anh cho đáp án ${letter}...`}
          value={currentQuestion.transcript?.[letter] || ""}
          onChange={(e) =>
            handleTranscriptChange(letter, e.target.value)
          }
        />
      </div>
    ))}
  </div>

  {/* Right Column: Explanation (KHÔNG có Image) */}
  <div className="toeic-p2-editor__column">
    {/* Answer Explanation (VI) - Chỉ có 3 textareas */}
    <label className="toeic-p2-editor__label">
      Giải thích đáp án (VI)
    </label>
    {["A", "B", "C"].map((letter) => (
      <div key={letter} className="toeic-p2-editor__field-group">
        <label className="toeic-p2-editor__sub-label">({letter})</label>
        <textarea
          className="toeic-p2-editor__textarea"
          placeholder={`Dịch nghĩa đáp án ${letter}...`}
          value={currentQuestion.explanation?.[letter] || ""}
          onChange={(e) =>
            handleExplanationChange(letter, e.target.value)
          }
        />
      </div>
    ))}

    {/* Note */}
    <label className="toeic-p2-editor__label">Ghi chú</label>
    <textarea
      className="toeic-p2-editor__textarea"
      placeholder="Giải thích thêm: tại sao đáp án đúng, lưu ý bẫy, v.v."
      value={currentQuestion.explanation?.note || ""}
      onChange={(e) =>
        updateCurrentQuestion((q) => ({
          explanation: { ...q.explanation, note: e.target.value },
        }))
      }
    />
  </div>
</div>
```

**Lưu ý quan trọng**:

- ✅ Luôn tạo object mới khi update (không mutate)
- ✅ Copy nested objects khi cần: `{ ...q.transcript }`
- ✅ Dùng callback trong `setState` để lấy giá trị mới nhất
- ❌ KHÔNG có imageUrl trong state và data structure
- ❌ KHÔNG có đáp án D (chỉ A, B, C)
- ❌ KHÔNG dùng `JSON.stringify` để so sánh trong useEffect
- ❌ KHÔNG reset `currentIndex` khi chỉ update nội dung

---

### Bước 3: Tạo CSS cho Editor

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart2Editor.css`

**Các phần cần có**:

- Tab navigation styles (giống Part 1)
- Form input styles (2 columns: Audio + Options | Explanation)
- Preview styles (KHÔNG có image, chỉ audio + 3 options)
- JSON import modal styles

**Lưu ý**: Preview phải giống với client view để admin thấy chính xác học viên sẽ thấy gì.

---

### Bước 4: Integrate Editor vào VisualEditor

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**Việc cần làm**:

```javascript
import ToeicPart2Editor from "./editors/ToeicPart2Editor";

// Trong switch case
case "toeic_part_2":
  return <ToeicPart2Editor data={data} onChange={onChange} />;
```

---

### Bước 5: Update LessonStudio để có default data

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`

**Việc cần làm**:

```javascript
function getDefaultData(lessonType) {
  const defaults = {
    // ... các types cũ
    toeic_part_1: {
      type: "toeic_part_1",
      questions: [],
    },
    toeic_part_2: {
      type: "toeic_part_2",
      questions: [],
    },
  };
  return defaults[lessonType] || {};
}
```

---

### Bước 6: Tạo Client component cho view lesson

**File**: `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart2.jsx`

**Cấu trúc**:

- Parse `lesson_data` từ prop `lesson`
- Hỗ trợ parse JSON string nếu cần
- Navigation với grid (như ảnh 2)
- Audio player
- **KHÔNG có Image** - Chỉ có 3 Options (A, B, C)
- Transcript & Explanation (ẩn/hiện khi check answer)
- Highlight correct/wrong answers

**Lưu ý**:

- Layout: Audio ở trên, 3 options ở dưới (KHÔNG có image)
- Transcript & Explanation ở ngay dưới options
- Navigation grid ở dưới cùng

**Code structure**:

```javascript
const CHOICE_LETTERS = ["A", "B", "C"]; // ❌ KHÔNG có D

// Parse questions từ lesson_data
let lessonData = lesson?.lesson_data;
if (lessonData && typeof lessonData === "string") {
  try {
    lessonData = JSON.parse(lessonData);
  } catch (e) {
    console.error("Error parsing lesson_data:", e);
    lessonData = null;
  }
}
const questions = lessonData?.questions || [];

// Render
<div className="toeic-p2-lesson__question">
  {/* Audio */}
  <div className="toeic-p2-lesson__audio-row">
    {currentQuestion.audio_file ? (
      <audio controls src={currentQuestion.audio_file} />
    ) : (
      <div className="toeic-p2-lesson__audio-placeholder">
        Chưa có audio cho câu này
      </div>
    )}
  </div>

  {/* Options - Chỉ có 3 options, KHÔNG có image */}
  <div className="toeic-p2-lesson__options">
    {CHOICE_LETTERS.map((letter) => {
      // ... render option
    })}
  </div>

  {/* Transcript & Explanation */}
  {hasChecked[currentQuestion.question_id] && (
    <div className="toeic-p2-lesson__footer">
      {/* Transcript */}
      {/* Explanation */}
    </div>
  )}
</div>
```

---

### Bước 7: Tạo CSS cho Client component

**File**: `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart2.css`

**Các phần cần có**:

- Header styles
- Navigation controls (prev/next, auto switch, grid) - giống Part 1
- Audio player styles
- **KHÔNG có image styles**
- Options layout (vertical, chỉ 3 options)
- Transcript & Explanation (50% mỗi phần)
- Highlight styles (correct/wrong)

**Layout structure**:

```css
.toeic-p2-lesson__question {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toeic-p2-lesson__audio-row {
  width: 100%;
  display: flex;
  justify-content: center;
}

.toeic-p2-lesson__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  /* KHÔNG có image column */
}

.toeic-p2-lesson__footer {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  margin-top: 16px;
}
```

---

### Bước 8: Integrate Client component vào LessonComponentMapper

**File**: `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

**Việc cần làm**:

```javascript
import ToeicPart2 from "./Toeic/ToeicPart2";

const LessonComponentMapper = {
  // ... các types cũ
  toeic_part_1: ToeicPart1,
  toeic_part_2: ToeicPart2,
};
```

---

### Bước 9: Update Database Schema

**File**: `backend/src/models/Lesson.js`

**Việc cần làm**:

```javascript
lesson_type: {
  type: DataTypes.ENUM(
    // ... các types cũ
    "toeic_part_1",
    "toeic_part_2",
    // ... các part khác
  ),
  allowNull: false,
}
```

**File**: `backend/database/migrations/add_toeic_parts_to_lesson_type.sql`

**Lưu ý**: Migration này đã có từ Part 1, chỉ cần đảm bảo `toeic_part_2` đã được thêm vào.

---

### Bước 10: Update Backend Validation

**File**: `backend/src/client/services/instructorClientService.js`

**Việc cần làm**:

```javascript
function validateLessonData(lessonType, lessonData) {
  // ... validation cho các types cũ

  const toeicTypes = [
    "toeic_part_1",
    "toeic_part_2",
    // ... các part khác
  ];

  if (toeicTypes.includes(lessonType)) {
    if (
      !lessonData ||
      !lessonData.questions ||
      !Array.isArray(lessonData.questions)
    ) {
      throw new Error(`${lessonType} requires lesson_data.questions array`);
    }
    if (lessonData.questions.length === 0) {
      throw new Error(`${lessonType} requires at least one question`);
    }
  }
}
```

---

### Bước 11: Update CourseBuilderTab để load/save data đúng

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`

**Lưu ý**: Không cần sửa gì, logic đã được implement cho Part 1 và sẽ hoạt động cho Part 2.

**Đảm bảo**:
- `handleEditLesson` parse `lesson_data` đúng
- `handleSaveLesson` lưu `lesson_data` đúng
- Match lesson bằng cả `id` và `lesson_id`

---

### Bước 12: Update LessonStudioModal để parse lesson_data

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`

**Lưu ý**: Không cần sửa gì, logic đã được implement cho Part 1 và sẽ hoạt động cho Part 2.

---

### Bước 13: Update CourseLessonsModal để hiển thị đúng

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CourseLessonsModal.jsx`

**Việc cần làm**:

#### 13.1. Update lessonTypeLabel

```javascript
const lessonTypeLabel = (type) => {
  const labels = {
    // ... các types cũ
    toeic_part_1: "TOEIC Part 1",
    toeic_part_2: "TOEIC Part 2",
    // ... các part khác
  };
  return labels[type] || "Lesson";
};
```

#### 13.2. Parse lesson_data trước khi render (đã có từ Part 1)

---

## Khác biệt với Part 1

### 1. Data Structure

**Part 1**:
```javascript
{
  id: "...",
  audioUrl: "",
  imageUrl: "", // ✅ Có image
  correctChoice: "A",
  transcript: { A: "", B: "", C: "", D: "" }, // 4 đáp án
  explanation: { A: "", B: "", C: "", D: "", note: "" },
}
```

**Part 2**:
```javascript
{
  id: "...",
  audioUrl: "",
  // ❌ KHÔNG có imageUrl
  correctChoice: "A",
  transcript: { A: "", B: "", C: "" }, // ❌ Chỉ 3 đáp án
  explanation: { A: "", B: "", C: "", note: "" }, // ❌ Chỉ 3 đáp án
}
```

### 2. UI Layout

**Part 1**:
- Audio ở trên
- Image + 4 Options ngang hàng
- Transcript & Explanation ở dưới

**Part 2**:
- Audio ở trên
- **Chỉ có 3 Options** (KHÔNG có image)
- Transcript & Explanation ở dưới

### 3. Editor Form

**Part 1**:
- Left column: Audio + Correct Choice + Transcript (4 textareas)
- Right column: Image + Explanation (4 textareas + note)

**Part 2**:
- Left column: Audio + Correct Choice + Transcript (3 textareas)
- Right column: Explanation (3 textareas + note) - **KHÔNG có Image**

### 4. Preview

**Part 1**:
- Audio → Image + 4 Options → Transcript & Explanation

**Part 2**:
- Audio → 3 Options → Transcript & Explanation

---

## Các lỗi thường gặp và cách fix

### ⚠️ Lưu ý: Tất cả các lỗi từ Part 1 đều áp dụng cho Part 2

Xem file `TOEIC_PART1_COMPLETE_DEVELOPMENT_GUIDE.md` để biết chi tiết:

1. **Dữ liệu không load lại khi edit** - Giải pháp giống Part 1
2. **Infinite loop khi load data** - Giải pháp giống Part 1
3. **State mutation** - Giải pháp giống Part 1
4. **Tạo câu hỏi mới bị nhảy về câu 1** - Giải pháp giống Part 1
5. **Sửa câu hỏi số 2 bị nhảy về câu 1** - Giải pháp giống Part 1
6. **Database error** - Giải pháp giống Part 1
7. **View lesson hiển thị sai component** - Giải pháp giống Part 1

### Lỗi đặc thù cho Part 2

#### Lỗi: Vô tình thêm imageUrl vào data structure

**Triệu chứng**: 
- Code có `imageUrl` trong state hoặc `image_file` trong `lesson_data`
- Gây confusion và có thể gây lỗi khi render

**Cách fix**: 
- ❌ KHÔNG thêm `imageUrl` vào `createEmptyQuestion()`
- ❌ KHÔNG thêm `image_file` vào `mapStateToLessonData()`
- ❌ KHÔNG render image trong preview và client component

#### Lỗi: Vô tình thêm đáp án D

**Triệu chứng**: 
- Code có đáp án D trong `CHOICE_LETTERS` hoặc trong `transcript`/`explanation`
- UI hiển thị 4 đáp án thay vì 3

**Cách fix**: 
- ✅ Chỉ dùng `["A", "B", "C"]` cho `CHOICE_LETTERS`
- ✅ Chỉ map A, B, C trong `transcript` và `explanation`
- ✅ Không render option D trong UI

---

## Checklist khi phát triển Part 2

### ✅ Phase 1: Setup cơ bản

- [ ] Thêm option vào `LessonTypeSelectionModal.jsx` (id: `toeic_part_2`, icon: `HiMicrophone`)
- [ ] Tạo Editor component (`ToeicPart2Editor.jsx`)
  - [ ] State management với `prevDataRef`
  - [ ] `createEmptyQuestion()` - **KHÔNG có imageUrl, chỉ 3 đáp án**
  - [ ] `mapStateToLessonData()` - **KHÔNG có image_file**
  - [ ] `mapLessonDataToState()` - **KHÔNG có imageUrl**
  - [ ] Load initial data với logic giống Part 1
  - [ ] Push change với debounce
  - [ ] CRUD Questions
- [ ] Tạo CSS cho Editor (`ToeicPart2Editor.css`)
  - [ ] Form layout: 2 columns (Audio + Options | Explanation)
  - [ ] **KHÔNG có image styles**
- [ ] Integrate vào `VisualEditor.jsx`
- [ ] Update `LessonStudio.jsx` - thêm default data

### ✅ Phase 2: Client component

- [ ] Tạo Client component (`ToeicPart2.jsx`)
  - [ ] Parse `lesson_data` (hỗ trợ JSON string)
  - [ ] Navigation với grid
  - [ ] Audio player
  - [ ] **Chỉ 3 Options (A, B, C)** - KHÔNG có image
  - [ ] Transcript & Explanation (ẩn/hiện)
  - [ ] Highlight correct/wrong
- [ ] Tạo CSS cho Client (`ToeicPart2.css`)
  - [ ] Layout: Audio → Options → Transcript & Explanation
  - [ ] **KHÔNG có image styles**
- [ ] Integrate vào `LessonComponentMapper.jsx`

### ✅ Phase 3: Database & Backend

- [ ] Update `backend/src/models/Lesson.js` - thêm `toeic_part_2` vào ENUM
- [ ] Đảm bảo migration SQL đã có `toeic_part_2`
- [ ] Update `backend/src/client/services/instructorClientService.js` - thêm `toeic_part_2` vào validation

### ✅ Phase 4: Admin integration

- [ ] Đảm bảo `CourseBuilderTab.jsx` đã parse và lưu `lesson_data` đúng (không cần sửa)
- [ ] Đảm bảo `LessonStudioModal.jsx` đã parse `lesson_data` đúng (không cần sửa)
- [ ] Update `CourseLessonsModal.jsx` - thêm label `toeic_part_2: "TOEIC Part 2"`

### ✅ Phase 5: Testing

- [ ] Test tạo mới lesson → Lưu → Dữ liệu được lưu đúng (KHÔNG có image_file)
- [ ] Test edit lesson → Dữ liệu được load đúng
- [ ] Test view lesson → Hiển thị đúng component (KHÔNG có image, chỉ 3 options)
- [ ] Test import JSON → Questions được import đúng
- [ ] Test thêm/xóa/sửa questions → Không bị mất dữ liệu
- [ ] Test navigation → Chuyển câu hỏi hoạt động đúng
- [ ] Test preview trong editor → Giống với view lesson (KHÔNG có image)
- [ ] **Verify**: Không có `imageUrl` hoặc `image_file` trong data
- [ ] **Verify**: Chỉ có 3 đáp án (A, B, C), không có D

### ✅ Phase 6: Fix các lỗi thường gặp

- [ ] Fix infinite loop (không dùng JSON.stringify)
- [ ] Fix load data khi edit (dùng prevDataRef và so sánh question_id)
- [ ] Fix state mutation (copy nested objects)
- [ ] Fix currentIndex nhảy về 0 (chỉ reset khi cần)
- [ ] **Verify**: Không có image trong code
- [ ] **Verify**: Chỉ có 3 đáp án

---

## Pattern chung (giống Part 1)

### 1. Editor Component Pattern

```javascript
// State
const [questions, setQuestions] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const isInitialMount = useRef(true);
const hasLoadedInitialData = useRef(false);
const prevDataRef = useRef(null);

// Load data với prevDataRef
useEffect(() => {
  const dataReferenceChanged = prevDataRef.current !== data;
  // Reset flag khi lesson khác
  // Load data khi chưa load
}, [data]);

// Push change với debounce
useEffect(() => {
  if (isInitialMount.current) return;
  const timer = setTimeout(() => pushChange(questions), 150);
  return () => clearTimeout(timer);
}, [questions]);
```

### 2. Client Component Pattern

```javascript
// Parse lesson_data
let lessonData = lesson?.lesson_data;
if (lessonData && typeof lessonData === "string") {
  try {
    lessonData = JSON.parse(lessonData);
  } catch (e) {
    lessonData = null;
  }
}
const questions = lessonData?.questions || [];
```

### 3. Data Structure Pattern

```javascript
// Part 2: KHÔNG có image
{
  type: "toeic_part_2",
  questions: [
    {
      question_id: "...",
      question_number: 1,
      audio_file: "...",
      // ❌ KHÔNG có image_file
      correct_choice: "A",
      transcript: { A: "...", B: "...", C: "..." }, // ❌ Chỉ 3
      explanation: { A: "...", B: "...", C: "...", note: "..." },
    },
  ],
}
```

---

## Kết luận

File này đã tổng hợp **toàn bộ quá trình phát triển TOEIC Part 2**, dựa trên Part 1 nhưng:

- ❌ **Loại bỏ hoàn toàn phần Image**
- ✅ **Chỉ có 3 đáp án** (A, B, C) thay vì 4
- ✅ **Giữ nguyên tất cả các pattern và best practices** từ Part 1

**Khi phát triển Part 2**: Follow theo checklist trên và đảm bảo không có image trong code.

---

## File liên quan

### Frontend

- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx` (không cần sửa)
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx` (không cần sửa)
- `frontend/Shopery/src/Admin/features/courses2/components/CourseLessonsModal.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart2Editor.jsx` ⭐ **MỚI**
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart2Editor.css` ⭐ **MỚI**
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart2.jsx` ⭐ **MỚI**
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart2.css` ⭐ **MỚI**
- `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

### Backend

- `backend/src/models/Lesson.js`
- `backend/src/client/services/instructorClientService.js`
- `backend/database/migrations/add_toeic_parts_to_lesson_type.sql` (đã có từ Part 1)

---

## Ngày tạo và cập nhật

- **Ngày tạo**: [Ngày hiện tại]
- **Phiên bản**: 1.0
- **Trạng thái**: 📝 Ready for implementation
- **Dựa trên**: TOEIC Part 1 (đã hoàn thành và verify)
- **Khác biệt chính**: ❌ Không có Image, ✅ Chỉ 3 đáp án (A, B, C)

