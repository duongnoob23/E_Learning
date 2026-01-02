CHƯƠNG 4: KẾT LUẬN

4.1 Đánh giá kết quả của đồ án

Kết quả thu được

Sau một thời gian tìm hiểu, khảo sát các hệ thống E-Learning tương tự và nghiên cứu các tài liệu về xây dựng hệ thống học tập trực tuyến bằng NodeJS và ReactJS, đồ án đã hoàn thiện được đề tài "Xây dựng hệ thống E-Learning hỗ trợ học và luyện thi tiếng Anh trực tuyến" với những kết quả đạt được như sau:

Một trong những kết quả nổi bật nhất của đồ án là việc triển khai thành công hệ thống E-Learning với đầy đủ các chức năng cơ bản phục vụ cho việc học và luyện thi tiếng Anh trực tuyến. Hệ thống cho phép người dùng tạo tài khoản và đăng nhập với cơ chế xác thực email qua OTP, đảm bảo tính bảo mật cho tài khoản người dùng. Người học có thể đăng ký và tham gia các khóa học với nhiều loại bài học đa dạng như video, từ vựng, ngữ pháp, và đặc biệt là các bài luyện tập TOEIC từ Part 1 đến Part 7. Hệ thống thi trực tuyến được tích hợp với khả năng chấm điểm tự động, giúp người học có thể đánh giá ngay kết quả sau khi hoàn thành bài thi. Bên cạnh đó, tính năng học từ vựng qua Flashcard với thuật toán SRS (Spaced Repetition System) giúp người học ghi nhớ từ vựng một cách hiệu quả. Đối với quản trị viên, hệ thống cung cấp khu vực quản trị toàn diện để quản lý khóa học, bài học, bài thi và người dùng một cách dễ dàng. Đặc biệt, hệ thống đã tích hợp thành công công nghệ trí tuệ nhân tạo để chấm điểm tự động kỹ năng Speaking và Writing với độ chính xác cao, sử dụng các mô hình AI như OpenAI Whisper và MultiPA để đánh giá phát âm, độ trôi chảy và chất lượng bài viết của người học.

Hệ thống được xây dựng với kiến trúc 3-tier hiện đại, tách biệt rõ ràng giữa tầng trình bày, tầng logic nghiệp vụ và tầng dữ liệu. Phần giao diện người dùng được phát triển bằng React.js với các công nghệ hỗ trợ như Redux Toolkit để quản lý state, React Query để tối ưu việc tải dữ liệu, và React Router DOM để quản lý điều hướng. Phần backend sử dụng Node.js và Express.js để xử lý các yêu cầu và logic nghiệp vụ, kết hợp với Sequelize ORM để tương tác với cơ sở dữ liệu MySQL. Hệ thống tích hợp JWT cho xác thực và phân quyền, Socket.io cho các chức năng real-time, cùng với các mô hình AI được triển khai bằng Python để xử lý chấm điểm Speaking và Writing. Cơ sở dữ liệu được thiết kế với 52 bảng, được tổ chức thành 4 nhóm chính bao gồm Authentication & Authorization, Course System, Exam System và Vocabulary System, đảm bảo tính nhất quán và khả năng mở rộng.

Giao diện của hệ thống được thiết kế với bố cục gọn gàng và thân thiện với người dùng, giúp người học dễ dàng tìm kiếm khóa học, truy cập nội dung bài học và thực hiện các thao tác học tập. Hệ thống hỗ trợ responsive trên nhiều thiết bị khác nhau, từ máy tính để bàn đến điện thoại di động, đảm bảo trải nghiệm học tập nhất quán trên mọi nền tảng. Các chức năng được bố trí hợp lý và trực quan, giúp người dùng có thể sử dụng hệ thống một cách dễ dàng mà không cần nhiều hướng dẫn.

Kết quả chưa đạt được

Song song với các kết quả đạt được bên trên, hệ thống cũng còn nhiều thiếu sót về nhiều mặt như:

Hiện tại hệ thống chỉ gồm các chức năng cơ bản của một nền tảng E-Learning, chưa có các chức năng nâng cao như hệ thống thông báo để nhắc nhở người học về tiến độ và lịch học, tính năng học nhóm và thảo luận trực tuyến giữa các học viên, hoặc khả năng học offline với đồng bộ dữ liệu khi có kết nối mạng. Tuy giao diện thân thiện với người sử dụng nhưng vẫn còn một số điểm cần cải thiện về trải nghiệm người dùng và tối ưu các hiệu ứng để tăng tính mượt mà của hệ thống.

Hiệu năng của hệ thống tuy phù hợp ở thời điểm hiện tại nhưng trong tương lai, khi quy mô dự án thay đổi và số lượng người dùng tăng lên đáng kể, hiệu năng sẽ không đủ đáp ứng nếu không có các giải pháp tối ưu như caching, CDN và load balancing. Bên cạnh đó, hệ thống chưa triển khai đầy đủ các kịch bản kiểm thử tự động như unit test và integration test, tài liệu API và hướng dẫn sử dụng cũng chưa được hoàn thiện, gây khó khăn cho việc bảo trì và phát triển hệ thống trong tương lai.

4.2 Phương hướng phát triển tiếp theo

Trong tương lai, định hướng phát triển của đồ án sẽ là tiếp tục hoàn thiện các chức năng đang ở mức cơ bản và phát triển thêm các chức năng mới như hệ thống thông báo thời gian thực, học nhóm và thảo luận trực tuyến, học offline với đồng bộ dữ liệu, phân tích và đề xuất lộ trình học tập cá nhân hóa bằng AI, phát triển ứng dụng di động (iOS và Android) để tăng khả năng tiếp cận người dùng.

Việc cải thiện hiệu năng cũng vô cùng quan trọng trong tương lai khi mà lượng người dùng và dữ liệu ngày một nhiều. Giải pháp trong tương lai là tối ưu lại toàn bộ câu truy vấn database, tích hợp caching (Redis) để giảm tải cho cơ sở dữ liệu, áp dụng CDN cho các tài nguyên tĩnh, triển khai load balancing để xử lý lưu lượng người dùng lớn và xây dựng quy trình CI/CD tự động. Bên cạnh đó, cần hoàn thiện hệ thống kiểm thử tự động và tài liệu hướng dẫn để đảm bảo chất lượng và khả năng bảo trì lâu dài của hệ thống.
