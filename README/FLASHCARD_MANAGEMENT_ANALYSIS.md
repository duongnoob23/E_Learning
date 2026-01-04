# PHÂN TÍCH VÀ THIẾT KẾ LẠI FLASHCARD MANAGEMENT

## PHẦN 1: PHÂN TÍCH HIỆN TRẠNG

### 1.1. Database Models

#### Topic Model (`backend/src/models/Topic.js`)
```javascript
{
  topic_id: BIGINT (PK, auto-increment),
  topic_name: STRING(255) (required),
  description: TEXT (optional),
  image_url: STRING(255) (optional),
  logo_url: STRING(255) (optional),
  topic_type: ENUM("system", "user_created") (required),
  created_by: BIGINT (optional, FK to User),
  is_public: BOOLEAN (default: true),
  is_active: BOOLEAN (default: true),
  word_count: INTEGER (default: 0),
  created_at: DATE,
  updated_at: DATE
}
```

**Quan hệ:**
- `Topic` has many `Word` (through `topic_id`)
- `Topic` belongs to `User` (as "creator", through `created_by`)

#### Word Model (`backend/src/models/Word.js`)
```javascript
{
  word_id: BIGINT (PK, auto-increment),
  topic_id: BIGINT (required, FK to Topic),
  word: STRING(255) (required),
  part_of_speech: STRING(50) (optional),
  audio_url: STRING(255) (optional),
  pronunciation: STRING(255) (optional),
  meaning_vi: TEXT (required),
  example_en: TEXT (optional),
  example_vi: TEXT (optional),
  image_url: STRING(255) (optional),
  notes: TEXT (optional),
  word_type: ENUM("system", "user_created") (default: "system"),
  created_by: BIGINT (optional, FK to User),
  is_active: BOOLEAN (default: true),
  created_at: DATE,
  updated_at: DATE
}
```

**Quan hệ:**
- `Word` belongs to `Topic` (through `topic_id`)
- `Word` belongs to `User` (as "wordCreator", through `created_by`)

### 1.2. Backend API Endpoints

#### Topic APIs (`/admin/vocabulary/topics`)
- ✅ `GET /admin/vocabulary/topics` - Lấy danh sách topics (phân trang, filter, search)
- ✅ `GET /admin/vocabulary/topics/all` - Lấy tất cả topics (không phân trang, cho dropdown)
- ✅ `POST /admin/vocabulary/topics` - Tạo topic mới
- ✅ `PATCH /admin/vocabulary/topics/:topic_id` - Cập nhật topic
- ✅ `DELETE /admin/vocabulary/topics/:topic_id` - Xóa mềm topic (soft delete)
- ✅ `PATCH /admin/vocabulary/topics/:topic_id/toggle-active` - Toggle active/inactive

#### Word APIs (`/admin/vocabulary/words`)
- ✅ `GET /admin/vocabulary/words` - Lấy danh sách words (phân trang, filter, search, có thể filter theo `topic_id`)
- ✅ `GET /admin/vocabulary/words/:word_id` - Lấy chi tiết word
- ✅ `POST /admin/vocabulary/words` - Tạo word mới (yêu cầu `topic_id`)
- ✅ `PATCH /admin/vocabulary/words/:word_id` - Cập nhật word
- ✅ `DELETE /admin/vocabulary/words/:word_id` - Xóa mềm word (soft delete, `?hard=true` để xóa cứng)
- ✅ `PATCH /admin/vocabulary/words/:word_id/toggle-active` - Toggle active/inactive
- ✅ `PATCH /admin/vocabulary/words/:word_id/restore` - Khôi phục word đã xóa

#### Batch Operations
- ✅ `POST /admin/vocabulary/words/batch-import` - Import nhiều words (yêu cầu `topic_id`)
- ✅ `POST /admin/vocabulary/words/check-duplicates` - Kiểm tra từ trùng lặp
- ✅ `POST /admin/vocabulary/words/batch-delete` - Xóa hàng loạt
- ✅ `POST /admin/vocabulary/words/batch-toggle-active` - Toggle active hàng loạt

#### Statistics
- ✅ `GET /admin/vocabulary/statistics` - Lấy thống kê (total_words, active_words, total_topics, etc.)

#### Upload
- ✅ `POST /admin/vocabulary/upload/image` - Upload ảnh cho word
- ✅ `POST /admin/vocabulary/upload/audio` - Upload audio cho word

### 1.3. Frontend Hiện Tại

#### Current Structure
- **Location:** `frontend/Shopery/src/Admin/features/words/`
- **Main Page:** `WordsPage.jsx` - Quản lý word rời rạc
- **API Layer:** `wordsAdminApi.jsx` - Đã có đầy đủ API cho Topic và Word
- **Hooks:** 
  - `useWordsAdminQueries.jsx` - Queries cho words và topics
  - `useWordsAdminMutations.jsx` - Mutations cho words và topics

#### Vấn Đề Hiện Tại
1. **WordsPage.jsx** hiển thị danh sách word rời rạc, không tập trung vào Topic
2. Có filter theo topic nhưng không có entry point quản lý Topic trước
3. Không có trang quản lý Topic riêng
4. Không có trang chi tiết Topic để quản lý words trong topic đó
5. Admin phải chọn topic từ dropdown khi tạo word, không có flow: Topic → Words

### 1.4. API Có Thể Tái Sử Dụng

✅ **Tất cả API đã có sẵn và đầy đủ:**
- Topic CRUD APIs
- Word CRUD APIs (đã có filter theo `topic_id`)
- Batch operations
- Statistics
- Upload

**Không cần tạo API mới**, chỉ cần refactor frontend.

---

## PHẦN 2: ĐỊNH NGHĨA LẠI MỤC ĐÍCH QUẢN LÝ

### 2.1. Mục Tiêu Mới

**FLASHCARD TOPIC → WORDS**

- Admin quản lý **TOPIC** làm entry point
- Trong mỗi **TOPIC** mới có danh sách **WORDS**
- Word chỉ tồn tại trong context của một Topic
- Không quản lý word rời rạc nữa

### 2.2. Phân Biệt Topic Types

- **SYSTEM Topic:** Topic hệ thống, admin toàn quyền CRUD
- **USER Topic:** Topic do user tạo, hiển thị rõ nhãn, có thể giới hạn chỉnh sửa

---

## PHẦN 3: CÁC CHỨC NĂNG QUẢN LÝ CẦN CÓ

### 3.1. QUẢN LÝ TOPIC FLASHCARD

#### A. Xem Danh Sách Topic
- **Endpoint:** `GET /admin/vocabulary/topics`
- **Features:**
  - Phân trang
  - Search theo `topic_name`, `description`
  - Filter theo `is_active`, `topic_type`
  - Sort theo `created_at`, `topic_name`, `word_count`
  - Hiển thị 2 chế độ: **LIST VIEW** và **GRID VIEW**

#### B. Tạo Mới Topic
- **Endpoint:** `POST /admin/vocabulary/topics`
- **Required Fields:**
  - `topic_name` (required)
  - `description` (optional)
  - `image_url` (optional)
  - `topic_type` (default: "system")
- **Flow:** Modal hoặc page tạo Topic mới

#### C. Cập Nhật Topic
- **Endpoint:** `PATCH /admin/vocabulary/topics/:topic_id`
- **Fields có thể update:**
  - `topic_name`, `description`, `image_url`, `logo_url`, `is_active`, `is_public`

#### D. Xóa Mềm Topic
- **Endpoint:** `DELETE /admin/vocabulary/topics/:topic_id`
- **Logic:** Set `is_active = false` (soft delete)
- **Lưu ý:** Không xóa words, chỉ vô hiệu hóa topic

#### E. Toggle Active Topic
- **Endpoint:** `PATCH /admin/vocabulary/topics/:topic_id/toggle-active`

### 3.2. QUẢN LÝ WORD TRONG TOPIC

#### A. Xem Danh Sách Word của Topic
- **Endpoint:** `GET /admin/vocabulary/words?topic_id={topic_id}`
- **Features:**
  - Chỉ hiển thị words thuộc topic đó
  - Phân trang
  - Search trong topic
  - Filter theo `is_active`
  - Sort theo `word`, `created_at`

#### B. Thêm Word vào Topic
- **Endpoint:** `POST /admin/vocabulary/words`
- **Required Fields:**
  - `topic_id` (required - tự động từ context)
  - `word` (required)
  - `meaning_vi` (required)
- **Optional Fields:**
  - `part_of_speech`, `pronunciation`, `audio_url`, `image_url`, `example_en`, `example_vi`, `notes`

#### C. Cập Nhật Word
- **Endpoint:** `PATCH /admin/vocabulary/words/:word_id`
- **Lưu ý:** Có thể đổi `topic_id` (chuyển word sang topic khác)

#### D. Xóa Word
- **Endpoint:** `DELETE /admin/vocabulary/words/:word_id`
- **Logic:** Soft delete (`is_active = false`) hoặc hard delete (`?hard=true`)

#### E. Batch Operations
- **Import nhiều words:** `POST /admin/vocabulary/words/batch-import`
- **Xóa hàng loạt:** `POST /admin/vocabulary/words/batch-delete`
- **Toggle active hàng loạt:** `POST /admin/vocabulary/words/batch-toggle-active`

---

## PHẦN 4: UI/UX - TRANG QUẢN LÝ FLASHCARD

### 4.1. ENTRY POINT - Trang Quản Lý Topic

**Route:** `/admin/flashcards` hoặc `/admin/vocabulary` (giữ nguyên route cũ)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Breadcrumb: Home / Flashcard Management        │
├─────────────────────────────────────────────────┤
│  Header:                                        │
│  - Title: "Flashcard Management"                │
│  - Button: "+ Create Topic"                     │
├─────────────────────────────────────────────────┤
│  Stats Cards:                                   │
│  - Total Topics                                 │
│  - Active Topics                                │
│  - Total Words                                  │
│  - System Topics                                │
│  - User Topics                                  │
├─────────────────────────────────────────────────┤
│  View Toggle: [List View] [Grid View]          │
├─────────────────────────────────────────────────┤
│  Search & Filters:                              │
│  - Search box                                   │
│  - Filter: All / System / User                  │
│  - Filter: All / Active / Inactive              │
│  - Sort dropdown                                │
├─────────────────────────────────────────────────┤
│  Topics List/Grid:                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Topic 1  │ │ Topic 2  │ │ [+ New]  │       │
│  │ 50 words │ │ 30 words │ │          │       │
│  │ [View]   │ │ [View]   │ │          │       │
│  └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────┘
```

### 4.2. Topic Card/Row Display

**Mỗi Topic hiển thị:**
- **Topic Name**
- **Description** (truncated)
- **Image/Thumbnail** (nếu có)
- **Word Count** (số lượng words trong topic)
- **Topic Type Badge:** "SYSTEM" hoặc "USER"
- **Status Badge:** "Active" hoặc "Inactive"
- **Actions:**
  - View (điều hướng đến trang quản lý words của topic)
  - Edit (mở modal edit topic)
  - Delete (xóa mềm topic)
  - Toggle Active

### 4.3. Tạo Topic Mới

**Flow:**
1. Click "+ Create Topic" → Mở modal hoặc navigate đến page tạo topic
2. Form fields:
   - Topic Name * (required)
   - Description
   - Image URL (hoặc upload)
   - Topic Type: System / User Created
   - Is Public: Yes / No
3. Submit → Tạo topic → Redirect đến trang quản lý words của topic đó

### 4.4. Xem Chi Tiết Topic (Trang Quản Lý Words)

**Route:** `/admin/flashcards/topics/:topic_id` hoặc `/admin/vocabulary/topics/:topic_id`

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Breadcrumb: Home / Flashcards / [Topic Name] │
├─────────────────────────────────────────────────┤
│  Topic Header:                                  │
│  - Topic Name                                   │
│  - Description                                  │
│  - Image                                        │
│  - Word Count: 50                               │
│  - Type: SYSTEM / USER                          │
│  - Actions: [Edit Topic] [Back to Topics]     │
├─────────────────────────────────────────────────┤
│  Words Management:                              │
│  - Button: "+ Add Word"                         │
│  - Button: "Import Words"                       │
│  - Search box                                   │
│  - Filter: All / Active / Inactive             │
│  - Sort dropdown                                │
├─────────────────────────────────────────────────┤
│  Words Table:                                    │
│  ┌──────┬──────────┬──────────┬──────────┐    │
│  │ Word │ Meaning  │ Status   │ Actions  │    │
│  ├──────┼──────────┼──────────┼──────────┤    │
│  │ ...  │ ...      │ Active   │ [Menu]   │    │
│  └──────┴──────────┴──────────┴──────────┘    │
└─────────────────────────────────────────────────┘
```

**Features:**
- Chỉ hiển thị words thuộc topic này
- Có thể thêm, sửa, xóa words
- Bulk actions (select multiple words)
- Import words vào topic
- Search và filter trong topic

---

## PHẦN 5: PHÂN BIỆT TOPIC SYSTEM & USER

### 5.1. Topic SYSTEM
- **Quyền:** Admin toàn quyền CRUD
- **Badge:** "SYSTEM" (màu xanh)
- **Icon:** Có thể thêm icon đặc biệt

### 5.2. Topic USER
- **Quyền:** 
  - Admin có thể xem, edit, delete
  - Có thể giới hạn edit nếu cần (tùy business logic)
- **Badge:** "USER TOPIC" (màu vàng/cam)
- **Hiển thị:** Rõ ràng đây là topic do user tạo

### 5.3. Logic Phân Biệt
- **Field:** `topic_type` trong database
- **Filter:** Có thể filter theo `topic_type` trong API
- **UI:** Hiển thị badge và có thể có icon khác nhau

---

## PHẦN 6: ĐỀ XUẤT BỔ SUNG

### 6.1. Status (Draft / Published)
**Lý do:** Có thể cần workflow: Draft → Published
**Implementation:**
- Thêm field `status: ENUM("draft", "published")` vào Topic model
- API filter theo status
- UI hiển thị status badge

### 6.2. Lock System Topic
**Lý do:** Bảo vệ system topics khỏi xóa nhầm
**Implementation:**
- Thêm field `is_locked: BOOLEAN` vào Topic model
- System topics mặc định `is_locked = true`
- Khi `is_locked = true`, không cho phép delete (chỉ toggle active)

### 6.3. Duplicate Topic
**Lý do:** Tạo topic mới từ topic có sẵn (copy words)
**Implementation:**
- Endpoint: `POST /admin/vocabulary/topics/:topic_id/duplicate`
- Logic: Copy topic + copy tất cả words (tạo mới với topic_id mới)

### 6.4. Import Words theo Topic
**Lý do:** Import nhiều words vào topic (đã có API)
**Implementation:**
- Sử dụng API có sẵn: `POST /admin/vocabulary/words/batch-import`
- UI: Modal import với file upload hoặc paste JSON
- Validate: Kiểm tra duplicates trước khi import

### 6.5. Export Words từ Topic
**Lý do:** Export words của topic ra file (JSON/CSV)
**Implementation:**
- Endpoint mới: `GET /admin/vocabulary/topics/:topic_id/export`
- Format: JSON hoặc CSV
- Download file

---

## PHẦN 7: IMPLEMENTATION PLAN

### 7.1. Tạo Trang Quản Lý Topic Mới

**File mới:**
- `frontend/Shopery/src/Admin/features/flashcards/pages/TopicsPage.jsx`
- `frontend/Shopery/src/Admin/features/flashcards/pages/TopicWordsPage.jsx`
- `frontend/Shopery/src/Admin/features/flashcards/components/TopicCard.jsx`
- `frontend/Shopery/src/Admin/features/flashcards/components/CreateTopicModal.jsx`
- `frontend/Shopery/src/Admin/features/flashcards/components/EditTopicModal.jsx`

**Tái sử dụng:**
- `wordsAdminApi.jsx` (đã có đầy đủ API)
- `useWordsAdminQueries.jsx` (đã có hooks)
- `useWordsAdminMutations.jsx` (đã có mutations)
- Components word management từ `words/` folder

### 7.2. Refactor WordsPage

**Option 1:** Giữ nguyên `WordsPage.jsx` nhưng redirect đến TopicsPage
**Option 2:** Đổi tên `WordsPage.jsx` thành `TopicsPage.jsx` và tạo `TopicWordsPage.jsx` mới

**Recommendation:** Option 2 - Tạo structure mới rõ ràng hơn

### 7.3. Routes Update

**Current:**
```javascript
<Route path="/vocabulary" element={<WordsPage />} />
```

**New:**
```javascript
<Route path="/vocabulary" element={<TopicsPage />} />
<Route path="/vocabulary/topics/:topicId" element={<TopicWordsPage />} />
```

### 7.4. Sidebar Update

**Current:**
```javascript
{ name: "Vocabulary", path: "/admin/vocabulary", icon: HiBookOpen }
```

**New:** Giữ nguyên hoặc đổi thành "Flashcards"

---

## PHẦN 8: YÊU CẦU CUỐI

### 8.1. Checklist

- [ ] Tạo `TopicsPage.jsx` - Trang quản lý topics (list/grid view)
- [ ] Tạo `TopicWordsPage.jsx` - Trang quản lý words trong topic
- [ ] Tạo `CreateTopicModal.jsx` - Modal tạo topic mới
- [ ] Tạo `EditTopicModal.jsx` - Modal edit topic
- [ ] Tái sử dụng components word management từ `words/` folder
- [ ] Update routes để support `/vocabulary` và `/vocabulary/topics/:topicId`
- [ ] Update sidebar nếu cần
- [ ] Test flow: Topics → Topic Detail → Words Management
- [ ] Test phân biệt System vs User topics
- [ ] Test CRUD operations cho cả Topic và Word

### 8.2. Code Quality

- ✅ Code dễ đọc, dễ maintain
- ✅ Tái sử dụng code có sẵn (API, hooks, components)
- ✅ UI/UX rõ ràng, đúng mục đích quản trị
- ✅ Không quản lý word rời rạc
- ✅ Kiến trúc đúng: Topic → Words
- ✅ Không sửa nửa vời

---

## PHẦN 9: NOTES

### 9.1. API Đã Có Sẵn

Tất cả API cần thiết đã có sẵn trong backend:
- ✅ Topic CRUD
- ✅ Word CRUD (có filter theo `topic_id`)
- ✅ Batch operations
- ✅ Statistics
- ✅ Upload

**Không cần tạo API mới**, chỉ cần refactor frontend.

### 9.2. Database Schema

Database schema đã đúng:
- ✅ Topic model có đầy đủ fields
- ✅ Word model có `topic_id` (quan hệ đã có)
- ✅ Quan hệ Topic → Words đã được định nghĩa

**Không cần migration**, chỉ cần refactor frontend.

### 9.3. Frontend Structure

**Current:**
```
Admin/features/words/
  - pages/WordsPage.jsx (quản lý word rời rạc)
  - components/ (word modals)
  - api/wordsAdminApi.jsx
  - hooks/
```

**New:**
```
Admin/features/flashcards/ (hoặc giữ words/)
  - pages/
    - TopicsPage.jsx (quản lý topics)
    - TopicWordsPage.jsx (quản lý words trong topic)
  - components/
    - TopicCard.jsx
    - CreateTopicModal.jsx
    - EditTopicModal.jsx
    - (tái sử dụng word components từ words/)
  - api/ (tái sử dụng wordsAdminApi.jsx)
  - hooks/ (tái sử dụng từ words/)
```

---

## KẾT LUẬN

**Backend đã sẵn sàng 100%**, chỉ cần refactor frontend để:
1. Tạo trang quản lý Topics làm entry point
2. Tạo trang quản lý Words trong Topic
3. Tái sử dụng code có sẵn (API, hooks, components)
4. Đảm bảo flow: Topics → Topic Detail → Words Management

**Không cần tạo API mới hoặc migration database.**

