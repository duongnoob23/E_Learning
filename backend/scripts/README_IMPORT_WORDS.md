# Script Import Words từ JSON

Script này dùng để import các từ vựng từ các file JSON trong thư mục `zDesignDB/CrawlData/simple` vào bảng `words` trong database.

## Cách sử dụng

### 1. Chuẩn bị

- Đảm bảo đã có topic trong database (nếu chưa có, tạo topic mới trước)
- Các file JSON phải có cấu trúc đúng format

### 2. Chạy script

```bash
# Từ thư mục root của project
node backend/scripts/importWordsFromJSON.js <topic_id> [folder_path]
```

**Ví dụ:**

```bash
# Import vào topic có ID = 1, dùng đường dẫn mặc định
node backend/scripts/importWordsFromJSON.js 1

# Import vào topic có ID = 2, chỉ định đường dẫn cụ thể
node backend/scripts/importWordsFromJSON.js 2 zDesignDB/CrawlData/simple
```

### 3. Tham số

- `topic_id` (bắt buộc): ID của topic muốn import words vào
- `folder_path` (tùy chọn): Đường dẫn đến thư mục chứa các file JSON. Mặc định: `zDesignDB/CrawlData/simple`

### 4. Mapping dữ liệu

Script sẽ map các trường từ JSON sang database như sau:

| JSON Field | Database Field | Notes |
|------------|---------------|-------|
| `word` | `word` | Tên từ |
| `pos` | `part_of_speech` | Loại từ (được normalize) |
| `phonetic` | `pronunciation` | Phiên âm |
| `audio` | `audio_url` | URL audio |
| `definition` | `definition_en` | Định nghĩa tiếng Anh |
| `meaning_vi` | `meaning_vi` | Nghĩa tiếng Việt (nếu không có thì dùng `definition`) |
| `example_en` | `example_en` | Ví dụ tiếng Anh |
| `example_vi` | `example_vi` | Ví dụ tiếng Việt |
| `image_url` | `image_url` | URL hình ảnh |
| `source_url` | `raw_source_url` | URL nguồn |

### 5. Xử lý dữ liệu

- **Normalize part of speech**: Các dạng viết tắt như "n.", "v.", "adj." sẽ được chuyển thành "noun", "verb", "adjective", etc.
- **Skip words không có meaning_vi**: Nếu từ không có `meaning_vi` và cũng không có `definition`, từ đó sẽ bị bỏ qua
- **Update nếu trùng**: Nếu từ đã tồn tại (theo `word` và `topic_id`), sẽ update thay vì tạo mới
- **Batch processing**: Xử lý từng file một, hiển thị progress mỗi 100 từ

### 6. Kết quả

Script sẽ hiển thị:
- Số từ import/update thành công
- Số từ bị bỏ qua (không có meaning_vi)
- Số từ có lỗi (nếu có)
- Chi tiết lỗi (tối đa 20 lỗi đầu tiên)

### 7. Lưu ý

- Script sẽ tự động kết nối và đóng database connection
- Đảm bảo file `.env` có cấu hình database đúng
- Nếu topic không tồn tại, script sẽ dừng và báo lỗi
- Script sẽ bỏ qua file `test.json` nếu có

### 8. Ví dụ output

```
✓ Database connection established
✓ Topic found: "TOEIC Vocabulary" (ID: 1)
Found 26 JSON files to process
Topic ID: 1

Processing zDesignDB/CrawlData/simple/a.json... (150 words)
  Processed 100/150 words...
  Processed 150/150 words...

Processing zDesignDB/CrawlData/simple/b.json... (200 words)
  ...

============================================================
IMPORT SUMMARY
============================================================
✓ Successfully imported/updated: 4850 words
⊘ Skipped (no meaning_vi): 120 words
✗ Errors: 5 words
============================================================

✓ Database connection closed
```

