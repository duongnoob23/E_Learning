# 📊 PHÂN TÍCH LUỒNG LÀM BÀI THI EXAM - SPEAKING & WRITING

## 🎯 TỔNG QUAN

Hệ thống Exam có **2 luồng chính** để làm bài thi:

1. **Listening + Reading** - Chấm điểm tự động (so sánh đáp án)
2. **Speaking + Writing** - Chấm điểm bằng AI (MultiPA)

---

## 📋 LUỒNG 1: LISTENING + READING

### **Cách hoạt động:**

1. **Bắt đầu phiên thi:**
   ```
   POST /api/exam/exam-sessions/start
   Body: {
     test_id: 1,
     session_type: "FULL_TEST",
     selected_parts: [1, 2],
     time_limit_minutes: 120
   }
   ```
   → Tạo `exam_session` với `status = "IN_PROGRESS"`

2. **Làm bài:**
   - User chọn đáp án cho từng câu hỏi
   - Lưu tạm trong state (frontend)
   - Chưa lưu vào database

3. **Nộp bài:**
   ```
   POST /api/exam/exam-sessions/{session_id}/submit
   Body: {
     answers: [
       { question_id: 1, selected_choice_id: 3 },
       { question_id: 2, selected_choice_id: 5 },
       ...
     ],
     examId: 1
   }
   ```
   → Backend tự động:
   - So sánh `selected_choice_id` với `is_correct` trong bảng `choices`
   - Tính điểm: `correct_answers / total_questions * 100`
   - Lưu vào `user_answers` và cập nhật `exam_sessions`
   - Cập nhật thống kê (`user_exam_statistics`, `part_statistics`)

4. **Xem kết quả:**
   ```
   GET /api/exam/exam-sessions/{session_id}/result
   ```
   → Trả về:
   - Tổng điểm
   - Số câu đúng/sai/bỏ qua
   - Thống kê theo từng part
   - Thời gian làm bài

### **Đặc điểm:**
- ✅ Chấm điểm **tức thì** (không cần AI)
- ✅ Kết quả có ngay sau khi submit
- ✅ Không cần xử lý file audio/text

---

## 📋 LUỒNG 2: SPEAKING + WRITING

### **⚠️ LƯU Ý QUAN TRỌNG:**

Hiện tại codebase có:
- ✅ API upload audio cho Speaking
- ✅ API chấm điểm Speaking
- ✅ API chấm điểm Writing
- ❌ **THIẾU**: API tạo WritingResponse (chưa có endpoint để lưu text trước khi chấm)

---

## 🎤 LUỒNG SPEAKING (Chi tiết)

### **Bước 1: Bắt đầu phiên thi**
```
POST /api/exam/exam-sessions/start
Body: {
  test_id: 1,
  session_type: "FULL_TEST",
  selected_parts: [3], // Part SPEAKING
  time_limit_minutes: 20
}
```

### **Bước 2: Upload Audio cho từng câu hỏi**
```
POST /api/exam/speaking/upload
Headers:
  Authorization: Bearer <JWT_TOKEN>
Body (form-data):
  audio_file: [File audio - WAV, MP3, M4A, etc.]
  session_id: 123
  question_id: 45
  language: "en"
```

**Response:**
```json
{
  "EM": "Tải lên tệp âm thanh thành công",
  "EC": "0",
  "DT": {
    "response_id": 789,
    "session_id": 123,
    "question_id": 45,
    "user_id": 1,
    "audio_file_path": "backend/uploads/speaking_audio/1234567890-audio.wav",
    "transcription": "Hello world, this is a test", // Từ Whisper
    "processing_status": "COMPLETED",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Backend xử lý:**
1. Lưu file audio vào `backend/uploads/speaking_audio/`
2. Gọi Whisper để transcribe audio (tùy chọn)
3. Tạo record trong `speaking_responses` với `processing_status = "COMPLETED"`
4. Trả về `response_id`

### **Bước 3: Chấm điểm Speaking**
```
POST /api/exam/llmservice/score
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
Body:
{
  "response_id": 789,
  "type": "SPEAKING",
  "audio_file_path": "backend/uploads/speaking_audio/1234567890-audio.wav",
  "language": "en"
}
```

**Backend xử lý:**
1. Gọi Python script `multiPA_score.py` với `type="SPEAKING"`
2. Python script:
   - Load Whisper model (cached)
   - Transcribe audio → `transcript`
   - Phân tích audio features:
     - **Fluency**: Dựa trên speech rate và pauses
     - **Prosody**: Dựa trên pitch variation
   - Phân tích pronunciation từng từ
   - Tính điểm: `pronunciation_score`, `fluency_score`, `prosody_score`
   - Tính điểm tổng: `(pronunciation + fluency + prosody) / 3`
3. Cập nhật `speaking_responses`:
   ```sql
   UPDATE speaking_responses SET
     score = 85.5,
     pronunciation_score = 88.2,
     fluency_score = 82.1,
     prosody_score = 86.3,
     transcript = "Hello world, this is a test",
     feedback = "Pronunciation: 8.8/10, Fluency: 8.2/10, Prosody: 8.6/10",
     detailed_feedback = {
       "pronunciation": "...",
       "fluency": "...",
       "prosody": "..."
     },
     processing_status = "COMPLETED"
   WHERE response_id = 789 AND user_id = 1
   ```

**Response:**
```json
{
  "EM": "Chấm bài Speaking thành công",
  "EC": "0",
  "DT": {
    "score": 85.5,
    "pronunciation_score": 88.2,
    "fluency_score": 82.1,
    "prosody_score": 86.3,
    "word_accuracy": {
      "hello": { "score": 8.5, "issues": [], "tips": [] },
      "world": { "score": 7.8, "issues": ["R sound"], "tips": ["Curl tongue..."] }
    },
    "word_feedback": [
      { "word": "world", "score": 7.8, "issues": ["R sound"], "tips": [...] }
    ],
    "transcript": "Hello world, this is a test",
    "feedback": "Pronunciation: 8.8/10, Fluency: 8.2/10, Prosody: 8.6/10",
    "detailed_feedback": {
      "pronunciation": "Accuracy score: 8.8/10. Words needing improvement: world",
      "fluency": "Fluency score: 8.2/10",
      "prosody": "Prosody score: 8.6/10"
    }
  }
}
```

### **Bước 4: Xem kết quả Speaking**
```
GET /api/exam/speaking/session/{session_id}/responses?status=COMPLETED
```

**Response:**
```json
{
  "EM": "Lấy danh sách phản hồi speaking thành công",
  "EC": "0",
  "DT": {
    "responses": [
      {
        "response_id": 789,
        "question_id": 45,
        "score": 85.5,
        "pronunciation_score": 88.2,
        "fluency_score": 82.1,
        "prosody_score": 86.3,
        "transcript": "Hello world, this is a test",
        "feedback": "...",
        "detailed_feedback": {...},
        "processing_status": "COMPLETED"
      }
    ],
    "pagination": {...}
  }
}
```

---

## ✍️ LUỒNG WRITING (Chi tiết)

### **⚠️ VẤN ĐỀ HIỆN TẠI:**

Codebase **THIẾU** API để tạo `WritingResponse` trước khi chấm điểm. Cần bổ sung:

### **Bước 1: Bắt đầu phiên thi** (giống Speaking)
```
POST /api/exam/exam-sessions/start
```

### **Bước 2: Lưu bài viết** ⚠️ **THIẾU API NÀY**

**Cần thêm:**
```
POST /api/exam/writing/submit
Body:
{
  "session_id": 123,
  "question_id": 46,
  "written_text": "This is my essay about...",
  "language": "en"
}
```

**Backend cần:**
1. Tạo record trong `writing_responses`:
   ```sql
   INSERT INTO writing_responses (
     session_id, question_id, user_id,
     written_text, word_count,
     processing_status
   ) VALUES (...)
   ```
2. Trả về `response_id`

### **Bước 3: Chấm điểm Writing**
```
POST /api/exam/llmservice/score
Body:
{
  "response_id": 790,
  "type": "WRITING",
  "text": "This is my essay about...",
  "language": "en"
}
```

**Backend xử lý:**
1. Gọi Python script `multiPA_score.py` với `type="WRITING"`
2. Python script:
   - Phân tích text theo 5 tiêu chí:
     - **Grammar**: Kiểm tra lỗi ngữ pháp, cấu trúc câu
     - **Vocabulary**: Độ đa dạng từ vựng, từ phức tạp
     - **Coherence**: Tính mạch lạc, transition words
     - **Task Completion**: Độ dài, đáp ứng yêu cầu
     - **Spelling**: Lỗi chính tả
   - Tính điểm từng tiêu chí (0-10) → chuyển sang 0-100
   - Tính điểm tổng: `(grammar + vocabulary + coherence + task_completion + spelling) / 5`
3. Cập nhật `writing_responses`:
   ```sql
   UPDATE writing_responses SET
     score = 78.5,
     grammar_score = 80.0,
     vocabulary_score = 75.0,
     coherence_score = 82.0,
     task_completion_score = 75.0,
     spelling_score = 80.0,
     feedback = "Grammar: 8.0/10, Vocabulary: 7.5/10, ...",
     detailed_feedback = {
       "grammar": { "score": "8.0/10", "issues": [...], "suggestions": [...] },
       "vocabulary": {...},
       ...
     },
     processing_status = "COMPLETED"
   WHERE response_id = 790 AND user_id = 1
   ```

**Response:**
```json
{
  "EM": "Chấm bài Writing thành công",
  "EC": "0",
  "DT": {
    "score": 78.5,
    "grammar_score": 80.0,
    "vocabulary_score": 75.0,
    "coherence_score": 82.0,
    "task_completion_score": 75.0,
    "spelling_score": 80.0,
    "feedback": "Grammar: 8.0/10, Vocabulary: 7.5/10, Coherence: 8.2/10, Task Completion: 7.5/10, Spelling: 8.0/10",
    "detailed_feedback": {
      "grammar": {
        "score": "8.0/10",
        "issues": ["2 instances of lowercase 'i' (should be 'I')"],
        "suggestions": ["Always capitalize the pronoun 'I'"]
      },
      "vocabulary": {
        "score": "7.5/10",
        "diversity_ratio": 0.65,
        "suggestions": "Try using more varied and sophisticated vocabulary"
      },
      ...
    },
    "issues": [
      "[Grammar] 2 instances of lowercase 'i' (should be 'I')",
      "[Spelling] 'recieve' → 'receive'"
    ],
    "text_stats": {
      "word_count": 150,
      "sentence_count": 8,
      "unique_words": 98,
      "diversity_ratio": 0.65
    }
  }
}
```

### **Bước 4: Xem kết quả Writing**

**Cần thêm API:**
```
GET /api/exam/writing/session/{session_id}/responses?status=COMPLETED
```

---

## 🔄 SO SÁNH 2 LUỒNG

| Tiêu chí | Listening + Reading | Speaking + Writing |
|----------|---------------------|-------------------|
| **Chấm điểm** | Tự động (so sánh đáp án) | AI (MultiPA Python script) |
| **Thời gian chấm** | Tức thì (< 1s) | Chậm (10-30s) |
| **Cần upload file** | ❌ Không | ✅ Có (audio cho Speaking) |
| **Cần Python** | ❌ Không | ✅ Có (Whisper + MultiPA) |
| **API submit** | `POST /exam-sessions/{id}/submit` | `POST /speaking/upload` + `POST /llmservice/score` |
| **API result** | `GET /exam-sessions/{id}/result` | `GET /speaking/session/{id}/responses` |
| **Bảng lưu kết quả** | `user_answers` | `speaking_responses`, `writing_responses` |
| **Điểm số** | `is_correct` (true/false/null) | `score` (0-100) + chi tiết từng tiêu chí |

---

## ⚠️ VẤN ĐỀ CẦN SỬA

### **1. THIẾU API cho Writing:**

**Cần thêm:**
- `POST /api/exam/writing/submit` - Lưu bài viết và tạo `WritingResponse`
- `GET /api/exam/writing/session/{session_id}/responses` - Lấy danh sách bài viết đã chấm

**File cần sửa:**
- `backend/src/client/routes/examClientRoutes.js` - Thêm routes
- `backend/src/client/controllers/examClientController.js` - Thêm controllers
- `backend/src/client/services/examClientService.js` - Thêm services

### **2. Frontend chưa tích hợp API chấm điểm:**

**Cần thêm:**
- Gọi `POST /api/exam/llmservice/score` sau khi upload audio (Speaking)
- Gọi `POST /api/exam/llmservice/score` sau khi submit text (Writing)
- Hiển thị loading khi đang chấm điểm
- Hiển thị kết quả chi tiết

**File cần sửa:**
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TOEIC/Speaking/SpeakingPart.jsx`
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TOEIC/Writing/WritingPart.jsx`
- `frontend/Shopery/src/Client/api/Assessment/assessmentApi.js` - Thêm API calls
- `frontend/Shopery/src/Client/services/Assessment/assessmentMutations.js` - Thêm mutations

---

## 📝 CHECKLIST ĐỂ 2 LUỒNG CHẠY CHUẨN

### **✅ Speaking:**

- [x] API upload audio (`POST /speaking/upload`)
- [x] API chấm điểm (`POST /llmservice/score` với `type="SPEAKING"`)
- [x] API lấy kết quả (`GET /speaking/session/{id}/responses`)
- [x] Python script `multiPA_score.py` hỗ trợ `type="SPEAKING"`
- [x] Bảng `speaking_responses` có đầy đủ cột điểm số
- [ ] Frontend gọi API chấm điểm sau khi upload
- [ ] Frontend hiển thị kết quả chi tiết

### **❌ Writing:**

- [ ] API submit text (`POST /writing/submit`) - **THIẾU**
- [x] API chấm điểm (`POST /llmservice/score` với `type="WRITING"`)
- [ ] API lấy kết quả (`GET /writing/session/{id}/responses`) - **THIẾU**
- [x] Python script `multiPA_score.py` hỗ trợ `type="WRITING"`
- [x] Bảng `writing_responses` có đầy đủ cột điểm số
- [ ] Frontend gọi API submit text
- [ ] Frontend gọi API chấm điểm sau khi submit
- [ ] Frontend hiển thị kết quả chi tiết

---

## 🗄️ DATABASE SCHEMA

### **Bảng: `speaking_responses`**

```sql
CREATE TABLE speaking_responses (
    response_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    audio_file_path VARCHAR(500) NOT NULL,
    transcription TEXT,
    processing_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    
    -- Điểm số
    score FLOAT,
    pronunciation_score FLOAT,
    fluency_score FLOAT,
    prosody_score FLOAT,
    grammar_score FLOAT,
    vocabulary_score FLOAT,
    coherence_score FLOAT,
    
    -- Kết quả
    transcript TEXT,
    feedback TEXT,
    detailed_feedback JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES exam_sessions(exam_session_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### **Bảng: `writing_responses`**

```sql
CREATE TABLE writing_responses (
    response_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    written_text TEXT NOT NULL,
    word_count INT,
    processing_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    
    -- Điểm số
    score FLOAT,
    grammar_score FLOAT,
    vocabulary_score FLOAT,
    coherence_score FLOAT,
    task_completion_score FLOAT,
    spelling_score FLOAT,
    
    -- Kết quả
    feedback TEXT,
    detailed_feedback JSON,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES exam_sessions(exam_session_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

---

## 🐍 PYTHON DEPENDENCIES

### **Cài đặt:**
```bash
pip install openai-whisper
pip install torch
pip install torchaudio
pip install librosa
pip install numpy
```

### **Environment Variables:**
```bash
# Đường dẫn đến MultiPA (nếu có)
MULTIPA_DIR=D:\Code_PTIT\E_Learning-2\MultiPA
```

### **Python Scripts:**
- `backend/src/ai/multiPA_score.py` - Chấm điểm Speaking/Writing
- `backend/src/ai/whisper_transcribe.py` - Transcribe audio (đã có, nhưng ít dùng)

---

## 🧪 TEST FLOW

### **Test Speaking:**

1. **Start session:**
   ```bash
   POST /api/exam/exam-sessions/start
   Body: { test_id: 1, session_type: "FULL_TEST", selected_parts: [3] }
   ```
   → Lấy `session_id`

2. **Upload audio:**
   ```bash
   POST /api/exam/speaking/upload
   Form-data:
     audio_file: [chọn file]
     session_id: 123
     question_id: 45
     language: en
   ```
   → Lấy `response_id`

3. **Chấm điểm:**
   ```bash
   POST /api/exam/llmservice/score
   Body: {
     response_id: 789,
     type: "SPEAKING",
     audio_file_path: "backend/uploads/speaking_audio/1234567890-audio.wav",
     language: "en"
   }
   ```
   → Chờ 10-30 giây → Nhận kết quả

4. **Xem kết quả:**
   ```bash
   GET /api/exam/speaking/session/123/responses?status=COMPLETED
   ```

### **Test Writing:**

1. **Start session:** (giống Speaking)

2. **Submit text:** ⚠️ **CẦN THÊM API NÀY**
   ```bash
   POST /api/exam/writing/submit
   Body: {
     session_id: 123,
     question_id: 46,
     written_text: "This is my essay...",
     language: "en"
   }
   ```
   → Lấy `response_id`

3. **Chấm điểm:**
   ```bash
   POST /api/exam/llmservice/score
   Body: {
     response_id: 790,
     type: "WRITING",
     text: "This is my essay...",
     language: "en"
   }
   ```
   → Chờ 5-10 giây → Nhận kết quả

4. **Xem kết quả:** ⚠️ **CẦN THÊM API NÀY**
   ```bash
   GET /api/exam/writing/session/123/responses?status=COMPLETED
   ```

---

## 📌 KẾT LUẬN

### **Speaking:**
- ✅ Backend đã đầy đủ API
- ✅ Python script hoạt động
- ⚠️ Frontend cần tích hợp API chấm điểm

### **Writing:**
- ❌ **THIẾU** API submit text
- ✅ API chấm điểm đã có
- ❌ **THIẾU** API lấy kết quả
- ⚠️ Frontend cần tích hợp đầy đủ

### **Ưu tiên:**
1. **Cao:** Thêm API submit text cho Writing
2. **Cao:** Thêm API lấy kết quả Writing
3. **Trung bình:** Tích hợp frontend cho Speaking
4. **Trung bình:** Tích hợp frontend cho Writing

---

**Tài liệu được tạo:** `2024-01-XX`  
**Phiên bản:** `1.0.0`  
**Cập nhật lần cuối:** `2024-01-XX`

