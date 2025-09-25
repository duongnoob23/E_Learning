# Test Words API

## API Endpoint mới: Lấy words theo topic_id

### Endpoint: `GET /api/client/word/topics/:topicId/words`

**Path Parameters:**

- `topicId` (required): ID của topic

**Query Parameters:**

- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items per page (default: 20)
- `search` (optional): Tìm kiếm theo word, meaning, example

**Example Request:**

```bash
# Lấy words của topic_id = 1
curl -X GET "http://localhost:3000/api/client/word/topics/1/words?page=1&limit=10&search=meeting"

# Lấy tất cả words của topic_id = 2
curl -X GET "http://localhost:3000/api/client/word/topics/2/words"
```

**Response Format:**

```json
{
  "EM": "Lấy danh sách words thành công",
  "EC": "0",
  "DT": {
    "words": [
      {
        "id": 1,
        "word": "meeting",
        "partOfSpeech": "noun",
        "pronunciation": "/ˈmiːtɪŋ/",
        "meaningVi": "cuộc họp",
        "exampleEn": "We have a meeting at 2 PM today.",
        "exampleVi": "Chúng ta có cuộc họp lúc 2 giờ chiều hôm nay.",
        "imageUrl": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300",
        "notes": "Từ vựng văn phòng cơ bản",
        "wordType": "system",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 10,
      "items_per_page": 10
    }
  }
}
```

## Cách test:

### 1. Thêm dữ liệu mẫu:

```bash
cd backend
# Chạy file SQL để thêm topics
mysql -u username -p database_name < sample-topics-data.sql

# Chạy file SQL để thêm words
mysql -u username -p database_name < sample-words-data.sql
```

### 2. Test API:

```bash
# Test với topic_id = 1 (Từ vựng tiếng Anh văn phòng)
curl -X GET "http://localhost:3000/api/client/word/topics/1/words"

# Test với search
curl -X GET "http://localhost:3000/api/client/word/topics/1/words?search=meeting"

# Test với pagination
curl -X GET "http://localhost:3000/api/client/word/topics/1/words?page=1&limit=5"
```

### 3. Test Frontend:

- Mở trang Flashcard
- Click vào một topic
- Xem danh sách words hiển thị từ database thay vì fake data

## Database Schema:

### Words Table:

```sql
CREATE TABLE words (
  word_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  topic_id BIGINT NOT NULL,
  word VARCHAR(255) NOT NULL,
  part_of_speech VARCHAR(50),
  pronunciation VARCHAR(255),
  meaning_vi TEXT NOT NULL,
  example_en TEXT,
  example_vi TEXT,
  image_url VARCHAR(255),
  notes TEXT,
  word_type ENUM('system', 'user_created') NOT NULL DEFAULT 'system',
  created_by BIGINT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
);
```

## Features đã implement:

### ✅ Backend:

- **Model**: `Word.findByTopicWithPagination()` với search và pagination
- **Service**: `getWordsByTopicId()` với error handling
- **Controller**: `getWordsByTopicId()` với validation
- **Route**: `GET /word/topics/:topicId/words`

### ✅ Frontend:

- **API**: `flashcardApi.getWordsByTopic()`
- **Hook**: `useWordsByTopic()` với React Query
- **Caching**: 2 phút stale time, 5 phút cache time
- **Error Handling**: Toast notifications

### ✅ Features:

- **Pagination**: Hỗ trợ phân trang
- **Search**: Tìm kiếm theo word, meaning, example
- **Filtering**: Chỉ lấy words active
- **Sorting**: Sắp xếp theo word A-Z
- **Error Handling**: Xử lý lỗi đầy đủ

## Next Steps:

1. **Tích hợp vào FlashcardDetail component** - Hiển thị words thay vì fake data
2. **Thêm UI cho search words** - Search bar trong trang chi tiết
3. **Thêm pagination UI** - Phân trang cho danh sách words
4. **Thêm word detail modal** - Xem chi tiết từng word
5. **Thêm word management** - Thêm/sửa/xóa words
