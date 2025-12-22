# TOEIC Part 1 - Hướng dẫn phát triển hoàn chỉnh

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Luồng phát triển từ đầu đến cuối](#luồng-phát-triển-từ-đầu-đến-cuối)
3. [Các bước chi tiết](#các-bước-chi-tiết)
4. [Các lỗi thường gặp và cách fix](#các-lỗi-thường-gặp-và-cách-fix)
5. [Các lỗi AI hay mắc phải](#các-lỗi-ai-hay-mắc-phải)
6. [Checklist khi phát triển Part mới](#checklist-khi-phát-triển-part-mới)

---

## Tổng quan

File này mô tả **toàn bộ quá trình phát triển TOEIC Part 1** từ khi bắt đầu đến khi hoàn thiện, bao gồm:

- Các bước đã thực hiện
- Các lỗi đã gặp và cách khắc phục
- Các pattern và best practices
- Checklist để áp dụng cho các Part khác (Part 2-7)

**Mục đích**: Khi phát triển Part 2-7, chỉ cần đọc lại file này và follow theo các bước đã được verify.

---

## Luồng phát triển từ đầu đến cuối

### Tổng quan luồng

```
1. Thêm option vào LessonTypeSelectionModal
   ↓
2. Tạo Editor component (ToeicPart1Editor.jsx)
   ↓
3. Tạo Preview trong Editor
   ↓
4. Tạo Client component (ToeicPart1.jsx) cho view lesson
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
  id: "toeic_part_1",
  name: "TOEIC Part 1",
  icon: HiPhoto, // hoặc icon phù hợp
  description: "Picture Description - Mô tả hình ảnh",
}
```

**Lưu ý**:

- Không sửa logic hiện tại của 9 lesson types cũ
- Chỉ thêm mới vào array

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

### Bước 2: Tạo Editor component

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart1Editor.jsx`

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
// Tạo question rỗng
function createEmptyQuestion() {
  const id = `toeic_p1_q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    audioUrl: "",
    imageUrl: "",
    correctChoice: "A",
    transcript: { A: "", B: "", C: "", D: "" },
    explanation: { A: "", B: "", C: "", D: "", note: "" },
  };
}

// Map state → lesson_data (để save)
const mapStateToLessonData = useCallback((qs) => {
  return {
    type: "toeic_part_1",
    questions: qs.map((q, idx) => ({
      question_id: q.id,
      question_number: idx + 1,
      image_file: q.imageUrl || "",
      audio_file: q.audioUrl || "",
      correct_choice: q.correctChoice || "A",
      transcript: { A: q.transcript?.A || "", ... },
      explanation: { A: q.explanation?.A || "", ... },
    })),
  };
}, []);

// Map lesson_data → state (để load)
const mapLessonDataToState = useCallback((lessonData) => {
  const srcQuestions = Array.isArray(lessonData?.questions) ? lessonData.questions : [];
  if (!srcQuestions.length) return [createEmptyQuestion()];

  return srcQuestions.map((q, idx) => ({
    id: q.question_id || `toeic_p1_q_${idx}_${Date.now()}`,
    audioUrl: q.audio_file || "",
    imageUrl: q.image_file || "",
    correctChoice: q.correct_choice || "A",
    transcript: { A: q.transcript?.A || "", ... },
    explanation: { A: q.explanation?.A || "", ... },
  }));
}, []);
```

#### 2.3. Load initial data (QUAN TRỌNG - dễ sai nhất)

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
        "📌 ToeicPart1Editor - Different lesson detected, resetting load flag"
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

#### 2.4. Push change lên parent

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

#### 2.5. CRUD Questions

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

**Lưu ý quan trọng**:

- ✅ Luôn tạo object mới khi update (không mutate)
- ✅ Copy nested objects khi cần: `{ ...q.transcript }`
- ✅ Dùng callback trong `setState` để lấy giá trị mới nhất
- ❌ KHÔNG dùng `JSON.stringify` để so sánh trong useEffect
- ❌ KHÔNG reset `currentIndex` khi chỉ update nội dung

---

### Bước 3: Tạo CSS cho Editor

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart1Editor.css`

**Các phần cần có**:

- Tab navigation styles
- Form input styles
- Preview styles (giống client view)
- JSON import modal styles

**Lưu ý**: Preview phải giống với client view để admin thấy chính xác học viên sẽ thấy gì.

---

### Bước 4: Integrate Editor vào VisualEditor

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**Việc cần làm**:

```javascript
import ToeicPart1Editor from "./editors/ToeicPart1Editor";

// Trong switch case
case "toeic_part_1":
  return <ToeicPart1Editor data={data} onChange={onChange} />;
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
  };
  return defaults[lessonType] || {};
}
```

---

### Bước 6: Tạo Client component cho view lesson

**File**: `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart1.jsx`

**Cấu trúc**:

- Parse `lesson_data` từ prop `lesson`
- Hỗ trợ parse JSON string nếu cần
- Navigation với grid (như ảnh 2)
- Audio player
- Image + Options
- Transcript & Explanation (ẩn/hiện khi check answer)
- Highlight correct/wrong answers

**Lưu ý**:

- Layout phải giống preview trong editor
- Transcript & Explanation ở ngay dưới ảnh + options
- Navigation grid ở dưới cùng

---

### Bước 7: Tạo CSS cho Client component

**File**: `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart1.css`

**Các phần cần có**:

- Header styles
- Navigation controls (prev/next, auto switch, grid)
- Audio player styles
- Image + Options layout (horizontal)
- Transcript & Explanation (50% mỗi phần)
- Highlight styles (correct/wrong)

---

### Bước 8: Integrate Client component vào LessonComponentMapper

**File**: `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

**Việc cần làm**:

```javascript
import ToeicPart1 from "./Toeic/ToeicPart1";

const LessonComponentMapper = {
  // ... các types cũ
  toeic_part_1: ToeicPart1,
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

**Việc cần làm**:

```sql
ALTER TABLE lessons
MODIFY COLUMN lesson_type ENUM(
  -- ... các types cũ
  'toeic_part_1',
  'toeic_part_2',
  -- ... các part khác
) NOT NULL;
```

**Lưu ý**: Phải chạy migration SQL này trên database.

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

**Việc cần làm**:

#### 11.1. handleEditLesson - Parse lesson_data

```javascript
const handleEditLesson = (moduleId, lesson) => {
  console.log("handleEditLesson called with lesson:", lesson);
  setSelectedModuleId(moduleId);

  // QUAN TRỌNG: Parse lesson_data nếu là string JSON
  let parsedLessonData = lesson.lesson_data;
  if (parsedLessonData && typeof parsedLessonData === "string") {
    try {
      parsedLessonData = JSON.parse(parsedLessonData);
      console.log("Parsed lesson_data:", parsedLessonData);
    } catch (e) {
      console.error("Error parsing lesson_data:", e);
      parsedLessonData = null;
    }
  }

  // Nếu lesson_data là null/undefined, giữ nguyên (không convert thành {})
  if (parsedLessonData === undefined) {
    parsedLessonData = null;
  }

  const lessonWithParsedData = {
    ...lesson,
    lesson_data: parsedLessonData,
  };

  console.log("Final lesson for edit:", lessonWithParsedData);
  setEditingLesson(lessonWithParsedData);

  const lessonType = lesson.lessonType || lesson.lesson_type || "video";
  setSelectedLessonType(lessonType);

  setShowLessonStudioModal(true);
};
```

#### 11.2. handleSaveLesson - Lưu lesson_data đúng

```javascript
const handleSaveLesson = (lessonData) => {
  console.log("handleSaveLesson called with:", lessonData);
  console.log("editingLesson:", editingLesson);

  const updatedModules = modules.map((module) => {
    if (module.id === selectedModuleId) {
      if (editingLesson) {
        // Update existing lesson - QUAN TRỌNG: Match bằng cả id và lesson_id
        return {
          ...module,
          lessons: module.lessons.map((l) => {
            const isMatch =
              l.id === editingLesson.id ||
              l.lesson_id === editingLesson.id ||
              l.id === editingLesson.lesson_id ||
              l.lesson_id === editingLesson.lesson_id;

            if (isMatch) {
              const updatedLesson = {
                ...l,
                title: lessonData.title || l.title || "",
                description: lessonData.description || l.description || "",
                // QUAN TRỌNG: Giữ nguyên lessonType và lesson_data từ lessonData
                lessonType:
                  lessonData.lessonType ||
                  l.lessonType ||
                  selectedLessonType ||
                  "video",
                lesson_type:
                  lessonData.lessonType ||
                  lessonData.lesson_type ||
                  l.lesson_type ||
                  l.lessonType ||
                  selectedLessonType ||
                  "video",
                // QUAN TRỌNG: lesson_data phải lấy từ lessonData.lesson_data (không fallback về l.lesson_data)
                lesson_data:
                  lessonData.lesson_data !== undefined
                    ? lessonData.lesson_data
                    : l.lesson_data || null,
                isFree:
                  lessonData.isFree !== undefined
                    ? lessonData.isFree
                    : l.isFree || false,
              };
              console.log("Updating lesson:", updatedLesson);
              return updatedLesson;
            }
            return l;
          }),
        };
      } else {
        // Add new lesson
        const newLesson = {
          id: Date.now(),
          title: lessonData.title || "",
          description: lessonData.description || "",
          // QUAN TRỌNG: Đảm bảo lessonType và lesson_data được lưu
          lessonType: lessonData.lessonType || selectedLessonType || "video",
          lesson_type:
            lessonData.lessonType ||
            lessonData.lesson_type ||
            selectedLessonType ||
            "video",
          lesson_data:
            lessonData.lesson_data !== undefined
              ? lessonData.lesson_data
              : null,
          isFree: lessonData.isFree || false,
        };
        console.log("Adding new lesson:", newLesson);

        return {
          ...module,
          lessons: [...module.lessons, newLesson],
        };
      }
    }
    return module;
  });

  console.log("Updated modules:", updatedModules);
  onChange(updatedModules);
  setShowLessonStudioModal(false);
  setEditingLesson(null);
  setSelectedModuleId(null);
  setSelectedLessonType(null);
};
```

#### 11.3. initialData trong LessonStudioModal

```javascript
initialData={
  editingLesson
    ? {
        title: editingLesson.title || "",
        lessonType: editingLesson.lessonType || editingLesson.lesson_type || "video",
        lesson_data: editingLesson.lesson_data || null, // QUAN TRỌNG: Truyền lesson_data
        description: editingLesson.description || "",
        // ... các fields khác
      }
    : null
}
```

---

### Bước 12: Update LessonStudioModal để parse lesson_data

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`

**Việc cần làm**:

```javascript
useEffect(() => {
  if (open) {
    setErrors({});

    if (initialData) {
      console.log("LessonStudioModal - Loading initialData:", initialData);
      const dataLessonType =
        initialData.lessonType ||
        initialData.lesson_type ||
        lessonType ||
        "video";

      // QUAN TRỌNG: Parse lesson_data nếu là string JSON (trường hợp từ API)
      let lessonDataToLoad = initialData.lesson_data;
      if (lessonDataToLoad && typeof lessonDataToLoad === "string") {
        try {
          lessonDataToLoad = JSON.parse(lessonDataToLoad);
          console.log(
            "LessonStudioModal - Parsed lesson_data from string:",
            lessonDataToLoad
          );
        } catch (e) {
          console.error("LessonStudioModal - Error parsing lesson_data:", e);
          lessonDataToLoad = null;
        }
      }

      // Nếu là video lesson và có videoUrl từ form cũ, chuyển đổi sang format mới
      if (
        dataLessonType === "video" &&
        initialData.videoUrl &&
        !lessonDataToLoad
      ) {
        setLessonData({
          type: "video_lesson",
          video_url: initialData.videoUrl,
          video_type:
            initialData.videoSource === "Google Drive" ? "direct" : "youtube",
          content: initialData.content || "",
        });
      } else {
        // Load lesson_data từ initialData (cho tất cả các loại lesson)
        console.log(
          "LessonStudioModal - Loading lesson_data:",
          lessonDataToLoad
        );
        setLessonData(lessonDataToLoad || null);
      }
      setLessonTitle(initialData.title || "");
    } else {
      // Tạo mới - reset về null
      setLessonData(null);
      setLessonTitle("");
    }
  }
}, [open, initialData, lessonType]);
```

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

#### 13.2. Parse lesson_data trước khi render

```javascript
// Trong renderLessonComponent hoặc nơi sử dụng activeLesson
let lessonData = activeLesson.lesson_data;
if (lessonData && typeof lessonData === "string") {
  try {
    lessonData = JSON.parse(lessonData);
  } catch (e) {
    console.error("Error parsing lesson_data:", e);
    lessonData = null;
  }
}

const lessonWithParsedData = {
  ...activeLesson,
  lesson_data: lessonData,
};

// Truyền vào LessonContent
<LessonContent lesson={lessonWithParsedData} />;
```

---

## Các lỗi thường gặp và cách fix

### Lỗi 1: Dữ liệu không load lại khi edit

**Triệu chứng**:

- Tạo mới lesson → Lưu → Edit lại → Dữ liệu bị mất

**Nguyên nhân**:

- Flag `hasLoadedInitialData` không được reset khi edit lesson khác
- Component không unmount khi đóng modal

**Cách fix**: Xem Bước 2.3 - Load initial data với `prevDataRef` và so sánh `question_id`.

---

### Lỗi 2: Infinite loop khi load data

**Triệu chứng**:

- Console log hiển thị load data liên tục không dừng
- Component re-render vô hạn

**Nguyên nhân**:

- Dùng `JSON.stringify` để so sánh trong useEffect
- `pushChange` được gọi ngay cả khi đang mount

**Cách fix**:

- ❌ KHÔNG dùng `JSON.stringify` để so sánh
- ✅ Chỉ dùng reference comparison hoặc so sánh `question_id`
- ✅ Ngăn `pushChange` khi `isInitialMount.current === true`

---

### Lỗi 3: State mutation - Các câu hỏi không tách rời

**Triệu chứng**:

- Sửa câu hỏi này → Câu hỏi khác cũng bị sửa theo

**Nguyên nhân**:

- Nested objects (`transcript`, `explanation`) không được copy đúng cách

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
const handleTranscriptChange = (letter, value) => {
  updateCurrentQuestion((q) => ({
    transcript: { ...q.transcript, [letter]: value }, // Copy nested object
  }));
};
```

---

### Lỗi 4: Tạo câu hỏi mới bị nhảy về câu 1

**Triệu chứng**:

- Bấm "Thêm câu hỏi" → Câu hỏi mới được tạo nhưng `currentIndex` nhảy về 0

**Nguyên nhân**:

- Dùng `questions.length` (giá trị cũ) thay vì `prev.length` trong callback

**Cách fix**:

```javascript
// ✅ ĐÚNG: Dùng prev.length trong callback
const handleAddQuestion = () => {
  setQuestions((prev) => {
    const next = [...prev, createEmptyQuestion()];
    setCurrentIndex(prev.length); // prev.length là index của question mới
    return next;
  });
};
```

---

### Lỗi 5: Sửa câu hỏi số 2 bị nhảy về câu 1

**Triệu chứng**:

- Đang ở câu 2 → Sửa dữ liệu → `currentIndex` tự động nhảy về 0

**Nguyên nhân**:

- useEffect load data chạy lại không cần thiết
- Reset `currentIndex` khi không cần

**Cách fix**: Xem Bước 2.3 - Chỉ reset `currentIndex` khi load lần đầu, không reset khi chỉ update nội dung.

---

### Lỗi 6: Database error "Data truncated for column 'lesson_type'"

**Triệu chứng**:

- Khi save lesson → Lỗi "Data truncated for column 'lesson_type' at row 1"

**Nguyên nhân**:

- ENUM trong database chưa có giá trị mới

**Cách fix**:

1. Update `backend/src/models/Lesson.js` - Thêm vào ENUM
2. Chạy migration SQL: `backend/database/migrations/add_toeic_parts_to_lesson_type.sql`
3. Restart backend server

---

### Lỗi 7: View lesson hiển thị sai component

**Triệu chứng**:

- Lesson Part 1 hiển thị như Video lesson

**Nguyên nhân**:

- Chưa update `LessonComponentMapper`
- Chưa parse `lesson_data` trước khi render

**Cách fix**: Xem Bước 8 và Bước 13.

---

### Lỗi 8: Layout preview khác với view lesson

**Triệu chứng**:

- Preview trong editor khác với view lesson thực tế

**Nguyên nhân**:

- CSS của preview và client component không giống nhau

**Cách fix**:

- Copy CSS từ client component sang editor preview
- Hoặc dùng chung CSS file

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

**Lý do**: `JSON.stringify` tạo ra vòng lặp vô hạn vì mỗi lần `pushChange` tạo object mới.

---

### ❌ Lỗi 2: Reset flag không đúng cách

**Sai**:

```javascript
useEffect(() => {
  if (data) {
    hasLoadedInitialData.current = false; // Reset mỗi lần có data
    // Load data
  }
}, [data]);
```

**Đúng**:

```javascript
useEffect(() => {
  // Chỉ reset khi thực sự là lesson khác (question_id khác)
  if (
    dataReferenceChanged &&
    hasLoadedInitialData.current &&
    prevFirstQuestionId !== currentFirstQuestionId
  ) {
    hasLoadedInitialData.current = false;
  }
}, [data]);
```

**Lý do**: Không reset khi chỉ update nội dung (cùng question_id).

---

### ❌ Lỗi 3: Dùng questions.length thay vì prev.length

**Sai**:

```javascript
const handleAddQuestion = () => {
  setQuestions([...questions, createEmptyQuestion()]);
  setCurrentIndex(questions.length); // Giá trị cũ!
};
```

**Đúng**:

```javascript
const handleAddQuestion = () => {
  setQuestions((prev) => {
    const next = [...prev, createEmptyQuestion()];
    setCurrentIndex(prev.length); // Giá trị mới nhất
    return next;
  });
};
```

**Lý do**: React state update là async, `questions.length` là giá trị cũ.

---

### ❌ Lỗi 4: Không copy nested objects khi update

**Sai**:

```javascript
const handleTranscriptChange = (letter, value) => {
  updateCurrentQuestion((q) => ({
    transcript: q.transcript, // Giữ nguyên reference!
  }));
};
```

**Đúng**:

```javascript
const handleTranscriptChange = (letter, value) => {
  updateCurrentQuestion((q) => ({
    transcript: { ...q.transcript, [letter]: value }, // Copy nested object
  }));
};
```

**Lý do**: Nếu không copy, các question sẽ share cùng reference → mutation.

---

### ❌ Lỗi 5: Depend vào useCallback trong useEffect

**Sai**:

```javascript
useEffect(() => {
  // ...
}, [data, mapLessonDataToState]); // mapLessonDataToState là useCallback
```

**Đúng**:

```javascript
useEffect(() => {
  // ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]); // Chỉ depend vào data
```

**Lý do**: `useCallback` không thay đổi reference, không cần depend.

---

### ❌ Lỗi 6: Không parse lesson_data từ string JSON

**Sai**:

```javascript
const handleEditLesson = (lesson) => {
  setEditingLesson({
    ...lesson,
    lesson_data: lesson.lesson_data, // Có thể là string JSON!
  });
};
```

**Đúng**:

```javascript
const handleEditLesson = (lesson) => {
  let parsedLessonData = lesson.lesson_data;
  if (parsedLessonData && typeof parsedLessonData === "string") {
    try {
      parsedLessonData = JSON.parse(parsedLessonData);
    } catch (e) {
      parsedLessonData = null;
    }
  }
  setEditingLesson({
    ...lesson,
    lesson_data: parsedLessonData,
  });
};
```

**Lý do**: Database có thể lưu `lesson_data` dưới dạng JSON string.

---

### ❌ Lỗi 7: Reset currentIndex khi không cần

**Sai**:

```javascript
useEffect(() => {
  if (data) {
    setCurrentIndex(0); // Reset mỗi lần có data
  }
}, [data]);
```

**Đúng**:

```javascript
useEffect(() => {
  // Chỉ reset khi load lần đầu
  if (!hasLoadedInitialData.current && data?.questions?.length > 0) {
    setCurrentIndex(0);
    hasLoadedInitialData.current = true;
  }
}, [data]);
```

**Lý do**: Không reset khi chỉ update nội dung.

---

## Checklist khi phát triển Part mới

### ✅ Phase 1: Setup cơ bản

- [ ] Thêm option vào `LessonTypeSelectionModal.jsx`
- [ ] Tạo Editor component (`ToeicPartXEditor.jsx`)
- [ ] Tạo CSS cho Editor (`ToeicPartXEditor.css`)
- [ ] Integrate vào `VisualEditor.jsx`
- [ ] Update `LessonStudio.jsx` - thêm default data

### ✅ Phase 2: Client component

- [ ] Tạo Client component (`ToeicPartX.jsx`)
- [ ] Tạo CSS cho Client (`ToeicPartX.css`)
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
- [ ] Test edit lesson → Dữ liệu được load đúng
- [ ] Test view lesson → Hiển thị đúng component và layout
- [ ] Test import JSON → Questions được import đúng
- [ ] Test thêm/xóa/sửa questions → Không bị mất dữ liệu
- [ ] Test navigation → Chuyển câu hỏi hoạt động đúng
- [ ] Test preview trong editor → Giống với view lesson

### ✅ Phase 6: Fix các lỗi thường gặp

- [ ] Fix infinite loop (không dùng JSON.stringify)
- [ ] Fix load data khi edit (dùng prevDataRef và so sánh question_id)
- [ ] Fix state mutation (copy nested objects)
- [ ] Fix currentIndex nhảy về 0 (chỉ reset khi cần)
- [ ] Fix database error (update ENUM và migration)

---

## Pattern chung cho tất cả các Part

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

### 3. Database Pattern

```sql
-- Migration SQL
ALTER TABLE lessons
MODIFY COLUMN lesson_type ENUM(
  -- ... existing types
  'toeic_part_X',
) NOT NULL;
```

### 4. Backend Validation Pattern

```javascript
const toeicTypes = ["toeic_part_X"];
if (toeicTypes.includes(lessonType)) {
  if (!lessonData?.questions || !Array.isArray(lessonData.questions)) {
    throw new Error(`${lessonType} requires lesson_data.questions array`);
  }
}
```

---

## Kết luận

File này đã tổng hợp **toàn bộ quá trình phát triển TOEIC Part 1**, bao gồm:

- ✅ Các bước chi tiết từ đầu đến cuối
- ✅ Các lỗi đã gặp và cách fix
- ✅ Các lỗi AI hay mắc phải và cách tránh
- ✅ Checklist để áp dụng cho Part 2-7

**Khi phát triển Part mới**: Chỉ cần đọc lại file này và follow theo checklist. Tất cả các pattern và best practices đã được verify và test thành công.

---

## File liên quan

### Frontend

- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CourseLessonsModal.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart1Editor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart1Editor.css`
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart1.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart1.css`
- `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

### Backend

- `backend/src/models/Lesson.js`
- `backend/src/client/services/instructorClientService.js`
- `backend/database/migrations/add_toeic_parts_to_lesson_type.sql`

---

## Ngày tạo và cập nhật

- **Ngày tạo**: [Ngày hiện tại]
- **Phiên bản**: 1.0
- **Trạng thái**: ✅ Complete - Tất cả các bước đã được verify và test thành công
- **Áp dụng cho**: TOEIC Part 1 (đã hoàn thành), Part 2-7 (sẽ áp dụng)
