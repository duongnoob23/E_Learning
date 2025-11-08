# 📚 TÀI LIỆU API - QUẢN LÝ KHÓA HỌC

## 🔍 TỔNG QUAN

Tài liệu này mô tả chi tiết các API liên quan đến quản lý khóa học cho 3 đối tượng:
- **Client**: Người dùng cuối (học viên)
- **Instructor**: Giảng viên
- **Admin**: Quản trị viên

---

## 📋 MỤC LỤC

1. [CLIENT APIs - Khóa học cho học viên](#1-client-apis---khóa-học-cho-học-viên)
2. [INSTRUCTOR APIs - Quản lý khóa học của giảng viên](#2-instructor-apis---quản-lý-khóa-học-của-giảng-viên)
3. [ADMIN APIs - Quản lý khóa học (Admin)](#3-admin-apis---quản-lý-khóa-học-admin)

---

## 1. CLIENT APIs - Khóa học cho học viên

### 1.1. Lấy danh sách khóa học (có filter)

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `GET /api/courses` |
| **Method** | `GET` |
| **Auth** | Không bắt buộc |
| **Query Params** | `title`, `category`, `instructor`, `level`, `price_type`, `min_price`, `max_price`, `rating`, `sort_by`, `page`, `limit` |
| **Input** | Query parameters (optional) |
| **Output** | Danh sách khóa học với pagination |

**Ví dụ URL:**
```
GET /api/courses?category=1&level=2&price_type=paid&sort_by=popular&page=1&limit=12
```

**Ví dụ Input (Query Params):**
```javascript
{
  category: "1",           // ID danh mục
  level: "2",             // ID trình độ
  price_type: "paid",     // 'free', 'paid', 'all'
  min_price: "100000",    // Giá tối thiểu
  max_price: "500000",    // Giá tối đa
  rating: "4",            // Đánh giá tối thiểu
  sort_by: "popular",     // 'newest', 'popular', 'price_asc', 'price_desc', 'rating'
  page: "1",              // Trang hiện tại
  limit: "12"             // Số lượng mỗi trang
}
```

**Ví dụ Output:**
```json
{
  "EM": "Lấy danh sách khóa học thành công",
  "EC": "0",
  "DT": {
    "courses": [
      {
        "course_id": 1,
        "title": "Lập trình React từ cơ bản đến nâng cao",
        "slug": "lap-trinh-react-tu-co-ban-den-nang-cao",
        "short_description": "Khóa học React đầy đủ...",
        "image": "https://example.com/image.jpg",
        "price": 500000,
        "is_free": false,
        "rating": 4.5,
        "rating_count": 120,
        "total_students": 500,
        "instructor": {
          "instructor_id": 1,
          "name": "Nguyễn Văn A"
        },
        "category": {
          "category_id": 1,
          "name": "Lập trình"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 50,
      "items_per_page": 12
    }
  }
}
```

---

### 1.2. Lấy chi tiết khóa học

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `GET /api/courses/:course_id` |
| **Method** | `GET` |
| **Auth** | Không bắt buộc |
| **Path Params** | `course_id` (number) |
| **Input** | Không có |
| **Output** | Chi tiết đầy đủ của khóa học |

**Ví dụ URL:**
```
GET /api/courses/123
```

**Ví dụ Output:**
```json
{
  "EM": "Lấy chi tiết khóa học thành công",
  "EC": "0",
  "DT": {
    "course_id": 123,
    "title": "Lập trình React từ cơ bản đến nâng cao",
    "slug": "lap-trinh-react-tu-co-ban-den-nang-cao",
    "description": "Mô tả chi tiết khóa học...",
    "short_description": "Mô tả ngắn...",
    "image": "https://example.com/image.jpg",
    "video_preview": "https://example.com/video.mp4",
    "price": 500000,
    "is_free": false,
    "rating": 4.5,
    "rating_count": 120,
    "total_students": 500,
    "total_lessons": 50,
    "total_duration": 1200,
    "category": {
      "category_id": 1,
      "name": "Lập trình"
    },
    "instructor": {
      "instructor_id": 1,
      "name": "Nguyễn Văn A",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Giảng viên có 10 năm kinh nghiệm..."
    },
    "level": {
      "level_id": 2,
      "name": "Trung bình"
    }
  }
}
```

---

### 1.3. Lấy chương trình học (modules + lessons)

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `GET /api/courses/:course_id/curriculum` |
| **Method** | `GET` |
| **Auth** | Không bắt buộc |
| **Path Params** | `course_id` (number) |
| **Input** | Không có |
| **Output** | Danh sách modules và lessons |

**Ví dụ URL:**
```
GET /api/courses/123/curriculum
```

**Ví dụ Output:**
```json
{
  "EM": "Lấy chương trình học thành công",
  "EC": "0",
  "DT": {
    "modules": [
      {
        "module_id": 1,
        "title": "Module 1: Giới thiệu React",
        "description": "Tổng quan về React",
        "sort_order": 1,
        "total_lectures": 10,
        "total_duration": 300,
        "lessons": [
          {
            "lesson_id": 1,
            "title": "Bài 1: React là gì?",
            "description": "Giới thiệu về React",
            "lesson_type": "video",
            "video_url": "https://example.com/video1.mp4",
            "video_duration": 30,
            "is_free": true,
            "sort_order": 1
          }
        ]
      }
    ]
  }
}
```

---

### 1.4. Đăng ký khóa học

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `POST /api/courses/:course_id/enroll` |
| **Method** | `POST` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Path Params** | `course_id` (number) |
| **Input** | Không có (body rỗng) |
| **Output** | Thông tin đăng ký |

**Ví dụ URL:**
```
POST /api/courses/123/enroll
```

**Ví dụ Input (Headers):**
```
Authorization: Bearer <token>
```

**Ví dụ Output:**
```json
{
  "EM": "Đăng ký khóa học thành công",
  "EC": "0",
  "DT": {
    "enrollment_id": 456,
    "course_id": 123,
    "user_id": 789,
    "enrolled_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 1.5. Lấy danh sách khóa học đã đăng ký

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `GET /api/courses/user/my-courses` |
| **Method** | `GET` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Input** | Không có |
| **Output** | Danh sách khóa học đã đăng ký |

**Ví dụ URL:**
```
GET /api/courses/user/my-courses
```

**Ví dụ Output:**
```json
{
  "EM": "Lấy danh sách khóa học thành công",
  "EC": "0",
  "DT": {
    "courses": [
      {
        "course_id": 123,
        "title": "Lập trình React",
        "image": "https://example.com/image.jpg",
        "progress": 45,
        "enrolled_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## 2. INSTRUCTOR APIs - Quản lý khóa học của giảng viên

### 2.1. Lấy danh sách khóa học của giảng viên

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `GET /api/instructor/my-courses` |
| **Method** | `GET` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Query Params** | `page`, `limit` |
| **Input** | Query parameters (optional) |
| **Output** | Danh sách khóa học của giảng viên |

**Ví dụ URL:**
```
GET /api/instructor/my-courses?page=1&limit=10
```

**Ví dụ Output:**
```json
{
  "EM": "Lấy danh sách khóa học của giảng viên thành công",
  "EC": "0",
  "DT": {
    "courses": [
      {
        "course_id": 123,
        "title": "Lập trình React",
        "short_description": "Mô tả ngắn...",
        "price": 500000,
        "is_free": false,
        "status": "published",
        "total_students": 500,
        "rating": 4.5,
        "created_at": "2024-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 25,
      "items_per_page": 10
    }
  }
}
```

---

### 2.2. Tạo khóa học mới

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `POST /api/instructor/courses` |
| **Method** | `POST` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Input** | Body (JSON) |
| **Output** | Thông tin khóa học vừa tạo |

**Ví dụ URL:**
```
POST /api/instructor/courses
```

**Ví dụ Input (Body):**
```json
{
  "title": "Lập trình React từ cơ bản đến nâng cao",
  "description": "Mô tả chi tiết khóa học...",
  "short_description": "Mô tả ngắn...",
  "price": 500000,
  "is_free": false,
  "category_id": 1,
  "level_id": 2,
  "image": "https://example.com/image.jpg"
}
```

**Ví dụ Output:**
```json
{
  "EM": "Tạo khóa học thành công",
  "EC": "0",
  "DT": {
    "course_id": 123,
    "title": "Lập trình React từ cơ bản đến nâng cao",
    "slug": "lap-trinh-react-tu-co-ban-den-nang-cao",
    "status": "draft",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2.3. Cập nhật khóa học

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `PATCH /api/instructor/courses/:course_id` |
| **Method** | `PATCH` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Path Params** | `course_id` (number) |
| **Input** | Body (JSON) - các trường cần cập nhật |
| **Output** | Thông tin khóa học đã cập nhật |

**Ví dụ URL:**
```
PATCH /api/instructor/courses/123
```

**Ví dụ Input (Body):**
```json
{
  "title": "Lập trình React - Cập nhật",
  "description": "Mô tả mới...",
  "price": 600000
}
```

**Ví dụ Output:**
```json
{
  "EM": "Cập nhật khóa học thành công",
  "EC": "0",
  "DT": {
    "course_id": 123,
    "title": "Lập trình React - Cập nhật",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

---

### 2.4. Xóa khóa học

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `DELETE /api/instructor/courses/:course_id` |
| **Method** | `DELETE` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Path Params** | `course_id` (number) |
| **Input** | Không có |
| **Output** | Thông báo xóa thành công |

**Ví dụ URL:**
```
DELETE /api/instructor/courses/123
```

**Ví dụ Output:**
```json
{
  "EM": "Xóa khóa học thành công",
  "EC": "0",
  "DT": {
    "course_id": 123
  }
}
```

---

### 2.5. Thêm module vào khóa học

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `POST /api/instructor/courses/:course_id/modules` |
| **Method** | `POST` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Path Params** | `course_id` (number) |
| **Input** | Body (JSON) |
| **Output** | Thông tin module vừa tạo |

**Ví dụ URL:**
```
POST /api/instructor/courses/123/modules
```

**Ví dụ Input (Body):**
```json
{
  "title": "Module 1: Giới thiệu React",
  "description": "Tổng quan về React",
  "sort_order": 1
}
```

**Ví dụ Output:**
```json
{
  "EM": "Thêm module thành công",
  "EC": "0",
  "DT": {
    "module_id": 456,
    "title": "Module 1: Giới thiệu React",
    "course_id": 123,
    "sort_order": 1
  }
}
```

---

### 2.6. Thêm bài học vào module

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `POST /api/instructor/modules/:id/lessons` |
| **Method** | `POST` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Path Params** | `id` (module_id - number) |
| **Input** | Body (JSON) |
| **Output** | Thông tin lesson vừa tạo |

**Ví dụ URL:**
```
POST /api/instructor/modules/456/lessons
```

**Ví dụ Input (Body):**
```json
{
  "title": "Bài 1: React là gì?",
  "description": "Giới thiệu về React",
  "lesson_type": "video",
  "video_url": "https://example.com/video1.mp4",
  "video_duration": 30,
  "is_free": true,
  "sort_order": 1
}
```

**Ví dụ Output:**
```json
{
  "EM": "Thêm bài học thành công",
  "EC": "0",
  "DT": {
    "lesson_id": 789,
    "title": "Bài 1: React là gì?",
    "module_id": 456,
    "sort_order": 1
  }
}
```

---

### 2.7. Gửi khóa học để phê duyệt

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `PATCH /api/instructor/courses/:id/submit` |
| **Method** | `PATCH` |
| **Auth** | ✅ Bắt buộc (Bearer Token) |
| **Path Params** | `id` (course_id - number) |
| **Input** | Không có (body rỗng) |
| **Output** | Thông báo gửi thành công |

**Ví dụ URL:**
```
PATCH /api/instructor/courses/123/submit
```

**Ví dụ Output:**
```json
{
  "EM": "Gửi khóa học để phê duyệt thành công",
  "EC": "0",
  "DT": {
    "course_id": 123,
    "status": "pending_review"
  }
}
```

---

## 3. ADMIN APIs - Quản lý khóa học (Admin)

### 3.1. Lấy danh sách khóa học (Admin)

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `GET /api/admin/courses` |
| **Method** | `GET` |
| **Auth** | ✅ Bắt buộc (Bearer Token - Admin) |
| **Query Params** | `status`, `category_id`, `instructor_id`, `keyword`, `page`, `limit` |
| **Input** | Query parameters (optional) |
| **Output** | Danh sách khóa học với pagination |

**Ví dụ URL:**
```
GET /api/admin/courses?status=pending_review&page=1&limit=20
```

**Ví dụ Input (Query Params):**
```javascript
{
  status: "pending_review",  // 'draft' | 'pending_review' | 'published' | 'archived'
  category_id: "1",          // ID danh mục
  instructor_id: "5",        // ID giảng viên
  keyword: "React",          // Tìm theo title/slug
  page: "1",                 // Trang hiện tại
  limit: "20"                // Số lượng mỗi trang
}
```

**Ví dụ Output:**
```json
{
  "EM": "Lấy danh sách khóa học thành công",
  "EC": "0",
  "DT": {
    "courses": [
      {
        "course_id": 123,
        "title": "Lập trình React từ cơ bản đến nâng cao",
        "slug": "lap-trinh-react-tu-co-ban-den-nang-cao",
        "status": "pending_review",
        "created_at": "2024-01-15T10:30:00Z",
        "price": 500000,
        "is_free": false,
        "total_students": 0,
        "rating": null,
        "rating_count": 0,
        "instructor": {
          "instructor_id": 5,
          "name": "Nguyễn Văn A",
          "is_verified": true
        },
        "category": {
          "category_id": 1,
          "name": "Lập trình"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 50,
      "items_per_page": 20
    }
  }
}
```

---

### 3.2. Lấy chi tiết khóa học (Admin)

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `GET /api/admin/courses/:id` |
| **Method** | `GET` |
| **Auth** | ✅ Bắt buộc (Bearer Token - Admin) |
| **Path Params** | `id` (course_id - number) |
| **Input** | Không có |
| **Output** | Chi tiết đầy đủ khóa học (bao gồm modules, lessons) |

**Ví dụ URL:**
```
GET /api/admin/courses/123
```

**Ví dụ Output:**
```json
{
  "EM": "Lấy chi tiết khóa học thành công",
  "EC": "0",
  "DT": {
    "course_id": 123,
    "title": "Lập trình React từ cơ bản đến nâng cao",
    "slug": "lap-trinh-react-tu-co-ban-den-nang-cao",
    "description": "Mô tả chi tiết...",
    "status": "pending_review",
    "price": 500000,
    "is_free": false,
    "instructor": {
      "instructor_id": 5,
      "name": "Nguyễn Văn A",
      "avatar": "https://example.com/avatar.jpg",
      "is_verified": true,
      "user": {
        "user_id": 10,
        "email": "instructor@example.com",
        "full_name": "Nguyễn Văn A"
      }
    },
    "category": {
      "category_id": 1,
      "name": "Lập trình"
    },
    "modules": [
      {
        "module_id": 456,
        "title": "Module 1: Giới thiệu React",
        "description": "Tổng quan về React",
        "sort_order": 1,
        "total_lectures": 10,
        "total_duration": 300,
        "lessons": [
          {
            "lesson_id": 789,
            "title": "Bài 1: React là gì?",
            "description": "Giới thiệu về React",
            "lesson_type": "video",
            "video_url": "https://example.com/video1.mp4",
            "video_duration": 30,
            "is_free": true,
            "sort_order": 1
          }
        ]
      }
    ]
  }
}
```

---

### 3.3. Duyệt khóa học

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `PATCH /api/admin/courses/:id/approve` |
| **Method** | `PATCH` |
| **Auth** | ✅ Bắt buộc (Bearer Token - Admin) |
| **Path Params** | `id` (course_id - number) |
| **Input** | Body (JSON) - optional comment |
| **Output** | Thông báo duyệt thành công |

**Ví dụ URL:**
```
PATCH /api/admin/courses/123/approve
```

**Ví dụ Input (Body):**
```json
{
  "comment": "Khóa học đã được duyệt, nội dung chất lượng tốt"
}
```

**Ví dụ Output:**
```json
{
  "EM": "Duyệt khóa học thành công",
  "EC": "0",
  "DT": {
    "course_id": 123,
    "status": "published"
  }
}
```

**Lưu ý:**
- Chỉ có thể duyệt khi khóa học đang ở trạng thái `pending_review` hoặc `draft`
- Sau khi duyệt, status sẽ chuyển thành `published`
- `published_at` sẽ được cập nhật

---

### 3.4. Từ chối khóa học

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `PATCH /api/admin/courses/:id/reject` |
| **Method** | `PATCH` |
| **Auth** | ✅ Bắt buộc (Bearer Token - Admin) |
| **Path Params** | `id` (course_id - number) |
| **Input** | Body (JSON) - comment (lý do từ chối) |
| **Output** | Thông báo từ chối thành công |

**Ví dụ URL:**
```
PATCH /api/admin/courses/123/reject
```

**Ví dụ Input (Body):**
```json
{
  "comment": "Nội dung chưa đầy đủ, cần bổ sung thêm bài học"
}
```

**Ví dụ Output:**
```json
{
  "EM": "Từ chối khóa học thành công",
  "EC": "0",
  "DT": {
    "course_id": 123,
    "status": "draft"
  }
}
```

**Lưu ý:**
- Sau khi từ chối, status sẽ chuyển về `draft`
- Lý do từ chối sẽ được lưu vào `course_reviews` với status `rejected`

---

### 3.5. Xóa/Archive khóa học

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `DELETE /api/admin/courses/:id` |
| **Method** | `DELETE` |
| **Auth** | ✅ Bắt buộc (Bearer Token - Admin) |
| **Path Params** | `id` (course_id - number) |
| **Input** | Không có |
| **Output** | Thông báo xóa thành công |

**Ví dụ URL:**
```
DELETE /api/admin/courses/123
```

**Ví dụ Output:**
```json
{
  "EM": "Gỡ (archive) khóa học thành công",
  "EC": "0",
  "DT": {
    "course_id": 123,
    "status": "archived"
  }
}
```

**Lưu ý:**
- Không xóa thực sự, chỉ chuyển status thành `archived`
- Khóa học sẽ không hiển thị cho người dùng

---

### 3.6. Lấy danh sách giảng viên (Admin)

| Thông tin | Chi tiết |
|-----------|----------|
| **URL** | `GET /api/admin/instructors` |
| **Method** | `GET` |
| **Auth** | ✅ Bắt buộc (Bearer Token - Admin) |
| **Query Params** | `page`, `limit`, `keyword`, `status` |
| **Input** | Query parameters (optional) |
| **Output** | Danh sách giảng viên với pagination |

**Ví dụ URL:**
```
GET /api/admin/instructors?page=1&limit=20&keyword=Nguyễn&status=active
```

**Ví dụ Input (Query Params):**
```javascript
{
  page: "1",           // Trang hiện tại
  limit: "20",         // Số lượng mỗi trang
  keyword: "Nguyễn",   // Tìm theo tên hoặc email
  status: "active"     // 'active' | 'inactive'
}
```

**Ví dụ Output:**
```json
{
  "EM": "Lấy danh sách giảng viên thành công",
  "EC": "0",
  "DT": {
    "instructors": [
      {
        "instructor_id": 5,
        "name": "Nguyễn Văn A",
        "is_active": true,
        "is_verified": true,
        "experience_years": 10,
        "created_at": "2024-01-01T10:00:00Z",
        "total_courses": 15,
        "user": {
          "user_id": 10,
          "email": "instructor@example.com",
          "full_name": "Nguyễn Văn A"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 30,
      "items_per_page": 20
    }
  }
}
```

---

## 📝 GHI CHÚ QUAN TRỌNG

### Format Response Chung

Tất cả API đều trả về format chuẩn:
```json
{
  "EM": "Thông báo (Message)",
  "EC": "Mã lỗi (Error Code)",
  "DT": "Dữ liệu (Data)"
}
```

**Mã lỗi (EC):**
- `"0"`: Thành công
- `"2"`: Không tìm thấy
- `"3"`: Không có quyền
- `"4"`: Trạng thái không hợp lệ
- `"-2"`: Lỗi server

### Authentication

- **Client APIs**: Hầu hết không cần auth, trừ các API liên quan đến user (enroll, my-courses, progress)
- **Instructor APIs**: Tất cả đều cần auth (Bearer Token)
- **Admin APIs**: Tất cả đều cần auth (Bearer Token - Admin role)

### Status của Course

- `draft`: Bản nháp
- `pending_review`: Đang chờ duyệt
- `published`: Đã được duyệt và xuất bản
- `archived`: Đã bị gỡ/xóa

