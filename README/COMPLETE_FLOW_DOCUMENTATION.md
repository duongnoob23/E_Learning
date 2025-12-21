# 📚 TÀI LIỆU TỔNG HỢP CÁC LUỒNG HỆ THỐNG

## 🎯 TỔNG QUAN

Tài liệu này mô tả chi tiết tất cả các luồng trong hệ thống E-learning, bao gồm:
1. **Course Flow** - Luồng khóa học (tạo, quản lý, học)
2. **Exam Flow** - Luồng làm bài thi (Listening, Reading, Speaking, Writing)
3. **Flashcard/Vocabulary Flow** - Luồng học từ vựng (flashcard, các bài tập từ vựng)

---

## 📖 1. COURSE FLOW (Luồng Khóa Học)

### 1.1. Tạo Khóa Học (Admin/Instructor)

#### **Frontend Files:**
- `frontend/Shopery/src/Client/pages/Instructor/CourseBuilder.jsx` - Giao diện tạo khóa học
- `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx` - Studio tạo bài học
- `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx` - Router editor
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/*.jsx` - Các editor cụ thể

#### **Backend Files:**
- `backend/src/instructor/routes/instructorRoutes.js` - Routes
- `backend/src/instructor/controllers/instructorController.js` - Controller
- `backend/src/instructor/services/instructorService.js` - Service logic
- `backend/src/client/models/Lesson.js` - Model database

#### **API Endpoints:**
```
POST /instructor/courses/full
POST /instructor/courses
POST /instructor/modules
POST /instructor/lessons
```

#### **Database Tables:**
- `courses` - Thông tin khóa học
- `modules` - Module trong khóa học
- `lessons` - Bài học (có `lesson_type` và `lesson_data` JSON)

#### **Luồng Hoạt Động:**

```
1. Admin mở Course Builder
   └─> CourseBuilder.jsx
       └─> Click "Add Lesson"
           └─> Modal chọn lesson_type
               └─> Mở LessonStudio.jsx
                   └─> VisualEditor.jsx (router)
                       └─> Editor cụ thể (ví dụ: SentenceCompletionEditor.jsx)
                           └─> User nhập dữ liệu
                               └─> onChange() → LessonStudio
                                   └─> onSave() → API
                                       └─> POST /instructor/lessons
                                           └─> instructorService.createLesson()
                                               └─> Validate lesson_data
                                                   └─> Lưu vào DB (lessons table)
```

#### **Dữ Liệu Lưu Trữ:**

```javascript
// Lesson trong database
{
  lesson_id: 1,
  module_id: 1,
  title: "Hoàn thiện câu: Cảm xúc",
  lesson_type: "vocabulary_sentence_completion", // ENUM
  lesson_data: {  // JSON column
    type: "vocabulary_sentence_completion",
    questions: [
      {
        question_id: "123",
        vi_text: "Tôi vui mừng...",
        sentence_template: "I am {blank1} because...",
        shuffled_words: [...],
        blanks: [...]
      }
    ]
  },
  sort_order: 1
}
```

---

### 1.2. Hiển Thị Khóa Học (Student)

#### **Frontend Files:**
- `frontend/Shopery/src/Client/pages/Course/CourseDetail.jsx` - Chi tiết khóa học
- `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx` - Map component
- `frontend/Shopery/src/Client/components/Lesson/Vocabulary/*.jsx` - Components hiển thị
- `frontend/Shopery/src/Client/components/Lesson/VideoPlayer.jsx` - Video player

#### **Backend Files:**
- `backend/src/client/routes/courseClientRoutes.js` - Routes
- `backend/src/client/controllers/courseClientController.js` - Controller
- `backend/src/client/services/courseClientService.js` - Service

#### **API Endpoints:**
```
GET /client/courses/:course_id
GET /client/courses/:course_id/structure
GET /client/lessons/:lesson_id
GET /client/modules/:module_id/lessons
```

#### **Luồng Hoạt Động:**

```
1. Student xem khóa học
   └─> CourseDetail.jsx
       └─> GET /client/courses/:course_id/structure
           └─> courseClientService.getCourseStructure()
               └─> Trả về: modules + lessons + lesson_data
                   └─> Render danh sách lessons
                       └─> Click vào lesson
                           └─> GET /client/lessons/:lesson_id
                               └─> Render component theo lesson_type
                                   └─> LessonComponentMapper[lesson_type]
                                       └─> VocabularySentenceCompletion.jsx
                                           └─> Parse lesson_data
                                               └─> Hiển thị UI cho học viên
```

#### **Component Mapping:**

```javascript
// LessonComponentMapper.jsx
export const LessonComponentMapper = {
  video: VideoPlayer,
  vocabulary_list: VocabularyList,  // ← Flashcard ở đây
  vocabulary_matching: VocabularyMatching,
  vocabulary_translation: VocabularyTranslation,
  vocabulary_quiz: VocabularyQuiz,
  vocabulary_listening: VocabularyListening,
  vocabulary_image_choice: VocabularyImageChoice,
  vocabulary_sentence_completion: VocabularySentenceCompletion,
  grammar_theory: GrammarTheory,
};
```

---

## 📝 2. EXAM FLOW (Luồng Làm Bài Thi)

### 2.1. Chọn Bài Thi

#### **Frontend Files:**
- `frontend/Shopery/src/Client/pages/Assessment/Assessment.jsx` - Danh sách bài thi
- `frontend/Shopery/src/Client/pages/Exam/ExamDetail.jsx` - Chi tiết bài thi

#### **Backend Files:**
- `backend/src/client/routes/examClientRoutes.js` - Routes
- `backend/src/client/controllers/examClientController.js` - Controller
- `backend/src/client/services/examClientService.js` - Service

#### **API Endpoints:**
```
GET /exam/tests
GET /exam/tests/:test_id
GET /exam/tests/:test_id/parts
```

#### **Database Tables:**
- `tests` - Bài thi (TOEIC, IELTS)
- `parts` - Phần thi (Listening Part 1, Reading Part 5, ...)
- `questions` - Câu hỏi
- `choices` - Lựa chọn (cho multiple choice)
- `exam_sessions` - Phiên làm bài

#### **Luồng Hoạt Động:**

```
1. User vào Assessment Page
   └─> Assessment.jsx
       └─> GET /exam/tests
           └─> Hiển thị danh sách tests
               └─> Click vào test
                   └─> ExamDetail.jsx
                       └─> GET /exam/tests/:test_id/parts
                           └─> Hiển thị parts (Listening, Reading, Speaking, Writing)
                               └─> User chọn parts muốn làm
                                   └─> Click "Start Test"
```

---

### 2.2. Bắt Đầu Làm Bài

#### **Frontend Files:**
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/AssessmentTest.jsx` - Component chính
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/QuestionComponentMapper.jsx` - Map component
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TOEIC/Listening/Part1.jsx` - Component part cụ thể
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TOEIC/Speaking/SpeakingPart.jsx` - Speaking component
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TOEIC/Writing/WritingPart.jsx` - Writing component

#### **Backend Files:**
- `backend/src/client/routes/examClientRoutes.js`
- `backend/src/client/controllers/examClientController.js`
- `backend/src/client/services/examClientService.js`

#### **API Endpoints:**
```
POST /exam/exam-sessions/start
GET /exam/parts/:part_id/questions
POST /exam/exam-sessions/:session_id/submit
GET /exam/exam-sessions/:session_id/result
```

#### **Luồng Hoạt Động:**

```
1. User click "Start Test"
   └─> POST /exam/exam-sessions/start
       Body: {
         test_id: 1,
         selected_parts: [1, 2, 3, 4],  // Part numbers
         session_type: "PRACTICE"
       }
       └─> examClientService.startExamSession()
           └─> Tạo exam_session với selected_parts (JSON)
               └─> Navigate đến AssessmentTest.jsx
                   └─> Load partData từ sessionData
                       └─> Detect examType (toeic/ielts)
                       └─> Detect skill (listening/reading/speaking/writing)
                       └─> Render TestHeader (động theo examType)
                       └─> Render Part Tabs
                       └─> Render Part Component (động)
                           └─> QuestionComponentMapper.getComponent(examType, skill, partNumber)
                               └─> TOEIC/Listening/Part1.jsx
                                   └─> GET /exam/parts/:part_id/questions
                                       └─> Render questions
                                           └─> User chọn đáp án
                                               └─> onAnswer(questionId, choiceId)
                                                   └─> Lưu vào state (answers)
```

---

### 2.3. Listening & Reading (Chấm Tự Động)

#### **Luồng Nộp Bài:**

```
1. User click "NỘP BÀI"
   └─> AssessmentTest.handleSubmit()
       └─> Transform answers:
           {
             question_id: 1,
             selected_choice_id: 5
           }
       └─> POST /exam/exam-sessions/:session_id/submit
           Body: {
             answers: [...],
             examId: test_id
           }
           └─> examClientService.submitExam()
               └─> So sánh selected_choice_id với is_correct trong choices
                   └─> Tính điểm: correct_answers / total_questions * 100
                   └─> Lưu vào user_answers
                   └─> Cập nhật exam_sessions (status = "COMPLETED")
                   └─> Cập nhật statistics
                       └─> Navigate đến ExamResult page
                           └─> GET /exam/exam-sessions/:session_id/result
                               └─> Hiển thị kết quả
```

#### **Backend Files:**
- `backend/src/client/services/examClientService.js` - Logic chấm điểm
- `backend/src/client/models/UserAnswer.js` - Model lưu đáp án
- `backend/src/client/models/ExamSession.js` - Model phiên thi

---

### 2.4. Speaking (Chấm Bằng AI)

#### **Frontend Files:**
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TOEIC/Speaking/SpeakingPart.jsx`
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TOEIC/Speaking/components/NotesAndRecorder.jsx`
- `frontend/Shopery/src/Client/api/Exam/examApi.js` - API calls
- `frontend/Shopery/src/Client/services/Exam/examQueries.js` - React Query hooks

#### **Backend Files:**
- `backend/src/client/routes/examClientRoutes.js` - Routes
- `backend/src/client/controllers/examClientController.js` - Controller
- `backend/src/client/services/examClientService.js` - Service
- `backend/src/ai/multiPA_score.py` - Python script chấm điểm

#### **API Endpoints:**
```
POST /exam/speaking/upload
POST /exam/llmservice/score (type="SPEAKING")
GET /exam/speaking/session/:session_id/responses
```

#### **Database Tables:**
- `speaking_responses` - Lưu audio và kết quả chấm điểm

#### **Luồng Hoạt Động:**

```
1. User ghi âm
   └─> SpeakingPart.jsx
       └─> NotesAndRecorder.jsx
           └─> handleRecordStop(blob, duration)
               └─> POST /exam/speaking/upload
                   FormData: {
                     audio_file: blob,
                     session_id: 123,
                     question_id: 45,
                     language: "en"
                   }
                   └─> examClientService.uploadSpeakingAudio()
                       └─> Lưu file vào backend/uploads/speaking_audio/
                       └─> Tạo record trong speaking_responses
                           └─> Trả về response_id
                               └─> POST /exam/llmservice/score
                                   Body: {
                                     response_id: 789,
                                     type: "SPEAKING",
                                     audio_file_path: "...",
                                     language: "en"
                                   }
                                   └─> examClientService.scoreSpeaking()
                                       └─> Gọi Python script: multiPA_score.py
                                           └─> Load Whisper model
                                           └─> Transcribe audio
                                           └─> Phân tích:
                                               - Pronunciation
                                               - Fluency
                                               - Prosody
                                           └─> Tính điểm (0-100)
                                           └─> Cập nhật speaking_responses
                                               └─> Trả về kết quả chi tiết
                                                   └─> Frontend hiển thị điểm
```

#### **Python Script:**
- `backend/src/ai/multiPA_score.py` - Script chấm điểm Speaking/Writing
- Sử dụng: Whisper (transcription), librosa (audio analysis)

---

### 2.5. Writing (Chấm Bằng AI)

#### **Frontend Files:**
- `frontend/Shopery/src/Client/components/AssessmentTest/AssessmentTestJSX/TOEIC/Writing/WritingPart.jsx`
- `frontend/Shopery/src/Client/api/Exam/examApi.js`
- `frontend/Shopery/src/Client/services/Exam/examQueries.js`

#### **Backend Files:**
- `backend/src/client/routes/examClientRoutes.js`
- `backend/src/client/controllers/examClientController.js`
- `backend/src/client/services/examClientService.js`
- `backend/src/ai/multiPA_score.py`

#### **API Endpoints:**
```
POST /exam/writing/submit
POST /exam/llmservice/score (type="WRITING")
GET /exam/writing/session/:session_id/responses
```

#### **Database Tables:**
- `writing_responses` - Lưu bài viết và kết quả chấm điểm

#### **Luồng Hoạt Động:**

```
1. User viết essay
   └─> WritingPart.jsx
       └─> handleEssayChange(essayText)
           └─> POST /exam/writing/submit
               Body: {
                 session_id: 123,
                 question_id: 46,
                 written_text: "This is my essay...",
                 language: "en"
               }
               └─> examClientService.submitWritingText()
                   └─> Tính word_count
                   └─> Tạo record trong writing_responses
                       └─> Trả về response_id
                           └─> POST /exam/llmservice/score
                               Body: {
                                 response_id: 790,
                                 type: "WRITING",
                                 text: "This is my essay...",
                                 language: "en"
                               }
                               └─> examClientService.scoreWriting()
                                   └─> Gọi Python script: multiPA_score.py
                                       └─> Phân tích text theo 5 tiêu chí:
                                           - Grammar
                                           - Vocabulary
                                           - Coherence
                                           - Task Completion
                                           - Spelling
                                       └─> Tính điểm từng tiêu chí (0-10) → (0-100)
                                       └─> Tính điểm tổng
                                       └─> Cập nhật writing_responses
                                           └─> Trả về kết quả chi tiết
                                               └─> Frontend hiển thị điểm
```

---

## 🎴 3. FLASHCARD/VOCABULARY FLOW (Luồng Học Từ Vựng)

### 3.1. Flashcard là gì?

Flashcard là một dạng bài học từ vựng (`vocabulary_list`) với `display_mode = "flashcard"`.

### 3.2. Tạo Bài Tập Flashcard

#### **Frontend Files:**
- `frontend/Shopery/src/Client/pages/Test/Test.jsx` - Trang test (có dữ liệu mẫu)
- `frontend/Shopery/src/Client/components/Lesson/Creators/LessonStudio.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/VisualEditor.jsx`
- `frontend/Shopery/src/Client/components/Lesson/Creators/editors/VocabularyListEditor.jsx` - Editor tạo danh sách từ

#### **Backend Files:**
- `backend/src/instructor/routes/instructorRoutes.js`
- `backend/src/instructor/controllers/instructorController.js`
- `backend/src/instructor/services/instructorService.js`

#### **API Endpoints:**
```
POST /instructor/lessons
```

#### **Luồng Hoạt Động:**

```
1. Admin tạo bài tập từ vựng
   └─> LessonStudio.jsx
       └─> Chọn lesson_type: "vocabulary_list"
           └─> VisualEditor.jsx
               └─> VocabularyListEditor.jsx
                   └─> User nhập:
                       - display_mode: "flashcard" hoặc "list"
                       - words: [
                           {
                             en: "happy",
                             vi: "vui mừng",
                             image_url: "...",
                             audio_url: "...",
                             example: "I am happy"
                           }
                         ]
                   └─> onChange() → LessonStudio
                       └─> onSave() → API
                           └─> POST /instructor/lessons
                               Body: {
                                 title: "Từ vựng: Cảm xúc",
                                 lesson_type: "vocabulary_list",
                                 lesson_data: {
                                   type: "vocabulary_list",
                                   display_mode: "flashcard",
                                   words: [...]
                                 }
                               }
                               └─> instructorService.createLesson()
                                   └─> Validate lesson_data
                                       └─> Lưu vào DB
```

#### **Dữ Liệu Lưu Trữ:**

```javascript
// Lesson trong database
{
  lesson_id: 10,
  lesson_type: "vocabulary_list",
  lesson_data: {
    type: "vocabulary_list",
    display_mode: "flashcard",  // "list" | "flashcard"
    words: [
      {
        word_id: 1,
        en: "happy",
        vi: "vui mừng",
        image_url: "https://...",
        audio_url: "https://...",
        example: "I am happy today"
      },
      // ... nhiều từ khác
    ],
    settings: {
      auto_play: true,
      show_translation: false
    }
  }
}
```

---

### 3.3. Hiển Thị Flashcard (Student)

#### **Frontend Files:**
- `frontend/Shopery/src/Client/components/Lesson/Vocabulary/VocabularyList.jsx` - Component hiển thị
- `frontend/Shopery/src/Client/components/Lesson/LessonComponentMapper.jsx` - Map component

#### **Backend Files:**
- `backend/src/client/routes/courseClientRoutes.js`
- `backend/src/client/services/courseClientService.js`

#### **API Endpoints:**
```
GET /client/lessons/:lesson_id
```

#### **Luồng Hoạt Động:**

```
1. Student xem bài học từ vựng
   └─> CourseDetail.jsx
       └─> Click vào lesson (vocabulary_list)
           └─> GET /client/lessons/:lesson_id
               └─> courseClientService.findById()
                   └─> Trả về lesson với lesson_data
                       └─> LessonComponentMapper[lesson_type]
                           └─> VocabularyList.jsx
                               └─> Parse lesson_data
                                   └─> Check display_mode
                                       └─> Nếu "flashcard":
                                           └─> Render Flashcard UI
                                               - Mặt trước: English word
                                               - Mặt sau: Vietnamese + Image + Audio
                                               - Nút "Flip" để lật thẻ
                                               - Nút "Next" để chuyển từ tiếp theo
                                       └─> Nếu "list":
                                           └─> Render List UI
                                               - Hiển thị tất cả từ dạng danh sách
```

#### **Component Logic:**

```javascript
// VocabularyList.jsx
const VocabularyList = ({ lesson }) => {
  const lessonData = lesson?.lesson_data || {};
  const words = lessonData.words || [];
  const displayMode = lessonData.display_mode || "list";
  
  if (displayMode === "flashcard") {
    return <FlashcardView words={words} />;
  } else {
    return <ListView words={words} />;
  }
};
```

---

### 3.4. Các Bài Tập Từ Vựng Khác

Ngoài flashcard, hệ thống còn có các bài tập từ vựng khác:

1. **Vocabulary Matching** - Tìm cặp (4x4 grid)
   - Component: `VocabularyMatching.jsx`
   - Editor: `VocabularyMatchingEditor.jsx`

2. **Vocabulary Translation** - Dịch nghĩa
   - Component: `VocabularyTranslation.jsx`
   - Editor: `VocabularyTranslationEditor.jsx`

3. **Vocabulary Quiz** - Trắc nghiệm
   - Component: `VocabularyQuiz.jsx`
   - Editor: `VocabularyQuizEditor.jsx`

4. **Vocabulary Listening** - Nghe từ vựng
   - Component: `VocabularyListening.jsx`
   - Editor: `VocabularyListeningEditor.jsx`

5. **Vocabulary Image Choice** - Chọn ảnh
   - Component: `VocabularyImageChoice.jsx`
   - Editor: `VocabularyImageChoiceEditor.jsx`

6. **Vocabulary Sentence Completion** - Hoàn thiện câu
   - Component: `VocabularySentenceCompletion.jsx`
   - Editor: `SentenceCompletionEditor.jsx`

Tất cả đều tuân theo cùng một luồng:
- **Tạo**: Editor → API → Database
- **Hiển thị**: API → Component → UI

---

## 📊 TỔNG HỢP FILE STRUCTURE

### Frontend Structure

```
frontend/Shopery/src/Client/
├── pages/
│   ├── Course/
│   │   └── CourseDetail.jsx              # Chi tiết khóa học
│   ├── Assessment/
│   │   └── Assessment.jsx                # Danh sách bài thi
│   ├── Exam/
│   │   └── ExamDetail.jsx                # Chi tiết bài thi
│   ├── Instructor/
│   │   └── CourseBuilder.jsx             # Tạo khóa học
│   └── Test/
│       └── Test.jsx                       # Trang test (có dữ liệu mẫu)
│
├── components/
│   ├── Lesson/
│   │   ├── LessonComponentMapper.jsx     # Map component theo lesson_type
│   │   ├── Creators/
│   │   │   ├── LessonStudio.jsx          # Studio tạo bài học
│   │   │   ├── VisualEditor.jsx          # Router editor
│   │   │   └── editors/
│   │   │       ├── VocabularyListEditor.jsx
│   │   │       ├── SentenceCompletionEditor.jsx
│   │   │       └── ...
│   │   └── Vocabulary/
│   │       ├── VocabularyList.jsx        # Flashcard/List
│   │       ├── VocabularyMatching.jsx
│   │       ├── VocabularySentenceCompletion.jsx
│   │       └── ...
│   │
│   └── AssessmentTest/
│       └── AssessmentTestJSX/
│           ├── AssessmentTest.jsx        # Component chính
│           ├── TestHeader.jsx
│           ├── QuestionNavigator.jsx
│           ├── QuestionComponentMapper.jsx
│           └── TOEIC/
│               ├── Listening/
│               │   ├── Part1.jsx
│               │   ├── Part2.jsx
│               │   └── ...
│               ├── Reading/
│               ├── Speaking/
│               │   ├── SpeakingPart.jsx
│               │   └── components/
│               │       └── NotesAndRecorder.jsx
│               └── Writing/
│                   └── WritingPart.jsx
│
├── api/
│   ├── Course/
│   │   └── courseApi.js                  # API calls cho course
│   ├── Exam/
│   │   └── examApi.js                    # API calls cho exam
│   └── Assessment/
│       └── assessmentApi.js               # API calls cho assessment
│
└── services/
    ├── Course/
    │   ├── courseQueries.js              # React Query hooks
    │   └── courseMutations.js
    ├── Exam/
    │   ├── examQueries.js
    │   └── examMutations.js
    └── Assessment/
        ├── assessmentQueries.js
        └── assessmentMutations.js
```

### Backend Structure

```
backend/src/
├── client/
│   ├── routes/
│   │   ├── courseClientRoutes.js         # Routes cho student
│   │   └── examClientRoutes.js           # Routes cho exam
│   ├── controllers/
│   │   ├── courseClientController.js
│   │   └── examClientController.js
│   ├── services/
│   │   ├── courseClientService.js
│   │   └── examClientService.js
│   └── models/
│       ├── Course.js
│       ├── Module.js
│       ├── Lesson.js
│       ├── Test.js
│       ├── Part.js
│       ├── Question.js
│       ├── ExamSession.js
│       ├── UserAnswer.js
│       ├── SpeakingResponse.js
│       └── WritingResponse.js
│
├── instructor/
│   ├── routes/
│   │   └── instructorRoutes.js           # Routes cho instructor
│   ├── controllers/
│   │   └── instructorController.js
│   └── services/
│       └── instructorService.js
│
└── ai/
    └── multiPA_score.py                  # Python script chấm điểm AI
```

---

## 🔄 DATA FLOW SUMMARY

### Course Flow
```
Admin → CourseBuilder → LessonStudio → VisualEditor → Editor
  ↓
API: POST /instructor/lessons
  ↓
Backend: instructorService.createLesson()
  ↓
Database: lessons table (lesson_data JSON)
  ↓
Student → CourseDetail → LessonComponentMapper → Component
  ↓
API: GET /client/lessons/:lesson_id
  ↓
Backend: courseClientService.findById()
  ↓
Database: lessons table
  ↓
Frontend: Render component với lesson_data
```

### Exam Flow (Listening/Reading)
```
Student → Assessment → ExamDetail → Start Test
  ↓
API: POST /exam/exam-sessions/start
  ↓
Backend: examClientService.startExamSession()
  ↓
Database: exam_sessions table
  ↓
Frontend: AssessmentTest → Part Component
  ↓
API: GET /exam/parts/:part_id/questions
  ↓
Backend: examClientService.getPartQuestions()
  ↓
Database: questions + choices
  ↓
Frontend: User chọn đáp án → Submit
  ↓
API: POST /exam/exam-sessions/:session_id/submit
  ↓
Backend: examClientService.submitExam()
  ↓
Database: user_answers (so sánh is_correct)
  ↓
Frontend: ExamResult (hiển thị điểm)
```

### Exam Flow (Speaking)
```
Student → AssessmentTest → SpeakingPart
  ↓
Frontend: Ghi âm → Upload
  ↓
API: POST /exam/speaking/upload
  ↓
Backend: examClientService.uploadSpeakingAudio()
  ↓
Database: speaking_responses (PENDING)
  ↓
API: POST /exam/llmservice/score
  ↓
Backend: examClientService.scoreSpeaking()
  ↓
Python: multiPA_score.py (Whisper + analysis)
  ↓
Database: speaking_responses (COMPLETED với điểm)
  ↓
Frontend: Hiển thị điểm chi tiết
```

### Exam Flow (Writing)
```
Student → AssessmentTest → WritingPart
  ↓
Frontend: Viết essay → Submit
  ↓
API: POST /exam/writing/submit
  ↓
Backend: examClientService.submitWritingText()
  ↓
Database: writing_responses (PENDING)
  ↓
API: POST /exam/llmservice/score
  ↓
Backend: examClientService.scoreWriting()
  ↓
Python: multiPA_score.py (text analysis)
  ↓
Database: writing_responses (COMPLETED với điểm)
  ↓
Frontend: Hiển thị điểm chi tiết
```

### Flashcard Flow
```
Admin → LessonStudio → VocabularyListEditor
  ↓
API: POST /instructor/lessons
  ↓
Backend: instructorService.createLesson()
  ↓
Database: lessons (lesson_data với display_mode="flashcard")
  ↓
Student → CourseDetail → VocabularyList
  ↓
API: GET /client/lessons/:lesson_id
  ↓
Backend: courseClientService.findById()
  ↓
Database: lessons table
  ↓
Frontend: Render FlashcardView với words[]
```

---

## 🎯 KẾT LUẬN

Hệ thống có 3 luồng chính:

1. **Course Flow**: Tạo và học khóa học với nhiều loại bài học (video, vocabulary, grammar)
2. **Exam Flow**: Làm bài thi với 4 kỹ năng (Listening, Reading, Speaking, Writing)
3. **Flashcard Flow**: Học từ vựng dạng flashcard (thuộc vocabulary_list lesson type)

Tất cả đều sử dụng:
- **Frontend**: React components với React Query
- **Backend**: Node.js với Express
- **Database**: MySQL với JSON column cho dữ liệu động
- **AI**: Python scripts cho chấm điểm Speaking/Writing

---

**Tài liệu được tạo:** `2024-01-XX`  
**Phiên bản:** `1.0.0`  
**Cập nhật lần cuối:** `2024-01-XX`









