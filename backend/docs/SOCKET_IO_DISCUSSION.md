# Socket.IO Discussion System Documentation

## Tổng quan

Hệ thống thảo luận sử dụng Socket.IO để cung cấp tính năng real-time chat/comment cho các đề thi. Người dùng có thể tham gia thảo luận, tạo discussion mới, thêm comment và nhận thông báo real-time.

## Cài đặt

### Backend
```bash
npm install socket.io
```

### Frontend (Client)
```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
```

## Xác thực

Socket.IO sử dụng JWT token để xác thực người dùng:

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

## Events

### Client → Server Events

#### 1. `join_test_discussion`
Tham gia thảo luận của một đề thi cụ thể.

```javascript
socket.emit('join_test_discussion', test_id);
```

**Parameters:**
- `test_id` (number): ID của đề thi

#### 2. `leave_test_discussion`
Rời khỏi thảo luận của một đề thi.

```javascript
socket.emit('leave_test_discussion', test_id);
```

**Parameters:**
- `test_id` (number): ID của đề thi

#### 3. `create_discussion`
Tạo thảo luận mới.

```javascript
socket.emit('create_discussion', {
  test_id: 1,
  title: 'Thảo luận về đề thi TOEIC',
  content: 'Nội dung thảo luận...'
});
```

**Parameters:**
- `test_id` (number): ID của đề thi
- `title` (string): Tiêu đề thảo luận
- `content` (string): Nội dung thảo luận

#### 4. `add_comment`
Thêm bình luận vào thảo luận.

```javascript
socket.emit('add_comment', {
  test_discussion_id: 1,
  content: 'Nội dung bình luận...',
  parent_comment_id: null // Optional, for reply
});
```

**Parameters:**
- `test_discussion_id` (number): ID của thảo luận
- `content` (string): Nội dung bình luận
- `parent_comment_id` (number, optional): ID của comment cha (để reply)

#### 5. `typing_start`
Thông báo bắt đầu gõ.

```javascript
socket.emit('typing_start', {
  test_id: 1,
  discussion_id: 1
});
```

#### 6. `typing_stop`
Thông báo ngừng gõ.

```javascript
socket.emit('typing_stop', {
  test_id: 1,
  discussion_id: 1
});
```

### Server → Client Events

#### 1. `user_joined_discussion`
Thông báo có user mới tham gia thảo luận.

```javascript
socket.on('user_joined_discussion', (data) => {
  console.log(data.user); // Thông tin user
  console.log(data.message); // Thông báo
});
```

#### 2. `user_left_discussion`
Thông báo có user rời khỏi thảo luận.

```javascript
socket.on('user_left_discussion', (data) => {
  console.log(data.user); // Thông tin user
  console.log(data.message); // Thông báo
});
```

#### 3. `new_discussion`
Thông báo có thảo luận mới được tạo.

```javascript
socket.on('new_discussion', (data) => {
  console.log(data.discussion); // Thông tin thảo luận mới
  console.log(data.message); // Thông báo
});
```

#### 4. `new_comment`
Thông báo có bình luận mới.

```javascript
socket.on('new_comment', (data) => {
  console.log(data.comment); // Thông tin bình luận mới
  console.log(data.discussion_id); // ID thảo luận
  console.log(data.message); // Thông báo
});
```

#### 5. `discussion_created`
Xác nhận thảo luận đã được tạo thành công.

```javascript
socket.on('discussion_created', (data) => {
  console.log(data.discussion); // Thông tin thảo luận vừa tạo
});
```

#### 6. `comment_added`
Xác nhận bình luận đã được thêm thành công.

```javascript
socket.on('comment_added', (data) => {
  console.log(data.comment); // Thông tin bình luận vừa thêm
});
```

#### 7. `discussion_error`
Thông báo lỗi khi tạo thảo luận.

```javascript
socket.on('discussion_error', (data) => {
  console.error(data.message); // Thông báo lỗi
});
```

#### 8. `comment_error`
Thông báo lỗi khi thêm bình luận.

```javascript
socket.on('comment_error', (data) => {
  console.error(data.message); // Thông báo lỗi
});
```

#### 9. `user_typing`
Thông báo user đang gõ.

```javascript
socket.on('user_typing', (data) => {
  console.log(data.user); // Thông tin user
  console.log(data.typing); // true/false
  console.log(data.discussion_id); // ID thảo luận
});
```

## Rooms

Hệ thống sử dụng rooms để phân chia thảo luận theo đề thi:
- Room name format: `test_{test_id}`
- Ví dụ: `test_1`, `test_2`, etc.

## REST API Fallback

Ngoài Socket.IO, hệ thống vẫn hỗ trợ REST API:

### GET /api/discussions/test/{test_id}
Lấy danh sách thảo luận của đề thi.

### POST /api/discussions
Tạo thảo luận mới.

### POST /api/discussions/{discussion_id}/comments
Thêm bình luận.

## Demo

Truy cập `http://localhost:5000/discussion-demo.html` để xem demo tương tác với Socket.IO.

## Ví dụ sử dụng Frontend

```javascript
// Kết nối
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('jwt_token') }
});

// Tham gia thảo luận
socket.emit('join_test_discussion', 1);

// Lắng nghe thảo luận mới
socket.on('new_discussion', (data) => {
  // Cập nhật UI với thảo luận mới
  addDiscussionToUI(data.discussion);
});

// Lắng nghe bình luận mới
socket.on('new_comment', (data) => {
  // Cập nhật UI với bình luận mới
  addCommentToUI(data.comment);
});

// Tạo thảo luận
function createDiscussion(title, content) {
  socket.emit('create_discussion', {
    test_id: currentTestId,
    title: title,
    content: content
  });
}

// Thêm bình luận
function addComment(discussionId, content, parentId = null) {
  socket.emit('add_comment', {
    test_discussion_id: discussionId,
    content: content,
    parent_comment_id: parentId
  });
}
```

## Lưu ý bảo mật

1. **JWT Token**: Luôn validate JWT token trước khi cho phép kết nối
2. **Rate Limiting**: Cân nhắc implement rate limiting cho các events
3. **Input Validation**: Validate tất cả input từ client
4. **CORS**: Cấu hình CORS phù hợp cho production

## Troubleshooting

### Lỗi xác thực
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra user có tồn tại trong database không

### Không nhận được events
- Kiểm tra đã join đúng room chưa
- Kiểm tra connection status
- Kiểm tra console logs để debug

### Performance
- Monitor số lượng connections
- Implement connection pooling nếu cần
- Cân nhắc sử dụng Redis adapter cho multiple servers
