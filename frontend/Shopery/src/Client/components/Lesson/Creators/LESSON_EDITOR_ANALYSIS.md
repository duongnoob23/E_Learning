# Phân Tích Flow Tạo Lesson Thủ Công Hiệu Quả

## Tổng Quan

Mục tiêu: Thiết kế editor cho phép admin tạo lesson một cách trực quan, dễ dàng, không cần hiểu về JSON hay data structure phức tạp.

## Nguyên Tắc Chung

1. **WYSIWYG (What You See Is What You Get)**: Admin thao tác trực tiếp trên UI giống như học viên sẽ thấy
2. **Auto-generate**: Hệ thống tự động sinh ra data structure từ thao tác của admin
3. **Visual Feedback**: Mọi thay đổi đều có feedback ngay lập tức
4. **Validation Real-time**: Kiểm tra lỗi ngay khi nhập, không đợi đến khi lưu

---

## 1. Vocabulary Sentence Completion

### Flow Nhập Tay Chuẩn (STEP-BY-STEP)

#### 🧩 STEP 1 – Nhập câu gốc

- **UI**: 1 textarea lớn với label "Câu hoàn chỉnh"
- **Ví dụ**: Admin nhập: `I am learning English every day`
- **Lưu ý**: Chưa có blank gì ở bước này

#### 🧩 STEP 2 – Chuyển sang chế độ "Tạo ô trống"

- **UI**: Button "Tạo chỗ trống" → Textarea chuyển thành rich-text editable
- **Thao tác**:
  1. Admin bôi đen từ `am`
  2. Click button "+ Blank" (hoặc phím tắt)
  3. Hệ thống wrap từ đó bằng `<blank>` (nội bộ)
  4. Hiển thị: `I [____] learning English every day`
- **Tiếp tục**: Bôi đen `English` → `I [____] learning [____] every day`
- **Mỗi blank tự có**:
  - `id`: uuid()
  - `answer`: "am" | "English"

#### 🧩 STEP 3 – Bảng quản lý Blank (tự sinh)

- **UI**: Bảng hiển thị ngay dưới textarea
  ```
  Blank      | Đáp án đúng
  Blank 1    | am
  Blank 2    | English
  ```
- **Chức năng**:
  - Sửa đáp án trực tiếp trong bảng
  - Xóa blank → text trở lại câu gốc
  - Thêm blank mới từ câu

#### 🧩 STEP 4 – Tạo danh sách từ kéo thả (Word Bank)

- **UI**: Input với label "Thêm từ nhiễu"
- **Thao tác**: Nhập từ → Enter để thêm tag
- **Ví dụ**: `is, are, the`
- **WordBank**: `[am, English, is, are, the]`
- **Lưu ý**: Admin không cần nhập lại đáp án đúng, hệ thống auto gộp

#### 🧩 STEP 5 – Preview nhanh (read-only)

- **UI**: Preview giống UI học viên
- **Hiển thị**:

  ```
  I [____] learning [____] every day

  [ am ] [ English ] [ is ] [ are ] [ the ]
  ```

- **Mục đích**: Giúp admin thấy chính xác UI học viên sẽ thấy

#### 🧩 STEP 6 – Cấu hình hành vi

- **Checkbox/Switch**:
  - ✅ Cho phép kéo thả
  - ✅ Hiện nút "Kiểm tra"
  - ✅ Hiện nút "Đáp án"
  - ✅ Tự sang câu khác khi đúng

#### 🧩 STEP 7 – Validate trước khi lưu

- **Không cho lưu nếu**:
  - Có blank nhưng không có đáp án
  - Word bank thiếu đáp án đúng
  - Câu rỗng
- **Khi OK** → Generate JSON tự động

### JSON Được Sinh Ra (AUTO)

```json
{
  "type": "vocabulary_sentence_completion",
  "questions": [
    {
      "question_id": 1,
      "vi_text": "Tôi đang học tiếng Anh mỗi ngày",
      "sentence_template": "I {blank1} learning {blank2} every day",
      "shuffled_words": [
        { "id": 1, "text": "am" },
        { "id": 2, "text": "English" },
        { "id": 3, "text": "is" },
        { "id": 4, "text": "are" },
        { "id": 5, "text": "the" }
      ],
      "blanks": [
        { "id": "blank1", "correct_word_id": 1 },
        { "id": "blank2", "correct_word_id": 2 }
      ]
    }
  ]
}
```

### ⚠️ Những Thứ KHÔNG Nên Làm

- ❌ Admin tự gõ `[____]`
- ❌ Admin nhập từng input blank riêng
- ❌ Admin viết JSON thủ công
- ❌ Lưu sentence chỉ là string

### 🧠 Tư Duy Cốt Lõi

- Admin chỉ thao tác trên TEXT + ACTION (bôi đen, click)
- Hệ thống chịu trách nhiệm sinh ra data structure

---

## 2. Vocabulary Matching

### Flow Nhập Tay Chuẩn

#### 🧩 STEP 1 – Chọn kích thước grid

- **UI**: Dropdown hoặc input số
- **Ví dụ**: 4×4 (16 ô = 8 cặp), 3×3 (9 ô = không hợp lệ)
- **Validation**: rows × cols phải là số chẵn

#### 🧩 STEP 2 – Thêm cặp từ

- **UI**: Form với 2 cột:
  - **Cột trái**: Text (Tiếng Việt) + URL ảnh (tùy chọn)
  - **Cột phải**: Text (Tiếng Anh)
- **Thao tác**: Click "Thêm cặp" → Điền form → Lưu
- **Validation**: Số cặp không được vượt quá (rows × cols) / 2

#### 🧩 STEP 3 – Preview grid

- **UI**: Hiển thị grid với các ô đã điền
- **Mục đích**: Xem trước cách hiển thị

#### 🧩 STEP 4 – Validate

- Kiểm tra: Số cặp = (rows × cols) / 2
- Cảnh báo nếu thiếu hoặc thừa

---

## 3. Vocabulary Translation

### Flow Nhập Tay Chuẩn

#### 🧩 STEP 1 – Nhập câu tiếng Việt

- **UI**: Textarea lớn
- **Ví dụ**: "vui mừng"

#### 🧩 STEP 2 – Thêm ảnh (tùy chọn)

- **UI**: Input URL hoặc upload
- **Preview**: Hiển thị ảnh ngay

#### 🧩 STEP 3 – Nhập đáp án đúng

- **UI**: Input text
- **Ví dụ**: "happy"
- **Validation**: Bắt buộc

#### 🧩 STEP 4 – Preview

- Hiển thị giống UI học viên

---

## 4. Vocabulary Quiz

### Flow Nhập Tay Chuẩn

#### 🧩 STEP 1 – Chọn loại câu hỏi

- **UI**: Radio buttons: Text / Image / Audio

#### 🧩 STEP 2 – Nhập nội dung câu hỏi

- **Nếu Text**: Textarea
- **Nếu Image**: Input URL + preview
- **Nếu Audio**: Input URL + player

#### 🧩 STEP 3 – Thêm các lựa chọn

- **UI**: Form cho mỗi choice:
  - Text (bắt buộc)
  - Image URL (tùy chọn)
  - Checkbox "Đáp án đúng"
- **Validation**: Ít nhất 1 đáp án đúng

#### 🧩 STEP 4 – Preview

- Hiển thị câu hỏi và các lựa chọn

---

## 5. Vocabulary Listening

### Flow Nhập Tay Chuẩn

#### 🧩 STEP 1 – Upload/URL Audio

- **UI**: Input URL hoặc upload file
- **Player**: Preview audio ngay

#### 🧩 STEP 2 – Chọn grid size

- **UI**: Dropdown: 3×3, 2×2, 4×4
- **Mặc định**: 3×3

#### 🧩 STEP 3 – Thêm cells

- **UI**: Form cho mỗi cell:
  - Text (Tiếng Việt) - bắt buộc
  - Image URL (tùy chọn)
  - Checkbox "Đáp án đúng"
- **Validation**:
  - Số cells = rows × cols
  - Ít nhất 1 đáp án đúng

#### 🧩 STEP 4 – Preview grid

- Hiển thị grid với cells

---

## 6. Vocabulary Image Choice

### Flow Nhập Tay Chuẩn

#### 🧩 STEP 1 – Chọn loại câu hỏi

- **UI**: Radio: Text / Audio

#### 🧩 STEP 2 – Nhập câu hỏi

- **Nếu Text**: Textarea
- **Nếu Audio**: Input URL + player

#### 🧩 STEP 3 – Thêm các ảnh

- **UI**: Form cho mỗi ảnh:
  - Image URL (bắt buộc)
  - Preview ảnh
  - Checkbox "Đáp án đúng"
- **Validation**: Ít nhất 1 đáp án đúng

#### 🧩 STEP 4 – Preview

- Hiển thị câu hỏi và grid ảnh

---

## 7. Vocabulary List

### Flow Nhập Tay Chuẩn

#### 🧩 STEP 1 – Chọn display mode

- **UI**: Radio: Flashcard / List

#### 🧩 STEP 2 – Thêm từ

- **UI**: Form cho mỗi từ:
  - English (bắt buộc)
  - Vietnamese (bắt buộc)
  - Image URL (tùy chọn)
  - Audio URL (tùy chọn)
  - Example sentence (tùy chọn)

#### 🧩 STEP 3 – Preview

- Hiển thị theo mode đã chọn

---

## Câu Hỏi Cần Làm Rõ

1. **Sentence Completion**:

   - ✅ Đã rõ: Flow bôi đen → tạo blank
   - ❓ Có cần hỗ trợ nhiều câu hỏi trong 1 lesson không?
   - ❓ Có cần câu tiếng Việt không? (hiện tại có)

2. **Matching**:

   - ❓ Có cần preview grid trực tiếp trong editor không?
   - ❓ Có cần drag & drop để sắp xếp lại cặp không?

3. **Translation**:

   - ❓ Có cần hỗ trợ nhiều đáp án đúng không? (ví dụ: "happy" hoặc "glad")
   - ❓ Có cần case-insensitive không?

4. **Quiz**:

   - ❓ Có cần nhiều đáp án đúng không? (multiple choice)
   - ❓ Có cần shuffle choices không?

5. **Listening**:

   - ❓ Có cần preview audio trong editor không?
   - ❓ Có cần limit số lần phát không?

6. **Image Choice**:

   - ❓ Có cần nhiều đáp án đúng không?
   - ❓ Grid size cố định hay có thể thay đổi?

7. **List**:
   - ❓ Có cần import từ file CSV/Excel không?
   - ❓ Có cần bulk edit không?

---

## Kết Luận

Mỗi lesson type cần có flow riêng phù hợp với đặc thù của nó, nhưng đều tuân theo nguyên tắc:

- **Visual**: Thao tác trực quan
- **Auto**: Tự động sinh data
- **Validate**: Kiểm tra real-time
- **Preview**: Xem trước nhanh

