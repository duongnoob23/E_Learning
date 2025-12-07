# 🚀 HƯỚNG DẪN SETUP SPEAKING & WRITING APIs

## ✅ ĐÃ HOÀN THÀNH

### 1. **Python Libraries** ✅
- ✅ Đã cài đặt: `openai-whisper`, `torch`, `torchaudio`, `librosa`, `numpy`
- ✅ Đã test import thành công

### 2. **Model Files** ✅
- ✅ Đã update `backend/src/models/exam/Part.js` - thêm `'SPEAKING', 'WRITING'` vào enum
- ✅ Đã update `backend/src/models/exam/Questions.js` - thêm `'SPEAKING', 'WRITING'` vào enum

### 3. **Thư mục Upload** ✅
- ✅ Đã tạo `backend/uploads/speaking_audio/`

### 4. **Migration SQL Files** ✅
- ✅ `backend/database/migrations/update_enum_for_speaking_writing.sql` - Update enum
- ✅ `backend/database/migrations/add_missing_columns_if_needed.sql` - Thêm cột thiếu
- ✅ `backend/database/migrations/verify_speaking_writing_schema.sql` - Kiểm tra schema

---

## 📋 CẦN LÀM TIẾP

### **BƯỚC 1: Chạy Migration SQL**

```sql
-- 1. Update enum cho questions và parts
SOURCE backend/database/migrations/update_enum_for_speaking_writing.sql;

-- 2. Thêm các cột còn thiếu (nếu có)
SOURCE backend/database/migrations/add_missing_columns_if_needed.sql;

-- 3. Kiểm tra schema
SOURCE backend/database/migrations/verify_speaking_writing_schema.sql;
```

**Hoặc chạy trực tiếp trong MySQL:**
```bash
mysql -u root -p e_learnning6 < backend/database/migrations/update_enum_for_speaking_writing.sql
mysql -u root -p e_learnning6 < backend/database/migrations/add_missing_columns_if_needed.sql
```

### **BƯỚC 2: So sánh Schema với Database**

#### **Schema bạn cung cấp vs Model:**

**✅ `speaking_responses` - ĐÃ ĐÚNG:**
- Có đủ các cột: `pronunciation_score`, `fluency_score`, `prosody_score`, `transcript`, `detailed_feedback`
- Foreign keys đúng: `session_id`, `question_id`, `user_id`
- Index đã có

**✅ `writing_responses` - ĐÃ ĐÚNG:**
- Có đủ các cột: `task_completion_score`, `spelling_score`, `detailed_feedback`
- Foreign keys đúng: `session_id`, `question_id`, `user_id`
- Index đã có

**⚠️ `questions` - CẦN UPDATE:**
- Schema hiện tại: `ENUM('MULTIPLE_CHOICE','FILL_BLANK','READING_COMPREHENSION')`
- Cần: `ENUM('MULTIPLE_CHOICE','FILL_BLANK','READING_COMPREHENSION','SPEAKING','WRITING')`
- ✅ Đã có migration SQL để fix

**⚠️ `parts` - CẦN UPDATE:**
- Schema hiện tại: `ENUM('LISTENING','READING')` (nếu chưa update)
- Cần: `ENUM('LISTENING','READING','SPEAKING','WRITING')`
- ✅ Đã có migration SQL để fix

### **BƯỚC 3: Test Python Script**

```bash
cd backend
python src/ai/multiPA_score.py "{\"type\":\"WRITING\",\"text\":\"This is a test.\",\"language\":\"en\"}"
```

Nếu thành công sẽ thấy JSON output với điểm số.

---

## 🔍 KIỂM TRA NHANH

### **1. Kiểm tra Enum:**
```sql
-- Kiểm tra question_type
SHOW COLUMNS FROM questions WHERE Field = 'question_type';

-- Kiểm tra part_type  
SHOW COLUMNS FROM parts WHERE Field = 'part_type';
```

**Kết quả mong đợi:**
- `question_type`: Phải có `'SPEAKING'` và `'WRITING'`
- `part_type`: Phải có `'SPEAKING'` và `'WRITING'`

### **2. Kiểm tra Cột:**
```sql
-- Kiểm tra speaking_responses
SHOW COLUMNS FROM speaking_responses;

-- Kiểm tra writing_responses
SHOW COLUMNS FROM writing_responses;
```

**Các cột bắt buộc phải có:**

**speaking_responses:**
- `pronunciation_score` (FLOAT)
- `fluency_score` (FLOAT)
- `prosody_score` (FLOAT)
- `transcript` (TEXT)
- `detailed_feedback` (JSON)

**writing_responses:**
- `task_completion_score` (FLOAT)
- `spelling_score` (FLOAT)
- `detailed_feedback` (JSON)

---

## 🎯 TÓM TẮT

### **Đã làm:**
1. ✅ Update model files (Part.js, Questions.js)
2. ✅ Cài đặt Python libraries
3. ✅ Tạo thư mục upload
4. ✅ Tạo migration SQL files

### **Cần làm:**
1. ⚠️ **Chạy migration SQL** để update database
2. ⚠️ **Thêm 2 API cho Writing** (submit text, get results)
3. ⚠️ **Test Python script** với file audio thật

---

## 📝 LỆNH CHẠY NHANH

```bash
# 1. Chạy migration
mysql -u root -p e_learnning6 < backend/database/migrations/update_enum_for_speaking_writing.sql
mysql -u root -p e_learnning6 < backend/database/migrations/add_missing_columns_if_needed.sql

# 2. Test Python
cd backend
python src/ai/multiPA_score.py "{\"type\":\"WRITING\",\"text\":\"Test\",\"language\":\"en\"}"
```

---

**Tài liệu được tạo:** `2024-01-XX`  
**Trạng thái:** ✅ Python setup hoàn tất, ⚠️ Cần chạy migration SQL

