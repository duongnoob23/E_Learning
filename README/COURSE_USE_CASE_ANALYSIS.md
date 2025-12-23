## 📚 Phân tích Use Case module Course (User + Admin)

Tài liệu này tổng hợp và phân tích lại **toàn bộ các use case liên quan đến Course** trong hệ thống E-Learning, bao gồm cả phía **User (client)** và **Admin**. Mỗi use case được mô tả ngắn gọn theo đúng tinh thần template `MAU_USE_CASE_TEMPLATE.md` (ID, Actor chính, Trigger, Mô tả, Luồng chính, Luồng thay thế, Ngoại lệ).

---

## 1. Nhóm Use Case Course phía User (Client)

### UC-COURSE-001 – Xem danh sách khóa học

- **Primary Actor**: User (khách vãng lai hoặc đã đăng nhập)  
- **Trigger**: User truy cập trang `Khóa học` hoặc trang chủ và click menu `Khóa học`.  
- **Mục tiêu**: Xem được danh sách khóa học kèm filter, search, sort, pagination.  
- **Normal Flow (tóm tắt)**:
  1. User mở trang danh sách khóa học.
  2. Hệ thống hiển thị loading rồi load danh sách khóa học mặc định (mới nhất, 12 khóa/trang).
  3. Hệ thống load danh sách filter (category, level, instructor, price, rating) ở sidebar.
  4. User xem danh sách và có thể chuyển trang.  
- **Alternative Flows (chính)**:
  - AF1: User chọn filter category/level/instructor → danh sách được lọc lại.  
  - AF2: User search theo tên khóa học → danh sách hiển thị kết quả khớp.  
  - AF3: User thay đổi tiêu chí sort (giá, rating, mới nhất) → hệ thống sắp xếp lại.  
  - AF4: User đổi view mode (grid/list) → layout và số items/trang thay đổi.  
- **Exceptions (chính)**:
  - E1: Không load được danh sách khóa học → hiển thị thông báo lỗi + nút `Thử lại`.  
  - E2: Không có kết quả theo filter/search → hiển thị empty state + nút `Xóa bộ lọc`.  

---

### UC-COURSE-002 – Xem chi tiết / preview khóa học

- **Primary Actor**: User  
- **Trigger**: User click vào một khóa học ở danh sách.  
- **Mục tiêu**: Xem chi tiết khóa học trước khi đăng ký (thông tin, instructor, curriculum, review, giá, trạng thái).  
- **Normal Flow (tóm tắt)**:
  1. User click vào card khóa học.
  2. Hệ thống gọi API preview theo `course_id`.
  3. Hệ thống hiển thị trang chi tiết khóa học với mô tả, mục tiêu, đối tượng, modules/lessons, rating, số lượng học viên, v.v.
  4. Nếu user đã enroll, có thêm nút `Tiếp tục học`; nếu chưa enroll, hiển thị `Đăng ký ngay`.  
- **Alternative Flows**:
  - AF1: User truy cập trực tiếp qua URL `/courses/:course_id` → hệ thống load preview tương tự.  
  - AF2: Khóa học là miễn phí → nút call-to-action có thể là `Học ngay` thay vì `Thanh toán/Đăng ký`.  
- **Exceptions**:
  - E1: `course_id` không tồn tại hoặc bị ẩn → hiển thị thông báo `Khóa học không tồn tại hoặc đã bị gỡ`.  
  - E2: Lỗi backend khi load preview → hiển thị thông báo lỗi chung và cho phép quay lại danh sách.  

---

### UC-COURSE-004 – Đăng ký khóa học

- **Primary Actor**: User đã đăng nhập.  
- **Trigger**: Từ trang chi tiết/preview khóa học, User click nút `Đăng ký` / `Enroll`.  
- **Mục tiêu**: Tạo enrollment cho user với khóa học tương ứng (miễn phí hoặc trả phí).  
- **Pre-conditions**:
  - User đã đăng nhập.
  - Khóa học ở trạng thái `approved` và `publish`.  
- **Normal Flow (tóm tắt)**:
  1. User click `Đăng ký`.
  2. Frontend gọi API `enrollCourse(course_id)`.
  3. Backend kiểm tra điều kiện (đã đăng ký chưa, trạng thái khóa học, thanh toán nếu cần).
  4. Backend tạo bản ghi enrollment, khởi tạo tiến độ khóa học/bài học.
  5. Hệ thống trả về kết quả thành công, hiển thị thông báo và chuyển sang `My Courses` hoặc `Bắt đầu học`.  
- **Alternative Flows**:
  - AF1: Khóa học miễn phí → bỏ qua bước thanh toán, tạo enrollment ngay.  
  - AF2: Khóa học trả phí → chuyển sang flow thanh toán (out-of-scope trong tài liệu này) rồi quay lại tạo enrollment nếu thanh toán thành công.  
- **Exceptions**:
  - E1: User chưa đăng nhập → redirect sang trang đăng nhập, sau đó quay lại khóa học.  
  - E2: User đã đăng ký khóa học trước đó → hiển thị thông báo và chuyển sang `Tiếp tục học`.  
  - E3: Lỗi thanh toán / lỗi hệ thống → hiển thị thông báo lỗi, không tạo enrollment.  

---

### UC-COURSE-005 – Xem danh sách khóa học đã đăng ký (My Courses)

- **Primary Actor**: User đã đăng nhập.  
- **Trigger**: User truy cập trang `Khóa học của tôi` / `My Courses` từ menu profile/dashboard.  
- **Mục tiêu**: Xem danh sách các khóa học đã đăng ký kèm trạng thái tiến độ.  
- **Normal Flow (tóm tắt)**:
  1. User mở trang `My Courses`.
  2. Hệ thống gọi API `getUserCourses()`.
  3. Hệ thống hiển thị danh sách khóa học đã enroll với tiến độ (phần trăm hoàn thành, thời gian học gần nhất).  
- **Alternative Flows**:
  - AF1: Filter theo trạng thái (đang học, đã hoàn thành, chưa bắt đầu).  
  - AF2: Sort theo thời gian học gần nhất hoặc mới đăng ký.  
- **Exceptions**:
  - E1: User chưa có khóa học nào → hiển thị empty state + gợi ý quay lại trang `Khóa học`.  

---

### UC-COURSE-006 – Xem nội dung một bài học (Lesson)

- **Primary Actor**: User đã đăng ký khóa học.  
- **Trigger**: Từ Course Detail hoặc My Courses, user chọn một lesson để học.  
- **Mục tiêu**: Hiển thị nội dung bài học theo `lesson_type` (video, vocabulary_list, quiz, …).  
- **Normal Flow (tóm tắt)**:
  1. User chọn một lesson trong curriculum.
  2. Hệ thống gọi API `GET /lessons/:lesson_id`.
  3. Back-end trả về nội dung lesson và metadata (duration, yêu cầu hoàn thành, v.v.).
  4. Frontend render component tương ứng với `lesson_type` và hiển thị cho user học.  
- **Alternative Flows**:
  - AF1: User truy cập trực tiếp URL của lesson nếu đã có quyền học.  
- **Exceptions**:
  - E1: User chưa enroll khóa học nhưng cố mở lesson → redirect về trang detail/đăng ký.  
  - E2: Lesson đã bị xóa/ẩn → thông báo lỗi, ẩn khỏi curriculum.  

---

### UC-COURSE-007/008/009/010/011 – Học và theo dõi tiến độ khóa học

Nhóm use case này mô tả **toàn bộ lifecycle học khóa học**:

- **UC-COURSE-007 – Bắt đầu học bài học**
  - Trigger: User click `Bắt đầu học` ở một lesson lần đầu tiên.
  - Hệ thống tạo bản ghi bắt đầu học (start time, trạng thái `in_progress`).  

- **UC-COURSE-008 – Cập nhật tiến độ bài học**
  - Trigger: Khi user tương tác trong quá trình học (xem video, làm quiz, chuyển section).  
  - Hệ thống ghi nhận `progress_percentage`, `time_spent`, last_position.  

- **UC-COURSE-009 – Hoàn thành bài học**
  - Trigger: User đạt điều kiện hoàn thành (xem hết video, hoàn thành quiz, v.v.) và click `Hoàn thành`.  
  - Hệ thống đánh dấu lesson `completed`, cập nhật tiến độ khóa học.  

- **UC-COURSE-010 – Xem tiến độ bài học**
  - User mở lại lesson, hệ thống hiển thị tiến độ hiện tại, vị trí dở, trạng thái completed.  

- **UC-COURSE-011 – Xem tiến độ khóa học**
  - Ở trang Course Detail hoặc My Courses, hệ thống hiển thị tổng số lesson, số lesson đã hoàn thành, phần trăm tiến độ.  

Nhóm use case này giúp **theo dõi learning progress** ở cả cấp độ lesson và course, đồng thời phục vụ cho phần thống kê trong Profile/Reports.

---

## 2. Nhóm Use Case Course phía Admin

Nhóm này mô tả **luồng quản trị khóa học**: tạo–quản lý–xây dựng cấu trúc course (module, lesson) – duyệt publish.

### UC-ADMIN-COURSE-001 – Xem danh sách khóa học (Admin)

- **Primary Actor**: Admin  
- **Trigger**: Admin truy cập trang quản lý khóa học.  
- **Mục tiêu**: Xem tất cả khóa học trong hệ thống với filter theo trạng thái, category, instructor.  
- **Ý nghĩa**: Là điểm vào cho các thao tác duyệt, chỉnh sửa, xóa, xem chi tiết.  

---

### UC-ADMIN-COURSE-002 – Xem chi tiết / preview khóa học (Admin)

- **Primary Actor**: Admin  
- **Mục tiêu**: Xem đầy đủ thông tin course, modules, lessons để kiểm tra chất lượng trước khi duyệt.  
- **Liên quan chặt chẽ** đến UC-ADMIN-COURSE-013/014 (Approve/Reject).  

---

### UC-ADMIN-COURSE-003/004 – Tạo khóa học (cơ bản & đầy đủ)

- **UC-ADMIN-COURSE-003 – Tạo khóa học mới (thông tin cơ bản)**
  - Admin nhập thông tin course cơ bản (title, description, category, level, price, thumbnail) rồi lưu.
  - Kết quả: Khóa học ở trạng thái `draft`, chưa có modules/lessons.  

- **UC-ADMIN-COURSE-004 – Tạo khóa học đầy đủ (course + modules + lessons)**
  - Một form builder cho phép admin tạo course, modules, lessons trong một lần.
  - Kết quả: Khóa học đã có cấu trúc hoàn chỉnh sẵn sàng gửi duyệt/publish.  

---

### UC-ADMIN-COURSE-005/006 – Cập nhật & Xóa khóa học

- Cho phép admin **chỉnh sửa thông tin** (title, description, price, metadata) hoặc **xóa** khóa học (thường là soft delete).  
- Ràng buộc business:
  - Không cho xóa/đổi một số thuộc tính khi khóa học đã có học viên hoặc đang ở trạng thái `approved/publish` (tùy policy).  

---

### UC-ADMIN-COURSE-007/008/009 – Quản lý Module trong khóa học

- **Thêm module mới** vào course.  
- **Cập nhật module** (tên, mô tả, sort_order).  
- **Xóa module** nếu chưa/ít phụ thuộc (chưa có học viên hoặc chưa có lessons…).  

Các use case này là bước trung gian để xây dựng **curriculum tree** (Course → Modules → Lessons).

---

### UC-ADMIN-COURSE-010/011/012 – Quản lý Lesson

- **Thêm bài học** vào module: chọn `lesson_type`, nhập `lesson_data` (video, vocabulary, quiz, grammar…).  
- **Cập nhật bài học**: chỉnh sửa nội dung, metadata, thứ tự.  
- **Xóa bài học**: loại bỏ lesson khỏi module (có thể soft delete, cần rule rõ khi đã có học viên).  

Đây là nơi kết nối giữa **Course** và các **Lesson types** (9 loại lesson trong tài liệu tổng quan).

---

### UC-ADMIN-COURSE-013/014 – Duyệt và Từ chối khóa học

- **UC-ADMIN-COURSE-013 – Duyệt khóa học**
  - Trigger: Instructor/Admin gửi course ở trạng thái `pending`.  
  - Admin xem chi tiết, nếu đạt yêu cầu → click `Approve`.  
  - Hệ thống chuyển trạng thái course sang `approved/publish`, khóa học bắt đầu xuất hiện ở danh sách phía User.  

- **UC-ADMIN-COURSE-014 – Từ chối khóa học**
  - Admin nhập `rejection_reason` và click `Reject`.  
  - Hệ thống chuyển trạng thái course sang `rejected`, gửi/hiển thị lý do cho instructor.  

Nhóm use case này là **cầu nối giữa phía tạo nội dung (Admin/Instructor)** và **phía User** (chỉ thấy khóa học đã được duyệt).

---

## 3. Kết nối Use Case User ↔ Admin trong module Course

- **Admin** chịu trách nhiệm: tạo, cấu hình, duyệt và bảo trì Course/Module/Lesson.  
- **User** chỉ tương tác với **khóa học đã được duyệt** thông qua các use case: xem danh sách khóa học, xem preview, đăng ký, học, theo dõi tiến độ.  
- Mối quan hệ:
  - UC-ADMIN-COURSE-003/004/007/010 tạo ra dữ liệu cho UC-COURSE-001/002/006/007–011.  
  - UC-ADMIN-COURSE-013/014 quyết định khóa học nào được xuất hiện trong flow phía User.  

Tài liệu này dùng làm **xương sống** để bạn viết chi tiết từng Use Case Specification + Scenario cho module Course theo đúng template chuẩn.


