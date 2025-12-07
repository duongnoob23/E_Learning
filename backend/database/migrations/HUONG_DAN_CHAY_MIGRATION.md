# 📋 HƯỚNG DẪN CHẠY MIGRATION SQL

## 📂 VỊ TRÍ FILES

2 file migration nằm ở:
```
D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce\backend\database\migrations\
├── update_enum_for_speaking_writing.sql
└── add_missing_columns_if_needed.sql
```

**Đường dẫn đầy đủ:**
- `backend/database/migrations/update_enum_for_speaking_writing.sql`
- `backend/database/migrations/add_missing_columns_if_needed.sql`

---

## 🎯 CÁCH 1: CHẠY TRONG MYSQL WORKBENCH (KHUYẾN NGHỊ)

### **Bước 1: Mở MySQL Workbench**
1. Mở MySQL Workbench
2. Kết nối đến database `e_learnning6`

### **Bước 2: Mở file SQL**
1. File → Open SQL Script
2. Chọn file: `backend/database/migrations/update_enum_for_speaking_writing.sql`
3. Click "Open"

### **Bước 3: Chạy script**
1. Đảm bảo đã chọn database `e_learnning6` (click vào database trong Navigator)
2. Click nút **⚡ Execute** (hoặc nhấn `Ctrl + Shift + Enter`)
3. Đợi kết quả → Nếu thấy "ENUM update migration completed successfully!" là OK

### **Bước 4: Chạy file thứ 2**
1. File → Open SQL Script
2. Chọn file: `backend/database/migrations/add_missing_columns_if_needed.sql`
3. Click "Open"
4. Click **⚡ Execute**
5. Đợi kết quả → Nếu thấy "Missing columns migration completed!" là OK

### **Bước 5: Verify (Kiểm tra)**
Chạy lệnh SQL sau để kiểm tra:
```sql
-- Kiểm tra question_type
SHOW COLUMNS FROM questions WHERE Field = 'question_type';

-- Kiểm tra part_type
SHOW COLUMNS FROM parts WHERE Field = 'part_type';
```

**Kết quả mong đợi:**
- `question_type`: Phải có `'SPEAKING'` và `'WRITING'` trong enum
- `part_type`: Phải có `'SPEAKING'` và `'WRITING'` trong enum

---

## 🎯 CÁCH 2: CHẠY TỪ COMMAND LINE (POWERSHELL/CMD)

### **Bước 1: Mở Terminal**
- Mở **PowerShell** hoặc **CMD**
- Di chuyển đến thư mục project:
  ```powershell
  cd D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce
  ```

### **Bước 2: Chạy lệnh Migration 1**
```powershell
mysql -u root -p e_learnning6 < backend\database\migrations\update_enum_for_speaking_writing.sql
```

**Lưu ý:**
- Sẽ hỏi password MySQL → Nhập password của user `root`
- Nếu không có password, bỏ `-p`:
  ```powershell
  mysql -u root e_learnning6 < backend\database\migrations\update_enum_for_speaking_writing.sql
  ```

### **Bước 3: Chạy lệnh Migration 2**
```powershell
mysql -u root -p e_learnning6 < backend\database\migrations\add_missing_columns_if_needed.sql
```

### **Bước 4: Verify**
```powershell
mysql -u root -p e_learnning6 -e "SHOW COLUMNS FROM questions WHERE Field = 'question_type';"
mysql -u root -p e_learnning6 -e "SHOW COLUMNS FROM parts WHERE Field = 'part_type';"
```

---

## 🎯 CÁCH 3: COPY NỘI DUNG VÀ CHẠY TRỰC TIẾP

### **Nếu không muốn dùng file, copy nội dung sau:**

#### **Migration 1: Update Enum**
```sql
USE e_learnning6;

-- Update question_type ENUM
ALTER TABLE questions 
MODIFY COLUMN question_type ENUM(
    'MULTIPLE_CHOICE',
    'FILL_BLANK',
    'READING_COMPREHENSION',
    'SPEAKING',
    'WRITING'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại câu hỏi';

-- Update part_type ENUM
ALTER TABLE parts 
MODIFY COLUMN part_type ENUM(
    'LISTENING',
    'READING',
    'SPEAKING',
    'WRITING'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại phần thi';

SELECT 'ENUM update migration completed successfully!' as status;
```

#### **Migration 2: Add Missing Columns**
```sql
USE e_learnning6;

-- Thêm các cột còn thiếu vào speaking_responses (nếu chưa có)
-- Script tự động kiểm tra và chỉ thêm nếu thiếu
-- (Xem file add_missing_columns_if_needed.sql để xem chi tiết)

SELECT 'Missing columns migration completed!' as status;
```

**Cách chạy:**
1. Mở MySQL Workbench
2. Chọn database `e_learnning6`
3. Copy toàn bộ nội dung trên
4. Paste vào Query tab
5. Click **⚡ Execute**

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **1. Backup Database (Khuyến nghị)**
Trước khi chạy migration, nên backup:
```powershell
mysqldump -u root -p e_learnning6 > backup_before_migration.sql
```

### **2. Kiểm tra quyền**
- Đảm bảo user MySQL có quyền `ALTER TABLE`
- User `root` thường có đủ quyền

### **3. Nếu gặp lỗi**
- **Lỗi:** `Access denied`
  - **Giải pháp:** Kiểm tra username/password, hoặc dùng user có quyền admin
  
- **Lỗi:** `Table doesn't exist`
  - **Giải pháp:** Kiểm tra tên database có đúng `e_learnning6` không

- **Lỗi:** `Duplicate column name`
  - **Giải pháp:** Cột đã tồn tại, bỏ qua bước đó

---

## ✅ CHECKLIST

Sau khi chạy migration, kiểm tra:

- [ ] `questions.question_type` có `'SPEAKING'` và `'WRITING'`
- [ ] `parts.part_type` có `'SPEAKING'` và `'WRITING'`
- [ ] `speaking_responses` có đủ các cột điểm số
- [ ] `writing_responses` có đủ các cột điểm số

**Lệnh kiểm tra:**
```sql
-- Kiểm tra enum
SHOW COLUMNS FROM questions WHERE Field = 'question_type';
SHOW COLUMNS FROM parts WHERE Field = 'part_type';

-- Kiểm tra cột
SHOW COLUMNS FROM speaking_responses;
SHOW COLUMNS FROM writing_responses;
```

---

## 🎯 TÓM TẮT NHANH

**Cách đơn giản nhất:**
1. Mở MySQL Workbench
2. Mở file `update_enum_for_speaking_writing.sql`
3. Click Execute
4. Mở file `add_missing_columns_if_needed.sql`
5. Click Execute
6. Xong! ✅

---

**Tài liệu được tạo:** `2024-01-XX`  
**Phiên bản:** `1.0.0`

