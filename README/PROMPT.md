# Prompt cho chỉnh sửa thuộc tính các trường

## Mục đích

Khi có thay đổi schema database (thêm/xóa/sửa các trường trong bảng), prompt này giúp tự động cập nhật toàn bộ code liên quan (models, APIs, services, controllers) để đảm bảo hệ thống hoạt động chính xác với schema mới.

## Cách sử dụng

1. Copy toàn bộ prompt này
2. Dán vào chat cùng với schema mới (CREATE TABLE statement)
3. Chỉ định tên bảng cần cập nhật
4. AI sẽ tự động phân tích và cập nhật tất cả code liên quan

---

## PROMPT

Tôi đã thay đổi schema database cho bảng **[TÊN_BẢNG]**. Dưới đây là schema mới:

```sql
[PASTE SCHEMA MỚI VÀO ĐÂY - CREATE TABLE statement]
```

**Yêu cầu:**

1. **Phân tích thay đổi:**

   - So sánh schema mới với model hiện tại trong code
   - Liệt kê các trường đã thêm, xóa, hoặc sửa đổi
   - Xác định các trường có thay đổi kiểu dữ liệu (VARCHAR → TEXT, INT → BIGINT, etc.)
   - Xác định các trường có thay đổi constraints (NULL → NOT NULL, DEFAULT values, ENUM values)

2. **Cập nhật Model:**

   - Cập nhật model file tương ứng (`backend/src/models/[TênModel].js`)
   - Thêm/xóa/sửa các fields theo schema mới
   - Cập nhật DataTypes cho các trường thay đổi
   - Cập nhật ENUM values nếu có
   - Cập nhật associations nếu có thay đổi foreign keys

3. **Cập nhật API Services:**

   - Tìm tất cả các service files liên quan đến bảng này
   - Cập nhật các hàm CREATE:
     - Thêm các trường mới vào payload
     - Xử lý parse JSON nếu là JSON field
     - Thêm validation cho các trường mới (nếu cần)
   - Cập nhật các hàm READ/QUERY:
     - Thêm các trường mới vào `attributes` khi select
     - Đảm bảo trả về đầy đủ dữ liệu
   - Cập nhật các hàm UPDATE:
     - Cho phép update các trường mới
     - Xử lý parse JSON nếu là JSON field
   - Cập nhật các hàm DELETE (nếu có thay đổi logic)

4. **Cập nhật Controllers:**

   - Kiểm tra các controller files liên quan
   - Đảm bảo controllers truyền đúng dữ liệu từ request body vào services
   - Cập nhật validation middleware nếu cần

5. **Validation:**

   - Thêm validation cho các trường mới (required, format, type)
   - Đảm bảo validation phù hợp với constraints trong schema
   - Thêm validation cho JSON fields (nếu có)

6. **Backward Compatibility:**

   - Đảm bảo code vẫn hoạt động với dữ liệu cũ (nếu có thể)
   - Xử lý default values cho các trường mới
   - Xử lý migration data nếu cần

7. **Kiểm tra toàn diện:**
   - Tìm tất cả các file có sử dụng model này
   - Kiểm tra các query, filter, sort có liên quan đến các trường thay đổi
   - Đảm bảo không có code nào bị break

**Lưu ý:**

- Nếu có thêm JSON field, cần xử lý parse/stringify đúng cách
- Nếu có thêm ENUM, cần cập nhật tất cả nơi sử dụng ENUM đó
- Nếu có thêm foreign key, cần cập nhật associations
- Nếu có thêm index, có thể tối ưu query nhưng không bắt buộc
- Giữ nguyên logic business hiện có, chỉ cập nhật để phù hợp với schema mới

**Output mong muốn:**

- Danh sách các file đã được cập nhật
- Tóm tắt các thay đổi đã thực hiện
- Các điểm cần lưu ý khi test
- Các breaking changes (nếu có)

Hãy bắt đầu phân tích và cập nhật code theo yêu cầu trên.
