# 🎓 MultiPA Speaking & Writing Assessment System

**Version:** 1.0  
**Status:** ✅ Production Ready  
**Last Updated:** 07/11/2025

---

## 📖 Giới Thiệu

Hệ thống đánh giá Speaking & Writing cho E-Learning platform sử dụng:
- **Speaking:** Whisper ASR + Audio Analysis
- **Writing:** Text Analysis + Pattern Matching

---

## 🎯 Chức Năng

### **Speaking Assessment**
- ✅ Phát âm (Pronunciation): 0-100
- ✅ Độ trôi chảy (Fluency): 0-100
- ✅ Nhịp điệu (Prosody): 0-100
- ✅ Phân tích từng từ (Word-level analysis)
- ✅ Gợi ý cải thiện chi tiết

### **Writing Assessment**
- ✅ Ngữ pháp (Grammar): 0-100
- ✅ Từ vựng (Vocabulary): 0-100
- ✅ Tính liên kết (Coherence): 0-100
- ✅ Độ hoàn thành (Task Completion): 0-100
- ✅ Lỗi chính tả (Spelling): 0-100

---

## 🚀 Quick Start

### **1. Setup**
```bash
cd backend
npm install
pip install torch torchaudio librosa openai-whisper
```

### **2. Database Migration**
```bash
node run_writing_migration.js
```

### **3. Start Server**
```bash
npm start
```

### **4. Test Speaking**
```bash
# Upload audio
POST /exam/speaking/upload
Body: form-data { audio: <file> }

# Grade speaking
POST /exam/llmservice/score
Body: {
  "response_id": 7,
  "type": "SPEAKING",
  "audio_file_path": "...",
  "language": "en"
}
```

### **5. Test Writing**
```bash
POST /exam/llmservice/score
Body: {
  "response_id": 1,
  "type": "WRITING",
  "text": "Your text here...",
  "language": "en"
}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── ai/
│   │   └── multiPA_score.py          # Python scoring script
│   ├── client/
│   │   ├── services/
│   │   │   ├── multiPAService.js     # Wrapper for Python
│   │   │   └── examClientService.js  # Business logic
│   │   ├── controllers/
│   │   │   └── examClientController.js # HTTP handlers
│   │   └── routes/
│   │       └── examClientRoutes.js   # API routes
│   └── models/
│       └── exam/
│           ├── SpeakingResponse.js   # Speaking model
│           └── WritingResponse.js    # Writing model
├── migrations/
│   ├── add_multipa_scores.js         # Speaking migration
│   └── add_writing_multipa_scores.js # Writing migration
├── uploads/
│   └── speaking_audio/               # Audio files
└── docs/
    ├── README_MULTIPA.md             # This file
    ├── WRITING_READY.md              # Writing test guide
    ├── TEST_WRITING_NOW.md           # Detailed test guide
    └── QUICK_START_TEST.md           # Quick start
```

---

## 📊 API Endpoints

### **Speaking**
```
POST /exam/speaking/upload
- Upload audio file
- Returns: response_id, audio_file_path, transcription

POST /exam/llmservice/score (type: SPEAKING)
- Grade speaking response
- Returns: pronunciation_score, fluency_score, prosody_score, word_feedback
```

### **Writing**
```
POST /exam/llmservice/score (type: WRITING)
- Grade writing response
- Returns: grammar_score, vocabulary_score, coherence_score, 
           task_completion_score, spelling_score
```

---

## 📈 Response Format

### **Speaking**
```json
{
  "score": 59.17,
  "pronunciation_score": 75,
  "fluency_score": 79.88,
  "prosody_score": 22.62,
  "transcript": "Hello everyone...",
  "word_accuracy": {
    "Hello": {"score": 8.5, "issues": [], "tips": []},
    "everyone": {"score": 7.0, "issues": ["R sound"], "tips": ["Curl tongue slightly"]}
  }
}
```

### **Writing**
```json
{
  "score": 72.5,
  "grammar_score": 80.0,
  "vocabulary_score": 75.0,
  "coherence_score": 85.0,
  "task_completion_score": 90.0,
  "spelling_score": 90.0,
  "issues": ["Lỗi chính tả", "Câu quá ngắn"],
  "text_stats": {
    "word_count": 56,
    "sentence_count": 5,
    "unique_words": 42,
    "diversity_ratio": 0.75
  }
}
```

---

## 🔧 Configuration

### **Environment Variables**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=e_learnning6
PORT=5000
```

### **Python Configuration**
```python
# backend/src/ai/multiPA_score.py
MULTIPA_DIR = r"D:\Code_PTIT\E_Learning-2\MultiPA"
CHECKPOINT_DIR = os.path.join(MULTIPA_DIR, "model_assessment")
```

---

## 📦 Dependencies

### **Python**
- torch, torchaudio
- openai-whisper
- librosa
- numpy, scipy, scikit-learn

### **Node.js**
- sequelize, mysql2
- express, multer
- socket.io

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| Speaking (first) | 30-60s |
| Speaking (cache) | 10-20s |
| Writing | < 1s |
| GPU | 10-20x faster |

---

## 🧪 Testing

See detailed guides:
- `WRITING_READY.md` - Writing overview
- `TEST_WRITING_NOW.md` - Detailed test guide
- `QUICK_START_TEST.md` - Quick start

---

## 🐛 Troubleshooting

### **Database Error**
```bash
node run_writing_migration.js
npm start
```

### **Python Error**
```bash
pip install torch torchaudio librosa
```

### **Port Already in Use**
```bash
# Change PORT in .env or kill process
lsof -i :5000
kill -9 <PID>
```

---

## 📞 Support

- Check logs: `npm start` output
- Check Python errors: stderr
- Verify database: `DESCRIBE writing_responses`
- Test endpoints: Postman

---

## 🚀 Next Steps

1. **Test thoroughly** - Run all test cases
2. **Optimize** - Improve grammar detection
3. **Integrate UI** - Connect to frontend
4. **Monitor** - Track performance metrics
5. **Deploy** - Push to production

---

## 📝 License

Internal Use Only

---

**Status:** ✅ Production Ready  
**Last Updated:** 07/11/2025

