# Giải pháp: Ngăn người dùng rời khỏi trang thi khi chưa nộp bài

## 🎯 Vấn đề đã giải quyết

Trước đây, ứng dụng chỉ có thể ngăn F5/đóng tab bằng `beforeunload`, nhưng không thể ngăn SPA navigation (chuyển route trong app).

## ✅ Giải pháp hoàn chỉnh

### 1. Hook `useExamLeaveBlocker`

**File**: `frontend/Shopery/src/Client/hooks/Assessment/useExamLeaveBlocker.js`

**Tính năng**:

- ✅ Ngăn F5 (reload page)
- ✅ Ngăn đóng tab/browser
- ✅ Ngăn SPA navigation (click links, buttons)
- ✅ Ngăn back/forward button
- ✅ Tự động gọi hàm nộp bài khi người dùng đồng ý rời trang

### 2. Cách sử dụng trong AssessmentTest.jsx

```jsx
import { useExamLeaveBlocker } from "../../../hooks/Assessment/useExamLeaveBlocker";

export default function AssessmentTest() {
  const handleSubmit = async () => {
    // Logic nộp bài
    await submitExam();
  };

  const { customNavigate } = useExamLeaveBlocker(
    true, // Luôn block khi chưa nộp bài
    "⚠️ Bài kiểm tra chưa được nộp. Bạn có chắc muốn rời khỏi trang không?",
    handleSubmit // Hàm nộp bài
  );

  // Sử dụng customNavigate thay vì navigate
  const handleNavigate = () => {
    customNavigate("/assessmentResult", { state: {...} });
  };
}
```

## 🔧 Cách hoạt động

### 1. Xử lý beforeunload (F5, đóng tab)

```javascript
const handleBeforeUnload = (event) => {
  event.preventDefault();
  event.returnValue = message;
  return message;
};
```

### 2. Xử lý popstate (back/forward button)

```javascript
const handlePopState = (event) => {
  const confirmLeave = window.confirm(message);
  if (confirmLeave) {
    onConfirm(); // Gọi hàm nộp bài
  } else {
    // Ngăn navigation
    window.history.pushState(null, "", location.pathname);
  }
};
```

### 3. Xử lý click events (links, buttons)

```javascript
const handleClick = (event) => {
  const target = event.target.closest("a[href], button[data-navigate]");
  if (target) {
    event.preventDefault();
    const confirmLeave = window.confirm(message);
    if (confirmLeave) {
      onConfirm(); // Gọi hàm nộp bài
      navigate(target.href);
    }
  }
};
```

## 📁 Files đã tạo/cập nhật

### Files mới:

1. `useExamLeaveBlocker.js` - Hook chính
2. `TestNavigationBlocker.jsx` - Component test
3. `README.md` - Hướng dẫn sử dụng
4. `SOLUTION_SUMMARY.md` - Tổng kết giải pháp

### Files đã cập nhật:

1. `AssessmentTest.jsx` - Sử dụng hook mới
2. `useRouteLeavePrompt.js` - Cập nhật (backup)

## 🧪 Cách test

### 1. Sử dụng TestNavigationBlocker component:

```jsx
import TestNavigationBlocker from "./TestNavigationBlocker";

// Thêm route test
<Route path="/test-navigation" element={<TestNavigationBlocker />} />;
```

### 2. Test cases:

- ✅ F5 (reload page)
- ✅ Đóng tab/browser
- ✅ Click links trong app
- ✅ Click buttons navigation
- ✅ Back/forward button
- ✅ Nhập URL khác vào address bar

## 🚀 Ưu điểm của giải pháp

1. **Tương thích**: Hoạt động với React Router v7 và BrowserRouter
2. **Toàn diện**: Xử lý tất cả các trường hợp navigation
3. **Performance**: Sử dụng event delegation, không ảnh hưởng performance
4. **Dễ sử dụng**: Chỉ cần wrap component và sử dụng customNavigate
5. **Linh hoạt**: Có thể bật/tắt block dựa trên điều kiện

## ⚠️ Lưu ý quan trọng

1. **Sử dụng customNavigate**: Thay vì `navigate()`, phải dùng `customNavigate()`
2. **Async handling**: Hook không đợi onConfirm hoàn thành
3. **Event cleanup**: Hook tự động cleanup events khi unmount
4. **Browser compatibility**: Hoạt động trên tất cả browser hiện đại

## 🔄 Migration từ giải pháp cũ

```jsx
// Cũ
import { useRouteLeavePrompt } from "./useRouteLeavePrompt";
useRouteLeavePrompt(true, message, handleSubmit);

// Mới
import { useExamLeaveBlocker } from "./useExamLeaveBlocker";
const { customNavigate } = useExamLeaveBlocker(true, message, handleSubmit);
```

## 📊 Kết quả

- ✅ Ngăn được F5/đóng tab (beforeunload)
- ✅ Ngăn được SPA navigation (click events)
- ✅ Ngăn được back/forward button (popstate)
- ✅ Tự động nộp bài khi người dùng đồng ý rời trang
- ✅ Không cần thay đổi cấu trúc Router hiện tại
- ✅ Tương thích với React Router v7
