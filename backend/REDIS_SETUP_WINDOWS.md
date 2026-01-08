# Hướng dẫn cài đặt Redis trên Windows (Không dùng Docker)

## Cách 1: Dùng Memurai (Khuyến nghị - Dễ nhất)

Memurai là Redis tương thích cho Windows, dễ cài đặt nhất.

### Bước 1: Tải Memurai
1. Truy cập: https://www.memurai.com/get-memurai
2. Tải bản **Developer Edition** (miễn phí)
3. Chạy file `.msi` đã tải về

### Bước 2: Cài đặt
1. Chạy installer
2. Chọn "Install as Windows Service" (khuyến nghị)
3. Port mặc định: `6379` (giữ nguyên)
4. Hoàn tất cài đặt

### Bước 3: Kiểm tra
1. Mở **Services** (Windows + R → `services.msc`)
2. Tìm service **Memurai**
3. Đảm bảo status là **Running**

### Bước 4: Test kết nối
Mở PowerShell và chạy:
```powershell
# Test Redis connection
Test-NetConnection -ComputerName localhost -Port 6379
```

Nếu thành công, bạn sẽ thấy:
```
TcpTestSucceeded : True
```

---

## Cách 2: Dùng WSL2 (Windows Subsystem for Linux)

Nếu bạn đã có WSL2, có thể cài Redis trong Linux.

### Bước 1: Mở WSL2
```bash
wsl
```

### Bước 2: Cài Redis
```bash
sudo apt update
sudo apt install redis-server -y
```

### Bước 3: Start Redis
```bash
sudo service redis-server start
```

### Bước 4: Test
```bash
redis-cli ping
# Nếu thành công sẽ trả về: PONG
```

---

## Cách 3: Dùng Redis từ Microsoft Archive (Cũ, không khuyến nghị)

⚠️ **Lưu ý**: Bản này không được maintain nữa, chỉ dùng nếu không có lựa chọn khác.

1. Tải từ: https://github.com/microsoftarchive/redis/releases
2. Tải file `.msi` (bản mới nhất)
3. Cài đặt và start service

---

## Sau khi cài đặt xong

### 1. Kiểm tra Redis đang chạy

**Windows Services:**
- Mở Services (Windows + R → `services.msc`)
- Tìm **Memurai** hoặc **Redis**
- Status phải là **Running**

**Hoặc dùng PowerShell:**
```powershell
Get-Service | Where-Object {$_.DisplayName -like "*Redis*" -or $_.DisplayName -like "*Memurai*"}
```

### 2. Test kết nối từ Node.js

Tạo file test: `backend/test-redis.js`

```javascript
const { createClient } = require('redis');

async function testRedis() {
  try {
    const client = createClient({
      url: 'redis://localhost:6379'
    });

    client.on('error', (err) => {
      console.error('❌ Redis Error:', err);
    });

    await client.connect();
    console.log('✅ Redis connected!');

    // Test set/get
    await client.set('test', 'hello');
    const value = await client.get('test');
    console.log('✅ Test value:', value);

    await client.quit();
    console.log('✅ Redis connection closed');
  } catch (error) {
    console.error('❌ Failed to connect:', error.message);
  }
}

testRedis();
```

Chạy test:
```bash
cd backend
node test-redis.js
```

Nếu thành công, bạn sẽ thấy:
```
✅ Redis connected!
✅ Test value: hello
✅ Redis connection closed
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

Bạn sẽ thấy trong console:
```
✅ Redis connected - Exam answer caching enabled
🔴 Redis: Connected
```

Nếu thấy:
```
⚠️  Redis not available - Exam answer caching disabled
```

→ Redis chưa được start hoặc chưa cài đặt.

---

## Troubleshooting

### Lỗi: "Could not connect to Redis"

**Nguyên nhân:**
1. Redis chưa được start
2. Port 6379 bị block bởi firewall
3. Redis chạy trên port khác

**Giải pháp:**

1. **Kiểm tra Redis có chạy không:**
   ```powershell
   Get-Service | Where-Object {$_.DisplayName -like "*Redis*" -or $_.DisplayName -like "*Memurai*"}
   ```

2. **Kiểm tra port 6379:**
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 6379
   ```

3. **Nếu Redis chạy trên port khác**, thêm vào `.env`:
   ```
   REDIS_URL=redis://localhost:6380
   ```

### Lỗi: "Redis not available"

**Nguyên nhân:**
- Redis service chưa start

**Giải pháp:**
1. Mở Services
2. Tìm Memurai/Redis
3. Right-click → Start

---

## Cấu hình trong .env (Optional)

Nếu Redis chạy trên port khác hoặc có password, thêm vào `backend/.env`:

```env
REDIS_URL=redis://localhost:6379
# Hoặc nếu có password:
# REDIS_URL=redis://:password@localhost:6379
```

---

## Tóm tắt nhanh

1. **Cài Memurai** (dễ nhất) hoặc WSL2
2. **Start service** Redis/Memurai
3. **Test kết nối** bằng `test-redis.js`
4. **Start backend** → Xem log "✅ Redis connected"

Sau đó auto-save sẽ hoạt động! 🎉

