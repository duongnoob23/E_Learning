# SLIDE THUYẾT TRÌNH ĐỒ ÁN TỐT NGHIỆP

## Slide 1: Trang Bìa

**XÂY DỰNG HỆ THỐNG E-LEARNING HỖ TRỢ HỌC VÀ LUYỆN THI TIẾNG ANH TRỰC TUYẾN**

- Sinh viên thực hiện: [Tên sinh viên]
- Giảng viên hướng dẫn: [Tên giảng viên]
- Khoa: [Tên khoa]
- Năm học: [Năm học]

---

## Slide 2: Mục Lục

1. Giới thiệu đề tài
2. Lý do chọn đề tài
3. Mục tiêu đồ án
4. Phạm vi và đối tượng sử dụng
5. Công nghệ sử dụng
6. Tổng quan kiến trúc hệ thống
7. Các vai trò trong hệ thống
8. Chức năng phía Client - Xác thực và Quản lý tài khoản
9. Chức năng phía Client - Khóa học và Học tập
10. Chức năng phía Client - Bài thi và Đánh giá
11. Chức năng phía Client - Từ vựng và Flashcard
12. Chức năng phía Client - Thanh toán
13. Chức năng phía Admin - Quản lý người dùng
14. Chức năng phía Admin - Quản lý khóa học
15. Chức năng phía Admin - Quản lý bài thi
16. Chức năng phía Admin - Quản lý từ vựng
17. Chức năng phía Admin - Thống kê và Báo cáo
18. Kiến trúc kỹ thuật - Backend
19. Kiến trúc kỹ thuật - Frontend và Database
20. Kết quả đạt được
21. Hạn chế của đồ án
22. Hướng phát triển trong tương lai
23. Kết luận
24. Lời cảm ơn

---

## Slide 3: Giới thiệu đề tài

**Hệ thống E-Learning hỗ trợ học và luyện thi tiếng Anh trực tuyến**

- Nền tảng học tập trực tuyến toàn diện
- Tập trung vào việc học tiếng Anh và luyện thi TOEIC
- Hỗ trợ đa dạng các hình thức học tập:
  - Khóa học video với nhiều loại bài học
  - Hệ thống thi thử với đầy đủ các kỹ năng
  - Học từ vựng thông minh với Flashcard và SRS
  - Đánh giá phát âm tự động bằng AI

---

## Slide 4: Lý do chọn đề tài

- **Nhu cầu thực tế cao**: Nhu cầu học tiếng Anh và luyện thi TOEIC ngày càng tăng
- **Xu hướng học trực tuyến**: Học online trở thành xu hướng chủ đạo
- **Tính ứng dụng thực tiễn**: Giải quyết bài toán học tập mọi lúc, mọi nơi
- **Cơ hội tích hợp công nghệ**: Áp dụng AI trong đánh giá phát âm và chấm điểm tự động
- **Thách thức kỹ thuật**: Xây dựng hệ thống phức tạp với nhiều module tương tác

---

## Slide 5: Mục tiêu đồ án

**Mục tiêu chính:**
- Xây dựng hệ thống E-Learning hoàn chỉnh cho việc học và luyện thi tiếng Anh
- Cung cấp nền tảng quản lý khóa học, bài thi, và người dùng
- Tích hợp hệ thống thanh toán trực tuyến (VNPay, ZaloPay)
- Ứng dụng AI trong đánh giá Speaking và Writing

**Mục tiêu cụ thể:**
- Hệ thống quản lý khóa học với nhiều loại bài học (Video, Grammar, Vocabulary, TOEIC)
- Hệ thống thi thử đầy đủ 4 kỹ năng (Listening, Reading, Speaking, Writing)
- Hệ thống học từ vựng thông minh với Flashcard và Spaced Repetition System (SRS)
- Dashboard quản trị với đầy đủ chức năng quản lý và thống kê

---

## Slide 6: Phạm vi và đối tượng sử dụng

**Phạm vi:**
- Hệ thống web application (không bao gồm mobile app)
- Tập trung vào học tiếng Anh và luyện thi TOEIC
- Hỗ trợ thanh toán trực tuyến qua VNPay và ZaloPay
- Tích hợp AI cho đánh giá Speaking và Writing

**Đối tượng sử dụng:**
- **Học viên (Student)**: Người học tiếng Anh, luyện thi TOEIC
- **Giảng viên (Instructor)**: Tạo và quản lý khóa học
- **Quản trị viên (Admin)**: Quản lý toàn bộ hệ thống

---

## Slide 7: Công nghệ sử dụng

**Backend:**
- Node.js với Express.js framework
- MySQL database với Sequelize ORM
- JWT authentication
- Socket.io cho real-time communication
- Python (Whisper, MultiPA) cho AI scoring

**Frontend:**
- React.js với Vite
- React Router cho routing
- Redux Toolkit và Zustand cho state management
- React Query cho data fetching
- TipTap và Quill cho rich text editor
- Chart.js cho biểu đồ thống kê

**Payment & Services:**
- VNPay API
- ZaloPay API
- Email service (Gmail)

---

## Slide 8: Tổng quan kiến trúc hệ thống

**Kiến trúc tổng thể:**
- **Client-Server Architecture**: Frontend (React) giao tiếp với Backend (Node.js) qua RESTful API
- **Database Layer**: MySQL lưu trữ dữ liệu với Sequelize ORM
- **Real-time Communication**: Socket.io cho thảo luận khóa học
- **AI Service**: Python service xử lý đánh giá phát âm và chấm điểm

**Luồng dữ liệu:**
- Client → API Gateway → Controllers → Services → Models → Database
- Payment Gateway (VNPay/ZaloPay) → Webhook → Backend → Database
- AI Service ← Audio/Text ← Backend → Response → Client

---

## Slide 9: Các vai trò trong hệ thống

**1. Học viên (Student):**
- Đăng ký, đăng nhập tài khoản
- Xem và đăng ký khóa học
- Học bài và theo dõi tiến độ
- Làm bài thi và xem kết quả
- Học từ vựng với Flashcard
- Thanh toán khóa học


**2. Quản trị viên (Admin):**
- Quản lý người dùng, khóa học, bài thi
- Quản lý từ vựng và chủ đề
- Xem thống kê và báo cáo
- Quản lý giao dịch và doanh thu

---

## Slide 10: Chức năng phía Client - Xác thực và Quản lý tài khoản

**Xác thực:**
- Đăng ký tài khoản với xác thực email (OTP)
- Đăng nhập với JWT token
- Quên mật khẩu và đặt lại mật khẩu
- Refresh token tự động

**Quản lý Profile:**
- Xem và cập nhật thông tin cá nhân
- Upload và thay đổi avatar
- Đổi mật khẩu
- Xác thực email và số điện thoại
- Xem thống kê học tập cá nhân

---

## Slide 11: Chức năng phía Client - Khóa học và Học tập

**Tìm kiếm và Xem khóa học:**
- Duyệt danh sách khóa học với filter (category, level, instructor)
- Xem chi tiết khóa học (preview)
- Xem chương trình học (curriculum)
- Xem đánh giá và thảo luận khóa học

**Đăng ký và Học tập:**
- Đăng ký khóa học (miễn phí hoặc trả phí)
- Xem danh sách khóa học đã đăng ký
- Học bài với nhiều loại lesson:
  - Video lesson
  - Grammar lesson
  - Vocabulary lesson
  - TOEIC Parts (Part 1-7)
  - Speaking và Writing assessment
- Theo dõi tiến độ học tập theo module và lesson

---

## Slide 12: Chức năng phía Client - Bài thi và Đánh giá

**Bài thi Listening và Reading:**
- Xem danh sách đề thi
- Làm bài thi với timer
- Nộp bài và xem kết quả chi tiết
- Xem lại bài thi đã làm
- Làm lại các câu sai
- Thống kê kết quả theo tags/chủ đề

**Bài thi Speaking và Writing:**
- Upload audio file cho Speaking
- Nhập text cho Writing
- Nhận kết quả chấm điểm tự động bằng AI
- Xem lịch sử và thống kê kết quả

**Thảo luận:**
- Tạo và tham gia thảo luận về bài thi
- Comment và reply trong thảo luận

---

## Slide 13: Chức năng phía Client - Từ vựng và Flashcard

**Hệ thống từ vựng:**
- Xem từ vựng theo chủ đề (topic)
- Tìm kiếm từ vựng
- Xem chi tiết từ (nghĩa, phát âm, ví dụ, hình ảnh)

**Flashcard:**
- Tạo bộ flashcard cá nhân (sets)
- Thêm/xóa từ vào bộ flashcard
- Học flashcard với chế độ flip card
- Đánh dấu từ đã học

**Spaced Repetition System (SRS):**
- Học từ theo thuật toán lặp lại ngắt quãng
- Xem từ cần học hôm nay
- Gửi feedback (dễ/khó) để điều chỉnh lịch học

**Đánh giá phát âm:**
- Ghi âm phát âm từ vựng
- Nhận điểm và feedback tự động
- Xem lịch sử đánh giá phát âm

---

## Slide 14: Chức năng phía Client - Thanh toán

**Tạo đơn hàng:**
- Chọn khóa học cần mua
- Tạo đơn hàng và chọn phương thức thanh toán
- Chuyển hướng đến cổng thanh toán (VNPay/ZaloPay)

**Quản lý đơn hàng:**
- Xem lịch sử đơn hàng
- Xem chi tiết đơn hàng theo order number
- Xử lý callback từ payment gateway
- Tự động kích hoạt khóa học sau khi thanh toán thành công

---

## Slide 15: Chức năng phía Admin - Quản lý người dùng

**Quản lý tài khoản:**
- Xem danh sách người dùng với filter và search
- Xem chi tiết thông tin người dùng
- Tạo, cập nhật, xóa người dùng
- Ban/Unban tài khoản
- Cập nhật trạng thái tài khoản
- Xác thực email/phone cho người dùng

**Phân quyền:**
- Gán role cho người dùng (student, admin)
- Quản lý permissions

**Theo dõi hoạt động:**
- Xem enrollments của người dùng
- Xem payments của người dùng
- Xem tiến độ học tập (course progress, flashcard progress)
- Xem kết quả bài thi và thống kê

---

## Slide 16: Chức năng phía Admin - Quản lý khóa học

**Duyệt khóa học:**
- Xem danh sách khóa học (pending, approved, rejected)
- Xem chi tiết khóa học
- Duyệt (approve) hoặc từ chối (reject) khóa học
- Xóa khóa học

**Quản lý giảng viên:**
- Xem danh sách giảng viên
- Theo dõi khóa học của từng giảng viên

**Thống kê:**
- Thống kê số lượng khóa học theo trạng thái
- Thống kê khóa học theo category, level

---

## Slide 17: Chức năng phía Admin - Quản lý bài thi

**Quản lý đề thi:**
- Tạo bài thi mới (test)
- Thêm Parts vào bài thi
- Thêm Questions vào Part
- Cập nhật và xóa câu hỏi
- Xem chi tiết đề thi

**Quản lý kết quả:**
- Xem danh sách thí sinh đã thi
- Xem kết quả chi tiết của từng session
- Xem thống kê bài thi (điểm trung bình, tỷ lệ đúng/sai)

**Quản lý thảo luận:**
- Xem và quản lý thảo luận về bài thi

---

## Slide 18: Chức năng phía Admin - Quản lý từ vựng

**Quản lý từ vựng:**
- Xem danh sách từ vựng với filter và search
- Tạo, cập nhật, xóa từ vựng
- Upload ảnh và audio cho từ vựng
- Toggle active/inactive từ vựng
- Khôi phục từ đã xóa

**Thao tác hàng loạt:**
- Import nhiều từ vựng từ file
- Kiểm tra từ trùng lặp
- Xóa hàng loạt
- Toggle active hàng loạt

**Quản lý chủ đề (Topics):**
- Tạo, cập nhật, xóa chủ đề
- Toggle active/inactive chủ đề

---

## Slide 19: Chức năng phía Admin - Thống kê và Báo cáo

**Thống kê tổng quan:**
- Tổng số người dùng, khóa học, bài thi
- Doanh thu tổng hợp
- Số lượng từ vựng

**Thống kê chi tiết:**
- Thống kê người dùng (theo thời gian, trạng thái)
- Thống kê khóa học (theo category, level, trạng thái)
- Thống kê doanh thu (theo ngày/tuần/tháng/năm)
- Thống kê bài thi (số lượt thi, điểm trung bình)
- Thống kê từ vựng (theo topic, trạng thái)

**Quản lý giao dịch:**
- Xem danh sách giao dịch
- Xem chi tiết giao dịch
- Export dữ liệu giao dịch
- Thống kê doanh thu theo kỳ

---

## Slide 20: Kiến trúc kỹ thuật - Backend

**Cấu trúc Backend:**
- **Routes**: Phân chia routes cho Client và Admin
- **Controllers**: Xử lý request và response
- **Services**: Business logic layer
- **Models**: Sequelize models định nghĩa database schema
- **Middleware**: Authentication, authorization, validation, upload

**API Design:**
- RESTful API với chuẩn response format
- JWT authentication với refresh token
- Role-based access control (RBAC)
- Error handling tập trung

**Tích hợp:**
- Socket.io cho real-time discussion
- Python service cho AI scoring (Whisper transcription, MultiPA scoring)
- Payment gateway integration (VNPay, ZaloPay)

---

## Slide 21: Kiến trúc kỹ thuật - Frontend và Database

**Cấu trúc Frontend:**
- **Pages**: Các trang chính (Home, Course, Exam, Profile...)
- **Components**: Reusable components
- **API Layer**: Axios instances và API functions
- **State Management**: Redux Toolkit và Zustand
- **Routing**: React Router với Private/Public routes

**Database Schema:**
- **User Management**: Users, Roles, Permissions, UserRoles
- **Course Management**: Courses, Modules, Lessons, Enrollments, Progress
- **Exam Management**: Tests, Parts, Questions, Choices, ExamSessions, UserAnswers
- **Vocabulary**: Words, Topics, UserWords, Flashcards
- **Payment**: Orders, Payments, Transactions
- **Assessment**: SpeakingResponses, WritingResponses, PronunciationAssessments

**Relationships:**
- One-to-Many: Course → Modules → Lessons
- Many-to-Many: Users ↔ Courses (Enrollments), Users ↔ Words (UserWords)

---

## Slide 22: Kết quả đạt được

**Chức năng hoàn thiện:**
- ✅ Hệ thống đăng ký/đăng nhập với xác thực email
- ✅ Quản lý khóa học đầy đủ (CRUD, duyệt khóa học)
- ✅ Hệ thống học tập với nhiều loại bài học
- ✅ Hệ thống thi thử đầy đủ 4 kỹ năng
- ✅ Hệ thống học từ vựng với Flashcard và SRS
- ✅ Đánh giá phát âm tự động bằng AI
- ✅ Thanh toán trực tuyến (VNPay, ZaloPay)
- ✅ Dashboard quản trị với đầy đủ chức năng

**Công nghệ áp dụng:**
- ✅ RESTful API với JWT authentication
- ✅ Real-time communication với Socket.io
- ✅ AI integration cho chấm điểm tự động
- ✅ Payment gateway integration

---

## Slide 23: Hạn chế của đồ án

**Về chức năng:**
- Chưa có mobile application
- Chưa có tính năng học nhóm (group learning)
- Chưa có hệ thống thông báo push notification
- Chưa có tính năng live streaming cho khóa học

**Về kỹ thuật:**
- AI scoring còn phụ thuộc vào service bên ngoài
- Chưa có hệ thống caching để tối ưu performance
- Chưa có CDN cho việc lưu trữ media files
- Chưa có hệ thống backup và recovery tự động

**Về bảo mật:**
- Cần tăng cường rate limiting
- Cần implement CSRF protection
- Cần audit log cho các thao tác quan trọng

---

## Slide 24: Hướng phát triển trong tương lai

**Mở rộng chức năng:**
- Phát triển mobile app (iOS, Android)
- Thêm tính năng học nhóm và chat nhóm
- Tích hợp video call cho lớp học trực tuyến
- Hệ thống thông báo real-time
- Gamification (điểm, huy hiệu, bảng xếp hạng)

**Cải thiện kỹ thuật:**
- Tối ưu performance với caching (Redis)
- CDN cho media files
- Microservices architecture
- Containerization với Docker
- CI/CD pipeline

**Nâng cao AI:**
- Cải thiện độ chính xác của AI scoring
- Thêm tính năng gợi ý khóa học dựa trên AI
- Personalized learning path

---

## Slide 25: Kết luận

**Tóm tắt:**
- Đã xây dựng thành công hệ thống E-Learning hoàn chỉnh
- Hệ thống đáp ứng đầy đủ các yêu cầu về chức năng
- Áp dụng các công nghệ hiện đại và best practices
- Tích hợp thành công AI và payment gateway

**Đóng góp:**
- Cung cấp nền tảng học tập trực tuyến toàn diện
- Hỗ trợ học viên học tiếng Anh và luyện thi TOEIC hiệu quả
- Cung cấp công cụ quản lý mạnh mẽ cho admin

**Kinh nghiệm:**
- Nắm vững full-stack development
- Hiểu rõ về authentication, authorization
- Kinh nghiệm tích hợp third-party services
- Kinh nghiệm làm việc với AI services

---

## Slide 26: Lời cảm ơn

**Xin chân thành cảm ơn:**

- **Ban Giám hiệu** và **Khoa [Tên khoa]** đã tạo điều kiện học tập
- **Thầy/Cô [Tên giảng viên]** đã tận tình hướng dẫn trong suốt quá trình thực hiện đồ án
- **Gia đình và bạn bè** đã động viên và hỗ trợ
- **Các nguồn tài liệu và công nghệ** đã được sử dụng trong đồ án

**Xin trân trọng cảm ơn!**

---

**Kết thúc bài thuyết trình**

