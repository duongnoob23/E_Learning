# HƯỚNG DẪN TRIỂN KHAI - LUỒNG TẠO MỚI BÀI THI VÀ ASSIGNMENT

## 📋 TỔNG QUAN

Tài liệu này mô tả các file đã được tạo để triển khai luồng tạo mới bài thi (Exam) và Assignment.

---

## 🎯 CÁC FILE ĐÃ TẠO

### Frontend - Exam Components

#### 1. ExamInfoTab
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/ExamInfoTab.jsx`
- **Mô tả**: Component form nhập thông tin chi tiết bài thi
- **Chức năng**: 
  - Nhập tiêu đề, mô tả, loại bài thi, thời gian, mức độ khó
  - Validation các trường bắt buộc

#### 2. ExamTypeSelectionModal
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/ExamTypeSelectionModal.jsx`
- **Mô tả**: Modal chọn loại bài thi
- **Chức năng**: 
  - Hiển thị 3 options: Listening & Reading, Speaking, Writing
  - Cho phép chọn và lưu loại bài thi

#### 3. ExamBuilderTab
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/ExamBuilderTab.jsx`
- **Mô tả**: Component chính quản lý các tab tạo bài thi
- **Chức năng**: 
  - Quản lý 3 tab: Thông tin, Chọn loại, Tạo nội dung
  - Điều hướng giữa các tab

#### 4. ExamContentBuilder
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/ExamContentBuilder.jsx`
- **Mô tả**: Component quản lý việc tạo nội dung (Parts)
- **Chức năng**: 
  - Hiển thị danh sách Parts
  - Thêm/sửa/xóa Parts

#### 5. PartList
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/PartList.jsx`
- **Mô tả**: Component hiển thị danh sách Parts
- **Chức năng**: Hiển thị thông tin các Parts đã tạo

#### 6. PartEditor
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/PartEditor.jsx`
- **Mô tả**: Modal tạo/sửa Part
- **Chức năng**: 
  - Nhập thông tin Part (số thứ tự, tên, loại, thời gian, mô tả)
  - Mở QuestionEditor để tạo questions

#### 7. QuestionEditor
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/QuestionEditor.jsx`
- **Mô tả**: Component router chọn editor phù hợp
- **Chức năng**: 
  - Chọn editor dựa trên partType
  - Listening/Reading → ListeningReadingQuestionEditor
  - Speaking → SpeakingQuestionEditor
  - Writing → WritingQuestionEditor

#### 8. ListeningReadingQuestionEditor
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/ListeningReadingQuestionEditor.jsx`
- **Mô tả**: Editor tạo questions cho Listening & Reading
- **Chức năng**: 
  - Tạo questions với choices (A, B, C, D)
  - Upload audio, image
  - Nhập transcript, explanation

#### 9. SpeakingQuestionEditor
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/SpeakingQuestionEditor.jsx`
- **Mô tả**: Editor tạo questions cho Speaking
- **Chức năng**: 
  - Tạo questions không có choices
  - Upload audio mẫu
  - Nhập transcript, hướng dẫn

#### 10. WritingQuestionEditor
- **File**: `frontend/Shopery/src/Admin/features/exams/components/CreateExam/WritingQuestionEditor.jsx`
- **Mô tả**: Editor tạo questions cho Writing
- **Chức năng**: 
  - Tạo questions không có choices
  - Upload image (optional)
  - Nhập hướng dẫn, yêu cầu

### Backend - Exam API

#### 1. examAdminService.js (đã cập nhật)
- **File**: `backend/src/admin/services/examAdminService.js`
- **Chức năng mới**: 
  - `createFullExam()`: Tạo toàn bộ bài thi (Test + Parts + Questions + Choices)

#### 2. examAdminController.js (đã cập nhật)
- **File**: `backend/src/admin/controllers/examAdminController.js`
- **Chức năng mới**: 
  - `createFullExam()`: Controller xử lý request tạo toàn bộ bài thi

#### 3. examAdminRoutes.js (đã cập nhật)
- **File**: `backend/src/admin/routes/examAdminRoutes.js`
- **Route mới**: 
  - `POST /api/admin/tests/full`: Tạo toàn bộ bài thi

---

## 🔄 LUỒNG SỬ DỤNG

### 1. Tạo bài thi mới

```
1. Admin mở trang tạo bài thi
2. Tab "Thông tin bài thi":
   - Nhập tiêu đề, mô tả, loại bài thi, thời gian, mức độ khó
   - Click "Tiếp theo"
3. Tab "Chọn loại bài thi":
   - Chọn một trong 3 loại: Listening & Reading, Speaking, Writing
   - Click "Tiếp theo"
4. Tab "Tạo nội dung":
   - Click "Thêm Part"
   - Nhập thông tin Part
   - Click "Tạo Questions"
   - Tạo questions trong editor phù hợp
   - Lưu Part
   - Lặp lại cho các Part khác
5. Click "Lưu bài thi"
6. Frontend gọi API: POST /api/admin/tests/full
7. Backend tạo toàn bộ vào database
```

### 2. API Request Format

```javascript
POST /api/admin/tests/full
Headers: {
  Authorization: "Bearer <token>"
}
Body: {
  testInfo: {
    title: "TOEIC Practice Test 1",
    description: "Mô tả bài thi...",
    exam_type: "TOEIC",
    total_duration: 120,
    difficulty_level: "MEDIUM"
  },
  parts: [
    {
      part_number: 1,
      part_name: "Part 1: Picture Description",
      part_type: "LISTENING",
      duration_minutes: 5,
      description: "Mô tả Part 1...",
      questions: [
        {
          question_number: 1,
          question_text: "Câu hỏi 1",
          question_type: "MULTIPLE_CHOICE",
          audio_file: "https://...",
          image_file: "https://...",
          transcript: "...",
          explanation: "...",
          choices: [
            {
              choice_letter: "A",
              choice_text: "Đáp án A",
              is_correct: true
            },
            // B, C, D...
          ]
        }
        // ... more questions
      ]
    }
    // ... more parts
  ]
}
```

---

## 📝 GHI CHÚ QUAN TRỌNG

1. **Validation**: Tất cả các trường bắt buộc phải được validate ở cả frontend và backend
2. **Error Handling**: Các component đều có xử lý lỗi và hiển thị thông báo phù hợp
3. **State Management**: Sử dụng React state để quản lý dữ liệu, push changes lên parent component
4. **Database**: Đảm bảo foreign key constraints được thiết lập đúng
5. **Authentication**: Tất cả API đều yêu cầu authentication và authorization (admin/teacher)

---

## 🚀 BƯỚC TIẾP THEO

1. **Tích hợp vào trang Admin**: Tạo page để sử dụng ExamBuilderTab
2. **Tạo Assignment Builder**: Tương tự Exam nhưng đơn giản hơn (không có Parts, chỉ có Questions)
3. **Testing**: Test toàn bộ luồng tạo bài thi
4. **UI/UX Improvements**: Cải thiện giao diện và trải nghiệm người dùng

---

**Ngày tạo**: 2024-12-XX  
**Phiên bản**: 1.0.0

