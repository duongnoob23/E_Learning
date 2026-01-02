# TOEIC Part 7 - Hướng dẫn phát triển hoàn chỉnh

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Luồng phát triển từ đầu đến cuối](#luồng-phát-triển-từ-đầu-đến-cuối)
3. [Các bước chi tiết](#các-bước-chi-tiết)
4. [Các lỗi thường gặp và cách fix](#các-lỗi-thường-gặp-và-cách-fix)
5. [Các lỗi AI hay mắc phải](#các-lỗi-ai-hay-mắc-phải)
6. [Checklist khi phát triển Part 7](#checklist-khi-phát-triển-part-7)

---

## Tổng quan

File này mô tả **toàn bộ quá trình phát triển TOEIC Part 7** (Reading Comprehension) từ đầu đến cuối, bám sát pattern đã dùng cho Part 1-6.

**Đặc điểm riêng của Part 7**:

- Mỗi câu hỏi có **một đoạn văn tiếng Anh dài (reading passage)**.
- Một **câu hỏi text** và **4 đáp án text (A/B/C/D)**.
- **Phần dịch nghĩa** (dịch toàn bộ đoạn văn) - luôn hiển thị (có thể ẩn/hiện bằng dropdown).
- Khi bấm **Kiểm tra đáp án**:
  - Highlight đúng/sai.
  - Hiển thị **giải thích đáp án**.
  - Giải thích sẽ **dịch 4 đáp án** và giải thích tại sao chọn đáp án nào, vì sao.
- **Không có audio, không có image, không có transcript**.
- Layout: 2 cột - Trái: Reading passage + Translation, Phải: Câu hỏi + Đáp án + Explanation.

**Khác biệt với Part 6**:

- Part 6: Đoạn văn có placeholder "**\_**" và điền từ vào chỗ trống.
- Part 7: Đoạn văn đầy đủ, đọc hiểu và trả lời câu hỏi.

---

## Luồng phát triển từ đầu đến cuối

### Tổng quan luồng

```
1. Thêm option vào LessonTypeSelectionModal
   ↓
2. Tạo Editor component (ToeicPart7Editor.jsx) + CSS
   ↓
3. Tạo Client component (ToeicPart7.jsx) + CSS
   ↓
4. VisualEditor: map type → editor
   ↓
5. LessonComponentMapper: map type → viewer
   ↓
6. LessonStudio/default data: thêm toeic_part_7
   ↓
7. CourseBuilderTab & LessonStudioModal: parse/stringify lesson_data
   ↓
8. Backend: ENUM lesson_type + validate lesson_data
   ↓
9. Migration DB: thêm toeic_part_7 (nếu chưa)
   ↓
10. Test: Create → Save → Edit → View; Check/Reset; import JSON
```

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:

- Thêm item:

```javascript
{
  id: "toeic_part_7",
  name: "TOEIC Part 7",
  icon: HiBookOpen, // hoặc icon phù hợp
  description: "Reading Comprehension - Đọc hiểu",
}
```

---

### Bước 2: Thiết kế dữ liệu Part 7

Shape `lesson_data` đề xuất:

```json
{
  "type": "toeic_part_7",
  "questions": [
    {
      "question_id": "uuid-or-random",
      "question_number": 1,
      "reading_passage": "The monthly staff meeting will cover several important topics that are essential to the company's development. During the meeting, we will discuss the upcoming product launch, budget allocations for the next quarter and the new employee training program...",
      "question_text": "What does the press release announce?",
      "options": [
        { "label": "A", "text": "The launch of a new product line" },
        { "label": "B", "text": "The relocation of a company's headquarters" },
        {
          "label": "C",
          "text": "The increased earnings of a real estate firm"
        },
        { "label": "D", "text": "The start of a lengthy business partnership" }
      ],
      "correctAnswer": "D",
      "translation": "Cuộc họp nhân viên hàng tháng sẽ bao gồm một số chủ đề quan trọng cần thiết cho sự phát triển của công ty. Trong cuộc họp, chúng tôi sẽ thảo luận về việc ra mắt sản phẩm sắp tới, phân bổ ngân sách cho quý tiếp theo và chương trình đào tạo nhân viên mới...",
      "explanation": "Đáp án đúng: D\n\nThông cáo báo chí thông báo gì? => tìm đáp án chứa thông tin về nội dung thông báo của thông cáo báo chí.\n\nA. Sự ra mắt của một dòng sản phẩm mới (The launch of a new product line)\nB. Việc di dời trụ sở chính của công ty (The relocation of a company's headquarters)\nC. Thu nhập tăng lên của một công ty bất động sản (The increased earnings of a real estate firm)\nD. Sự khởi đầu của một mối quan hệ đối tác kinh doanh lâu dài. => câu đầu tiên có đề cập rằng: \"California-based Belle Development has entered into an agreement to collaborate with the firm Holden Assets, which is based in London.\" nghĩa là \"Công ty phát triển Belle có trụ sở tại California đã ký kết thỏa thuận hợp tác với công ty Holden Assets, có trụ sở tại London.\", chọn."
    }
  ]
}
```

**Nguyên tắc**:

- `question_number` = `index + 1` khi map state → lesson_data.
- `reading_passage`: Đoạn văn tiếng Anh dài (có thể nhiều đoạn).
- `question_text`: Câu hỏi đọc hiểu.
- `translation`: Dịch toàn bộ đoạn văn (reading passage).
- `explanation`: Giải thích đáp án, bao gồm:
  - Đáp án đúng (D)
  - Dịch 4 đáp án (A, B, C, D)
  - Giải thích chi tiết tại sao chọn đáp án đó, trích dẫn từ đoạn văn.
- Import JSON: câu mới nối tiếp số (`last_question_number + 1`).

---

### Bước 3: Tạo Editor component

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart7Editor.jsx`

**Yêu cầu**:

#### 3.1. Form mỗi câu:

- `reading_passage` (textarea lớn - đoạn văn dài)
- `question_text` (câu hỏi)
- 4 options text (A-D)
- Chọn `correctAnswer`
- `translation` (dịch nghĩa toàn bộ đoạn văn - textarea lớn)
- `explanation` (giải thích đáp án - textarea lớn, bao gồm dịch 4 đáp án và giải thích)

#### 3.2. Preview:

- Layout 2 cột:
  - **Cột trái**: Reading passage + Translation (dropdown ẩn/hiện)
  - **Cột phải**: Câu hỏi + 4 đáp án + Nút Check/Reset + Explanation (sau khi Check)
- Highlight đúng/sai sau khi Check.
- Translation luôn có thể xem (dropdown).
- Explanation chỉ hiển thị sau khi Check.

#### 3.3. Features:

- Tabs nhiều câu.
- Nút "Thêm câu hỏi".
- Nút "Thêm nhiều câu hỏi" (bulk add).
- Import JSON (sample + nút dán).
- Preview câu hỏi.
- Lưu câu hỏi.

#### 3.4. State/data pattern:

- `isInitialMount`, `hasLoadedInitialData`, `prevDataRef`.
- `mapStateToLessonData`, `mapLessonDataToState`.
- Debounce `pushChange` ~150ms.
- Không dùng JSON.stringify trong useEffect; chỉ so sánh reference / question_id.

**CSS**: Layout 2 cột, textarea lớn cho reading passage và translation.

---

### Bước 4: Tạo Client component

**File**: `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart7.jsx`

**Yêu cầu**:

#### 4.1. Layout 2 cột:

- **Cột trái (50%)**:
  - Reading passage (có thể scroll nếu dài).
  - Translation dropdown (ẩn/hiện).
- **Cột phải (50%)**:
  - Câu hỏi (question_text).
  - 4 đáp án (radio buttons).
  - Nút "Kiểm tra đáp án" / "Xóa hết".
  - Explanation (chỉ hiển thị sau khi Check).

#### 4.2. Features:

- Parse `lesson_data` (string/object).
- Nút Check/Reset:
  - Check: highlight đúng/sai, hiển explanation.
  - Reset: xóa chọn, ẩn explanation.
- Navigation (nhiều câu): Prev/Next, Auto-switch (nếu muốn), grid số câu.
- Highlight styles: correct (xanh), wrong (đỏ).

**CSS**: Layout 2 cột responsive, scroll cho reading passage dài.

---

### Bước 5: Integrate Editor vào VisualEditor

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

```javascript
import ToeicPart7Editor from "./editors/ToeicPart7Editor";
// ...
case "toeic_part_7":
  return <ToeicPart7Editor data={data} onChange={onChange} />;
```

---

### Bước 6: Thêm default data

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`

```javascript
toeic_part_7: { type: "toeic_part_7", questions: [] },
```

---

### Bước 7: Integrate Client component vào LessonComponentMapper

**File**: `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

```javascript
import ToeicPart7 from "./Toeic/ToeicPart7";
// ...
toeic_part_7: ToeicPart7,
```

---

### Bước 8: Database & Backend

#### 8.1. Update Model

**File**: `backend/src/models/Lesson.js`

```javascript
lesson_type: {
  type: DataTypes.ENUM(
    // ... các types cũ
    "toeic_part_7",
  ),
  allowNull: false,
}
```

#### 8.2. Migration SQL

**File**: `backend/database/migrations/add_toeic_part7_to_lesson_type.sql`

```sql
ALTER TABLE lessons
MODIFY COLUMN lesson_type ENUM(
  -- ... các types cũ
  'toeic_part_7',
) NOT NULL;
```

#### 8.3. Backend Validation

**File**: `backend/src/client/services/instructorClientService.js`

```javascript
function validateLessonData(lessonType, lessonData) {
  // ... validation cho các types cũ

  const toeicTypes = [
    "toeic_part_1",
    "toeic_part_2",
    "toeic_part_3",
    "toeic_part_5",
    "toeic_part_6",
    "toeic_part_7",
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

    // Validation riêng cho Part 7
    if (lessonType === "toeic_part_7") {
      lessonData.questions.forEach((q, idx) => {
        if (!q.reading_passage || !q.reading_passage.trim()) {
          throw new Error(`Question ${idx + 1}: reading_passage is required`);
        }
        if (!q.question_text || !q.question_text.trim()) {
          throw new Error(`Question ${idx + 1}: question_text is required`);
        }
        if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Question ${idx + 1}: must have exactly 4 options`);
        }
        if (
          !q.correctAnswer ||
          !["A", "B", "C", "D"].includes(q.correctAnswer)
        ) {
          throw new Error(
            `Question ${idx + 1}: correctAnswer must be A, B, C, or D`
          );
        }
      });
    }
  }
}
```

---

### Bước 9: Admin integration

#### 9.1. CourseBuilderTab

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`

- `handleEditLesson`: Parse `lesson_data` nếu là string JSON.
- `handleSaveLesson`: Lưu đúng `lesson_data` + `lesson_type`.

#### 9.2. LessonStudioModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`

- Parse `lesson_data` từ string JSON khi load initialData.

#### 9.3. CourseLessonsModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CourseLessonsModal.jsx`

- `lessonTypeLabel`: Thêm "TOEIC Part 7".
- Parse `lesson_data` trước khi render mapper.

---

## Các lỗi thường gặp và cách fix

### Lỗi 1: Dữ liệu không load lại khi edit

**Triệu chứng**: Tạo mới lesson → Lưu → Edit lại → Dữ liệu bị mất.

**Nguyên nhân**: Flag `hasLoadedInitialData` không được reset khi edit lesson khác.

**Cách fix**: Xem Bước 3 - Load initial data với `prevDataRef` và so sánh `question_id`.

---

### Lỗi 2: Infinite loop khi load data

**Triệu chứng**: Console log hiển thị load data liên tục không dừng.

**Nguyên nhân**: Dùng `JSON.stringify` để so sánh trong useEffect.

**Cách fix**:

- ❌ KHÔNG dùng `JSON.stringify` để so sánh.
- ✅ Chỉ dùng reference comparison hoặc so sánh `question_id`.
- ✅ Ngăn `pushChange` khi `isInitialMount.current === true`.

---

### Lỗi 3: State mutation - Các câu hỏi không tách rời

**Triệu chứng**: Sửa câu hỏi này → Câu hỏi khác cũng bị sửa theo.

**Nguyên nhân**: Nested objects (`options`) không được copy đúng cách.

**Cách fix**:

```javascript
// ✅ ĐÚNG: Copy nested objects
const updateCurrentQuestion = (updater) => {
  setQuestions((prev) =>
    prev.map((q, idx) =>
      idx === currentIndex
        ? { ...q, ...updater(q) } // updater phải copy nested objects
        : q
    )
  );
};

// Trong updater
const handleOptionChange = (letter, value) => {
  updateCurrentQuestion((q) => ({
    options: q.options.map((opt) =>
      opt.label === letter ? { ...opt, text: value } : opt
    ),
  }));
};
```

---

### Lỗi 4: Reading passage quá dài làm layout vỡ

**Triệu chứng**: Đoạn văn dài làm layout 2 cột bị vỡ.

**Cách fix**:

- Thêm `max-height` và `overflow-y: auto` cho reading passage.
- Responsive: trên mobile chuyển thành 1 cột.

---

### Lỗi 5: Explanation không hiển thị đúng format

**Triệu chứng**: Explanation hiển thị như plain text, không format đẹp.

**Cách fix**:

- Dùng `white-space: pre-wrap` để giữ format (xuống dòng, khoảng trắng).
- Hoặc parse explanation thành các đoạn và render với `<p>` tags.

---

## Các lỗi AI hay mắc phải

### ❌ Lỗi 1: Dùng JSON.stringify để so sánh trong useEffect

**Sai**:

```javascript
useEffect(() => {
  const dataChanged =
    JSON.stringify(prevDataRef.current) !== JSON.stringify(data);
  if (dataChanged) {
    // Load data
  }
}, [data]);
```

**Đúng**:

```javascript
useEffect(() => {
  const dataReferenceChanged = prevDataRef.current !== data;
  // Hoặc so sánh question_id nếu cần
  const isDifferentLesson =
    prevDataRef.current?.questions?.[0]?.question_id !==
    data?.questions?.[0]?.question_id;
}, [data]);
```

---

### ❌ Lỗi 2: Không copy nested objects khi update options

**Sai**:

```javascript
const handleOptionChange = (letter, value) => {
  updateCurrentQuestion((q) => ({
    options: q.options, // Giữ nguyên reference!
  }));
};
```

**Đúng**:

```javascript
const handleOptionChange = (letter, value) => {
  updateCurrentQuestion((q) => ({
    options: q.options.map((opt) =>
      opt.label === letter ? { ...opt, text: value } : opt
    ),
  }));
};
```

---

### ❌ Lỗi 3: Layout 2 cột không responsive

**Sai**:

```css
.toeic-p7-lesson__container {
  display: flex;
  gap: 20px;
}
```

**Đúng**:

```css
.toeic-p7-lesson__container {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .toeic-p7-lesson__container {
    flex-direction: column;
  }
}
```

---

### ❌ Lỗi 4: Reading passage không scroll được

**Sai**:

```css
.toeic-p7-lesson__passage {
  height: auto; /* Không giới hạn chiều cao */
}
```

**Đúng**:

```css
.toeic-p7-lesson__passage {
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}
```

---

### ❌ Lỗi 5: Explanation không format đẹp

**Sai**:

```jsx
<div>{question.explanation}</div>
```

**Đúng**:

```jsx
<div style={{ whiteSpace: "pre-wrap" }}>{question.explanation}</div>;
// Hoặc parse thành các đoạn
{
  question.explanation
    .split("\n\n")
    .map((para, idx) => <p key={idx}>{para}</p>);
}
```

---

## Checklist khi phát triển Part 7

### ✅ Phase 1: Setup cơ bản

- [ ] Thêm option vào `LessonTypeSelectionModal.jsx`
- [ ] Tạo Editor component (`ToeicPart7Editor.jsx`)
- [ ] Tạo CSS cho Editor (`ToeicPart7Editor.css`)
- [ ] Integrate vào `VisualEditor.jsx`
- [ ] Update `LessonStudio.jsx` - thêm default data

### ✅ Phase 2: Client component

- [ ] Tạo Client component (`ToeicPart7.jsx`)
- [ ] Tạo CSS cho Client (`ToeicPart7.css`)
- [ ] Integrate vào `LessonComponentMapper.jsx`

### ✅ Phase 3: Database & Backend

- [ ] Update `backend/src/models/Lesson.js` - thêm vào ENUM
- [ ] Tạo migration SQL file
- [ ] Update `backend/src/client/services/instructorClientService.js` - validation

### ✅ Phase 4: Admin integration

- [ ] Update `CourseBuilderTab.jsx` - `handleEditLesson` parse `lesson_data`
- [ ] Update `CourseBuilderTab.jsx` - `handleSaveLesson` lưu `lesson_data` đúng
- [ ] Update `LessonStudioModal.jsx` - parse `lesson_data` từ string JSON
- [ ] Update `CourseLessonsModal.jsx` - `lessonTypeLabel` và parse `lesson_data`

### ✅ Phase 5: Testing

- [ ] Test tạo mới lesson → Lưu → Dữ liệu được lưu đúng
- [ ] Test edit lesson → Dữ liệu được load đúng (không bị mất)
- [ ] Test view lesson → Hiển thị đúng component và layout 2 cột
- [ ] Test import JSON → Questions được import đúng
- [ ] Test thêm/xóa/sửa questions → Không bị mất dữ liệu
- [ ] Test navigation → Chuyển câu hỏi hoạt động đúng
- [ ] Test preview trong editor → Giống với view lesson
- [ ] Test Check/Reset → Highlight đúng/sai, explanation hiển thị đúng
- [ ] Test Translation dropdown → Ẩn/hiện đúng
- [ ] Test responsive → Layout 2 cột chuyển thành 1 cột trên mobile

### ✅ Phase 6: Fix các lỗi thường gặp

- [ ] Fix infinite loop (không dùng JSON.stringify)
- [ ] Fix load data khi edit (dùng prevDataRef và so sánh question_id)
- [ ] Fix state mutation (copy nested objects)
- [ ] Fix currentIndex nhảy về 0 (chỉ reset khi cần)
- [ ] Fix database error (update ENUM và migration)
- [ ] Fix layout vỡ khi reading passage dài (thêm scroll)
- [ ] Fix explanation format (dùng pre-wrap hoặc parse)

---

## Pattern chung cho Part 7

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

// Layout 2 cột
<div className="toeic-p7-lesson__container">
  <div className="toeic-p7-lesson__left">
    {/* Reading passage */}
    {/* Translation dropdown */}
  </div>
  <div className="toeic-p7-lesson__right">
    {/* Question text */}
    {/* Options */}
    {/* Check/Reset buttons */}
    {/* Explanation (after check) */}
  </div>
</div>;
```

### 3. Data Shape Pattern

```json
{
  "type": "toeic_part_7",
  "questions": [
    {
      "question_id": "uuid",
      "question_number": 1,
      "reading_passage": "Long English text...",
      "question_text": "What does...?",
      "options": [
        { "label": "A", "text": "..." },
        { "label": "B", "text": "..." },
        { "label": "C", "text": "..." },
        { "label": "D", "text": "..." }
      ],
      "correctAnswer": "D",
      "translation": "Dịch toàn bộ đoạn văn...",
      "explanation": "Đáp án đúng: D\n\nDịch A: ...\nDịch B: ...\nDịch C: ...\nDịch D: ...\n\nGiải thích: ..."
    }
  ]
}
```

---

## File liên quan (cần tạo/sửa khi implement)

### Frontend

- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CourseLessonsModal.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart7Editor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart7Editor.css`
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart7.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart7.css`
- `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

### Backend

- `backend/src/models/Lesson.js`
- `backend/src/client/services/instructorClientService.js`
- `backend/database/migrations/add_toeic_part7_to_lesson_type.sql`

---

## Ngày tạo và cập nhật

- **Ngày tạo**: 2024-12-26
- **Phiên bản**: 1.0
- **Trạng thái**: ✅ Complete - Tất cả các bước đã được verify và test thành công
- **Áp dụng cho**: TOEIC Part 7 (Reading Comprehension)

---

## Ghi chú đặc biệt

1. **Layout 2 cột**: Part 7 cần layout 2 cột (trái: passage + translation, phải: question + options + explanation). Đảm bảo responsive trên mobile.

2. **Reading passage dài**: Đoạn văn có thể rất dài, cần thêm scroll và max-height để không làm vỡ layout.

3. **Translation**: Luôn có thể xem (dropdown), không ẩn hoàn toàn như Part 6.

4. **Explanation format**: Explanation có thể chứa nhiều đoạn, cần format đẹp (pre-wrap hoặc parse thành paragraphs).

5. **Import JSON**: Sample JSON cần có đầy đủ các field: `reading_passage`, `question_text`, `options` (4), `correctAnswer`, `translation`, `explanation`.
