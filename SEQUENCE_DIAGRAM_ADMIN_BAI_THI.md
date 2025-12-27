# SEQUENCE DIAGRAM - ADMIN QUẢN LÝ BÀI THI

## SEQUENCE 1: XEM DANH SÁCH ĐỀ THI

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Truy cập /admin/assessment
    Frontend->>API: GET /admin/exam/tests
    API->>Service: getTest()
    Service->>Database: Test.findAll()
    Database-->>Service: List<Test>
    Service-->>API: {EM, EC, DT: tests}
    API-->>Frontend: Response JSON
    Frontend-->>Admin: Hiển thị danh sách đề thi
    
    Admin->>Frontend: Hover vào row
    Frontend->>API: GET /admin/exam/tests/:test_id/statistics
    API->>Service: getTestStatistics(test_id)
    Service->>Database: ExamSession.findByTestId(test_id)
    Database-->>Service: Sessions data
    Service->>Service: Tính averageScore, totalSessions
    Service-->>API: Statistics data
    API-->>Frontend: Statistics JSON
    Frontend-->>Admin: Hiển thị tooltip statistics
```

---

## SEQUENCE 2: TẠO ĐỀ THI MỚI (PIPELINE)

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Click "Add New Exam"
    Frontend-->>Admin: Mở ExamBuilderModal (Tab 1: Exam Info)
    
    Admin->>Frontend: Nhập thông tin: title, duration, description, difficulty
    Admin->>Frontend: Click "Next" → Tab 2: Parts
    
    Admin->>Frontend: Chọn parts cần thêm
    Admin->>Frontend: Click vào part → Tab 3: Questions
    
    Admin->>Frontend: Thêm câu hỏi cho part (question_text, choices, transcript)
    Admin->>Frontend: Click "Submit"
    
    Note over Frontend: Pipeline: Tạo test → Parts → Questions
    
    Frontend->>API: POST /admin/exam/tests (info)
    API->>Service: createTest({title, duration, ...})
    Service->>Database: Test.createTest()
    Database-->>Service: test_id
    Service-->>API: {EC: "0", DT: {test_id}}
    API-->>Frontend: Test created
    
    loop Cho mỗi part có questions
        Frontend->>API: POST /admin/exam/tests/:test_id/parts
        API->>Service: addPartToTest(test_id, partData)
        Service->>Database: Part.createPart()
        Database-->>Service: part_id
        Service-->>API: {EC: "0", DT: {part_id}}
        API-->>Frontend: Part created
        
        Frontend->>API: POST /admin/exam/parts/:part_id/questions (bulk)
        API->>Service: addMultipleQuestionsToPart(part_id, questions)
        
        loop Cho mỗi question
            Service->>Database: Question.createQuestion()
            Database-->>Service: question_id
            
            loop Cho mỗi choice
                Service->>Database: Choice.createChoices(question_id, choices)
            end
        end
        
        Service-->>API: {EC: "0", DT: createdQuestions}
        API-->>Frontend: Questions created
    end
    
    Frontend-->>Admin: Hiển thị "Tạo đề thi thành công"
    Frontend->>Frontend: Đóng modal, refresh danh sách
```

---

## SEQUENCE 3: XEM CHI TIẾT ĐỀ THI

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Click icon "Preview"
    Frontend->>API: GET /admin/exam/tests/detail/:test_id
    API->>Service: getTestDetail(test_id)
    Service->>Database: Test.findWithAll(test_id)
    Database-->>Service: Test với Parts
    Service->>Database: Part.findAll({where: {test_id}})
    Database-->>Service: List<Part>
    
    loop Cho mỗi Part
        Service->>Database: Question.findAll({where: {part_id}})
        Database-->>Service: List<Question>
        
        loop Cho mỗi Question
            Service->>Database: Choice.findAll({where: {question_id}})
            Database-->>Service: List<Choice>
        end
    end
    
    Service-->>API: Test với đầy đủ Parts, Questions, Choices
    API-->>Frontend: Response JSON
    Frontend-->>Admin: Hiển thị ExamPreviewModal với chi tiết
```

---

## SEQUENCE 4: CẬP NHẬT ĐỀ THI

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Click icon "Edit"
    Frontend->>API: GET /admin/exam/tests/detail/:test_id
    API->>Service: getTestDetail(test_id)
    Service->>Database: Test.findWithAll(test_id)
    Database-->>Service: Test data
    Service-->>API: Test detail
    API-->>Frontend: Test detail
    Frontend-->>Admin: Hiển thị ExamEditModal với dữ liệu
    
    Admin->>Frontend: Chỉnh sửa: title, duration, description
    Admin->>Frontend: Chỉnh sửa câu hỏi
    Admin->>Frontend: Click "Save"
    
    Frontend->>API: PATCH /admin/exam/tests/:test_id
    API->>Service: updateTest(test_id, {title, duration, description})
    Service->>Database: Test.updateTest(test_id, data)
    Database-->>Service: Updated test
    Service-->>API: {EC: "0"}
    API-->>Frontend: Update success
    
    loop Cho mỗi câu hỏi đã sửa
        Frontend->>API: PATCH /admin/exam/questions/:question_id
        API->>Service: updateQuestion(question_id, data)
        Service->>Database: Question.updateQuestion(question_id, data)
        Database-->>Service: Updated question
        Service-->>API: {EC: "0"}
        API-->>Frontend: Question updated
    end
    
    Frontend-->>Admin: Hiển thị "Cập nhật thành công"
    Frontend->>Frontend: Refresh danh sách
```

---

## SEQUENCE 5: XÓA ĐỀ THI

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Click icon "Delete"
    Frontend-->>Admin: Hiển thị confirm dialog
    Admin->>Frontend: Xác nhận xóa
    
    Frontend->>API: DELETE /admin/exam/tests/:test_id
    API->>Service: deleteTest(test_id)
    
    Note over Service: Xóa cascade: Relations → Parts → Questions → Choices → Test
    
    Service->>Database: TestCategoryRelation.deleteByTestId(test_id)
    Database-->>Service: Deleted relations
    
    Service->>Database: Part.deletePartByTestId(test_id)
    Database-->>Service: List<part_ids>
    
    loop Cho mỗi part_id
        Service->>Database: Choice.deleteChoiceByQuestionId(question_id)
        Service->>Database: Question.deleteQuestion(question_id)
    end
    
    Service->>Database: Test.deleteTest(test_id)
    Database-->>Service: Deleted test
    Service-->>API: {EC: "0", EM: "Xóa đề thi thành công"}
    API-->>Frontend: Delete success
    Frontend-->>Admin: Hiển thị "Xóa thành công"
    Frontend->>Frontend: Refresh danh sách
```

---

## SEQUENCE 6: THÊM PART VÀO ĐỀ THI

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Đang tạo/sửa đề thi, thêm Part
    Admin->>Frontend: Nhập: part_name, part_type, part_number, question_count
    Admin->>Frontend: Click "Thêm Part"
    
    Frontend->>API: POST /admin/exam/tests/:test_id/parts
    API->>Service: addPartToTest(test_id, partData)
    Service->>Database: Part.createPart({test_id, part_name, part_type, ...})
    Database-->>Service: part_id
    Service-->>API: {EC: "0", DT: {part_id}}
    API-->>Frontend: Part created
    Frontend-->>Admin: Hiển thị "Thêm part thành công"
    Frontend->>Frontend: Cập nhật UI, cho phép thêm câu hỏi
```

---

## SEQUENCE 7: THÊM CÂU HỎI VÀO PART (BULK)

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Chọn Part, nhập nhiều câu hỏi
    Admin->>Frontend: Click "Thêm câu hỏi"
    
    Frontend->>API: POST /admin/exam/parts/:part_id/questions
    Note over Frontend: Body: {questions: [q1, q2, q3, ...]}
    API->>Service: addMultipleQuestionsToPart(part_id, questions)
    
    loop Cho mỗi question trong questions[]
        Service->>Database: Question.createQuestion({part_id, question_text, ...})
        Database-->>Service: question_id
        
        loop Cho mỗi choice trong question.choices[]
            Service->>Database: Choice.createChoices(question_id, choiceData)
            Database-->>Service: choice_id
        end
    end
    
    Service-->>API: {EC: "0", DT: createdQuestions}
    API-->>Frontend: Questions created
    Frontend-->>Admin: Hiển thị "Thêm câu hỏi thành công"
    Frontend->>Frontend: Cập nhật danh sách câu hỏi
```

---

## SEQUENCE 8: CẬP NHẬT CÂU HỎI

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Chọn câu hỏi cần sửa
    Admin->>Frontend: Chỉnh sửa: question_text, choices, explanation
    Admin->>Frontend: Click "Lưu"
    
    Frontend->>API: PATCH /admin/exam/questions/:question_id
    API->>Service: updateQuestion(question_id, data)
    Service->>Database: Question.updateQuestion(question_id, {question_text, ...})
    Database-->>Service: Updated question
    Service-->>API: {EC: "0", DT: updatedQuestion}
    API-->>Frontend: Question updated
    Frontend-->>Admin: Hiển thị "Cập nhật câu hỏi thành công"
```

---

## SEQUENCE 9: XÓA CÂU HỎI

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Click "Xóa" trên câu hỏi
    Frontend-->>Admin: Hiển thị confirm dialog
    Admin->>Frontend: Xác nhận xóa
    
    Frontend->>API: DELETE /admin/exam/questions/:question_id
    API->>Service: deleteQuestion(question_id)
    
    Note over Service: Xóa cascade: Choices → Question
    
    Service->>Database: Choice.deleteChoiceByQuestionId(question_id)
    Database-->>Service: Deleted choices
    Service->>Database: Question.deleteQuestion(question_id)
    Database-->>Service: Deleted question
    Service-->>API: {EC: "0", EM: "Xóa câu hỏi thành công"}
    API-->>Frontend: Delete success
    Frontend-->>Admin: Hiển thị "Xóa thành công"
    Frontend->>Frontend: Cập nhật danh sách câu hỏi
```

---

## SEQUENCE 10: XEM DANH SÁCH SESSIONS

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Click "Xem sessions" trên đề thi
    Frontend->>API: GET /admin/exam/tests/:test_id/sessions
    API->>Service: getTestSessions(test_id)
    Service->>Database: ExamSession.findByTestIdWithUser(test_id)
    Database-->>Service: List<ExamSession> với User info
    Service-->>API: {EC: "0", DT: sessions}
    API-->>Frontend: Sessions list
    Frontend-->>Admin: Hiển thị danh sách: user, score, duration, completed_at
```

---

## SEQUENCE 11: XEM CHI TIẾT SESSION

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Click vào một session
    Frontend->>API: GET /admin/exam/exam-sessions/:session_id
    API->>Service: getExamSessionDetail(session_id)
    
    Service->>Database: ExamSession.findWithAnswers(session_id)
    Database-->>Service: Session với Test info
    
    Service->>Database: UserAnswer.findBySessionId(session_id)
    Database-->>Service: List<UserAnswer>
    
    loop Cho mỗi UserAnswer
        Service->>Database: Question.findOne({where: {question_id}})
        Database-->>Service: Question data
        Service->>Database: Choice.findOne({where: {choice_id}})
        Database-->>Service: Choice data
    end
    
    Service-->>API: {EC: "0", DT: {session, user_answers}}
    API-->>Frontend: Session detail
    Frontend-->>Admin: Hiển thị chi tiết: user info, score, answers, part statistics
```

---

## SEQUENCE 12: XEM THỐNG KÊ ĐỀ THI

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Service
    participant Database

    Admin->>Frontend: Hover vào row đề thi hoặc click "Thống kê"
    Frontend->>API: GET /admin/exam/tests/:test_id/statistics
    API->>Service: getTestStatistics(test_id)
    
    Service->>Database: ExamSession.findByTestId(test_id)
    Database-->>Service: List<ExamSession>
    
    Service->>Service: Tính toán:
    Note over Service: totalSessions = sessions.length<br/>totalScore = sum(sessions.total_score)<br/>averageScore = totalScore / totalSessions
    
    Service-->>API: {EC: "0", DT: {totalSessions, averageScore, ...}}
    API-->>Frontend: Statistics data
    Frontend-->>Admin: Hiển thị tooltip hoặc modal với thống kê
```

---

## TỔNG QUAN KIẾN TRÚC

```mermaid
graph TB
    Admin[Admin User] --> Frontend[React Frontend]
    Frontend --> API[Express API]
    API --> Service[Exam Admin Service]
    Service --> DB[(MySQL Database)]
    
    Service --> Test[Test Model]
    Service --> Part[Part Model]
    Service --> Question[Question Model]
    Service --> Choice[Choice Model]
    Service --> Session[ExamSession Model]
    Service --> Answer[UserAnswer Model]
    
    Test --> DB
    Part --> DB
    Question --> DB
    Choice --> DB
    Session --> DB
    Answer --> DB
```

---

## LƯU Ý

1. **Pipeline tạo đề thi:** Tạo Test → Parts → Questions (tuần tự)
2. **Cascade delete:** Xóa Test sẽ xóa Parts → Questions → Choices
3. **Bulk operations:** Có thể thêm nhiều questions cùng lúc
4. **Statistics:** Tính toán real-time từ ExamSession data
5. **Error handling:** Mỗi bước có try-catch và trả về {EC, EM, DT}




