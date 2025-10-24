# 🏗️ Speaking Exam - Cấu trúc MVC đã được tái cấu trúc

## 📋 Tổng quan thay đổi

Đã cấu trúc lại speaking functionality để tuân thủ mô hình MVC và chuẩn với codebase hiện tại:

### ✅ Trước khi cấu trúc lại:
```
❌ backend/src/client/controllers/speakingController.js (riêng biệt)
❌ backend/src/client/routes/speakingRoutes.js (riêng biệt)
❌ backend/src/routes/clientRoutes.js (import speakingRoutes)
```

### ✅ Sau khi cấu trúc lại:
```
✅ backend/src/client/controllers/examClientController.js (tích hợp speaking)
✅ backend/src/client/services/examClientService.js (tích hợp speaking services)
✅ backend/src/client/routes/examClientRoutes.js (tích hợp speaking routes)
✅ backend/src/client/validators/speakingValidator.js (validation riêng)
✅ backend/src/models/exam/SpeakingResponse.js (model trong exam folder)
✅ backend/src/services/whisperService.js (service layer)
```

## 🏛️ Cấu trúc MVC chuẩn

### 1. **Models** (`backend/src/models/exam/`)
```
SpeakingResponse.js     # Model cho speaking responses
Questions.js            # Updated với SPEAKING type
Part.js                 # Updated với SPEAKING type
```

### 2. **Controllers** (`backend/src/client/controllers/`)
```
examClientController.js # Tích hợp speaking functions:
├── uploadSpeakingResponse()
├── getSpeakingResponse()
├── getSessionSpeakingResponses()
└── checkWhisperHealth()
```

### 3. **Services** (`backend/src/client/services/`)
```
examClientService.js    # Tích hợp speaking business logic:
├── getSpeakingResponsesBySession()
├── getSpeakingResponseById()
├── getSpeakingQuestions()
└── validateSpeakingQuestion()

whisperService.js       # External service integration:
├── healthCheck()
├── transcribeAudio()
├── processSpeakingResponse()
└── validateAudioFile()
```

### 4. **Routes** (`backend/src/client/routes/`)
```
examClientRoutes.js     # Tích hợp speaking routes:
├── POST /api/exam/speaking/upload
├── GET  /api/exam/speaking/response/:id
├── GET  /api/exam/speaking/session/:id/responses
└── GET  /api/exam/speaking/health
```

### 5. **Validators** (`backend/src/client/validators/`)
```
speakingValidator.js    # Input validation:
├── validateSpeakingUpload
├── validateGetSpeakingResponse
├── validateGetSessionResponses
├── validateAudioFile
└── handleValidationErrors
```

## 🔄 API Endpoints đã thay đổi

### ❌ Endpoints cũ (đã xóa):
```
POST /api/speaking/upload
GET  /api/speaking/response/:id
GET  /api/speaking/session/:id/responses
GET  /api/speaking/health
```

### ✅ Endpoints mới (tích hợp vào exam):
```
POST /api/exam/speaking/upload
GET  /api/exam/speaking/response/:id
GET  /api/exam/speaking/session/:id/responses
GET  /api/exam/speaking/health
```

## 🎯 Lợi ích của cấu trúc mới

### 1. **Consistency với codebase hiện tại**
- Speaking là một phần của exam system
- Tuân thủ naming convention hiện tại
- Sử dụng cùng authentication và middleware

### 2. **Better Organization**
- Tất cả exam-related functionality ở một nơi
- Dễ maintain và extend
- Clear separation of concerns

### 3. **Improved Validation**
- Comprehensive input validation
- Consistent error handling
- Better security

### 4. **Service Layer Pattern**
- Business logic tách biệt khỏi controllers
- Reusable service functions
- Easier testing

## 📁 File Structure chi tiết

```
backend/src/
├── client/
│   ├── controllers/
│   │   └── examClientController.js          # ✅ Tích hợp speaking functions
│   ├── services/
│   │   └── examClientService.js             # ✅ Tích hợp speaking services
│   ├── routes/
│   │   └── examClientRoutes.js              # ✅ Tích hợp speaking routes + multer
│   └── validators/
│       └── speakingValidator.js             # ✅ NEW - Validation logic
├── models/
│   └── exam/
│       └── SpeakingResponse.js              # ✅ Speaking model
├── services/
│   └── whisperService.js                    # ✅ External service integration
└── routes/
    └── clientRoutes.js                      # ✅ Cleaned up imports
```

## 🔧 Configuration Updates

### 1. **Environment Variables** (`.env`)
```env
WHISPER_SERVICE_URL=http://localhost:5001
WHISPER_TIMEOUT=60000
SPEAKING_AUDIO_MAX_SIZE=26214400
SPEAKING_AUDIO_UPLOAD_PATH=./uploads/speaking_audio
```

### 2. **Package Dependencies**
```json
{
  "axios": "^1.x.x",
  "form-data": "^4.x.x",
  "multer": "^2.x.x"
}
```

### 3. **Multer Configuration**
- File size limit: 25MB
- Allowed formats: wav, mp3, mp4, m4a, webm, ogg
- Unique filename generation
- Error handling middleware

## 🧪 Testing Updates

### 1. **Demo HTML** (`speaking_demo.html`)
```javascript
// Updated API endpoints
POST /api/exam/speaking/upload
GET  /api/exam/speaking/response/:id
GET  /api/exam/speaking/health
```

### 2. **Integration Test** (`test_speaking_integration.js`)
```javascript
// Updated test endpoints
CONFIG.nodeApiUrl + '/exam/speaking/upload'
CONFIG.nodeApiUrl + '/exam/speaking/response/' + responseId
CONFIG.nodeApiUrl + '/exam/speaking/health'
```

## 🚀 Migration Steps

### 1. **Files Removed**
```bash
❌ backend/src/client/controllers/speakingController.js
❌ backend/src/client/routes/speakingRoutes.js
```

### 2. **Files Updated**
```bash
✅ backend/src/client/controllers/examClientController.js
✅ backend/src/client/services/examClientService.js
✅ backend/src/client/routes/examClientRoutes.js
✅ backend/src/routes/clientRoutes.js
```

### 3. **Files Created**
```bash
✅ backend/src/client/validators/speakingValidator.js
```

## 📝 Code Examples

### Controller Integration
```javascript
// examClientController.js
exports.uploadSpeakingResponse = async (req, res, next) => {
  // Validation using service layer
  const validation = await examClientService.validateSpeakingQuestion(
    question_id, session_id, user_id
  );
  
  if (validation.EC !== "0") {
    return res.status(404).json({
      success: false,
      message: validation.EM
    });
  }
  // ... rest of logic
};
```

### Service Layer
```javascript
// examClientService.js
exports.validateSpeakingQuestion = async (question_id, session_id, user_id) => {
  // Business logic for validation
  return {
    EM: "Validation thành công",
    EC: "0",
    DT: { session, question }
  };
};
```

### Route Integration
```javascript
// examClientRoutes.js
router.post("/speaking/upload", 
    authMiddleware, 
    uploadSpeakingAudio.single('audio_file'),
    speakingValidator.validateCompleteSpeakingUpload,
    speakingValidator.handleValidationErrors,
    ExamClientController.uploadSpeakingResponse
);
```

## ✅ Checklist hoàn thành

- [x] Tích hợp speaking functions vào examClientController
- [x] Tích hợp speaking services vào examClientService  
- [x] Tích hợp speaking routes vào examClientRoutes
- [x] Tạo speakingValidator cho input validation
- [x] Cập nhật multer configuration trong routes
- [x] Xóa các file speaking riêng biệt
- [x] Cập nhật clientRoutes.js
- [x] Cập nhật demo HTML với endpoints mới
- [x] Cập nhật integration test script
- [x] Cập nhật documentation

## 🎉 Kết quả

Speaking functionality giờ đây:
- ✅ **Tuân thủ MVC pattern** của codebase hiện tại
- ✅ **Tích hợp hoàn toàn** với exam system
- ✅ **Có validation đầy đủ** và error handling
- ✅ **Dễ maintain và extend** trong tương lai
- ✅ **Consistent API design** với các endpoints khác

---

**Cấu trúc mới đã sẵn sàng để sử dụng! 🚀**
