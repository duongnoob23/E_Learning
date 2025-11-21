# 📋 TÀI LIỆU PHÂN TÍCH LUỒNG QUẢN LÝ ASSESSMENT VÀ COURSE

## 🎯 TỔNG QUAN

Hệ thống có 2 luồng quản lý chính trong Admin:

1. **Quản lý Assessment (Exam)** - Code trong folder `frontend/Shopery/src/Admin/features/courses/`
2. **Quản lý Course** - Code trong folder `frontend/Shopery/src/Admin/features/courses2/`

---

## 📝 PHẦN 1: QUẢN LÝ ASSESSMENT (EXAM)

### 🗂️ Cấu trúc Frontend

```
frontend/Shopery/src/Admin/features/courses/
├── pages/
│   └── CoursesPage.jsx          # Trang chính hiển thị danh sách exams
├── components/
│   ├── ExamBuilderModal.jsx     # Modal tạo exam mới (3 tabs)
│   ├── ExamEditModal.jsx         # Modal chỉnh sửa exam
│   ├── ExamPreviewModal.jsx     # Modal xem trước exam
│   ├── ExamInfoTab.jsx          # Tab 1: Thông tin exam
│   ├── PartsTab.jsx             # Tab 2: Quản lý parts
│   └── QuestionsTab.jsx         # Tab 3: Thêm câu hỏi
├── api/
│   └── examAdminApi.jsx         # Tất cả API calls
├── hooks/
│   ├── useExamAdminQueries.jsx  # Tanstack Query hooks (GET)
│   └── useExamAdminMutations.jsx # Tanstack Query hooks (POST/PATCH/DELETE)
```

### 🔄 LUỒNG 1: XEM DANH SÁCH ASSESSMENT

#### Frontend Flow:

1. **Component**: `CoursesPage.jsx`

   - Load danh sách: `useAdminTests()` hook
   - Query key: `["ListExamsAdmin"]`
   - API: `examAdminApi.getTests()`

2. **API Call**:

   ```javascript
   GET / admin / exam / tests;
   ```

3. **Backend Flow**:

   - **Route**: `backend/src/admin/routes/examAdminRoutes.js`
     ```javascript
     router.get("/tests", authMiddleware, ExamAdminController.getTests);
     ```
   - **Controller**: `backend/src/admin/controllers/examAdminController.js`
     ```javascript
     exports.getTests = async (req, res, next) => {
       const response = await examAdminService.getTest();
       res.json(response);
     };
     ```
   - **Service**: `backend/src/admin/services/examAdminService.js`
     ```javascript
     exports.getTest = async () => {
       const tests = await Test.findAll();
       return { EM: "Lấy danh sách đề thi thành công", EC: "0", DT: tests };
     };
     ```

4. **Response Format**:

   ```json
   {
     "EC": "0",
     "EM": "Lấy danh sách đề thi thành công",
     "DT": [
       {
         "test_id": 1,
         "title": "TOEIC Mock Test 01",
         "description": "...",
         "total_questions": 100,
         "total_parts": 7,
         "difficulty_level": "MEDIUM",
         "created_at": "2024-01-01T00:00:00Z"
       }
     ]
   }
   ```

5. **UI Actions**:
   - Hiển thị bảng danh sách exams
   - Hover vào row → hiển thị tooltip statistics
   - Click Preview icon → mở `ExamPreviewModal`
   - Click Edit icon → mở `ExamEditModal`
   - Click Delete icon → xóa exam

---

### ➕ LUỒNG 2: TẠO ASSESSMENT MỚI

#### Frontend Flow:
1. **Trigger**: Click button "Add New Exam" trong `CoursesPage.jsx`

   ```javascript
   <button onClick={() => setOpen(true)}>Add New Exam</button>
   ```

2. **Modal**: `ExamBuilderModal.jsx` mở với 3 tabs:

   - **Tab 0: Exam Info** (`ExamInfoTab.jsx`)

     - Nhập: title, code, description, difficulty, duration, visibility
     - Validation: title >= 3 ký tự, duration > 0 (nếu không noTimeLimit)

   - **Tab 1: Parts** (`PartsTab.jsx`)

     - Chọn mode: "all" | "reading" | "listening"
     - Hiển thị 7 parts (P1-P7) với số câu hỏi đã thêm
     - Click "Edit Questions" → chuyển sang Tab 2

   - **Tab 2: Questions** (`QuestionsTab.jsx`)
     - Thêm câu hỏi cho part đang chọn
     - Mỗi câu hỏi có: question_text, choices (A/B/C/D), correct answer, transcript, explanation

3. **Submit Pipeline** (`CoursesPage.jsx` → `handleSubmitExam`):

   ```javascript
   async function handleSubmitExam({ info, parts }) {
     // Bước 1: Tạo test
     const createRes = await createTest.mutateAsync({
       title: info.title,
       duration: info.noTimeLimit ? 0 : info.duration,
       description: info.description || "",
       total_questions,
       total_parts,
       difficulty_level: info.difficulty?.toUpperCase(),
     });
     const testId = createRes?.DT?.test_id;

     // Bước 2: Tạo parts (chỉ những part có câu hỏi)
     for (const p of includedParts) {
       const partRes = await addPart.mutateAsync({
         testId,
         payload: {
           part_name: p.title,
           part_type: p.type, // "listening" | "reading"
           part_number: p.number,
           question_count: p.questions.length,
         },
       });
       const partId = partRes?.DT?.part_id;

       // Bước 3: Bulk thêm câu hỏi vào part
       const qs = p.questions.map((q) => ({
         question_text: q.text,
         question_type: "MULTIPLE_CHOICE",
         question_number: q.order,
         choices: q.choices.map((c) => ({
           choice_text: c.text,
           is_correct: q.correctKey === c.key,
           choice_label: c.key,
         })),
       }));
       await addQuestions.mutateAsync({ partId, questions: qs });
     }
   }
   ```

4. **API Calls Sequence**:

   ```javascript
   // 1. Tạo test
   POST /admin/exam/tests
   Body: { title, duration, description, total_questions, total_parts, difficulty_level }

   // 2. Tạo part (lặp cho mỗi part)
   POST /admin/exam/tests/{test_id}/parts
   Body: { part_name, part_type, part_number, question_count, ... }

   // 3. Thêm câu hỏi (lặp cho mỗi part)
   POST /admin/exam/parts/{part_id}/questions
   Body: { questions: [...] }
   ```

5. **Backend Flow**:

   **a) Create Test**:

   - Route: `POST /admin/exam/tests`
   - Controller: `ExamAdminController.createTest`
   - Service: `examAdminService.createTest`
   - Model: `Test.createTest()` → Insert vào bảng `tests`

   **b) Add Part**:

   - Route: `POST /admin/exam/tests/:test_id/parts`
   - Controller: `ExamAdminController.addPartToTest`
   - Service: `examAdminService.addPartToTest`
   - Model: `Part.createPart()` → Insert vào bảng `parts`

   **c) Add Questions**:

   - Route: `POST /admin/exam/parts/:part_id/questions`
   - Controller: `ExamAdminController.addQuestionToPart`
   - Service: `examAdminService.addMultipleQuestionsToPart`
   - Logic:
     ```javascript
     for (const q of questions) {
       // Tạo question
       const question = await Question.createQuestion({...});
       // Tạo choices cho question
       await Choice.createChoices(question.question_id, q.choices);
     }
     ```

6. **Cache Invalidation**:
   ```javascript
   // Sau khi tạo thành công
   qc.invalidateQueries({ queryKey: ["ListExamsAdmin"] });
   qc.invalidateQueries({ queryKey: adminExamKeys.tests() });
   ```

---

### ✏️ LUỒNG 3: CHỈNH SỬA ASSESSMENT

#### Frontend Flow:

1. **Trigger**: Click Edit icon trong `CoursesPage.jsx`

   ```javascript
   <button onClick={() => setEditTestId(t.test_id)}>Edit</button>
   ```

2. **Modal**: `ExamEditModal.jsx`

   - Load chi tiết: `useAdminTestDetail(testId)`
   - API: `GET /admin/exam/tests/detail/:test_id`
   - Hiển thị:
     - Sidebar: Danh sách parts
     - Main: Editor cho từng câu hỏi
     - Navigation: Previous/Next question

3. **Edit Flow**:

   ```javascript
   // Local state để track changes
   const [editingData, setEditingData] = useState(null);
   const [hasChanges, setHasChanges] = useState(false);

   // Update question field
   function updateQuestionField(field, value) {
     setEditingData((prev) => {
       // Update nested state: parts[selectedPartIndex].questions[selectedQuestionIndex]
       const newParts = [...prev.parts];
       const part = newParts[selectedPartIndex];
       const newQuestions = [...part.questions];
       newQuestions[selectedQuestionIndex] = {
         ...newQuestions[selectedQuestionIndex],
         [field]: value,
       };
       newParts[selectedPartIndex] = { ...part, questions: newQuestions };
       return { ...prev, parts: newParts };
     });
     setHasChanges(true);
   }
   ```

4. **Save Changes**:

   ```javascript
   async function handleSaveAll() {
     // 1. Update test info
     await updateTest.mutateAsync({
       testId,
       payload: { title, duration, description },
     });

     // 2. Update all questions
     for (const part of parts) {
       for (const q of part.questions || []) {
         if (q.question_id) {
           await updateQuestion.mutateAsync({
             questionId: q.question_id,
             payload: {
               question_text: q.question_text,
               transcript: q.transcript,
               explanation: q.explanation,
             },
           });
         }
       }
     }
   }
   ```

5. **API Calls**:

   ```javascript
   // Update test
   PATCH /admin/exam/tests/:test_id
   Body: { title, duration, description }

   // Update question
   PATCH /admin/exam/questions/:question_id
   Body: { question_text, question_type, transcript, explanation, ... }
   ```

6. **Backend Flow**:
   - **Update Test**: `examAdminService.updateTest()` → `Test.updateTest()`
   - **Update Question**: `examAdminService.updateQuestion()` → `Question.updateQuestion()`

---

### 👁️ LUỒNG 4: PREVIEW ASSESSMENT

#### Frontend Flow:

1. **Trigger**: Click Preview icon

   ```javascript
   <button onClick={() => setPreviewTestId(t.test_id)}>Preview</button>
   ```

2. **Modal**: `ExamPreviewModal.jsx`

   - Load: `useAdminTestDetail(testId)`
   - Hiển thị:
     - Sidebar: Danh sách parts
     - Main: Câu hỏi hiện tại (read-only)
     - Navigation: Previous/Next

3. **API**: `GET /admin/exam/tests/detail/:test_id`
   - Response bao gồm: test info + parts + questions + choices

---

### 🗑️ LUỒNG 5: XÓA ASSESSMENT

#### Frontend Flow:

1. **Trigger**: Click Delete icon

   ```javascript
   <button onClick={() => handleDelete(t.test_id)}>Delete</button>
   ```

2. **Confirmation**: `window.confirm("Bạn có chắc muốn xóa đề thi này?")`

3. **Delete**:

   ```javascript
   async function handleDelete(testId) {
     await deleteTest.mutateAsync(testId);
   }
   ```

4. **API Call**:

   ```javascript
   DELETE /admin/exam/tests/:test_id
   ```

5. **Backend Flow**:

   ```javascript
   // Service: examAdminService.deleteTest()
   await TestCategoryRelation.deleteByTestId(test_id);
   await Part.deletePartByTestId(test_id); // Xóa parts → xóa questions → xóa choices
   await Test.deleteTest(test_id);
   ```

6. **Cache Invalidation**:
   ```javascript
   qc.invalidateQueries({ queryKey: ["ListExamsAdmin"] });
   ```

---

### 📊 LUỒNG 6: XEM THỐNG KÊ ASSESSMENT

#### Frontend Flow:

1. **Trigger**: Hover vào row trong bảng

   ```javascript
   onMouseMove={(e) => {
     setHoveredTestId(t.test_id);
     setMousePosition({ x: e.clientX, y: e.clientY });
   }}
   ```

2. **Query**: `useAdminTestStatistics(hoveredTestId, !!hoveredTestId)`

   - Query key: `adminExamKeys.statistics(testId)`
   - API: `GET /admin/exam/tests/:test_id/statistics`

3. **Backend Flow**:

   ```javascript
   // Service: examAdminService.getTestStatistics()
   const sessions = await ExamSession.findByTestId(test_id);
   const totalSessions = sessions.length;
   const averageScore = totalSessions ? totalScore / totalSessions : 0;
   return { totalSessions, averageScore };
   ```

4. **Display**: Tooltip hiển thị statistics khi hover

---

## 📚 PHẦN 2: QUẢN LÝ COURSE

### 🗂️ Cấu trúc Frontend

```
frontend/Shopery/src/Admin/features/courses2/
├── pages/
│   ├── CoursesPage2.jsx         # Trang chính hiển thị danh sách courses
│   └── CreateCoursePage.jsx     # Trang tạo course mới (4 tabs)
├── components/
│   ├── EditCourseModal.jsx      # Modal chỉnh sửa course
│   ├── CoursePreviewModal.jsx   # Modal xem trước course
│   ├── CourseLessonsModal.jsx   # Modal xem danh sách lessons
│   └── CreateCourse/
│       ├── CourseInfoTab.jsx    # Tab 1: Thông tin course
│       ├── CourseIntroVideoTab.jsx # Tab 2: Video giới thiệu
│       ├── CourseBuilderTab.jsx # Tab 3: Modules & Lessons
│       └── AdditionalInformationTab.jsx # Tab 4: Thông tin bổ sung
├── api/
│   └── coursesAdminApi.jsx      # Tất cả API calls
├── hooks/
│   ├── useCoursesAdminQueries.jsx  # Tanstack Query hooks (GET)
│   └── useCoursesAdminMutations.jsx # Tanstack Query hooks (POST/PATCH/DELETE)
```

### 🔄 LUỒNG 1: XEM DANH SÁCH COURSE

#### Frontend Flow:

1. **Component**: `CoursesPage2.jsx`

   - Load danh sách: `useClientCourses({ page, limit, title, sort_by })`
   - Query key: `["ListCourses"]`
   - API: `coursesAdminApi.getClientCourses()`
   - **Note**: Dùng client API vì admin API không hoạt động

2. **API Call**:

   ```javascript
   GET /course?page=1&limit=10&title=...&sort_by=newest
   ```

3. **Backend Flow**:

   - Route: Client route (không phải admin route)
   - Controller: `courseClientController.getCourses`
   - Service: `courseClientService.getCourses`

4. **UI Features**:

   - Search: Filter theo title
   - Filter: Status (All/Published/Draft/Pending Review)
   - Sort: Created On / Enrollments / Rating
   - Pagination: Client-side hoặc server-side
   - Bulk actions: Select multiple → Delete

5. **KPI Cards**:
   - Total Courses
   - Published Courses
   - Draft Courses
   - Total Enrollments

---

### ➕ LUỒNG 2: TẠO COURSE MỚI

#### Frontend Flow:

1. **Trigger**: Click "Add New Course" trong `CoursesPage2.jsx`

   ```javascript
   <button onClick={() => setOpenModal(true)}>Add New Course</button>
   ```

2. **Page**: `CreateCoursePage.jsx` với 4 tabs (Accordion):

   - **Tab 0: Course Info**

     - Title, Slug, About, Price Type (Free/Paid), Category, Thumbnail

   - **Tab 1: Course Intro Video**

     - Video Source (YouTube/Vimeo/Google Drive/Local Upload)
     - Video URL

   - **Tab 2: Course Builder**

     - Modules (Topics)
     - Lessons trong mỗi module
     - Mỗi lesson: title, video source, video URL, duration, isFree

   - **Tab 3: Additional Information**
     - Start Date, Language, Requirements, Description, Duration, Tags, Targeted Audience

3. **Submit Pipeline** (`CreateCoursePage.jsx` → `handleCreateCourse`):

   ```javascript
   async function handleCreateCourse() {
     // Bước 1: Tạo course
     const coursePayload = {
       title: formData.title,
       description: formData.about || formData.description || "",
       price:
         formData.priceType === "paid" ? parseFloat(formData.regularPrice) : 0,
       is_free: formData.priceType === "free",
       category_id: formData.category?.category_id || null,
     };
     const courseResult = await createCourseMutation.mutateAsync(coursePayload);
     const courseId = courseResult?.DT?.course_id;

     // Bước 2: Tạo modules
     for (const module of formData.modules) {
       const modulePayload = {
         title: module.title,
         description: module.description || null,
         sort_order: moduleIndex + 1,
       };
       const moduleResult = await addModuleMutation.mutateAsync({
         courseId,
         payload: modulePayload,
       });
       const moduleId = moduleResult?.DT?.module_id;

       // Bước 3: Tạo lessons cho module
       for (const lesson of module.lessons) {
         const lessonPayload = {
           title: lesson.title,
           video_url: lesson.videoUrl,
           video_duration: lesson.duration || null,
           lesson_type: "video",
           sort_order: lessonIndex + 1,
           is_free: lesson.isFree || false,
         };
         await addLessonMutation.mutateAsync({
           moduleId,
           payload: lessonPayload,
           courseId,
         });
       }
     }
   }
   ```

4. **API Calls Sequence**:

   ```javascript
   // 1. Tạo course
   POST / instructor / courses;
   Body: {
     title, description, price, is_free, category_id, level_id;
   }

   // 2. Tạo module (lặp cho mỗi module)
   POST / instructor / courses / { course_id } / modules;
   Body: {
     title, description, sort_order;
   }

   // 3. Tạo lesson (lặp cho mỗi lesson)
   POST / instructor / modules / { module_id } / lessons;
   Body: {
     title, video_url, video_duration, lesson_type, sort_order, is_free;
   }
   ```

5. **Backend Flow**:

   - **Create Course**: Instructor route → `instructorController.createCourse` → `instructorService.createCourse` → `Course.create()`
   - **Add Module**: `instructorController.addModule` → `instructorService.addModule` → `Module.create()`
   - **Add Lesson**: `instructorController.addLesson` → `instructorService.addLesson` → `Lesson.create()`

6. **Cache Invalidation**:
   ```javascript
   qc.invalidateQueries({ queryKey: ["ListCourses"] });
   qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
   ```

---

### ✏️ LUỒNG 3: CHỈNH SỬA COURSE

#### Frontend Flow:

1. **Trigger**: Click "Edit" trong action menu

   ```javascript
   <button onClick={() => setEditCourseId(course.course_id)}>Edit</button>
   ```

2. **Modal**: `EditCourseModal.jsx`

   - Load data:
     - `useAdminCourseDetail(courseId)` → Course info
     - `useAdminCourseStructure(courseId)` → Modules + Lessons
   - Tương tự `CreateCoursePage` với 4 tabs
   - Pre-fill form với data hiện có

3. **Update Flow**:

   ```javascript
   async function handleUpdateCourse() {
     // 1. Update course basic info
     await updateCourseMutation.mutateAsync({
       courseId,
       payload: {
         title: formData.title,
         description: formData.about,
         price:
           formData.priceType === "paid"
             ? parseFloat(formData.regularPrice)
             : 0,
         image: formData.thumbnail,
         video_preview: formData.videoUrl,
       },
     });

     // 2. Update modules
     for (const module of formData.modules) {
       if (module.module_id) {
         await updateModuleMutation.mutateAsync({
           moduleId: module.module_id,
           payload: { title: module.title, description: module.description },
           courseId,
         });
       }

       // 3. Update lessons
       for (const lesson of module.lessons) {
         if (lesson.lesson_id) {
           await updateLessonMutation.mutateAsync({
             lessonId: lesson.lesson_id,
             payload: {
               title: lesson.title,
               video_url: lesson.videoUrl,
               video_duration: lesson.duration,
               lesson_type: "video",
               is_free: lesson.isFree,
             },
             courseId,
           });
         }
       }
     }
   }
   ```

4. **API Calls**:

   ```javascript
   // Update course
   PATCH /instructor/courses/:course_id
   Body: { title, description, price, image, video_preview, ... }

   // Update module
   PATCH /instructor/modules/:module_id
   Body: { title, description }

   // Update lesson
   PATCH /instructor/lessons/:lesson_id
   Body: { title, video_url, video_duration, lesson_type, is_free }
   ```

5. **Backend Flow**:
   - **Update Course**: `instructorService.updateCourse` → `Course.update()`
   - **Update Module**: `instructorService.updateModule` → `Module.update()`
   - **Update Lesson**: `instructorService.updateLesson` → `Lesson.update()`

---

### 👁️ LUỒNG 4: PREVIEW COURSE

#### Frontend Flow:

1. **Trigger**: Click "Preview" trong action menu

   ```javascript
   <button onClick={() => setPreviewCourseId(course.course_id)}>Preview</button>
   ```

2. **Modal**: `CoursePreviewModal.jsx`

   - Load: `useAdminCourseDetail(courseId)` + `useAdminCourseStructure(courseId)`
   - Hiển thị:
     - Header: Title, Category, Rating, Total lessons, Duration, Students
     - Video preview hoặc Image
     - Tabs: "Giới thiệu" / "Nội dung"
     - Curriculum: Accordion modules → lessons

3. **API Calls**:
   ```javascript
   GET /course/courses/:course_id/preview  // Course detail
   GET /course/:course_id/structure        // Modules + Lessons
   ```

---

### 📖 LUỒNG 5: XEM LESSONS CỦA COURSE

#### Frontend Flow:

1. **Trigger**: Click "View Lessons" trong action menu

   ```javascript
   <button onClick={() => setLessonsCourseId(course.course_id)}>
     View Lessons
   </button>
   ```

2. **Modal**: `CourseLessonsModal.jsx`

   - Load: `useAdminCourseStructure(courseId)`
   - Layout:
     - Left: Video player (YouTube embed)
     - Right: Sidebar với modules (accordion) → lessons list
   - Click lesson → Load video vào player
   - Click Edit icon → Mở `EditLessonModal`

3. **API**: `GET /course/:course_id/structure`

---

### 🗑️ LUỒNG 6: XÓA COURSE

#### Frontend Flow:

1. **Trigger**: Click "Delete" trong action menu

   ```javascript
   <button onClick={() => handleDelete(course.course_id)}>Delete</button>
   ```

2. **Confirmation**: `window.confirm("Bạn có chắc muốn xóa khóa học này?")`

3. **Delete**:

   ```javascript
   async function handleDelete(courseId) {
     deleteCourseMutation.mutate(courseId, {
       onSuccess: () => {
         refetch();
         setShowActionMenu(null);
       },
     });
   }
   ```

4. **API Call**:

   ```javascript
   DELETE /admin/courses/:id
   ```

5. **Backend Flow**:

   ```javascript
   // Controller: courseAdminController.removeCourse
   // Service: courseAdminService.removeCourse
   await course.update({ status: "archived" }); // Soft delete
   ```

6. **Cache Invalidation**:
   ```javascript
   qc.invalidateQueries({ queryKey: ["ListCourses"] });
   qc.invalidateQueries({ queryKey: adminCoursesKeys.courses() });
   ```

---

## 🔗 TỔNG KẾT LUỒNG API

### Assessment (Exam) APIs:

| Action          | Method | Endpoint                                | Frontend Hook                  |
| --------------- | ------ | --------------------------------------- | ------------------------------ |
| List tests      | GET    | `/admin/exam/tests`                     | `useAdminTests()`              |
| Test detail     | GET    | `/admin/exam/tests/detail/:test_id`     | `useAdminTestDetail()`         |
| Create test     | POST   | `/admin/exam/tests`                     | `useAdminCreateTest()`         |
| Update test     | PATCH  | `/admin/exam/tests/:test_id`            | `useAdminUpdateTest()`         |
| Delete test     | DELETE | `/admin/exam/tests/:test_id`            | `useAdminDeleteTest()`         |
| Add part        | POST   | `/admin/exam/tests/:test_id/parts`      | `useAdminAddPartToTest()`      |
| Add questions   | POST   | `/admin/exam/parts/:part_id/questions`  | `useAdminAddQuestionsToPart()` |
| Update question | PATCH  | `/admin/exam/questions/:question_id`    | `useAdminUpdateQuestion()`     |
| Delete question | DELETE | `/admin/exam/questions/:question_id`    | `useAdminDeleteQuestion()`     |
| Test statistics | GET    | `/admin/exam/tests/:test_id/statistics` | `useAdminTestStatistics()`     |

### Course APIs:

| Action           | Method | Endpoint                          | Frontend Hook               |
| ---------------- | ------ | --------------------------------- | --------------------------- |
| List courses     | GET    | `/course`                         | `useClientCourses()`        |
| Course detail    | GET    | `/course/courses/:id/preview`     | `useAdminCourseDetail()`    |
| Course structure | GET    | `/course/:id/structure`           | `useAdminCourseStructure()` |
| Create course    | POST   | `/instructor/courses`             | `useCreateCourse()`         |
| Update course    | PATCH  | `/instructor/courses/:id`         | `useUpdateCourse()`         |
| Delete course    | DELETE | `/admin/courses/:id`              | `useAdminRemoveCourse()`    |
| Add module       | POST   | `/instructor/courses/:id/modules` | `useAddModule()`            |
| Update module    | PATCH  | `/instructor/modules/:id`         | `useUpdateModule()`         |
| Delete module    | DELETE | `/instructor/modules/:id`         | `useDeleteModule()`         |
| Add lesson       | POST   | `/instructor/modules/:id/lessons` | `useAddLesson()`            |
| Update lesson    | PATCH  | `/instructor/lessons/:id`         | `useUpdateLesson()`         |
| Delete lesson    | DELETE | `/instructor/lessons/:id`         | `useDeleteLesson()`         |

---

## 🎨 TANSTACK QUERY CACHE MANAGEMENT

### Assessment Cache Keys:

```javascript
adminExamKeys = {
  all: ["admin", "exam"],
  tests: () => [...adminExamKeys.all, "tests"],
  testList: () => [...adminExamKeys.tests(), "list"],
  testDetail: (id) => [...adminExamKeys.tests(), "detail", id],
  statistics: (testId) => [...adminExamKeys.testDetail(testId), "statistics"],
};
```

### Course Cache Keys:

```javascript
adminCoursesKeys = {
  all: ["admin", "courses"],
  courses: () => [...adminCoursesKeys.all, "list"],
  courseList: (filters) => [...adminCoursesKeys.courses(), filters],
  courseDetail: (id) => [...adminCoursesKeys.all, "detail", id],
  modules: (courseId) => [
    ...adminCoursesKeys.courseDetail(courseId),
    "modules",
  ],
};
```

### Cache Invalidation Strategy:

- Sau mỗi mutation thành công → invalidate related queries
- Ví dụ: Sau khi tạo test → invalidate `["ListExamsAdmin"]` và `adminExamKeys.tests()`
- Sau khi update course → invalidate `courseDetail(courseId)` và `courses()`

---

## 📊 DATABASE MODELS

### Assessment Models:

- `Test` (tests table)
- `Part` (parts table)
- `Question` (questions table)
- `Choice` (choices table)
- `ExamSession` (exam_sessions table)
- `UserAnswer` (user_answers table)

### Course Models:

- `Course` (courses table)
- `Module` (modules table)
- `Lesson` (lessons table)
- `Category` (categories table)
- `Instructor` (instructors table)
- `CourseReview` (course_reviews table)

---

## 🔐 AUTHENTICATION & AUTHORIZATION

- Tất cả admin routes đều có `authMiddleware`
- Frontend: Token được lưu trong localStorage/cookies
- Backend: Verify token trong `authMiddleware.js`
- Routes được mount tại: `/api/admin/exam/*` và `/api/admin/course/*`

---

## 🎯 ĐIỂM QUAN TRỌNG

1. **Assessment**: Pipeline tạo exam là 3 bước tuần tự (Test → Parts → Questions)
2. **Course**: Pipeline tạo course là 3 bước tuần tự (Course → Modules → Lessons)
3. **Cache**: Tanstack Query tự động quản lý cache, invalidate khi cần
4. **Error Handling**: Tất cả mutations đều có `onError` để hiển thị toast
5. **Loading States**: Sử dụng `isLoading` từ queries để hiển thị loading UI
6. **Optimistic Updates**: Chưa implement, có thể thêm sau

---

**Tài liệu này mô tả toàn bộ luồng từ Frontend → API → Backend → Database cho cả Assessment và Course management.**
