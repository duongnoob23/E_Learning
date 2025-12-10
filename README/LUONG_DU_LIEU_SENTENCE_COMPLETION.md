# 📋 Tài Liệu Giải Thích Luồng Dữ Liệu: Sentence Completion

## 🎯 Tổng Quan

Tài liệu này giải thích chi tiết luồng dữ liệu của bài tập **Sentence Completion** (Hoàn thiện câu) từ trang Test xuống Editor và Component hiển thị cho học viên.

---

## 📊 Sơ Đồ Luồng Dữ Liệu

```
Test.jsx (Dữ liệu mẫu)
    ↓
LessonStudio.jsx (Quản lý editor)
    ↓
VisualEditor.jsx (Router editor)
    ↓
SentenceCompletionEditor.jsx (Editor tạo bài tập)
    ↓
onChange → LessonStudio → onSave
    ↓
[Lưu vào database]
    ↓
LessonComponentMapper.jsx (Map component)
    ↓
VocabularySentenceCompletion.jsx (Hiển thị cho học viên)
```

---

## 🔍 Chi Tiết Từng Bước

### 1️⃣ **Test.jsx** - Trang Test với Dữ Liệu Mẫu

**Vị trí:** `frontend/Shopery/src/Client/pages/Test/Test.jsx`

**Chức năng:**
- Chứa dữ liệu mẫu (`TEST_LESSONS`) cho tất cả loại bài tập
- Cho phép chuyển đổi giữa tab "Bài Tập" (preview) và "Lesson Studio" (editor)

**Dữ liệu mẫu cho Sentence Completion:**

```javascript
{
  lesson_id: 7,
  title: "Hoàn thiện câu: Cảm xúc",
  lesson_type: "vocabulary_sentence_completion",
  lesson_data: {
    type: "vocabulary_sentence_completion",
    questions: [
      {
        vi_text: "đừng cắn nhiều hơn bạn có thể nhai",
        sentence_template: "don't {blank1} {blank2} {blank3} {blank4} {blank5} {blank6} chew",
        shuffled_words: [
          { id: 1, text: "bite" },
          { id: 2, text: "off" },
          { id: 3, text: "more" },
          { id: 4, text: "than" },
          { id: 5, text: "you" },
          { id: 6, text: "can" },
        ],
        blanks: [
          { id: "blank1", correct_word_id: 1 },
          { id: "blank2", correct_word_id: 2 },
          { id: "blank3", correct_word_id: 3 },
          { id: "blank4", correct_word_id: 4 },
          { id: "blank5", correct_word_id: 5 },
          { id: "blank6", correct_word_id: 6 },
        ],
      },
      // ... các câu hỏi khác
    ],
  },
}
```

**Luồng dữ liệu:**
- Khi chọn tab "Lesson Studio": Truyền `lessonType` và `initialData` vào `LessonStudio`
- Khi chọn tab "Bài Tập": Truyền `lesson` vào `renderLessonComponent()`

---

### 2️⃣ **LessonStudio.jsx** - Component Quản Lý Editor

**Vị trí:** `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`

**Chức năng:**
- Quản lý state của `lessonData`
- Cung cấp toolbar (Templates, Import/Export JSON, Save)
- Render `VisualEditor` với `lessonType` và `data`

**Props nhận vào:**
```javascript
{
  lessonType: "vocabulary_sentence_completion",
  initialData: { /* dữ liệu từ Test.jsx */ },
  onSave: (data) => { /* callback khi save */ }
}
```

**State:**
```javascript
const [lessonData, setLessonData] = useState(initialData || getDefaultData(lessonType));
```

**Luồng dữ liệu:**
1. Nhận `initialData` từ Test.jsx
2. Khởi tạo state `lessonData`
3. Truyền `lessonData` xuống `VisualEditor`
4. Khi `VisualEditor` gọi `onChange`, cập nhật `lessonData`
5. Khi click "Lưu", gọi `onSave(lessonData)`

**Code quan trọng:**
```javascript
const handleDataChange = (newData) => {
  setLessonData(newData);
};

<VisualEditor
  lessonType={lessonType}
  data={lessonData}
  onChange={handleDataChange}
/>
```

---

### 3️⃣ **VisualEditor.jsx** - Router Editor

**Vị trí:** `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`

**Chức năng:**
- Router: Dựa vào `lessonType` để render editor tương ứng
- Xử lý các thao tác chung (thêm/xóa/sửa câu hỏi)

**Props nhận vào:**
```javascript
{
  lessonType: "vocabulary_sentence_completion",
  data: { /* lessonData từ LessonStudio */ },
  onChange: (newData) => { /* callback để update LessonStudio */ }
}
```

**Luồng dữ liệu:**
```javascript
const renderEditor = () => {
  switch (lessonType) {
    case "vocabulary_sentence_completion":
      return <SentenceCompletionEditor data={data} onChange={onChange} />;
    // ... các case khác
  }
};
```

**Truyền dữ liệu:**
- `data`: Dữ liệu hiện tại của lesson
- `onChange`: Callback để cập nhật dữ liệu lên parent (LessonStudio)

---

### 4️⃣ **SentenceCompletionEditor.jsx** - Editor Tạo Bài Tập

**Vị trí:** `frontend/Shopery/src/Client/components/Lesson/Creators/editors/SentenceCompletionEditor.jsx`

**Chức năng:**
- Editor trực quan để tạo/sửa bài tập Sentence Completion
- Flow: Nhập câu → Bôi đen → Tạo blank → Quản lý word bank

**Props nhận vào:**
```javascript
{
  data: {
    type: "vocabulary_sentence_completion",
    questions: [ /* array câu hỏi */ ]
  },
  onChange: (newData) => { /* callback để update VisualEditor */ }
}
```

#### 📥 **Dữ Liệu Nhận Vào (Input Format)**

**Format từ database/Test:**
```javascript
{
  type: "vocabulary_sentence_completion",
  questions: [
    {
      question_id: "123456",
      vi_text: "Tôi vui mừng vì hôm nay trời nắng",
      sentence_template: "I am {blank1} because today is {blank2}",
      shuffled_words: [
        { id: 1, text: "happy" },
        { id: 2, text: "sunny" },
        { id: 3, text: "sad" },
        { id: 4, text: "rainy" },
      ],
      blanks: [
        { id: "blank1", correct_word_id: 1 },
        { id: "blank2", correct_word_id: 2 },
      ],
    },
  ],
}
```

#### 🔄 **Chuyển Đổi Dữ Liệu Nội Bộ**

Editor sử dụng format nội bộ để dễ làm việc:

**Format nội bộ (state):**
```javascript
{
  vi_text: "Tôi vui mừng vì hôm nay trời nắng",
  sentence_text: "I am happy because today is sunny", // Câu đầy đủ
  blanks: [
    {
      id: "blank1",
      answer: "happy", // Text thay vì ID
      start: 5,        // Vị trí bắt đầu trong sentence_text
      end: 9,          // Vị trí kết thúc
    },
    {
      id: "blank2",
      answer: "sunny",
      start: 28,
      end: 32,
    },
  ],
  word_bank: ["sad", "rainy"], // Các từ nhiễu (không phải đáp án)
  question_id: "123456",
}
```

**Code chuyển đổi (Load data):**
```javascript
useEffect(() => {
  if (data?.questions?.length) {
    const qs = data.questions.map((q) => {
      // Parse template thành sentence_text và blanks
      const parts = q.sentence_template.split(/(\{[^}]+\})/);
      let fullText = "";
      const newBlanks = [];
      
      parts.forEach((part) => {
        const m = part.match(/\{([^}]+)\}/);
        if (m) {
          const blankId = m[1];
          const blank = q.blanks?.find((b) => b.id === blankId);
          const word = q.shuffled_words?.find(
            (w) => w.id === blank?.correct_word_id
          );
          if (word) {
            newBlanks.push({
              id: blankId,
              answer: word.text,
              start: fullText.length,
              end: fullText.length + word.text.length,
            });
            fullText += word.text;
          }
        } else {
          fullText += part;
        }
      });
      
      // Tách word bank (từ không phải đáp án)
      const answerWords = newBlanks.map((b) => b.answer);
      const allWords = q.shuffled_words?.map((w) => w.text) || [];
      const wordBankWords = allWords.filter((w) => !answerWords.includes(w));
      
      return {
        vi_text: q.vi_text || "",
        sentence_text: fullText,
        blanks: newBlanks,
        word_bank: wordBankWords,
        question_id: q.question_id || genId(),
      };
    });
    setQuestions(qs);
  }
}, [data]);
```

#### 📤 **Dữ Liệu Gửi Ra (Output Format)**

Khi user thay đổi, editor chuyển đổi lại về format database:

**Code chuyển đổi (Save data):**
```javascript
const updateData = (qs) => {
  onChange({
    type: "vocabulary_sentence_completion",
    questions: qs.map((q) => {
      // Build template từ sentence_text và blanks
      let template = q.sentence_text || "";
      const sortedBlanks = [...q.blanks].sort((a, b) => b.start - a.start);
      
      sortedBlanks.forEach((blank) => {
        const before = template.substring(0, blank.start);
        const after = template.substring(blank.end);
        template = before + `{${blank.id}}` + after;
      });
      
      // Tạo shuffled_words (tất cả từ: đáp án + word bank)
      const allWords = [
        ...q.blanks.map((b) => b.answer),
        ...q.word_bank,
      ].filter((word, idx, self) => self.indexOf(word) === idx);
      
      const shuffledWords = allWords.map((word, idx) => ({
        id: idx + 1,
        text: word,
      }));
      
      // Tạo blanks với correct_word_id
      const blanksData = q.blanks.map((blank) => {
        const wordId = shuffledWords.find((w) => w.text === blank.answer)?.id;
        return { id: blank.id, correct_word_id: wordId || 1 };
      });
      
      return {
        question_id: q.question_id || genId(),
        vi_text: q.vi_text || "",
        sentence_template: template,
        shuffled_words: shuffledWords,
        blanks: blanksData,
      };
    }),
  });
};
```

**Output format:**
```javascript
{
  type: "vocabulary_sentence_completion",
  questions: [
    {
      question_id: "123456",
      vi_text: "Tôi vui mừng vì hôm nay trời nắng",
      sentence_template: "I am {blank1} because today is {blank2}",
      shuffled_words: [
        { id: 1, text: "happy" },
        { id: 2, text: "sunny" },
        { id: 3, text: "sad" },
        { id: 4, text: "rainy" },
      ],
      blanks: [
        { id: "blank1", correct_word_id: 1 },
        { id: "blank2", correct_word_id: 2 },
      ],
    },
  ],
}
```

#### 🔄 **Luồng Hoạt Động Trong Editor**

1. **Load dữ liệu:**
   - Nhận `data` từ props
   - Parse `sentence_template` → `sentence_text` + `blanks`
   - Tách `shuffled_words` → `blanks.answer` + `word_bank`

2. **User tạo bài tập:**
   - Nhập `vi_text` (câu tiếng Việt)
   - Nhập `sentence_text` (câu tiếng Anh đầy đủ)
   - Bật "Blank Mode"
   - Bôi đen text trong câu → Click "Tạo Blank"
   - Thêm từ vào word bank

3. **Save dữ liệu:**
   - Mỗi khi thay đổi, gọi `updateData()`
   - Chuyển đổi `sentence_text` + `blanks` → `sentence_template`
   - Gộp `blanks.answer` + `word_bank` → `shuffled_words`
   - Gọi `onChange(newData)` → VisualEditor → LessonStudio

---

### 5️⃣ **LessonComponentMapper.jsx** - Map Component Hiển Thị

**Vị trí:** `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx`

**Chức năng:**
- Map `lesson_type` với component hiển thị tương ứng
- Export function `renderLessonComponent()` để render bài tập

**Code:**
```javascript
export const LessonComponentMapper = {
  vocabulary_sentence_completion: VocabularySentenceCompletion,
  // ... các loại khác
};

export const renderLessonComponent = (lesson) => {
  if (!lesson) return null;
  
  const Component = LessonComponentMapper[lesson.lesson_type] || LessonComponentMapper.video;
  
  return <Component lesson={lesson} />;
};
```

**Luồng dữ liệu:**
- Nhận `lesson` object từ Test.jsx hoặc từ API
- Extract `lesson.lesson_type` → tìm component tương ứng
- Truyền `lesson` vào component

---

### 6️⃣ **VocabularySentenceCompletion.jsx** - Component Hiển Thị Cho Học Viên

**Vị trí:** `frontend/Shopery/src/Client/components/Lesson/Vocabulary/VocabularySentenceCompletion.jsx`

**Chức năng:**
- Hiển thị bài tập cho học viên
- Hỗ trợ drag & drop, kiểm tra, hiển thị đáp án

**Props nhận vào:**
```javascript
{
  lesson: {
    lesson_id: 7,
    lesson_type: "vocabulary_sentence_completion",
    lesson_data: {
      type: "vocabulary_sentence_completion",
      questions: [ /* ... */ ],
    },
  },
}
```

#### 📥 **Dữ Liệu Nhận Vào**

**Format từ database:**
```javascript
{
  type: "vocabulary_sentence_completion",
  questions: [
    {
      question_id: "123456",
      vi_text: "Tôi vui mừng vì hôm nay trời nắng",
      sentence_template: "I am {blank1} because today is {blank2}",
      shuffled_words: [
        { id: 1, text: "happy" },
        { id: 2, text: "sunny" },
        { id: 3, text: "sad" },
        { id: 4, text: "rainy" },
      ],
      blanks: [
        { id: "blank1", correct_word_id: 1 },
        { id: "blank2", correct_word_id: 2 },
      ],
    },
  ],
}
```

**Code xử lý:**
```javascript
const lessonData = lesson?.lesson_data || {};
const questions = lessonData.questions || [];

const currentQuestion = questions[currentQuestionIndex];
const currentSentenceTemplate = currentQuestion?.sentence_template || "";
const currentShuffledWords = currentQuestion?.shuffled_words || [];
const currentBlanks = currentQuestion?.blanks || [];
const currentViText = currentQuestion?.vi_text || "";
```

#### 🎮 **Luồng Hoạt Động**

1. **Parse sentence template:**
   ```javascript
   const renderSentence = () => {
     const parts = currentSentenceTemplate.split(/(\{[^}]+\})/);
     return parts.map((part, index) => {
       const blankMatch = part.match(/\{([^}]+)\}/);
       if (blankMatch) {
         const blankId = blankMatch[1];
         const blank = currentBlanks.find((b) => b.id === blankId);
         // Render blank với word đã chọn hoặc placeholder
       }
       return <span>{part}</span>;
     });
   };
   ```

2. **Drag & Drop:**
   - User kéo từ `shuffled_words` vào `blank`
   - Lưu mapping: `wordPositions[questionIndex][blankId] = wordId`

3. **Kiểm tra:**
   - So sánh `wordPositions[blankId]` với `blank.correct_word_id`
   - Hiển thị màu xanh (đúng) / đỏ (sai)

4. **Hiển thị đáp án:**
   - Tự động điền tất cả `blank.correct_word_id` vào `wordPositions`
   - Hiển thị kết quả đúng

---

## 📋 Tóm Tắt Format Dữ Liệu

### Format Database/API (Input cho Editor & Output từ Editor)

```javascript
{
  type: "vocabulary_sentence_completion",
  questions: [
    {
      question_id: string,
      vi_text: string,
      sentence_template: string, // "I am {blank1} because today is {blank2}"
      shuffled_words: [
        { id: number, text: string },
      ],
      blanks: [
        { id: string, correct_word_id: number },
      ],
    },
  ],
}
```

### Format Nội Bộ Editor (State trong SentenceCompletionEditor)

```javascript
{
  vi_text: string,
  sentence_text: string, // "I am happy because today is sunny"
  blanks: [
    {
      id: string,
      answer: string, // Text thay vì ID
      start: number,
      end: number,
    },
  ],
  word_bank: [string], // Các từ nhiễu
  question_id: string,
}
```

---

## 🔄 Luồng Dữ Liệu Hoàn Chỉnh

### Khi Tạo/Sửa Bài Tập (Editor Flow)

```
1. Test.jsx
   └─> initialData (format database)
       └─> LessonStudio.jsx
           └─> lessonData state
               └─> VisualEditor.jsx
                   └─> SentenceCompletionEditor.jsx
                       ├─> Parse: database format → internal format
                       ├─> User chỉnh sửa (internal format)
                       └─> Convert: internal format → database format
                           └─> onChange(newData)
                               └─> VisualEditor
                                   └─> LessonStudio
                                       └─> onSave(lessonData)
                                           └─> [Lưu vào database]
```

### Khi Hiển Thị Bài Tập (Display Flow)

```
1. Database/API
   └─> lesson object (format database)
       └─> Test.jsx / Lesson.jsx
           └─> renderLessonComponent(lesson)
               └─> LessonComponentMapper
                   └─> VocabularySentenceCompletion
                       └─> Parse sentence_template
                           └─> Render UI với drag & drop
```

---

## 🎯 Điểm Quan Trọng

1. **Format Database:**
   - Sử dụng `sentence_template` với `{blankId}`
   - `shuffled_words` có `id` (number)
   - `blanks` có `correct_word_id` (number) tham chiếu đến `shuffled_words.id`

2. **Format Editor:**
   - Sử dụng `sentence_text` (câu đầy đủ)
   - `blanks` có `answer` (text) và `start/end` (vị trí)
   - Tách riêng `word_bank` (từ nhiễu)

3. **Chuyển đổi:**
   - Load: `sentence_template` → `sentence_text` + `blanks` (với start/end)
   - Save: `sentence_text` + `blanks` → `sentence_template`

4. **Component hiển thị:**
   - Sử dụng format database trực tiếp
   - Parse `sentence_template` để render blanks
   - Map `correct_word_id` với `shuffled_words` để kiểm tra

---

## 📝 Ghi Chú

- Editor sử dụng format nội bộ để dễ làm việc (có start/end position)
- Component hiển thị sử dụng format database trực tiếp
- Luồng dữ liệu một chiều: Editor → onChange → Parent → Save
- Component hiển thị chỉ đọc dữ liệu, không thay đổi format

