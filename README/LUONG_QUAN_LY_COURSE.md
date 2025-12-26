# 📚 TÀI LIỆU TỔNG HỢP LUỒNG QUẢN LÝ KHÓA HỌC (COURSE MANAGEMENT FLOW)

## 🎯 TỔNG QUAN

Tài liệu này mô tả chi tiết **toàn bộ luồng quản lý khóa học** trong hệ thống E-Learning, bao gồm:
1. **Luồng Admin** - Tạo, quản lý, duyệt khóa học
2. **Luồng Client** - Xem, đăng ký, học khóa học
3. **Cấu trúc dữ liệu** - Modules, Lessons, Lesson Types
4. **API Endpoints** - Tất cả các API liên quan
5. **Database Schema** - Cấu trúc bảng dữ liệu

---

## 📋 MỤC LỤC

1. [Luồng Admin - Quản lý khóa học](#1-luồng-admin---quản-lý-khóa-học)
2. [Luồng Client - Học khóa học](#2-luồng-client---học-khóa-học)
3. [Cấu trúc dữ liệu khóa học](#3-cấu-trúc-dữ-liệu-khóa-học)
4. [API Endpoints](#4-api-endpoints)
5. [Database Schema](#5-database-schema)
6. [Sơ đồ luồng tổng quan](#6-sơ-đồ-luồng-tổng-quan)

---

## 1. LUỒNG ADMIN - QUẢN LÝ KHÓA HỌC

### 1.1. Tổng quan luồng Admin

```
Admin đăng nhập
    ↓
Vào trang quản lý khóa học (CoursesPage2.jsx)
    ↓
[UC-ADMIN-COURSE-001] Xem danh sách khóa học
    ↓
Có thể thực hiện:
    ├─> [UC-ADMIN-COURSE-003/004] Tạo khóa học mới
    ├─> [UC-ADMIN-COURSE-002] Xem chi tiết khóa học
    ├─> [UC-ADMIN-COURSE-005] Cập nhật khóa học
    ├─> [UC-ADMIN-COURSE-006] Xóa khóa học
    ├─> [UC-ADMIN-COURSE-007/008/009] Quản lý Modules
    ├─> [UC-ADMIN-COURSE-010/011/012] Quản lý Lessons
    └─> [UC-ADMIN-COURSE-013/014] Duyệt/Từ chối khóa học
```

### 1.2. UC-ADMIN-COURSE-001: Xem danh sách khóa học

**Mô tả:** Admin xem tất cả khóa học trong hệ thống với khả năng filter và search.

**Frontend:**
- File: `frontend/Shopery/src/Admin/features/courses2/pages/CoursesPage2.jsx`
- Component: Bảng danh sách với filter sidebar

**Backend:**
- Controller: `backend/src/admin/controllers/courseAdminController.js` → `getCourses()`
- Service: `backend/src/admin/services/courseAdminService.js`
- Route: `GET /api/admin/courses`

**API Frontend:**
- File: `frontend/Shopery/src/Admin/features/courses2/api/coursesAdminApi.jsx`
- Function: `getCourses(params)`

**Query Parameters:**
- `status`: Trạng thái khóa học (pending, approved, rejected, draft)
- `category_id`: Lọc theo danh mục
- `instructor_id`: Lọc theo giảng viên
- `keyword`: Tìm kiếm theo tên
- `page`: Số trang
- `limit`: Số lượng mỗi trang

**Luồng hoạt động:**
```
1. Admin mở trang CoursesPage2.jsx
2. Component gọi coursesAdminApi.getCourses()
3. Frontend gửi request GET /api/admin/courses?status=...&category_id=...
4. Backend query database với filters
5. Trả về danh sách khóa học với pagination
6. Frontend hiển thị bảng danh sách
```

**Dữ liệu trả về:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "course_id": 1,
        "title": "TOEIC Listening Part 1",
        "status": "pending",
        "category_name": "TOEIC",
        "instructor_name": "John Doe",
        "price": 500000,
        "created_at": "2024-01-01"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50
    }
  }
}
```

---

### 1.3. UC-ADMIN-COURSE-002: Xem chi tiết khóa học

**Mô tả:** Admin xem chi tiết một khóa học để kiểm tra trước khi duyệt.

**Frontend:**
- File: `frontend/Shopery/src/Admin/features/courses2/components/CoursePreviewModal.jsx`
- Component: Modal hiển thị chi tiết

**Backend:**
- Controller: `backend/src/admin/controllers/courseAdminController.js` → `getCourseDetail()`
- Route: `GET /api/admin/courses/:id`

**API Frontend:**
- Function: `getCourseDetail(courseId)`

**Luồng hoạt động:**
```
1. Admin click "Xem chi tiết" trên một khóa học
2. Frontend gọi coursesAdminApi.getCourseDetail(courseId)
3. Backend query database lấy đầy đủ thông tin:
   - Thông tin course (title, description, price, thumbnail)
   - Modules và Lessons
   - Instructor info
   - Status và metadata
4. Frontend hiển thị modal với đầy đủ thông tin
```

**Dữ liệu trả về:**
```json
{
  "success": true,
  "data": {
    "course": {
      "course_id": 1,
      "title": "TOEIC Listening Part 1",
      "description": "...",
      "price": 500000,
      "status": "pending",
      "modules": [
        {
          "module_id": 1,
          "module_name": "Module 1: Introduction",
          "lessons": [
            {
              "lesson_id": 1,
              "title": "Lesson 1: Basic Listening",
              "lesson_type": "video",
              "lesson_data": {...}
            }
          ]
        }
      ]
    }
  }
}
```

---

### 1.4. UC-ADMIN-COURSE-003/004: Tạo khóa học

#### UC-ADMIN-COURSE-003: Tạo khóa học cơ bản

**Mô tả:** Admin tạo khóa học mới với thông tin cơ bản.

**Frontend:**
- File: `frontend/Shopery/src/Admin/features/courses2/pages/CreateCoursePage.jsx`
- Component: Form tạo khóa học

**Backend:**
- Route: `POST /api/instructor/courses`
- Controller: `backend/src/instructor/controllers/instructorController.js`

**API Frontend:**
- Function: `createCourse(payload)`

**Payload:**
```json
{
  "title": "TOEIC Listening Part 1",
  "description": "Khóa học luyện nghe TOEIC Part 1",
  "category_id": 1,
  "level_id": 2,
  "price": 500000,
  "thumbnail": "https://...",
  "is_free": false
}
```

**Luồng hoạt động:**
```
1. Admin điền form tạo khóa học
2. Click "Lưu" → Frontend gọi createCourse(payload)
3. Backend validate dữ liệu
4. Tạo record trong bảng courses với status = "draft"
5. Trả về course_id
6. Frontend chuyển đến trang Course Builder để thêm modules/lessons
```

#### UC-ADMIN-COURSE-004: Tạo khóa học đầy đủ

**Mô tả:** Admin tạo khóa học kèm modules và lessons trong một request.

**Backend:**
- Route: `POST /api/instructor/courses/with-details`

**API Frontend:**
- Function: `createCourseWithDetails(payload)`

**Payload:**
```json
{
  "course": {
    "title": "TOEIC Listening Part 1",
    "description": "...",
    "category_id": 1,
    "level_id": 2,
    "price": 500000
  },
  "modules": [
    {
      "module_name": "Module 1",
      "description": "...",
      "sort_order": 1,
      "lessons": [
        {
          "title": "Lesson 1",
          "lesson_type": "video",
          "lesson_data": {
            "type": "video_lesson",
            "video_url": "https://...",
            "video_type": "youtube"
          },
          "sort_order": 1
        }
      ]
    }
  ]
}
```

**Luồng hoạt động:**
```
1. Admin điền form đầy đủ (course + modules + lessons)
2. Click "Tạo khóa học" → Frontend gọi createCourseWithDetails(payload)
3. Backend xử lý:
   - Tạo course
   - Tạo modules
   - Tạo lessons với validation lesson_data
4. Trả về course_id và cấu trúc đầy đủ
5. Frontend hiển thị thông báo thành công
```

---

### 1.5. UC-ADMIN-COURSE-005: Cập nhật khóa học

**Mô tả:** Admin chỉnh sửa thông tin khóa học.

**Frontend:**
- File: `frontend/Shopery/src/Admin/features/courses2/components/EditCourseModal.jsx`

**Backend:**
- Route: `PATCH /api/instructor/courses/:course_id`

**API Frontend:**
- Function: `updateCourse(courseId, payload)`

**Luồng hoạt động:**
```
1. Admin click "Chỉnh sửa" trên một khóa học
2. Modal EditCourseModal hiển thị form với dữ liệu hiện tại
3. Admin chỉnh sửa thông tin (title, description, price, ...)
4. Click "Lưu" → Frontend gọi updateCourse(courseId, payload)
5. Backend cập nhật record trong database
6. Trả về kết quả thành công
7. Frontend refresh danh sách khóa học
```

---

### 1.6. UC-ADMIN-COURSE-006: Xóa khóa học

**Mô tả:** Admin xóa khóa học khỏi hệ thống (thường là soft delete).

**Backend:**
- Route: `DELETE /api/admin/courses/:id`

**API Frontend:**
- Function: `removeCourse(courseId)`

**Luồng hoạt động:**
```
1. Admin click "Xóa" trên một khóa học
2. Hệ thống hiển thị confirm dialog
3. Admin xác nhận → Frontend gọi removeCourse(courseId)
4. Backend thực hiện soft delete (cập nhật status = "deleted")
5. Trả về kết quả thành công
6. Frontend refresh danh sách
```

---

### 1.7. UC-ADMIN-COURSE-007/008/009: Quản lý Modules

#### UC-ADMIN-COURSE-007: Thêm Module

**Mô tả:** Admin thêm một module mới vào khóa học.

**Frontend:**
- File: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/CourseBuilderTab.jsx`

**Backend:**
- Route: `POST /api/instructor/courses/:course_id/modules`

**API Frontend:**
- Function: `addModule(courseId, payload)`

**Payload:**
```json
{
  "module_name": "Module 1: Introduction",
  "description": "Giới thiệu về khóa học",
  "sort_order": 1
}
```

**Luồng hoạt động:**
```
1. Admin ở trang Course Builder
2. Click "Thêm Module" → Hiển thị form
3. Admin nhập tên module, mô tả, thứ tự
4. Click "Lưu" → Frontend gọi addModule(courseId, payload)
5. Backend tạo record trong bảng modules
6. Trả về module_id
7. Frontend refresh danh sách modules
```

#### UC-ADMIN-COURSE-008: Cập nhật Module

**Backend:**
- Route: `PATCH /api/instructor/modules/:module_id`

**API Frontend:**
- Function: `updateModule(moduleId, payload)`

#### UC-ADMIN-COURSE-009: Xóa Module

**Backend:**
- Route: `DELETE /api/instructor/modules/:module_id`

**API Frontend:**
- Function: `deleteModule(moduleId)`

---

### 1.8. UC-ADMIN-COURSE-010/011/012: Quản lý Lessons

#### UC-ADMIN-COURSE-010: Thêm Lesson

**Mô tả:** Admin thêm một bài học mới vào module.

**Frontend:**
- File: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonStudioModal.jsx`
- Component: VisualEditor với các editor cho từng lesson type

**Backend:**
- Route: `POST /api/instructor/modules/:id/lessons`

**API Frontend:**
- Function: `addLesson(moduleId, payload)`

**Payload:**
```json
{
  "title": "Lesson 1: Basic Listening",
  "lesson_type": "vocabulary_list",
  "lesson_data": {
    "type": "vocabulary_list",
    "display_mode": "flashcard",
    "words": [
      {
        "en": "happy",
        "vi": "vui mừng",
        "pronunciation": "/ˈhæpi/",
        "audio_url": "https://...",
        "image_url": "https://...",
        "example": "I am happy today"
      }
    ]
  },
  "sort_order": 1
}
```

**Các loại lesson_type:**
1. `video` - Video bài giảng
2. `vocabulary_list` - Danh sách từ vựng (flashcard)
3. `vocabulary_matching` - Tìm cặp từ vựng
4. `vocabulary_translation` - Dịch nghĩa
5. `vocabulary_quiz` - Trắc nghiệm từ vựng
6. `vocabulary_listening` - Nghe từ vựng
7. `vocabulary_image_choice` - Chọn ảnh
8. `vocabulary_sentence_completion` - Hoàn thiện câu
9. `grammar_theory` - Lý thuyết ngữ pháp

**Luồng hoạt động:**
```
1. Admin ở Course Builder, chọn một module
2. Click "Thêm Bài học" → Modal LessonStudioModal hiển thị
3. Admin chọn lesson_type từ dropdown
4. VisualEditor render editor tương ứng:
   - vocabulary_list → VocabularyListEditor
   - vocabulary_matching → VocabularyMatchingEditor
   - video → VideoEditor
   - ...
5. Admin nhập dữ liệu theo format của từng loại
6. Click "Lưu" → Frontend gọi addLesson(moduleId, payload)
7. Backend validate lesson_data theo lesson_type
8. Lưu vào database (bảng lessons, cột lesson_data là JSON)
9. Trả về lesson_id
10. Frontend refresh danh sách lessons trong module
```

#### UC-ADMIN-COURSE-011: Cập nhật Lesson

**Backend:**
- Route: `PATCH /api/instructor/lessons/:id`

**API Frontend:**
- Function: `updateLesson(lessonId, payload)`

**Frontend:**
- File: `frontend/Shopery/src/Admin/features/courses2/components/EditLessonModal.jsx`

#### UC-ADMIN-COURSE-012: Xóa Lesson

**Backend:**
- Route: `DELETE /api/instructor/lessons/:id`

**API Frontend:**
- Function: `deleteLesson(lessonId)`

---

### 1.9. UC-ADMIN-COURSE-013/014: Duyệt/Từ chối khóa học

#### UC-ADMIN-COURSE-013: Duyệt khóa học

**Mô tả:** Admin phê duyệt khóa học để publish.

**Backend:**
- Controller: `backend/src/admin/controllers/courseAdminController.js` → `approveCourse()`
- Route: `PATCH /api/admin/courses/:id/approve`

**API Frontend:**
- Function: `approveCourse(courseId, payload)`

**Payload:**
```json
{
  "comment": "Khóa học đạt yêu cầu, đã duyệt"
}
```

**Luồng hoạt động:**
```
1. Admin xem chi tiết khóa học ở trạng thái "pending"
2. Admin kiểm tra nội dung, modules, lessons
3. Nếu đạt yêu cầu → Click "Duyệt"
4. Frontend gọi approveCourse(courseId, {comment: "..."})
5. Backend cập nhật:
   - status = "approved"
   - approved_at = NOW()
   - admin_user_id = req.user.userId
6. Khóa học xuất hiện trong danh sách phía Client
7. Frontend refresh danh sách
```

#### UC-ADMIN-COURSE-014: Từ chối khóa học

**Backend:**
- Route: `PATCH /api/admin/courses/:id/reject`

**API Frontend:**
- Function: `rejectCourse(courseId, payload)`

**Payload:**
```json
{
  "comment": "Nội dung chưa đầy đủ, cần bổ sung thêm"
}
```

**Luồng hoạt động:**
```
1. Admin xem chi tiết khóa học ở trạng thái "pending"
2. Admin phát hiện vấn đề → Click "Từ chối"
3. Modal hiển thị form nhập lý do từ chối
4. Admin nhập rejection_reason → Click "Xác nhận"
5. Frontend gọi rejectCourse(courseId, {comment: "..."})
6. Backend cập nhật:
   - status = "rejected"
   - rejection_reason = comment
   - rejected_at = NOW()
7. Khóa học không xuất hiện trong danh sách phía Client
8. Instructor có thể xem lý do từ chối và chỉnh sửa lại
```

---

## 2. LUỒNG CLIENT - HỌC KHÓA HỌC

### 2.1. Tổng quan luồng Client

```
Client truy cập hệ thống
    ↓
[UC-COURSE-001] Xem danh sách khóa học
    ↓
[UC-COURSE-002] Xem chi tiết khóa học
    ↓
[UC-COURSE-004] Đăng ký khóa học
    ↓
[UC-COURSE-005] Xem khóa học đã đăng ký (My Courses)
    ↓
[UC-COURSE-006] Xem chi tiết bài học
    ↓
[UC-COURSE-007] Bắt đầu học bài học
    ↓
[UC-COURSE-008] Cập nhật tiến độ bài học
    ↓
[UC-COURSE-009] Hoàn thành bài học
    ↓
[UC-COURSE-010/011] Xem tiến độ bài học/khóa học
```

---

### 2.2. UC-COURSE-001: Xem danh sách khóa học

**Mô tả:** User xem danh sách tất cả khóa học có sẵn với filter và search.

**Frontend:**
- File: `frontend/Shopery/src/Client/pages/Course/Course.jsx`
- Component: Grid/List view với sidebar filter

**Backend:**
- Controller: `backend/src/client/controllers/courseClientController.js` → `getCourse()`
- Service: `backend/src/client/services/courseClientService.js`
- Route: `GET /api/client/courses` hoặc `GET /api/course`

**API Frontend:**
- File: `frontend/Shopery/src/Client/api/Course/courseApi.js`
- Function: `getCourses(filters)`

**Query Parameters:**
- `title`: Tìm kiếm theo tên
- `category`: Lọc theo danh mục
- `instructor`: Lọc theo giảng viên
- `level`: Lọc theo trình độ
- `price_type`: 'free', 'paid', 'all'
- `min_price`, `max_price`: Khoảng giá
- `rating`: Lọc theo đánh giá
- `sort_by`: 'newest', 'popular', 'price_asc', 'price_desc', 'rating'
- `page`: Số trang
- `limit`: Số lượng mỗi trang (mặc định 12)

**Luồng hoạt động:**
```
1. User truy cập trang "Khóa học"
2. Frontend gọi courseApi.getCourses() với filters mặc định
3. Backend query database:
   - Chỉ lấy khóa học có status = "approved" và publish = true
   - Áp dụng filters (category, level, price, rating)
   - Sort theo sort_by
   - Pagination
4. Trả về danh sách khóa học
5. Frontend hiển thị grid/list view
6. User có thể:
   - Thay đổi filter → Reload danh sách
   - Search theo tên → Reload danh sách
   - Sort → Reload danh sách
   - Chuyển trang → Load trang mới
```

**Dữ liệu trả về:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "course_id": 1,
        "title": "TOEIC Listening Part 1",
        "description": "...",
        "thumbnail": "https://...",
        "price": 500000,
        "is_free": false,
        "rating": 4.5,
        "total_students": 100,
        "instructor_name": "John Doe",
        "category_name": "TOEIC"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "total_pages": 5
    }
  }
}
```

---

### 2.3. UC-COURSE-002: Xem chi tiết khóa học

**Mô tả:** User xem thông tin chi tiết của một khóa học trước khi đăng ký.

**Frontend:**
- File: `frontend/Shopery/src/Client/pages/Course/CourseDetail/CourseDetail.jsx`
- Component: Trang chi tiết với tabs (Overview, Curriculum, Reviews, Discussions)

**Backend:**
- Route: `GET /api/client/courses/:course_id/preview` hoặc `GET /api/course/courses/:course_id/preview`

**API Frontend:**
- Function: `getCourseById(courseId)`

**Luồng hoạt động:**
```
1. User click vào một khóa học từ danh sách
2. Frontend navigate đến /courses/:course_id
3. Component CourseDetail.jsx mount
4. Frontend gọi courseApi.getCourseById(courseId)
5. Backend query database:
   - Thông tin course (title, description, price, thumbnail)
   - Instructor info
   - Modules và Lessons (curriculum)
   - Reviews (đánh giá)
   - Statistics (số học viên, rating)
6. Frontend hiển thị:
   - Header với thumbnail, title, price
   - Tabs: Overview, Curriculum, Reviews
   - Nút "Đăng ký" hoặc "Tiếp tục học" (nếu đã enroll)
7. User có thể:
   - Xem curriculum (modules và lessons)
   - Xem reviews
   - Click "Đăng ký" để enroll
```

**Dữ liệu trả về:**
```json
{
  "success": true,
  "data": {
    "course": {
      "course_id": 1,
      "title": "TOEIC Listening Part 1",
      "description": "...",
      "price": 500000,
      "thumbnail": "https://...",
      "rating": 4.5,
      "total_students": 100,
      "instructor": {
        "instructor_id": 1,
        "full_name": "John Doe",
        "avatar": "https://..."
      },
      "curriculum": {
        "modules": [
          {
            "module_id": 1,
            "module_name": "Module 1",
            "lessons": [
              {
                "lesson_id": 1,
                "title": "Lesson 1",
                "lesson_type": "video",
                "is_free": false,
                "duration": 300
              }
            ]
          }
        ]
      },
      "reviews": [...],
      "is_enrolled": false
    }
  }
}
```

---

### 2.4. UC-COURSE-004: Đăng ký khóa học

**Mô tả:** User đăng ký một khóa học (miễn phí hoặc trả phí).

**Frontend:**
- File: `frontend/Shopery/src/Client/pages/Course/CourseDetail/CourseDetail.jsx`
- Component: Nút "Đăng ký" trong CourseDetail

**Backend:**
- Controller: `backend/src/client/controllers/courseClientController.js` → `enrollCourse()`
- Route: `POST /api/client/courses/:course_id/enroll` hoặc `POST /api/course/:course_id/enroll`

**API Frontend:**
- Function: `enrollCourse(userId, courseId)`

**Luồng hoạt động:**
```
1. User đang xem chi tiết khóa học
2. User click nút "Đăng ký khóa học"
3. Frontend kiểm tra user đã đăng nhập chưa:
   - Nếu chưa → Redirect đến trang đăng nhập
   - Nếu đã đăng nhập → Tiếp tục
4. Frontend gọi courseApi.enrollCourse(userId, courseId)
5. Backend xử lý:
   - Kiểm tra user đã enroll chưa → Nếu có, trả về lỗi
   - Kiểm tra khóa học có phí hay miễn phí:
     * Miễn phí (price = 0 hoặc is_free = true):
       - Tạo enrollment với status = "active", payment_status = "paid"
     * Có phí (price > 0):
       - Tạo enrollment với status = "pending", payment_status = "pending"
       - Chuyển đến flow thanh toán (out of scope)
   - Tạo record trong bảng course_enrollments
   - Khởi tạo lesson progress records (nếu cần)
6. Trả về kết quả thành công
7. Frontend:
   - Hiển thị thông báo thành công
   - Nút "Đăng ký" chuyển thành "Vào học"
   - Có thể navigate đến trang học ngay
```

**Dữ liệu request:**
```json
{
  "user_id": 123
}
```

**Dữ liệu trả về:**
```json
{
  "success": true,
  "message": "Đăng ký khóa học thành công",
  "data": {
    "enrollment_id": 1,
    "course_id": 1,
    "user_id": 123,
    "status": "active",
    "payment_status": "paid",
    "enrolled_at": "2024-01-01T10:00:00Z"
  }
}
```

---

### 2.5. UC-COURSE-005: Xem khóa học đã đăng ký

**Mô tả:** User xem danh sách các khóa học mà mình đã đăng ký.

**Frontend:**
- File: `frontend/Shopery/src/Client/pages/MyCourses/MyCourses.jsx`
- Component: Grid/List view các khóa học đã enroll

**Backend:**
- Route: `GET /api/client/courses/user/my-courses` hoặc `GET /api/course/user/my-courses`

**API Frontend:**
- Function: `getUserCourses(userId)`

**Luồng hoạt động:**
```
1. User click menu "Khóa học của tôi" / "My Courses"
2. Frontend gọi courseApi.getUserCourses(userId)
3. Backend query database:
   - JOIN course_enrollments với courses
   - WHERE user_id = userId AND status = "active"
   - Lấy thêm thông tin tiến độ học
4. Trả về danh sách khóa học đã enroll
5. Frontend hiển thị:
   - Card mỗi khóa học với thumbnail, title
   - Tiến độ học (phần trăm hoàn thành)
   - Nút "Tiếp tục học" hoặc "Bắt đầu học"
```

**Dữ liệu trả về:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "course_id": 1,
        "title": "TOEIC Listening Part 1",
        "thumbnail": "https://...",
        "enrollment": {
          "enrollment_id": 1,
          "enrolled_at": "2024-01-01",
          "status": "active"
        },
        "progress": {
          "total_lessons": 20,
          "completed_lessons": 5,
          "progress_percentage": 25,
          "last_accessed_at": "2024-01-05"
        }
      }
    ]
  }
}
```

---

### 2.6. UC-COURSE-006: Xem chi tiết bài học

**Mô tả:** User xem nội dung một bài học cụ thể.

**Frontend:**
- File: `frontend/Shopery/src/Client/pages/Lesson/Lesson.jsx`
- Component: LessonComponentMapper render component theo lesson_type

**Backend:**
- Route: `GET /api/client/courses/lessons/:lesson_id` hoặc `GET /api/course/lessons/:lesson_id`

**API Frontend:**
- Function: Gọi từ CourseDetail component

**Luồng hoạt động:**
```
1. User đang xem CourseDetail hoặc MyCourses
2. User click vào một lesson trong curriculum
3. Frontend navigate đến /lessons/:lesson_id
4. Component Lesson.jsx mount
5. Frontend gọi API GET /api/course/lessons/:lesson_id
6. Backend:
   - Kiểm tra user đã enroll khóa học chứa lesson này chưa
   - Nếu chưa → Trả về lỗi 403
   - Nếu có → Query database lấy lesson với lesson_data
7. Frontend:
   - Parse lesson_data
   - LessonComponentMapper[lesson_type] render component tương ứng:
     * video → VideoPlayer
     * vocabulary_list → VocabularyList
     * vocabulary_matching → VocabularyMatching
     * ...
8. User xem và tương tác với nội dung bài học
```

**Dữ liệu trả về:**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "lesson_id": 1,
      "title": "Lesson 1: Basic Listening",
      "lesson_type": "vocabulary_list",
      "lesson_data": {
        "type": "vocabulary_list",
        "display_mode": "flashcard",
        "words": [
          {
            "en": "happy",
            "vi": "vui mừng",
            "pronunciation": "/ˈhæpi/",
            "audio_url": "https://...",
            "image_url": "https://...",
            "example": "I am happy today"
          }
        ]
      },
      "module": {
        "module_id": 1,
        "module_name": "Module 1"
      },
      "course": {
        "course_id": 1,
        "title": "TOEIC Listening Part 1"
      }
    }
  }
}
```

---

### 2.7. UC-COURSE-007: Bắt đầu học bài học

**Mô tả:** User bắt đầu học một bài học và hệ thống ghi nhận.

**Backend:**
- Route: `POST /api/client/courses/start` hoặc `POST /api/course/start`

**API Frontend:**
- Function: `startLesson(data)`

**Payload:**
```json
{
  "course_id": 1,
  "lesson_id": 1,
  "user_id": 123
}
```

**Luồng hoạt động:**
```
1. User mở một lesson lần đầu tiên
2. Frontend tự động gọi startLesson() khi component mount
3. Backend:
   - Kiểm tra đã có lesson_progress record chưa
   - Nếu chưa:
     * Tạo mới với status = "in_progress"
     * started_at = NOW()
     * last_accessed_at = NOW()
     * watched_duration = 0
     * completion_percent = 0
   - Nếu đã có:
     * Cập nhật last_accessed_at = NOW()
4. Trả về kết quả thành công
5. Frontend có thể hiển thị trạng thái "Đang học"
```

---

### 2.8. UC-COURSE-008: Cập nhật tiến độ bài học

**Mô tả:** User cập nhật tiến độ học của một bài học (ví dụ: xem video, làm quiz).

**Backend:**
- Route: `POST /api/client/courses/update` hoặc `POST /api/course/update`

**API Frontend:**
- Function: `updateLessonProgress(data)`

**Payload:**
```json
{
  "course_id": 1,
  "lesson_id": 1,
  "user_id": 123,
  "progress_percentage": 50,
  "time_spent": 300,
  "last_position": 150
}
```

**Luồng hoạt động:**
```
1. User đang học lesson (xem video, làm quiz, ...)
2. Frontend tự động gọi updateLessonProgress() định kỳ hoặc khi có thay đổi:
   - Video: Khi timeupdate event (mỗi 5-10 giây)
   - Quiz: Khi hoàn thành một câu hỏi
   - Vocabulary: Khi học xong một từ
3. Backend:
   - Cập nhật lesson_progress:
     * progress_percentage = payload.progress_percentage
     * watched_duration += time_spent
     * last_position = payload.last_position
     * last_accessed_at = NOW()
4. Trả về kết quả thành công
```

---

### 2.9. UC-COURSE-009: Hoàn thành bài học

**Mô tả:** User đánh dấu bài học đã hoàn thành.

**Backend:**
- Route: `POST /api/client/courses/complete` hoặc `POST /api/course/complete`

**API Frontend:**
- Function: `completeLesson(data)`

**Payload:**
```json
{
  "course_id": 1,
  "lesson_id": 1,
  "user_id": 123
}
```

**Luồng hoạt động:**
```
1. User hoàn thành bài học (xem hết video, làm xong quiz, ...)
2. Frontend hiển thị nút "Hoàn thành" hoặc tự động khi đạt điều kiện
3. User click "Hoàn thành" → Frontend gọi completeLesson()
4. Backend:
   - Cập nhật lesson_progress:
     * status = "completed"
     * completion_percent = 100
     * completed_at = NOW()
   - Cập nhật course progress:
     * Tăng số completed_lessons
     * Tính lại progress_percentage của course
5. Trả về kết quả thành công
6. Frontend:
   - Hiển thị thông báo "Đã hoàn thành"
   - Cập nhật UI (checkmark, progress bar)
   - Có thể unlock lesson tiếp theo
```

---

### 2.10. UC-COURSE-010/011: Xem tiến độ bài học/khóa học

#### UC-COURSE-010: Xem tiến độ bài học

**Backend:**
- Route: `GET /api/client/courses/lesson/:lesson_id` hoặc `GET /api/course/lesson/:lesson_id`

**API Frontend:**
- Function: `getLessonProgress(lesson_id, user_id)`

**Dữ liệu trả về:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "lesson_id": 1,
      "user_id": 123,
      "status": "in_progress",
      "progress_percentage": 50,
      "time_spent": 300,
      "completed": false,
      "last_position": 150,
      "started_at": "2024-01-01T10:00:00Z",
      "last_accessed_at": "2024-01-01T10:05:00Z"
    }
  }
}
```

#### UC-COURSE-011: Xem tiến độ khóa học

**Backend:**
- Route: `GET /api/client/courses/course/:course_id` hoặc `GET /api/course/course/:course_id`

**API Frontend:**
- Function: `getCourseProgress(course_id, user_id)`

**Dữ liệu trả về:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "course_id": 1,
      "user_id": 123,
      "total_lessons": 20,
      "completed_lessons": 5,
      "in_progress_lessons": 2,
      "not_started_lessons": 13,
      "progress_percentage": 25,
      "total_time_spent": 3600,
      "last_accessed_at": "2024-01-05T10:00:00Z"
    }
  }
}
```

---

## 3. CẤU TRÚC DỮ LIỆU KHÓA HỌC

### 3.1. Cấu trúc phân cấp

```
Course (Khóa học)
    ├─> Modules (Chương/Module)
    │   ├─> Lesson 1 (Bài học 1)
    │   ├─> Lesson 2 (Bài học 2)
    │   └─> Lesson N (Bài học N)
    └─> CourseDetail (Chi tiết khóa học)
        ├─> Tags (Thẻ)
        ├─> Reviews (Đánh giá)
        └─> Discussions (Thảo luận)
```

### 3.2. Các loại Lesson Type

Hệ thống hỗ trợ **9 loại bài học**:

1. **video** - Video bài giảng
   - `lesson_data`: `{type: "video_lesson", video_url, video_type}`

2. **vocabulary_list** - Danh sách từ vựng (Flashcard)
   - `lesson_data`: `{type: "vocabulary_list", display_mode: "flashcard"|"list", words: [...]}`

3. **vocabulary_matching** - Tìm cặp từ vựng
   - `lesson_data`: `{type: "vocabulary_matching", questions: [...], grid_size: {rows, cols}}`

4. **vocabulary_translation** - Dịch nghĩa
   - `lesson_data`: `{type: "vocabulary_translation", questions: [...]}`

5. **vocabulary_quiz** - Trắc nghiệm từ vựng
   - `lesson_data`: `{type: "vocabulary_quiz", questions: [...]}`

6. **vocabulary_listening** - Nghe từ vựng
   - `lesson_data`: `{type: "vocabulary_listening", questions: [...], grid: {...}}`

7. **vocabulary_image_choice** - Chọn ảnh
   - `lesson_data`: `{type: "vocabulary_image_choice", questions: [...]}`

8. **vocabulary_sentence_completion** - Hoàn thiện câu
   - `lesson_data`: `{type: "vocabulary_sentence_completion", questions: [...]}`

9. **grammar_theory** - Lý thuyết ngữ pháp
   - `lesson_data`: `{type: "grammar_theory", mode: "page"|"structured", sections: [...]}`

### 3.3. Component Mapping

**Frontend:** `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

```javascript
export const LessonComponentMapper = {
  video: VideoPlayer,
  vocabulary_list: VocabularyList,
  vocabulary_matching: VocabularyMatching,
  vocabulary_translation: VocabularyTranslation,
  vocabulary_quiz: VocabularyQuiz,
  vocabulary_listening: VocabularyListening,
  vocabulary_image_choice: VocabularyImageChoice,
  vocabulary_sentence_completion: VocabularySentenceCompletion,
  grammar_theory: GrammarTheory,
};
```

---

## 4. API ENDPOINTS

### 4.1. Admin APIs

| Method | Endpoint | Mô tả | Use Case |
|--------|----------|-------|----------|
| GET | `/api/admin/courses` | Lấy danh sách khóa học | UC-ADMIN-COURSE-001 |
| GET | `/api/admin/courses/:id` | Lấy chi tiết khóa học | UC-ADMIN-COURSE-002 |
| PATCH | `/api/admin/courses/:id/approve` | Duyệt khóa học | UC-ADMIN-COURSE-013 |
| PATCH | `/api/admin/courses/:id/reject` | Từ chối khóa học | UC-ADMIN-COURSE-014 |
| DELETE | `/api/admin/courses/:id` | Xóa khóa học | UC-ADMIN-COURSE-006 |

### 4.2. Instructor APIs (Admin sử dụng)

| Method | Endpoint | Mô tả | Use Case |
|--------|----------|-------|----------|
| POST | `/api/instructor/courses` | Tạo khóa học cơ bản | UC-ADMIN-COURSE-003 |
| POST | `/api/instructor/courses/with-details` | Tạo khóa học đầy đủ | UC-ADMIN-COURSE-004 |
| PATCH | `/api/instructor/courses/:course_id` | Cập nhật khóa học | UC-ADMIN-COURSE-005 |
| DELETE | `/api/instructor/courses/:course_id` | Xóa khóa học | UC-ADMIN-COURSE-006 |
| POST | `/api/instructor/courses/:course_id/modules` | Thêm module | UC-ADMIN-COURSE-007 |
| PATCH | `/api/instructor/modules/:module_id` | Cập nhật module | UC-ADMIN-COURSE-008 |
| DELETE | `/api/instructor/modules/:module_id` | Xóa module | UC-ADMIN-COURSE-009 |
| POST | `/api/instructor/modules/:id/lessons` | Thêm lesson | UC-ADMIN-COURSE-010 |
| PATCH | `/api/instructor/lessons/:id` | Cập nhật lesson | UC-ADMIN-COURSE-011 |
| DELETE | `/api/instructor/lessons/:id` | Xóa lesson | UC-ADMIN-COURSE-012 |

### 4.3. Client APIs

| Method | Endpoint | Mô tả | Use Case |
|--------|----------|-------|----------|
| GET | `/api/client/courses` hoặc `/api/course` | Lấy danh sách khóa học | UC-COURSE-001 |
| GET | `/api/client/courses/:course_id/preview` | Xem chi tiết khóa học | UC-COURSE-002 |
| POST | `/api/client/courses/:course_id/enroll` | Đăng ký khóa học | UC-COURSE-004 |
| GET | `/api/client/courses/user/my-courses` | Xem khóa học đã đăng ký | UC-COURSE-005 |
| GET | `/api/client/courses/lessons/:lesson_id` | Xem chi tiết bài học | UC-COURSE-006 |
| POST | `/api/client/courses/start` | Bắt đầu học bài học | UC-COURSE-007 |
| POST | `/api/client/courses/update` | Cập nhật tiến độ | UC-COURSE-008 |
| POST | `/api/client/courses/complete` | Hoàn thành bài học | UC-COURSE-009 |
| GET | `/api/client/courses/lesson/:lesson_id` | Xem tiến độ bài học | UC-COURSE-010 |
| GET | `/api/client/courses/course/:course_id` | Xem tiến độ khóa học | UC-COURSE-011 |
| GET | `/api/client/courses/:course_id/structure` | Lấy cấu trúc khóa học | - |

---

## 5. DATABASE SCHEMA

### 5.1. Bảng `courses`

```sql
CREATE TABLE courses (
  course_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  level_id INT,
  instructor_id INT,
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  thumbnail VARCHAR(500),
  status ENUM('draft', 'pending', 'approved', 'rejected', 'deleted') DEFAULT 'draft',
  publish BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (level_id) REFERENCES levels(level_id),
  FOREIGN KEY (instructor_id) REFERENCES users(user_id)
);
```

### 5.2. Bảng `modules`

```sql
CREATE TABLE modules (
  module_id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);
```

### 5.3. Bảng `lessons`

```sql
CREATE TABLE lessons (
  lesson_id INT PRIMARY KEY AUTO_INCREMENT,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  lesson_type ENUM(
    'video',
    'vocabulary_list',
    'vocabulary_matching',
    'vocabulary_translation',
    'vocabulary_quiz',
    'vocabulary_listening',
    'vocabulary_image_choice',
    'vocabulary_sentence_completion',
    'grammar_theory'
  ) NOT NULL,
  lesson_data JSON,
  metadata JSON,
  sort_order INT DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  duration INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE CASCADE
);
```

### 5.4. Bảng `course_enrollments`

```sql
CREATE TABLE course_enrollments (
  enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE KEY unique_enrollment (course_id, user_id)
);
```

### 5.5. Bảng `lesson_progress`

```sql
CREATE TABLE lesson_progress (
  progress_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  lesson_id INT NOT NULL,
  status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  progress_percentage INT DEFAULT 0,
  watched_duration INT DEFAULT 0,
  time_spent INT DEFAULT 0,
  last_position INT DEFAULT 0,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id),
  UNIQUE KEY unique_progress (user_id, lesson_id)
);
```

---

## 6. SƠ ĐỒ LUỒNG TỔNG QUAN

### 6.1. Luồng Admin - Tạo và quản lý khóa học

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
│              (CoursesPage2.jsx)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─> [Xem danh sách] GET /api/admin/courses
                       │
                       ├─> [Tạo mới] ──> CreateCoursePage.jsx
                       │                  │
                       │                  ├─> POST /api/instructor/courses
                       │                  │   (Tạo course cơ bản)
                       │                  │
                       │                  └─> CourseBuilderTab.jsx
                       │                      │
                       │                      ├─> [Thêm Module]
                       │                      │   POST /api/instructor/courses/:id/modules
                       │                      │
                       │                      └─> [Thêm Lesson]
                       │                          LessonStudioModal.jsx
                       │                          │
                       │                          ├─> Chọn lesson_type
                       │                          │
                       │                          └─> VisualEditor
                       │                              │
                       │                              ├─> VocabularyListEditor
                       │                              ├─> VideoEditor
                       │                              └─> ... (9 loại)
                       │
                       ├─> [Xem chi tiết] ──> CoursePreviewModal.jsx
                       │                      GET /api/admin/courses/:id
                       │
                       ├─> [Chỉnh sửa] ──> EditCourseModal.jsx
                       │                  PATCH /api/instructor/courses/:id
                       │
                       ├─> [Duyệt] ──> PATCH /api/admin/courses/:id/approve
                       │
                       └─> [Từ chối] ──> PATCH /api/admin/courses/:id/reject
```

### 6.2. Luồng Client - Học khóa học

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - COURSE PAGE                      │
│              (Course.jsx)                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─> [Xem danh sách] GET /api/course
                       │   (Filter, Search, Sort, Pagination)
                       │
                       └─> [Click khóa học]
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              COURSE DETAIL PAGE                               │
│              (CourseDetail.jsx)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─> GET /api/course/courses/:id/preview
                       │   (Thông tin, Curriculum, Reviews)
                       │
                       ├─> [Đăng ký] ──> POST /api/course/:id/enroll
                       │                  │
                       │                  ├─> Miễn phí → Active ngay
                       │                  └─> Có phí → Pending → Thanh toán
                       │
                       └─> [Vào học] ──> Navigate to Lesson
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    LESSON PAGE                               │
│              (Lesson.jsx)                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─> GET /api/course/lessons/:lesson_id
                       │
                       ├─> POST /api/course/start
                       │   (Bắt đầu học)
                       │
                       ├─> LessonComponentMapper[lesson_type]
                       │   │
                       │   ├─> VideoPlayer (video)
                       │   ├─> VocabularyList (vocabulary_list)
                       │   ├─> VocabularyMatching (vocabulary_matching)
                       │   └─> ... (9 loại)
                       │
                       ├─> POST /api/course/update
                       │   (Cập nhật tiến độ - định kỳ)
                       │
                       └─> POST /api/course/complete
                           (Hoàn thành bài học)
```

### 6.3. Data Flow - Tạo và hiển thị Lesson

```
ADMIN TẠO LESSON:
┌─────────────────────────────────────────────────────────────┐
│  LessonStudioModal.jsx                                       │
│  └─> VisualEditor.jsx                                        │
│      └─> VocabularyListEditor.jsx (ví dụ)                   │
│          └─> User nhập: words[], display_mode                │
│              │                                                │
│              ▼                                                │
│  POST /api/instructor/modules/:id/lessons                    │
│  Body: {                                                      │
│    title: "...",                                             │
│    lesson_type: "vocabulary_list",                           │
│    lesson_data: {                                            │
│      type: "vocabulary_list",                                 │
│      display_mode: "flashcard",                               │
│      words: [...]                                            │
│    }                                                          │
│  }                                                            │
│              │                                                │
│              ▼                                                │
│  Backend: instructorService.createLesson()                   │
│  └─> Validate lesson_data                                    │
│  └─> INSERT INTO lessons (lesson_data JSON)                  │
└─────────────────────────────────────────────────────────────┘

CLIENT XEM LESSON:
┌─────────────────────────────────────────────────────────────┐
│  Lesson.jsx                                                  │
│  └─> GET /api/course/lessons/:lesson_id                     │
│      │                                                        │
│      ▼                                                        │
│  Backend: courseClientService.findById()                     │
│  └─> SELECT * FROM lessons WHERE lesson_id = ?              │
│  └─> Trả về lesson với lesson_data (JSON)                   │
│      │                                                        │
│      ▼                                                        │
│  Frontend: Parse lesson_data                                 │
│  └─> LessonComponentMapper[lesson_type]                     │
│      └─> VocabularyList.jsx                                  │
│          └─> Render FlashcardView với words[]                │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. TỔNG KẾT

### 7.1. Luồng Admin

1. **Tạo khóa học**: Course → Modules → Lessons
2. **Quản lý**: Xem, chỉnh sửa, xóa
3. **Duyệt**: Approve/Reject khóa học

### 7.2. Luồng Client

1. **Khám phá**: Xem danh sách, tìm kiếm, filter
2. **Chi tiết**: Xem thông tin, curriculum, reviews
3. **Đăng ký**: Enroll khóa học (miễn phí/có phí)
4. **Học**: Xem lesson, cập nhật tiến độ, hoàn thành
5. **Theo dõi**: Xem tiến độ bài học và khóa học

### 7.3. Điểm nổi bật

- **9 loại lesson** đa dạng (video, vocabulary, grammar)
- **JSON lesson_data** linh hoạt cho từng loại
- **Component mapping** động theo lesson_type
- **Progress tracking** chi tiết ở cả lesson và course level
- **Approval workflow** cho admin duyệt khóa học

---

**Tài liệu được tạo:** `2024-12-XX`  
**Phiên bản:** `1.0.0`  
**Mục đích:** Phục vụ viết báo cáo đồ án

