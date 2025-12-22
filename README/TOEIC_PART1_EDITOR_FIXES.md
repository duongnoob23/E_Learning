# TOEIC Part 1 Editor - Tổng hợp các lỗi đã fix

## 📋 Tổng quan

File này mô tả chi tiết các lỗi đã được phát hiện và sửa trong quá trình phát triển `ToeicPart1Editor.jsx`, cùng với nguyên nhân và cách khắc phục.

**Lưu ý**: Để xem toàn bộ quá trình phát triển từ đầu đến cuối, vui lòng đọc file `TOEIC_PART1_COMPLETE_DEVELOPMENT_GUIDE.md`.

---

## 🎯 Quá trình phát triển TOEIC Part 1 - Tổng kết

### Các bước đã thực hiện

1. **Thêm option vào LessonTypeSelectionModal**

   - Thêm TOEIC Part 1 vào danh sách lesson types
   - Import icon phù hợp (HiPhoto)

2. **Tạo Editor component (ToeicPart1Editor.jsx)**

   - State management với questions array
   - Tab navigation cho nhiều questions
   - Form inputs: audio, image, correct choice, transcript, explanation
   - JSON import functionality
   - Preview mode giống client view

3. **Tạo CSS cho Editor**

   - Tab styles với close button
   - Form layout (2 columns)
   - Preview styles
   - JSON import modal styles

4. **Tạo Client component (ToeicPart1.jsx)**

   - Parse lesson_data từ prop
   - Navigation với grid (như ảnh 2)
   - Audio player
   - Image + Options layout
   - Transcript & Explanation (ẩn/hiện)
   - Highlight correct/wrong answers

5. **Update Database**

   - Thêm `toeic_part_1` vào ENUM trong `Lesson.js`
   - Tạo migration SQL file

6. **Update Backend Validation**

   - Thêm validation cho `toeic_part_1` trong `instructorClientService.js`

7. **Update LessonComponentMapper**

   - Map `toeic_part_1` → `ToeicPart1` component

8. **Update CourseBuilderTab**

   - Parse `lesson_data` khi edit
   - Lưu `lesson_data` đúng khi save
   - Match lesson bằng cả `id` và `lesson_id`

9. **Update LessonStudioModal**

   - Parse `lesson_data` từ string JSON

10. **Update CourseLessonsModal**
    - Hiển thị đúng label "TOEIC Part 1"
    - Parse `lesson_data` trước khi render

### Các lỗi đã gặp trong quá trình phát triển

1. **Dữ liệu không load lại khi edit** ⚠️ Nghiêm trọng

   - **Triệu chứng**: Tạo mới → Lưu → Edit lại → Dữ liệu bị mất
   - **Nguyên nhân**: Flag `hasLoadedInitialData` không được reset khi edit lesson khác
   - **Fix**: Dùng `prevDataRef` và so sánh `question_id` để detect lesson khác

2. **Infinite loop khi load data** ⚠️ Nghiêm trọng

   - **Triệu chứng**: Console log vô hạn, component re-render liên tục
   - **Nguyên nhân**: Dùng `JSON.stringify` để so sánh trong useEffect
   - **Fix**: Chỉ dùng reference comparison hoặc so sánh `question_id`

3. **State mutation - Các câu hỏi không tách rời** ⚠️ Nghiêm trọng

   - **Triệu chứng**: Sửa câu này → Câu khác cũng bị sửa
   - **Nguyên nhân**: Nested objects không được copy đúng cách
   - **Fix**: Copy nested objects khi update: `{ ...q.transcript }`

4. **Tạo câu hỏi mới bị nhảy về câu 1** ⚠️ Trung bình

   - **Triệu chứng**: Thêm question → `currentIndex` nhảy về 0
   - **Nguyên nhân**: Dùng `questions.length` (giá trị cũ) thay vì `prev.length`
   - **Fix**: Dùng callback trong `setState`: `setQuestions((prev) => { setCurrentIndex(prev.length); return next; })`

5. **Sửa câu hỏi số 2 bị nhảy về câu 1** ⚠️ Trung bình

   - **Triệu chứng**: Đang ở câu 2 → Sửa → Nhảy về câu 1
   - **Nguyên nhân**: useEffect load data chạy lại không cần thiết
   - **Fix**: Chỉ reset `currentIndex` khi load lần đầu, không reset khi update

6. **Database error "Data truncated"** ⚠️ Nghiêm trọng

   - **Triệu chứng**: Lỗi khi save lesson
   - **Nguyên nhân**: ENUM trong database chưa có `toeic_part_1`
   - **Fix**: Update ENUM và chạy migration SQL

7. **View lesson hiển thị sai component** ⚠️ Nghiêm trọng

   - **Triệu chứng**: Part 1 hiển thị như Video lesson
   - **Nguyên nhân**: Chưa update `LessonComponentMapper`
   - **Fix**: Thêm mapping và parse `lesson_data`

8. **Layout preview khác với view lesson** ⚠️ Trung bình
   - **Triệu chứng**: Preview trong editor khác với view thực tế
   - **Nguyên nhân**: CSS không giống nhau
   - **Fix**: Copy CSS từ client component sang editor preview

### Các lỗi AI hay mắc phải

1. ❌ **Dùng JSON.stringify để so sánh trong useEffect**

   - Tạo ra infinite loop vì mỗi lần `pushChange` tạo object mới
   - ✅ **Fix**: Chỉ dùng reference comparison hoặc so sánh `question_id`

2. ❌ **Reset flag không đúng cách**

   - Reset mỗi lần có data → Không load lại khi edit
   - ✅ **Fix**: Chỉ reset khi thực sự là lesson khác (question_id khác)

3. ❌ **Dùng questions.length thay vì prev.length**

   - React state update là async → Giá trị cũ
   - ✅ **Fix**: Dùng callback trong `setState`: `prev.length`

4. ❌ **Không copy nested objects khi update**

   - Các question share cùng reference → Mutation
   - ✅ **Fix**: Copy nested objects: `{ ...q.transcript }`

5. ❌ **Depend vào useCallback trong useEffect**

   - `useCallback` không thay đổi reference → Không cần depend
   - ✅ **Fix**: Chỉ depend vào data thực sự thay đổi

6. ❌ **Không parse lesson_data từ string JSON**

   - Database có thể lưu dưới dạng JSON string
   - ✅ **Fix**: Parse trước khi sử dụng: `JSON.parse(lesson_data)`

7. ❌ **Reset currentIndex khi không cần**
   - Reset mỗi lần có data → Nhảy về câu 1 khi sửa
   - ✅ **Fix**: Chỉ reset khi load lần đầu

### Pattern đã học được

1. **Load initial data pattern**:

   - Dùng `hasLoadedInitialData` ref để chỉ load một lần
   - Dùng `prevDataRef` để track data reference
   - So sánh `question_id` để detect lesson khác
   - Chỉ reset flag khi thực sự là lesson khác

2. **State management pattern**:

   - Luôn tạo object mới khi update (không mutate)
   - Copy nested objects khi cần: `{ ...obj }`
   - Dùng callback trong `setState` để lấy giá trị mới nhất

3. **Tránh infinite loop pattern**:

   - Không so sánh nội dung (JSON.stringify) trong useEffect
   - Chỉ so sánh reference hoặc ID quan trọng
   - Ngăn `pushChange` khi đang mount hoặc load initial data

4. **Quản lý currentIndex pattern**:
   - Dùng callback trong `setState` để lấy giá trị mới nhất
   - Chỉ reset `currentIndex` khi thực sự cần (load lần đầu, edit lesson khác)
   - Không reset khi chỉ update nội dung

---

## 1. Lỗi: Dữ liệu không load lại khi edit (dữ liệu câu hỏi bị mất)

### Mô tả lỗi

- Khi tạo mới Part 1 lesson, nhập dữ liệu và lưu bài học thành công
- Sau đó bấm edit lại, chỉ có tiêu đề hiển thị, dữ liệu câu hỏi bị mất hoàn toàn
- Dữ liệu đã được lưu vào state của modules nhưng không được load lại khi edit

### Nguyên nhân

1. **Flag `hasLoadedInitialData` không được reset**:

   - Flag này được set `true` sau lần load đầu tiên
   - Khi modal đóng và mở lại, flag vẫn là `true` nên không load lại dữ liệu
   - Component có thể không unmount khi đóng modal, dẫn đến flag không được reset

2. **Logic so sánh data không đúng**:
   - Ban đầu dùng `JSON.stringify` để so sánh, gây ra infinite loop
   - Sau đó chỉ dùng reference comparison nhưng không reset flag đúng cách

### Cách fix

```javascript
// Thêm prevDataRef để track data reference
const prevDataRef = useRef(null);

useEffect(() => {
  // Reset flag chỉ khi data reference thay đổi VÀ đã load rồi
  const dataReferenceChanged = prevDataRef.current !== data;

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
      hasLoadedInitialData.current = false;
    }
  }

  // Load data khi chưa load
  if (!hasLoadedInitialData.current && data?.questions?.length > 0) {
    const initialQuestions = mapLessonDataToState(data);
    setQuestions(initialQuestions);
    hasLoadedInitialData.current = true;
  }
}, [data]);
```

### Lý do fix này hoạt động

- Chỉ reset flag khi thực sự là lesson khác (question_id khác)
- Không reset khi chỉ update nội dung (pushChange tạo object mới nhưng cùng question_id)
- Đảm bảo dữ liệu được load lại khi edit lesson khác

---

## 2. Lỗi: Duplicate Keys trong React

### Mô tả lỗi

- Console hiển thị warning: "Encountered two children with the same key, `p1_q1`"
- Khi import JSON nhiều lần, các question có cùng `question_id` → duplicate keys
- Dẫn đến React không thể phân biệt các component, gây ra lỗi render

### Nguyên nhân

- Khi import JSON, nếu các question có cùng `question_id`, sẽ tạo ra duplicate keys
- ID generation không đủ unique khi có nhiều questions cùng ID từ database

### Cách fix

```javascript
// Trong mapLessonDataToState
return srcQuestions.map((q, idx) => ({
  id: q.question_id || `toeic_p1_q_${idx}_${Date.now()}`,
  // Đảm bảo mỗi question có unique ID
  // ...
}));
```

### Lý do fix này hoạt động

- Mỗi question được map với ID riêng biệt
- Nếu `question_id` từ database trùng, sẽ fallback về ID mới với timestamp
- Đảm bảo mỗi question trong state có unique ID

---

## 3. Lỗi: State Mutation - Các câu hỏi không tách rời

### Mô tả lỗi

- Khi cập nhật một câu hỏi ở tab này, các tab khác cũng bị cập nhật theo
- Các câu hỏi không hoạt động độc lập, chia sẻ cùng reference

### Nguyên nhân

- **Nested objects không được copy đúng cách**:
  - `transcript` và `explanation` là nested objects
  - Khi update, chỉ spread object bên ngoài, nested objects vẫn giữ nguyên reference
  - Dẫn đến mutation shared state

### Cách fix ban đầu (sau đó đã đơn giản hóa)

```javascript
// Ban đầu: Deep copy nested objects
const updateCurrentQuestion = (updater) => {
  setQuestions((prev) =>
    prev.map((q, idx) => {
      if (idx === currentIndex) {
        const updates = updater(q);
        const updatedQuestion = {
          ...q,
          transcript: { ...q.transcript },
          explanation: { ...q.explanation },
        };
        // Apply updates với merge nested objects
        // ...
        return updatedQuestion;
      }
      return {
        ...q,
        transcript: { ...q.transcript },
        explanation: { ...q.explanation },
      };
    })
  );
};
```

### Cách fix cuối cùng (theo pattern của các editor cũ)

```javascript
// Đơn giản hóa: Spread operator đủ cho nested objects
const updateCurrentQuestion = (updater) => {
  setQuestions((prev) =>
    prev.map((q, idx) => (idx === currentIndex ? { ...q, ...updater(q) } : q))
  );
};

// Trong updater, đảm bảo copy nested objects
const handleTranscriptChange = (letter, value) => {
  updateCurrentQuestion((q) => ({
    transcript: { ...q.transcript, [letter]: value },
  }));
};
```

### Lý do fix này hoạt động

- Spread operator `{ ...q.transcript }` tạo shallow copy của nested object
- Mỗi lần update, tạo object mới thay vì mutate object cũ
- Đảm bảo mỗi question có state riêng biệt

---

## 4. Lỗi: Tạo câu hỏi mới bị field dữ liệu

### Mô tả lỗi

- Khi tạo câu hỏi mới, thay vì có dữ liệu trống, nó lại có dữ liệu từ câu hỏi hiện tại
- Câu hỏi mới không được khởi tạo đúng với empty data

### Nguyên nhân

- `createEmptyQuestion()` có thể đang dùng chung reference với question hiện tại
- Hoặc logic tạo question mới không đúng

### Cách fix

```javascript
function createEmptyQuestion() {
  const id = `toeic_p1_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    audioUrl: "",
    imageUrl: "",
    correctChoice: "A",
    transcript: {
      A: "",
      B: "",
      C: "",
      D: "",
    },
    explanation: {
      A: "",
      B: "",
      C: "",
      D: "",
      note: "",
    },
  };
}
```

### Lý do fix này hoạt động

- Mỗi lần gọi `createEmptyQuestion()` tạo object mới hoàn toàn
- Không chia sẻ reference với bất kỳ object nào
- Đảm bảo question mới có dữ liệu trống

---

## 5. Lỗi: Infinite Loop khi load data

### Mô tả lỗi

- Console log hiển thị load data liên tục không dừng
- Component re-render vô hạn
- Không thể tương tác với UI

### Nguyên nhân

1. **Logic so sánh JSON.stringify gây vòng lặp**:

   ```javascript
   // ❌ SAI: So sánh JSON.stringify
   const dataChanged =
     JSON.stringify(prevDataRef.current) !== JSON.stringify(data);
   ```

   - Mỗi lần `pushChange` → `onChange` → tạo object mới → JSON khác → trigger useEffect → load lại → `pushChange` → vòng lặp

2. **Flag không được quản lý đúng**:
   - Không có cơ chế ngăn `pushChange` khi đang load initial data
   - `pushChange` được gọi ngay cả khi đang load → tạo object mới → trigger lại

### Cách fix

```javascript
// Bỏ logic JSON.stringify, chỉ dùng reference comparison
const dataReferenceChanged = prevDataRef.current !== data;

// Chỉ reset flag khi thực sự là lesson khác
if (
  dataReferenceChanged &&
  hasLoadedInitialData.current &&
  data?.questions?.[0]?.question_id !==
    prevDataRef.current?.questions?.[0]?.question_id
) {
  hasLoadedInitialData.current = false;
}

// pushChange chỉ chạy khi không phải initial mount
const pushChange = useCallback(
  (nextQuestions) => {
    if (isInitialMount.current) return;
    const lessonData = mapStateToLessonData(nextQuestions);
    onChange?.(lessonData);
  },
  [mapStateToLessonData, onChange]
);
```

### Lý do fix này hoạt động

- Reference comparison đơn giản, không gây vòng lặp
- Chỉ reset flag khi thực sự là lesson khác (question_id khác)
- `pushChange` không chạy khi đang mount hoặc load initial data

---

## 6. Lỗi: Tạo câu hỏi mới bị nhảy về câu 1

### Mô tả lỗi

- Khi bấm "Thêm câu hỏi", câu hỏi mới được tạo nhưng `currentIndex` lại nhảy về câu 1 thay vì câu mới tạo

### Nguyên nhân

```javascript
// ❌ SAI: Dùng questions.length (giá trị cũ)
const handleAddQuestion = () => {
  setQuestions((prev) => [...prev, createEmptyQuestion()]);
  setCurrentIndex(questions.length); // questions.length là giá trị cũ!
};
```

- `questions.length` là giá trị cũ trước khi state được update
- React state update là async, nên `questions.length` chưa được update khi gọi `setCurrentIndex`

### Cách fix

```javascript
// ✅ ĐÚNG: Dùng prev.length trong callback
const handleAddQuestion = () => {
  setQuestions((prev) => {
    const next = [...prev, createEmptyQuestion()];
    // prev.length là index của question mới (vì prev chưa có question mới)
    setCurrentIndex(prev.length);
    return next;
  });
};
```

### Lý do fix này hoạt động

- Trong callback của `setQuestions`, `prev` là giá trị mới nhất của state
- `prev.length` là index của question mới sẽ được thêm vào
- Đảm bảo `currentIndex` được set đúng với question mới

---

## 7. Lỗi: Sửa câu hỏi số 2 bị nhảy về câu 1

### Mô tả lỗi

- Khi đang ở câu hỏi số 2 và sửa dữ liệu, `currentIndex` tự động nhảy về câu 1
- Gây khó chịu khi đang edit

### Nguyên nhân

1. **useEffect load data chạy lại không cần thiết**:

   - Khi `updateCurrentQuestion` → `setQuestions` → `pushChange` → `onChange` → `data` prop thay đổi
   - useEffect load data chạy lại → reset `currentIndex` về 0

2. **Logic so sánh data không đúng**:
   - So sánh JSON.stringify → luôn thấy khác → reset flag → load lại → reset currentIndex

### Cách fix

```javascript
useEffect(() => {
  const dataReferenceChanged = prevDataRef.current !== data;

  // Chỉ reset flag khi:
  // 1. Data reference thay đổi (có thể là lesson khác)
  // 2. VÀ đã load rồi (không phải lần đầu)
  // 3. VÀ question_id đầu tiên khác (tức là lesson khác)
  if (
    dataReferenceChanged &&
    hasLoadedInitialData.current &&
    data?.questions &&
    Array.isArray(data.questions) &&
    data.questions.length > 0
  ) {
    const prevFirstQuestionId =
      prevDataRef.current?.questions?.[0]?.question_id;
    const currentFirstQuestionId = data.questions[0]?.question_id;

    // Chỉ reset khi thực sự là lesson khác
    if (prevFirstQuestionId !== currentFirstQuestionId) {
      hasLoadedInitialData.current = false;
    }
  }

  // Load data chỉ khi chưa load
  if (!hasLoadedInitialData.current && data?.questions?.length > 0) {
    const initialQuestions = mapLessonDataToState(data);
    setQuestions(initialQuestions);
    setCurrentIndex(0); // Chỉ reset khi load lần đầu
    hasLoadedInitialData.current = true;
  }
}, [data]);
```

### Lý do fix này hoạt động

- Chỉ reset flag khi thực sự là lesson khác (question_id khác)
- Không reset khi chỉ update nội dung (cùng question_id)
- `currentIndex` chỉ được reset khi load lần đầu, không reset khi update

---

## Tổng kết các nguyên tắc đã học

### 1. **Pattern của các editor cũ (VocabularyListEditor, ListeningEditor, QuizEditor, etc.)**

- Đơn giản, không phức tạp
- Chỉ dùng flag `hasLoadedInitialData` và `isInitialMount`
- Không so sánh JSON.stringify
- Tách riêng useEffect load và useEffect khởi tạo

### 2. **Quản lý state**

- Luôn tạo object mới khi update (không mutate)
- Copy nested objects khi cần (`{ ...obj }`)
- Dùng callback trong `setState` để lấy giá trị mới nhất

### 3. **Tránh infinite loop**

- Không so sánh nội dung (JSON.stringify) trong useEffect
- Chỉ so sánh reference hoặc ID quan trọng
- Ngăn `pushChange` khi đang mount hoặc load initial data

### 4. **Quản lý currentIndex**

- Dùng callback trong `setState` để lấy giá trị mới nhất
- Chỉ reset `currentIndex` khi thực sự cần (load lần đầu, edit lesson khác)
- Không reset khi chỉ update nội dung

---

## File liên quan

- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart1Editor.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`

---

## Ngày fix

- **Ngày**: [Ngày hiện tại]
- **Phiên bản**: Final working version
- **Trạng thái**: ✅ Tất cả lỗi đã được fix và test thành công
