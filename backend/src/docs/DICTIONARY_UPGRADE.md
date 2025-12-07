# 📚 Dictionary Upgrade - Tài liệu nâng cấp từ điển

## 🎯 Tổng quan

Từ điển đã được nâng cấp với các tính năng mới và tối ưu hiệu năng.

## ✨ Tính năng mới

### 1. **Multiple Meanings Support**
- Tự động parse nhiều nghĩa từ `meaning_vi`
- Hỗ trợ format: `"1. nghĩa 1; 2. nghĩa 2"` hoặc `"nghĩa 1, nghĩa 2"`
- Hiển thị đầy đủ các nghĩa trong kết quả

### 2. **Audio & Image Support**
- Hỗ trợ phát âm với `audio_url`
- Hiển thị hình ảnh minh họa với `image_url`
- Tự động load từ database

### 3. **English Definition**
- Sử dụng `definition_en` cho định nghĩa tiếng Anh
- Hỗ trợ tra từ Anh-Anh (có thể mở rộng)

### 4. **Smart Suggestions**
- Tự động đề xuất từ gần đúng khi không tìm thấy
- Suggestions cho Việt-Anh với preview nghĩa

### 5. **Related Words**
- Tìm từ liên quan cùng part_of_speech
- Có thể mở rộng tìm theo topic

## 📊 Cấu trúc Database

```sql
CREATE TABLE words (
  word_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  topic_id BIGINT UNSIGNED NOT NULL,
  word VARCHAR(255) NOT NULL,
  part_of_speech VARCHAR(50),
  pronunciation VARCHAR(255),
  meaning_vi TEXT NOT NULL,
  definition_en TEXT,              -- ✨ MỚI
  example_en TEXT,
  example_vi TEXT,
  image_url VARCHAR(255),
  audio_url VARCHAR(500),          -- ✨ MỚI
  raw_source_url VARCHAR(500),     -- ✨ MỚI
  word_type ENUM('system','user_created') DEFAULT 'system',
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 API Endpoints

### Tra từ Anh-Việt
```
GET /dictionary/search?word=hello&type=en-vi
```

**Response:**
```json
{
  "EM": "Tra từ thành công",
  "EC": "0",
  "DT": {
    "word": "hello",
    "phonetic": "/həˈloʊ/",
    "meanings": [{
      "partOfSpeech": "noun",
      "definitions": [
        {
          "definition": "lời chào",
          "example": "Hello, how are you?",
          "exampleVi": "Xin chào, bạn khỏe không?"
        }
      ]
    }],
    "audio": "https://...",
    "image": "https://...",
    "definitionEn": "a greeting",
    "source": "https://..."
  }
}
```

### Tra từ Việt-Anh
```
GET /dictionary/search?word=xin chào&type=vi-en
```

**Response:**
```json
{
  "EM": "Tra từ thành công",
  "EC": "0",
  "DT": {
    "word": "hello",
    "phonetic": "/həˈloʊ/",
    "meanings": [...],
    "suggestions": [
      {
        "word": "greeting",
        "meaning": "lời chào hỏi..."
      }
    ]
  }
}
```

## 🔧 Model Methods

### Word Model - Methods mới

```javascript
// Tìm từ chính xác (case-insensitive)
Word.findExactWord(word)

// Tìm trong nghĩa tiếng Việt
Word.searchInMeaning(searchTerm)

// Tìm kiếm từ (partial match)
Word.searchWord(searchTerm)
```

## ⚡ Performance Optimization

### Indexes đã thêm:
- `idx_words_word` - Tìm kiếm theo word
- `idx_words_word_lower` - Case-insensitive search
- `ft_meaning_vi` - Full-text search trong nghĩa
- `ft_word` - Full-text search trong từ
- `idx_words_active_word` - Composite index

### Chạy migration:
```bash
mysql -u root -p e_learnning6 < backend/src/migrations/upgrade_dictionary.sql
```

## 📝 Format meaning_vi

Hỗ trợ các format:

1. **Numbered format:**
   ```
   "1. nghĩa đầu tiên; 2. nghĩa thứ hai; 3. nghĩa thứ ba"
   ```

2. **Comma separated:**
   ```
   "nghĩa một, nghĩa hai, nghĩa ba"
   ```

3. **Semicolon separated:**
   ```
   "nghĩa một; nghĩa hai; nghĩa ba"
   ```

4. **Single meaning:**
   ```
   "một nghĩa duy nhất"
   ```

## 🎨 Frontend Integration

### DictionaryResult Component
Component đã được cập nhật để hiển thị:
- Multiple definitions
- Audio playback button
- Image display
- Suggestions list

### Example Usage:
```jsx
<DictionaryResult 
  data={data} 
  type={type}
  onPlayAudio={(url) => playAudio(url)}
/>
```

## 🔮 Future Enhancements

1. **Fuzzy Search** - Tìm từ khi gõ sai chính tả
2. **Word Frequency** - Thống kê từ thường tra
3. **User History** - Lịch sử tra từ của user
4. **Favorites** - Đánh dấu từ yêu thích
5. **Flashcard Integration** - Tích hợp với flashcard system
6. **Pronunciation Practice** - Luyện phát âm với audio

## 📚 Related Files

- `backend/src/models/Word.js` - Word model
- `backend/src/client/services/dictionaryClientService.js` - Dictionary service
- `backend/src/client/controllers/dictionaryClientController.js` - Controller
- `backend/src/client/routes/dictionaryClientRoutes.js` - Routes
- `frontend/Shopery/src/common/components/Dictionary/` - Frontend components

