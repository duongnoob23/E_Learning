# TOEIC Part 6 - Hướng dẫn phát triển hoàn chỉnh

## 📋 Mục lục

1. Tổng quan & khác biệt
2. Thiết kế đoạn văn đục lỗ (pattern khuyến nghị)
3. Luồng phát triển end-to-end
4. Các bước chi tiết
5. Lỗi thường gặp & cách tránh
6. Checklist Part 6

---

## 1. Tổng quan & khác biệt (Cách 1 - đơn giản, làm tay)

- Part 6 (Text Completion): Mỗi lỗ = 1 câu hỏi độc lập. Admin tự nhập đoạn văn, đặt placeholder “**\_**” vào vị trí cần điền cho câu hỏi đó. Nếu đoạn có nhiều lỗ, admin copy đoạn và xóa tay từng phần để tạo nhiều câu hỏi.
- Mỗi câu hỏi có **paragraph (có “**\_**”) + 4 đáp án text**.
- **Dịch nghĩa** luôn hiển thị.
- **Giải thích** chỉ hiển thị sau khi bấm **Kiểm tra đáp án**.
- Không cần audio, không cần image, không có transcript.

---

## 2. Thiết kế đoạn văn đục lỗ (Cách 1 - thủ công)

- Admin soạn đoạn văn và **tự chèn “**\_**”** tại vị trí cần điền cho câu hỏi đó.
- Mỗi lỗ = 1 câu hỏi riêng: copy đoạn, chừa đúng 1 “**\_**”, nhập 4 đáp án, chọn đáp án đúng, nhập dịch nghĩa và giải thích.
- Ưu điểm: dễ làm, ít code, reuse pattern Part 5.
- Nhược điểm: nếu đoạn có nhiều lỗ, admin phải copy đoạn nhiều lần (mỗi lỗ một câu hỏi).

---

## 3. Luồng phát triển end-to-end (Cách 1)

```
1) Thêm lesson type vào LessonTypeSelectionModal
2) Tạo Editor: ToeicPart6Editor (+CSS)
3) Tạo Viewer: ToeicPart6 (+CSS)
4) VisualEditor map type → editor
5) LessonComponentMapper map type → viewer
6) LessonStudio default data cho toeic_part_6
7) CourseBuilderTab & LessonStudioModal: parse/stringify lesson_data
8) Backend: thêm ENUM, validate lesson_data
9) Migration DB (nếu chưa)
10) Test: Create → Save → Edit → View; Check/Reset; import JSON
```

---

## 4. Các bước chi tiết (Cách 1 - thủ công, giống Part 5)

### B1: LessonTypeSelectionModal

- Thêm option:

```js
{ id: "toeic_part_6", name: "TOEIC Part 6", icon: HiDocumentDuplicate, description: "Text Completion" }
```

### B2: Data shape (đề xuất)

```json
{
  "type": "toeic_part_6",
  "questions": [
    {
      "question_id": "uuid",
      "question_number": 1,
      "paragraph": "(9 July)… came to Jakarta… _____ (143). ...",
      "options": [
        { "label": "A", "text": "heavy" },
        { "label": "B", "text": "heavily" },
        { "label": "C", "text": "heavier" },
        { "label": "D", "text": "heaviness" }
      ],
      "correctAnswer": "B",
      "translation": "Đoạn dịch nghĩa đầy đủ...",
      "explanation": "Giải thích tại sao chọn B; hiển thị sau Check."
    }
  ]
}
```

- `question_number = idx + 1` khi map state → lesson_data.
- Import JSON: câu mới nối tiếp số (last_question_number + 1).

### B3: Editor (ToeicPart6Editor)

- Form: paragraph (có placeholder “**\_**”), 4 đáp án text, correctAnswer, translation (luôn hiện), explanation (hiện sau Check).
- Preview: paragraph + 4 đáp án; nút Check/Reset; translation luôn hiển; explanation sau Check.
- Import JSON: sample + nút dán.
- State pattern như Part 1/2/3/5: `isInitialMount`, `hasLoadedInitialData`, `prevDataRef`, debounce `pushChange`.

### B4: Viewer (ToeicPart6)

- Parse lesson_data (object/string).
- Render paragraph với “**\_**” và 4 đáp án.
- Nút Check/Reset: highlight đúng/sai, explanation sau Check.
- Translation block luôn hiển thị.
- Navigation (nhiều câu): Prev/Next, Auto-switch, grid số câu (reuse Part 1 pattern nếu cần).

### B5: CSS

- Tương tự Part 5: chỉ text, không audio/image.
- Block translation luôn hiện; explanation block ẩn/hiện sau Check.

### B6: VisualEditor / LessonStudio / Mapper

- `VisualEditor.jsx`: case `toeic_part_6` → `ToeicPart6Editor`.
- `LessonStudio.jsx`: default data `toeic_part_6`.
- `LessonComponentMapper.jsx`: map `toeic_part_6` → `ToeicPart6`.

### B7: Backend/DB

- `backend/src/models/Lesson.js`: thêm `toeic_part_6` vào ENUM.
- Migration SQL: thêm giá trị.
- `validateLessonData` trong `instructorClientService.js`: với `toeic_part_6`, require `questions` array và mỗi item có `questionText` hoặc `paragraph`, `options` (4), `correctAnswer`.

### B8: Admin integration

- `CourseBuilderTab.jsx`: parse `lesson_data` khi edit; save đúng `lesson_data` + `lesson_type`.
- `LessonStudioModal.jsx`: parse `lesson_data` string.
- `CourseLessonsModal.jsx`: label “TOEIC Part 6”; parse `lesson_data` rồi render mapper.

---

## 5. Lỗi thường gặp & cách tránh

- Import JSON không nối số câu → luôn set `question_number = idx + 1` khi map state.
- Không reset state khi chuyển câu → phải reset `selectedChoice/hasChecked` trên change index.
- Explanation hiện sớm → chỉ hiển thị khi `hasChecked`.
- Dùng JSON.stringify trong useEffect → gây loop; chỉ so sánh reference hoặc question_id.

---

## 6. Checklist Part 6

- Lesson type
  - [ ] Thêm `toeic_part_6` vào LessonTypeSelectionModal.
  - [ ] Default data trong LessonStudio.
  - [ ] VisualEditor map editor.
  - [ ] LessonComponentMapper map viewer.
- Editor
  - [ ] Form: paragraph, options A-D, correctAnswer, translation, explanation.
  - [ ] Preview: paragraph + options; translation luôn hiện; explanation sau Check; Check/Reset.
  - [ ] Import JSON với sample; numbering tự tăng.
  - [ ] Debounce pushChange, guard initial mount.
- Viewer
  - [ ] Parse lesson_data; render paragraph + options.
  - [ ] Check/Reset; explanation sau Check; translation luôn hiện.
  - [ ] Navigation nếu nhiều câu.
- Backend/DB
  - [ ] ENUM thêm `toeic_part_6`; migration chạy.
  - [ ] validateLessonData hỗ trợ part 6.
- Admin
  - [ ] CourseBuilderTab parse/save.
  - [ ] LessonStudioModal parse initialData.
  - [ ] CourseLessonsModal label + render đúng.
- Test
  - [ ] Create → Save → Edit → View.
  - [ ] Import JSON nối số câu.
  - [ ] Check/Reset highlight + explanation sau Check.
  - [ ] Translation luôn hiển; navigation nhiều câu.
