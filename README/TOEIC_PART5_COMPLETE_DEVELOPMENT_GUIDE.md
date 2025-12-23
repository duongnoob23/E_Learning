# TOEIC Part 5 - Hướng dẫn phát triển hoàn chỉnh

## 📋 Mục lục

1. Tổng quan & khác biệt
2. Luồng phát triển từ đầu đến cuối
3. Các bước chi tiết
4. Các lỗi thường gặp và cách fix
5. Các lỗi AI hay mắc phải
6. Checklist khi phát triển Part 5

---

## Tổng quan

File này mô tả **toàn bộ quá trình phát triển TOEIC Part 5** (Incomplete Sentences) từ đầu đến cuối, bám sát pattern đã dùng cho Part 1/2/3.

**Đặc điểm riêng của Part 5**:

- Mỗi câu có **câu hỏi text + 4 đáp án text (A/B/C/D)**.
- **Không có audio, không có image, không có transcript**.
- Khi bấm **Kiểm tra đáp án**:
  - Highlight đúng/sai.
  - Hiển thị **dịch nghĩa** câu/đáp án.
  - Hiển thị **phân tích / giải thích** vì sao chọn đáp án.

---

## Luồng phát triển từ đầu đến cuối

### Tổng quan luồng

```
1. Thêm option vào LessonTypeSelectionModal
   ↓
2. Tạo Editor component (ToeicPart5Editor.jsx) + CSS
   ↓
3. Tạo Client component (ToeicPart5.jsx) + CSS
   ↓
4. VisualEditor: map type → editor
   ↓
5. LessonComponentMapper: map type → viewer
   ↓
6. LessonStudio/default data: thêm toeic_part_5
   ↓
7. CourseBuilderTab & LessonStudioModal: parse/stringify lesson_data
   ↓
8. Backend: ENUM lesson_type + validate lesson_data
   ↓
9. Migration DB: thêm toeic_part_5 (nếu chưa)
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
  id: "toeic_part_5",
  name: "TOEIC Part 5",
  icon: HiClipboardDocumentCheck, // dùng icon phù hợp
  description: "Incomplete Sentences - Câu chưa hoàn chỉnh",
}
```

---

### Bước 2: Thiết kế dữ liệu Part 5

Shape `lesson_data` đề xuất:

```json
{
  "type": "toeic_part_5",
  "questions": [
    {
      "question_id": "uuid-or-random",
      "question_number": 1,
      "questionText": "The contractor had a fifteen-percent _____ in his business...",
      "options": [
        { "label": "A", "text": "experience" },
        { "label": "B", "text": "growth" },
        { "label": "C", "text": "formula" },
        { "label": "D", "text": "incentive" }
      ],
      "correctAnswer": "B",
      "translation": "Nhà thầu đã có tăng trưởng 15% trong việc kinh doanh...",
      "analysis": "Câu kiểm tra danh từ/cụm danh từ phù hợp. 'growth' hợp với 'percent'.",
      "explanation": "Giải thích chi tiết vì sao chọn B."
    }
  ]
}
```

Nguyên tắc:

- `question_number` = `index + 1` khi map state → lesson_data.
- Import JSON: câu mới nối tiếp số (`last_question_number + 1`).

---

### Bước 3: Tạo Editor component

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart5Editor.jsx`

Yêu cầu:

- Tabs nhiều câu; nút Thêm câu hỏi; Import JSON (sample + nút dán).
- Form mỗi câu:
  - `questionText`
  - 4 options text (A-D)
  - Chọn `correctAnswer`
  - `translation` (dịch nghĩa)
  - `analysis` (phân tích)
  - `explanation` (giải thích vì sao chọn)
- Preview:
  - Hiển thị câu hỏi + 4 đáp án.
  - Nút **Kiểm tra đáp án / Xóa hết**.
  - Highlight đúng/sai sau khi Check.
  - Hiển thị translation + analysis + explanation sau khi Check.
- State/data pattern giống Part 1/2/3:
  - `isInitialMount`, `hasLoadedInitialData`, `prevDataRef`.
  - `mapStateToLessonData`, `mapLessonDataToState`.
  - Debounce `pushChange` ~150ms.
  - Không dùng JSON.stringify trong useEffect; chỉ so sánh reference / question_id.

CSS:

- Có thể reuse layout Part 3 (không audio/image), chỉ text.

---

### Bước 4: Tạo Client component

**File**: `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart5.jsx`

Yêu cầu:

- Parse `lesson_data` (string/object).
- Render câu hỏi + 4 đáp án text.
- Nút Check/Reset:
  - Check: highlight đúng/sai, hiển translation + analysis + explanation.
  - Reset: xóa chọn, ẩn giải thích.
- Navigation (nhiều câu): Prev/Next, Auto-switch (nếu muốn reuse pattern Part 1), grid số câu.

CSS:

- Giống pattern Part 3 nhưng bỏ audio/image; giữ block translation/analysis/explanation.

---

### Bước 5: Integrate Editor vào VisualEditor

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

```javascript
import ToeicPart5Editor from "./editors/ToeicPart5Editor";
// ...
case "toeic_part_5":
  return <ToeicPart5Editor data={data} onChange={onChange} />;
```

---

### Bước 6: Thêm default data

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`

```javascript
toeic_part_5: { type: "toeic_part_5", questions: [] },
```

---

### Bước 7: Integrate Client component vào LessonComponentMapper

**File**: `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

```javascript
import ToeicPart5 from "./Toeic/ToeicPart5";
// ...
toeic_part_5: ToeicPart5,
```

---

### Bước 8: Database & Backend

- `backend/src/models/Lesson.js`: thêm `toeic_part_5` vào ENUM nếu chưa.
- Migration SQL: thêm giá trị `toeic_part_5` (cùng các part khác).
- `validateLessonData` trong `backend/src/client/services/instructorClientService.js`:
  - Với `toeic_part_5`, require `questions` array; mỗi item có `questionText`, `options` (4), `correctAnswer`.

---

### Bước 9: Admin integration

- `CourseBuilderTab.jsx`: parse `lesson_data` khi edit; save đúng `lesson_data` + `lesson_type`.
- `LessonStudioModal.jsx`: parse `lesson_data` nếu là string.
- `CourseLessonsModal.jsx`: label hiển thị “TOEIC Part 5” và parse `lesson_data` trước khi render mapper.

---

## Các lỗi thường gặp và cách fix

1. **Import JSON không nối số câu**

- Nguyên nhân: lấy `question_number` từ JSON.
- Fix: khi map state → lesson_data, luôn set `question_number = idx + 1`.

2. **Highlight sai trạng thái**

- Nguyên nhân: không reset khi chuyển câu.
- Fix: khi đổi `currentIndex` → reset `selectedChoice`, `hasChecked`.

3. **Translation/analysis/explanation không hiện sau Check**

- Nguyên nhân: ràng buộc vào state sai.
- Fix: hiển thị block khi `hasChecked[question_id] === true`.

4. **Loop useEffect**

- Nguyên nhân: dùng JSON.stringify.
- Fix: so sánh reference / question_id; guard `isInitialMount`.

---

## Các lỗi AI hay mắc phải

- Dùng lại layout Part 3 (có audio/image) → thừa field. Part 5 chỉ text.
- Quên parse `lesson_data` string → modal edit trống.
- Không reset state khi đổi câu → highlight sai câu.
- Import JSON: ghi đè `question_number` từ file → thứ tự sai.

---

## Checklist khi phát triển Part 5

### Phase 1: Setup

- [ ] LessonTypeSelectionModal thêm `toeic_part_5`.
- [ ] Default data `toeic_part_5` trong LessonStudio.
- [ ] VisualEditor map editor.

### Phase 2: Editor

- [ ] Form: questionText, 4 options text, correctAnswer, translation, analysis, explanation.
- [ ] Preview: check/reset, highlight, hiện translation/analysis/explanation sau check.
- [ ] Import JSON + sample + nút dán; numbering tự tăng.
- [ ] Debounce pushChange, guard initial mount.

### Phase 3: Viewer

- [ ] Parse lesson_data; render câu hỏi + 4 đáp án text.
- [ ] Check/Reset logic; hiện translation/analysis/explanation sau Check.
- [ ] Navigation prev/next + grid (nếu nhiều câu).

### Phase 4: Backend/DB

- [ ] ENUM thêm `toeic_part_5`; migration chạy.
- [ ] validateLessonData cho part 5.

### Phase 5: Admin

- [ ] CourseBuilderTab parse/save.
- [ ] LessonStudioModal parse initialData.
- [ ] CourseLessonsModal render đúng (mapper + label).

### Phase 6: Test

- [ ] Create → Save → Edit → View.
- [ ] Import JSON nối số câu.
- [ ] Check/Reset highlight + giải thích.
- [ ] Navigation nhiều câu.

---

## File liên quan (cần tạo/sửa khi implement)

Frontend:

- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`
- `frontend/Shopery/src/Admin/features/courses2/components/CourseLessonsModal.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart5Editor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/ToeicPart5Editor.css`
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart5.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Toeic/ToeicPart5.css`
- `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

Backend:

- `backend/src/models/Lesson.js`
- `backend/src/client/services/instructorClientService.js`
- `backend/database/migrations/add_toeic_parts_to_lesson_type.sql`

---

## Ngày tạo và cập nhật

- **Ngày tạo**: [Ngày hiện tại]
- **Phiên bản**: 1.0
- **Trạng thái**: Draft guideline cho Part 5 (bám pattern Part 1/2/3)
