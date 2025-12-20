# 📋 MẪU TEMPLATE USE CASE

## Use Case Specification Template

| **Field** | **Nội dung** |
|-----------|--------------|
| **UC ID and Name** | UC01 – Add Courses (ID và tên của use-case) |
| **Created By** | Người tạo ra use-case |
| **Date Created** | Ngày tạo |
| **Primary Actor** | Tác nhân chính: những tác nhân sử dụng những chức năng cơ bản/ những năng chính của hệ thống |
| **Secondary Actors** | Tác nhân phụ: Những tác nhân sử dụng các chức năng phụ của hệ thống. Tác nhân chỉ thực hiện giao tiếp khi được yêu cầu từ hệ thống tại thời điểm thực thi của use-case. |
| **Trigger** | Điều kiện kích hoạt để use-case xảy ra |
| **Description** | Tóm tắt nhanh, ngắn gọn sự tương tác được thể hiện trong use-case |
| **Pre-conditions** | Tiền điều kiện: Điều kiện cần để use-case thực hiện thành công |
| **Post conditions** | Sau khi use-case thực hiện thành công, thì những thứ sẽ xuất hiện sau đó là gì? |
| **Normal Flow** | Luồng tương tác chính giữa actor với hệ thống để use-case thực hiện thành công |
| **Alternative Flows** | Luồng tương tác thay thế giữa actor và hệ thống để use-case thực hiện thành công |
| **Exceptions** | Luồng tương tác ngoại lệ giữa actor và hệ thống để use-case thực hiện thất bại |
| **Priority** | Mức độ ưu tiên giữa use-case này với những use-case khác trong hệ thống (Low/ Medium/ High) |
| **Frequency of Use** | Tần suất sử dụng của use-case (Low/ Medium/ High) |
| **Business Rules** | Các quy định về mặt kinh doanh mà hệ thống bắt buộc phải thực hiện/ Các chính sách của khách hàng |
| **Other Information/ Non-functional requirements** | Liệt kê các yêu cầu phi chức năng mà use-case phải đáp ứng |
| **Assumptions** | Các giả sử để use-case thực hiện được |

---

## 📝 Ví dụ Use Case Mẫu: UC01 – Add Courses

| **Field** | **Nội dung** |
|-----------|--------------|
| **UC ID and Name** | UC01 – Add Courses |
| **Created By** | Nguyễn Văn A |
| **Date Created** | 2024-12-15 |
| **Primary Actor** | Instructor (Giảng viên) |
| **Secondary Actors** | Admin (Quản trị viên) - để duyệt khóa học sau khi được gửi |
| **Trigger** | Instructor đăng nhập vào hệ thống và click vào nút "Tạo khóa học mới" |
| **Description** | Instructor tạo một khóa học mới bằng cách nhập thông tin khóa học, thêm modules và lessons. Sau khi hoàn thành, instructor có thể lưu nháp hoặc gửi khóa học để admin duyệt. |
| **Pre-conditions** | <ul><li>Instructor đã đăng nhập vào hệ thống</li><li>Instructor có quyền tạo khóa học (role = "instructor")</li><li>Hệ thống đang hoạt động bình thường</li></ul> |
| **Post conditions** | <ul><li>Khóa học mới được tạo thành công trong hệ thống</li><li>Khóa học có trạng thái "draft" (nháp) hoặc "pending" (chờ duyệt)</li><li>Instructor có thể xem và chỉnh sửa khóa học vừa tạo</li><li>Nếu gửi duyệt, Admin sẽ nhận được thông báo về khóa học mới cần duyệt</li></ul> |
| **Normal Flow** | <ol><li>Instructor click vào "Tạo khóa học mới"</li><li>Hệ thống hiển thị form tạo khóa học</li><li>Instructor nhập thông tin cơ bản: title, description, category, level, price, thumbnail</li><li>Instructor thêm modules vào khóa học</li><li>Với mỗi module, instructor thêm lessons (chọn lesson_type và nhập lesson_data)</li><li>Instructor click "Lưu" hoặc "Gửi duyệt"</li><li>Hệ thống validate dữ liệu</li><li>Hệ thống lưu khóa học vào database</li><li>Hệ thống hiển thị thông báo thành công</li><li>Instructor được chuyển đến trang quản lý khóa học</li></ol> |
| **Alternative Flows** | <ul><li><b>AF1:</b> Instructor chỉ nhập thông tin cơ bản và click "Lưu nháp" → Khóa học được lưu với trạng thái "draft", có thể chỉnh sửa sau</li><li><b>AF2:</b> Instructor sử dụng chức năng "Tạo khóa học đầy đủ" → Nhập tất cả thông tin (course + modules + lessons) trong một form → Hệ thống tạo tất cả cùng lúc</li><li><b>AF3:</b> Instructor upload thumbnail → Hệ thống validate và lưu file ảnh → Hiển thị preview</li></ul> |
| **Exceptions** | <ul><li><b>E1:</b> Dữ liệu không hợp lệ (thiếu trường bắt buộc, format sai) → Hệ thống hiển thị lỗi validation, yêu cầu sửa lại</li><li><b>E2:</b> Upload file thumbnail quá lớn (>5MB) → Hệ thống từ chối và yêu cầu chọn file khác</li><li><b>E3:</b> Mất kết nối mạng trong khi lưu → Hệ thống hiển thị lỗi, dữ liệu không được lưu</li><li><b>E4:</b> Instructor không có quyền tạo khóa học → Hệ thống từ chối và hiển thị thông báo lỗi</li><li><b>E5:</b> Database lỗi → Hệ thống rollback transaction, hiển thị lỗi hệ thống</li></ul> |
| **Priority** | High |
| **Frequency of Use** | Medium |
| **Business Rules** | <ul><li>Instructor chỉ có thể tạo tối đa 10 khóa học ở trạng thái "draft" cùng lúc</li><li>Khóa học phải có ít nhất 1 module và 1 lesson trước khi gửi duyệt</li><li>Giá khóa học phải >= 0 (có thể miễn phí)</li><li>Title khóa học phải duy nhất trong hệ thống</li><li>Thumbnail phải là file ảnh (jpg, png) và kích thước <= 5MB</li><li>Khóa học ở trạng thái "draft" có thể chỉnh sửa, "pending" và "approved" không thể chỉnh sửa trực tiếp</li></ul> |
| **Other Information/ Non-functional requirements** | <ul><li><b>Performance:</b> Form tạo khóa học phải load trong vòng 2 giây</li><li><b>Usability:</b> Giao diện phải thân thiện, dễ sử dụng, có hướng dẫn rõ ràng</li><li><b>Reliability:</b> Hệ thống phải đảm bảo dữ liệu không bị mất khi lưu</li><li><b>Security:</b> Chỉ instructor có quyền mới được tạo khóa học, validate dữ liệu đầu vào để tránh SQL injection, XSS</li><li><b>Compatibility:</b> Hỗ trợ các trình duyệt phổ biến (Chrome, Firefox, Safari, Edge)</li><li><b>Scalability:</b> Hệ thống phải hỗ trợ nhiều instructor tạo khóa học đồng thời</li></ul> |
| **Assumptions** | <ul><li>Instructor đã có kiến thức về cách sử dụng hệ thống</li><li>Instructor có quyền truy cập internet ổn định</li><li>Hệ thống database đang hoạt động bình thường</li><li>Instructor có sẵn nội dung khóa học để nhập vào hệ thống</li><li>File thumbnail (nếu có) đã được chuẩn bị sẵn ở định dạng phù hợp</li></ul> |

---

## 📋 Format Bảng Đơn Giản (Để Copy vào Word/Excel)

```
UC ID and Name:	UC01 – Add Courses
Created By:	Nguyễn Văn A
Date Created:	2024-12-15
Primary Actor:	Instructor (Giảng viên)
Secondary Actors:	Admin (Quản trị viên)
Trigger:	Instructor đăng nhập vào hệ thống và click vào nút "Tạo khóa học mới"
Description:	Instructor tạo một khóa học mới bằng cách nhập thông tin khóa học, thêm modules và lessons.
Pre-conditions:	1. Instructor đã đăng nhập vào hệ thống
			2. Instructor có quyền tạo khóa học (role = "instructor")
			3. Hệ thống đang hoạt động bình thường
Post conditions:	1. Khóa học mới được tạo thành công trong hệ thống
			2. Khóa học có trạng thái "draft" hoặc "pending"
			3. Instructor có thể xem và chỉnh sửa khóa học vừa tạo
Normal Flow:	1. Instructor click vào "Tạo khóa học mới"
			2. Hệ thống hiển thị form tạo khóa học
			3. Instructor nhập thông tin cơ bản
			4. Instructor thêm modules và lessons
			5. Instructor click "Lưu" hoặc "Gửi duyệt"
			6. Hệ thống validate và lưu khóa học
			7. Hệ thống hiển thị thông báo thành công
Alternative Flows:	AF1: Lưu nháp
			AF2: Tạo khóa học đầy đủ trong một form
			AF3: Upload thumbnail
Exceptions:	E1: Dữ liệu không hợp lệ
		E2: File upload quá lớn
		E3: Mất kết nối mạng
		E4: Không có quyền
		E5: Database lỗi
Priority:	High
Frequency of Use:	Medium
Business Rules:	1. Tối đa 10 khóa học draft cùng lúc
		2. Phải có ít nhất 1 module và 1 lesson
		3. Giá >= 0
		4. Title phải duy nhất
Other Information/ Non-functional requirements:	1. Performance: Load trong 2 giây
						2. Usability: Giao diện thân thiện
						3. Security: Validate dữ liệu đầu vào
Assumptions:	1. Instructor đã biết cách sử dụng hệ thống
		2. Có kết nối internet ổn định
		3. Database hoạt động bình thường
```

