# 🚀 Redis Quick Start (Windows)

## ⚡ Cài đặt nhanh (5 phút)

### Bước 1: Tải và cài Memurai
1. Truy cập: https://www.memurai.com/get-memurai
2. Tải **Developer Edition** (miễn phí)
3. Chạy file `.msi` → Next → Install
4. ✅ Hoàn tất!

### Bước 2: Kiểm tra Redis đang chạy
Mở PowerShell:
```powershell
Get-Service | Where-Object {$_.DisplayName -like "*Memurai*"}
```

Nếu thấy status = **Running** → ✅ OK!

Nếu không thấy hoặc status = **Stopped**:
- Mở **Services** (Windows + R → `services.msc`)
- Tìm **Memurai** → Right-click → **Start**

### Bước 3: Test kết nối
```bash
cd backend
node test-redis.js
```

Nếu thấy:
```
✅ Redis connected and ready!
🎉 All tests passed! Redis is working correctly.
```

→ ✅ Redis đã sẵn sàng!

### Bước 4: Start Backend
```bash
npm run dev
```

Bạn sẽ thấy:
```
✅ Redis connected - Exam answer caching enabled
🔴 Redis: Connected
```

---

## ❌ Nếu gặp lỗi

### Lỗi: "Could not connect to Redis"

**Giải pháp:**
1. Kiểm tra Memurai có chạy không:
   ```powershell
   Get-Service | Where-Object {$_.DisplayName -like "*Memurai*"}
   ```

2. Nếu không có service → Cài lại Memurai

3. Nếu service Stopped → Start service

4. Test lại:
   ```bash
   node test-redis.js
   ```

---

## 📖 Chi tiết

Xem file `REDIS_SETUP_WINDOWS.md` để biết thêm các cách cài đặt khác.

---

## ✅ Sau khi cài xong

Auto-save sẽ hoạt động tự động! Khi user chọn đáp án:
- ✅ Dữ liệu được lưu vào Redis
- ✅ Khi mở lại → Tự động restore đáp án
- ✅ Không mất dữ liệu khi mất mạng

