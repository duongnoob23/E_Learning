# 📚 PHÂN TÍCH CHI TIẾT 9 LOẠI BÀI HỌC

## 📋 MỤC LỤC

1. [Video Lesson](#1-video-lesson)
2. [Vocabulary List](#2-vocabulary-list)
3. [Vocabulary Matching](#3-vocabulary-matching)
4. [Vocabulary Translation](#4-vocabulary-translation)
5. [Vocabulary Quiz](#5-vocabulary-quiz)
6. [Vocabulary Listening](#6-vocabulary-listening)
7. [Image Choice](#7-image-choice)
8. [Sentence Completion](#8-sentence-completion)
9. [Grammar Theory](#9-grammar-theory)

---

## 🎬 1. VIDEO LESSON

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Video/VideoLesson.jsx          (Hiển thị cho Client)
└── components/Lesson/Creators/editors/VideoLessonEditor.jsx  (Editor cho Admin)

Admin Components:
└── components/Lesson/Creators/editors/VideoLessonEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── video_lesson: VideoLesson
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VideoLessonEditor.jsx            │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Chọn loại video:         │ │
        │  │    • YouTube                │ │
        │  │    • Direct (MP4/WebM)      │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Nhập Video URL           │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Nhập nội dung mô tả      │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 4. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "video_lesson",          │
        │    video_url: "...",              │
        │    video_type: "youtube",         │
        │    content: "..."                 │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VideoLesson.jsx                  │
        │  ┌─────────────────────────────┐ │
        │  │  • Video Player             │ │
        │  │  • Nội dung mô tả           │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Video Lesson Editor                        │
├────────────────────────────────────────────┤
│  Loại video: [YouTube ▼] [Direct ▼]       │
│  Video URL: [________________________]     │
│  Nội dung:  [________________________]     │
│              [________________________]     │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Video Lesson                               │
├────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │      [▶ Video Player]                │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Nội dung mô tả bài học...                │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Chọn loại video (YouTube/Direct)
- ✅ Nhập Video URL
- ✅ Auto-detect loại video từ URL
- ✅ Nhập nội dung mô tả
- ✅ Preview video
- ✅ Import JSON (nếu có)

---

## 📝 2. VOCABULARY LIST

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Vocabulary/VocabularyList.jsx
└── components/Lesson/Creators/editors/VocabularyListEditor.jsx

Admin Components:
└── components/Lesson/Creators/editors/VocabularyListEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── vocabulary_list: VocabularyList
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VocabularyListEditor.jsx         │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Thêm từ mới              │ │
        │  │    • Từ tiếng Anh           │ │
        │  │    • Nghĩa tiếng Việt        │ │
        │  │    • Audio URL               │ │
        │  │    • Image URL               │ │
        │  │    • Ví dụ                   │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Import JSON              │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "vocabulary_list",       │
        │    display_mode: "flashcard",     │
        │    words: [                       │
        │      {                            │
        │        en: "...",                 │
        │        vi: "...",                 │
        │        audio_url: "...",          │
        │        image_url: "...",          │
        │        example: "..."             │
        │      }                            │
        │    ]                               │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VocabularyList.jsx               │
        │  ┌─────────────────────────────┐ │
        │  │  Mode: [Flashcard] [List]    │ │
        │  │                              │ │
        │  │  ┌───────────────────────┐  │ │
        │  │  │  [Image]              │  │ │
        │  │  │  Word                 │  │ │
        │  │  │  [🔊]                 │  │ │
        │  │  │  [Flip →]             │  │ │
        │  │  └───────────────────────┘  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary List Editor                    │
├────────────────────────────────────────────┤
│  [+ Thêm từ]  [📝 Import JSON]            │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Từ 1                                  │ │
│  │ Tiếng Anh: [_____________]            │ │
│  │ Tiếng Việt: [_____________]          │ │
│  │ Audio: [Upload] [URL]                │ │
│  │ Image: [Upload] [URL]                 │ │
│  │ Ví dụ: [________________]            │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary List                            │
├────────────────────────────────────────────┤
│  [📋 List] [🃏 Flashcard]                  │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Image]                              │ │
│  │  Word                                 │ │
│  │  /pronunciation/                      │ │
│  │  [🔊 UK] [🔊 US]                      │ │
│  │  [←] [Flip] [→]                      │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Thêm từ mới (bằng tay)
- ✅ Import JSON (array words)
- ✅ Upload audio/image
- ✅ Chọn display mode (flashcard/list)
- ✅ Preview
- ✅ Xóa từ

---

## 🔗 3. VOCABULARY MATCHING

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Vocabulary/VocabularyMatching.jsx
└── components/Lesson/Creators/editors/MatchingEditor.jsx

Admin Components:
└── components/Lesson/Creators/editors/MatchingEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── vocabulary_matching: VocabularyMatching
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  MatchingEditor.jsx               │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Thêm câu hỏi             │ │
        │  │    • Từ tiếng Anh           │ │
        │  │    • Nghĩa tiếng Việt       │ │
        │  │    • Audio URL              │ │
        │  │    • Image URL               │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Import JSON              │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "vocabulary_matching",   │
        │    questions: [                   │
        │      {                            │
        │        en: "...",                 │
        │        vi: "...",                 │
        │        audio_url: "...",          │
        │        image_url: "..."           │
        │      }                            │
        │    ]                               │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VocabularyMatching.jsx            │
        │  ┌─────────────────────────────┐ │
        │  │  Drag & Drop Matching       │ │
        │  │  [EN] ←→ [VI]                │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary Matching Editor                │
├────────────────────────────────────────────┤
│  [+ Thêm câu hỏi] [📝 Import JSON]        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Câu hỏi 1                             │ │
│  │ Tiếng Anh: [_____________]            │ │
│  │ Tiếng Việt: [_____________]           │ │
│  │ Audio: [Upload]                       │ │
│  │ Image: [Upload]                       │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary Matching                       │
├────────────────────────────────────────────┤
│  Kéo thả để nối từ                         │
│                                            │
│  Tiếng Anh          Tiếng Việt            │
│  ┌─────────┐       ┌─────────┐           │
│  │ Word 1  │ ←→    │ Từ 1    │           │
│  └─────────┘       └─────────┘           │
│  ┌─────────┐       ┌─────────┐           │
│  │ Word 2  │ ←→    │ Từ 2    │           │
│  └─────────┘       └─────────┘           │
│                                            │
│  [Kiểm tra]                               │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Thêm câu hỏi (bằng tay)
- ✅ Import JSON
- ✅ Upload audio/image
- ✅ Preview với drag & drop
- ✅ Xóa câu hỏi

---

## 🔄 4. VOCABULARY TRANSLATION

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Vocabulary/VocabularyTranslation.jsx
└── components/Lesson/Creators/editors/TranslationEditor.jsx

Admin Components:
└── components/Lesson/Creators/editors/TranslationEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── vocabulary_translation: VocabularyTranslation
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  TranslationEditor.jsx             │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Thêm từ                 │ │
        │  │    • Từ tiếng Việt         │ │
        │  │    • Đáp án tiếng Anh      │ │
        │  │    • Audio URL              │ │
        │  │    • Image URL               │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Import JSON              │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "vocabulary_translation", │
        │    questions: [                   │
        │      {                            │
        │        vi_text: "...",            │
        │        en_text: "...",            │
        │        audio_url: "...",          │
        │        image_url: "..."           │
        │      }                            │
        │    ]                               │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VocabularyTranslation.jsx         │
        │  ┌─────────────────────────────┐ │
        │  │  Nhập từ tiếng Anh          │ │
        │  │  [Input field]               │ │
        │  │  [Kiểm tra]                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary Translation Editor             │
├────────────────────────────────────────────┤
│  [+ Thêm từ] [📝 Import JSON]              │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Từ 1                                  │ │
│  │ Tiếng Việt: [_____________]          │ │
│  │ Tiếng Anh: [_____________]           │ │
│  │ Audio: [Upload]                      │ │
│  │ Image: [Upload]                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary Translation                    │
├────────────────────────────────────────────┤
│  Dịch từ tiếng Việt sang tiếng Anh        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Image]                              │ │
│  │  Từ tiếng Việt                        │ │
│  │  [🔊]                                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Nhập từ tiếng Anh:                       │
│  [________________________]               │
│  [Kiểm tra]                               │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Thêm từ (bằng tay)
- ✅ Import JSON
- ✅ Upload audio/image
- ✅ Preview với input
- ✅ Xóa từ

---

## ❓ 5. VOCABULARY QUIZ

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Vocabulary/VocabularyQuiz.jsx
└── components/Lesson/Creators/editors/QuizEditor.jsx

Admin Components:
└── components/Lesson/Creators/editors/QuizEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── vocabulary_quiz: VocabularyQuiz
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  QuizEditor.jsx                   │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Thêm câu hỏi             │ │
        │  │    • Câu hỏi (text/audio)   │ │
        │  │    • 4 lựa chọn             │ │
        │  │    • Đáp án đúng            │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Import JSON              │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "vocabulary_quiz",       │
        │    questions: [                   │
        │      {                            │
        │        question_text: "...",      │
        │        question_audio_url: "...", │
        │        choices: [                 │
        │          { text: "...", correct: false },
        │          { text: "...", correct: true }
        │        ]                           │
        │      }                            │
        │    ]                               │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VocabularyQuiz.jsx               │
        │  ┌─────────────────────────────┐ │
        │  │  Câu hỏi                    │ │
        │  │  ○ Lựa chọn 1               │ │
        │  │  ○ Lựa chọn 2               │ │
        │  │  ○ Lựa chọn 3               │ │
        │  │  ○ Lựa chọn 4               │ │
        │  │  [Kiểm tra]                 │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary Quiz Editor                    │
├────────────────────────────────────────────┤
│  [+ Thêm câu hỏi] [📝 Import JSON]         │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Câu hỏi 1                             │ │
│  │ Câu hỏi: [_____________]              │ │
│  │ Audio: [Upload]                       │ │
│  │                                        │ │
│  │ Lựa chọn 1: [________] [✓ Đúng]      │ │
│  │ Lựa chọn 2: [________] [✓ Đúng]      │ │
│  │ Lựa chọn 3: [________] [✓ Đúng]      │ │
│  │ Lựa chọn 4: [________] [✓ Đúng]      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary Quiz                           │
├────────────────────────────────────────────┤
│  Câu hỏi 1/10                              │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Câu hỏi...                           │ │
│  │  [🔊]                                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ○ Lựa chọn A                              │
│  ○ Lựa chọn B                              │
│  ○ Lựa chọn C                              │
│  ○ Lựa chọn D                              │
│                                            │
│  [Kiểm tra]  [Câu tiếp →]                 │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Thêm câu hỏi (bằng tay)
- ✅ Import JSON
- ✅ Câu hỏi dạng text hoặc audio
- ✅ 4 lựa chọn
- ✅ Chọn đáp án đúng
- ✅ Preview
- ✅ Xóa câu hỏi

---

## 🎧 6. VOCABULARY LISTENING

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Vocabulary/VocabularyListening.jsx
└── components/Lesson/Creators/editors/ListeningEditor.jsx

Admin Components:
└── components/Lesson/Creators/editors/ListeningEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── vocabulary_listening: VocabularyListening
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  ListeningEditor.jsx               │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Thêm bài tập              │ │
        │  │    • Audio URL (MP3)        │ │
        │  │    • Grid 3x3 (9 ô)         │ │
        │  │      - VI text               │ │
        │  │      - Image URL              │ │
        │  │      - is_correct            │ │
        │  │    • Số lần nghe             │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Import JSON              │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "vocabulary_listening",  │
        │    questions: [                   │
        │      {                            │
        │        audio_url: "...",          │
        │        grid: {                    │
        │          cells: [                 │
        │            {                      │
        │              vi_text: "...",     │
        │              image_url: "...",   │
        │              is_correct: true    │
        │            }                      │
        │          ]                        │
        │        },                         │
        │        play_count: 3             │
        │      }                            │
        │    ]                               │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VocabularyListening.jsx            │
        │  ┌─────────────────────────────┐ │
        │  │  [Audio Player]             │ │
        │  │  Số lần nghe: 2/3           │ │
        │  │                              │ │
        │  │  ┌─────┐ ┌─────┐ ┌─────┐   │ │
        │  │  │[img]│ │[img]│ │[img]│   │ │
        │  │  │ VI  │ │ VI  │ │ VI  │   │ │
        │  │  └─────┘ └─────┘ └─────┘   │ │
        │  │  ┌─────┐ ┌─────┐ ┌─────┐   │ │
        │  │  │[img]│ │[img]│ │[img]│   │ │
        │  │  │ VI  │ │ VI  │ │ VI  │   │ │
        │  │  └─────┘ └─────┘ └─────┘   │ │
        │  │  ┌─────┐ ┌─────┐ ┌─────┐   │ │
        │  │  │[img]│ │[img]│ │[img]│   │ │
        │  │  │ VI  │ │ VI  │ │ VI  │   │ │
        │  │  └─────┘ └─────┘ └─────┘   │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary Listening Editor                │
├────────────────────────────────────────────┤
│  [Bài tập 1] [Bài tập 2] [+ Thêm] [📝 JSON]│
│                                            │
│  Audio (MP3): [Upload] [URL]              │
│  Số lần nghe: [3]                          │
│                                            │
│  Grid 3x3 (9 ô):                           │
│  ┌─────┐ ┌─────┐ ┌─────┐                  │
│  │Ô 1  │ │Ô 2  │ │Ô 3  │                  │
│  │VI:  │ │VI:  │ │VI:  │                  │
│  │[img]│ │[img]│ │[img]│                  │
│  │[✓]  │ │     │ │     │                  │
│  └─────┘ └─────┘ └─────┘                  │
│  ... (9 ô)                                 │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Vocabulary Listening                      │
├────────────────────────────────────────────┤
│  Nghe audio và chọn đáp án đúng            │
│                                            │
│  [▶ Audio Player]                          │
│  Số lần nghe còn lại: 2/3                  │
│                                            │
│  ┌─────┐ ┌─────┐ ┌─────┐                 │
│  │[img]│ │[img]│ │[img]│                 │
│  │ VI  │ │ VI  │ │ VI  │                 │
│  └─────┘ └─────┘ └─────┘                 │
│  ┌─────┐ ┌─────┐ ┌─────┐                 │
│  │[img]│ │[img]│ │[img]│                 │
│  │ VI  │ │ VI  │ │ VI  │                 │
│  └─────┘ └─────┘ └─────┘                 │
│  ┌─────┐ ┌─────┐ ┌─────┐                 │
│  │[img]│ │[img]│ │[img]│                 │
│  │ VI  │ │ VI  │ │ VI  │                 │
│  └─────┘ └─────┘ └─────┘                 │
│                                            │
│  [← Trước] [Câu sau →]                     │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Thêm bài tập (bằng tay)
- ✅ Import JSON (array questions)
- ✅ Upload audio MP3
- ✅ Grid 3x3 với 9 ô
- ✅ Mỗi ô: VI text + Image + is_correct
- ✅ Chỉ 1 đáp án đúng
- ✅ Số lần nghe tối đa
- ✅ Preview với audio player
- ✅ Xóa bài tập

---

## 🖼️ 7. IMAGE CHOICE

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Vocabulary/VocabularyImageChoice.jsx
└── components/Lesson/Creators/editors/ImageChoiceEditor.jsx

Admin Components:
└── components/Lesson/Creators/editors/ImageChoiceEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── vocabulary_image_choice: VocabularyImageChoice
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  ImageChoiceEditor.jsx            │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Thêm câu hỏi             │ │
        │  │    • Câu hỏi (text/audio)   │ │
        │  │    • 4 hình ảnh              │ │
        │  │    • Đáp án đúng             │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Import JSON              │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "vocabulary_image_choice",│
        │    questions: [                   │
        │      {                            │
        │        question_text: "...",      │
        │        question_audio_url: "...", │
        │        images: [                 │
        │          { url: "...", correct: false },
        │          { url: "...", correct: true }
        │        ]                           │
        │      }                            │
        │    ]                               │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VocabularyImageChoice.jsx         │
        │  ┌─────────────────────────────┐ │
        │  │  Câu hỏi                    │ │
        │  │  [🔊]                       │ │
        │  │                              │ │
        │  │  [img1] [img2]               │ │
        │  │  [img3] [img4]               │ │
        │  │                              │ │
        │  │  [Kiểm tra]                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Image Choice Editor                        │
├────────────────────────────────────────────┤
│  [+ Thêm câu hỏi] [📝 Import JSON]          │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Câu hỏi 1                             │ │
│  │ Câu hỏi: [_____________]              │ │
│  │ Audio: [Upload]                       │ │
│  │                                        │ │
│  │ Hình 1: [Upload] [✓ Đúng]            │ │
│  │ Hình 2: [Upload] [✓ Đúng]            │ │
│  │ Hình 3: [Upload] [✓ Đúng]            │ │
│  │ Hình 4: [Upload] [✓ Đúng]            │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Image Choice                               │
├────────────────────────────────────────────┤
│  Câu hỏi 1/10                              │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Câu hỏi...                           │ │
│  │  [🔊]                                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────┐ ┌──────┐                        │
│  │[img] │ │[img] │                        │
│  └──────┘ └──────┘                        │
│  ┌──────┐ ┌──────┐                        │
│  │[img] │ │[img] │                        │
│  └──────┘ └──────┘                        │
│                                            │
│  [Kiểm tra]  [Câu tiếp →]                 │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Thêm câu hỏi (bằng tay)
- ✅ Import JSON
- ✅ Câu hỏi dạng text hoặc audio
- ✅ 4 hình ảnh
- ✅ Chọn đáp án đúng
- ✅ Preview
- ✅ Xóa câu hỏi

---

## ✍️ 8. SENTENCE COMPLETION

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Vocabulary/VocabularySentenceCompletion.jsx
└── components/Lesson/Creators/editors/SentenceCompletionEditor.jsx

Admin Components:
└── components/Lesson/Creators/editors/SentenceCompletionEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── vocabulary_sentence_completion: VocabularySentenceCompletion
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  SentenceCompletionEditor.jsx     │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Thêm câu hỏi             │ │
        │  │    • Câu có chỗ trống       │ │
        │  │    • Đáp án đúng            │ │
        │  │    • Audio URL (optional)    │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Import JSON              │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "vocabulary_sentence_completion",│
        │    questions: [                   │
        │      {                            │
        │        sentence: "I ___ to school",│
        │        correct_answer: "go",      │
        │        audio_url: "..."           │
        │      }                            │
        │    ]                               │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  VocabularySentenceCompletion.jsx │
        │  ┌─────────────────────────────┐ │
        │  │  I ___ to school            │ │
        │  │  [Input field]               │ │
        │  │  [Kiểm tra]                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Sentence Completion Editor                │
├────────────────────────────────────────────┤
│  [+ Thêm câu hỏi] [📝 Import JSON]         │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Câu hỏi 1                             │ │
│  │ Câu: I ___ to school                  │ │
│  │ Đáp án: [go]                          │ │
│  │ Audio: [Upload]                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Sentence Completion                        │
├────────────────────────────────────────────┤
│  Điền từ vào chỗ trống                      │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  I ___ to school                      │ │
│  │  [🔊]                                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Nhập từ:                                  │
│  [________________________]               │
│  [Kiểm tra]                               │
│                                            │
│  [← Trước] [Câu tiếp →]                   │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Thêm câu hỏi (bằng tay)
- ✅ Import JSON
- ✅ Câu có chỗ trống (___)
- ✅ Đáp án đúng
- ✅ Audio URL (optional)
- ✅ Preview
- ✅ Xóa câu hỏi

---

## 📖 9. GRAMMAR THEORY

### 📁 Files liên quan

```
Client Components:
├── components/Lesson/Grammar/GrammarTheory.jsx
└── components/Lesson/Creators/editors/GrammarTheoryEditor.jsx

Admin Components:
└── components/Lesson/Creators/editors/GrammarTheoryEditor.jsx

Mapper:
└── components/Lesson/LessonComponentMapper.jsx
    └── grammar_theory: GrammarTheory
```

### 🔄 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN - TẠO BÀI HỌC                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  GrammarTheoryEditor.jsx          │
        │  ┌─────────────────────────────┐ │
        │  │ 1. Thêm section             │ │
        │  │    • Tiêu đề                │ │
        │  │    • Nội dung (rich text)    │ │
        │  │    • Ví dụ                  │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 2. Rich Text Editor         │ │
        │  └─────────────────────────────┘ │
        │  ┌─────────────────────────────┐ │
        │  │ 3. Preview                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Save → Database                  │
        │  {                                │
        │    type: "grammar_theory",        │
        │    sections: [                    │
        │      {                            │
        │        title: "...",             │
        │        content: "...",           │
        │        examples: ["..."]         │
        │      }                            │
        │    ]                               │
        │  }                                │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT - XEM BÀI HỌC                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  GrammarTheory.jsx                │
        │  ┌─────────────────────────────┐ │
        │  │  Section 1                  │ │
        │  │  Nội dung lý thuyết...       │ │
        │  │  Ví dụ: ...                  │ │
        │  └─────────────────────────────┘ │
        └───────────────────────────────────┘
```

### 👁️ Giao diện

**ADMIN thấy:**
```
┌────────────────────────────────────────────┐
│  Grammar Theory Editor                     │
├────────────────────────────────────────────┤
│  [+ Thêm section]                          │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Section 1                              │ │
│  │ Tiêu đề: [_____________]               │ │
│  │                                        │ │
│  │ Nội dung:                              │ │
│  │ [Rich Text Editor]                     │ │
│  │                                        │ │
│  │ Ví dụ:                                 │ │
│  │ [________________]                     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

**CLIENT thấy:**
```
┌────────────────────────────────────────────┐
│  Grammar Theory                            │
├────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐ │
│  │  Section 1: Present Simple           │ │
│  │                                        │ │
│  │  Nội dung lý thuyết về thì hiện tại  │ │
│  │  đơn...                                │ │
│  │                                        │ │
│  │  Ví dụ:                                │ │
│  │  • I go to school                      │ │
│  │  • She plays tennis                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [← Trước] [Section tiếp →]               │
└────────────────────────────────────────────┘
```

### ⚙️ Chức năng Editor

- ✅ Thêm section (bằng tay)
- ✅ Rich Text Editor cho nội dung
- ✅ Thêm ví dụ
- ✅ Preview
- ✅ Xóa section

---

## 🔄 TỔNG QUAN LUỒNG DỮ LIỆU

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN FLOW                                │
└─────────────────────────────────────────────────────────────┘

    [Chọn loại bài học]
            │
            ▼
    ┌───────────────┐
    │ LessonStudio  │
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │ VisualEditor  │
    └───────────────┘
            │
            ▼
    ┌───────────────────────────────┐
    │ [Editor Component]            │
    │ • Thêm bằng tay               │
    │ • Import JSON                 │
    │ • Preview                     │
    └───────────────────────────────┘
            │
            ▼
    ┌───────────────┐
    │   Save Data   │
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │   Database    │
    └───────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CLIENT FLOW                                │
└─────────────────────────────────────────────────────────────┘

    [Xem bài học]
            │
            ▼
    ┌───────────────┐
    │ Lesson.jsx    │
    └───────────────┘
            │
            ▼
    ┌───────────────────────────────┐
    │ LessonComponentMapper         │
    │ (Map lesson_type → Component) │
    └───────────────────────────────┘
            │
            ▼
    ┌───────────────────────────────┐
    │ [Display Component]           │
    │ • VideoLesson                 │
    │ • VocabularyList              │
    │ • VocabularyMatching          │
    │ • ...                         │
    └───────────────────────────────┘
```

---

## 📊 BẢNG TÓM TẮT

| Loại bài học | Editor File | Client Component | Type Value |
|--------------|-------------|------------------|------------|
| Video Lesson | VideoLessonEditor.jsx | VideoLesson.jsx | `video_lesson` |
| Vocabulary List | VocabularyListEditor.jsx | VocabularyList.jsx | `vocabulary_list` |
| Vocabulary Matching | MatchingEditor.jsx | VocabularyMatching.jsx | `vocabulary_matching` |
| Vocabulary Translation | TranslationEditor.jsx | VocabularyTranslation.jsx | `vocabulary_translation` |
| Vocabulary Quiz | QuizEditor.jsx | VocabularyQuiz.jsx | `vocabulary_quiz` |
| Vocabulary Listening | ListeningEditor.jsx | VocabularyListening.jsx | `vocabulary_listening` |
| Image Choice | ImageChoiceEditor.jsx | VocabularyImageChoice.jsx | `vocabulary_image_choice` |
| Sentence Completion | SentenceCompletionEditor.jsx | VocabularySentenceCompletion.jsx | `vocabulary_sentence_completion` |
| Grammar Theory | GrammarTheoryEditor.jsx | GrammarTheory.jsx | `grammar_theory` |

---

## 🎯 CÁC CHỨC NĂNG CHUNG

Tất cả các Editor đều có:

1. ✅ **Thêm bằng tay**: Form nhập liệu trực tiếp
2. ✅ **Import JSON**: Import dữ liệu từ file JSON
3. ✅ **Preview**: Xem trước bài học trước khi lưu
4. ✅ **Save**: Lưu vào database
5. ✅ **Edit**: Sửa bài học đã tạo
6. ✅ **Validation**: Kiểm tra dữ liệu trước khi lưu

---

## 📝 LƯU Ý QUAN TRỌNG

1. **Lesson Type**: Mỗi loại bài học có `type` riêng trong database
2. **Lesson Data**: Dữ liệu được lưu trong `lesson_data` (JSON)
3. **Component Mapping**: `LessonComponentMapper` map `lesson_type` → Component
4. **Editor Location**: Tất cả Editor ở `components/Lesson/Creators/editors/`
5. **Client Component**: Tất cả Component ở `components/Lesson/Vocabulary/`, `Video/`, `Grammar/`

---

*Tài liệu này được tạo tự động dựa trên phân tích codebase*

