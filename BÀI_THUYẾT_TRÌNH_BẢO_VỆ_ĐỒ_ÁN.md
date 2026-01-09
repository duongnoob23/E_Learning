# BÀI THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN TỐT NGHIỆP
## HỆ THỐNG E-LEARNING TOTC

---

## I. GIỚI THIỆU TỔNG QUAN

Kính thưa Hội đồng bảo vệ đồ án!

Em xin được trình bày đồ án tốt nghiệp với đề tài: **"Xây dựng hệ thống e-learning hỗ trợ và luyện thi tiếng Anh trực tuyến"**.

Hệ thống được xây dựng với kiến trúc 3 tầng:
- **Frontend**: React.js với Redux và TanStack Query
- **Backend**: Node.js với Express.js và Sequelize ORM
- **Database**: MySQL

Hệ thống được chia thành 2 phần chính: **Client** dành cho người học và **Admin** dành cho quản trị viên.

---

## II. CÁC TÍNH NĂNG CHÍNH

### 1. HỆ THỐNG QUẢN LÝ KHÓA HỌC VÀ THANH TOÁN

#### **Phía Client:**
- **Xem danh sách khóa học**: Người dùng có thể duyệt các khóa học theo danh mục, tìm kiếm và lọc theo nhiều tiêu chí như giá, đánh giá, số lượng học viên.
- **Xem chi tiết khóa học**: Hiển thị đầy đủ thông tin khóa học bao gồm mô tả, chương trình học, giảng viên, đánh giá từ học viên, và preview nội dung.
- **Mua khóa học**: Tích hợp thanh toán qua VNPay, người dùng điền thông tin giao dịch và thanh toán trực tuyến. Hệ thống tự động kích hoạt khóa học sau khi thanh toán thành công.
- **Quản lý khóa học đã mua**: Trang "My Courses" hiển thị tất cả khóa học đã đăng ký, tiến độ học tập, và cho phép tiếp tục học từ bài học cuối cùng.

#### **Phía Admin:**
- **Quản lý khóa học**: Admin có thể tạo mới, chỉnh sửa, xóa khóa học. Hỗ trợ upload hình ảnh, video preview, thiết lập giá và giá khuyến mãi.
- **Quản lý bài học**: Tạo và quản lý các module, lesson trong khóa học. Hỗ trợ nhiều loại bài học như video, bài đọc, bài tập tương tác.
- **Quản lý giao dịch**: Xem danh sách tất cả đơn hàng, chi tiết giao dịch, trạng thái thanh toán, và có thể cập nhật trạng thái đơn hàng.

**Điểm nổi bật**: Hệ thống tích hợp thanh toán VNPay một cách an toàn, tự động cập nhật trạng thái đăng ký khóa học sau khi thanh toán thành công, và cung cấp trải nghiệm mua sắm mượt mà cho người dùng.

---

### 2. HỆ THỐNG ĐÁNH GIÁ VÀ THI TRỰC TUYẾN

#### **Phía Client:**
- **Làm bài thi TOEIC**: Giao diện làm bài thi với đầy đủ các phần Listening và Reading. Hệ thống hỗ trợ phát audio cho phần nghe, hiển thị câu hỏi trắc nghiệm, điền từ, và các dạng câu hỏi khác.
- **Quản lý thời gian**: Đồng hồ đếm ngược tự động, cảnh báo khi sắp hết thời gian, và tự động nộp bài khi hết giờ.
- **Xem kết quả chi tiết**: Sau khi hoàn thành bài thi, hệ thống hiển thị điểm số, phân tích từng phần, đáp án đúng/sai, và gợi ý cải thiện.
- **Thống kê tiến độ**: Người dùng có thể xem lịch sử làm bài, điểm số theo thời gian, và thống kê điểm mạnh, điểm yếu của mình.

#### **Phía Admin:**
- **Tạo và quản lý đề thi**: Admin có thể tạo đề thi mới với giao diện kéo thả trực quan. Hỗ trợ tạo nhiều phần (Part) khác nhau, mỗi phần có thể có số lượng câu hỏi và thời gian riêng.
- **Quản lý câu hỏi**: Tạo, chỉnh sửa, xóa câu hỏi với nhiều loại: trắc nghiệm, điền từ, nghe hiểu. Hỗ trợ upload audio, hình ảnh cho câu hỏi.
- **Xem kết quả học viên**: Admin có thể xem chi tiết kết quả làm bài của từng học viên, phân tích xu hướng điểm số, và xuất báo cáo thống kê.

**Điểm nổi bật**: Hệ thống hỗ trợ đánh giá Speaking và Writing với tích hợp AI để chấm điểm tự động, cung cấp phản hồi chi tiết giúp học viên cải thiện kỹ năng.

---

### 3. HỆ THỐNG HỌC TỪ VỰNG VỚI FLASHCARD

#### **Phía Client:**
- **Học từ vựng thông minh**: Hệ thống Flashcard với thuật toán Spaced Repetition, tự động sắp xếp từ vựng cần ôn tập dựa trên độ khó và tần suất sai.
- **Tạo bộ từ vựng cá nhân**: Người dùng có thể tạo các topic từ vựng riêng, thêm từ mới kèm nghĩa, ví dụ, phát âm, và hình ảnh minh họa.
- **Khám phá bộ từ vựng công khai**: Duyệt và học từ các bộ từ vựng được chia sẻ bởi cộng đồng, có thể lưu vào danh sách yêu thích.
- **Theo dõi tiến độ**: Hiển thị số từ đã học, số từ cần ôn tập hôm nay, và thống kê tổng quan về quá trình học tập.

#### **Phía Admin:**
- **Quản lý từ vựng hệ thống**: Admin có thể thêm, sửa, xóa từ vựng trong hệ thống. Hỗ trợ import hàng loạt từ file Excel hoặc CSV.
- **Quản lý topic công khai**: Duyệt và phê duyệt các topic từ vựng do người dùng tạo, có thể đưa lên làm topic công khai hoặc gỡ bỏ nếu vi phạm.
- **Thống kê sử dụng**: Xem thống kê về số lượng topic được tạo, số từ vựng được học, và các topic phổ biến nhất.

**Điểm nổi bật**: Hệ thống sử dụng thuật toán Spaced Repetition để tối ưu hóa việc ghi nhớ từ vựng, tự động nhắc nhở ôn tập đúng thời điểm, giúp người học ghi nhớ lâu dài.

---

## III. CÔNG NGHỆ VÀ KỸ THUẬT SỬ DỤNG

### Frontend:
- **React.js 18**: Framework chính cho giao diện người dùng
- **Redux Toolkit**: Quản lý state toàn cục
- **TanStack Query**: Quản lý server state và caching
- **React Router**: Điều hướng trang
- **Axios**: Gọi API

### Backend:
- **Node.js & Express.js**: Xây dựng RESTful API
- **Sequelize ORM**: Tương tác với database
- **JWT**: Xác thực và phân quyền
- **Bcrypt**: Mã hóa mật khẩu
- **VNPay SDK**: Tích hợp thanh toán

### Database:
- **MySQL**: Lưu trữ dữ liệu chính
- Thiết kế database chuẩn hóa với các bảng: users, courses, lessons, exams, questions, orders, payments, flashcards, topics, words

### Bảo mật:
- Xác thực 2 lớp với OTP qua email
- Phân quyền dựa trên Role-Based Access Control (RBAC)
- Validate dữ liệu đầu vào ở cả client và server
- Mã hóa mật khẩu và token

---

## IV. KẾT QUẢ ĐẠT ĐƯỢC

Hệ thống đã được xây dựng hoàn chỉnh với:
- ✅ Giao diện thân thiện, responsive trên mọi thiết bị
- ✅ Hiệu năng tốt với caching và tối ưu hóa truy vấn
- ✅ Bảo mật cao với xác thực đa lớp
- ✅ Trải nghiệm người dùng mượt mà
- ✅ Quản trị dễ dàng cho admin

---

## V. HƯỚNG PHÁT TRIỂN

- Tích hợp thêm các phương thức thanh toán khác
- Mở rộng hỗ trợ nhiều loại đề thi (IELTS, TOEFL)
- Phát triển ứng dụng mobile
- Tích hợp AI để cá nhân hóa lộ trình học tập
- Thêm tính năng học nhóm và thảo luận

---

## VI. KẾT LUẬN

Hệ thống E-Learning TOTC đã được xây dựng thành công với đầy đủ các tính năng cốt lõi, đáp ứng nhu cầu học tập trực tuyến hiện đại. Hệ thống không chỉ cung cấp nội dung học tập chất lượng mà còn tạo ra một môi trường học tập tương tác và hiệu quả.

Em xin cảm ơn Hội đồng đã lắng nghe. Em sẵn sàng trả lời các câu hỏi của Hội đồng!

---

**Thời gian trình bày dự kiến: 8-10 phút**

