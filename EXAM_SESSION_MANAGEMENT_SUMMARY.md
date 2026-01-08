# Tổng hợp: Hệ thống quản lý Exam Session với Redis Cache

## 📋 Mục lục

1. [Vấn đề ban đầu](#vấn-đề-ban-đầu)
2. [Yêu cầu nghiệp vụ](#yêu-cầu-nghiệp-vụ)
3. [Giải pháp triển khai](#giải-pháp-triển-khai)
4. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
5. [Luồng hoạt động chi tiết](#luồng-hoạt-động-chi-tiết)
6. [Các tính năng đã triển khai](#các-tính-năng-đã-triển-khai)
7. [Files đã thay đổi](#files-đã-thay-đổi)

---

## 🎯 Vấn đề ban đầu

### Vấn đề 1: Mất đáp án khi mất mạng/điện

- **Tình huống**: User đang làm bài thi, chọn được 2/5 parts, bị mất mạng hoặc mất điện đột ngột
- **Hậu quả**:
  - Chưa kịp submit bài thi
  - Tất cả đáp án đã chọn bị mất
  - Khi mở lại, phải làm lại từ đầu


### Vấn đề 3: Không restore được đáp án đã chọn

- **Tình huống**: User mở lại bài thi đang làm dở
- **Hậu quả**:
  - Hệ thống phát hiện có session IN_PROGRESS
  - Nhưng không restore được các đáp án đã chọn trước đó
  - User phải làm lại từ đầu

### Vấn đề 4: Nhầm lẫn giữa tạo mới và tiếp tục

- **Tình huống**: User bấm "Bắt đầu làm bài" → Tạo session mới → Bấm lại "Bắt đầu làm bài"
- **Hậu quả**:
  - Hệ thống check thấy có session IN_PROGRESS (vừa tạo)
  - Hiển thị modal nhầm lẫn (tưởng là session cũ)
  - Không phân biệt được session mới tạo vs session cũ

---

## 📝 Yêu cầu nghiệp vụ

### 1. Auto-save đáp án

- **Mục đích**: Lưu đáp án ngay khi user chọn, không cần chờ submit
- **Yêu cầu**:
  - Mỗi khi user chọn đáp án → Tự động lưu vào cache
  - Cache phải tồn tại ngay cả khi mất mạng
  - Tự động xóa cache khi submit bài thi

### 2. Restore đáp án khi mở lại

- **Mục đích**: User mở lại bài thi → Hiển thị đáp án đã chọn trước đó
- **Yêu cầu**:
  - Tự động restore từ cache khi component mount
  - Hiển thị đúng các câu đã chọn
  - Không làm gián đoạn trải nghiệm user

### 3. Block navigation khi đang làm bài

- **Mục đích**: Ngăn user vô tình thoát khỏi bài thi
- **Yêu cầu**:
  - Block Back button
  - Block F5 (refresh)
  - Block navigation đến trang khác
  - Popup xác nhận với option "Nộp bài sớm" hoặc "Tiếp tục làm bài"

### 4. Quản lý active sessions

- **Mục đích**: User có thể có nhiều bài thi chưa hoàn thành
- **Yêu cầu**:
  - Check tất cả active sessions của user (không chỉ của test_id đó)
  - Hiển thị modal với danh sách sessions chưa hoàn thành
  - User có thể chọn: "Tiếp tục bài này" hoặc "Hủy bài này"
  - Phân biệt rõ giữa tạo bài thi mới vs tiếp tục bài thi cũ

### 5. Tự động cleanup sessions cũ

- **Mục đích**: Tránh tích lũy sessions cũ không còn dùng
- **Yêu cầu**:
  - Sessions > 24h tự động đánh dấu ABANDONED
  - Xóa Redis cache của sessions cũ
  - Không hiển thị trong modal

---

## 🛠️ Giải pháp triển khai

### 1. Redis Cache cho đáp án

- **Công nghệ**: Redis (in-memory database)
- **Lý do**:
  - Tốc độ cao (in-memory)
  - TTL tự động (24 giờ)
  - Không bắt buộc (app vẫn chạy nếu không có Redis)

### 2. Auto-save với debounce

- **Cơ chế**: Debounce 500ms để tránh spam API
- **Lý do**: User có thể chọn nhanh nhiều câu → Chỉ gọi API 1 lần sau 500ms

### 3. Flag phân biệt session mới/cũ

- **Cơ chế**:
  - `is_newly_created: true` khi tạo session mới
  - Loại bỏ sessions < 1 phút và chưa có answers khỏi active sessions
- **Lý do**: Phân biệt rõ session vừa tạo vs session cũ

### 4. Modal quản lý active sessions

- **Cơ chế**: Hiển thị danh sách sessions với thông tin chi tiết
- **Lý do**: User có thể quản lý nhiều bài thi chưa hoàn thành

---

## 🏗️ Kiến trúc hệ thống

### Backend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  POST /exam-sessions/start                              │
│  POST /exam-sessions/:id/auto-save                      │
│  GET  /exam-sessions/:id/restore                        │
│  POST /exam-sessions/:id/cancel                          │
│  GET  /exam-sessions/active                              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Service Layer                           │
│  - startExamSession()                                   │
│  - submitExamSession()                                  │
│  - redisExamCacheService                                 │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
┌──────────────────┐              ┌──────────────────┐
│   MySQL Database │              │   Redis Cache     │
│  - exam_sessions │              │  - exam:session: │
│  - user_answers  │              │    {id}:answers  │
└──────────────────┘              └──────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│              AssessmentTest Component                    │
│  - State: answers = {}                                   │
│  - Auto-save với debounce                                │
│  - Restore từ Redis khi mount                            │
│  - Block navigation với useExamLeaveBlocker               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Tabs Component                         │
│  - handleStartTest()                                     │
│  - Check active sessions                                 │
│  - Hiển thị ActiveSessionModal                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│            ActiveSessionModal Component                 │
│  - Danh sách active sessions                            │
│  - Option: Tiếp tục / Hủy                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Luồng hoạt động chi tiết

### Luồng 1: Tạo bài thi mới (Lần đầu)

```
User bấm "Bắt đầu làm bài"
    │
    ▼
Frontend: Tabs.jsx → handleStartTest()
    │
    ▼
API: POST /exam-sessions/start
    │
    ▼
Backend: startExamSession()
    │
    ├─ Check active sessions (force_new = false)
    │  ├─ Loại bỏ sessions < 1 phút và chưa có answers
    │  └─ Nếu có sessions cũ → Return EC = 3
    │
    ├─ Tạo session mới
    │  ├─ ExamSession.createSession()
    │  ├─ Lưu session info vào Redis
    │  └─ Return EC = 0, is_newly_created = true
    │
    ▼
Frontend: Check result
    │
    ├─ EC = 0 + is_newly_created = true
    │  └─ Navigate("/assessmentTest") → Vào làm bài luôn ✅
    │
    └─ EC = 3 (có active sessions)
       └─ Hiển thị ActiveSessionModal
```

### Luồng 2: User chọn đáp án (Auto-save)

```
User chọn đáp án
    │
    ▼
Frontend: AssessmentTest → handleAnswer()
    │
    ├─ Update state: answers[qid] = choiceId
    │
    └─ Debounce 500ms
       │
       ▼
    API: POST /exam-sessions/:id/auto-save
       │
       ▼
    Backend: autoSaveAnswer()
       │
       ├─ Lấy answers hiện tại từ Redis
       ├─ Update answer mới
       └─ Lưu lại vào Redis (TTL 24h)
```

### Luồng 3: User mất mạng/điện

```
User đang làm bài → Mất mạng/điện
    │
    ▼
Đáp án đã được lưu trong Redis (TTL 24h)
    │
    ▼
User mở lại bài thi
    │
    ▼
Frontend: AssessmentTest → useEffect (mount)
    │
    ├─ Check sessionData.cached_answers (từ startExamSession)
    │  └─ Nếu có → Restore ngay
    │
    └─ Fallback: API GET /exam-sessions/:id/restore
       │
       ▼
    Backend: restoreAnswers()
       │
       └─ Lấy từ Redis → Return answers
          │
          ▼
    Frontend: Convert format → setAnswers()
       │
       ▼
    Hiển thị đáp án đã chọn ✅
```

### Luồng 4: User quay lại bài thi cũ

```
User bấm "Bắt đầu làm bài" (lần 2)
    │
    ▼
Backend: startExamSession()
    │
    ├─ Check active sessions
    │  ├─ Loại bỏ sessions < 1 phút và chưa có answers
    │  └─ Tìm sessions cũ (> 1 phút hoặc có answers)
    │
    └─ Nếu có sessions cũ
       │
       ▼
    Return EC = 3, active_sessions = [...]
       │
       ▼
Frontend: Hiển thị ActiveSessionModal
    │
    ├─ User chọn "Tiếp tục bài này"
    │  │
    │  ▼
    │  Navigate("/assessmentTest", { sessionData: session_cũ })
    │  │
    │  ▼
    │  AssessmentTest restore answers từ cached_answers
    │  │
    │  ▼
    │  Hiển thị bài thi với đáp án đã chọn ✅
    │
    └─ User chọn "Hủy bài này"
       │
       ▼
       API: POST /exam-sessions/:id/cancel
       │
       ▼
       Backend:
       ├─ Update status = ABANDONED
       └─ Xóa Redis cache
       │
       ▼
       Frontend: Xóa khỏi danh sách
       │
       └─ Nếu hết active sessions → Tự động tạo bài thi mới
```

### Luồng 5: User submit bài thi

```
User bấm "Nộp bài"
    │
    ▼
Frontend: AssessmentTest → handleSubmit()
    │
    ├─ Clear debounce timer
    │
    └─ API: POST /exam-sessions/:id/submit
       │
       ▼
    Backend: submitExamSession()
       │
       ├─ Lưu answers vào MySQL (user_answers table)
       ├─ Tính điểm, cập nhật thống kê
       ├─ Update session: status = COMPLETED, end_time = now
       │
       └─ Xóa Redis cache
          ├─ deleteAnswers(session_id)
          └─ deleteSessionInfo(session_id)
          │
          ▼
    Frontend: Navigate("/assessmentResult")
```

### Luồng 6: User Back/F5/Đổi trang

```
User nhấn Back / F5 / Click link khác
    │
    ▼
Frontend: useExamLeaveBlocker hook
    │
    ├─ Check: isExamInProgress = true?
    │  │
    │  ├─ Yes → Popup confirm
    │  │  │
    │  │  ├─ User chọn OK → Gọi handleSubmit() → Nộp bài sớm
    │  │  │
    │  │  └─ User chọn Cancel → Ở lại trang, tiếp tục làm bài
    │  │
    │  └─ No → Cho phép navigate bình thường
```

---

## ✨ Các tính năng đã triển khai

### Backend

1. **Redis Service** (`redisExamCacheService.js`)

   - ✅ `saveAnswers()`: Lưu array đáp án
   - ✅ `saveSingleAnswer()`: Auto-save một đáp án
   - ✅ `getAnswers()`: Lấy đáp án từ cache
   - ✅ `deleteAnswers()`: Xóa cache khi submit/hủy
   - ✅ `saveSessionInfo()`: Lưu thông tin session
   - ✅ `getSessionInfo()`: Lấy thông tin session
   - ✅ TTL: 24 giờ tự động

2. **API Endpoints**

   - ✅ `POST /exam-sessions/:id/auto-save`: Auto-save đáp án
   - ✅ `GET /exam-sessions/:id/restore`: Restore đáp án
   - ✅ `POST /exam-sessions/:id/cancel`: Hủy exam và xóa cache
   - ✅ `GET /exam-sessions/active`: Lấy tất cả active sessions

3. **Logic thông minh**
   - ✅ Phân biệt session mới/cũ (loại bỏ sessions < 1 phút chưa có answers)
   - ✅ Tự động cleanup sessions > 24h
   - ✅ Check tất cả active sessions của user (không chỉ của test_id)

### Frontend

1. **Auto-save với debounce**

   - ✅ Debounce 500ms để tránh spam API
   - ✅ Chỉ auto-save cho Listening/Reading (selected_choice_id)
   - ✅ Silent fail (không hiển thị lỗi nếu Redis không có)

2. **Restore answers**

   - ✅ Ưu tiên dùng `cached_answers` từ session data
   - ✅ Fallback: Gọi API restore nếu không có
   - ✅ Convert format đúng cho state

3. **Block navigation**

   - ✅ `useExamLeaveBlocker` hook
   - ✅ Block Back button, F5, navigation
   - ✅ Popup confirm với message rõ ràng
   - ✅ Option: Nộp bài sớm hoặc tiếp tục làm bài

4. **Active Session Modal**

   - ✅ Hiển thị danh sách active sessions
   - ✅ Thông tin: Tên bài thi, thời gian bắt đầu, thời gian đã làm, số câu đã trả lời
   - ✅ 2 nút: "Tiếp tục bài này" và "Hủy bài này"
   - ✅ Tự động tạo bài thi mới khi hủy hết sessions

5. **Phân biệt tạo mới vs tiếp tục**
   - ✅ Flag `is_newly_created` từ backend
   - ✅ Tự động vào làm bài nếu là session mới
   - ✅ Hiển thị modal nếu là session cũ

---

## 📁 Files đã thay đổi

### Backend

#### Files mới tạo:

1. `backend/src/config/redis.js`

   - Kết nối Redis
   - Error handling (silent fail nếu Redis không có)

2. `backend/src/services/redisExamCacheService.js`

   - Service quản lý Redis cache cho exam answers
   - Các hàm: save, get, delete answers và session info

3. `backend/REDIS_SETUP.md`
   - Hướng dẫn cài đặt Redis

#### Files đã sửa:

1. `backend/src/config/index.js`

   - Export Redis functions

2. `backend/src/server.js`

   - Kết nối Redis khi start server
   - Đóng Redis khi shutdown

3. `backend/src/models/exam/ExamSession.js`

   - Thêm `findAllActiveSessions()`: Lấy tất cả active sessions (trong 24h)

4. `backend/src/client/services/examClientService.js`

   - `startExamSession()`:
     - Check tất cả active sessions
     - Loại bỏ sessions < 1 phút chưa có answers
     - Tự động cleanup sessions > 24h
     - Thêm flag `is_newly_created`
   - `submitExamSession()`: Xóa Redis cache sau khi submit

5. `backend/src/client/controllers/examClientController.js`

   - `autoSaveAnswer()`: API auto-save đáp án
   - `restoreAnswers()`: API restore đáp án
   - `cancelExamSession()`: API hủy exam
   - `getAllActiveSessions()`: API lấy active sessions

6. `backend/src/client/routes/examClientRoutes.js`
   - Thêm routes cho auto-save, restore, cancel, get active sessions

### Frontend

#### Files mới tạo:

1. `frontend/Shopery/src/Client/components/Assessment/AssessmentJSX/ActiveSessionModal.jsx`

   - Modal hiển thị active sessions
   - UI với thông tin chi tiết

2. `frontend/Shopery/src/Client/components/Assessment/AssessmentCSS/ActiveSessionModal.css`
   - Styles cho modal

#### Files đã sửa:

1. `frontend/Shopery/src/Client/api/Assessment/assessmentApi.js`

   - Thêm: `autoSaveAnswer()`, `restoreAnswers()`, `cancelExamSession()`, `getAllActiveSessions()`

2. `frontend/Shopery/src/Client/services/Assessment/assessmentMutations.js`

   - Thêm: `useAutoSaveAnswer()`, `useRestoreAnswers()`, `useCancelExamSession()`

3. `frontend/Shopery/src/Client/components/Assessment/AssessmentJSX/Tabs.jsx`

   - `handleStartTest()`: Xử lý logic check active sessions
   - `handleContinueSession()`: Tiếp tục bài thi cũ
   - `handleCancelSession()`: Hủy bài thi cũ
   - Hiển thị `ActiveSessionModal`

4. `frontend/Shopery/src/Client/components/Assessment/AssessmentJSX/PartSelector.jsx`

   - Tương tự Tabs.jsx: Xử lý logic check active sessions

5. `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/AssessmentTest.jsx`
   - Restore answers từ Redis khi mount
   - Auto-save với debounce khi user chọn đáp án
   - Block navigation với `useExamLeaveBlocker`
   - Clear debounce timer khi submit/navigate

---

## 🔧 Cấu hình và Dependencies

### Backend Dependencies

```json
{
  "redis": "^latest" // Đã thêm vào package.json
}
```

### Environment Variables (Optional)

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Nếu có password
```

### Redis Setup

- **Không bắt buộc**: App vẫn chạy bình thường nếu không có Redis
- **Khuyến nghị**: Cài Redis để có tính năng auto-save/restore
- **TTL**: Cache tự động hết hạn sau 24 giờ

---

## 🎯 Kết quả đạt được

### ✅ Đã giải quyết

1. **Mất đáp án khi mất mạng/điện**

   - ✅ Auto-save vào Redis mỗi khi chọn đáp án
   - ✅ Restore tự động khi mở lại
   - ✅ TTL 24h đảm bảo cache tồn tại

2. **Navigation không được block**

   - ✅ Block Back, F5, navigation
   - ✅ Popup confirm với option rõ ràng
   - ✅ Option nộp bài sớm hoặc tiếp tục

3. **Không restore được đáp án**

   - ✅ Restore từ Redis khi mount
   - ✅ Ưu tiên dùng cached_answers từ session data
   - ✅ Convert format đúng

4. **Nhầm lẫn tạo mới vs tiếp tục**
   - ✅ Flag `is_newly_created` phân biệt rõ
   - ✅ Loại bỏ sessions < 1 phút chưa có answers
   - ✅ Tự động vào làm bài nếu là session mới

### 📊 Metrics

- **Auto-save delay**: 500ms (debounce)
- **Cache TTL**: 24 giờ
- **Session cleanup**: Tự động sau 24h
- **Fresh session threshold**: 1 phút

---

## 🚀 Cách sử dụng

### 1. Cài đặt Redis (Optional)

```bash
# Docker
docker run -d -p 6379:6379 --name redis redis

# Hoặc cài trực tiếp trên Windows
# Xem: backend/REDIS_SETUP.md
```

### 2. Start Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend

```bash
cd frontend/Shopery
npm install
npm run dev
```

### 4. Test Flow

**Test 1: Tạo bài thi mới**

1. Vào trang chi tiết đề thi
2. Bấm "Bắt đầu làm bài"
3. ✅ Vào làm bài ngay (không hiển thị modal)

**Test 2: Auto-save**

1. Chọn một số đáp án
2. Mở DevTools → Network → Xem API auto-save được gọi (debounce 500ms)
3. ✅ Đáp án được lưu vào Redis

**Test 3: Mất mạng**

1. Chọn một số đáp án
2. Tắt mạng (hoặc đóng tab)
3. Mở lại bài thi
4. ✅ Đáp án đã chọn được restore

**Test 4: Quay lại bài thi cũ**

1. Làm bài thi A (chưa submit)
2. Thoát ra, vào bài thi B
3. Bấm "Bắt đầu làm bài"
4. ✅ Hiển thị modal với bài thi A
5. Chọn "Tiếp tục bài này"
6. ✅ Quay lại bài thi A với đáp án đã chọn

**Test 5: Block navigation**

1. Đang làm bài
2. Nhấn Back hoặc F5
3. ✅ Popup confirm xuất hiện
4. Chọn OK → Nộp bài sớm
5. Chọn Cancel → Ở lại trang

---

## 🔍 Chi tiết kỹ thuật

### Redis Key Format

```
exam:session:{session_id}:answers  → JSON array of answers
exam:session:{session_id}:info     → JSON object of session info
```

### Answer Format trong Redis

```json
[
  {
    "question_id": 123,
    "selected_choice_id": 456,
    "updated_at": "2026-01-08T12:00:00.000Z"
  }
]
```

### Session Info Format trong Redis

```json
{
  "user_id": 1,
  "test_id": 2,
  "start_time": "2026-01-08T12:00:00.000Z",
  "status": "IN_PROGRESS"
}
```

### API Response Format

**startExamSession - Tạo mới thành công:**

```json
{
  "EM": "Bắt đầu phiên thi thành công",
  "EC": "0",
  "DT": {
    "exam_session_id": 123,
    "user_id": 1,
    "test_id": 2,
    "status": "IN_PROGRESS",
    "is_newly_created": true,
    "test": { ... }
  }
}
```

**startExamSession - Có active sessions:**

```json
{
  "EM": "Bạn đang có phiên thi chưa hoàn thành",
  "EC": "3",
  "DT": {
    "active_sessions": [
      {
        "exam_session_id": 120,
        "test_id": 1,
        "start_time": "2026-01-08T10:00:00.000Z",
        "cached_answers": [...],
        "cached_answers_count": 5,
        "test": { "title": "TOEIC Test 1", ... }
      }
    ],
    "requested_test_id": 2
  }
}
```

---

## ⚠️ Lưu ý quan trọng

1. **Redis không bắt buộc**

   - Nếu không cài Redis, app vẫn chạy bình thường
   - Chỉ không có tính năng auto-save/restore
   - Không spam log lỗi (đã fix)

2. **TTL và Cleanup**

   - Cache tự động hết hạn sau 24h
   - Sessions > 24h tự động đánh dấu ABANDONED
   - Sessions < 1 phút chưa có answers không hiển thị trong modal

3. **Performance**

   - Debounce 500ms tránh spam API
   - Redis in-memory nên rất nhanh
   - Silent fail không ảnh hưởng UX

4. **Data Consistency**
   - Redis chỉ là cache tạm thời
   - Dữ liệu thật được lưu vào MySQL khi submit
   - Nếu Redis mất, user chỉ mất đáp án chưa submit (có thể làm lại)

---

## 📝 Tóm tắt cho Senior

### Vấn đề

User làm bài thi bị mất mạng/điện → Mất hết đáp án đã chọn → Phải làm lại từ đầu.

### Giải pháp

1. **Redis Cache**: Auto-save đáp án vào Redis mỗi khi user chọn (debounce 500ms)
2. **Auto-restore**: Tự động restore đáp án từ Redis khi mở lại bài thi
3. **Block navigation**: Ngăn user vô tình thoát khỏi bài thi, có popup xác nhận
4. **Quản lý sessions**: Check tất cả active sessions, hiển thị modal để user chọn tiếp tục/hủy
5. **Phân biệt tạo mới vs tiếp tục**: Dùng flag `is_newly_created` và loại bỏ sessions vừa tạo

### Kết quả

- ✅ User không mất đáp án khi mất mạng
- ✅ Có thể quay lại bài thi cũ với đáp án đã chọn
- ✅ Block navigation an toàn
- ✅ Quản lý nhiều bài thi chưa hoàn thành
- ✅ Phân biệt rõ tạo mới vs tiếp tục

### Tech Stack

- **Backend**: Node.js, Express, Sequelize, Redis
- **Frontend**: React, React Router, Zustand
- **Cache**: Redis (TTL 24h, không bắt buộc)

---

**Tổng kết**: Hệ thống đã hoàn chỉnh, sẵn sàng test và deploy! 🎉
