# 📋 SPEAKING & WRITING APIs - POSTMAN TEST GUIDE

## 🔐 AUTHENTICATION

Tất cả API đều yêu cầu JWT token trong header:

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 🎤 SPEAKING APIs

### **1. Upload Audio (Speaking)**

**URL:** `POST /api/exam/speaking/upload`

**Method:** `POST`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `audio_file` | File | ✅ Yes | File audio (WAV, MP3, M4A, WebM, OGG) - Max 50MB |
| `session_id` | Number | ✅ Yes | ID phiên thi (exam_session_id) |
| `question_id` | Number | ✅ Yes | ID câu hỏi speaking |
| `language` | String | ❌ Optional | Mã ngôn ngữ (mặc định: "en") |

**Example (Postman):**

- Tab: **Body** → **form-data**
- `audio_file`: [Select File] → Chọn file audio
- `session_id`: `123`
- `question_id`: `45`
- `language`: `en`

**Response (Success - 200):**

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
    "transcription": "Hello world, this is a test",
    "processing_status": "COMPLETED",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Audio file is required"
}
```

---

### **2. Get Speaking Responses**

**URL:** `GET /api/exam/speaking/session/:session_id/responses`

**Method:** `GET`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | Number | ✅ Yes | ID phiên thi |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | String | ❌ Optional | Filter by status: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| `page` | Number | ❌ Optional | Page number (default: 1) |
| `limit` | Number | ❌ Optional | Items per page (default: 20, max: 100) |

**Example (Postman):**

```
GET /api/exam/speaking/session/123/responses?status=COMPLETED&page=1&limit=20
```

**Response (Success - 200):**

```json
{
  "EM": "Lấy danh sách phản hồi speaking thành công",
  "EC": "0",
  "DT": {
    "responses": [
      {
        "response_id": 789,
        "session_id": 123,
        "question_id": 45,
        "user_id": 1,
        "audio_file_path": "backend/uploads/speaking_audio/1234567890-audio.wav",
        "score": 85.5,
        "pronunciation_score": 88.2,
        "fluency_score": 82.1,
        "prosody_score": 86.3,
        "transcript": "Hello world, this is a test",
        "feedback": "Pronunciation: 8.8/10, Fluency: 8.2/10, Prosody: 8.6/10",
        "detailed_feedback": {
          "pronunciation": "...",
          "fluency": "...",
          "prosody": "..."
        },
        "processing_status": "COMPLETED",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:35:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 1,
      "items_per_page": 20
    }
  }
}
```

---

### **3. Score Speaking (Chấm điểm)**

**URL:** `POST /api/exam/llmservice/score`

**Method:** `POST`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "response_id": 789,
  "type": "SPEAKING",
  "audio_file_path": "backend/uploads/speaking_audio/1234567890-audio.wav",
  "language": "en"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `response_id` | Number | ✅ Yes | ID của speaking response (từ upload API) |
| `type` | String | ✅ Yes | Phải là `"SPEAKING"` |
| `audio_file_path` | String | ✅ Yes | Đường dẫn file audio (từ upload API) |
| `language` | String | ❌ Optional | Mã ngôn ngữ (mặc định: "en") |

**Example (Postman):**

- Tab: **Body** → **raw** → **JSON**
- Copy JSON body ở trên

**Response (Success - 200):**

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
      "hello": {
        "score": 8.5,
        "issues": [],
        "tips": []
      },
      "world": {
        "score": 7.8,
        "issues": ["R sound"],
        "tips": ["Curl tongue..."]
      }
    },
    "word_feedback": [
      {
        "word": "world",
        "score": 7.8,
        "issues": ["R sound"],
        "tips": ["Curl tongue..."]
      }
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

**Response (Error - 400):**

```json
{
  "EM": "Thiếu audio_file_path cho SPEAKING type",
  "EC": "-1",
  "DT": null
}
```

**Lưu ý:** API này chạy chậm (10-30 giây) vì phải xử lý audio bằng AI.

---

## ✍️ WRITING APIs

### **1. Submit Writing Text** ⚠️ **CẦN TẠO API NÀY**

**URL:** `POST /api/exam/writing/submit`

**Method:** `POST`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "session_id": 123,
  "question_id": 46,
  "written_text": "This is my essay about the importance of learning English. I believe that English is very important...",
  "language": "en"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | Number | ✅ Yes | ID phiên thi (exam_session_id) |
| `question_id` | Number | ✅ Yes | ID câu hỏi writing |
| `written_text` | String | ✅ Yes | Nội dung bài viết |
| `language` | String | ❌ Optional | Mã ngôn ngữ (mặc định: "en") |

**Response (Success - 200):**

```json
{
  "EM": "Lưu bài viết thành công",
  "EC": "0",
  "DT": {
    "response_id": 790,
    "session_id": 123,
    "question_id": 46,
    "user_id": 1,
    "written_text": "This is my essay...",
    "word_count": 45,
    "processing_status": "PENDING",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### **2. Score Writing (Chấm điểm)**

**URL:** `POST /api/exam/llmservice/score`

**Method:** `POST`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "response_id": 790,
  "type": "WRITING",
  "text": "This is my essay about the importance of learning English. I believe that English is very important...",
  "language": "en"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `response_id` | Number | ✅ Yes | ID của writing response (từ submit API) |
| `type` | String | ✅ Yes | Phải là `"WRITING"` |
| `text` | String | ✅ Yes | Nội dung bài viết |
| `language` | String | ❌ Optional | Mã ngôn ngữ (mặc định: "en") |

**Response (Success - 200):**

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
      "coherence": {
        "score": "8.2/10",
        "issues": [],
        "suggestions": ["Use transition words to connect ideas"]
      },
      "task_completion": {
        "score": "7.5/10",
        "word_count": 45,
        "issues": ["Short (45 words) - consider expanding to 50+ words"],
        "suggestions": "Expand your response to meet the minimum word count requirement"
      },
      "spelling": {
        "score": "8.0/10",
        "errors": [],
        "suggestions": "Proofread carefully for spelling errors"
      }
    },
    "issues": [
      "[Grammar] 2 instances of lowercase 'i' (should be 'I')",
      "[Task Completion] Short (45 words) - consider expanding to 50+ words"
    ],
    "text_stats": {
      "word_count": 45,
      "sentence_count": 3,
      "unique_words": 28,
      "diversity_ratio": 0.65
    }
  }
}
```

**Lưu ý:** API này chạy chậm (5-10 giây) vì phải phân tích text bằng AI.

---

### **3. Get Writing Responses** ⚠️ **CẦN TẠO API NÀY**

**URL:** `GET /api/exam/writing/session/:session_id/responses`

**Method:** `GET`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | Number | ✅ Yes | ID phiên thi |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | String | ❌ Optional | Filter by status: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| `page` | Number | ❌ Optional | Page number (default: 1) |
| `limit` | Number | ❌ Optional | Items per page (default: 20, max: 100) |

**Example (Postman):**

```
GET /api/exam/writing/session/123/responses?status=COMPLETED&page=1&limit=20
```

**Response (Success - 200):**

```json
{
  "EM": "Lấy danh sách phản hồi writing thành công",
  "EC": "0",
  "DT": {
    "responses": [
      {
        "response_id": 790,
        "session_id": 123,
        "question_id": 46,
        "user_id": 1,
        "written_text": "This is my essay...",
        "word_count": 45,
        "score": 78.5,
        "grammar_score": 80.0,
        "vocabulary_score": 75.0,
        "coherence_score": 82.0,
        "task_completion_score": 75.0,
        "spelling_score": 80.0,
        "feedback": "Grammar: 8.0/10, Vocabulary: 7.5/10...",
        "detailed_feedback": {
          "grammar": {...},
          "vocabulary": {...},
          ...
        },
        "processing_status": "COMPLETED",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:35:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 1,
      "items_per_page": 20
    }
  }
}
```

---

## 🔄 FLOW TEST TRONG POSTMAN

### **Speaking Flow:**

1. **Upload Audio:**

   ```
   POST /api/exam/speaking/upload
   → Lấy response_id: 789
   ```

2. **Chấm điểm:**

   ```
   POST /api/exam/llmservice/score
   Body: {
     "response_id": 789,
     "type": "SPEAKING",
     "audio_file_path": "backend/uploads/speaking_audio/1234567890-audio.wav",
     "language": "en"
   }
   → Chờ 10-30s → Nhận điểm
   ```

3. **Xem kết quả:**
   ```
   GET /api/exam/speaking/session/123/responses?status=COMPLETED
   ```

### **Writing Flow:**

1. **Submit Text:**

   ```
   POST /api/exam/writing/submit
   Body: {
     "session_id": 123,
     "question_id": 46,
     "written_text": "This is my essay...",
     "language": "en"
   }
   → Lấy response_id: 790
   ```

2. **Chấm điểm:**

   ```
   POST /api/exam/llmservice/score
   Body: {
     "response_id": 790,
     "type": "WRITING",
     "text": "This is my essay...",
     "language": "en"
   }
   → Chờ 5-10s → Nhận điểm
   ```

3. **Xem kết quả:**
   ```
   GET /api/exam/writing/session/123/responses?status=COMPLETED
   ```

---

## ⚠️ LƯU Ý

1. **JWT Token:** Tất cả API đều cần token trong header
2. **File Size:** Audio file max 50MB
3. **Processing Time:**
   - Speaking scoring: 10-30 giây
   - Writing scoring: 5-10 giây
4. **Language Codes:** `en`, `vi`, `zh`, `ja`, `ko`, etc.
5. **Status Values:** `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`

---

**Tài liệu được tạo:** `2024-01-XX`  
**Phiên bản:** `1.0.0`
