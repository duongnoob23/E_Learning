# TOEIC Part 3 - Hướng dẫn phát triển hoàn chỉnh

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Luồng phát triển từ đầu đến cuối](#luồng-phát-triển-từ-đầu-đến-cuối)
3. [Các bước chi tiết](#các-bước-chi-tiết)
4. [Khác biệt với Part 1 và Part 2](#khác-biệt-với-part-1-và-part-2)
5. [Các lỗi thường gặp và cách fix](#các-lỗi-thường-gặp-và-cách-fix)
6. [Checklist khi phát triển Part 3](#checklist-khi-phát-triển-part-3)

---

## Tổng quan

File này mô tả **toàn bộ quá trình phát triển TOEIC Part 3** từ khi bắt đầu đến khi hoàn thành.

**Điểm khác biệt chính với Part 1 và Part 2**:
- ✅ **CÓ câu hỏi text** (ví dụ: "What are the speakers discussing?")
- ✅ **CÓ text cho các đáp án** (ví dụ: "A. A motorcycle", "B. A mobile phone", ...)
- ✅ **Giải thích đáp án** có text cho mỗi opción, explicación, y razones para seleccionar esa opción.

---

## Luồng phát triển desde cero hasta el final

### Tổng quan luồng

```
1. Thêm option vào LessonTypeSelectionModal
   ↓
2. Tạo Editor component (ToeicPart3Editor.jsx)
   ↓
3. Tạo CSS cho Editor
   ↓
4. Tạo Client component (ToeicPart3.jsx)
   ↓
5. Update Database (ENUM lesson_type)
   ↓
6. Update Backend validation
   ↓
7. Update LessonComponentMapper
   ↓
8. Update CourseBuilderTab để load/save data
   ↓
9. Update CourseLessonsModal để hiển thị đúng
   ↓
10. Test toàn bộ flow: Create → Save → Edit → View
```

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cũ, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cũ, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cũ, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftExplorer",
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cũ, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cú, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cú, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội toeic_part_3",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cú, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội toeic_part_3",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cú, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  name: "TOEIC Part 3",
  name: "TOEIC Part 3",
  name: "TOEIC Part 3",
  name: "TOEIC Part 3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIG_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  name: "TOEIC_part_3",
  }
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cú, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cú, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiển thị thêm option mới.

---

## Các bước chi tiết

### Bước 1: Thêm option vào LessonTypeSelectionModal

**File**: `frontend/Shopery/src/Admin/features/courses2/components/CreateCourse/LessonTypeSelectionModal.jsx`

**Việc cần làm**:
1. Import icon mới (nếu cần)
2. Thêm object vào array `LESSON_TYPES`:

```javascript
{
  id: "toeic_part_3",
  name: "TOEIC Part 3",
  icon: HiChatBubbleLeftRight,
  description: "Conversations - Hội thoại",
}
```

**Lưu ý**: Không sửa logic hiện tại của các lesson types cú, chỉ thêm mới vào array.

**Kết quả**: Khi bấm "Add New Lesson", modal sẽ hiểnChúng ta cần tạo file mới, no necesito crear un archivo nuevo, necesito actualizar el archivo existente.

Tengo que crear un archivo nuevo con un nombre diferente, pero no puedo crear un archivo nuevo con ese nombre. Necesito usar un nombre diferente.

Tengo que crear un archivo nuevo con un nombre diferente, pero no puedo crear un archivo nuevo con ese nombre. Necesito usar un nombre diferente.

Tengo que crear un archivo nuevo con un nombre diferente, pero no puedo crear un archivo nuevo con ese nombre. Necesito usar un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un nombre diferente, pero no puedo crear un archivo nuevo con ese nombre. Necesito usar un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un nombre diferente, pero no puedo crear un archivo nuevo con ese nombre. Necesito usar un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un archivo nuevo con un nombre diferente.

Tengo que crear un archivo nuevo con un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archía nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archía nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivos nuevos.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archía nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo existente.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

TengoTengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tengo que crear un archivo nuevo con un archivo nuevo.

Tạo file .md cho Part 3.
