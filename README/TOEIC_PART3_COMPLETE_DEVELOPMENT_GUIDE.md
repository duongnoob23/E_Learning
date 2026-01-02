# TOEIC Part 3 - Hướng dẫn phát triển hoàn chỉnh

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Luồng phát triển từ đầu đến cuối](#luồng-phát-triển-từ-đầu-đến-cuối)
3. [Các bước chi tiết](#các-bước-chi-tiết)
4. [Các lỗi thường gặp và cách fix](#các-lỗi-thường-gặp-và-cách-fix)
5. [Các lỗi AI hay mắc phải](#các-lỗi-ai-hay-mắc-phải)
6. [Checklist khi phát triển Part 3](#checklist-khi-phát-triển-part-3)

---

## Tổng quan

File này mô tả **toàn bộ quá trình phát triển TOEIC Part 3** từ khi bắt đầu đến khi hoàn thiện, bám sát pattern đã dùng cho Part 1.

**Đặc điểm riêng của Part 3**:

- Là **hội thoại** có audio.
- **Có câu hỏi text** (khác Part 2 là chỉ nghe và chọn).
- **Có 4 đáp án text**, mỗi đáp án có nội dung riêng.
- **Transcript (EN) + Dịch nghĩa (VI)**: luôn hiển thị (có thể thu gọn/mở rộng).
- **Giải thích đáp án**: chỉ hiển thị **sau khi bấm Check**, gồm:
  - Dịch 4 đáp án sang tiếng Việt.
  - Giải thích tại sao chọn đáp án đúng.

**Mục đích**: Khi phát triển hoặc sửa Part 3 (hoặc các Part tương tự), chỉ cần đọc file này và follow các bước đã được verify.

---

## Luồng phát triển từ đầu đến cuối

### Tổng quan luồng

```
1. Thêm option vào LessonTypeSelectionModal
   ↓
2. Tạo Editor component (ToeicPart3Editor.jsx)
   ↓
3. Tạo Preview trong Editor (flow check đáp án, transcript, giải thích)
   ↓
4. Tạo Client component (ToeicPart3.jsx) cho view lesson
   ↓
5. Tạo CSS cho Editor + Client (layout giống nhau)
   ↓
6. Update Database (ENUM lesson_type)
   ↓
7. Update Backend validation
   ↓
8. Update LessonComponentMapper
   ↓
9. Update CourseBuilderTab + LessonStudioModal để load/save data
   ↓
10. Update CourseLessonsModal để hiển thị đúng
   ↓
11. Test toàn bộ flow: Create → Save → Edit → View
```

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:

1. Import icon phù hợp (ví dụ `HiChatBubbleLeftRight`).
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**:

- Không sửa logic hiện tại của các lesson types cũ.
- Chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option "TOEIC Part 3".

---

### Bước 2: Thiết kế cấu trúc dữ liệu cho Part 3

Part 3 khác Part 1/2 ở chỗ có **câu hỏi text + 4 đáp án text + transcript/translation luôn hiển thị + giải thích chi tiết sau Check**.

**Shape `lesson_data` đề xuất**:

```json
{
  "type": "toeic_part_3",
  "questions": [
    {
      "question_id": "uuid-or-random",
      "question_number": 1,
      "audioUrl": "https://.../audio.mp3",
      "audio_file": null,
      "questionText": "What are the speakers discussing?",
      "options": [
        { "label": "A", "text": "Buying a laptop" },
        { "label": "B", "text": "Scheduling a meeting" },
        { "label": "C", "text": "Booking a flight" },
        { "label": "D", "text": "Ordering lunch" }
      ],
      "correctAnswer": "B",
      "transcript": "They talk about arranging a meeting next Monday...",
      "translation": "Họ trao đổi về việc sắp xếp một cuộc họp vào thứ Hai...",
      "explanation": "B đúng vì họ nhắc 'meeting' và chọn thời gian."
    }
  ]
}
```

**Nguyên tắc**:

- `question_number` luôn = `index + 1` khi map state → `lesson_data`.
- Khi **import JSON thêm câu hỏi**, câu mới phải có `question_number = last_question_number + 1`.
- Trong editor, có thể lưu thêm field tạm (như `audioFile` là `File`) nhưng **không push vào DB**.

---

### Bước 3: Tạo Editor component

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart3Editor.jsx`

#### 3.1. State management

Giống pattern Part 1, nhưng field khác:

```javascript
const [questions, setQuestions] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [showPreview, setShowPreview] = useState(false);
const [showImportJSON, setShowImportJSON] = useState(false);

// Preview state
const [previewSelectedChoice, setPreviewSelectedChoice] = useState(null);
const [hasChecked, setHasChecked] = useState(false);

// Refs quản lý load data
const isInitialMount = useRef(true);
const hasLoadedInitialData = useRef(false);
const prevDataRef = useRef(null);
```

#### 3.2. Helper: tạo question rỗng

```javascript
function createEmptyQuestion() {
  const id = `toeic_p3_q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    audioUrl: "",
    audioFile: null, // chỉ dùng trong editor
    questionText: "",
    options: [
      { label: "A", text: "" },
      { label: "B", text: "" },
      { label: "C", text: "" },
      { label: "D", text: "" },
    ],
    correctAnswer: "A",
    transcript: "",
    translation: "",
    explanation: "",
  };
}
```

#### 3.3. Map state ↔ lesson_data

```javascript
const mapStateToLessonData = useCallback((qs) => {
  return {
    type: "toeic_part_3",
    questions: qs.map((q, idx) => ({
      question_id: q.id,
      question_number: idx + 1,
      audio_file: q.audioUrl || "",
      questionText: q.questionText || "",
      options: (q.options || []).map((opt) => ({
        label: opt.label,
        text: opt.text || "",
      })),
      correctAnswer: q.correctAnswer || "A",
      transcript: q.transcript || "",
      translation: q.translation || "",
      explanation: q.explanation || "",
    })),
  };
}, []);

const mapLessonDataToState = useCallback((lessonData) => {
  const srcQuestions = Array.isArray(lessonData?.questions) ? lessonData.questions : [];
  if (!srcQuestions.length) return [createEmptyQuestion()];

  return srcQuestions.map((q, idx) => ({
    id: q.question_id || `toeic_p3_q_${idx}_${Date.now()}`,
    audioUrl: q.audio_file || "",
    audioFile: null,
    questionText: q.questionText || "",
    options: (q.options || [
      { label: "A" }, { label: "B" }, { label: "C" }, { label: "D" },
    ]).map((opt, i) => ({
      label: opt.label || ["A", "B", "C", "D"][i],
      text: opt.text || "",
    })),
    correctAnswer: q.correctAnswer || "A",
    transcript: q.transcript || "",
    translation: q.translation || "",
    explanation: q.explanation || "",
  }));
}, []);
```

#### 3.4. Load initial data (tránh loop, giống Part 1)

```javascript
useEffect(() => {
  const dataReferenceChanged = prevDataRef.current !== data;

  if (
    dataReferenceChanged &&
    hasLoadedInitialData.current &&
    data?.questions &&
    Array.isArray(data.questions) &&
    data.questions.length > 0
  ) {
    const prevFirstQuestionId = prevDataRef.current?.questions?.[0]?.question_id;
    const currentFirstQuestionId = data.questions[0]?.question_id;
    if (prevFirstQuestionId !== currentFirstQuestionId) {
      hasLoadedInitialData.current = false;
    }
  }

  if (dataReferenceChanged) {
    prevDataRef.current = data;
  }

  if (!hasLoadedInitialData.current) {
    if (data && Array.isArray(data.questions) && data.questions.length > 0) {
      const initialQuestions = mapLessonDataToState(data);
      setQuestions(initialQuestions);
      setCurrentIndex(0);
      setPreviewSelectedChoice(null);
      setHasChecked(false);
      hasLoadedInitialData.current = true;
      isInitialMount.current = false;
    } else if (!data && questions.length === 0) {
      setQuestions([createEmptyQuestion()]);
      setCurrentIndex(0);
      setPreviewSelectedChoice(null);
      setHasChecked(false);
      hasLoadedInitialData.current = true;
      isInitialMount.current = false;
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]);
```

#### 3.5. Push change với debounce

```javascript
const pushChange = useCallback(
  (nextQuestions) => {
    if (isInitialMount.current) return;
    const lessonData = mapStateToLessonData(nextQuestions);
    onChange?.(lessonData);
  },
  [mapStateToLessonData, onChange]
);

useEffect(() => {
  if (isInitialMount.current) return;
  const timer = setTimeout(() => {
    pushChange(questions);
  }, 150);
  return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [questions]);
```

#### 3.6. CRUD câu hỏi

```javascript
const handleAddQuestion = () => {
  setQuestions((prev) => {
    const next = [...prev, createEmptyQuestion()];
    setCurrentIndex(prev.length);
    return next;
  });
};

const handleRemoveQuestion = (index) => {
  setQuestions((prev) => {
    const next = prev.filter((_, idx) => idx !== index);
    if (currentIndex >= next.length) {
      setCurrentIndex(Math.max(0, next.length - 1));
    }
    return next;
  });
};

const updateCurrentQuestion = (updater) => {
  setQuestions((prev) =>
    prev.map((q, idx) => (idx === currentIndex ? { ...q, ...updater(q) } : q))
  );
};
```

#### 3.7. Preview logic (đặc trưng Part 3)

- Transcript + Translation:
  - Luôn hiển thị trong preview (có thể dùng accordion để thu gọn/mở rộng).
- Check answer:

```javascript
const handlePreviewSelect = (label) => {
  if (hasChecked) return; // Nếu muốn khóa sau khi check
  setPreviewSelectedChoice(label);
};

const handleCheckAnswer = () => {
  if (!previewSelectedChoice) return;
  setHasChecked(true);
};

const handleClearPreview = () => {
  setPreviewSelectedChoice(null);
  setHasChecked(false);
};
```

**Highlight**:

- Nếu `hasChecked`:
  - Option đúng: nền xanh.
  - Option được chọn nhưng sai: nền đỏ.

---

### Bước 4: Tạo CSS cho Editor

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart3Editor.css`

**Các phần cần có**:

- Tab navigation (reuse từ Part 1: bo tròn, padding, nút x tròn).
- Form layout: audio + question + 4 options + transcript + translation + explanation.
- Preview layout:
  - Audio trên cùng.
  - Question + options bên dưới.
  - Transcript + Translation block dưới options.
  - Explanation block dưới cùng, chỉ hiển thị khi `hasChecked`.

**Lưu ý**:

- Có thể copy CSS từ `ToeicPart1Editor.css` / `ToeicPart2Editor.css`, bỏ phần image.
- Đảm bảo preview trong Editor giống với Client view (ToeicPart3.jsx).

---

### Bước 5: Integrate Editor vào VisualEditor

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

```javascript
import ToeicPart3Editor from "./editors/ToeicPart3Editor";

// ...
case "toeic_part_3":
  return <ToeicPart3Editor data={data} onChange={onChange} />;
```

---

### Bước 6: Thêm default data cho Part 3

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`

```javascript
function getDefaultData(lessonType) {
  const defaults = {
    // ... các types cũ
    toeic_part_3: {
      type: "toeic_part_3",
      questions: [],
    },
  };
  return defaults[lessonType] || {};
}
```

---

### Bước 7: Tạo Client component cho view lesson

**File**: `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart3.jsx`

**Cấu trúc**:

- Parse `lesson.lesson_data`:

```javascript
let lessonData = lesson?.lesson_data;
if (lessonData && typeof lessonData === "string") {
  try {
    lessonData = JSON.parse(lessonData);
  } catch {
    lessonData = null;
  }
}
const questions = lessonData?.questions || [];
```

- State:
  - `currentIndex`, `selectedChoice`, `hasChecked`.
- UI:
  - Audio player trên cùng.
  - Question text.
  - 4 options text (buttons).
  - Transcript (EN) + Translation (VI) luôn hiển (accordion optional).
  - Explanation chỉ hiển thị khi `hasChecked`.
  - Navigation: Prev/Next, Auto-switch, grid số câu (có thể reuse Part 1).

**Lưu ý**:

- Layout và màu sắc nên match với preview trong Editor.

---

### Bước 8: Tạo CSS cho Client component

**File**: `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart3.css`

**Các phần cần có**:

- Header + title.
- Navigation controls (prev/next, auto switch, grid).
- Audio player styles.
- Question + options layout.
- Transcript + Translation block (luôn hiện).
- Explanation block (ẩn/hiện).
- Highlight correct/wrong (sau Check).

---

### Bước 9: Integrate Client component vào LessonComponentMapper

**File**: `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

```javascript
import ToeicPart3 from "./Toeic/ToeicPart3";

const LessonComponentMapper = {
  // ... các types cũ
  toeic_part_3: ToeicPart3,
};
```

---

### Bước 10: Update Database Schema

**File**: `backend/src/models/Lesson.js`

```javascript
lesson_type: {
  type: DataTypes.ENUM(
    // ... các types cũ
    "toeic_part_1",
    "toeic_part_2",
    "toeic_part_3",
    // ... các part khác
  ),
  allowNull: false,
}
```

**File**: `backend/database/migrations/add_toeic_parts_to_lesson_type.sql`

```sql
ALTER TABLE lessons
MODIFY COLUMN lesson_type ENUM(
  -- ... các types cũ
  'toeic_part_1',
  'toeic_part_2',
  'toeic_part_3'
  -- ... các part khác
) NOT NULL;
```

---

### Bước 11: Update Backend Validation

**File**: `backend/src/client/services/instructorClientService.js`

```javascript
function validateLessonData(lessonType, lessonData) {
  // ... validation cho các types cũ

  const toeicTypes = [
    "toeic_part_1",
    "toeic_part_2",
    "toeic_part_3",
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

### Bước 12: Update CourseBuilderTab để load/save Part 3 đúng

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`

- **handleEditLesson**: parse `lesson.lesson_data` nếu là string (re-use pattern Part 1).
- **handleSaveLesson**: khi update/insert lesson, đảm bảo:
  - `lessonType` / `lesson_type` = `"toeic_part_3"`.
  - `lesson_data` lấy từ `lessonData.lesson_data`, không fallback lung tung.

---

### Bước 13: Update LessonStudioModal để parse lesson_data

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`

- Khi mở modal (`open === true`), nếu có `initialData.lesson_data` là string → `JSON.parse` trước khi set vào state.
- Logic giống y Part 1, không cần sáng tạo thêm.

---

### Bước 14: Update CourseLessonsModal để view đúng Part 3

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CourseLessonsModal.jsx`

- **lessonTypeLabel**: thêm mapping:

```javascript
toeic_part_3: "TOEIC Part 3",
```

- Trước khi render `LessonContent`, parse `lesson_data` (nếu là string) rồi pass vào `LessonComponentMapper` → sẽ tự render `ToeicPart3`.

---

## Các lỗi thường gặp và cách fix

### Lỗi 1: Dữ liệu Part 3 không load lại khi edit

**Triệu chứng**:

- Tạo Part 3 → Lưu → bấm Edit lại → mất dữ liệu câu hỏi.

**Nguyên nhân**:

- Không dùng `hasLoadedInitialData` + `prevDataRef` đúng pattern như Part 1.
- `lesson_data` là string nhưng không parse khi mở modal.

**Cách fix**:

- Dùng nguyên pattern load data của `ToeicPart1Editor.jsx`.
- Đảm bảo `CourseBuilderTab` + `LessonStudioModal` luôn parse `lesson_data` trước khi pass xuống editor.

---

### Lỗi 2: Infinite loop khi load lesson_data

**Triệu chứng**:

- Console log chạy liên tục, UI lag nặng.

**Nguyên nhân**:

- Dùng `JSON.stringify` để so sánh `data`.
- `pushChange` gọi trong lần mount đầu.

**Cách fix**:

- Không dùng `JSON.stringify` trong `useEffect`.
- Chỉ kiểm tra reference (`prevDataRef.current !== data`) và/hoặc `question_id`.
- Trong `pushChange`, bỏ qua nếu `isInitialMount.current === true`.

---

### Lỗi 3: Các câu hỏi bị dính state với nhau

**Triệu chứng**:

- Sửa option hoặc explanation của câu này, câu khác cũng bị thay đổi.

**Nguyên nhân**:

- Không copy nested objects (`options`) khi update.

**Cách fix**:

```javascript
const handleOptionChange = (label, value) => {
  updateCurrentQuestion((q) => ({
    options: (q.options || []).map((opt) =>
      opt.label === label ? { ...opt, text: value } : opt
    ),
  }));
};
```

- Luôn tạo object/array mới khi update state.

---

### Lỗi 4: Import JSON nhưng numbering bị sai

**Triệu chứng**:

- Import thêm câu hỏi Part 3 → số câu không nối tiếp, hoặc bị reset về 1.

**Nguyên nhân**:

- Lưu `question_number` cứng từ JSON import mà không tính theo `idx + 1`.

**Cách fix**:

- Khi map state → `lesson_data`, **luôn** set:

```javascript
question_number: idx + 1;
```

---

### Lỗi 5: Transcript/Dịch nghĩa bị ẩn giống Part 1

**Triệu chứng**:

- Transcript/translation chỉ hiện sau khi Check, giống pattern Part 1.

**Nguyên nhân**:

- Copy logic ẩn/hiện từ Part 1 mà không chỉnh cho Part 3.

**Cách fix**:

- Với Part 3, transcript + translation:
  - Luôn hiển thị trong UI.
  - Có thể cho vào accordion để collapse, nhưng **default là open**.
- Explanation mới là phần gắn với nút Check.

---

## Các lỗi AI hay mắc phải

1. **Dùng lại y nguyên logic Part 1**:
   - Ẩn transcript/explanation, chỉ hiện sau Check → sai với yêu cầu Part 3.
2. **Không định nghĩa câu hỏi text & đáp án text rõ ràng**:
   - Trộn logic Part 2 (chỉ A/B/C) với Part 3.
3. **Không tách bạch transcript vs explanation**:
   - Dùng chung field cho transcript + giải thích → khó dùng lại sau.
4. **Không parse lesson_data từ JSON string**:
   - Dẫn tới editor mở ra trống, view lesson không hiển thị gì.
5. **Quên thêm ENUM toeic_part_3**:
   - Gặp lỗi “Data truncated for column 'lesson_type'”.

Tất cả các lỗi trên đều đã có pattern fix từ Part 1, chỉ cần áp dụng đúng.

---

## Checklist khi phát triển Part 3

### ✅ Phase 1: Setup cơ bản

- [ ] Thêm option Part 3 vào `LessonTypeSelectionModal.jsx`.
- [ ] Tạo `ToeicPart3Editor.jsx`.
- [ ] Tạo `ToeicPart3Editor.css`.
- [ ] Integrate Editor vào `VisualEditor.jsx`.
- [ ] Thêm default data cho `toeic_part_3` trong `LessonStudio.jsx`.

### ✅ Phase 2: Client component

- [ ] Tạo `ToeicPart3.jsx`.
- [ ] Tạo `ToeicPart3.css`.
- [ ] Integrate vào `LessonComponentMapper.jsx`.

### ✅ Phase 3: Database & Backend

- [ ] Thêm `toeic_part_3` vào ENUM trong `backend/src/models/Lesson.js`.
- [ ] Cập nhật migration SQL (`add_toeic_parts_to_lesson_type.sql`).
- [ ] Update `validateLessonData` trong `instructorClientService.js`.

### ✅ Phase 4: Admin integration

- [ ] `CourseBuilderTab.jsx` – `handleEditLesson` parse `lesson_data`.
- [ ] `CourseBuilderTab.jsx` – `handleSaveLesson` lưu đúng `lesson_data`.
- [ ] `LessonStudioModal.jsx` – parse `lesson_data` từ string JSON.
- [ ] `CourseLessonsModal.jsx` – label & parse `lesson_data`, render đúng Part 3.

### ✅ Phase 5: Testing

- [ ] Test tạo mới Part 3 → Lưu → Edit lại → Dữ liệu đầy đủ.
- [ ] Test view lesson → Audio, question, options, transcript/translation, explanation hiển thị đúng.
- [ ] Test Check/Reset đáp án → highlight đúng/sai, explanation chỉ sau Check.
- [ ] Test import JSON → câu hỏi nối tiếp, numbering chuẩn.
- [ ] Test navigation nhiều câu → Prev/Next, grid số câu (nếu dùng).

---

## File liên quan

### Frontend

- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CourseLessonsModal.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart3Editor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart3Editor.css`
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart3.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart3.css`
- `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

### Backend

- `backend/src/models/Lesson.js`
- `backend/src/client/services/instructorClientService.js`
- `backend/database/migrations/add_toeic_parts_to_lesson_type.sql`

---

## Ngày tạo và cập nhật

- **Ngày tạo**: [Ngày hiện tại]
- **Phiên bản**: 1.0
- **Trạng thái**: ✅ Complete - Flow Part 3 bám sát pattern Part 1, đã chuẩn hóa để tái sử dụng

