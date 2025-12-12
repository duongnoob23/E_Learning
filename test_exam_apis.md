# Test APIs - SPEAKING & WRITING

## 📋 TÓM TẮT LUỒNG

**Đúng rồi! Luồng như sau:**

1. **Nộp bài** → Gọi API upload/submit

   - SPEAKING: `POST /exam/speaking/upload` (upload file audio)
   - WRITING: `POST /exam/writing/submit` (submit text)

2. **Sau khi nộp bài thành công** → Lấy `response_id` từ response

3. **Chấm điểm** → Gọi API score
   - `POST /exam/llmservice/score` với `response_id` vừa nhận được

---

## 🔐 BƯỚC 1: LẤY TOKEN

**Request:**

```http
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "your_password"
}
```

**Response:**

```json
{
  "EM": "Đăng nhập thành công",
  "EC": "0",
  "DT": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

**Copy token để dùng cho các request sau!**

---

## 🎤 API 1: NỘP BÀI SPEAKING

### Request:

```http
POST http://localhost:5000/exam/speaking/upload
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

### Form Data:

```
session_id: 1
question_id: 5
language: en
audio_file: [Chọn file MP3/WAV của bạn]
```

### Response Success:

```json
{
  "EM": "Tải lên tệp âm thanh thành công",
  "EC": "0",
  "DT": {
    "response_id": 123,
    "session_id": 1,
    "question_id": 5,
    "user_id": 10,
    "audio_file_path": "backend/src/uploads/speaking_audio/1234567890-123456789.wav",
    "transcription": "Hello, this is my speaking response...",
    "language": "en",
    "processing_status": "COMPLETED",
    "created_at": "2025-01-11T10:30:00.000Z"
  }
}
```

**Lưu `response_id` và `audio_file_path` để dùng cho API chấm điểm!**

---

## ✍️ API 2: NỘP BÀI WRITING

### Request:

```http
POST http://localhost:5000/exam/writing/submit
Authorization: Bearer <your_token>
Content-Type: application/json
```

### Body (JSON):

```json
{
  "session_id": 1,
  "question_id": 6,
  "written_text": "In today's modern world, technology plays a crucial role in our daily lives. It has transformed the way we communicate, work, and learn. For example, smartphones allow us to stay connected with friends and family around the globe. Additionally, online learning platforms have made education more accessible to people everywhere. However, we must also be mindful of the potential drawbacks, such as reduced face-to-face interaction and privacy concerns. Overall, while technology brings many benefits, it is important to use it responsibly.",
  "language": "en"
}
```

### Response Success:

```json
{
  "EM": "Lưu bài viết thành công",
  "EC": "0",
  "DT": {
    "response_id": 124,
    "session_id": 1,
    "question_id": 6,
    "user_id": 10,
    "written_text": "In today's modern world, technology plays a crucial role...",
    "word_count": 95,
    "language": "en",
    "processing_status": "PENDING",
    "created_at": "2025-01-11T10:35:00.000Z"
  }
}
```

**Lưu `response_id` để dùng cho API chấm điểm!**

---

## 📊 API 3: CHẤM ĐIỂM SPEAKING

### Request:

```http
POST http://localhost:5000/exam/llmservice/score
Authorization: Bearer <your_token>
Content-Type: application/json
```

### Body (JSON):

```json
{
  "response_id": 123,
  "type": "SPEAKING",
  "audio_file_path": "backend/src/uploads/speaking_audio/1234567890-123456789.wav",
  "language": "en"
}
```

### Response Success:

```json
{
  "EM": "Chấm bài Speaking thành công",
  "EC": "0",
  "DT": {
    "score": 85.5,
    "pronunciation_score": 90.0,
    "fluency_score": 82.0,
    "prosody_score": 84.5,
    "transcript": "Hello, this is my speaking response...",
    "feedback": "Good pronunciation overall. Your fluency could be improved by reducing pauses.",
    "detailed_feedback": {
      "pronunciation": "Clear articulation of most words.",
      "fluency": "Some hesitation detected.",
      "prosody": "Good intonation patterns."
    }
  }
}
```

---

## 📝 API 4: CHẤM ĐIỂM WRITING

### Request:

```http
POST http://localhost:5000/exam/llmservice/score
Authorization: Bearer <your_token>
Content-Type: application/json
```

### Body (JSON):

```json
{
  "response_id": 124,
  "type": "WRITING",
  "text": "In today's modern world, technology plays a crucial role in our daily lives. It has transformed the way we communicate, work, and learn. For example, smartphones allow us to stay connected with friends and family around the globe. Additionally, online learning platforms have made education more accessible to people everywhere. However, we must also be mindful of the potential drawbacks, such as reduced face-to-face interaction and privacy concerns. Overall, while technology brings many benefits, it is important to use it responsibly.",
  "language": "en"
}
```

### Response Success:

```json
{
  "EM": "Chấm bài Writing thành công",
  "EC": "0",
  "DT": {
    "score": 88.0,
    "grammar_score": 92.0,
    "vocabulary_score": 85.0,
    "coherence_score": 90.0,
    "task_completion_score": 88.0,
    "spelling_score": 95.0,
    "feedback": "Well-structured essay with good use of vocabulary. Minor grammar improvements needed.",
    "detailed_feedback": {
      "grammar": "Mostly correct with a few minor errors.",
      "vocabulary": "Good range of vocabulary used.",
      "coherence": "Clear logical flow.",
      "task_completion": "All points addressed.",
      "spelling": "No spelling errors detected."
    }
  }
}
```

---

## 🧪 TEST VỚI CURL (Terminal)

### 1. Login để lấy token:

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"your_password"}' \
  > login_response.json

# Extract token (Windows PowerShell):
$token = (Get-Content login_response.json | ConvertFrom-Json).DT.token
echo $token
```

### 2. Test SPEAKING Upload:

```bash
curl -X POST http://localhost:5000/exam/speaking/upload \
  -H "Authorization: Bearer $token" \
  -F "session_id=1" \
  -F "question_id=5" \
  -F "language=en" \
  -F "audio_file=@/path/to/your/audio.mp3"
```

### 3. Test WRITING Submit:

```bash
curl -X POST http://localhost:5000/exam/writing/submit \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "question_id": 6,
    "written_text": "In today'\''s modern world, technology plays a crucial role in our daily lives.",
    "language": "en"
  }'
```

### 4. Test Score SPEAKING:

```bash
curl -X POST http://localhost:5000/exam/llmservice/score \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{
    "response_id": 123,
    "type": "SPEAKING",
    "audio_file_path": "backend/src/uploads/speaking_audio/1234567890-123456789.wav",
    "language": "en"
  }'
```

### 5. Test Score WRITING:

```bash
curl -X POST http://localhost:5000/exam/llmservice/score \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{
    "response_id": 124,
    "type": "WRITING",
    "text": "In today'\''s modern world, technology plays a crucial role in our daily lives.",
    "language": "en"
  }'
```

---

## 📌 LƯU Ý QUAN TRỌNG

1. **Token phải hợp lệ** - Token có thời hạn, nếu hết hạn phải login lại
2. **session_id và question_id** - Phải tồn tại trong database
3. **File audio** - Phải là định dạng hợp lệ (wav, mp3, m4a, webm, ogg)
4. **Python Service** - API chấm điểm cần Python script chạy được
5. **Luồng bắt buộc**: Upload/Submit → Lấy response_id → Gọi Score API

---

## ✅ CHECKLIST TEST

- [ ] Login thành công, lấy được token
- [ ] Upload SPEAKING thành công, nhận được response_id
- [ ] Submit WRITING thành công, nhận được response_id
- [ ] Chấm điểm SPEAKING thành công (nếu Python service chạy)
- [ ] Chấm điểm WRITING thành công (nếu Python service chạy)
