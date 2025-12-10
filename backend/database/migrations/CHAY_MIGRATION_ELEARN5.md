# 🚀 HƯỚNG DẪN CHẠY MIGRATION CHO DATABASE `elearn5`

## ✅ ĐÃ HOÀN THÀNH
- ✅ Đã update enum cho `questions.question_type` và `parts.part_type` trong database `elearn5`
- ✅ Đã kiểm tra thành công

## 📋 CẦN CHẠY TIẾP

### **BƯỚC 1: Di chuyển đến thư mục project**
```powershell
cd D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce
```

### **BƯỚC 2: Chạy Migration 1 (Update Enum)**
**Lưu ý:** Nếu bạn đã chạy enum update rồi thì **BỎ QUA** bước này.

```powershell
mysql -u root -p elearn5 < backend\database\migrations\update_enum_for_speaking_writing.sql
```

### **BƯỚC 3: Chạy Migration 2 (Thêm cột thiếu)**
**Bước này QUAN TRỌNG** - Thêm các cột điểm số vào `speaking_responses` và `writing_responses`:

```powershell
mysql -u root -p elearn5 < backend\database\migrations\add_missing_columns_if_needed.sql
```

**Lưu ý:**
- Sẽ hỏi password MySQL → Nhập password
- Nếu không có password, bỏ `-p`:
  ```powershell
  mysql -u root elearn5 < backend\database\migrations\add_missing_columns_if_needed.sql
  ```

---

## ✅ KIỂM TRA SAU KHI CHẠY

### **1. Kiểm tra Enum:**
```sql
USE elearn5;

SHOW COLUMNS FROM questions WHERE Field = 'question_type';
SHOW COLUMNS FROM parts WHERE Field = 'part_type';
```

**Kết quả mong đợi:**
- `question_type`: Phải có `'SPEAKING'` và `'WRITING'`
- `part_type`: Phải có `'SPEAKING'` và `'WRITING'`

### **2. Kiểm tra Cột:**
```sql
USE elearn5;

-- Kiểm tra speaking_responses
SHOW COLUMNS FROM speaking_responses;

-- Kiểm tra writing_responses
SHOW COLUMNS FROM writing_responses;
```

**Các cột bắt buộc phải có:**

**speaking_responses:**
- ✅ `pronunciation_score` (FLOAT)
- ✅ `fluency_score` (FLOAT)
- ✅ `prosody_score` (FLOAT)
- ✅ `transcript` (TEXT)
- ✅ `detailed_feedback` (JSON)

**writing_responses:**
- ✅ `task_completion_score` (FLOAT)
- ✅ `spelling_score` (FLOAT)
- ✅ `detailed_feedback` (JSON)

---

## 🎯 TÓM TẮT NHANH

**Nếu đã chạy enum update rồi, chỉ cần chạy:**

```powershell
cd D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce
mysql -u root -p elearn5 < backend\database\migrations\add_missing_columns_if_needed.sql
```

**Xong!** ✅

---

## ⚠️ LƯU Ý

- Database name: `elearn5` (không phải `e_learnning6`)
- File SQL đã được update để dùng `elearn5`
- Migration 2 sẽ tự động kiểm tra và chỉ thêm cột nếu chưa có (an toàn)

---

**Tài liệu được tạo:** `2024-01-XX`  
**Database:** `elearn5`

