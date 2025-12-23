# 🤖 Chatbot Tư Vấn - Hướng Dẫn Triển Khai

## Tổng Quan

Hệ thống chatbot tư vấn được xây dựng với các tính năng:
- ✅ Real-time chat qua Socket.IO
- ✅ Hỗ trợ cả user đã đăng nhập và guest
- ✅ Rule-based responses (có thể nâng cấp lên AI)
- ✅ Quick replies và buttons
- ✅ Lưu lịch sử tin nhắn
- ✅ Context-aware (có thể lưu thông tin về page, course, etc.)

## 📋 Cài Đặt

### 1. Database Migration

Chạy SQL migration để tạo bảng:

```bash
mysql -u your_user -p your_database < backend/src/migrations/create_chatbot_tables.sql
```

Hoặc chạy trực tiếp trong MySQL Workbench/phpMyAdmin.

### 2. Backend Dependencies

Backend đã có sẵn `socket.io`, không cần cài thêm.

### 3. Frontend Dependencies

Cài đặt `socket.io-client`:

```bash
cd frontend/Shopery
npm install socket.io-client
```

## 🏗️ Kiến Trúc

### Backend Structure

```
backend/src/
├── models/
│   ├── ChatSession.js      # Model cho chat session
│   └── ChatMessage.js      # Model cho tin nhắn
├── client/
│   ├── services/
│   │   └── chatbotService.js    # Logic xử lý chatbot
│   ├── controllers/
│   │   └── chatbotClientController.js
│   └── routes/
│       └── chatbotClientRoutes.js
└── socket/
    └── chatbotSocket.js     # Socket.IO handler
```

### Frontend Structure

```
frontend/Shopery/src/
├── common/
│   ├── services/Chatbot/
│   │   ├── chatbot.service.js   # API service
│   │   └── useChatbot.js        # React Query hooks
│   └── components/Chatbot/
│       ├── ChatbotWidget.jsx    # Main component
│       └── ChatbotWidget.css
```

## 🚀 Sử Dụng

### Backend API

#### 1. Lấy hoặc tạo session

```http
GET /api/chatbot/session?session_token=xxx
Authorization: Bearer <token> (optional)
```

Response:
```json
{
  "EC": "0",
  "EM": "Lấy session thành công",
  "DT": {
    "session_id": 1,
    "user_id": 123,
    "session_token": "guest_xxx",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Gửi tin nhắn

```http
POST /api/chatbot/message
Content-Type: application/json
Authorization: Bearer <token> (optional)

{
  "session_id": 1,
  "content": "Xin chào",
  "context": {
    "page_url": "/courses",
    "course_id": 5
  }
}
```

#### 3. Lấy lịch sử tin nhắn

```http
GET /api/chatbot/messages/:session_id?limit=50
```

### Socket.IO Events

#### Client → Server

- `join_chat_session`: Tham gia session room
- `leave_chat_session`: Rời khỏi session room
- `send_message`: Gửi tin nhắn
- `quick_reply`: Xử lý quick reply button
- `typing`: Gửi typing indicator

#### Server → Client

- `chat_history`: Nhận lịch sử tin nhắn khi join
- `new_message`: Nhận tin nhắn mới
- `chat_error`: Lỗi
- `user_typing`: User đang gõ

### Frontend Component

Component `ChatbotWidget` đã được thêm vào `App.jsx`, tự động hiển thị ở mọi trang.

## 🎨 Tùy Chỉnh

### Thêm Rule-Based Responses

Chỉnh sửa `backend/src/client/services/chatbotService.js`, function `generateBotResponse()`:

```javascript
// Thêm pattern mới
if (message.match(/your-pattern/i)) {
  return {
    content: "Phản hồi của bạn",
    message_type: "text",
  };
}
```

### Tích Hợp AI (OpenAI/Gemini)

Thay thế logic trong `generateBotResponse()`:

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateBotResponse(userMessage, context, session_id) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Bạn là trợ lý tư vấn cho website học tiếng Anh..." },
      { role: "user", content: userMessage }
    ],
  });

  return {
    content: completion.choices[0].message.content,
    message_type: "text",
  };
}
```

### Thêm Quick Replies

Trong response của bot, thêm `metadata.quick_replies`:

```javascript
return {
  content: "Bạn muốn làm gì?",
  message_type: "text",
  metadata: {
    quick_replies: [
      { title: "Xem khóa học", payload: "COURSES" },
      { title: "FAQ", payload: "FAQ" },
    ],
  },
};
```

### Thêm Buttons

```javascript
metadata: {
  buttons: [
    {
      type: "web_url",
      url: "/courses",
      title: "Xem khóa học",
    },
  ],
}
```

## 📊 Database Schema

### chat_sessions

| Column | Type | Description |
|--------|------|-------------|
| session_id | BIGINT | Primary key |
| user_id | BIGINT | User ID (nullable for guests) |
| session_token | VARCHAR(255) | Unique token for guest sessions |
| status | ENUM | active, closed, waiting |
| agent_id | BIGINT | Admin/agent handling (nullable) |
| context | JSON | Context data (page_url, course_id, etc.) |

### chat_messages

| Column | Type | Description |
|--------|------|-------------|
| message_id | BIGINT | Primary key |
| session_id | BIGINT | Foreign key to chat_sessions |
| sender_type | ENUM | user, bot, agent |
| sender_id | BIGINT | User ID (nullable for bot) |
| content | TEXT | Message content |
| message_type | ENUM | text, image, file, quick_reply, card |
| metadata | JSON | Additional data (buttons, quick_replies) |
| is_read | BOOLEAN | Read status |

## 🔒 Security

- Socket.IO authentication: JWT token (optional, guest có thể kết nối)
- Rate limiting: Có thể thêm ở controller level
- Input validation: Validate content trước khi lưu

## 🚧 Nâng Cấp Tương Lai

- [ ] Tích hợp AI (OpenAI/Gemini)
- [ ] Admin dashboard để xem và trả lời tin nhắn
- [ ] File upload support
- [ ] Rich media messages (images, videos)
- [ ] Analytics và reporting
- [ ] Multi-language support
- [ ] Chatbot training từ lịch sử tin nhắn

## 📝 Notes

- Session token được lưu trong localStorage của frontend
- Guest sessions có thể được chuyển thành user session khi đăng nhập
- Context có thể được sử dụng để personalize responses























