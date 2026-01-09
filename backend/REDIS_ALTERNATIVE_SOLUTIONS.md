# 🔧 Giải pháp thay thế khi Memurai không cài được

## Vấn đề
Memurai Setup Wizard ended prematurely - Cài đặt bị lỗi.

## Giải pháp

### ✅ Cách 1: Dùng WSL2 (Khuyến nghị - Dễ nhất)

Nếu bạn đã có WSL2 hoặc có thể cài WSL2:

#### Bước 1: Cài WSL2 (nếu chưa có)
```powershell
# Mở PowerShell as Administrator
wsl --install
# Restart máy sau khi cài xong
```

#### Bước 2: Cài Redis trong WSL
```bash
# Mở WSL
wsl

# Cài Redis
sudo apt update
sudo apt install redis-server -y

# Start Redis
sudo service redis-server start

# Test
redis-cli ping
# Nếu trả về: PONG → ✅ OK!
```

#### Bước 3: Auto-start Redis khi WSL start
```bash
# Trong WSL
echo "sudo service redis-server start" >> ~/.bashrc
```

✅ **Ưu điểm:** Dễ cài, ổn định, không cần service Windows

---

### ✅ Cách 2: Dùng Redis Portable (Không cần cài đặt)

Tải Redis portable và chạy trực tiếp:

#### Bước 1: Tải Redis Portable
1. Tải từ: https://github.com/tporadowski/redis/releases
2. Tải file: `Redis-x64-5.0.14.1.zip` (hoặc bản mới nhất)
3. Giải nén vào: `C:\redis` (hoặc thư mục bất kỳ)

#### Bước 2: Chạy Redis
Mở Command Prompt/PowerShell và chạy:
```powershell
cd C:\redis
.\redis-server.exe
```

⚠️ **Lưu ý:** Cần giữ cửa sổ này mở. Nếu đóng → Redis sẽ tắt.

#### Bước 3: Tạo script start tự động
Tạo file `start-redis-portable.ps1`:
```powershell
# start-redis-portable.ps1
$redisPath = "C:\redis\redis-server.exe"
if (Test-Path $redisPath) {
    Start-Process -FilePath $redisPath -WindowStyle Minimized
    Write-Host "✅ Redis started!"
} else {
    Write-Host "❌ Redis not found at: $redisPath"
}
```

---

### ✅ Cách 3: Sửa lỗi cài đặt Memurai

#### Kiểm tra lỗi chi tiết:
1. Mở **Event Viewer**:
   - Windows + R → `eventvwr.msc`
   - Navigate to: **Windows Logs** → **Application**
   - Tìm các event có nguồn là "Memurai" hoặc "MsiInstaller"

2. **Thử các giải pháp:**
   - **Run as Administrator:** Right-click `.msi` → Run as Administrator
   - **Tắt Antivirus tạm thời:** Có thể block cài đặt
   - **Kiểm tra .NET Framework:** Memurai cần .NET Framework
   - **Kiểm tra quyền:** Đảm bảo có quyền Administrator

#### Cài .NET Framework (nếu thiếu):
```powershell
# Kiểm tra .NET Framework
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full\" -Name Release

# Nếu không có, tải từ: https://dotnet.microsoft.com/download
```

---

### ✅ Cách 4: Dùng Docker (Nếu có Docker Desktop)

Nếu bạn đã cài Docker Desktop:

```powershell
docker run -d -p 6379:6379 --name redis redis:latest
```

Kiểm tra:
```powershell
docker ps
# Nếu thấy redis container đang chạy → ✅ OK!
```

---

## So sánh các cách

| Cách | Độ khó | Ổn định | Tự động start |
|------|--------|--------|---------------|
| WSL2 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Có thể |
| Redis Portable | ⭐ | ⭐⭐⭐ | ❌ Cần start thủ công |
| Docker | ⭐⭐ | ⭐⭐⭐⭐ | ✅ Có thể |
| Memurai | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Service tự động |

---

## Khuyến nghị

**Nếu có WSL2:** → Dùng Cách 1 (WSL2) - Dễ nhất và ổn định nhất

**Nếu không có WSL2:** → Dùng Cách 2 (Redis Portable) - Nhanh nhất

**Nếu có Docker:** → Dùng Cách 4 (Docker) - Tiện lợi

---

## Sau khi Redis chạy

### Test kết nối:
```bash
cd backend
node test-redis.js
```

### Start backend:
```bash
npm run dev
```

Bạn sẽ thấy:
```
✅ Redis connected - Exam answer caching enabled
```

🎉 Xong!

