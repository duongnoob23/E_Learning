## Luồng đầy đủ: tạo khóa học → nhập bài học → lưu → hiển thị

### 1. Tạo khóa học (Admin/Intructor – Backend API)
- Endpoint: `POST /instructor/courses/full` (createCourseWithDetails) hoặc flow tạo course trước rồi thêm module/lesson.
- Dữ liệu chính: course info, modules, lessons.
- Model `Lesson`:
  - `lesson_type` ENUM: `video`, `document`, `quiz`, `assignment`, `live`, `vocabulary_list`, `vocabulary_matching`, `vocabulary_translation`, `vocabulary_quiz`, `vocabulary_listening`, `vocabulary_image_choice`, `vocabulary_sentence_completion`, `grammar_theory`.
  - `lesson_data` JSON: dữ liệu động cho từng loại bài.
  - `metadata` JSON: mở rộng khác.

### 2. Chọn loại bài học và nhập nội dung (Frontend – Course Builder)
- UI: Tab Course Builder → `+ Add Lesson` → Modal chọn lesson type (9 loại).
- Sau khi chọn: mở LessonStudioModal (VisualEditor) cho từng loại:
  - `video`: nhập video URL (YouTube/Direct), content; `lesson_data.type = video_lesson`, `video_url`, `video_type`.
  - `vocabulary_list`: words[] (en, vi, pronunciation?, audio_url?, image_url?, example), display_mode.
  - `vocabulary_matching`: questions[] with pairs[] (left/right), grid_size{rows,cols}.
  - `vocabulary_translation`: questions[] with vi_text, correct_answer.
  - `vocabulary_quiz`: questions[] with choices[] (is_correct ≥1).
  - `vocabulary_listening`: questions[] with audio_url, grid{rows,cols,cells (rows*cols)}.
  - `vocabulary_image_choice`: questions[] with images[].
  - `vocabulary_sentence_completion`: questions[] with sentence_template, blanks[], shuffled_words[].
  - `grammar_theory`: mode (page|structured), sections[] (structured).

### 3. Lưu bài học (Frontend → Backend)
- Frontend gửi payload mỗi lesson:
  - `title`, `lesson_type` (lưu ý video phải là `video`), `lesson_data` (JSON), `metadata` (optional).
  - Video legacy fields `videoUrl`, `videoDuration` vẫn được chấp nhận nhưng nên chuẩn hóa vào `lesson_data`.
- Backend `instructorClientService`:
  - Parse `lesson_data` JSON.
  - Validate bằng `validateLessonData` (đã siết chặt tối thiểu cho từng type: words/questions/sections, cấu trúc cơ bản).
  - Lưu vào `Lesson` (cột `lesson_data` JSON).

### 4. Lưu khóa học đầy đủ
- Modules và lessons được sắp xếp theo `sort_order`.
- `lesson_data` được lưu nguyên vẹn (JSON), không stringify thủ công.
- Với video: `lesson_type` nên là `video`; `lesson_data.type` = `video_lesson`, `video_url`, `video_type`.

### 5. Lấy dữ liệu khóa học (Backend → Frontend)
- Các API thêm `lesson_data`, `metadata` vào attributes:
  - `lessonClientService.findById`
  - `lessonClientService.findByModule`
  - `lessonClientService.findByCourse`
  - `courseClientService.getCourseStructure`
  - (Admin) `courseAdminService.getCourseDetail`
- Kết quả trả về gồm module + lessons + lesson_data.

### 6. Hiển thị lên giao diện (Client)
- LessonComponentMapper render theo `lesson_type`:
  - video, vocabulary_list, vocabulary_matching, vocabulary_translation, vocabulary_quiz, vocabulary_listening, vocabulary_image_choice, vocabulary_sentence_completion, grammar_theory.
- VisualEditor/Editors (khi edit) load lại dữ liệu từ `lesson_data`:
  - Đã fix load cho Vocabulary List; các editor khác cần load từ `data` tương tự (questions/sections/...).
- Khi preview/hiển thị học viên: dùng lesson_data đúng format từng type.

### 7. Lưu ý/Best practices
- Enum `lesson_type` hiện không có `video_lesson`; dùng `video` cho cột `lesson_type`, đặt `lesson_data.type = "video_lesson"`.
- Tránh lưu URL `blob:http://localhost...`; cần thay bằng URL thực (CDN/storage).
- Validation backend mới kiểm tối thiểu (words/questions/sections, type khớp). Có thể siết sâu hơn nếu cần.
- Khi thêm nhiều câu hỏi, đảm bảo mảng questions không rỗng; quiz phải có choices và ít nhất một `is_correct`.

### 8. Dòng chảy tóm tắt
1) Admin mở Course Builder → Add Lesson → chọn loại.  
2) Mở LessonStudio → nhập nội dung (theo type) → Lưu.  
3) Submit Course → Frontend gửi modules + lessons (lesson_data JSON).  
4) Backend validate `lesson_data` theo `lesson_type` → lưu vào DB.  
5) Client/Instructor/Student fetch course structure/lesson → nhận `lesson_data` đầy đủ → render đúng component.  

