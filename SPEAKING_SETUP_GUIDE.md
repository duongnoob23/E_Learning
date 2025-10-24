# 🎤 Speaking Exam Setup Guide

Hướng dẫn chi tiết để setup và test chức năng Speaking Exam với Whisper integration.

## 📋 Tổng quan

Hệ thống Speaking Exam bao gồm:
- **Node.js Backend**: API endpoints để handle speaking questions
- **Python Whisper Service**: Microservice xử lý speech-to-text
- **Database**: Lưu trữ audio responses và transcription results
- **Frontend Demo**: HTML page để test chức năng

## 🏗️ Kiến trúc hệ thống

```
Frontend (HTML) 
    ↓ HTTP Request
Node.js Backend (Port 3000)
    ↓ HTTP Request  
Python Whisper Service (Port 5001)
    ↓ Database Update
MySQL Database
```

## 🚀 Hướng dẫn Setup

### Bước 1: Cập nhật Database

1. **Chạy migration script:**
```bash
cd backend
mysql -u root -p e_learnning2 < migrations/add_speaking_support.sql
```

2. **Verify database changes:**
```sql
-- Check if question_type enum updated
DESCRIBE questions;

-- Check if speaking_responses table created
DESCRIBE speaking_responses;

-- Check if part_type enum updated  
DESCRIBE parts;
```

### Bước 2: Setup Python Whisper Service

1. **Tạo virtual environment:**
```bash
cd whisper_service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Tạo thư mục uploads:**
```bash
mkdir uploads
```

4. **Cấu hình environment:**
```bash
cp .env.example .env
# Edit .env file if needed
```

5. **Start Whisper service:**
```bash
python app.py
```

Service sẽ chạy trên `http://localhost:5001`

### Bước 3: Cập nhật Node.js Backend

1. **Install new dependencies:**
```bash
cd backend
npm install axios form-data
```

2. **Cấu hình environment:**
```bash
cp .env.example .env
```

Thêm vào `.env`:
```env
WHISPER_SERVICE_URL=http://localhost:5001
WHISPER_TIMEOUT=60000
SPEAKING_AUDIO_MAX_SIZE=26214400
SPEAKING_AUDIO_UPLOAD_PATH=./uploads/speaking_audio
```

3. **Tạo thư mục uploads:**
```bash
mkdir -p uploads/speaking_audio
```

4. **Start Node.js server:**
```bash
npm run dev
```

Server sẽ chạy trên `http://localhost:3000`

### Bước 4: Test với Frontend Demo

1. **Mở file `speaking_demo.html` trong browser**

2. **Cấu hình:**
   - API URL: `http://localhost:3000/api`
   - Session ID: `1` (hoặc session ID hợp lệ)
   - Question ID: `1` (hoặc question ID speaking hợp lệ)
   - Auth Token: JWT token hợp lệ

3. **Test flow:**
   - Click "Check Health" để verify services
   - Click "Start Recording" để bắt đầu ghi âm
   - Nói vào microphone
   - Click "Stop Recording" để dừng
   - Click "Upload & Transcribe" để upload và xử lý

## 🧪 Testing Checklist

### ✅ Database Testing
- [ ] Question type SPEAKING được thêm vào enum
- [ ] Part type SPEAKING được thêm vào enum  
- [ ] Bảng speaking_responses được tạo thành công
- [ ] Foreign key constraints hoạt động đúng

### ✅ Whisper Service Testing
- [ ] Service start thành công trên port 5001
- [ ] Health check endpoint `/health` trả về status healthy
- [ ] Model Whisper load thành công
- [ ] Endpoint `/transcribe` nhận và xử lý audio files
- [ ] Supported languages endpoint hoạt động

### ✅ Node.js Backend Testing
- [ ] Speaking routes được register thành công
- [ ] Multer middleware handle audio upload
- [ ] WhisperService class giao tiếp với Python service
- [ ] SpeakingController xử lý requests đúng
- [ ] Database operations (create, update speaking responses)

### ✅ Integration Testing
- [ ] Frontend có thể record audio
- [ ] Audio upload thành công qua API
- [ ] Node.js gọi Python service thành công
- [ ] Transcription results được lưu vào database
- [ ] Frontend hiển thị kết quả transcription

## 🔧 Troubleshooting

### Lỗi thường gặp:

**1. Whisper service không start:**
```bash
# Check Python version
python --version  # Should be 3.8+

# Check dependencies
pip list | grep whisper

# Check port availability
netstat -an | grep 5001
```

**2. Audio upload failed:**
```bash
# Check upload directory permissions
ls -la backend/uploads/speaking_audio

# Check file size limits
# Max: 25MB for Whisper service
```

**3. Database connection errors:**
```bash
# Check MySQL connection
mysql -u root -p -e "USE e_learnning2; SHOW TABLES;"

# Check if migrations ran
mysql -u root -p -e "USE e_learnning2; DESCRIBE speaking_responses;"
```

**4. CORS errors:**
```javascript
// Check CORS configuration in Node.js
// Ensure frontend origin is allowed
```

**5. Authentication errors:**
```bash
# Generate test JWT token
cd backend
node test/generate-token.js
```

## 📊 Performance Considerations

### Whisper Model Sizes:
- **tiny**: 39MB, fastest, good accuracy
- **base**: 74MB, fast, better accuracy (recommended for development)
- **small**: 244MB, medium speed, good accuracy
- **medium**: 769MB, slow, very good accuracy
- **large**: 1550MB, slowest, best accuracy

### Recommendations:
- Development: Use `base` model
- Production: Use `small` or `medium` based on requirements
- High accuracy needs: Use `large` model with GPU

### Scaling:
- Consider implementing request queuing for high load
- Use Redis for caching transcription results
- Implement horizontal scaling for Whisper service
- Monitor memory usage and restart service periodically

## 🔐 Security Considerations

1. **File Upload Security:**
   - File type validation
   - File size limits (25MB)
   - Secure filename handling
   - Temporary file cleanup

2. **Authentication:**
   - JWT token validation
   - User session verification
   - Rate limiting on upload endpoints

3. **Data Privacy:**
   - Audio files are deleted after processing
   - Transcription data encryption at rest
   - GDPR compliance for user data

## 📈 Monitoring & Logging

### Key Metrics to Monitor:
- Transcription processing time
- Success/failure rates
- Audio file sizes and durations
- Service health and uptime
- Database performance

### Log Files:
- Node.js: Application logs
- Whisper Service: Python service logs
- Database: MySQL query logs
- System: Server resource usage

## 🚀 Production Deployment

### Environment Setup:
1. Use production-grade WSGI server for Python (Gunicorn)
2. Use PM2 or similar for Node.js process management
3. Setup reverse proxy (Nginx)
4. Configure SSL certificates
5. Setup monitoring (Prometheus, Grafana)
6. Configure backup strategies

### Docker Deployment:
```dockerfile
# Example Dockerfile for Whisper service
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "app.py"]
```

## � API Endpoints mới:

### Speaking Exam Routes (Integrated into Exam Routes):

```
POST /api/exam/speaking/upload          # Upload audio và bắt đầu transcription
GET  /api/exam/speaking/response/:id    # Get transcription result
GET  /api/exam/speaking/session/:id/responses  # Get session responses
GET  /api/exam/speaking/health          # Health check
```

### Cấu trúc MVC đã được cập nhật:

- **Controllers**: `examClientController.js` (integrated speaking functions)
- **Services**: `examClientService.js` (speaking business logic)
- **Routes**: `examClientRoutes.js` (speaking routes with validation)
- **Validators**: `speakingValidator.js` (input validation)
- **Models**: `SpeakingResponse.js` (database model)

## �📞 Support

Nếu gặp vấn đề trong quá trình setup:

1. Check logs của từng service
2. Verify network connectivity giữa services
3. Test từng component riêng biệt
4. Use debugging tools (Postman, curl)
5. Check system resources (RAM, disk space)

---

**Happy Coding! 🎉**
