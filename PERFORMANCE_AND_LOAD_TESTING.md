# 📊 Performance & Load Testing Guide

## Câu hỏi: Web có thể handle bao nhiêu users?

### Câu trả lời ngắn gọn

| Số lượng users | Khả năng | Cần làm gì |
|----------------|----------|------------|
| **10-50 users** | ✅ Dễ dàng | Không cần gì thêm |
| **50-200 users** | ✅ OK | Tối ưu database queries |
| **200-500 users** | ⚠️ Cần tối ưu | Database indexing, caching |
| **500-1000 users** | ⚠️ Cần scale | Load balancer, multiple servers |
| **1000+ users** | ❌ Cần architecture | Load balancer + multiple servers + CDN |

---

## 🧪 Cách test performance

### 1. Dùng Apache JMeter (Miễn phí, mạnh nhất)

#### Cài đặt:
1. Tải: https://jmeter.apache.org/download_jmeter.cgi
2. Giải nén và chạy: `bin/jmeter.bat`

#### Tạo Test Plan:
1. **Right-click Test Plan** → Add → Threads (Users) → Thread Group
2. **Số lượng users:** 100 (hoặc 1000)
3. **Ramp-up period:** 60 giây (users sẽ tăng dần trong 60s)
4. **Loop count:** 1 (mỗi user chạy 1 lần)

5. **Add HTTP Request:**
   - Server: `localhost:5000` (hoặc domain của bạn)
   - Path: `/exam/exam-sessions/start`
   - Method: POST
   - Body: JSON với test_id, session_type, etc.

6. **Add Listeners để xem kết quả:**
   - View Results Tree
   - Summary Report
   - Graph Results

#### Chạy test:
- Click **Start** (▶️)
- Xem kết quả trong Summary Report

#### Kết quả quan trọng:
- **Response Time (ms):** Thời gian phản hồi
  - < 200ms: ✅ Tuyệt vời
  - 200-500ms: ✅ Tốt
  - 500-1000ms: ⚠️ Chấp nhận được
  - > 1000ms: ❌ Cần tối ưu

- **Throughput (requests/sec):** Số requests/giây
  - Càng cao càng tốt

- **Error %:** Tỷ lệ lỗi
  - < 1%: ✅ OK
  - > 1%: ❌ Có vấn đề

---

### 2. Dùng Artillery (Command line, dễ dùng)

#### Cài đặt:
```bash
npm install -g artillery
```

#### Tạo file test: `load-test.yml`
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10  # 10 users/giây
      name: "Warm up"
    - duration: 120
      arrivalRate: 50  # 50 users/giây
      name: "Load test"
    - duration: 60
      arrivalRate: 100 # 100 users/giây
      name: "Stress test"
  processor: "./processor.js"

scenarios:
  - name: "Start Exam Session"
    flow:
      - post:
          url: "/exam/exam-sessions/start"
          headers:
            Authorization: "Bearer {{token}}"
          json:
            test_id: 1
            session_type: "FULL_TEST"
            selected_parts: [1, 2, 3]
            time_limit_minutes: 120
```

#### Chạy test:
```bash
artillery run load-test.yml
```

---

### 3. Dùng k6 (Modern, dễ dùng)

#### Cài đặt:
```bash
# Windows: Tải từ https://k6.io/docs/getting-started/installation/
# Hoặc dùng Chocolatey:
choco install k6
```

#### Tạo file test: `load-test.js`
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '1m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 100 },   // Ramp up to 100 users
    { duration: '1m', target: 100 },    // Stay at 100 users
    { duration: '30s', target: 0 },     // Ramp down to 0
  ],
};

export default function () {
  const url = 'http://localhost:5000/exam/exam-sessions/start';
  const payload = JSON.stringify({
    test_id: 1,
    session_type: 'FULL_TEST',
    selected_parts: [1, 2, 3],
    time_limit_minutes: 120,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN_HERE',
    },
  };

  const res = http.post(url, payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

#### Chạy test:
```bash
k6 run load-test.js
```

---

## 📈 Metrics cần theo dõi

### 1. Response Time (Thời gian phản hồi)
- **API calls:** < 500ms
- **Database queries:** < 100ms
- **Redis operations:** < 10ms

### 2. Throughput (Thông lượng)
- **Requests/second:** Càng cao càng tốt
- **Concurrent users:** Số users đồng thời

### 3. Error Rate (Tỷ lệ lỗi)
- **< 0.1%:** ✅ Tuyệt vời
- **0.1-1%:** ✅ OK
- **> 1%:** ❌ Cần fix

### 4. Resource Usage
- **CPU:** < 70%
- **Memory:** < 80%
- **Database connections:** < 80% max connections

---

## 🚀 Tối ưu performance

### 1. Database Optimization
```sql
-- Thêm indexes cho các cột thường query
CREATE INDEX idx_exam_sessions_user_test ON exam_sessions(user_id, test_id);
CREATE INDEX idx_exam_sessions_status ON exam_sessions(status, start_time);
CREATE INDEX idx_user_answers_session ON user_answers(exam_session_id);
```

### 2. Redis Caching (Đã có)
- ✅ Auto-save answers → Giảm load database
- ✅ Session info caching
- ✅ TTL 24h → Tự động cleanup

### 3. Connection Pooling
```javascript
// backend/src/config/database.js
const sequelize = new Sequelize(..., {
  pool: {
    max: 20,        // Tăng số connections
    min: 5,
    acquire: 30000,
    idle: 10000
  }
});
```

### 4. API Response Caching
```javascript
// Cache các API không thay đổi thường xuyên
app.get('/api/tests', cache('5 minutes'), getTests);
```

### 5. Compression
```javascript
const compression = require('compression');
app.use(compression()); // Gzip responses
```

---

## 🔄 Scaling Strategy

### Level 1: Single Server (10-200 users)
- ✅ Tối ưu code
- ✅ Database indexing
- ✅ Redis caching
- ✅ Connection pooling

### Level 2: Load Balancer + 2-3 Servers (200-1000 users)
```
                    ┌─────────────┐
                    │ Load Balancer│
                    │  (Nginx/HAProxy)│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                   │
   ┌────▼────┐      ┌─────▼─────┐      ┌─────▼─────┐
   │ Server 1│      │ Server 2  │      │ Server 3  │
   └────┬────┘      └─────┬─────┘      └─────┬─────┘
        │                  │                   │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Database   │
                    │   (MySQL)    │
                    └──────────────┘
                           │
                    ┌──────▼──────┐
                    │    Redis     │
                    │   (Shared)   │
                    └──────────────┘
```

**Cần:**
- Load balancer (Nginx, HAProxy, hoặc cloud LB)
- Multiple Node.js servers
- Shared Redis (hoặc Redis Cluster)
- Database connection pooling

### Level 3: Microservices (1000+ users)
- Separate services cho exam, user, payment
- Message queue (RabbitMQ, Kafka)
- CDN cho static files
- Database read replicas

---

## 🛠️ Tools để monitor

### 1. PM2 (Process Manager)
```bash
npm install -g pm2

# Start với cluster mode (multiple processes)
pm2 start server.js -i 4  # 4 processes

# Monitor
pm2 monit
```

### 2. New Relic / Datadog
- APM (Application Performance Monitoring)
- Real-time metrics
- Alerting

### 3. Grafana + Prometheus
- Custom metrics
- Dashboards
- Alerting

---

## 📝 Checklist trước khi scale

- [ ] Database có indexes đầy đủ
- [ ] Redis caching được sử dụng
- [ ] Connection pooling được config
- [ ] API responses được compress
- [ ] Static files được serve từ CDN
- [ ] Error logging và monitoring
- [ ] Load testing đã được thực hiện
- [ ] Backup và recovery plan

---

## 🎯 Kết luận

**Hiện tại (Single server):**
- ✅ Có thể handle: **50-200 users đồng thời**
- ⚠️ Cần tối ưu: **200-500 users**
- ❌ Cần scale: **500+ users**

**Để handle 1000 users:**
1. ✅ Load balancer (Nginx/HAProxy)
2. ✅ 2-3 Node.js servers
3. ✅ Redis Cluster (hoặc shared Redis)
4. ✅ Database read replicas
5. ✅ CDN cho static files

**Test ngay:**
```bash
# Dùng k6 (dễ nhất)
k6 run load-test.js

# Hoặc Artillery
artillery run load-test.yml
```

---

## 📚 Resources

- **k6:** https://k6.io/docs/
- **Artillery:** https://www.artillery.io/docs
- **JMeter:** https://jmeter.apache.org/
- **PM2:** https://pm2.keymetrics.io/
- **Nginx Load Balancing:** https://nginx.org/en/docs/http/load_balancing.html

