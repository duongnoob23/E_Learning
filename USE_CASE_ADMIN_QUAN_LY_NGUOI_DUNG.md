# USE CASE - ADMIN QUẢN LÝ NGƯỜI DÙNG

## USE CASE 1: XEM DANH SÁCH NGƯỜI DÙNG

**Tên use case:** Xem danh sách người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin truy cập trang quản lý người dùng

**Mô tả:** Admin xem danh sách tất cả người dùng trong hệ thống với phân trang, sắp xếp và lọc.

**Điều kiện tiên quyết:** Admin đã đăng nhập

**Luồng chính:**
1. Admin truy cập `/admin/users`
2. Hệ thống hiển thị danh sách người dùng (10 users/trang mặc định)
3. Admin xem thông tin: username, email, full_name, status, created_at

**Luồng thay thế:**
- AF1: Admin sắp xếp theo cột (username, email, created_at)
- AF2: Admin chuyển trang
- AF3: Admin thay đổi số lượng items/trang

**Ngoại lệ:**
- E1: Không có người dùng nào → Hiển thị "Không có dữ liệu"

---

## USE CASE 2: XEM CHI TIẾT NGƯỜI DÙNG

**Tên use case:** Xem chi tiết người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click vào một người dùng

**Mô tả:** Admin xem thông tin chi tiết của một người dùng.

**Luồng chính:**
1. Admin click vào user trong danh sách
2. Hệ thống hiển thị thông tin chi tiết: username, email, full_name, phone, avatar, status, roles, created_at, last_login

**Ngoại lệ:**
- E1: User không tồn tại → Hiển thị "Không tìm thấy người dùng"

---

## USE CASE 3: TẠO NGƯỜI DÙNG MỚI

**Tên use case:** Tạo người dùng mới  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Tạo người dùng mới"

**Mô tả:** Admin tạo tài khoản người dùng mới.

**Luồng chính:**
1. Admin click "Tạo mới"
2. Admin nhập: username, email, password, full_name, phone (tùy chọn)
3. Admin chọn status (active/inactive/pending_verification)
4. Admin click "Tạo"
5. Hệ thống tạo user và hiển thị thông báo thành công

**Ngoại lệ:**
- E1: Username/email đã tồn tại → Hiển thị lỗi
- E2: Dữ liệu không hợp lệ → Hiển thị lỗi validation

---

## USE CASE 4: CẬP NHẬT THÔNG TIN NGƯỜI DÙNG

**Tên use case:** Cập nhật thông tin người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Sửa" trên user

**Mô tả:** Admin cập nhật thông tin người dùng.

**Luồng chính:**
1. Admin click "Sửa"
2. Admin chỉnh sửa: full_name, phone, avatar_url
3. Admin click "Lưu"
4. Hệ thống cập nhật và hiển thị thông báo thành công

**Ngoại lệ:**
- E1: Dữ liệu không hợp lệ → Hiển thị lỗi

---

## USE CASE 5: XÓA NGƯỜI DÙNG

**Tên use case:** Xóa người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Xóa" trên user

**Mô tả:** Admin xóa tài khoản người dùng.

**Luồng chính:**
1. Admin click "Xóa"
2. Hệ thống hiển thị dialog xác nhận
3. Admin xác nhận
4. Hệ thống xóa user và hiển thị thông báo thành công

**Ngoại lệ:**
- E1: User không tồn tại → Hiển thị lỗi

---

## USE CASE 6: CHẶN NGƯỜI DÙNG

**Tên use case:** Chặn người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Chặn" trên user

**Mô tả:** Admin chặn tài khoản người dùng (status = "banned").

**Luồng chính:**
1. Admin click "Chặn"
2. Hệ thống hiển thị dialog xác nhận
3. Admin xác nhận
4. Hệ thống cập nhật status = "banned"
5. User không thể đăng nhập

---

## USE CASE 7: BỎ CHẶN NGƯỜI DÙNG

**Tên use case:** Bỏ chặn người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Bỏ chặn" trên user bị banned

**Mô tả:** Admin bỏ chặn tài khoản (status = "active").

**Luồng chính:**
1. Admin click "Bỏ chặn"
2. Hệ thống cập nhật status = "active"
3. User có thể đăng nhập lại

---

## USE CASE 8: CẬP NHẬT TRẠNG THÁI NGƯỜI DÙNG

**Tên use case:** Cập nhật trạng thái người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin thay đổi status trong form

**Mô tả:** Admin thay đổi trạng thái user (active/inactive/banned/pending_verification).

**Luồng chính:**
1. Admin chọn status mới từ dropdown
2. Admin click "Cập nhật"
3. Hệ thống cập nhật status

---

## USE CASE 9: XÁC THỰC EMAIL CHO NGƯỜI DÙNG

**Tên use case:** Xác thực email cho người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Xác thực email"

**Mô tả:** Admin xác thực email của user (email_verified = true).

**Luồng chính:**
1. Admin click "Xác thực email"
2. Hệ thống cập nhật email_verified = true
3. Hiển thị thông báo thành công

---

## USE CASE 10: XÁC THỰC SỐ ĐIỆN THOẠI CHO NGƯỜI DÙNG

**Tên use case:** Xác thực số điện thoại cho người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Xác thực phone"

**Mô tả:** Admin xác thực số điện thoại của user (phone_verified = true).

**Luồng chính:**
1. Admin click "Xác thực phone"
2. Hệ thống cập nhật phone_verified = true
3. Hiển thị thông báo thành công

---

## USE CASE 11: TÌM KIẾM NGƯỜI DÙNG

**Tên use case:** Tìm kiếm người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin nhập từ khóa vào ô tìm kiếm

**Mô tả:** Admin tìm kiếm user theo username, email, hoặc full_name.

**Luồng chính:**
1. Admin nhập từ khóa (ví dụ: "phong")
2. Admin nhấn Enter hoặc click "Tìm kiếm"
3. Hệ thống tìm kiếm và hiển thị kết quả

**Ngoại lệ:**
- E1: Không tìm thấy → Hiển thị "Không có kết quả"

---

## USE CASE 12: LỌC NGƯỜI DÙNG THEO NGÀY

**Tên use case:** Lọc người dùng theo ngày  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin chọn khoảng thời gian

**Mô tả:** Admin lọc user theo ngày đăng ký (created_at).

**Luồng chính:**
1. Admin chọn "Từ ngày" và "Đến ngày"
2. Admin click "Lọc"
3. Hệ thống hiển thị users trong khoảng thời gian

---

## USE CASE 13: XEM THỐNG KÊ NGƯỜI DÙNG

**Tên use case:** Xem thống kê người dùng  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin truy cập trang thống kê

**Mô tả:** Admin xem thống kê tổng quan về người dùng.

**Luồng chính:**
1. Admin truy cập `/admin/users/stats`
2. Hệ thống hiển thị:
   - Tổng số users
   - Số users active
   - Số users banned
   - Số users inactive
   - Số users pending_verification
   - Số users mới hôm nay

---

## USE CASE 14: XEM THỐNG KÊ THEO TRẠNG THÁI

**Tên use case:** Xem thống kê theo trạng thái  
**Tác nhân:** Admin  
**Sự kiện kích hoạt:** Admin click "Thống kê theo trạng thái"

**Mô tả:** Admin xem số lượng users theo từng trạng thái.

**Luồng chính:**
1. Admin click "Thống kê theo trạng thái"
2. Hệ thống hiển thị biểu đồ/phân tích số lượng users theo status

---

**Mức độ ưu tiên:** Tất cả đều Cao  
**Tần suất sử dụng:** Cao




