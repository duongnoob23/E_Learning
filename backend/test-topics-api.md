# Test API Topics cho Flashcard

## 1. API Lấy Topics cho phần Khám phá

### Endpoint: `GET /api/client/words/topics/explore`

**Query Parameters:**

- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items per page (default: 12)
- `search` (optional): Tìm kiếm theo tên hoặc mô tả
- `topic_type` (optional): Loại topic (default: 'system')

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/client/words/topics/explore?page=1&limit=12&search=tiếng anh&topic_type=system"
```

**Response Format:**

```json
{
  "EM": "Lấy danh sách topics thành công",
  "EC": "0",
  "DT": {
    "topics": [
      {
        "id": 1,
        "title": "Từ vựng tiếng Anh văn phòng",
        "description": "Bộ từ vựng cơ bản cho môi trường công sở",
        "wordCount": 536,
        "viewCount": 0,
        "logo": "/images/study4-logo.png",
        "image": "https://example.com/image.jpg",
        "category": "system",
        "difficulty": "intermediate",
        "isPublic": true,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 50,
      "items_per_page": 12
    }
  }
}
```

## 2. API Lấy Topics của User (List từ của tôi)

### Endpoint: `GET /api/client/words/topics/user`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items per page (default: 12)
- `search` (optional): Tìm kiếm theo tên hoặc mô tả

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/client/words/topics/user?page=1&limit=12&search=my topic" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Format:**

```json
{
  "EM": "Lấy danh sách topics của user thành công",
  "EC": "0",
  "DT": {
    "topics": [
      {
        "id": 2,
        "title": "My Custom Topic",
        "description": "Từ vựng tự tạo",
        "wordCount": 25,
        "viewCount": 0,
        "logo": "/images/study4-logo.png",
        "image": null,
        "category": "user_created",
        "difficulty": "beginner",
        "isUserCreated": true,
        "isPublic": true,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 1,
      "items_per_page": 12
    }
  }
}
```

## 3. Database Schema

### Topics Table:

```sql
CREATE TABLE topics (
  topic_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  topic_name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  logo_url VARCHAR(255),
  topic_type ENUM('system', 'user_created') NOT NULL,
  created_by BIGINT,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  word_count INT NOT NULL DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME
);
```

## 4. Sample Data

```sql
INSERT INTO topics (topic_name, description, image_url, logo_url, topic_type, created_by, is_public, is_active, word_count, created_at, updated_at) VALUES
('Từ vựng tiếng Anh văn phòng', 'Bộ từ vựng cơ bản cho môi trường công sở', 'https://example.com/office.jpg', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 536, NOW(), NOW()),
('Từ vựng tiếng Anh giao tiếp trung cấp', 'Từ vựng cần thiết cho giao tiếp hàng ngày', 'https://example.com/communication.jpg', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 798, NOW(), NOW()),
('Từ vựng Tiếng Anh giao tiếp cơ bản', 'Những từ vựng cơ bản nhất cho người mới bắt đầu', 'https://example.com/basic.jpg', '/images/study4-logo.png', 'system', NULL, TRUE, TRUE, 993, NOW(), NOW());
```

## 5. Error Responses

### 401 Unauthorized (cho /topics/user):

```json
{
  "EM": "Chưa đăng nhập",
  "EC": "1",
  "DT": null
}
```

### 500 Internal Server Error:

```json
{
  "EM": "Có lỗi xảy ra trong quá trình lấy danh sách topics",
  "EC": "-2",
  "DT": null
}
```
