# Assessment Hooks

## useExamLeaveBlocker

Hook để ngăn người dùng rời khỏi trang thi khi chưa nộp bài.

### Tính năng

- ✅ Ngăn F5 (reload page)
- ✅ Ngăn đóng tab/browser
- ✅ Ngăn navigation trong SPA (click links, buttons)
- ✅ Ngăn back/forward button
- ✅ Tự động gọi hàm nộp bài khi người dùng đồng ý rời trang

### Cách sử dụng

```jsx
import { useExamLeaveBlocker } from "../../../hooks/Assessment/useExamLeaveBlocker";

export default function AssessmentTest() {
  const handleSubmit = async () => {
    // Logic nộp bài
    await submitExam();
  };

  const { customNavigate } = useExamLeaveBlocker(
    true, // Khi nào cần block (true = luôn block)
    "⚠️ Bài kiểm tra chưa được nộp. Bạn có chắc muốn rời khỏi trang không?",
    handleSubmit // Hàm được gọi khi người dùng đồng ý rời trang
  );

  // Sử dụng customNavigate thay vì navigate thông thường
  const handleNavigate = () => {
    customNavigate("/assessmentResult", {
      state: { sessionId: 123 },
    });
  };

  return <div>{/* Component content */}</div>;
}
```

### API

#### Parameters

- `when: boolean` - Khi nào cần block navigation
- `message: string` - Thông báo hiển thị cho người dùng
- `onConfirm: () => void` - Hàm được gọi khi người dùng đồng ý rời trang

#### Returns

- `customNavigate: function` - Function navigate đã được wrap để xử lý confirmation

### Lưu ý

1. **Sử dụng customNavigate**: Thay vì sử dụng `navigate` từ `useNavigate()`, hãy sử dụng `customNavigate` được trả về từ hook.

2. **Xử lý async**: Nếu `onConfirm` là async function, hook sẽ không đợi nó hoàn thành. Hãy đảm bảo logic nộp bài được xử lý đúng cách.

3. **Performance**: Hook sử dụng event delegation để intercept clicks, nên performance tốt ngay cả với nhiều links.

### Ví dụ hoàn chỉnh

```jsx
import React, { useState } from "react";
import { useExamLeaveBlocker } from "../hooks/Assessment/useExamLeaveBlocker";

export default function ExamPage() {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      await submitExam(answers);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const { customNavigate } = useExamLeaveBlocker(
    !isSubmitted, // Chỉ block khi chưa nộp bài
    "⚠️ Bài kiểm tra chưa được nộp. Bạn có chắc muốn rời khỏi trang không?",
    handleSubmit
  );

  return (
    <div>
      <h1>Exam Page</h1>

      {/* Navigation buttons sử dụng customNavigate */}
      <button onClick={() => customNavigate("/home")}>Về trang chủ</button>

      <button onClick={() => customNavigate("/profile")}>Xem profile</button>

      {/* Submit button */}
      <button onClick={handleSubmit}>Nộp bài</button>
    </div>
  );
}
```
