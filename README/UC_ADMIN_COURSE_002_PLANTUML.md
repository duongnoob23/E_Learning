# 📊 USE CASE DIAGRAM - UC-ADMIN-COURSE-002: Tạo khóa học mới

## 🎯 Use Case Information

**Use Case ID:** UC-ADMIN-COURSE-002  
**Use Case Name:** Tạo khóa học mới  
**Primary Actor:** Admin  
**Secondary Actors:** Không có

---

## 🔷 PlantUML Code

```plantuml
@startuml UC-ADMIN-COURSE-002-Tao-Khoa-Hoc-Moi

title Use Case Diagram - Tạo khóa học mới (Admin)

left to right direction

actor Admin as admin

rectangle "Hệ thống E-Learning" {

  ' Use case chính
  usecase "UC-ADMIN-COURSE-002\nTạo khóa học mới" as UC_CreateCourse

  ' Include use cases (bắt buộc)
  usecase "Đăng nhập Admin" as UC_Login
  usecase "Xem danh sách khóa học" as UC_ViewCourseList

  ' Extend use cases - Course Info Tab
  usecase "Nhập thông tin cơ bản\n(Course Info)" as UC_CourseInfo
  usecase "Upload ảnh đại diện" as UC_UploadImage

  ' Extend use cases - Course Intro Video Tab
  usecase "Thêm video giới thiệu\n(Course Intro Video)" as UC_IntroVideo
  usecase "Upload video file" as UC_UploadVideo

  ' Extend use cases - Course Builder Tab
  usecase "Tạo Module mới" as UC_CreateModule
  usecase "Chỉnh sửa Module" as UC_EditModule
  usecase "Xóa Module" as UC_DeleteModule
  usecase "Tạo Lesson mới" as UC_CreateLesson
  usecase "Chọn loại Lesson" as UC_SelectLessonType
  usecase "Nhập thông tin Lesson" as UC_EnterLessonInfo
  usecase "Xem Preview Lesson" as UC_PreviewLesson
  usecase "Lưu Lesson" as UC_SaveLesson

  ' Extend use cases - Additional Information Tab
  usecase "Nhập thông tin bổ sung\n(Additional Information)" as UC_AdditionalInfo

  ' Extend use cases - Validation & Actions
  usecase "Validate dữ liệu" as UC_Validate
  usecase "Lưu khóa học" as UC_SaveCourse
  usecase "Hủy tạo khóa học" as UC_CancelCreate

  ' Relationships - Include (bắt buộc)
  UC_CreateCourse ..> UC_Login : <<include>>
  UC_CreateCourse ..> UC_ViewCourseList : <<include>>

  ' Relationships - Extend (tùy chọn)
  UC_CourseInfo ..> UC_CreateCourse : <<extend>>
  UC_UploadImage ..> UC_CourseInfo : <<extend>>

  UC_IntroVideo ..> UC_CreateCourse : <<extend>>
  UC_UploadVideo ..> UC_IntroVideo : <<extend>>

  UC_CreateModule ..> UC_CreateCourse : <<extend>>
  UC_EditModule ..> UC_CreateCourse : <<extend>>
  UC_DeleteModule ..> UC_CreateCourse : <<extend>>

  UC_CreateLesson ..> UC_CreateModule : <<extend>>
  UC_SelectLessonType ..> UC_CreateLesson : <<extend>>
  UC_EnterLessonInfo ..> UC_CreateLesson : <<extend>>
  UC_PreviewLesson ..> UC_EnterLessonInfo : <<extend>>
  UC_SaveLesson ..> UC_EnterLessonInfo : <<extend>>

  UC_AdditionalInfo ..> UC_CreateCourse : <<extend>>

  UC_Validate ..> UC_SaveCourse : <<extend>>
  UC_SaveCourse ..> UC_CreateCourse : <<extend>>
  UC_CancelCreate ..> UC_CreateCourse : <<extend>>
}

' Actor relationships
admin --> UC_CreateCourse
admin --> UC_Login
admin --> UC_ViewCourseList

note right of UC_CreateCourse
  **Normal Flow:**
  1. Admin đăng nhập → Xem danh sách khóa học
  2. Click "Tạo khóa học"
  3. Nhập Course Info
  4. Thêm Intro Video (tùy chọn)
  5. Tạo Modules và Lessons
  6. Nhập Additional Info (tùy chọn)
  7. Lưu khóa học
end note

note right of UC_Validate
  **AF1:** Validate khi thiếu
  trường bắt buộc hoặc
  sai định dạng
end note

note right of UC_CancelCreate
  **AF2:** Admin hủy tạo
  khóa học
end note

note right of UC_EditModule
  **AF3:** Chỉnh sửa module
  đã tạo
end note

note right of UC_DeleteModule
  **AF4:** Xóa module đã tạo
end note

@enduml
```

---

## 🔷 Simplified PlantUML Code (Phiên bản đơn giản hơn)

```plantuml
@startuml UC-ADMIN-COURSE-002-Simplified

title Use Case Diagram - Tạo khóa học mới (Simplified)

left to right direction

actor Admin as admin

rectangle "Hệ thống E-Learning" {

  usecase "Tạo khóa học mới" as UC_CreateCourse

  ' Include
  usecase "Đăng nhập Admin" as UC_Login
  usecase "Xem danh sách khóa học" as UC_ViewList

  ' Extend - Main tabs
  usecase "Nhập Course Info" as UC_Info
  usecase "Thêm Intro Video" as UC_Video
  usecase "Course Builder\n(Tạo Modules/Lessons)" as UC_Builder
  usecase "Additional Information" as UC_Additional

  ' Extend - Actions
  usecase "Validate & Lưu" as UC_Save
  usecase "Hủy" as UC_Cancel

  ' Relationships
  UC_CreateCourse ..> UC_Login : <<include>>
  UC_CreateCourse ..> UC_ViewList : <<include>>

  UC_Info ..> UC_CreateCourse : <<extend>>
  UC_Video ..> UC_CreateCourse : <<extend>>
  UC_Builder ..> UC_CreateCourse : <<extend>>
  UC_Additional ..> UC_CreateCourse : <<extend>>

  UC_Save ..> UC_CreateCourse : <<extend>>
  UC_Cancel ..> UC_CreateCourse : <<extend>>
}

admin --> UC_CreateCourse

@enduml
```

---

## 🔷 Detailed PlantUML Code (Chi tiết đầy đủ với tất cả Alternative Flows)

```plantuml
@startuml UC-ADMIN-COURSE-002-Detailed

title Use Case Diagram - Tạo khóa học mới (Detailed)

left to right direction

actor Admin as admin

rectangle "Hệ thống E-Learning" {

  package "Use Case Chính" {
    usecase "UC-ADMIN-COURSE-002\nTạo khóa học mới" as UC_Main
  }

  package "Include (Bắt buộc)" {
    usecase "Đăng nhập Admin" as UC_Login
    usecase "Xem danh sách khóa học" as UC_ViewList
  }

  package "Extend - Course Info Tab" {
    usecase "Nhập thông tin cơ bản" as UC_Info
    usecase "Upload ảnh đại diện" as UC_UploadImg
  }

  package "Extend - Intro Video Tab" {
    usecase "Thêm video giới thiệu" as UC_Video
    usecase "Upload video file" as UC_UploadVid
  }

  package "Extend - Course Builder Tab" {
    usecase "Tạo Module" as UC_AddModule
    usecase "Chỉnh sửa Module" as UC_EditModule
    usecase "Xóa Module" as UC_DelModule
    usecase "Tạo Lesson" as UC_AddLesson
    usecase "Chọn loại Lesson" as UC_SelectType
    usecase "Nhập thông tin Lesson" as UC_EnterLesson
    usecase "Preview Lesson" as UC_Preview
    usecase "Lưu Lesson" as UC_SaveLesson
  }

  package "Extend - Additional Info Tab" {
    usecase "Nhập thông tin bổ sung" as UC_Additional
  }

  package "Extend - Validation & Actions" {
    usecase "Validate dữ liệu\n(AF1: Thiếu trường bắt buộc)" as UC_Validate
    usecase "Lưu khóa học" as UC_Save
    usecase "Hủy tạo khóa học\n(AF2)" as UC_Cancel
  }

  ' Include relationships
  UC_Main ..> UC_Login : <<include>>
  UC_Main ..> UC_ViewList : <<include>>

  ' Extend relationships - Course Info
  UC_Info ..> UC_Main : <<extend>>
  UC_UploadImg ..> UC_Info : <<extend>>

  ' Extend relationships - Intro Video
  UC_Video ..> UC_Main : <<extend>>
  UC_UploadVid ..> UC_Video : <<extend>>

  ' Extend relationships - Course Builder
  UC_AddModule ..> UC_Main : <<extend>>
  UC_EditModule ..> UC_Main : <<extend>>\n(AF3)
  UC_DelModule ..> UC_Main : <<extend>>\n(AF4)

  UC_AddLesson ..> UC_AddModule : <<extend>>
  UC_SelectType ..> UC_AddLesson : <<extend>>
  UC_EnterLesson ..> UC_AddLesson : <<extend>>
  UC_Preview ..> UC_EnterLesson : <<extend>>
  UC_SaveLesson ..> UC_EnterLesson : <<extend>>

  ' Extend relationships - Additional Info
  UC_Additional ..> UC_Main : <<extend>>

  ' Extend relationships - Actions
  UC_Validate ..> UC_Save : <<extend>>\n(AF1)
  UC_Save ..> UC_Main : <<extend>>
  UC_Cancel ..> UC_Main : <<extend>>\n(AF2)
}

' Actor
admin --> UC_Main
admin --> UC_Login
admin --> UC_ViewList

note top of UC_Main
  **Normal Flow:**
  1. Đăng nhập → Xem danh sách
  2. Click "Tạo khóa học"
  3. Nhập Course Info
  4. Thêm Intro Video (optional)
  5. Tạo Modules & Lessons
  6. Nhập Additional Info (optional)
  7. Validate & Lưu
end note

note right of UC_Validate
  **AF1:** Khi Admin click "Lưu"
  nhưng thiếu trường bắt buộc
  hoặc sai định dạng
end note

note right of UC_Cancel
  **AF2:** Admin hủy tạo khóa học
  (có thể có dữ liệu chưa lưu)
end note

note right of UC_EditModule
  **AF3:** Chỉnh sửa module
  đã tạo trong Course Builder
end note

note right of UC_DelModule
  **AF4:** Xóa module đã tạo
  (cả lessons bên trong)
end note

@enduml
```

---

## 📋 Giải thích các mối quan hệ

### 1. **<<include>> Relationships (Bắt buộc)**

- **Đăng nhập Admin**: Admin phải đăng nhập trước khi có thể tạo khóa học
- **Xem danh sách khóa học**: Admin phải truy cập màn danh sách khóa học trước khi click nút "Tạo khóa học"

### 2. **<<extend>> Relationships (Tùy chọn)**

#### **Course Info Tab:**

- **Nhập thông tin cơ bản**: Admin có thể nhập thông tin cơ bản (tiêu đề, mô tả, giá, danh mục, trình độ)
- **Upload ảnh đại diện**: Admin có thể upload ảnh (tùy chọn)

#### **Course Intro Video Tab:**

- **Thêm video giới thiệu**: Admin có thể thêm video giới thiệu (tùy chọn)
- **Upload video file**: Admin có thể upload video file (tùy chọn)

#### **Course Builder Tab:**

- **Tạo Module**: Admin có thể tạo module mới
- **Chỉnh sửa Module (AF3)**: Admin có thể chỉnh sửa module đã tạo
- **Xóa Module (AF4)**: Admin có thể xóa module đã tạo
- **Tạo Lesson**: Admin có thể tạo lesson trong module
- **Chọn loại Lesson**: Admin phải chọn loại lesson (Video, Vocabulary List, Quiz, v.v.)
- **Nhập thông tin Lesson**: Admin nhập thông tin lesson
- **Preview Lesson**: Admin có thể xem preview lesson trước khi lưu (tùy chọn)
- **Lưu Lesson**: Admin lưu lesson vào module

#### **Additional Information Tab:**

- **Nhập thông tin bổ sung**: Admin có thể nhập thông tin bổ sung (mục tiêu, kỹ năng, yêu cầu, v.v.) - tùy chọn

#### **Validation & Actions:**

- **Validate dữ liệu (AF1)**: Hệ thống validate khi Admin click "Lưu" nhưng thiếu trường bắt buộc
- **Lưu khóa học**: Admin lưu toàn bộ khóa học sau khi hoàn tất
- **Hủy tạo khóa học (AF2)**: Admin có thể hủy việc tạo khóa học

---

## 🔗 Cách sử dụng

1. Copy mã PlantUML vào [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/)
2. Hoặc sử dụng extension PlantUML trong VS Code
3. Diagram sẽ được render tự động

---

## 📝 Notes

- **<<include>>**: Mối quan hệ bắt buộc - Use case chính không thể hoàn thành nếu không thực hiện use case được include
- **<<extend>>**: Mối quan hệ tùy chọn - Use case mở rộng chỉ được thực hiện khi điều kiện cụ thể được thỏa mãn
- Các Alternative Flows (AF1-AF4) được đánh dấu rõ ràng trong diagram
