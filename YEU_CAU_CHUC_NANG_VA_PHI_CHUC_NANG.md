# YÊU CẦU CHỨC NĂNG VÀ PHI CHỨC NĂNG - HỆ THỐNG E-LEARNING

## PHẦN 1: YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 1. QUẢN LÝ NGƯỜI DÙNG VÀ XÁC THỰC

#### 1.1. Đăng ký tài khoản
- **FR-001:** Hệ thống cho phép người dùng đăng ký tài khoản mới với username, email, password
- **FR-002:** Hệ thống kiểm tra tính duy nhất của username và email
- **FR-003:** Hệ thống mã hóa password bằng bcrypt trước khi lưu vào database
- **FR-004:** Hệ thống gửi mã OTP qua email để xác thực tài khoản
- **FR-005:** Hệ thống lưu trữ thông tin đăng ký: full_name, phone_number, avatar_url

#### 1.2. Đăng nhập/Đăng xuất
- **FR-006:** Hệ thống xác thực người dùng bằng username/email và password
- **FR-007:** Hệ thống phát hành JWT access token và refresh token sau khi đăng nhập thành công
- **FR-008:** Hệ thống lưu lịch sử đăng nhập (LoginHistory) để theo dõi
- **FR-009:** Hệ thống hỗ trợ đăng xuất và vô hiệu hóa refresh token
- **FR-010:** Hệ thống tự động refresh token khi access token hết hạn

#### 1.3. Quản lý mật khẩu
- **FR-011:** Hệ thống cho phép người dùng đổi mật khẩu khi đã đăng nhập
- **FR-012:** Hệ thống hỗ trợ quên mật khẩu qua email với token reset
- **FR-013:** Hệ thống giới hạn số lần đăng nhập sai và khóa tài khoản tạm thời

#### 1.4. Quản lý hồ sơ
- **FR-014:** Người dùng có thể xem và cập nhật thông tin cá nhân (full_name, phone_number, avatar)
- **FR-015:** Hệ thống lưu lịch sử thay đổi thông tin cá nhân
- **FR-016:** Hệ thống hỗ trợ upload avatar với các định dạng ảnh phổ biến

---

### 2. PHÂN QUYỀN VÀ BẢO MẬT (RBAC)

#### 2.1. Hệ thống Role-Based Access Control
- **FR-017:** Hệ thống hỗ trợ các vai trò: Admin, Instructor, Student, Guest
- **FR-018:** Hệ thống quản lý permissions (quyền) cho từng role
- **FR-019:** Hệ thống kiểm tra quyền truy cập trước khi thực hiện các hành động quan trọng
- **FR-020:** Admin có thể gán/bỏ gán role và permission cho người dùng

#### 2.2. Bảo vệ API
- **FR-021:** Tất cả API endpoints (trừ public) yêu cầu JWT token trong header Authorization
- **FR-022:** Hệ thống validate token và từ chối request không hợp lệ
- **FR-023:** Hệ thống phân biệt routes Admin và Client với middleware riêng

---

### 3. QUẢN LÝ KHÓA HỌC (COURSE MANAGEMENT)

#### 3.1. Xem danh sách khóa học
- **FR-024:** Người dùng có thể xem danh sách tất cả khóa học có sẵn
- **FR-025:** Hệ thống hỗ trợ filter theo: category, level, instructor, price, rating
- **FR-026:** Hệ thống hỗ trợ search theo tên khóa học (không phân biệt hoa thường)
- **FR-027:** Hệ thống hỗ trợ sắp xếp theo: mới nhất, giá, đánh giá, số lượng học viên
- **FR-028:** Hệ thống phân trang danh sách khóa học (12 items/page mặc định)

#### 3.2. Xem chi tiết khóa học
- **FR-029:** Người dùng có thể xem preview khóa học (mô tả, curriculum, instructor, reviews)
- **FR-030:** Hệ thống hiển thị chương trình học (modules, lessons) của khóa học
- **FR-031:** Hệ thống hiển thị đánh giá và thảo luận của học viên
- **FR-032:** Hệ thống hiển thị thống kê: số học viên, rating trung bình, số bài học

#### 3.3. Đăng ký khóa học
- **FR-033:** Người dùng có thể đăng ký khóa học miễn phí hoặc trả phí
- **FR-034:** Hệ thống kiểm tra trạng thái enrollment trước khi cho phép đăng ký
- **FR-035:** Hệ thống lưu thông tin enrollment: enrollment_date, progress, completion_status
- **FR-036:** Hệ thống hỗ trợ thanh toán qua payment gateway (nếu khóa học trả phí)

#### 3.4. Học khóa học
- **FR-037:** Học viên có thể xem danh sách bài học trong khóa học đã đăng ký
- **FR-038:** Hệ thống theo dõi tiến độ học tập (LessonProgress) cho từng bài học
- **FR-039:** Hệ thống đánh dấu bài học đã hoàn thành khi học viên xem hết nội dung
- **FR-040:** Hệ thống tính phần trăm hoàn thành khóa học dựa trên số bài học đã hoàn thành
- **FR-041:** Hệ thống hiển thị certificate khi học viên hoàn thành 100% khóa học

#### 3.5. Quản lý khóa học (Admin/Instructor)
- **FR-042:** Admin/Instructor có thể tạo, chỉnh sửa, xóa khóa học
- **FR-043:** Hệ thống hỗ trợ tạo khóa học với: title, description, price, category, level, instructor
- **FR-044:** Hệ thống quản lý modules và lessons trong khóa học
- **FR-045:** Hệ thống hỗ trợ upload video, tài liệu cho bài học
- **FR-046:** Hệ thống quản lý trạng thái khóa học: draft, published, archived

---

### 4. QUẢN LÝ BÀI THI/ĐÁNH GIÁ (EXAM/ASSESSMENT MANAGEMENT)

#### 4.1. Xem danh sách đề thi
- **FR-047:** Người dùng có thể xem danh sách tất cả đề thi có sẵn
- **FR-048:** Hệ thống hiển thị thông tin: title, description, duration, difficulty, number of questions
- **FR-049:** Hệ thống hỗ trợ filter và search đề thi

#### 4.2. Làm bài thi
- **FR-050:** Người dùng có thể bắt đầu một exam session
- **FR-051:** Hệ thống tạo ExamSession và lưu thời gian bắt đầu
- **FR-052:** Hệ thống hiển thị câu hỏi theo từng Part (Listening/Reading)
- **FR-053:** Hệ thống cho phép người dùng chọn đáp án và lưu tạm thời (UserAnswer)
- **FR-054:** Hệ thống tính thời gian làm bài và cảnh báo khi sắp hết giờ
- **FR-055:** Hệ thống tự động nộp bài khi hết thời gian

#### 4.3. Xem kết quả bài thi
- **FR-056:** Sau khi nộp bài, hệ thống tính điểm và hiển thị kết quả
- **FR-057:** Hệ thống hiển thị: tổng điểm, điểm từng Part, số câu đúng/sai
- **FR-058:** Hệ thống cho phép xem lại từng câu hỏi với đáp án đúng/sai
- **FR-059:** Hệ thống lưu thống kê: UserExamStatistics, PartStatistics
- **FR-060:** Hệ thống hỗ trợ retry các câu hỏi sai

#### 4.4. Đánh giá Speaking (MultiPA)
- **FR-061:** Người dùng có thể upload audio file (WAV, MP3, M4A, WebM, OGG, max 50MB)
- **FR-062:** Hệ thống sử dụng Whisper ASR để transcribe audio
- **FR-063:** Hệ thống đánh giá Speaking theo 3 tiêu chí:
  - Pronunciation (0-100)
  - Fluency (0-100)
  - Prosody (0-100)
- **FR-064:** Hệ thống phân tích từng từ và đưa ra gợi ý cải thiện chi tiết
- **FR-065:** Hệ thống lưu kết quả vào SpeakingResponse với transcript và detailed_feedback

#### 4.5. Đánh giá Writing
- **FR-066:** Người dùng có thể nhập text để đánh giá Writing
- **FR-067:** Hệ thống đánh giá Writing theo 5 tiêu chí:
  - Grammar (0-100)
  - Vocabulary (0-100)
  - Coherence (0-100)
  - Task Completion (0-100)
  - Spelling (0-100)
- **FR-068:** Hệ thống đưa ra feedback chi tiết cho từng tiêu chí
- **FR-069:** Hệ thống lưu kết quả vào WritingResponse

#### 4.6. Quản lý đề thi (Admin)
- **FR-070:** Admin có thể tạo đề thi mới với thông tin: title, duration, description, difficulty
- **FR-071:** Admin có thể thêm Parts (Listening/Reading) vào đề thi
- **FR-072:** Admin có thể thêm Questions vào Part với: question_text, choices, transcript, explanation
- **FR-073:** Admin có thể chỉnh sửa và xóa đề thi, parts, questions
- **FR-074:** Admin có thể xem thống kê: số sessions, điểm trung bình, part yếu nhất/mạnh nhất
- **FR-075:** Admin có thể xem danh sách sessions và chi tiết kết quả của từng user

---

### 5. TỪ VỰNG VÀ FLASHCARD

#### 5.1. Quản lý Topics
- **FR-076:** Người dùng có thể xem danh sách topics (chủ đề từ vựng) có sẵn
- **FR-077:** Người dùng có thể tạo topic mới (user-created topics)
- **FR-078:** Người dùng có thể thêm topic vào favorite
- **FR-079:** Hệ thống phân biệt system topics và user topics

#### 5.2. Quản lý Words
- **FR-080:** Người dùng có thể xem danh sách từ vựng trong một topic
- **FR-081:** Người dùng có thể thêm từ vựng mới vào topic (user-created words)
- **FR-082:** Hệ thống lưu thông tin từ: word, pronunciation, meaning, example, image
- **FR-083:** Hệ thống hỗ trợ import từ vựng hàng loạt (BatchImport)

#### 5.3. Học từ vựng (Flashcard)
- **FR-084:** Người dùng có thể học từ vựng theo chế độ Flashcard
- **FR-085:** Hệ thống theo dõi trạng thái học từ vựng: new, learning, mastered (UserWordStatus)
- **FR-086:** Hệ thống hỗ trợ nhiều chế độ học: explore, my-lists, learning
- **FR-087:** Hệ thống lưu lịch sử học từ vựng để theo dõi tiến độ

---

### 6. THẢO LUẬN VÀ ĐÁNH GIÁ

#### 6.1. Thảo luận khóa học
- **FR-088:** Học viên có thể tạo discussion trong khóa học
- **FR-089:** Học viên có thể comment và reply trong discussion
- **FR-090:** Hệ thống hiển thị danh sách discussions với pagination

#### 6.2. Thảo luận đề thi (Real-time)
- **FR-091:** Người dùng có thể tạo discussion về đề thi
- **FR-092:** Hệ thống hỗ trợ real-time discussion qua Socket.IO
- **FR-093:** Người dùng có thể join/leave discussion room
- **FR-094:** Hệ thống broadcast messages đến tất cả users trong room
- **FR-095:** Hệ thống hỗ trợ nested comments (reply to comment)

#### 6.3. Đánh giá khóa học
- **FR-096:** Học viên đã hoàn thành khóa học có thể đánh giá (rating 1-5 sao)
- **FR-097:** Học viên có thể viết review kèm theo rating
- **FR-098:** Hệ thống tính rating trung bình của khóa học
- **FR-099:** Hệ thống hiển thị reviews với pagination

---

### 7. CHATBOT HỖ TRỢ

#### 7.1. Chatbot Real-time
- **FR-100:** Hệ thống cung cấp chatbot widget trên giao diện
- **FR-101:** Chatbot hỗ trợ cả guest users và authenticated users
- **FR-102:** Hệ thống sử dụng Socket.IO để giao tiếp real-time
- **FR-103:** Chatbot xử lý câu hỏi và trả lời tự động (rule-based)
- **FR-104:** Hệ thống lưu chat history (ChatSession, ChatMessage) cho authenticated users
- **FR-105:** Chatbot hỗ trợ quick replies để người dùng chọn nhanh

---

### 8. TỪ ĐIỂN (DICTIONARY)

#### 8.1. Tra cứu từ vựng
- **FR-106:** Người dùng có thể tra cứu từ vựng trong từ điển
- **FR-107:** Hệ thống hiển thị: pronunciation, meaning, example, synonyms, antonyms
- **FR-108:** Hệ thống hỗ trợ search với autocomplete

---

### 9. WISHLIST VÀ FAVORITE

#### 9.1. Wishlist khóa học
- **FR-109:** Người dùng có thể thêm/xóa khóa học vào wishlist
- **FR-110:** Hệ thống lưu danh sách wishlist của từng user
- **FR-111:** Người dùng có thể xem danh sách wishlist

#### 9.2. Favorite topics
- **FR-112:** Người dùng có thể thêm/xóa topic vào favorite
- **FR-113:** Hệ thống lưu danh sách favorite topics

---

### 10. QUẢN LÝ NGƯỜI DÙNG (ADMIN)

#### 10.1. Quản lý users
- **FR-114:** Admin có thể xem danh sách tất cả users với filter và search
- **FR-115:** Admin có thể xem chi tiết user: thông tin cá nhân, enrollment, exam sessions
- **FR-116:** Admin có thể cập nhật thông tin user
- **FR-117:** Admin có thể thay đổi trạng thái user: active, inactive, banned
- **FR-118:** Admin có thể verify/unverify email và phone của user
- **FR-119:** Admin có thể xem thống kê: tổng số users, users mới trong tháng, users active

---

### 11. THANH TOÁN (PAYMENT)

#### 11.1. Thanh toán khóa học
- **FR-120:** Hệ thống hỗ trợ thanh toán cho khóa học trả phí
- **FR-121:** Hệ thống tích hợp payment gateway (có thể mở rộng)
- **FR-122:** Hệ thống lưu lịch sử giao dịch
- **FR-123:** Hệ thống hỗ trợ coupon/giảm giá cho khóa học

---

## PHẦN 2: YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

### 1. HIỆU NĂNG (PERFORMANCE)

#### 1.1. Thời gian phản hồi
- **NFR-001:** Thời gian load trang danh sách khóa học không quá 2 giây
- **NFR-002:** Thời gian load chi tiết khóa học không quá 3 giây
- **NFR-003:** Thời gian xử lý API request không quá 1 giây (trừ các tác vụ nặng như upload file, AI processing)
- **NFR-004:** Thời gian xử lý đánh giá Speaking (MultiPA) không quá 60 giây cho audio 5 phút
- **NFR-005:** Thời gian xử lý đánh giá Writing không quá 10 giây

#### 1.2. Throughput
- **NFR-006:** Hệ thống hỗ trợ ít nhất 100 concurrent users
- **NFR-007:** Hệ thống xử lý ít nhất 1000 requests/phút
- **NFR-008:** Hệ thống hỗ trợ ít nhất 50 concurrent Socket.IO connections

#### 1.3. Tối ưu hóa
- **NFR-009:** Hệ thống sử dụng pagination cho tất cả danh sách dài
- **NFR-010:** Hệ thống cache dữ liệu tĩnh (categories, levels, instructors)
- **NFR-011:** Hệ thống sử dụng lazy loading cho images và videos
- **NFR-012:** Frontend sử dụng code splitting để giảm bundle size

---

### 2. BẢO MẬT (SECURITY)

#### 2.1. Xác thực và ủy quyền
- **NFR-013:** Tất cả passwords được mã hóa bằng bcrypt với salt rounds >= 10
- **NFR-014:** JWT tokens có thời gian hết hạn hợp lý (access token: 1 giờ, refresh token: 7 ngày)
- **NFR-015:** Hệ thống validate và sanitize tất cả user inputs
- **NFR-016:** Hệ thống sử dụng HTTPS cho tất cả communications (production)

#### 2.2. Bảo vệ API
- **NFR-017:** Hệ thống sử dụng CORS để kiểm soát cross-origin requests
- **NFR-018:** Hệ thống sử dụng rate limiting để chống DDoS và brute force
- **NFR-019:** Hệ thống validate file uploads (type, size) để chống malicious files
- **NFR-020:** Hệ thống sử dụng Helmet.js để bảo vệ khỏi các lỗ hổng web phổ biến

#### 2.3. Bảo vệ dữ liệu
- **NFR-021:** Hệ thống không lưu password dạng plain text
- **NFR-022:** Hệ thống không expose sensitive information trong error messages
- **NFR-023:** Hệ thống sử dụng parameterized queries để chống SQL injection
- **NFR-024:** Hệ thống kiểm tra quyền truy cập trước khi trả về dữ liệu nhạy cảm

---

### 3. KHẢ NĂNG MỞ RỘNG (SCALABILITY)

#### 3.1. Database
- **NFR-025:** Database schema hỗ trợ horizontal scaling với sharding
- **NFR-026:** Hệ thống sử dụng indexes cho các cột thường xuyên query
- **NFR-027:** Hệ thống hỗ trợ database connection pooling

#### 3.2. Application
- **NFR-028:** Backend architecture hỗ trợ horizontal scaling (stateless design)
- **NFR-029:** Hệ thống sử dụng message queue cho các tác vụ nặng (có thể mở rộng)
- **NFR-030:** File storage có thể mở rộng (S3, CDN - có thể mở rộng)

---

### 4. KHẢ NĂNG SỬ DỤNG (USABILITY)

#### 4.1. Giao diện người dùng
- **NFR-031:** Giao diện responsive, hỗ trợ mobile, tablet, desktop
- **NFR-032:** Giao diện có loading indicators khi đang tải dữ liệu
- **NFR-033:** Giao diện có empty states rõ ràng khi không có dữ liệu
- **NFR-034:** Giao diện có error messages dễ hiểu và hướng dẫn xử lý
- **NFR-035:** Giao diện hỗ trợ dark mode (có thể mở rộng)

#### 4.2. Trải nghiệm người dùng
- **NFR-036:** Hệ thống hỗ trợ keyboard shortcuts cho các thao tác thường dùng
- **NFR-037:** Hệ thống có breadcrumbs để điều hướng dễ dàng
- **NFR-038:** Hệ thống có search với autocomplete
- **NFR-039:** Hệ thống có toast notifications cho các hành động quan trọng

---

### 5. ĐỘ TIN CẬY (RELIABILITY)

#### 5.1. Xử lý lỗi
- **NFR-040:** Hệ thống có error handling toàn diện, không crash khi có lỗi
- **NFR-041:** Hệ thống log tất cả errors để debug
- **NFR-042:** Hệ thống có fallback mechanisms khi service bên ngoài fail
- **NFR-043:** Hệ thống có retry logic cho các operations quan trọng

#### 5.2. Availability
- **NFR-044:** Hệ thống có uptime >= 99% (có thể đạt được với proper deployment)
- **NFR-045:** Hệ thống có health check endpoints để monitor
- **NFR-046:** Database có backup strategy (có thể mở rộng)

---

### 6. TƯƠNG THÍCH (COMPATIBILITY)

#### 6.1. Trình duyệt
- **NFR-047:** Hệ thống hỗ trợ các trình duyệt phổ biến: Chrome, Firefox, Safari, Edge (phiên bản mới nhất và 2 phiên bản trước)
- **NFR-048:** Hệ thống sử dụng polyfills cho các tính năng mới trên trình duyệt cũ

#### 6.2. Thiết bị
- **NFR-049:** Hệ thống responsive trên mobile (iOS, Android), tablet, desktop
- **NFR-050:** Hệ thống hỗ trợ touch gestures trên mobile

---

### 7. KHẢ NĂNG BẢO TRÌ (MAINTAINABILITY)

#### 7.1. Code quality
- **NFR-051:** Code tuân theo coding standards và best practices
- **NFR-052:** Code có comments và documentation đầy đủ
- **NFR-053:** Code có unit tests cho các functions quan trọng (có thể mở rộng)
- **NFR-054:** Code structure rõ ràng, dễ đọc và dễ mở rộng

#### 7.2. Architecture
- **NFR-055:** Backend sử dụng MVC pattern, tách biệt concerns
- **NFR-056:** Frontend sử dụng component-based architecture
- **NFR-057:** Hệ thống có API documentation (có thể mở rộng với Swagger)

---

### 8. KHẢ NĂNG TRIỂN KHAI (DEPLOYABILITY)

#### 8.1. Environment
- **NFR-058:** Hệ thống hỗ trợ multiple environments: development, staging, production
- **NFR-059:** Hệ thống sử dụng environment variables cho configuration
- **NFR-060:** Hệ thống có deployment scripts (có thể mở rộng với CI/CD)

---

### 9. TÍCH HỢP (INTEGRATION)

#### 9.1. External services
- **NFR-061:** Hệ thống tích hợp email service để gửi OTP, notifications
- **NFR-062:** Hệ thống tích hợp payment gateway (có thể mở rộng)
- **NFR-063:** Hệ thống tích hợp AI services (Whisper, MultiPA) cho đánh giá Speaking/Writing

---

### 10. LOGGING VÀ MONITORING

#### 10.1. Logging
- **NFR-064:** Hệ thống log tất cả API requests (morgan middleware)
- **NFR-065:** Hệ thống log errors với stack traces
- **NFR-066:** Hệ thống log user actions quan trọng (login, enrollment, payment)

#### 10.2. Monitoring
- **NFR-067:** Hệ thống có health check endpoints
- **NFR-068:** Hệ thống monitor database connection status
- **NFR-069:** Hệ thống có metrics cho performance monitoring (có thể mở rộng)

---

## TỔNG KẾT

### Yêu cầu chức năng: **123 requirements** (FR-001 đến FR-123)
### Yêu cầu phi chức năng: **69 requirements** (NFR-001 đến NFR-069)

**Tổng cộng: 192 yêu cầu**

---

## GHI CHÚ

1. Các yêu cầu được đánh số tuần tự và có thể trace được trong code
2. Một số yêu cầu có thể mở rộng thêm trong tương lai (đã ghi chú "có thể mở rộng")
3. Các yêu cầu phi chức năng về performance và scalability có thể cần điều chỉnh dựa trên infrastructure thực tế
4. Tài liệu này có thể được cập nhật khi có thêm tính năng mới



