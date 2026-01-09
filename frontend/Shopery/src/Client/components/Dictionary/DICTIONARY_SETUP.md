# Hướng dẫn Setup Dictionary Component

## Tổng quan

Dictionary component đã được tích hợp vào Header với UI giống Study4. Component này cho phép tra từ vựng từ các file flashcard JSON.

## Cấu trúc Component

```
src/Client/components/Dictionary/
├── Dictionary.jsx          # Component chính
├── Dictionary.css          # Styles
├── useDictionary.js        # Hook quản lý state
└── DICTIONARY_SETUP.md     # File hướng dẫn này
```

## Cách Setup Dữ liệu

Có 2 cách để load dữ liệu flashcard:

### Cách 1: Copy file vào Public folder (Khuyến nghị cho development)

1. Copy thư mục `zDesignDB/CrawlData/study4_data/` vào `public/`:
   ```
   public/
   └── zDesignDB/
       └── CrawlData/
           └── study4_data/
               ├── file-flashcard-45101.json
               ├── file-flashcard-45102.json
               └── ...
   ```

2. Service sẽ tự động load từ đường dẫn: `/zDesignDB/CrawlData/study4_data/file-flashcard-XXXXX.json`

### Cách 2: Tạo API Endpoint (Khuyến nghị cho production)

1. Tạo API endpoint để serve dữ liệu flashcard:
   ```javascript
   // Backend API endpoint
   GET /api/dictionary/flashcards/:fileId
   ```

2. Cập nhật `dictionaryService.js` để sử dụng API:
   ```javascript
   const response = await fetch(`/api/dictionary/flashcards/${fileId}`);
   ```

## Tính năng

### 1. Tabs
- **Anh-Việt**: Tra từ Anh-Việt (mặc định)
- **Thesaurus**: Từ đồng nghĩa (có thể mở rộng sau)
- **Tiếng Trung**: Tra từ tiếng Trung (có thể mở rộng sau)

### 2. Chế độ dịch
- **ANH VIỆT**: Tìm từ tiếng Anh, hiển thị nghĩa tiếng Việt
- **VIỆT ANH**: Tìm từ tiếng Việt, hiển thị từ tiếng Anh
- **ANH ANH**: Tìm từ tiếng Anh, hiển thị nghĩa tiếng Anh

### 3. Tìm kiếm
- Auto-search khi nhập (debounce 300ms)
- Hỗ trợ tìm kiếm theo từ khóa
- Sắp xếp kết quả: khớp chính xác lên đầu
- Giới hạn 20 kết quả

### 4. Hiển thị kết quả
- Từ vựng với phát âm IPA
- Loại từ (noun, verb, adjective, adverb)
- Nghĩa tiếng Việt và tiếng Anh
- Câu ví dụ và bản dịch
- Hình ảnh minh họa (nếu có)
- Audio phát âm (nếu có)

## Sử dụng

### Mở Dictionary
- Click vào icon Dictionary (📖) trong Header
- Hoặc gọi `dictionary.openDictionary()` từ code

### Đóng Dictionary
- Click nút X ở góc trên bên phải
- Hoặc click bên ngoài dictionary (nếu có backdrop)

### Thu nhỏ/Mở rộng
- Click nút minimize để thu nhỏ dictionary
- Dictionary sẽ chỉ hiển thị một phần nhỏ bên phải màn hình

## Customization

### Thay đổi màu sắc
Chỉnh sửa trong `Dictionary.css`:
- Màu xanh title bar: `.dictionary-title-bar` (background: #3b82f6)
- Màu vàng nút mode: `.dictionary-mode-btn` (background: #fef3c7)

### Thay đổi kích thước
Chỉnh sửa trong `Dictionary.css`:
- Width: `.dictionary-container` (width: 400px)
- Height: Tự động 100vh

### Thêm tính năng mới
1. **Thesaurus**: Thêm logic tìm từ đồng nghĩa trong `dictionaryService.js`
2. **Tiếng Trung**: Thêm dữ liệu và logic tra từ tiếng Trung
3. **Lịch sử tra từ**: Lưu vào localStorage
4. **Yêu thích**: Thêm chức năng lưu từ yêu thích

## Troubleshooting

### Không load được dữ liệu
1. Kiểm tra đường dẫn file trong `dictionaryService.js`
2. Kiểm tra file có tồn tại trong public folder không
3. Kiểm tra console để xem lỗi cụ thể

### Kết quả tìm kiếm không chính xác
1. Kiểm tra dữ liệu trong file JSON có đúng format không
2. Kiểm tra logic search trong `dictionaryService.js`

### Dictionary không hiển thị
1. Kiểm tra `isOpen` state trong `useDictionary` hook
2. Kiểm tra CSS z-index (phải cao hơn các element khác)
3. Kiểm tra console để xem lỗi

## Performance

- Dữ liệu được cache sau lần load đầu tiên
- Auto-search có debounce để tránh quá nhiều request
- Giới hạn số lượng kết quả để tối ưu hiển thị

## Tương lai

- [ ] Thêm tính năng Thesaurus
- [ ] Thêm tính năng tra từ Tiếng Trung
- [ ] Lưu lịch sử tra từ
- [ ] Thêm từ vào danh sách yêu thích
- [ ] Tích hợp với API backend
- [ ] Thêm tính năng phát âm offline
- [ ] Export kết quả tra từ
