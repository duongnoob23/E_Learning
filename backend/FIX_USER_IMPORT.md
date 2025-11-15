# ✅ Fix User Model Import Error

**Status:** ✅ Fixed

---

## 🐛 Vấn Đề

```
Error in getUsers: User.findAndCountAll is not a function
```

---

## 🔍 Nguyên Nhân

**File:** `backend/src/admin/services/userAdminService.js` (dòng 1)

```javascript
// ❌ WRONG: Import function, not model instance
const User = require("../../models/User");
```

Vấn đề: `User.js` export một **function** chứ không phải **model instance**. Nó cần được gọi với `(sequelize, DataTypes)` để tạo model.

---

## ✅ Sửa Chữa

**File:** `backend/src/admin/services/userAdminService.js`

```javascript
// ✅ CORRECT: Import model instance from models/index.js
const { User } = require("../../models");
const { Op } = require("sequelize");
```

**Giải thích:**
- `backend/src/models/index.js` đã khởi tạo tất cả models
- Nó export `User` model instance (không phải function)
- Bây giờ `User.findAndCountAll()` sẽ hoạt động

---

## 🚀 Test

```
GET http://localhost:5000/admin/users?page=1&limit=10
```

**Expected:** Users list returned ✅

---

**Status:** ✅ Fixed & Ready for Testing

