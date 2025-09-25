# Test Random Button Functionality

## 🔍 **Debug Steps:**

### **1. Kiểm tra Console Logs:**

Mở DevTools (F12) → Console tab và kiểm tra:

```javascript
// Khi click nút "Xem ngẫu nhiên", bạn sẽ thấy:
"Random view clicked, words length: X";
"Random index: Y";
"Words data: {...}";
"Words array: [...]";
"Current word index: Z";
"Current word: {...}";
```

### **2. Kiểm tra API Response:**

- Mở Network tab trong DevTools
- Click vào topic để vào FlashcardDetail
- Tìm request `GET /api/client/word/topics/:topicId/words`
- Kiểm tra response có chứa `words` array không

### **3. Kiểm tra State Updates:**

- Click nút "Xem ngẫu nhiên"
- Kiểm tra `currentWordIndex` có thay đổi không
- Kiểm tra `currentWord` có cập nhật không

## 🐛 **Troubleshooting:**

### **Nếu words.length = 0:**

1. Kiểm tra API có trả về data không
2. Kiểm tra database có words không
3. Kiểm tra topic_id có đúng không

### **Nếu words.length > 0 nhưng nút không hoạt động:**

1. Kiểm tra `handleRandomView` có được gọi không
2. Kiểm tra `setCurrentWordIndex` có hoạt động không
3. Kiểm tra `currentWord` có cập nhật không

### **Nếu random index không thay đổi:**

1. Kiểm tra `Math.random()` có hoạt động không
2. Kiểm tra `words.length` có đúng không
3. Kiểm tra state update có bị block không

## 🧪 **Test Cases:**

### **Test 1: Basic Functionality**

1. Vào FlashcardDetail với topic có words
2. Click "Xem ngẫu nhiên"
3. Kiểm tra từ vựng có thay đổi không

### **Test 2: Multiple Clicks**

1. Click "Xem ngẫu nhiên" nhiều lần
2. Kiểm tra mỗi lần click có từ vựng khác nhau không

### **Test 3: Edge Cases**

1. Topic chỉ có 1 từ → Click random → Vẫn hiển thị từ đó
2. Topic không có từ → Nút disabled
3. Đang ở từ cuối → Click random → Có thể chuyển về từ đầu

## 🔧 **Expected Behavior:**

### **✅ Working:**

- Click nút → Từ vựng thay đổi ngẫu nhiên
- Console logs hiển thị đúng
- Nút disabled khi không có words
- Tooltip hiển thị khi hover

### **❌ Not Working:**

- Click nút → Không có gì xảy ra
- Console logs không hiển thị
- Nút không disabled khi cần
- Từ vựng không thay đổi

## 📝 **Debug Commands:**

```javascript
// Trong Console, test thủ công:
// 1. Kiểm tra words array
console.log("Words:", words);

// 2. Test random function
const randomIndex = Math.floor(Math.random() * words.length);
console.log("Random index:", randomIndex);

// 3. Test state update
setCurrentWordIndex(randomIndex);
```

## 🚀 **Quick Fix:**

Nếu vẫn không hoạt động, thử thay thế `handleRandomView`:

```javascript
const handleRandomView = () => {
  console.log("Random view clicked, words length:", words.length);
  if (words && words.length > 0) {
    const randomIndex = Math.floor(Math.random() * words.length);
    console.log("Random index:", randomIndex);
    setCurrentWordIndex(randomIndex);
    setShowDefinition(false);
  } else {
    console.log("No words available for random view");
    alert("Chưa có từ vựng để xem ngẫu nhiên");
  }
};
```

## ✅ **Success Criteria:**

- [ ] Nút "Xem ngẫu nhiên" click được
- [ ] Console logs hiển thị đúng
- [ ] Từ vựng thay đổi khi click
- [ ] Nút disabled khi không có words
- [ ] Tooltip hiển thị đúng
