# 📊 GIẢI THÍCH SƠ ĐỒ USE CASE - QUẢN LÝ KHÓA HỌC

## 🎯 TỔNG QUAN

Sơ đồ Use Case này mô tả **toàn bộ module quản lý khóa học** từ góc độ Admin, bao gồm:
- Xem danh sách khóa học
- Tạo khóa học mới
- Chỉnh sửa khóa học
- Xóa khóa học
- Preview/Xem chi tiết khóa học
- Xem Lesson
- Xây dựng khóa học (Modules và Lessons)
- Duyệt/Từ chối khóa học

---

## 📋 CÁC USE CASE CHÍNH

### 1. **Đăng nhập (Login)**
- **Actor:** Admin
- **Mô tả:** Admin đăng nhập vào hệ thống
- **Include:** Xem danh sách khóa học (bắt buộc - sau khi đăng nhập luôn hiển thị danh sách)

### 2. **Xem danh sách khóa học (View Course List)**
- **Actor:** Admin
- **Mô tả:** Admin xem tất cả khóa học trong hệ thống với filter và search
- **Extension Points:**
  - Tạo mới khóa học
  - Xem chi tiết khóa học
  - Xóa khóa học
  - Lọc và tìm kiếm

### 3. **Xem chi tiết khóa học / Preview**
- **Actor:** Admin
- **Mô tả:** Admin xem chi tiết một khóa học để kiểm tra trước khi duyệt
- **Extension Points:**
  - Chỉnh sửa khóa học
  - Xây dựng khóa học
  - Duyệt/Từ chối khóa học
  - Xem Lesson

---

## 🔗 PHÂN TÍCH RELATIONSHIPS

### **Include Relationships (<<include>>) - BẮT BUỘC**

Include nghĩa là use case được include **LUÔN LUÔN** được thực hiện khi use case chính được thực hiện.

#### 1. **Đăng nhập <<include>> Xem danh sách khóa học**
- **Giải thích:** Sau khi Admin đăng nhập thành công, hệ thống **LUÔN LUÔN** hiển thị danh sách khóa học
- **Luồng:** Login → Tự động redirect đến trang danh sách khóa học

#### 2. **Tạo khóa học mới <<include>> Nhập thông tin cơ bản**
- **Giải thích:** Khi tạo khóa học mới, Admin **BẮT BUỘC** phải nhập thông tin cơ bản (title, description, category, price)
- **Luồng:** Tạo khóa học → Form nhập thông tin cơ bản (bắt buộc)

#### 3. **Xây dựng khóa học <<include>> Quản lý Module**
- **Giải thích:** Để xây dựng khóa học, **PHẢI CÓ** ít nhất 1 Module
- **Luồng:** Xây dựng khóa học → Phải tạo Module

#### 4. **Quản lý Module <<include>> Thêm Module**
- **Giải thích:** Để quản lý Module, **PHẢI** thêm Module trước
- **Luồng:** Quản lý Module → Thêm Module (bắt buộc)

#### 5. **Quản lý Lesson <<include>> Thêm Lesson**
- **Giải thích:** Để quản lý Lesson, **PHẢI** thêm Lesson vào Module
- **Luồng:** Quản lý Lesson → Thêm Lesson (bắt buộc)

#### 6. **Thêm Lesson <<include>> Chọn loại Lesson**
- **Giải thích:** Khi thêm Lesson, Admin **BẮT BUỘC** phải chọn loại Lesson (video, vocabulary_list, ...)
- **Luồng:** Thêm Lesson → Dropdown chọn loại (bắt buộc)

#### 7. **Thêm Lesson <<include>> Nhập thông tin Lesson**
- **Giải thích:** Sau khi chọn loại, Admin **PHẢI** nhập thông tin Lesson tương ứng
- **Luồng:** Chọn loại → Form nhập thông tin (bắt buộc)

#### 8. **Thêm Lesson <<include>> Lưu Lesson**
- **Giải thích:** Sau khi nhập xong, Admin **PHẢI** lưu Lesson
- **Luồng:** Nhập thông tin → Click "Lưu" (bắt buộc)

---

### **Extend Relationships (<<extend>>) - TÙY CHỌN**

Extend nghĩa là use case mở rộng **CÓ THỂ** được thực hiện trong một số điều kiện nhất định, nhưng **KHÔNG BẮT BUỘC**.

#### 1. **Tạo khóa học mới <<extend>> Xem danh sách khóa học**
- **Extension Point:** "Tạo mới khóa học"
- **Giải thích:** Từ danh sách khóa học, Admin **CÓ THỂ** click nút "Tạo mới" để tạo khóa học mới (không bắt buộc)
- **Điều kiện:** Admin click nút "Tạo mới" từ danh sách

#### 2. **Xem chi tiết khóa học <<extend>> Xem danh sách khóa học**
- **Extension Point:** "Xem chi tiết khóa học"
- **Giải thích:** Từ danh sách, Admin **CÓ THỂ** click vào một khóa học để xem chi tiết (không bắt buộc)
- **Điều kiện:** Admin click vào một khóa học từ danh sách

#### 3. **Xóa khóa học <<extend>> Xem danh sách khóa học**
- **Extension Point:** "Xóa khóa học"
- **Giải thích:** Từ danh sách, Admin **CÓ THỂ** xóa một khóa học (không bắt buộc)
- **Điều kiện:** Admin click nút "Xóa" trên một khóa học

#### 4. **Lọc và tìm kiếm <<extend>> Xem danh sách khóa học**
- **Extension Point:** "Lọc và tìm kiếm"
- **Giải thích:** Trong danh sách, Admin **CÓ THỂ** sử dụng filter và search (không bắt buộc)
- **Điều kiện:** Admin sử dụng filter sidebar hoặc search box

#### 5. **Cập nhật khóa học <<extend>> Xem chi tiết khóa học**
- **Extension Point:** "Chỉnh sửa khóa học"
- **Giải thích:** Từ trang chi tiết, Admin **CÓ THỂ** click "Chỉnh sửa" để cập nhật (không bắt buộc)
- **Điều kiện:** Admin click nút "Chỉnh sửa" từ trang chi tiết

#### 6. **Xây dựng khóa học <<extend>> Tạo khóa học mới**
- **Extension Point:** "Xây dựng khóa học"
- **Giải thích:** Sau khi tạo khóa học cơ bản, Admin **CÓ THỂ** xây dựng thêm Modules và Lessons (không bắt buộc ngay)
- **Điều kiện:** Admin click "Xây dựng khóa học" sau khi tạo

#### 7. **Xây dựng khóa học <<extend>> Xem chi tiết khóa học**
- **Extension Point:** "Xây dựng khóa học"
- **Giải thích:** Từ trang chi tiết, Admin **CÓ THỂ** vào "Course Builder" để xây dựng (không bắt buộc)
- **Điều kiện:** Admin click "Xây dựng" từ trang chi tiết

#### 8. **Thêm video giới thiệu <<extend>> Tạo khóa học mới**
- **Extension Point:** "Thêm video giới thiệu"
- **Giải thích:** Khi tạo khóa học, Admin **CÓ THỂ** thêm video giới thiệu (tùy chọn)
- **Điều kiện:** Admin chọn thêm video trong form tạo khóa học

#### 9. **Nhập thông tin bổ sung <<extend>> Tạo khóa học mới**
- **Extension Point:** "Nhập thông tin bổ sung"
- **Giải thích:** Khi tạo khóa học, Admin **CÓ THỂ** nhập thêm thông tin bổ sung (tùy chọn)
- **Điều kiện:** Admin điền thêm các trường tùy chọn

#### 10. **Quản lý Module <<extend>> Xây dựng khóa học**
- **Extension Point:** "Quản lý Module"
- **Giải thích:** Trong quá trình xây dựng, Admin **CÓ THỂ** quản lý Modules (thêm, sửa, xóa)
- **Điều kiện:** Admin ở trang Course Builder

#### 11. **Cập nhật Module <<extend>> Quản lý Module**
- **Extension Point:** "Cập nhật Module"
- **Giải thích:** Admin **CÓ THỂ** cập nhật Module đã có (không bắt buộc)
- **Điều kiện:** Admin click "Chỉnh sửa" trên một Module

#### 12. **Xóa Module <<extend>> Quản lý Module**
- **Extension Point:** "Xóa Module"
- **Giải thích:** Admin **CÓ THỂ** xóa Module (không bắt buộc)
- **Điều kiện:** Admin click "Xóa" trên một Module

#### 13. **Quản lý Lesson <<extend>> Quản lý Module**
- **Extension Point:** "Quản lý Lesson"
- **Giải thích:** Trong Module, Admin **CÓ THỂ** quản lý Lessons (thêm, sửa, xóa)
- **Điều kiện:** Admin chọn một Module để quản lý Lessons

#### 14. **Cập nhật Lesson <<extend>> Quản lý Lesson**
- **Extension Point:** "Cập nhật Lesson"
- **Giải thích:** Admin **CÓ THỂ** cập nhật Lesson đã có (không bắt buộc)
- **Điều kiện:** Admin click "Chỉnh sửa" trên một Lesson

#### 15. **Xóa Lesson <<extend>> Quản lý Lesson**
- **Extension Point:** "Xóa Lesson"
- **Giải thích:** Admin **CÓ THỂ** xóa Lesson (không bắt buộc)
- **Điều kiện:** Admin click "Xóa" trên một Lesson

#### 16. **Xem trước Lesson <<extend>> Thêm Lesson**
- **Extension Point:** "Xem trước Lesson"
- **Giải thích:** Khi thêm Lesson, Admin **CÓ THỂ** xem trước trước khi lưu (tùy chọn)
- **Điều kiện:** Admin click "Xem trước" trong form thêm Lesson

#### 17. **Xem Lesson <<extend>> Xem chi tiết khóa học**
- **Extension Point:** "Xem Lesson"
- **Giải thích:** Từ trang chi tiết, Admin **CÓ THỂ** click vào một Lesson để xem (không bắt buộc)
- **Điều kiện:** Admin click vào một Lesson từ curriculum

#### 18. **Duyệt khóa học <<extend>> Xem chi tiết khóa học**
- **Extension Point:** "Duyệt/Từ chối khóa học"
- **Giải thích:** Từ trang chi tiết, Admin **CÓ THỂ** duyệt khóa học (không bắt buộc)
- **Điều kiện:** Admin click "Duyệt" trên khóa học ở trạng thái "pending"

#### 19. **Từ chối khóa học <<extend>> Xem chi tiết khóa học**
- **Extension Point:** "Duyệt/Từ chối khóa học"
- **Giải thích:** Từ trang chi tiết, Admin **CÓ THỂ** từ chối khóa học (không bắt buộc)
- **Điều kiện:** Admin click "Từ chối" trên khóa học ở trạng thái "pending"

---

## 🔄 LUỒNG HOẠT ĐỘNG CHÍNH

### **Luồng 1: Tạo khóa học mới hoàn chỉnh**

```
1. Admin đăng nhập
   └─> [Include] Tự động xem danh sách khóa học

2. Từ danh sách, Admin click "Tạo mới"
   └─> [Extend] Tạo khóa học mới

3. Trong form tạo khóa học:
   └─> [Include] Nhập thông tin cơ bản (BẮT BUỘC)
   └─> [Extend] Thêm video giới thiệu (TÙY CHỌN)
   └─> [Extend] Nhập thông tin bổ sung (TÙY CHỌN)

4. Sau khi tạo xong, Admin click "Xây dựng khóa học"
   └─> [Extend] Xây dựng khóa học

5. Trong Course Builder:
   └─> [Include] Quản lý Module
       └─> [Include] Thêm Module (BẮT BUỘC)
       └─> [Extend] Cập nhật Module (TÙY CHỌN)
       └─> [Extend] Xóa Module (TÙY CHỌN)
       └─> [Extend] Quản lý Lesson
           └─> [Include] Thêm Lesson
               └─> [Include] Chọn loại Lesson (BẮT BUỘC)
               └─> [Include] Nhập thông tin Lesson (BẮT BUỘC)
               └─> [Extend] Xem trước Lesson (TÙY CHỌN)
               └─> [Include] Lưu Lesson (BẮT BUỘC)
           └─> [Extend] Cập nhật Lesson (TÙY CHỌN)
           └─> [Extend] Xóa Lesson (TÙY CHỌN)
```

### **Luồng 2: Xem và quản lý khóa học**

```
1. Admin đăng nhập
   └─> [Include] Tự động xem danh sách khóa học

2. Từ danh sách:
   └─> [Extend] Lọc và tìm kiếm (TÙY CHỌN)
   └─> [Extend] Click vào khóa học → Xem chi tiết (TÙY CHỌN)
   └─> [Extend] Click "Xóa" → Xóa khóa học (TÙY CHỌN)

3. Từ trang chi tiết:
   └─> [Extend] Click "Chỉnh sửa" → Cập nhật khóa học (TÙY CHỌN)
   └─> [Extend] Click "Xây dựng" → Xây dựng khóa học (TÙY CHỌN)
   └─> [Extend] Click "Duyệt" → Duyệt khóa học (TÙY CHỌN)
   └─> [Extend] Click "Từ chối" → Từ chối khóa học (TÙY CHỌN)
   └─> [Extend] Click vào Lesson → Xem Lesson (TÙY CHỌN)
```

---

## 📝 TÓM TẮT

### **Include (Bắt buộc):**
- Đăng nhập → Xem danh sách
- Tạo khóa học → Nhập thông tin cơ bản
- Xây dựng khóa học → Quản lý Module
- Quản lý Module → Thêm Module
- Quản lý Lesson → Thêm Lesson
- Thêm Lesson → Chọn loại + Nhập thông tin + Lưu

### **Extend (Tùy chọn):**
- Từ danh sách: Tạo mới, Xem chi tiết, Xóa, Lọc
- Từ chi tiết: Chỉnh sửa, Xây dựng, Duyệt/Từ chối, Xem Lesson
- Trong tạo khóa học: Thêm video, Thông tin bổ sung
- Trong xây dựng: Quản lý Module/Lesson, Cập nhật/Xóa

---

**Lưu ý:** 
- **Include** = Luôn luôn xảy ra (bắt buộc)
- **Extend** = Có thể xảy ra (tùy chọn, phụ thuộc điều kiện)











