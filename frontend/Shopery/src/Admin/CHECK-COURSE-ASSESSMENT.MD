# ✅ CHECKLIST TEST - COURSE & ASSESSMENT MANAGEMENT

## 📋 TỔNG QUAN

File này liệt kê **toàn bộ chức năng** cần test cho 2 module chính:

- **Assessment (Exam)** - `/admin/assessment`
- **Course** - `/admin/courses`

---

## 🎯 MODULE 1: ASSESSMENT (EXAM) MANAGEMENT

### 1.1. XEM DANH SÁCH ASSESSMENT (`CoursesPage.jsx`)

#### ✅ Test Cases:

- [ ] **Load danh sách đề thi**

  - [ ] API `GET /admin/exam/tests` được gọi khi vào trang
  - [ ] Hiển thị loading state khi đang fetch
  - [ ] Hiển thị bảng với đầy đủ cột: ID, Title, Description, Type, Duration, Questions, Parts, Difficulty, Created On
  - [ ] Hiển thị "No data" khi không có đề thi
  - [ ] Hiển thị lỗi khi API fail

- [ ] **Hover vào row để xem statistics**

  - [ ] Hover vào 1 row → gọi API `GET /admin/exam/tests/:test_id/statistics`
  - [ ] Hiển thị tooltip với: Total Sessions, Average Score
  - [ ] Tooltip follow mouse position
  - [ ] Tooltip tự ẩn khi mouse leave

- [ ] **Preview Assessment**

  - [ ] Click icon Preview → mở `ExamPreviewModal`
  - [ ] Modal load chi tiết: `GET /admin/exam/tests/detail/:test_id`
  - [ ] Hiển thị sidebar với danh sách parts
  - [ ] Hiển thị câu hỏi hiện tại (read-only)
  - [ ] Navigation Previous/Next question hoạt động
  - [ ] Đóng modal bằng nút X hoặc click backdrop

- [ ] **Edit Assessment**

  - [ ] Click icon Edit → mở `ExamEditModal`
  - [ ] Modal load chi tiết đề thi + parts + questions
  - [ ] Có thể chỉnh sửa thông tin test (title, duration, description)
  - [ ] Có thể chỉnh sửa từng câu hỏi (text, choices, transcript, explanation)
  - [ ] Click Save → gọi `PATCH /admin/exam/tests/:test_id` + `PATCH /admin/exam/questions/:question_id`
  - [ ] Sau khi save thành công → đóng modal + refresh list

- [ ] **Delete Assessment**
  - [ ] Click icon Delete → hiện confirm dialog
  - [ ] Confirm → gọi `DELETE /admin/exam/tests/:test_id`
  - [ ] Sau khi xóa thành công → refresh list
  - [ ] Hiển thị toast success/error

---

### 1.2. TẠO ASSESSMENT MỚI (`ExamBuilderModal`)

#### ✅ Test Cases:

- [ ] **Mở modal tạo mới**

  - [ ] Click button "Add New Exam" → mở `ExamBuilderModal`
  - [ ] Modal có 3 tabs: Exam Info, Parts, Questions

- [ ] **Tab 1: Exam Info (`ExamInfoTab`)**

  - [ ] Nhập Title (validation: >= 3 ký tự)
  - [ ] Nhập Description
  - [ ] Chọn Difficulty (EASY/MEDIUM/HARD)
  - [ ] Nhập Duration (hoặc check "No Time Limit")
  - [ ] Validation: nếu không check "No Time Limit" → duration phải > 0
  - [ ] Có thể điều hướng sang Tab 2

- [ ] **Tab 2: Parts (`PartsTab`)**

  - [ ] Chọn mode: "all" | "reading" | "listening"
  - [ ] Hiển thị 7 parts (P1-P7) với số câu hỏi đã thêm
  - [ ] Click "Edit Questions" cho 1 part → chuyển sang Tab 3 với part đó được chọn
  - [ ] Có thể bật/tắt từng part

- [ ] **Tab 3: Questions (`QuestionsTab`)**

  - [ ] Hiển thị part đang được chọn
  - [ ] Thêm câu hỏi mới: question_text, choices (A/B/C/D), correct answer, transcript, explanation
  - [ ] Validation: phải có ít nhất 1 câu hỏi trong part để submit
  - [ ] Có thể xóa câu hỏi
  - [ ] Có thể chỉnh sửa câu hỏi đã thêm

- [ ] **Submit Pipeline (3 bước tuần tự)**
  - [ ] **Bước 1**: Tạo test → `POST /admin/exam/tests`
    - [ ] Payload đúng: title, duration, description, total_questions, total_parts, difficulty_level
    - [ ] Nhận được `test_id` từ response
  - [ ] **Bước 2**: Tạo parts → `POST /admin/exam/tests/:test_id/parts` (lặp cho mỗi part có câu hỏi)
    - [ ] Payload đúng: part_name, part_type, part_number, question_count
    - [ ] Nhận được `part_id` từ response
  - [ ] **Bước 3**: Thêm questions → `POST /admin/exam/parts/:part_id/questions` (bulk)
    - [ ] Payload đúng: questions array với question_text, choices, transcript, explanation
  - [ ] Sau khi tất cả thành công → đóng modal + refresh list
  - [ ] Nếu có lỗi ở bất kỳ bước nào → hiển thị error + không đóng modal

---

## 🎯 MODULE 2: COURSE MANAGEMENT

### 2.1. XEM DANH SÁCH COURSE (`CoursesPage2.jsx`)

#### ✅ Test Cases:

- [ ] **Load danh sách khóa học**

  - [ ] API `GET /course?...` được gọi với params: page, limit, title, sort_by
  - [ ] Hiển thị loading state
  - [ ] Hiển thị bảng với cột: Title, Status, Enrollments, Rating, Created On
  - [ ] Hiển thị "No courses found" khi không có data
  - [ ] Hiển thị lỗi khi API fail

- [ ] **Search & Filter**

  - [ ] Nhập vào search box → filter theo title (debounce 500ms)
  - [ ] Chọn Filter → Status (All/Published/Draft/Pending Review)
  - [ ] Filter hoạt động đúng với data

- [ ] **Sort**

  - [ ] Sort by Created On (newest/oldest)
  - [ ] Sort by Enrollments (high/low)
  - [ ] Sort by Rating (high/low)
  - [ ] Sort hoạt động đúng

- [ ] **Pagination**

  - [ ] Hiển thị pagination khi total_pages > 1
  - [ ] Click Prev/Next → chuyển trang đúng
  - [ ] Click số trang → jump đến trang đó
  - [ ] Disable Prev khi ở trang đầu, Disable Next khi ở trang cuối

- [ ] **Select & Bulk Actions**

  - [ ] Click checkbox từng row → select/deselect
  - [ ] Click checkbox header → select all / deselect all
  - [ ] Khi có row được chọn → hiện bulk actions bar
  - [ ] Click "Delete Selected" → xóa tất cả courses đã chọn

- [ ] **KPI Cards**

  - [ ] Total Courses: đếm đúng từ tất cả courses
  - [ ] Published Courses: đếm đúng status = "published"
  - [ ] Draft Courses: đếm đúng status = "draft"
  - [ ] Total Enrollments: tổng total_students từ tất cả courses

- [ ] **Action Menu (từng course)**
  - [ ] Click icon 3 chấm → mở dropdown menu
  - [ ] **Preview**: mở `CoursePreviewModal`
  - [ ] **View Lessons**: mở `CourseLessonsModal`
  - [ ] **Edit**: mở `EditCourseModal`
  - [ ] **Publish/Unpublish**: toggle status (hiện chỉ log)
  - [ ] **Duplicate**: duplicate course (hiện chỉ log)
  - [ ] **Delete**: xóa course với confirm

---

### 2.2. TẠO COURSE MỚI (`CreateCoursePage`)

#### ✅ Test Cases:

- [ ] **Mở modal tạo mới**

  - [ ] Click button "Add New Course" → mở modal với `CreateCoursePage`
  - [ ] Modal có 4 tabs: Course Info, Course Intro Video, Course Builder, Additional Information

- [ ] **Tab 1: Course Info (`CourseInfoTab`)**

  - [ ] Nhập Title
  - [ ] Nhập Slug (auto-generate từ title)
  - [ ] Nhập About/Description
  - [ ] Chọn Price Type: Free hoặc Paid
  - [ ] Nếu Paid → nhập Regular Price, Discounted Price
  - [ ] Chọn Category (dropdown)
  - [ ] Upload Thumbnail
  - [ ] Nhập Tags (comma-separated)

- [ ] **Tab 2: Course Intro Video (`CourseIntroVideoTab`)**

  - [ ] Chọn Video Source: YouTube / Vimeo / Google Drive / Local Upload
  - [ ] Nhập Video URL
  - [ ] Validation: URL hợp lệ

- [ ] **Tab 3: Course Builder (`CourseBuilderTab`)**

  - [ ] **Quản lý Modules**:
    - [ ] Thêm module mới: title, description
    - [ ] Sửa module: click Edit → mở form
    - [ ] Xóa module: confirm → xóa
    - [ ] Reorder modules (nếu có)
  - [ ] **Quản lý Lessons trong module**:
    - [ ] Thêm lesson: click "Add Lesson" → mở `LessonFormModal`
    - [ ] Nhập: title, description, content, videoUrl, duration, isFree
    - [ ] Sửa lesson: click Edit → mở `LessonFormModal` với data cũ
    - [ ] Xóa lesson: confirm → xóa
    - [ ] Reorder lessons (nếu có)

- [ ] **Tab 4: Additional Information (`AdditionalInformationTab`)**

  - [ ] Chọn Start Date
  - [ ] Chọn Language
  - [ ] Nhập Requirements (multi-line)
  - [ ] Nhập Long Description (multi-line)
  - [ ] Nhập Duration (hours, minutes)
  - [ ] Nhập Targeted Audience (multi-line)

- [ ] **Submit Pipeline**
  - [ ] **Option 1**: Gọi `POST /instructor/courses/with-details` (tất cả trong 1 request)
    - [ ] Payload bao gồm: course + courseDetail + tags + modules + lessons
  - [ ] **Option 2**: Tạo từng phần (nếu API không hỗ trợ bulk)
    - [ ] Bước 1: `POST /instructor/courses` → nhận `course_id`
    - [ ] Bước 2: `POST /instructor/courses/:course_id/modules` (lặp cho mỗi module)
    - [ ] Bước 3: `POST /instructor/modules/:module_id/lessons` (lặp cho mỗi lesson)
  - [ ] Sau khi thành công → đóng modal + refresh list
  - [ ] Nếu có lỗi → hiển thị error message

---

### 2.3. PREVIEW COURSE (`CoursePreviewModal`)

#### ✅ Test Cases:

- [ ] **Load data**

  - [ ] Gọi `GET /course/courses/:course_id/preview` → course detail
  - [ ] Gọi `GET /course/:course_id/structure` → modules + lessons
  - [ ] Hiển thị loading state

- [ ] **Hiển thị thông tin**

  - [ ] Header: Title, Category, Rating, Total lessons, Duration, Students
  - [ ] Video preview hoặc Image thumbnail
  - [ ] Tabs: "Giới thiệu" / "Nội dung"
  - [ ] Tab "Nội dung": Accordion modules → lessons list

- [ ] **Đóng modal**
  - [ ] Click nút X hoặc backdrop → đóng

---

### 2.4. XEM LESSONS (`CourseLessonsModal`)

#### ✅ Test Cases:

- [ ] **Load structure**

  - [ ] Gọi `GET /course/:course_id/structure`
  - [ ] Hiển thị sidebar bên phải: modules (accordion) → lessons list

- [ ] **Video player**

  - [ ] Bên trái: video player (YouTube embed)
  - [ ] Click lesson → load video từ `lesson.videoUrl`
  - [ ] Video player hoạt động đúng

- [ ] **Edit lesson**
  - [ ] Click icon Edit trên lesson → mở `EditLessonModal`
  - [ ] Form pre-fill với data hiện có
  - [ ] Save → `PATCH /instructor/lessons/:lesson_id`
  - [ ] Sau khi save → refresh structure

---

### 2.5. CHỈNH SỬA COURSE (`EditCourseModal`)

#### ✅ Test Cases:

- [ ] **Load data**

  - [ ] Gọi `GET /course/courses/:course_id/preview` → course detail
  - [ ] Gọi `GET /course/:course_id/structure` → modules + lessons
  - [ ] Form pre-fill với data hiện có

- [ ] **Chỉnh sửa thông tin course**

  - [ ] Sửa title, description, price, category, thumbnail, video preview
  - [ ] Save → `PATCH /instructor/courses/:course_id`
  - [ ] Sau khi save → refresh list

- [ ] **Chỉnh sửa modules**

  - [ ] Sửa title, description của module
  - [ ] Save → `PATCH /instructor/modules/:module_id`
  - [ ] Xóa module → `DELETE /instructor/modules/:module_id`

- [ ] **Chỉnh sửa lessons**

  - [ ] Sửa title, videoUrl, duration, isFree của lesson
  - [ ] Save → `PATCH /instructor/lessons/:lesson_id`
  - [ ] Xóa lesson → `DELETE /instructor/lessons/:lesson_id`

- [ ] **Sau khi save tất cả**
  - [ ] Refresh list courses
  - [ ] Đóng modal

---

### 2.6. XÓA COURSE

#### ✅ Test Cases:

- [ ] **Xóa 1 course**

  - [ ] Click Delete trong action menu → confirm dialog
  - [ ] Confirm → gọi `DELETE /admin/courses/:id`
  - [ ] Sau khi xóa thành công → refresh list + hiện toast

- [ ] **Xóa nhiều courses (bulk)**
  - [ ] Select nhiều courses → click "Delete Selected"
  - [ ] Confirm → gọi DELETE cho từng course
  - [ ] Sau khi xóa → refresh list

---

## 🔍 TEST CROSS-MODULE

### ✅ Test Cases Chung:

- [ ] **Error Handling**

  - [ ] API trả về `EC !== "0"` → hiển thị toast error với message từ `EM`
  - [ ] Network error → hiển thị error message
  - [ ] Loading state được hiển thị đúng lúc

- [ ] **Cache Invalidation**

  - [ ] Sau khi CREATE → invalidate list queries
  - [ ] Sau khi UPDATE → invalidate detail + list queries
  - [ ] Sau khi DELETE → invalidate list queries

- [ ] **Responsive Design**

  - [ ] Bảng hiển thị đúng trên mobile/tablet/desktop
  - [ ] Modal responsive
  - [ ] Filter sidebar collapse trên mobile

- [ ] **Accessibility**
  - [ ] Keyboard navigation hoạt động (Tab, Enter, Escape)
  - [ ] ARIA labels đầy đủ
  - [ ] Focus management trong modal

---

## 📝 NOTES

- **API Response Format**: Tất cả API trả về `{ EC: "0" | "1", EM: "message", DT: data }`
- **Query Keys**:
  - Assessment: `["ListExamsAdmin"]`, `adminExamKeys.*`
  - Course: `["ListCourses"]`, `adminCoursesKeys.*`
- **Routes**:
  - Assessment: `/admin/assessment`
  - Course: `/admin/courses`
  - Create Course: `/admin/create-course` (hoặc modal)

---

**Cập nhật lần cuối**: [Ngày test]
**Người test**: [Tên]
**Status**: ⏳ Chưa bắt đầu / 🟡 Đang test / ✅ Hoàn thành
