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

---

# Prompt cho tích hợp nhiều loại Lesson vào Course Builder

## Mục đích

Hiện tại Course Builder chỉ hỗ trợ tạo video lesson. Cần tích hợp 8 loại lesson mới (vocabulary_list, vocabulary_matching, vocabulary_translation, vocabulary_quiz, vocabulary_listening, vocabulary_image_choice, vocabulary_sentence_completion, grammar_theory) vào Course Builder để có thể tạo khóa học với nhiều loại bài tập khác nhau.

## Cách sử dụng

1. Copy toàn bộ prompt này
2. Dán vào chat
3. AI sẽ tạo todo list chi tiết và thực hiện từng bước
4. Bắt đầu với UI trước, sau đó mới đến API

---

## PROMPT

Tôi cần tích hợp 8 loại lesson mới vào Course Builder. Hiện tại khi click "+ Add New Lesson" chỉ mở modal thêm video lesson. Tôi muốn:

1. **Khi click "+ Add New Lesson"** → Mở modal chọn loại lesson (9 loại: video + 8 loại mới)
2. **Sau khi chọn loại** → Mở LessonStudio tương ứng để tạo nội dung
3. **Dữ liệu phải được lưu** vào state của Course Builder, không mất khi đóng modal
4. **Khi submit course** → Dữ liệu lesson_data phải được gửi lên API đúng format

**Các loại lesson cần tích hợp:**

- `video` (hiện có)
- `vocabulary_list`
- `vocabulary_matching`
- `vocabulary_translation`
- `vocabulary_quiz`
- `vocabulary_listening`
- `vocabulary_image_choice`
- `vocabulary_sentence_completion`
- `grammar_theory`

**Yêu cầu:**

### BƯỚC 1: PHÂN TÍCH VÀ TẠO TODO LIST

1. **Phân tích cấu trúc hiện tại:**

   - Tìm file CourseBuilderTab.jsx và LessonFormModal.jsx
   - Hiểu cách dữ liệu được lưu trong state
   - Hiểu cách dữ liệu được gửi lên API khi submit
   - Xác định các file liên quan cần chỉnh sửa

2. **Tạo TODO LIST chi tiết:**
   - Liệt kê tất cả các file cần chỉnh sửa
   - Phân loại theo UI và API
   - Sắp xếp theo thứ tự thực hiện
   - Đánh dấu các phần không liên quan

### BƯỚC 2: CẬP NHẬT UI (THỰC HIỆN TRƯỚC)

#### 2.1. Tạo Modal chọn loại Lesson

- **File:** `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx` (mới)
- **Nội dung:**
  - Hiển thị 9 loại lesson với icon và mô tả
  - Layout grid hoặc list
  - Click vào loại → đóng modal này và mở LessonStudio tương ứng

#### 2.2. Cập nhật CourseBuilderTab

- **File:** `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`
- **Thay đổi:**
  - Thay `handleAddLesson` → mở LessonTypeSelectionModal thay vì LessonFormModal
  - Thêm state để lưu lesson_data cho từng lesson
  - Cập nhật `handleSaveLesson` để nhận lesson_data từ LessonStudio
  - Hiển thị loại lesson trong danh sách lessons (badge/icon)

#### 2.3. Tích hợp LessonStudio vào Course Builder

- **File:** `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx` (mới)
- **Nội dung:**
  - Wrapper cho LessonStudio component
  - Nhận props: `lessonType`, `initialData`, `onSave`, `onClose`
  - Khi save → gọi `onSave` với dữ liệu đầy đủ (title, lesson_type, lesson_data)
  - Đảm bảo dữ liệu được lưu vào state của CourseBuilderTab

#### 2.4. Cập nhật hiển thị Lesson trong danh sách

- **File:** `CourseBuilderTab.jsx`
- **Thay đổi:**
  - Hiển thị icon/badge cho từng loại lesson
  - Hiển thị số lượng câu hỏi/từ vựng (nếu có)
  - Khi edit → mở LessonStudio với dữ liệu đã lưu

#### 2.5. Cập nhật LessonFormModal (giữ lại cho video)

- **File:** `LessonFormModal.jsx`
- **Thay đổi:**
  - Chỉ dùng cho lesson_type = "video"
  - Hoặc có thể giữ nguyên và dùng cho video lesson

### BƯỚC 3: CẬP NHẬT DATA STRUCTURE

#### 3.1. Cập nhật cấu trúc lesson trong state

- **File:** `CourseBuilderTab.jsx` và `CreateCoursePage.jsx`
- **Thay đổi:**
  - Lesson object cần có: `id`, `title`, `lesson_type`, `lesson_data`, `metadata` (optional)
  - Đảm bảo backward compatible với lesson video cũ

#### 3.2. Cập nhật validation

- **File:** Validation logic trong CreateCoursePage
- **Thay đổi:**
  - Validate lesson_data theo lesson_type
  - Video lesson: yêu cầu videoUrl
  - Các lesson khác: yêu cầu lesson_data có đúng structure

### BƯỚC 4: CẬP NHẬT API (THỰC HIỆN SAU)

#### 4.1. Kiểm tra API createCourseWithDetails

- **File:** `backend/src/client/services/instructorClientService.js`
- **Đã có:** Hỗ trợ lesson_data (đã cập nhật trước đó)
- **Kiểm tra:** Đảm bảo nhận đúng format từ frontend

#### 4.2. Kiểm tra API addLesson

- **File:** `backend/src/client/services/instructorClientService.js`
- **Đã có:** Hỗ trợ lesson_data (đã cập nhật trước đó)
- **Kiểm tra:** Đảm bảo nhận đúng format từ frontend

#### 4.3. Cập nhật payload khi submit

- **File:** `CreateCoursePage.jsx` hoặc hook mutations
- **Thay đổi:**
  - Transform lesson data từ state → format API
  - Đảm bảo lesson_data được stringify đúng cách
  - Gửi lesson_type đúng với lesson_data

### BƯỚC 5: TESTING VÀ FIX

#### 5.1. Test UI flow

- Click "+ Add New Lesson" → Modal chọn loại hiện ra
- Chọn loại → LessonStudio mở ra
- Tạo nội dung → Save → Dữ liệu được lưu vào state
- Đóng modal → Mở lại → Dữ liệu vẫn còn
- Edit lesson → Mở LessonStudio với dữ liệu cũ

#### 5.2. Test API integration

- Submit course → Kiểm tra payload gửi lên
- Kiểm tra lesson_data được lưu đúng trong database
- Load lại course → Kiểm tra lesson_data được load đúng

**Lưu ý quan trọng:**

- Bắt đầu với UI trước, không động vào API cho đến khi UI hoàn chỉnh
- Đảm bảo dữ liệu được lưu trong state, không mất khi đóng modal
- Backward compatible: Các course cũ chỉ có video lesson vẫn hoạt động
- Mỗi loại lesson cần có icon/name rõ ràng để user dễ nhận biết

**Output mong muốn:**

1. TODO list chi tiết với tất cả các file cần chỉnh sửa
2. Thực hiện từng bước một, bắt đầu với UI
3. Test từng bước trước khi chuyển sang bước tiếp theo
4. Tóm tắt các thay đổi sau khi hoàn thành

Hãy bắt đầu bằng việc phân tích và tạo TODO list chi tiết.
