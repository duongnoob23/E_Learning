# TRẢ LỜI CÁC CÂU HỎI CỦA THẦY KHI BÁO CÁO ĐỒ ÁN

## Câu hỏi 1: Web chịu tải như nào khi nhiều user truy cập cùng lúc?

### Cách trả lời (KHÔNG CẦN DEPLOY):

**1. Kiến trúc hiện tại:**

- Hệ thống sử dụng **Node.js với Express.js** - hỗ trợ xử lý bất đồng bộ (async/await)
- **MySQL database** với connection pooling (Sequelize tự động quản lý)
- **RESTful API** - stateless, dễ scale ngang

**2. Các biện pháp đã áp dụng:**

- ✅ **Connection Pooling**: Sequelize tự động quản lý pool connections đến database
- ✅ **Async/Await**: Xử lý bất đồng bộ, không block thread
- ✅ **Error Handling**: Xử lý lỗi tập trung, tránh crash server
- ✅ **Middleware**: Authentication, validation được tối ưu

**3. Các biện pháp có thể triển khai (chưa implement):**

- ⚠️ **Rate Limiting**: Chưa có (có thể dùng `express-rate-limit`)
- ⚠️ **Caching**: Chưa có Redis cache
- ⚠️ **Load Balancer**: Chưa có (cần khi deploy production)
- ⚠️ **Database Indexing**: Cần kiểm tra và tối ưu indexes

**4. Giải pháp khi deploy:**

- Sử dụng **PM2** hoặc **Docker** để chạy nhiều instances
- **Nginx** làm reverse proxy và load balancer
- **Redis** cho caching và session storage
- **Database replication** nếu cần
- **CDN** cho static files

### Code minh chứng:

```javascript
// backend/src/config/database.js
// Sequelize tự động quản lý connection pool
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  pool: {
    max: 10, // Tối đa 10 connections
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
```

---

## Câu hỏi 2: Khi người dùng mất mạng trong lúc làm bài, có tiếp tục được không?

### Tình trạng hiện tại:

**✅ ĐÃ CÓ:**

- ExamSession có status `IN_PROGRESS` - lưu trạng thái đang làm bài
- Có API `updateExamSession` để cập nhật session
- Có `findActiveSession` để tìm session đang làm

**❌ CHƯA CÓ:**

- Auto-save answers vào localStorage khi mất mạng
- Detection online/offline status
- Tự động restore answers khi có mạng lại
- Auto-sync answers khi có mạng

### Giải pháp đề xuất (CÓ THỂ IMPLEMENT NGAY):

#### 1. Lưu answers vào localStorage (Frontend)

```javascript
// Trong AssessmentTest.jsx
useEffect(() => {
  // Lưu answers vào localStorage mỗi khi thay đổi
  if (sessionData?.exam_session_id) {
    const key = `exam_answers_${sessionData.exam_session_id}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        answers,
        timestamp: Date.now(),
        sessionId: sessionData.exam_session_id,
      })
    );
  }
}, [answers, sessionData]);

// Khi component mount, restore answers từ localStorage
useEffect(() => {
  if (sessionData?.exam_session_id) {
    const key = `exam_answers_${sessionData.exam_session_id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const { answers: savedAnswers } = JSON.parse(saved);
      setAnswers(savedAnswers);
    }
  }
}, [sessionData]);
```

#### 2. Detect online/offline status

```javascript
// Hook để detect network status
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};
```

#### 3. Auto-save answers định kỳ (Backend)

```javascript
// Thêm API endpoint để auto-save answers
// PATCH /api/exam-sessions/:session_id/auto-save
exports.autoSaveAnswers = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.userId;
    const { answers } = req.body;

    // Lưu answers vào UserAnswers table (chưa submit)
    await examClientService.autoSaveAnswers(session_id, user_id, answers);

    res.json({ success: true, message: "Answers saved" });
  } catch (error) {
    next(error);
  }
};
```

#### 4. Restore session khi có mạng lại

```javascript
// Trong AssessmentTest.jsx
const isOnline = useOnlineStatus();

useEffect(() => {
  if (isOnline && sessionData?.exam_session_id) {
    // Khi có mạng lại, sync answers từ server
    const syncAnswers = async () => {
      try {
        // Lấy answers đã lưu từ server
        const response = await examApi.getSessionAnswers(
          sessionData.exam_session_id
        );
        if (response.answers) {
          setAnswers(response.answers);
        }
      } catch (error) {
        console.error("Failed to sync answers:", error);
      }
    };
    syncAnswers();
  }
}, [isOnline, sessionData]);
```

#### 5. Queue để sync khi có mạng

```javascript
// Service Worker hoặc Queue để sync khi có mạng
const syncQueue = [];

const addToSyncQueue = (sessionId, answers) => {
  syncQueue.push({ sessionId, answers, timestamp: Date.now() });
};

const processSyncQueue = async () => {
  if (!navigator.onLine) return;

  while (syncQueue.length > 0) {
    const item = syncQueue.shift();
    try {
      await examApi.autoSaveAnswers(item.sessionId, item.answers);
      // Xóa khỏi localStorage sau khi sync thành công
      localStorage.removeItem(`exam_answers_${item.sessionId}`);
    } catch (error) {
      // Nếu lỗi, đưa lại vào queue
      syncQueue.unshift(item);
      break;
    }
  }
};

// Lắng nghe sự kiện online
window.addEventListener("online", processSyncQueue);
```

### Luồng xử lý đề xuất:

```
1. User bắt đầu làm bài
   ↓
2. Mỗi khi chọn đáp án → Lưu vào:
   - State (React)
   - localStorage (backup)
   - Gửi auto-save request đến server (nếu có mạng)
   ↓
3. Nếu mất mạng:
   - Answers vẫn lưu trong localStorage
   - Hiển thị thông báo "Đang offline, đáp án đã được lưu tạm"
   - Tiếp tục làm bài bình thường
   ↓
4. Khi có mạng lại:
   - Tự động sync answers từ localStorage lên server
   - Restore answers từ server (nếu có)
   - Xóa localStorage sau khi sync thành công
   ↓
5. Khi submit:
   - Gửi tất cả answers lên server
   - Xóa localStorage
```

### API cần thêm:

```javascript
// 1. Auto-save answers (định kỳ)
PATCH /api/exam/exam-sessions/:session_id/auto-save
Body: { answers: { question_id: choice_id } }

// 2. Lấy answers đã lưu
GET /api/exam/exam-sessions/:session_id/answers

// 3. Restore session
GET /api/exam/exam-sessions/:session_id/restore
```

---

## TÓM TẮT TRẢ LỜI THẦY:

### Câu 1: Chịu tải như nào?

**Trả lời:**

- "Thưa thầy, hiện tại hệ thống sử dụng Node.js với async/await và Sequelize connection pooling để xử lý nhiều request đồng thời. Khi deploy production, em sẽ sử dụng PM2 để chạy nhiều instances, Nginx làm load balancer, và Redis cho caching để tăng khả năng chịu tải."

### Câu 2: Mất mạng có tiếp tục được không?

**Trả lời:**

- "Thưa thầy, hiện tại hệ thống đã có ExamSession với status IN_PROGRESS để lưu trạng thái đang làm bài. Tuy nhiên, em nhận thấy cần bổ sung thêm tính năng auto-save answers vào localStorage và tự động sync khi có mạng lại. Em đã có kế hoạch implement tính năng này bằng cách:
  1. Lưu answers vào localStorage mỗi khi user chọn đáp án
  2. Detect online/offline status
  3. Tự động sync answers lên server khi có mạng lại
  4. Restore session và answers khi user quay lại"

---

## KẾT LUẬN:

- **Câu 1**: Có thể trả lời dựa trên kiến trúc hiện tại, không cần deploy
- **Câu 2**: Cần implement thêm tính năng auto-save và offline handling (có thể làm ngay trong code, không cần deploy để test cơ bản)
