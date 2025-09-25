# Test Flashcard API Integration

## Đã tích hợp API vào Frontend

### 1. Files đã tạo/cập nhật:

#### **API Layer:**

- `src/Client/api/Flashcard/flashcardApi.js` - API functions cho flashcard
- `src/Client/hooks/Flashcard/useFlashcardQueries.js` - React Query hooks

#### **Component Updates:**

- `src/Client/pages/Flashcard/Flashcard.jsx` - Tích hợp API thay thế dữ liệu fake
- `src/Client/pages/Flashcard/Flashcard.css` - Thêm CSS cho search bar

### 2. Tính năng đã tích hợp:

#### **✅ API Calls:**

- `useExploreTopics()` - Lấy topics cho phần khám phá
- `useUserTopics()` - Lấy topics của user (List từ của tôi)
- `useCreateTopic()` - Tạo topic mới

#### **✅ UI Features:**

- **Search functionality** - Tìm kiếm topics theo tên/mô tả
- **Loading states** - Hiển thị loading cho từng tab
- **Error handling** - Xử lý lỗi API
- **Real-time updates** - Tự động refresh sau khi tạo topic

#### **✅ Data Flow:**

```
Backend API → React Query Hooks → Component State → UI Rendering
```

### 3. API Endpoints được sử dụng:

#### **Explore Topics:**

```
GET /api/client/words/topics/explore
Query: { page, limit, search, topic_type }
```

#### **User Topics:**

```
GET /api/client/words/topics/user
Headers: { Authorization: Bearer <token> }
Query: { page, limit, search }
```

### 4. Cách test:

#### **1. Start Backend:**

```bash
cd backend
npm run dev
```

#### **2. Start Frontend:**

```bash
cd frontend/Shopery
npm run dev
```

#### **3. Test Features:**

1. **Khám phá tab**: Xem topics từ database
2. **List từ của tôi tab**: Xem topics của user (cần đăng nhập)
3. **Search**: Tìm kiếm topics
4. **Tạo topic**: Tạo topic mới và xem nó xuất hiện trong "List từ của tôi"

### 5. Expected Behavior:

#### **Khám phá Tab:**

- Hiển thị topics có `topic_type = 'system'`
- Có search functionality
- Loading state khi fetch data
- Error handling nếu API fail

#### **List từ của tôi Tab:**

- Hiển thị topics có `created_by = user_id`
- Có card "Tạo list từ" ở đầu
- Tạo topic mới sẽ xuất hiện ngay lập tức
- Cần authentication

#### **Search:**

- Tìm kiếm theo `topic_name` và `description`
- Debounced search (có thể implement sau)
- Clear search để reset

### 6. Database Requirements:

#### **Topics Table cần có data:**

```sql
-- System topics
INSERT INTO topics (topic_name, description, topic_type, is_public, is_active, word_count) VALUES
('Từ vựng tiếng Anh văn phòng', 'Bộ từ vựng cơ bản cho môi trường công sở', 'system', TRUE, TRUE, 536),
('Từ vựng tiếng Anh giao tiếp trung cấp', 'Từ vựng cần thiết cho giao tiếp hàng ngày', 'system', TRUE, TRUE, 798);

-- User topics (sau khi user tạo)
INSERT INTO topics (topic_name, description, topic_type, created_by, is_public, is_active, word_count) VALUES
('My Custom Topic', 'Từ vựng tự tạo', 'user_created', 1, TRUE, TRUE, 0);
```

### 7. Troubleshooting:

#### **Nếu không load được data:**

1. Kiểm tra backend có chạy không
2. Kiểm tra database có data không
3. Kiểm tra network tab trong DevTools
4. Kiểm tra console errors

#### **Nếu search không hoạt động:**

1. Kiểm tra API có nhận được search param không
2. Kiểm tra database query có đúng không
3. Kiểm tra frontend có gửi search query không

#### **Nếu tạo topic không hoạt động:**

1. Kiểm tra user đã đăng nhập chưa
2. Kiểm tra JWT token có hợp lệ không
3. Kiểm tra API endpoint có đúng không
4. Kiểm tra database có insert được không

### 8. Next Steps:

1. **Implement Create Topic API** - Backend endpoint để tạo topic
2. **Add Pagination** - UI pagination cho danh sách topics
3. **Add Topic Detail** - Chi tiết topic và quản lý words
4. **Add Edit/Delete** - Chỉnh sửa và xóa topics
5. **Add Image Upload** - Upload ảnh cho topics
6. **Add Categories** - Phân loại topics theo category
