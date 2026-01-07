# LUỒNG CHẠY QUẢN LÝ NGƯỜI DÙNG (ADMIN)

## 📋 MỤC LỤC
1. [Cấu trúc Routing](#1-cấu-trúc-routing)
2. [Luồng chạy Frontend → Backend](#2-luồng-chạy-frontend--backend)
3. [Các Scenario chi tiết](#3-các-scenario-chi-tiết)
4. [API Endpoints](#4-api-endpoints)
5. [Data Flow](#5-data-flow)
6. [Cache Management](#6-cache-management)

---

## 1. CẤU TRÚC ROUTING

### 1.1. Entry Point
```
server.js
  ↓
routes/index.js
  ↓
router.use("/admin", adminRoutes)
  ↓
backend/src/routes/adminRoutes.js
  ↓
router.use("/users", userAdminRoutes)  // Base: /api/admin/users
```

### 1.2. Route Mapping
```
/api/admin/users → userAdminRoutes.js
```

---

## 2. LUỒNG CHẠY FRONTEND → BACKEND

### 2.1. Component Hierarchy
```
Admin App
  ↓
UsersPage.jsx (Main Page)
  ├── useAdminUsers() → Query Hook
  ├── useAdminUsersStats() → Query Hook
  ├── useDeleteUser() → Mutation Hook
  ├── useBanUser() → Mutation Hook
  └── useUnbanUser() → Mutation Hook
      ↓
  useUsersAdminQueries.jsx / useUsersAdminMutations.jsx
      ↓
  usersAdminApi.jsx
      ↓
  adminAxiosInstance (tự động thêm admin token)
      ↓
  Backend API
```

---

## 3. CÁC SCENARIO CHI TIẾT

### 3.1. Scenario 1: Xem danh sách users

```
1. Admin truy cập /admin/users
   ↓
2. UsersPage.jsx mount
   ↓
3. useAdminUsers({ page, limit, sort, order }) được gọi
   ↓
4. usersAdminApi.getUsers(params)
   ↓
5. GET /api/admin/users?page=1&limit=10&sort=DESC&order=created_at
   ↓
6. Backend: userAdminRoutes.js
   router.get("/", UserAdminController.getUsers)
   ↓
7. Controller: userAdminController.js
   exports.getUsers → userAdminService.getUsers(req.query)
   ↓
8. Service: userAdminService.js
   exports.getUsers(query):
   - Parse query: page, limit, sort, order
   - User.findAndCountAll({ offset, limit, order })
   - Exclude password_hash
   ↓
9. Response:
   {
     EM: "Thành công",
     EC: "0",
     DT: {
       users: [...],
       pagination: { current_page, total_pages, total_items, items_per_page }
     }
   }
   ↓
10. Frontend nhận data → Transform → Hiển thị table
```

### 3.2. Scenario 2: Xem thống kê users

```
1. UsersPage.jsx mount
   ↓
2. useAdminUsersStats() được gọi tự động
   ↓
3. usersAdminApi.getUsersStats()
   ↓
4. GET /api/admin/users/stats
   ↓
5. Backend: userAdminRoutes.js
   router.get("/stats", UserAdminController.getUsersStats)
   ↓
6. Controller: userAdminController.js
   exports.getUsersStats → userAdminService.getUsersStats()
   ↓
7. Service: userAdminService.js
   exports.getUsersStats():
   - User.count() → total_users
   - User.count({ where: { status: "active" } }) → active
   - User.count({ where: { status: "banned" } }) → banned
   - User.count({ where: { status: "inactive" } }) → inactive
   - User.count({ where: { status: "pending_verification" } }) → pending_verification
   - User.count({ where: { created_at: { [Op.gte]: today } } }) → today_new_users
   ↓
8. Response:
   {
     EM: "Thống kê người dùng thành công",
     EC: "0",
     DT: {
       total_users: 1200,
       active: 950,
       banned: 20,
       inactive: 150,
       pending_verification: 80,
       today_new_users: 12
     }
   }
   ↓
9. Frontend hiển thị stats cards ở header
```

### 3.3. Scenario 3: Xem chi tiết user

```
1. Admin click "View Details" trên user
   ↓
2. setDetailUserId(user.user_id)
   ↓
3. UserDetailModal mount với userId
   ↓
4. useAdminUserDetail(userId) được gọi
   ↓
5. usersAdminApi.getUserDetail(userId)
   ↓
6. GET /api/admin/users/:user_id
   ↓
7. Backend: userAdminRoutes.js
   router.get("/:user_id", UserAdminController.getUserDetail)
   ↓
8. Controller: userAdminController.js
   exports.getUserDetail → userAdminService.getUserDetail(user_id)
   ↓
9. Service: userAdminService.js
   exports.getUserDetail(user_id):
   - User.findOne({ where: { user_id } })
   - CourseEnrollment.findAll({ where: { user_id }, include: Course })
   - Payment.findAll({ where: { user_id }, include: Order, OrderItem, Course })
   - Tính stats: totalEnrollments, completedCourses, activeCourses, totalPayments, totalSpent
   ↓
10. Response:
    {
      EM: "Thành công",
      EC: "0",
      DT: {
        user: {...},
        enrollments: [...],
        payments: [...],
        stats: {...}
      }
    }
   ↓
11. UserDetailModal hiển thị thông tin chi tiết với các tabs:
    - Thông tin cơ bản
    - Khóa học đã đăng ký
    - Giao dịch
    - Tiến độ Flashcard
    - Lịch sử Exam
    - Tiến độ Course
```

### 3.4. Scenario 4: Tạo user mới

```
1. Admin click "Add User"
   ↓
2. setOpenCreateModal(true)
   ↓
3. CreateUserModal hiển thị
   ↓
4. Admin điền form và submit
   ↓
5. useCreateUser().mutate(payload)
   ↓
6. usersAdminApi.createUser(payload)
   ↓
7. POST /api/admin/users
   Body: { username, email, password, full_name, phone_number, status }
   ↓
8. Backend: userAdminRoutes.js
   router.post("/", UserAdminController.createUser)
   ↓
9. Controller: userAdminController.js
   exports.createUser → userAdminService.createUser(req.body)
   ↓
10. Service: userAdminService.js
    exports.createUser(data):
    - User.createUser(data) → Hash password → Create user
    ↓
11. Response: { EM: "Tạo người dùng thành công", EC: "0", DT: newUser }
    ↓
12. Frontend:
    - Toast success
    - invalidateQueries(["admin", "users"])
    - refetch() → Danh sách users tự động cập nhật
    - Close modal
```

### 3.5. Scenario 5: Xóa user

```
1. Admin click "Delete" trên user
   ↓
2. window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")
   ↓
3. useDeleteUser().mutate(userId)
   ↓
4. usersAdminApi.deleteUser(userId)
   ↓
5. DELETE /api/admin/users/:user_id
   ↓
6. Backend: userAdminRoutes.js
   router.delete("/:user_id", UserAdminController.deleteUser)
   ↓
7. Controller: userAdminController.js
   exports.deleteUser → userAdminService.deleteUser(user_id)
   ↓
8. Service: userAdminService.js
    exports.deleteUser(user_id):
    - User.deleteUser(user_id) → User.destroy({ where: { user_id } })
    ↓
9. Response: { EM: "Xóa người dùng thành công", EC: "0", DT: null }
    ↓
10. Frontend:
    - Toast success
    - invalidateQueries(["admin", "users"])
    - refetch() → User bị xóa khỏi table
```

### 3.6. Scenario 6: Chặn user

```
1. Admin click "Ban" trên user
   ↓
2. window.confirm("Bạn có chắc chắn muốn chặn người dùng này?")
   ↓
3. useBanUser().mutate(userId)
   ↓
4. usersAdminApi.banUser(userId)
   ↓
5. PATCH /api/admin/users/:user_id/ban
   ↓
6. Backend: userAdminRoutes.js
   router.patch("/:user_id/ban", UserAdminController.banUser)
   ↓
7. Controller: userAdminController.js
   exports.banUser → userAdminService.banUser(user_id)
   ↓
8. Service: userAdminService.js
    exports.banUser(user_id):
    - User.updateUser(user_id, { status: "banned" })
    ↓
9. Response: { EM: "Chặn người dùng thành công", EC: "0", DT: null }
    ↓
10. Frontend:
    - Toast success
    - invalidateQueries(["admin", "users"])
    - refetch() → Status badge tự động cập nhật thành "Banned"
```

### 3.7. Scenario 7: Bỏ chặn user

```
1. Admin click "Unban" trên user (khi status = "banned")
   ↓
2. useUnbanUser().mutate(userId)
   ↓
3. usersAdminApi.unbanUser(userId)
   ↓
4. PATCH /api/admin/users/:user_id/unban
   ↓
5. Backend: userAdminRoutes.js
   router.patch("/:user_id/unban", UserAdminController.unbanUser)
   ↓
6. Controller: userAdminController.js
   exports.unbanUser → userAdminService.unbanUser(user_id)
   ↓
7. Service: userAdminService.js
    exports.unbanUser(user_id):
    - User.updateUser(user_id, { status: "active" })
    ↓
8. Response: { EM: "Bỏ chặn người dùng thành công", EC: "0", DT: null }
    ↓
9. Frontend:
    - Toast success
    - invalidateQueries(["admin", "users"])
    - refetch() → Status badge tự động cập nhật thành "Active"
```

### 3.8. Scenario 8: Xóa hàng loạt users

```
1. Admin chọn nhiều users bằng checkbox
   ↓
2. selectedRows = [user_id1, user_id2, ...]
   ↓
3. Admin click "Delete Selected"
   ↓
4. window.confirm(`Bạn có chắc chắn muốn xóa ${selectedRows.length} người dùng?`)
   ↓
5. selectedRows.forEach(id => deleteUserMutation.mutate(id))
   ↓
6. Mỗi user được xóa theo luồng Scenario 5
   ↓
7. Sau khi tất cả xóa xong:
    - invalidateQueries(["admin", "users"])
    - refetch() → Table tự động cập nhật
    - setSelectedRows([]) → Clear selection
```

### 3.9. Scenario 9: Tìm kiếm và lọc users

```
1. Admin nhập từ khóa vào search box
   ↓
2. setSearch(keyword)
   ↓
3. filteredAndSortedUsers được tính lại (client-side filter)
   ↓
4. Filter theo:
   - username.toLowerCase().includes(keyword)
   - email.toLowerCase().includes(keyword)
   - full_name.toLowerCase().includes(keyword)
   ↓
5. Admin chọn status filter (all, active, banned, inactive, pending_verification)
   ↓
6. setStatusFilter(status)
   ↓
7. filteredAndSortedUsers được filter thêm theo status
   ↓
8. Table hiển thị kết quả đã filter
```

### 3.10. Scenario 10: Sắp xếp users

```
1. Admin click "Sort" button
   ↓
2. setShowSortMenu(true)
   ↓
3. Admin chọn field: Created Date, Username, Email
   ↓
4. setSortBy(field)
   ↓
5. Nếu field đã được chọn → toggle sortOrder (ASC ↔ DESC)
   ↓
6. useAdminUsers({ page, sort: sortOrder, order: sortBy }) được gọi lại
   ↓
7. Backend nhận query params và sort theo field + order
   ↓
8. Response trả về users đã được sort
   ↓
9. Table hiển thị với sort indicator (↑ hoặc ↓)
```

### 3.11. Scenario 11: Xem tiến độ Flashcard của user

```
1. Admin click "View Details" → UserDetailModal mở
   ↓
2. Admin click tab "Flashcard Progress"
   ↓
3. useUserFlashcardProgress(userId) được gọi
   ↓
4. usersAdminApi.getUserFlashcardProgress(userId)
   ↓
5. GET /api/admin/users/:user_id/flashcard-progress
   ↓
6. Backend: userAdminRoutes.js
   router.get("/:user_id/flashcard-progress", UserAdminController.getUserFlashcardProgress)
   ↓
7. Service: userAdminService.js
    exports.getUserFlashcardProgress(user_id):
    - Topic.findAll({ where: { is_active: true } })
    - UserWordStatus.findAll({ where: { user_id } })
    - Tính progress cho từng topic:
      * total_words, words_learned, words_learning, words_new
      * progress_percent, last_studied_at
    - Tính overall: total_words_learned, total_topics_studied, study_streak
    ↓
8. Response:
    {
      EM: "Lấy tiến độ học flashcard thành công",
      EC: "0",
      DT: {
        overall: { total_words_learned, total_topics_studied, study_streak },
        topics: [...]
      }
    }
   ↓
9. Frontend hiển thị flashcard progress trong tab
```

### 3.12. Scenario 12: Xem lịch sử Exam của user

```
1. Admin click "View Details" → UserDetailModal mở
   ↓
2. Admin click tab "Exam History"
   ↓
3. useUserExams(userId, { page, limit }) được gọi
   ↓
4. usersAdminApi.getUserExams(userId, params)
   ↓
5. GET /api/admin/users/:user_id/exams?page=1&limit=20
   ↓
6. Backend: userAdminRoutes.js
   router.get("/:user_id/exams", UserAdminController.getUserExams)
   ↓
7. Service: userAdminService.js
    exports.getUserExams(user_id, query):
    - ExamSession.findAndCountAll({ where: { user_id }, include: Test })
    - Format data: exam_session_id, test_name, exam_type, start_time, end_time, total_score, status
    ↓
8. Response:
    {
      EM: "Lấy lịch sử làm bài thi thành công",
      EC: "0",
      DT: {
        exams: [...],
        pagination: {...}
      }
    }
   ↓
9. Frontend hiển thị danh sách exam sessions trong tab
```

---

## 4. API ENDPOINTS

### 4.1. Quản lý tài khoản
| Method | Route | Controller | Service | Mô tả |
|--------|-------|------------|---------|-------|
| `GET` | `/api/admin/users` | `getUsers` | `getUsers(query)` | Lấy danh sách users (pagination) |
| `GET` | `/api/admin/users/:user_id` | `getUserDetail` | `getUserDetail(user_id)` | Lấy chi tiết user |
| `POST` | `/api/admin/users` | `createUser` | `createUser(data)` | Tạo user mới |
| `DELETE` | `/api/admin/users/:user_id` | `deleteUser` | `deleteUser(user_id)` | Xóa user |

### 4.2. Quản lý trạng thái
| Method | Route | Controller | Service | Mô tả |
|--------|-------|------------|---------|-------|
| `PATCH` | `/api/admin/users/:user_id/ban` | `banUser` | `banUser(user_id)` | Chặn user (status = "banned") |
| `PATCH` | `/api/admin/users/:user_id/unban` | `unbanUser` | `unbanUser(user_id)` | Bỏ chặn user (status = "active") |
| `PATCH` | `/api/admin/users/:user_id/status` | `updateUserStatus` | `updateUserStatus(user_id, status)` | Cập nhật status tùy ý |

### 4.3. Tìm kiếm & lọc
| Method | Route | Controller | Service | Mô tả |
|--------|-------|------------|---------|-------|
| `GET` | `/api/admin/users/search?keyword=...` | `searchUsers` | `searchUsers(keyword)` | Tìm kiếm users (username, email, full_name) |
| `GET` | `/api/admin/users/filter?from=...&to=...` | `filterUsers` | `filterUsers(from, to)` | Lọc users theo ngày tạo |

### 4.4. Thống kê
| Method | Route | Controller | Service | Mô tả |
|--------|-------|------------|---------|-------|
| `GET` | `/api/admin/users/stats` | `getUsersStats` | `getUsersStats()` | Thống kê tổng quan |
| `GET` | `/api/admin/users/stats/status` | `getUsersStatsByStatus` | `getUsersStatsByStatus()` | Thống kê theo status |

### 4.5. Tiến độ học của user
| Method | Route | Controller | Service | Mô tả |
|--------|-------|------------|---------|-------|
| `GET` | `/api/admin/users/:user_id/enrollments` | `getUserEnrollments` | `getUserEnrollments(user_id, query)` | Lấy danh sách khóa học đã đăng ký |
| `GET` | `/api/admin/users/:user_id/payments` | `getUserPayments` | `getUserPayments(user_id, query)` | Lấy danh sách giao dịch |
| `GET` | `/api/admin/users/:user_id/flashcard-progress` | `getUserFlashcardProgress` | `getUserFlashcardProgress(user_id)` | Lấy tiến độ học flashcard |
| `GET` | `/api/admin/users/:user_id/created-topics` | `getUserCreatedTopics` | `getUserCreatedTopics(user_id)` | Lấy danh sách topics user đã tạo |
| `GET` | `/api/admin/users/:user_id/exams` | `getUserExams` | `getUserExams(user_id, query)` | Lấy lịch sử làm bài thi |
| `GET` | `/api/admin/users/:user_id/exam-statistics` | `getUserExamStatistics` | `getUserExamStatistics(user_id)` | Lấy thống kê exam |
| `GET` | `/api/admin/users/:user_id/exam-results/:exam_session_id` | `getUserExamResult` | `getUserExamResult(user_id, exam_session_id)` | Lấy kết quả chi tiết bài thi |
| `GET` | `/api/admin/users/:user_id/course-progress` | `getUserCourseProgress` | `getUserCourseProgress(user_id, query)` | Lấy tiến độ học course (chi tiết) |

### 4.6. Gán role
| Method | Route | Controller | Service | Mô tả |
|--------|-------|------------|---------|-------|
| `POST` | `/api/admin/users/:user_id/roles` | `assignRoleToUser` | `assignRoleToUser(user_id, role_id)` | Gán role cho user |

---

## 5. DATA FLOW

### 5.1. Request Flow
```
Frontend (UsersPage.jsx)
  ↓
React Query Hook (useAdminUsers, useDeleteUser, ...)
  ↓
API Layer (usersAdminApi.jsx)
  ↓
HTTP Request (adminAxiosInstance)
  ↓
Backend Route (userAdminRoutes.js)
  ↓
Middleware (authMiddleware, authorizeByRole) - TẠM THỜI TẮT
  ↓
Controller (userAdminController.js)
  ↓
Service (userAdminService.js)
  ↓
Database Models (User, UserRole, CourseEnrollment, Payment, ...)
  ↓
Database (MySQL/PostgreSQL)
```

### 5.2. Response Flow
```
Database
  ↓
Models (Sequelize)
  ↓
Service (Transform data, Business logic)
  ↓
Controller (Format response: { EM, EC, DT })
  ↓
HTTP Response
  ↓
Frontend API (usersAdminApi.jsx)
  ↓
React Query (Cache, Transform)
  ↓
Component (UsersPage.jsx)
  ↓
UI Update
```

---

## 6. CACHE MANAGEMENT (REACT QUERY)

### 6.1. Query Keys Structure
```javascript
["admin", "users"]                    // All users queries
["admin", "users", "list"]            // Users list
["admin", "users", "list", filters]   // Users list with filters
["admin", "users", "detail", userId]   // User detail
["admin", "users", "stats"]            // Stats
["admin", "users", "stats", "status"]  // Stats by status
["admin", "users", "search", keyword]  // Search results
```

### 6.2. Cache Invalidation
```javascript
// Khi tạo/xóa/ban/unban user
mutation.onSuccess:
  → invalidateQueries({ queryKey: ["admin", "users"] })
  → Tất cả queries liên quan tự động refetch
```

---

## 7. ĐẶC ĐIỂM NỔI BẬT

1. ✅ **Pagination**: Hỗ trợ phân trang với `page`, `limit`
2. ✅ **Sorting**: Sắp xếp theo `order` (field) và `sort` (ASC/DESC)
3. ✅ **Filtering**: Lọc theo status, tìm kiếm theo keyword (client-side)
4. ✅ **Stats**: Thống kê real-time (total, active, banned, ...)
5. ✅ **User Progress**: Xem tiến độ flashcard, exam, course của user
6. ✅ **Bulk Operations**: Chọn nhiều users và xóa hàng loạt
7. ✅ **Soft Delete**: Có thể xóa user (hard delete)
8. ✅ **Status Management**: Quản lý status (active, banned, inactive, pending_verification)
9. ✅ **Role Assignment**: Gán role cho user
10. ❌ **Edit User**: Đã bỏ (không còn trong UI)
11. ❌ **Verify Email**: Đã bỏ (không còn trong UI)

---

## 8. SECURITY

- **Middleware**: `authMiddleware` và `authorizeByRole("admin")` (hiện tạm thời tắt)
- **Password**: Không trả về `password_hash` trong response
- **Validation**: Có thể có validator (userAdminValidator.js)

---

## 9. ERROR HANDLING

- **Service**: Trả về `{ EM, EC, DT }`
- **Controller**: Catch error → `next(error)`
- **Frontend**: Toast notification cho success/error
- **React Query**: Tự động retry và error state

---

## 10. ACTION MENU OPTIONS

### 10.1. Menu Items (sau khi bỏ Edit và Verify Email)
- ✅ **View Details**: Xem chi tiết user
- ✅ **Ban/Unban**: Chặn hoặc bỏ chặn user (tùy status hiện tại)
- ✅ **Delete**: Xóa user

### 10.2. Logic hiển thị
```javascript
// Nếu user.status === "banned"
→ Hiển thị "Unban"

// Nếu user.status !== "banned"
→ Hiển thị "Ban"
```

---

## 11. COMPONENT STRUCTURE

```
UsersPage.jsx
├── Stats Cards (Total, Active, Banned, New Today)
├── Table Tools (Search, Filter, Sort)
├── Bulk Actions Bar (khi có selection)
├── Users Table
│   ├── Checkbox column
│   ├── User info (avatar, name, username)
│   ├── Email
│   ├── Status badge
│   ├── Created date
│   └── Actions menu (View Details, Ban/Unban, Delete)
├── Pagination
└── Modals
    ├── CreateUserModal
    └── UserDetailModal
        ├── Basic Info Tab
        ├── Courses Tab
        ├── Payments Tab
        ├── Flashcard Progress Tab
        ├── Exam History Tab
        └── Course Progress Tab
```

---

## 12. STATE MANAGEMENT

### 12.1. Local State (useState)
- `openCreateModal`: Mở/đóng modal tạo user
- `search`: Từ khóa tìm kiếm
- `statusFilter`: Lọc theo status
- `sortBy`: Field để sort
- `sortOrder`: ASC hoặc DESC
- `selectedRows`: Danh sách user IDs đã chọn
- `currentPage`: Trang hiện tại
- `showFilterMenu`: Hiển thị menu filter
- `showSortMenu`: Hiển thị menu sort
- `showActionMenu`: User ID đang mở action menu
- `detailUserId`: User ID đang xem chi tiết

### 12.2. Server State (React Query)
- `useAdminUsers`: Danh sách users
- `useAdminUsersStats`: Thống kê users
- `useAdminUserDetail`: Chi tiết user
- `useUserFlashcardProgress`: Tiến độ flashcard
- `useUserExams`: Lịch sử exam
- `useUserCourseProgress`: Tiến độ course

---

## 13. MUTATIONS

### 13.1. Available Mutations
- `useCreateUser`: Tạo user mới
- `useDeleteUser`: Xóa user
- `useBanUser`: Chặn user
- `useUnbanUser`: Bỏ chặn user

### 13.2. Mutation Flow
```
1. User action (click button)
   ↓
2. Mutation.mutate(data)
   ↓
3. API call
   ↓
4. onSuccess:
   - Toast notification
   - invalidateQueries
   - Auto refetch
   ↓
5. UI update
```

---

## 14. NOTES

- ⚠️ **Middleware tạm thời tắt**: Routes không yêu cầu authentication (sẽ bật lại sau)
- ⚠️ **Client-side filtering**: Search và filter được thực hiện ở frontend, không gọi API
- ✅ **Pagination**: Backend hỗ trợ pagination, frontend chỉ hiển thị
- ✅ **Real-time stats**: Stats được fetch tự động khi component mount
- ✅ **Optimistic updates**: React Query tự động refetch sau mutations

---

**Cập nhật lần cuối**: Sau khi bỏ Edit và Verify Email features

