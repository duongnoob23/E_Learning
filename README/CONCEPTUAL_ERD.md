# 📊 ERD MỨC KHÁI NIỆM (CONCEPTUAL ERD) - HỆ THỐNG E-LEARNING

## 🎯 MỤC ĐÍCH

ERD này thể hiện **chỉ các entity chính và mối quan hệ** ở mức khái niệm, bao gồm:

- ✅ Primary Keys (PK) - Định danh entity
- ✅ Foreign Keys (FK) - Thể hiện quan hệ
- ✅ Các thuộc tính nghiệp vụ quan trọng nhất
- ❌ Không bao gồm: bảng trung gian, bảng thống kê, bảng phụ trợ

---

## 📋 CÁC ENTITY CHÍNH (CORE ENTITIES)

### 1. 🔐 AUTHENTICATION & AUTHORIZATION

#### **users**

- **PK**: `user_id`
- **Thuộc tính**: `username`, `email`, `full_name`, `status`
- **Quan hệ**:
  - 1:N → `course_enrollments`, `exam_sessions`, `user_words`
  - 1:1 → `instructors` (optional)

#### **instructors**

- **PK**: `instructor_id`
- **FK**: `user_id` → `users.user_id` (nullable)
- **Thuộc tính**: `name`, `bio`, `is_verified`
- **Quan hệ**: 1:N → `courses`

---

### 2. 📚 COURSE SYSTEM

#### **categories**

- **PK**: `category_id`
- **Thuộc tính**: `name`, `slug`, `description`
- **Quan hệ**: 1:N → `courses`

#### **levels**

- **PK**: `level_id`
- **Thuộc tính**: `name`, `slug`
- **Quan hệ**: 1:N → `courses`

#### **courses**

- **PK**: `course_id`
- **FK**: `category_id` → `categories.category_id`
- **FK**: `level_id` → `levels.level_id`
- **FK**: `instructor_id` → `instructors.instructor_id`
- **Thuộc tính**: `title`, `slug`, `description`, `price`, `rating`, `status`
- **Quan hệ**:
  - 1:N → `modules`, `lessons`, `course_enrollments`

#### **modules**

- **PK**: `module_id`
- **FK**: `course_id` → `courses.course_id`
- **Thuộc tính**: `title`, `description`, `sort_order`
- **Quan hệ**: 1:N → `lessons`

#### **lessons**

- **PK**: `lesson_id`
- **FK**: `module_id` → `modules.module_id`
- **FK**: `course_id` → `courses.course_id`
- **Thuộc tính**: `title`, `lesson_type`, `lesson_data` (JSON), `sort_order`
- **Quan hệ**: 1:N → `course_enrollments` (last_accessed_lesson_id)

#### **course_enrollments**

- **PK**: `enrollment_id`
- **FK**: `user_id` → `users.user_id`
- **FK**: `course_id` → `courses.course_id`
- **FK**: `last_accessed_lesson_id` → `lessons.lesson_id` (nullable)
- **Thuộc tính**: `status`, `enrolled_at`, `progress_percent`, `payment_status`

---

### 3. 📝 EXAM SYSTEM

#### **tests**

- **PK**: `test_id`
- **FK**: `created_by` → `users.user_id` (nullable)
- **Thuộc tính**: `title`, `description`, `exam_type`, `total_duration`, `difficulty_level`
- **Quan hệ**: 1:N → `parts`, `exam_sessions`

#### **parts**

- **PK**: `part_id`
- **FK**: `test_id` → `tests.test_id`
- **Thuộc tính**: `part_number`, `part_name`, `part_type`, `question_count`, `duration_minutes`
- **Quan hệ**: 1:N → `questions`

#### **questions**

- **PK**: `question_id`
- **FK**: `part_id` → `parts.part_id`
- **Thuộc tính**: `question_number`, `question_text`, `question_type`, `audio_file`, `image_file`, `transcript`, `explanation`
- **Quan hệ**: 1:N → `choices`, `user_answers`

#### **choices**

- **PK**: `choice_id`
- **FK**: `question_id` → `questions.question_id`
- **Thuộc tính**: `choice_letter`, `choice_text`, `is_correct`

#### **exam_sessions**

- **PK**: `exam_session_id`
- **FK**: `user_id` → `users.user_id`
- **FK**: `test_id` → `tests.test_id`
- **Thuộc tính**: `session_type`, `start_time`, `end_time`, `total_score`, `status`
- **Quan hệ**: 1:N → `user_answers`

#### **user_answers**

- **PK**: `user_answer_id`
- **FK**: `exam_session_id` → `exam_sessions.exam_session_id`
- **FK**: `question_id` → `questions.question_id`
- **FK**: `selected_choice_id` → `choices.choice_id` (nullable)
- **Thuộc tính**: `answer_time`, `is_correct`

---

### 4. 🎴 VOCABULARY SYSTEM

#### **topics**

- **PK**: `topic_id`
- **FK**: `created_by` → `users.user_id` (nullable)
- **Thuộc tính**: `topic_name`, `description`, `topic_type`, `is_public`
- **Quan hệ**: 1:N → `words`, `user_words`

#### **words**

- **PK**: `word_id`
- **FK**: `topic_id` → `topics.topic_id`
- **FK**: `created_by` → `users.user_id` (nullable)
- **Thuộc tính**: `word`, `part_of_speech`, `pronunciation`, `meaning_vi`, `example_en`, `example_vi`
- **Quan hệ**: 1:N → `user_words` (from_system_word_id)

#### **user_words**

- **PK**: `user_word_id`
- **FK**: `user_id` → `users.user_id`
- **FK**: `topic_id` → `topics.topic_id`
- **FK**: `from_system_word_id` → `words.word_id` (nullable)
- **Thuộc tính**: `word`, `meaning_vi`, `example_en`, `example_vi`, `is_starred`

---

## 🔗 CODE PLANTUML

```plantuml
@startuml
!theme plain
skinparam linetype ortho

' Authentication & Authorization
entity "users" as users {
  * user_id : BIGINT <<PK>>
  --
  username : STRING
  email : STRING
  full_name : STRING
  status : STRING
}

entity "instructors" as instructors {
  * instructor_id : BIGINT <<PK>>
  --
  * user_id : BIGINT <<FK>>
  name : STRING
  bio : TEXT
  is_verified : BOOLEAN
}

' Course System
entity "categories" as categories {
  * category_id : BIGINT <<PK>>
  --
  name : STRING
  slug : STRING
  description : TEXT
}

entity "levels" as levels {
  * level_id : BIGINT <<PK>>
  --
  name : STRING
  slug : STRING
}

entity "courses" as courses {
  * course_id : BIGINT <<PK>>
  --
  * category_id : BIGINT <<FK>>
  * level_id : BIGINT <<FK>>
  * instructor_id : BIGINT <<FK>>
  title : STRING
  slug : STRING
  description : TEXT
  price : DECIMAL
  rating : DECIMAL
  status : ENUM
}

entity "modules" as modules {
  * module_id : BIGINT <<PK>>
  --
  * course_id : BIGINT <<FK>>
  title : STRING
  description : TEXT
  sort_order : INTEGER
}

entity "lessons" as lessons {
  * lesson_id : BIGINT <<PK>>
  --
  * module_id : BIGINT <<FK>>
  * course_id : BIGINT <<FK>>
  title : STRING
  lesson_type : ENUM
  lesson_data : JSON
  sort_order : INTEGER
}

entity "course_enrollments" as enrollments {
  * enrollment_id : BIGINT <<PK>>
  --
  * user_id : BIGINT <<FK>>
  * course_id : BIGINT <<FK>>
  last_accessed_lesson_id : BIGINT <<FK>>
  status : ENUM
  enrolled_at : DATE
  progress_percent : DECIMAL
  payment_status : ENUM
}

' Exam System
entity "tests" as tests {
  * test_id : BIGINT <<PK>>
  --
  created_by : BIGINT <<FK>>
  title : STRING
  description : TEXT
  exam_type : ENUM
  total_duration : INTEGER
  difficulty_level : ENUM
}

entity "parts" as parts {
  * part_id : BIGINT <<PK>>
  --
  * test_id : BIGINT <<FK>>
  part_number : INTEGER
  part_name : STRING
  part_type : ENUM
  question_count : INTEGER
  duration_minutes : INTEGER
}

entity "questions" as questions {
  * question_id : BIGINT <<PK>>
  --
  * part_id : BIGINT <<FK>>
  question_number : INTEGER
  question_text : TEXT
  question_type : ENUM
  audio_file : STRING
  image_file : STRING
  transcript : TEXT
  explanation : TEXT
}

entity "choices" as choices {
  * choice_id : BIGINT <<PK>>
  --
  * question_id : BIGINT <<FK>>
  choice_letter : ENUM
  choice_text : TEXT
  is_correct : BOOLEAN
}

entity "exam_sessions" as exam_sessions {
  * exam_session_id : BIGINT <<PK>>
  --
  * user_id : BIGINT <<FK>>
  * test_id : BIGINT <<FK>>
  session_type : ENUM
  start_time : DATE
  end_time : DATE
  total_score : INTEGER
  status : ENUM
}

entity "user_answers" as user_answers {
  * user_answer_id : BIGINT <<PK>>
  --
  * exam_session_id : BIGINT <<FK>>
  * question_id : BIGINT <<FK>>
  selected_choice_id : BIGINT <<FK>>
  answer_time : DATE
  is_correct : BOOLEAN
}

' Vocabulary System
entity "topics" as topics {
  * topic_id : BIGINT <<PK>>
  --
  created_by : BIGINT <<FK>>
  topic_name : STRING
  description : TEXT
  topic_type : ENUM
  is_public : BOOLEAN
}

entity "words" as words {
  * word_id : BIGINT <<PK>>
  --
  * topic_id : BIGINT <<FK>>
  created_by : BIGINT <<FK>>
  word : STRING
  part_of_speech : STRING
  pronunciation : STRING
  meaning_vi : TEXT
  example_en : TEXT
  example_vi : TEXT
}

entity "user_words" as user_words {
  * user_word_id : BIGINT <<PK>>
  --
  * user_id : BIGINT <<FK>>
  * topic_id : BIGINT <<FK>>
  from_system_word_id : BIGINT <<FK>>
  word : STRING
  meaning_vi : TEXT
  example_en : TEXT
  example_vi : TEXT
  is_starred : BOOLEAN
}

' Relationships
users ||--o| instructors : "can be"
users ||--o{ enrollments : "enrolls"
users ||--o{ exam_sessions : "takes"
users ||--o{ user_words : "creates"
users ||--o{ topics : "creates"
users ||--o{ tests : "creates"

categories ||--o{ courses : "contains"
levels ||--o{ courses : "categorizes"
instructors ||--o{ courses : "teaches"

courses ||--o{ modules : "contains"
courses ||--o{ lessons : "has"
courses ||--o{ enrollments : "enrolled_by"

modules ||--o{ lessons : "contains"
lessons ||--o{ enrollments : "last_accessed"

tests ||--o{ parts : "contains"
tests ||--o{ exam_sessions : "taken_in"

parts ||--o{ questions : "has"
questions ||--o{ choices : "has"
questions ||--o{ user_answers : "answered_by"

exam_sessions ||--o{ user_answers : "contains"
choices ||--o{ user_answers : "selected"

topics ||--o{ words : "contains"
topics ||--o{ user_words : "contains"
words ||--o{ user_words : "copied_to"

@enduml
```

**Link PlantUML Online:** [https://www.plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/)

---

## 🔗 CODE MERMAID

```mermaid
erDiagram
    %% Authentication & Authorization
    users ||--o| instructors : "can be"
    users ||--o{ course_enrollments : enrolls
    users ||--o{ exam_sessions : takes
    users ||--o{ user_words : creates
    users ||--o{ topics : creates
    users ||--o{ tests : creates

    %% Course System
    categories ||--o{ courses : contains
    levels ||--o{ courses : categorizes
    instructors ||--o{ courses : teaches
    courses ||--o{ modules : contains
    courses ||--o{ lessons : has
    courses ||--o{ course_enrollments : enrolled_by
    modules ||--o{ lessons : contains
    lessons ||--o{ course_enrollments : "last accessed"

    %% Exam System
    tests ||--o{ parts : contains
    tests ||--o{ exam_sessions : taken_in
    parts ||--o{ questions : has
    questions ||--o{ choices : has
    questions ||--o{ user_answers : answered_by
    exam_sessions ||--o{ user_answers : contains
    choices ||--o{ user_answers : selected

    %% Vocabulary System
    topics ||--o{ words : contains
    topics ||--o{ user_words : contains
    words ||--o{ user_words : "copied to"

    %% Entity Definitions
    users {
        bigint user_id PK
        string username
        string email
        string full_name
        string status
    }

    instructors {
        bigint instructor_id PK
        bigint user_id FK
        string name
        text bio
        boolean is_verified
    }

    categories {
        bigint category_id PK
        string name
        string slug
        text description
    }

    levels {
        bigint level_id PK
        string name
        string slug
    }

    courses {
        bigint course_id PK
        bigint category_id FK
        bigint level_id FK
        bigint instructor_id FK
        string title
        string slug
        text description
        decimal price
        decimal rating
        enum status
    }

    modules {
        bigint module_id PK
        bigint course_id FK
        string title
        text description
        integer sort_order
    }

    lessons {
        bigint lesson_id PK
        bigint module_id FK
        bigint course_id FK
        string title
        enum lesson_type
        json lesson_data
        integer sort_order
    }

    course_enrollments {
        bigint enrollment_id PK
        bigint user_id FK
        bigint course_id FK
        bigint last_accessed_lesson_id FK
        enum status
        date enrolled_at
        decimal progress_percent
        enum payment_status
    }

    tests {
        bigint test_id PK
        bigint created_by FK
        string title
        text description
        enum exam_type
        integer total_duration
        enum difficulty_level
    }

    parts {
        bigint part_id PK
        bigint test_id FK
        integer part_number
        string part_name
        enum part_type
        integer question_count
        integer duration_minutes
    }

    questions {
        bigint question_id PK
        bigint part_id FK
        integer question_number
        text question_text
        enum question_type
        string audio_file
        string image_file
        text transcript
        text explanation
    }

    choices {
        bigint choice_id PK
        bigint question_id FK
        enum choice_letter
        text choice_text
        boolean is_correct
    }

    exam_sessions {
        bigint exam_session_id PK
        bigint user_id FK
        bigint test_id FK
        enum session_type
        date start_time
        date end_time
        integer total_score
        enum status
    }

    user_answers {
        bigint user_answer_id PK
        bigint exam_session_id FK
        bigint question_id FK
        bigint selected_choice_id FK
        date answer_time
        boolean is_correct
    }

    topics {
        bigint topic_id PK
        bigint created_by FK
        string topic_name
        text description
        enum topic_type
        boolean is_public
    }

    words {
        bigint word_id PK
        bigint topic_id FK
        bigint created_by FK
        string word
        string part_of_speech
        string pronunciation
        text meaning_vi
        text example_en
        text example_vi
    }

    user_words {
        bigint user_word_id PK
        bigint user_id FK
        bigint topic_id FK
        bigint from_system_word_id FK
        string word
        text meaning_vi
        text example_en
        text example_vi
        boolean is_starred
    }
```

---

## 📊 TÓM TẮT QUAN HỆ

### Quan hệ 1:1

- `users` ↔ `instructors` (optional)

### Quan hệ 1:N

- `users` → `course_enrollments`, `exam_sessions`, `user_words`, `topics`, `tests`
- `categories` → `courses`
- `levels` → `courses`
- `instructors` → `courses`
- `courses` → `modules`, `lessons`, `course_enrollments`
- `modules` → `lessons`
- `lessons` → `course_enrollments` (last_accessed_lesson_id)
- `tests` → `parts`, `exam_sessions`
- `parts` → `questions`
- `questions` → `choices`, `user_answers`
- `exam_sessions` → `user_answers`
- `topics` → `words`, `user_words`
- `words` → `user_words` (from_system_word_id)

---

## 📝 GHI CHÚ

1. **ERD này chỉ bao gồm các entity chính** - loại bỏ bảng trung gian, bảng thống kê, bảng phụ trợ
2. **Chỉ hiển thị thuộc tính nghiệp vụ quan trọng** - không bao gồm `created_at`, `updated_at`, `metadata`
3. **JSON fields** (như `lesson_data`) được thể hiện như thuộc tính JSON
4. **Optional relationships** được đánh dấu bằng `o` trong cardinality (0..1 hoặc 0..N)
5. **Tổng số entity chính: 17 entity**

---

## 🚀 CÁCH SỬ DỤNG

### PlantUML:

1. Copy code PlantUML ở trên
2. Paste vào [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/)
3. Hoặc sử dụng extension PlantUML trong VS Code

### Mermaid:

1. Copy code Mermaid ở trên
2. Paste vào [Mermaid Live Editor](https://mermaid.live/)
3. Hoặc sử dụng trong Markdown (GitHub, GitLab hỗ trợ tự động render)

---

**Tài liệu được tạo:** 2024  
**Mục đích:** ERD mức khái niệm - chỉ các entity chính  
**Tổng số entity:** 17 entity chính
