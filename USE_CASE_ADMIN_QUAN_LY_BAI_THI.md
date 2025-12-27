# USE CASE - ADMIN QUẢN LÝ BÀI THI

## USE CASE 1: XEM DANH SÁCH ĐỀ THI

**Tên use case:** Xem danh sách đề thi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin truy cập trang quản lý Assessment

**Mô tả:** Admin xem danh sách tất cả đề thi trong hệ thống.

**Luồng chính:**
1. Admin truy cập `/admin/assessment`
2. Hệ thống load và hiển thị danh sách đề thi với: ID, Title, Description, Type, Duration, Questions, Parts, Difficulty, Created On
3. Admin hover vào row để xem statistics tooltip (Total Sessions, Average Score)

**Luồng thay thế:**
- AF1: Admin tìm kiếm đề thi
- AF2: Admin lọc/sắp xếp đề thi

**Ngoại lệ:**
- E1: Không có đề thi → Hiển thị "No data"

---

## USE CASE 2: XEM CHI TIẾT ĐỀ THI

**Tên use case:** Xem chi tiết đề thi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Preview" trên đề thi

**Mô tả:** Admin xem chi tiết đề thi (read-only).

**Luồng chính:**
1. Admin click icon Preview
2. Hệ thống mở ExamPreviewModal
3. Hệ thống load chi tiết đề thi (test + parts + questions)
4. Admin xem thông tin đề thi, danh sách parts, và câu hỏi
5. Admin có thể navigate Previous/Next question

---

## USE CASE 3: TẠO ĐỀ THI MỚI

**Tên use case:** Tạo đề thi mới  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Add New Exam"

**Mô tả:** Admin tạo đề thi mới qua 3 bước: Exam Info → Parts → Questions.

**Luồng chính:**
1. Admin click "Add New Exam"
2. Hệ thống mở ExamBuilderModal với 3 tabs
3. **Tab 1 - Exam Info:** Admin nhập title, description, duration, difficulty
4. Admin click "Next" → Chuyển sang Tab 2
5. **Tab 2 - Parts:** Admin chọn parts cần thêm (Listening/Reading)
6. Admin click vào part → Chuyển sang Tab 3
7. **Tab 3 - Questions:** Admin thêm câu hỏi cho part đã chọn (question_text, choices, transcript, explanation)
8. Admin click "Submit"
9. Hệ thống tạo test → tạo parts → tạo questions (pipeline)
10. Hiển thị thông báo thành công và đóng modal

**Luồng thay thế:**
- AF1: Admin thêm nhiều câu hỏi cùng lúc (bulk add)
- AF2: Admin upload audio/image cho câu hỏi

**Ngoại lệ:**
- E1: Thiếu thông tin bắt buộc → Hiển thị lỗi validation
- E2: Part không có câu hỏi → Không tạo part đó

---

## USE CASE 4: CẬP NHẬT ĐỀ THI

**Tên use case:** Cập nhật đề thi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Edit" trên đề thi

**Mô tả:** Admin chỉnh sửa thông tin đề thi và câu hỏi.

**Luồng chính:**
1. Admin click icon Edit
2. Hệ thống mở ExamEditModal và load chi tiết đề thi
3. Admin chỉnh sửa: title, duration, description
4. Admin chỉnh sửa câu hỏi: question_text, choices, transcript, explanation
5. Admin click "Save"
6. Hệ thống cập nhật test và questions
7. Hiển thị thông báo thành công và refresh danh sách

**Ngoại lệ:**
- E1: Dữ liệu không hợp lệ → Hiển thị lỗi

---

## USE CASE 5: XÓA ĐỀ THI

**Tên use case:** Xóa đề thi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Delete" trên đề thi

**Mô tả:** Admin xóa đề thi và tất cả dữ liệu liên quan.

**Luồng chính:**
1. Admin click icon Delete
2. Hệ thống hiển thị confirm dialog
3. Admin xác nhận
4. Hệ thống xóa: TestCategoryRelation → Parts → Questions → Choices → Test
5. Hiển thị thông báo thành công và refresh danh sách

**Ngoại lệ:**
- E1: Đề thi không tồn tại → Hiển thị lỗi

---

## USE CASE 6: THÊM PART VÀO ĐỀ THI

**Tên use case:** Thêm Part vào đề thi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin đang tạo/sửa đề thi và thêm part

**Mô tả:** Admin thêm một Part (Listening/Reading) vào đề thi.

**Luồng chính:**
1. Admin chọn part cần thêm (Part 1, Part 2, ...)
2. Admin nhập: part_name, part_type, part_number, question_count, duration_minutes, description
3. Hệ thống tạo Part và gán vào Test
4. Admin có thể thêm câu hỏi vào part này

**Ngoại lệ:**
- E1: Part number đã tồn tại → Hiển thị lỗi

---

## USE CASE 7: THÊM CÂU HỎI VÀO PART

**Tên use case:** Thêm câu hỏi vào Part  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin đang tạo/sửa đề thi và thêm câu hỏi

**Mô tả:** Admin thêm một hoặc nhiều câu hỏi vào Part.

**Luồng chính:**
1. Admin chọn Part cần thêm câu hỏi
2. Admin nhập thông tin câu hỏi:
   - question_text, question_type, question_number
   - audio_file, image_file (tùy chọn)
   - transcript, explanation, grammar_notes
   - choices (ít nhất 2 choices, có 1 đáp án đúng)
3. Admin click "Thêm" (hoặc "Thêm nhiều" cho bulk)
4. Hệ thống tạo Question và Choices
5. Câu hỏi được thêm vào Part

**Luồng thay thế:**
- AF1: Admin thêm nhiều câu hỏi cùng lúc (bulk add)

**Ngoại lệ:**
- E1: Thiếu question_text hoặc choices → Hiển thị lỗi
- E2: Không có đáp án đúng → Hiển thị lỗi

---

## USE CASE 8: CẬP NHẬT CÂU HỎI

**Tên use case:** Cập nhật câu hỏi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin chỉnh sửa câu hỏi trong ExamEditModal

**Mô tả:** Admin cập nhật thông tin câu hỏi.

**Luồng chính:**
1. Admin chọn câu hỏi cần sửa
2. Admin chỉnh sửa: question_text, transcript, explanation, choices
3. Admin click "Lưu"
4. Hệ thống cập nhật Question và Choices
5. Hiển thị thông báo thành công

**Ngoại lệ:**
- E1: Dữ liệu không hợp lệ → Hiển thị lỗi

---

## USE CASE 9: XÓA CÂU HỎI

**Tên use case:** Xóa câu hỏi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Xóa" trên câu hỏi

**Mô tả:** Admin xóa câu hỏi khỏi Part.

**Luồng chính:**
1. Admin click "Xóa" trên câu hỏi
2. Hệ thống hiển thị confirm dialog
3. Admin xác nhận
4. Hệ thống xóa: Choices → Question
5. Hiển thị thông báo thành công

---

## USE CASE 10: XEM DANH SÁCH SESSIONS CỦA ĐỀ THI

**Tên use case:** Xem danh sách sessions của đề thi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Xem sessions" trên đề thi

**Mô tả:** Admin xem danh sách tất cả người dùng đã làm đề thi này.

**Luồng chính:**
1. Admin click "Xem sessions" hoặc truy cập `/admin/exam/tests/:test_id/sessions`
2. Hệ thống hiển thị danh sách sessions với: user_id, username, score, duration, completed_at
3. Admin có thể click vào session để xem chi tiết

**Ngoại lệ:**
- E1: Chưa có ai làm đề thi → Hiển thị "Chưa có session nào"

---

## USE CASE 11: XEM CHI TIẾT SESSION

**Tên use case:** Xem chi tiết session  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click vào một session

**Mô tả:** Admin xem chi tiết kết quả làm bài của một user.

**Luồng chính:**
1. Admin click vào session
2. Hệ thống hiển thị:
   - Thông tin user
   - Tổng điểm, thời gian làm bài
   - Danh sách câu trả lời (question, selected_choice, correct_choice)
   - Thống kê theo từng Part
3. Admin có thể xem chi tiết từng câu trả lời

---

## USE CASE 12: XEM THỐNG KÊ ĐỀ THI

**Tên use case:** Xem thống kê đề thi  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin hover vào đề thi hoặc click "Thống kê"

**Mô tả:** Admin xem thống kê tổng hợp về đề thi.

**Luồng chính:**
1. Admin hover vào row đề thi hoặc click "Thống kê"
2. Hệ thống hiển thị:
   - Tổng số sessions (số lượt thi)
   - Điểm trung bình
   - Part yếu nhất (nếu có)
   - Part mạnh nhất (nếu có)
   - Tỷ lệ đúng/sai

**Luồng thay thế:**
- AF1: Admin xem thống kê chi tiết trong modal/page riêng

---

**Mức độ ưu tiên:** Tất cả đều Cao  
**Tần suất sử dụng:** Cao




