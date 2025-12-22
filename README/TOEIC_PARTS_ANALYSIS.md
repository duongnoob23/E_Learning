# 📊 PHÂN TÍCH CHI TIẾT 7 PARTS TOEIC CHO LESSON EDITOR

## 📋 MỤC LỤC

1. [TOEIC Part 1 - Picture Description](#1-toeic-part-1---picture-description)
2. [TOEIC Part 2 - Question-Response](#2-toeic-part-2---question-response)
3. [TOEIC Part 3 - Conversations](#3-toeic-part-3---conversations)
4. [TOEIC Part 4 - Short Talks](#4-toeic-part-4---short-talks)
5. [TOEIC Part 5 - Incomplete Sentences](#5-toeic-part-5---incomplete-sentences)
6. [TOEIC Part 6 - Text Completion](#6-toeic-part-6---text-completion)
7. [TOEIC Part 7 - Reading Comprehension](#7-toeic-part-7---reading-comprehension)

---

## 🎯 TỔNG QUAN CẤU TRÚC DỮ LIỆU

### Cấu trúc chung của mỗi question:

```javascript
{
  question_id: "string",
  question_number: number,
  question_text: "string",        // Optional, tùy part
  audio_file: "url",              // Optional, cho Listening parts
  image_file: "url",              // Optional, cho Part 1
  transcript: "string",           // Optional, cho Part 7
  choices: [
    {
      choice_id: "string",
      choice_letter: "A|B|C|D",
      choice_text: "string"       // Optional, tùy part
    }
  ]
}
```

---

## 📸 1. TOEIC PART 1 - PICTURE DESCRIPTION

### 📝 Mô tả
Người học xem hình ảnh và nghe 4 câu mô tả, chọn câu mô tả đúng nhất về hình ảnh.

### 🎨 Giao diện Client

```
┌────────────────────────────────────────────┐
│  Part 1 - Picture Description             │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  1                                    │ │
│  │  ┌────────────────────────────────┐  │ │
│  │  │                                │  │ │
│  │  │      [Hình ảnh]                │  │ │
│  │  │                                │  │ │
│  │  └────────────────────────────────┘  │ │
│  │                                      │ │
│  │  🔊 [Audio Player]                  │ │
│  │                                      │ │
│  │  ○ A.                                │ │
│  │  ○ B.                                │ │
│  │  ○ C.                                │ │
│  │  ○ D.                                │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  2                                    │ │
│  │  ... (tương tự)                      │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 📊 Cấu trúc dữ liệu

```javascript
{
  type: "toeic_part_1",
  questions: [
    {
      question_id: "q1",
      question_number: 1,
      image_file: "https://...",    // REQUIRED
      audio_file: "https://...",     // REQUIRED
      choices: [
        {
          choice_id: "c1",
          choice_letter: "A",
          // Không có choice_text (chỉ nghe audio)
        },
        {
          choice_id: "c2",
          choice_letter: "B",
        },
        {
          choice_id: "c3",
          choice_letter: "C",
        },
        {
          choice_id: "c4",
          choice_letter: "D",
        }
      ]
    }
  ]
}
```

### ✏️ Editor - Tạo thủ công

```
┌────────────────────────────────────────────┐
│  TOEIC Part 1 Editor                      │
├────────────────────────────────────────────┤
│  [+ Thêm câu hỏi] [📝 Import JSON]        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Câu hỏi 1                             │ │
│  │ Số câu: [1]                          │ │
│  │                                        │ │
│  │ Hình ảnh: [Upload] [URL]              │ │
│  │ Audio: [Upload] [URL]                │ │
│  │                                        │ │
│  │ Lựa chọn A: [Audio] [Upload]         │ │
│  │ Lựa chọn B: [Audio] [Upload]         │ │
│  │ Lựa chọn C: [Audio] [Upload]         │ │
│  │ Lựa chọn D: [Audio] [Upload]         │ │
│  │                                        │ │
│  │ Đáp án đúng: [A] [B] [C] [D]         │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

### 📥 Import JSON Format

```json
{
  "question_id": "q1",
  "question_number": 1,
  "image_file": "https://example.com/image.jpg",
  "audio_file": "https://example.com/audio.mp3",
  "choices": [
    {
      "choice_id": "c1",
      "choice_letter": "A",
      "choice_audio": "https://example.com/choice_a.mp3"
    },
    {
      "choice_id": "c2",
      "choice_letter": "B",
      "choice_audio": "https://example.com/choice_b.mp3"
    },
    {
      "choice_id": "c3",
      "choice_letter": "C",
      "choice_audio": "https://example.com/choice_c.mp3"
    },
    {
      "choice_id": "c4",
      "choice_letter": "D",
      "choice_audio": "https://example.com/choice_d.mp3"
    }
  ],
  "correct_answer": "A"
}
```

### 🔑 Đặc điểm
- ✅ Mỗi câu hỏi độc lập
- ✅ Bắt buộc có image_file và audio_file
- ✅ 4 lựa chọn (A, B, C, D)
- ✅ Mỗi lựa chọn chỉ có audio (không có text)
- ✅ Chỉ có 1 đáp án đúng

---

## 🎤 2. TOEIC PART 2 - QUESTION-RESPONSE

### 📝 Mô tả
Người học nghe một câu hỏi hoặc câu nói, sau đó nghe 3 câu trả lời, chọn câu trả lời phù hợp nhất.

### 🎨 Giao diện Client

```
┌────────────────────────────────────────────┐
│  Part 2 - Question-Response               │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  1                                    │ │
│  │                                      │ │
│  │  🔊 [Audio Player]                  │ │
│  │                                      │ │
│  │  ○ A.                                │ │
│  │  ○ B.                                │ │
│  │  ○ C.                                │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  2                                    │ │
│  │  ... (tương tự)                      │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 📊 Cấu trúc dữ liệu

```javascript
{
  type: "toeic_part_2",
  questions: [
    {
      question_id: "q1",
      question_number: 1,
      audio_file: "https://...",     // REQUIRED
      choices: [
        {
          choice_id: "c1",
          choice_letter: "A",
          // Không có choice_text (chỉ nghe audio)
        },
        {
          choice_id: "c2",
          choice_letter: "B",
        },
        {
          choice_id: "c3",
          choice_letter: "C",
        }
      ]
    }
  ]
}
```

### ✏️ Editor - Tạo thủ công

```
┌────────────────────────────────────────────┐
│  TOEIC Part 2 Editor                      │
├────────────────────────────────────────────┤
│  [+ Thêm câu hỏi] [📝 Import JSON]        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Câu hỏi 1                             │ │
│  │ Số câu: [1]                          │ │
│  │                                        │ │
│  │ Audio câu hỏi: [Upload] [URL]        │ │
│  │                                        │ │
│  │ Lựa chọn A: [Audio] [Upload]         │ │
│  │ Lựa chọn B: [Audio] [Upload]         │ │
│  │ Lựa chọn C: [Audio] [Upload]         │ │
│  │                                        │ │
│  │ Đáp án đúng: [A] [B] [C]             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

### 📥 Import JSON Format

```json
{
  "question_id": "q1",
  "question_number": 1,
  "audio_file": "https://example.com/question.mp3",
  "choices": [
    {
      "choice_id": "c1",
      "choice_letter": "A",
      "choice_audio": "https://example.com/choice_a.mp3"
    },
    {
      "choice_id": "c2",
      "choice_letter": "B",
      "choice_audio": "https://example.com/choice_b.mp3"
    },
    {
      "choice_id": "c3",
      "choice_letter": "C",
      "choice_audio": "https://example.com/choice_c.mp3"
    }
  ],
  "correct_answer": "B"
}
```

### 🔑 Đặc điểm
- ✅ Mỗi câu hỏi độc lập
- ✅ Bắt buộc có audio_file
- ✅ 3 lựa chọn (A, B, C)
- ✅ Mỗi lựa chọn chỉ có audio (không có text)
- ✅ Chỉ có 1 đáp án đúng

---

## 💬 3. TOEIC PART 3 - CONVERSATIONS

### 📝 Mô tả
Người học nghe một đoạn hội thoại ngắn giữa 2 người, sau đó trả lời 3 câu hỏi về nội dung hội thoại.

### 🎨 Giao diện Client

```
┌────────────────────────────────────────────┐
│  Part 3 - Conversations                    │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Conversation 1                        │ │
│  │                                      │ │
│  │  🔊 [Audio Player]                  │ │
│  │                                      │ │
│  │  ┌────────────────────────────────┐ │ │
│  │  │ Câu 32                          │ │ │
│  │  │ Câu hỏi: What is the man...?    │ │ │
│  │  │                                  │ │ │
│  │  │ ○ A. He is a teacher             │ │ │
│  │  │ ○ B. He is a student             │ │ │
│  │  │ ○ C. He is a doctor              │ │ │
│  │  │ ○ D. He is a lawyer              │ │ │
│  │  └────────────────────────────────┘ │ │
│  │                                      │ │
│  │  ┌────────────────────────────────┐ │ │
│  │  │ Câu 33                          │ │ │
│  │  │ Câu hỏi: Where are they...?    │ │ │
│  │  │ ... (tương tự)                  │ │ │
│  │  └────────────────────────────────┘ │ │
│  │                                      │ │
│  │  ┌────────────────────────────────┐ │ │
│  │  │ Câu 34                          │ │ │
│  │  │ ... (tương tự)                  │ │ │
│  │  └────────────────────────────────┘ │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Conversation 2                        │ │
│  │ ... (tương tự)                        │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 📊 Cấu trúc dữ liệu

```javascript
{
  type: "toeic_part_3",
  conversations: [
    {
      conversation_id: "conv1",
      audio_file: "https://...",     // REQUIRED - Audio chung cho cả conversation
      questions: [
        {
          question_id: "q32",
          question_number: 32,
          question_text: "What is the man...?",  // REQUIRED
          choices: [
            {
              choice_id: "c1",
              choice_letter: "A",
              choice_text: "He is a teacher"     // REQUIRED
            },
            {
              choice_id: "c2",
              choice_letter: "B",
              choice_text: "He is a student"
            },
            {
              choice_id: "c3",
              choice_letter: "C",
              choice_text: "He is a doctor"
            },
            {
              choice_id: "c4",
              choice_letter: "D",
              choice_text: "He is a lawyer"
            }
          ]
        },
        // ... 2 câu hỏi nữa (tổng 3 câu)
      ]
    }
  ]
}
```

### ✏️ Editor - Tạo thủ công

```
┌────────────────────────────────────────────┐
│  TOEIC Part 3 Editor                      │
├────────────────────────────────────────────┤
│  [+ Thêm conversation] [📝 Import JSON]    │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Conversation 1                        │ │
│  │                                      │ │
│  │ Audio hội thoại: [Upload] [URL]     │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu hỏi 1                        │ │ │
│  │ │ Số câu: [32]                     │ │ │
│  │ │ Câu hỏi: [What is...?]          │ │ │
│  │ │                                  │ │ │
│  │ │ A: [He is a teacher] [✓ Đúng]   │ │ │
│  │ │ B: [He is a student]            │ │ │
│  │ │ C: [He is a doctor]             │ │ │
│  │ │ D: [He is a lawyer]             │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ [+ Thêm câu hỏi] (tối đa 3 câu)    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

### 📥 Import JSON Format

```json
{
  "conversation_id": "conv1",
  "audio_file": "https://example.com/conversation.mp3",
  "questions": [
    {
      "question_id": "q32",
      "question_number": 32,
      "question_text": "What is the man doing?",
      "choices": [
        {
          "choice_id": "c1",
          "choice_letter": "A",
          "choice_text": "He is a teacher"
        },
        {
          "choice_id": "c2",
          "choice_letter": "B",
          "choice_text": "He is a student"
        },
        {
          "choice_id": "c3",
          "choice_letter": "C",
          "choice_text": "He is a doctor"
        },
        {
          "choice_id": "c4",
          "choice_letter": "D",
          "choice_text": "He is a lawyer"
        }
      ],
      "correct_answer": "A"
    },
    {
      "question_id": "q33",
      "question_number": 33,
      "question_text": "Where are they?",
      "choices": [...],
      "correct_answer": "B"
    },
    {
      "question_id": "q34",
      "question_number": 34,
      "question_text": "When will they meet?",
      "choices": [...],
      "correct_answer": "C"
    }
  ]
}
```

### 🔑 Đặc điểm
- ✅ Nhóm 3 câu hỏi thành 1 conversation
- ✅ 1 audio_file chung cho cả conversation
- ✅ Mỗi câu hỏi có question_text và 4 lựa chọn có text
- ✅ Mỗi conversation có đúng 3 câu hỏi
- ✅ Mỗi câu hỏi có 1 đáp án đúng

---

## 📢 4. TOEIC PART 4 - SHORT TALKS

### 📝 Mô tả
Người học nghe một bài nói ngắn (announcement, advertisement, etc.), sau đó trả lời 3 câu hỏi về nội dung bài nói.

### 🎨 Giao diện Client

```
┌────────────────────────────────────────────┐
│  Part 4 - Short Talks                      │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Talk 1                                │ │
│  │                                      │ │
│  │  🔊 [Audio Player]                  │ │
│  │                                      │ │
│  │  ┌────────────────────────────────┐ │ │
│  │  │ Câu 71                          │ │ │
│  │  │ Câu hỏi: What is the purpose...?│ │ │
│  │  │                                  │ │ │
│  │  │ ○ A. To announce...             │ │ │
│  │  │ ○ B. To advertise...            │ │ │
│  │  │ ○ C. To inform...               │ │ │
│  │  │ ○ D. To request...              │ │ │
│  │  └────────────────────────────────┘ │ │
│  │                                      │ │
│  │  ┌────────────────────────────────┐ │ │
│  │  │ Câu 72                          │ │ │
│  │  │ ... (tương tự)                  │ │ │
│  │  └────────────────────────────────┘ │ │
│  │                                      │ │
│  │  ┌────────────────────────────────┐ │ │
│  │  │ Câu 73                          │ │ │
│  │  │ ... (tương tự)                  │ │ │
│  │  └────────────────────────────────┘ │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 📊 Cấu trúc dữ liệu

```javascript
{
  type: "toeic_part_4",
  talks: [
    {
      talk_id: "talk1",
      audio_file: "https://...",     // REQUIRED - Audio chung cho cả talk
      questions: [
        {
          question_id: "q71",
          question_number: 71,
          question_text: "What is the purpose...?",  // REQUIRED
          choices: [
            {
              choice_id: "c1",
              choice_letter: "A",
              choice_text: "To announce..."         // REQUIRED
            },
            // ... 3 lựa chọn nữa
          ]
        },
        // ... 2 câu hỏi nữa (tổng 3 câu)
      ]
    }
  ]
}
```

### ✏️ Editor - Tạo thủ công

```
┌────────────────────────────────────────────┐
│  TOEIC Part 4 Editor                      │
├────────────────────────────────────────────┤
│  [+ Thêm talk] [📝 Import JSON]            │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Talk 1                                │ │
│  │                                      │ │
│  │ Audio bài nói: [Upload] [URL]       │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu hỏi 1                        │ │ │
│  │ │ Số câu: [71]                     │ │ │
│  │ │ Câu hỏi: [What is...?]          │ │ │
│  │ │                                  │ │ │
│  │ │ A: [To announce...] [✓ Đúng]    │ │ │
│  │ │ B: [To advertise...]            │ │ │
│  │ │ C: [To inform...]               │ │ │
│  │ │ D: [To request...]               │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ [+ Thêm câu hỏi] (tối đa 3 câu)    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

### 📥 Import JSON Format

```json
{
  "talk_id": "talk1",
  "audio_file": "https://example.com/talk.mp3",
  "questions": [
    {
      "question_id": "q71",
      "question_number": 71,
      "question_text": "What is the purpose of this talk?",
      "choices": [
        {
          "choice_id": "c1",
          "choice_letter": "A",
          "choice_text": "To announce a meeting"
        },
        {
          "choice_id": "c2",
          "choice_letter": "B",
          "choice_text": "To advertise a product"
        },
        {
          "choice_id": "c3",
          "choice_letter": "C",
          "choice_text": "To inform about schedule"
        },
        {
          "choice_id": "c4",
          "choice_letter": "D",
          "choice_text": "To request assistance"
        }
      ],
      "correct_answer": "A"
    },
    {
      "question_id": "q72",
      "question_number": 72,
      "question_text": "Who is the speaker?",
      "choices": [...],
      "correct_answer": "B"
    },
    {
      "question_id": "q73",
      "question_number": 73,
      "question_text": "When will the event take place?",
      "choices": [...],
      "correct_answer": "C"
    }
  ]
}
```

### 🔑 Đặc điểm
- ✅ Nhóm 3 câu hỏi thành 1 talk
- ✅ 1 audio_file chung cho cả talk
- ✅ Mỗi câu hỏi có question_text và 4 lựa chọn có text
- ✅ Mỗi talk có đúng 3 câu hỏi
- ✅ Mỗi câu hỏi có 1 đáp án đúng

---

## ✍️ 5. TOEIC PART 5 - INCOMPLETE SENTENCES

### 📝 Mô tả
Người học đọc một câu chưa hoàn chỉnh và chọn từ/cụm từ phù hợp nhất để điền vào chỗ trống.

### 🎨 Giao diện Client

```
┌────────────────────────────────────────────┐
│  Part 5 - Incomplete Sentences            │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  101                                 │ │
│  │                                      │ │
│  │  The meeting will be held ___ the   │ │
│  │  conference room.                   │ │
│  │                                      │ │
│  │  ○ A. at                             │ │
│  │  ○ B. in                             │ │
│  │  ○ C. on                             │ │
│  │  ○ D. by                             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  102                                 │ │
│  │  ... (tương tự)                      │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 📊 Cấu trúc dữ liệu

```javascript
{
  type: "toeic_part_5",
  questions: [
    {
      question_id: "q101",
      question_number: 101,
      question_text: "The meeting will be held ___ the conference room.",  // REQUIRED
      choices: [
        {
          choice_id: "c1",
          choice_letter: "A",
          choice_text: "at"              // REQUIRED
        },
        {
          choice_id: "c2",
          choice_letter: "B",
          choice_text: "in"
        },
        {
          choice_id: "c3",
          choice_letter: "C",
          choice_text: "on"
        },
        {
          choice_id: "c4",
          choice_letter: "D",
          choice_text: "by"
        }
      ]
    }
  ]
}
```

### ✏️ Editor - Tạo thủ công

```
┌────────────────────────────────────────────┐
│  TOEIC Part 5 Editor                      │
├────────────────────────────────────────────┤
│  [+ Thêm câu hỏi] [📝 Import JSON]        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Câu hỏi 1                             │ │
│  │ Số câu: [101]                        │ │
│  │                                        │ │
│  │ Câu hỏi:                              │ │
│  │ [The meeting will be held ___ the    │ │
│  │  conference room.]                    │ │
│  │                                        │ │
│  │ A: [at] [✓ Đúng]                     │ │
│  │ B: [in]                              │ │
│  │ C: [on]                              │ │
│  │ D: [by]                              │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

### 📥 Import JSON Format

```json
{
  "question_id": "q101",
  "question_number": 101,
  "question_text": "The meeting will be held ___ the conference room.",
  "choices": [
    {
      "choice_id": "c1",
      "choice_letter": "A",
      "choice_text": "at"
    },
    {
      "choice_id": "c2",
      "choice_letter": "B",
      "choice_text": "in"
    },
    {
      "choice_id": "c3",
      "choice_letter": "C",
      "choice_text": "on"
    },
    {
      "choice_id": "c4",
      "choice_letter": "D",
      "choice_text": "by"
    }
  ],
  "correct_answer": "B"
}
```

### 🔑 Đặc điểm
- ✅ Mỗi câu hỏi độc lập
- ✅ Không có audio (chỉ đọc)
- ✅ question_text chứa chỗ trống (___)
- ✅ 4 lựa chọn (A, B, C, D) có text
- ✅ Chỉ có 1 đáp án đúng

---

## 📄 6. TOEIC PART 6 - TEXT COMPLETION

### 📝 Mô tả
Người học đọc một đoạn văn có 4 chỗ trống, mỗi chỗ trống có 4 lựa chọn để điền vào.

### 🎨 Giao diện Client

```
┌────────────────────────────────────────────┐
│  Part 6 - Text Completion                  │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Text Completion 1                      │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ [Hình ảnh đoạn văn - nếu có]    │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu 131                           │ │ │
│  │ │ The company ___ its new product  │ │ │
│  │ │                                  │ │ │
│  │ │ ○ A. launched                    │ │ │
│  │ │ ○ B. launches                    │ │ │
│  │ │ ○ C. launching                   │ │ │
│  │ │ ○ D. launch                      │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu 132                           │ │ │
│  │ │ ... (tương tự)                    │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu 133                           │ │ │
│  │ │ ... (tương tự)                    │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu 134                           │ │ │
│  │ │ ... (tương tự)                    │ │ │
│  │ └──────────────────────────────────┘ │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 📊 Cấu trúc dữ liệu

```javascript
{
  type: "toeic_part_6",
  passages: [
    {
      passage_id: "passage1",
      passage_text: "The company ___ its new product...",  // Optional - có thể có hoặc không
      passage_image: "https://...",                        // Optional - hình ảnh đoạn văn
      questions: [
        {
          question_id: "q131",
          question_number: 131,
          question_text: "The company ___ its new product",  // REQUIRED
          choices: [
            {
              choice_id: "c1",
              choice_letter: "A",
              choice_text: "launched"                        // REQUIRED
            },
            {
              choice_id: "c2",
              choice_letter: "B",
              choice_text: "launches"
            },
            {
              choice_id: "c3",
              choice_letter: "C",
              choice_text: "launching"
            },
            {
              choice_id: "c4",
              choice_letter: "D",
              choice_text: "launch"
            }
          ]
        },
        // ... 3 câu hỏi nữa (tổng 4 câu)
      ]
    }
  ]
}
```

### ✏️ Editor - Tạo thủ công

```
┌────────────────────────────────────────────┐
│  TOEIC Part 6 Editor                      │
├────────────────────────────────────────────┤
│  [+ Thêm passage] [📝 Import JSON]         │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Passage 1                              │ │
│  │                                      │ │
│  │ Hình ảnh đoạn văn: [Upload] [URL]   │ │
│  │ Đoạn văn: [Text area]               │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu hỏi 1                        │ │ │
│  │ │ Số câu: [131]                    │ │ │
│  │ │ Câu hỏi: [The company ___ ...]   │ │ │
│  │ │                                  │ │ │
│  │ │ A: [launched] [✓ Đúng]          │ │ │
│  │ │ B: [launches]                   │ │ │
│  │ │ C: [launching]                  │ │ │
│  │ │ D: [launch]                     │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ [+ Thêm câu hỏi] (tối đa 4 câu)    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

### 📥 Import JSON Format

```json
{
  "passage_id": "passage1",
  "passage_text": "The company ___ its new product last month. The product ___ received positive feedback from customers.",
  "passage_image": "https://example.com/passage.jpg",
  "questions": [
    {
      "question_id": "q131",
      "question_number": 131,
      "question_text": "The company ___ its new product",
      "choices": [
        {
          "choice_id": "c1",
          "choice_letter": "A",
          "choice_text": "launched"
        },
        {
          "choice_id": "c2",
          "choice_letter": "B",
          "choice_text": "launches"
        },
        {
          "choice_id": "c3",
          "choice_letter": "C",
          "choice_text": "launching"
        },
        {
          "choice_id": "c4",
          "choice_letter": "D",
          "choice_text": "launch"
        }
      ],
      "correct_answer": "A"
    },
    {
      "question_id": "q132",
      "question_number": 132,
      "question_text": "The product ___ received positive feedback",
      "choices": [...],
      "correct_answer": "B"
    },
    {
      "question_id": "q133",
      "question_number": 133,
      "question_text": "...",
      "choices": [...],
      "correct_answer": "C"
    },
    {
      "question_id": "q134",
      "question_number": 134,
      "question_text": "...",
      "choices": [...],
      "correct_answer": "D"
    }
  ]
}
```

### 🔑 Đặc điểm
- ✅ Nhóm 4 câu hỏi thành 1 passage
- ✅ Có thể có passage_text và passage_image
- ✅ Mỗi câu hỏi có question_text và 4 lựa chọn có text
- ✅ Mỗi passage có đúng 4 câu hỏi
- ✅ Mỗi câu hỏi có 1 đáp án đúng

---

## 📚 7. TOEIC PART 7 - READING COMPREHENSION

### 📝 Mô tả
Người học đọc một hoặc nhiều đoạn văn và trả lời các câu hỏi về nội dung đã đọc.

### 🎨 Giao diện Client

```
┌────────────────────────────────────────────┐
│  Part 7 - Reading Comprehension           │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Đoạn 1                                │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ [Đoạn văn đọc]                   │ │ │
│  │ │                                  │ │ │
│  │ │ The company announced that...    │ │ │
│  │ │ ... (nội dung đoạn văn)          │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu 153                           │ │ │
│  │ │ What is the main purpose...?     │ │ │
│  │ │                                  │ │ │
│  │ │ ○ A. To announce...              │ │ │
│  │ │ ○ B. To advertise...             │ │ │
│  │ │ ○ C. To inform...                │ │ │
│  │ │ ○ D. To request...               │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu 154                           │ │ │
│  │ │ ... (tương tự)                    │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu 155                           │ │ │
│  │ │ ... (tương tự)                    │ │ │
│  │ └──────────────────────────────────┘ │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Đoạn 2                                │ │
│  │ ... (tương tự)                        │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 📊 Cấu trúc dữ liệu

```javascript
{
  type: "toeic_part_7",
  passages: [
    {
      passage_id: "passage1",
      transcript: "The company announced that...",  // REQUIRED - Nội dung đoạn văn
      questions: [
        {
          question_id: "q153",
          question_number: 153,
          question_text: "What is the main purpose...?",  // REQUIRED
          choices: [
            {
              choice_id: "c1",
              choice_letter: "A",
              choice_text: "To announce..."              // REQUIRED
            },
            {
              choice_id: "c2",
              choice_letter: "B",
              choice_text: "To advertise..."
            },
            {
              choice_id: "c3",
              choice_letter: "C",
              choice_text: "To inform..."
            },
            {
              choice_id: "c4",
              choice_letter: "D",
              choice_text: "To request..."
            }
          ]
        },
        // ... có thể có nhiều câu hỏi (không giới hạn số lượng)
      ]
    }
  ]
}
```

### ✏️ Editor - Tạo thủ công

```
┌────────────────────────────────────────────┐
│  TOEIC Part 7 Editor                      │
├────────────────────────────────────────────┤
│  [+ Thêm passage] [📝 Import JSON]         │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Passage 1                              │ │
│  │                                      │ │
│  │ Đoạn văn:                              │ │
│  │ [Text area lớn]                        │ │
│  │ The company announced that...          │ │
│  │ ...                                    │ │
│  │                                      │ │
│  │ ┌──────────────────────────────────┐ │ │
│  │ │ Câu hỏi 1                        │ │ │
│  │ │ Số câu: [153]                    │ │ │
│  │ │ Câu hỏi: [What is...?]          │ │ │
│  │ │                                  │ │ │
│  │ │ A: [To announce...] [✓ Đúng]    │ │ │
│  │ │ B: [To advertise...]            │ │ │
│  │ │ C: [To inform...]               │ │ │
│  │ │ D: [To request...]               │ │ │
│  │ └──────────────────────────────────┘ │ │
│  │                                      │ │
│  │ [+ Thêm câu hỏi]                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [👁 Preview]  [💾 Lưu]                   │
└────────────────────────────────────────────┘
```

### 📥 Import JSON Format

```json
{
  "passage_id": "passage1",
  "transcript": "The company announced that it will launch a new product line next month. The product has been in development for over two years and is expected to revolutionize the market.",
  "questions": [
    {
      "question_id": "q153",
      "question_number": 153,
      "question_text": "What is the main purpose of this passage?",
      "choices": [
        {
          "choice_id": "c1",
          "choice_letter": "A",
          "choice_text": "To announce a new product"
        },
        {
          "choice_id": "c2",
          "choice_letter": "B",
          "choice_text": "To advertise a product"
        },
        {
          "choice_id": "c3",
          "choice_letter": "C",
          "choice_text": "To inform about company history"
        },
        {
          "choice_id": "c4",
          "choice_letter": "D",
          "choice_text": "To request customer feedback"
        }
      ],
      "correct_answer": "A"
    },
    {
      "question_id": "q154",
      "question_number": 154,
      "question_text": "How long has the product been in development?",
      "choices": [
        {
          "choice_id": "c5",
          "choice_letter": "A",
          "choice_text": "One year"
        },
        {
          "choice_id": "c6",
          "choice_letter": "B",
          "choice_text": "Over two years"
        },
        {
          "choice_id": "c7",
          "choice_letter": "C",
          "choice_text": "Three years"
        },
        {
          "choice_id": "c8",
          "choice_letter": "D",
          "choice_text": "Six months"
        }
      ],
      "correct_answer": "B"
    }
  ]
}
```

### 🔑 Đặc điểm
- ✅ Nhóm nhiều câu hỏi thành 1 passage (không giới hạn số lượng)
- ✅ Bắt buộc có transcript (nội dung đoạn văn)
- ✅ Mỗi câu hỏi có question_text và 4 lựa chọn có text
- ✅ Mỗi passage có thể có nhiều câu hỏi (thường 2-5 câu)
- ✅ Mỗi câu hỏi có 1 đáp án đúng

---

## 📊 BẢNG TÓM TẮT

| Part | Tên | Nhóm | Audio | Image | Text | Số lựa chọn | Số câu/nhóm |
|------|-----|------|-------|-------|------|-------------|-------------|
| 1 | Picture Description | ❌ | ✅ | ✅ | ❌ | 4 (A-D) | 1 |
| 2 | Question-Response | ❌ | ✅ | ❌ | ❌ | 3 (A-C) | 1 |
| 3 | Conversations | ✅ (3 câu) | ✅ | ❌ | ✅ | 4 (A-D) | 3 |
| 4 | Short Talks | ✅ (3 câu) | ✅ | ❌ | ✅ | 4 (A-D) | 3 |
| 5 | Incomplete Sentences | ❌ | ❌ | ❌ | ✅ | 4 (A-D) | 1 |
| 6 | Text Completion | ✅ (4 câu) | ❌ | Optional | ✅ | 4 (A-D) | 4 |
| 7 | Reading Comprehension | ✅ (2-5 câu) | ❌ | ❌ | ✅ | 4 (A-D) | 2-5 |

---

## 🎯 PREVIEW MODE

Tất cả các parts đều có chế độ Preview để:
- ✅ Xem trước giao diện client
- ✅ Test audio player (nếu có)
- ✅ Test chọn đáp án
- ✅ Kiểm tra layout và styling

---

## 📝 LƯU Ý QUAN TRỌNG

1. **Part 1 & 2**: Lựa chọn chỉ có audio, không có text
2. **Part 3 & 4**: Nhóm theo conversation/talk, mỗi nhóm có 3 câu hỏi
3. **Part 5**: Mỗi câu hỏi độc lập, không nhóm
4. **Part 6**: Nhóm theo passage, mỗi nhóm có 4 câu hỏi
5. **Part 7**: Nhóm theo passage, mỗi nhóm có 2-5 câu hỏi (không giới hạn)
6. **Audio Files**: Tất cả audio đều là MP3
7. **Image Files**: Hỗ trợ JPG, PNG, WebP
8. **Validation**: Mỗi câu hỏi phải có đúng 1 đáp án đúng

---

*Tài liệu này được tạo để hỗ trợ phát triển Lesson Editor cho 7 Parts TOEIC*

