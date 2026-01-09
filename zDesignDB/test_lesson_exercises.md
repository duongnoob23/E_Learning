# 🧪 Hướng dẫn Test Lesson Exercises

## 📋 Các bước kiểm tra

### 1. Chạy SQL INSERT

```bash
mysql -u root -p e_learnning6 < zDesignDB/insert_lesson_examples.sql
```

Hoặc chạy từng câu lệnh trong file SQL.

### 2. Kiểm tra trong Database

```sql
-- Xem tất cả lessons vừa thêm
SELECT
  lesson_id,
  title,
  lesson_type,
  has_exercise,
  exercise_type,
  exercise_data
FROM lessons
WHERE course_id = 1  -- Thay đổi course_id của bạn
ORDER BY sort_order;
```

### 3. Test trên Frontend

1. **Mở trang Lesson**: `/lesson/:course_id`
2. **Chọn lesson có `has_exercise = 1`**
3. **Kiểm tra các dạng bài tập:**

#### ✅ Multiple Choice (Trắc nghiệm)

- Lesson: "Pronunciation Practice – Bài tập Trắc nghiệm"
- Kiểm tra:
  - Hiển thị câu hỏi và các lựa chọn
  - Click chọn đáp án
  - Click "Xác nhận" → Hiển thị kết quả đúng/sai
  - Navigation: Trước/Sau
  - Hiển thị điểm số và pass_score

#### ✅ Pair Matching (Tìm cặp)

- Lesson: "Luyện tập: Tìm cặp từ vựng"
- Kiểm tra:
  - Hiển thị 2 cột: Từ tiếng Anh và Nghĩa tiếng Việt
  - Click vào từ → Click vào nghĩa tương ứng
  - Khi ghép đúng → Hiển thị màu xanh, disabled
  - Khi ghép hết → Hiển thị "Hoàn thành!"

#### ✅ Translation (Dịch nghĩa)

- Lesson: "Luyện tập: Dịch nghĩa"
- Kiểm tra:
  - Hiển thị từ cần dịch
  - Nhập đáp án vào input
  - Click "Kiểm tra" → Hiển thị đúng/sai
  - Hiển thị gợi ý nếu có
  - Navigation: Trước/Sau

#### ✅ Vocabulary List (Danh sách từ vựng)

- Lesson: "Từ vựng: Danh sách từ vựng (Cơ bản)"
- Kiểm tra:
  - Hiển thị grid các từ vựng
  - Mỗi card có: từ, phiên âm, nghĩa, ví dụ
  - Click nút để phát âm (nếu có audio)

#### ✅ Video + Exercise

- Lesson: "Present Simple - Lý thuyết và Bài tập"
- Kiểm tra:
  - Hiển thị video player
  - Hiển thị content (lý thuyết)
  - Hiển thị bài tập bên dưới

#### ✅ Chỉ Video (không có bài tập)

- Lesson: "Past Simple - Lý thuyết"
- Kiểm tra:
  - Chỉ hiển thị video và content
  - KHÔNG hiển thị phần bài tập

## 🐛 Troubleshooting

### Lỗi: "exercise_data is null"

- Kiểm tra: `exercise_data` có được parse đúng không
- Frontend tự động parse nếu là string JSON

### Lỗi: "Loại bài tập không được hỗ trợ"

- Kiểm tra: `exercise_type` có đúng không
- Các loại hỗ trợ: `multiple_choice`, `pair_matching`, `translation`, `vocabulary_list`

### Lỗi: "Chưa có câu hỏi nào"

- Kiểm tra: `exercise_data.questions` hoặc `exercise_data.pairs` có dữ liệu không
- Kiểm tra cấu trúc JSON có đúng không

## 📝 Ghi chú

- **MySQL 5.7+** hỗ trợ JSON functions
- Nếu dùng MySQL cũ hơn, có thể lưu `exercise_data` dạng TEXT và parse ở backend
- Frontend tự động parse cả string JSON và object

## ✅ Checklist

- [ ] Đã chạy SQL INSERT
- [ ] Đã kiểm tra trong database
- [ ] Đã test Multiple Choice
- [ ] Đã test Pair Matching
- [ ] Đã test Translation
- [ ] Đã test Vocabulary List
- [ ] Đã test Video + Exercise
- [ ] Đã test chỉ Video (không có exercise)
