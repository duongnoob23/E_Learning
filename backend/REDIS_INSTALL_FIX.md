# 🔧 Sửa lỗi: Memurai không chạy sau khi cài đặt

## Vấn đề
Bạn đã chạy file `.msi` nhưng không thấy service trong Services.

## Giải pháp

### Cách 1: Cài lại Memurai đúng cách (Khuyến nghị)

1. **Gỡ cài đặt cũ (nếu có):**
   - Mở **Settings** → **Apps** → Tìm "Memurai" → **Uninstall**

2. **Tải lại Memurai:**
   - Link: https://www.memurai.com/get-memurai
   - Tải **Developer Edition**

3. **Cài đặt lại:**
   - **Right-click** file `.msi` → **Run as Administrator**
   - Trong quá trình cài đặt:
     - ✅ **Chọn "Install as Windows Service"** (quan trọng!)
     - ✅ Chọn "Start Memurai after installation"
   - Hoàn tất cài đặt

4. **Kiểm tra:**
   ```powershell
   Get-Service | Where-Object {$_.DisplayName -like "*Memurai*"}
   ```
   
   Nếu thấy status = **Running** → ✅ OK!

5. **Nếu service Stopped:**
   - Mở **Services** (Windows + R → `services.msc`)
   - Tìm **Memurai**
   - Right-click → **Start**

---

### Cách 2: Chạy Memurai thủ công (Tạm thời)

Nếu không muốn cài service, có thể chạy thủ công:

1. **Tìm file memurai.exe:**
   - Thường ở: `C:\Program Files\Memurai\memurai.exe`
   - Hoặc: `C:\Program Files (x86)\Memurai\memurai.exe`

2. **Chạy script:**
   ```powershell
   cd backend
   .\start-redis.ps1
   ```

3. **Hoặc chạy trực tiếp:**
   - Mở Command Prompt/PowerShell **as Administrator**
   - Chạy:
     ```powershell
     & "C:\Program Files\Memurai\memurai.exe"
     ```

⚠️ **Lưu ý:** Cách này cần giữ cửa sổ Command Prompt mở. Nếu đóng → Redis sẽ tắt.

---

### Cách 3: Dùng WSL2 (Nếu đã có WSL)

1. **Mở WSL:**
   ```bash
   wsl
   ```

2. **Cài Redis:**
   ```bash
   sudo apt update
   sudo apt install redis-server -y
   ```

3. **Start Redis:**
   ```bash
   sudo service redis-server start
   ```

4. **Test:**
   ```bash
   redis-cli ping
   # Nếu trả về: PONG → ✅ OK!
   ```

---

## Kiểm tra sau khi cài

### Test 1: Kiểm tra service
```powershell
Get-Service | Where-Object {$_.DisplayName -like "*Memurai*"}
```

### Test 2: Kiểm tra port
```powershell
Test-NetConnection -ComputerName localhost -Port 6379
```

Nếu `TcpTestSucceeded = True` → ✅ OK!

### Test 3: Test từ Node.js
```bash
cd backend
node test-redis.js
```

Nếu thấy:
```
✅ Redis connected and ready!
🎉 All tests passed!
```
→ ✅ Redis đã hoạt động!

---

## Troubleshooting

### Lỗi: "Access Denied" khi cài đặt
→ **Right-click** file `.msi` → **Run as Administrator**

### Lỗi: "Port 6379 already in use"
→ Có process khác đang dùng port 6379
→ Tìm và kill process đó, hoặc đổi port Redis

### Lỗi: Service không start được
→ Kiểm tra Windows Event Viewer để xem lỗi chi tiết
→ Có thể cần cài lại với quyền Administrator

---

## Sau khi Redis chạy

Start backend:
```bash
npm run dev
```

Bạn sẽ thấy:
```
✅ Redis connected - Exam answer caching enabled
```

Và khi user chọn đáp án:
```
💾 [REDIS] Auto-save result: {cached: true, ...}
```

🎉 Xong!

