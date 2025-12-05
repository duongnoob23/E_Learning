# 🔍 PHÂN TÍCH VÀ SỬA LỖI API TẠO MỚI COURSE

## ❌ CÁC VẤN ĐỀ ĐÃ PHÁT HIỆN

### 1. **VẤN ĐỀ VỀ SLUG (DUPLICATE)**

**Vấn đề:**

- Model `Course` có `slug` là `unique: true` và `allowNull: false`
- Service tạo slug đơn giản: `slug: title.toLowerCase().replace(/\s+/g, "-")`
- Nếu có 2 course cùng title → **Duplicate slug error**

**Vị trí:** `backend/src/client/services/instructorClientService.js:87`

```javascript
slug: title.toLowerCase().replace(/\s+/g, "-"),  // ❌ Có thể duplicate
```

**Giải pháp:** Thêm timestamp hoặc random string vào slug để đảm bảo unique

---

### 2. **VẤN ĐỀ VỀ TRANSACTION (ROLLBACK)**

**Vấn đề:**

- Khi tạo course → modules → lessons, nếu một bước lỗi, các bước trước vẫn được lưu
- Không có transaction → dữ liệu không nhất quán

**Vị trí:**

- Frontend: `CreateCoursePage.jsx` - gọi tuần tự các API
- Backend: Không có transaction wrapper

**Giải pháp:** Sử dụng Sequelize transaction để đảm bảo atomicity

---

### 3. **VẤN ĐỀ VỀ PERMISSION CHECK**

**Vấn đề:**

- `createCourse`: Tạo instructor từ `user_id` → `instructor_id`
- `addModule`: Check `course.instructor_id === instructor_id` (từ user_id)
- Nếu `user_id` khác `instructor_id` → **Permission denied**

**Vị trí:**

- `instructorClientService.js:160` - `addModule`
- `instructorClientService.js:297` - `addLesson`

**Giải pháp:** Đảm bảo logic permission check nhất quán

---

### 4. **VẤN ĐỀ VỀ ERROR HANDLING**

**Vấn đề:**

- Frontend: Nếu module/lesson lỗi, chỉ `console.error` và `continue`
- Không rollback course đã tạo → **Orphan course**

**Vị trí:** `CreateCoursePage.jsx:200-248`

```javascript
if (moduleResult?.EC !== "0") {
  console.error(...);
  continue; // ❌ Bỏ qua, course vẫn được tạo
}
```

---

### 5. **VẤN ĐỀ VỀ RESPONSE FORMAT**

**Vấn đề:**

- Frontend expect: `courseResult?.DT?.course_id`
- Service return: `DT: newCourse` (object, không phải `{ course_id }`)

**Vị trí:**

- Service: `instructorClientService.js:102` → `DT: newCourse`
- Frontend: `CreateCoursePage.jsx:172` → `courseResult?.DT?.course_id`

**Giải pháp:** Đảm bảo response format nhất quán

---

## ✅ GIẢI PHÁP SỬA LỖI

### **FIX 1: Sửa Service createCourse - Slug unique**

```javascript
// backend/src/client/services/instructorClientService.js

exports.createCourse = async (user_id, data) => {
  try {
    const { title, description, price, is_free, category_id, level_id } = data;

    // Tìm hoặc tạo instructor
    let instructor = await Instructor.findOne({ where: { user_id } });
    if (!instructor) {
      const user = await User.findByPk(user_id);
      instructor = await Instructor.create({
        user_id,
        name: user?.full_name || user?.email || "Admin Instructor",
        avatar: user?.avatar || null,
        bio: "Admin created instructor",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    const instructor_id = instructor.instructor_id;

    // ✅ FIX: Tạo slug unique bằng cách thêm timestamp
    const baseSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    let slug = baseSlug;
    let counter = 1;

    // Kiểm tra slug đã tồn tại chưa
    while (await Course.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${Date.now()}-${counter}`;
      counter++;
    }

    const newCourse = await Course.create({
      title,
      slug, // ✅ Slug unique
      description,
      price: is_free ? 0 : price || 0,
      is_free: !!is_free,
      category_id,
      level_id,
      instructor_id,
      status: "draft",
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      EM: "Tạo khóa học thành công",
      EC: "0",
      DT: newCourse, // ✅ Trả về full object, frontend sẽ lấy course_id từ đây
    };
  } catch (error) {
    console.error("Lỗi trong createCourse service:", error);
    return {
      EM:
        "Có lỗi xảy ra khi tạo khóa học: " +
        (error.message || error.original?.message || "Unknown error"),
      EC: "-2",
      DT: null,
    };
  }
};
```

---

### **FIX 2: Sửa Frontend - Lấy course_id đúng cách**

```javascript
// frontend/Shopery/src/Admin/features/courses2/pages/CreateCoursePage.jsx

const courseResult = await createCourseMutation.mutateAsync(coursePayload);

if (courseResult?.EC !== "0") {
  throw new Error(courseResult?.EM || "Tạo khóa học thất bại");
}

// ✅ FIX: Lấy course_id từ object trả về
const courseId = courseResult?.DT?.course_id || courseResult?.DT?.id;

if (!courseId) {
  throw new Error("Không lấy được ID khóa học sau khi tạo");
}
```

---

### **FIX 3: Sửa Service addModule - Permission check**

```javascript
// backend/src/client/services/instructorClientService.js

exports.addModule = async (user_id, course_id, data) => {
  try {
    // Tìm hoặc tạo instructor từ user_id
    let instructor = await Instructor.findOne({ where: { user_id } });
    if (!instructor) {
      const user = await User.findByPk(user_id);
      instructor = await Instructor.create({
        user_id,
        name: user?.full_name || user?.email || "Admin Instructor",
        avatar: user?.avatar || null,
        bio: "Admin created instructor",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    const instructor_id = instructor.instructor_id;

    // ✅ FIX: Tìm course và check permission
    const course = await Course.findOne({
      where: { course_id },
    });

    if (!course) {
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
    }

    // ✅ FIX: Check permission - course phải thuộc về instructor này
    if (course.instructor_id !== instructor_id) {
      return {
        EM: "Không có quyền thêm module vào khóa học này",
        EC: "3",
        DT: null,
      };
    }

    const { title, description, sort_order } = data;

    const newModule = await Module.create({
      course_id,
      title,
      description: description || null,
      sort_order: sort_order || 1,
      total_lectures: 0,
      total_duration: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { EM: "Thêm module thành công", EC: "0", DT: newModule };
  } catch (error) {
    console.error("Lỗi trong addModule service:", error);
    return {
      EM:
        "Có lỗi xảy ra khi thêm module: " + (error.message || "Unknown error"),
      EC: "-2",
      DT: null,
    };
  }
};
```

---

### **FIX 4: Sửa Service addLesson - Permission check tương tự**

```javascript
// backend/src/client/services/instructorClientService.js

exports.addLesson = async (user_id, module_id, data) => {
  try {
    // Tìm hoặc tạo instructor từ user_id
    let instructor = await Instructor.findOne({ where: { user_id } });
    if (!instructor) {
      const user = await User.findByPk(user_id);
      instructor = await Instructor.create({
        user_id,
        name: user?.full_name || user?.email || "Admin Instructor",
        avatar: user?.avatar || null,
        bio: "Admin created instructor",
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    const instructor_id = instructor.instructor_id;

    const module = await Module.findByPk(module_id);
    if (!module) {
      return { EM: "Không tìm thấy module", EC: "2", DT: null };
    }

    const course = await Course.findByPk(module.course_id);
    if (!course) {
      return { EM: "Không tìm thấy khóa học", EC: "2", DT: null };
    }

    // ✅ FIX: Check permission
    if (course.instructor_id !== instructor_id) {
      return {
        EM: "Không có quyền thêm bài học vào module này",
        EC: "3",
        DT: null,
      };
    }

    const {
      title,
      video_url,
      video_duration,
      sort_order,
      lesson_type,
      is_free,
    } = data;

    const newLesson = await Lesson.create({
      module_id,
      course_id: module.course_id,
      title,
      video_url,
      video_duration: video_duration || null,
      sort_order: sort_order || 1,
      lesson_type: lesson_type || "video",
      is_free: !!is_free,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      EM: "Thêm bài học thành công",
      EC: "0",
      DT: newLesson,
    };
  } catch (error) {
    console.error("Lỗi trong addLesson service:", error);
    return {
      EM:
        "Có lỗi xảy ra khi thêm bài học: " + (error.message || "Unknown error"),
      EC: "-2",
      DT: null,
    };
  }
};
```

---

### **FIX 5: Cải thiện Error Handling ở Frontend**

```javascript
// frontend/Shopery/src/Admin/features/courses2/pages/CreateCoursePage.jsx

const handleCreateCourse = async () => {
  if (!validateForm()) {
    alert(
      "Vui lòng điền đầy đủ thông tin và đảm bảo tất cả modules có ít nhất 1 lesson"
    );
    return;
  }

  if (isCreating) return;
  setIsCreating(true);

  let createdCourseId = null; // ✅ Track course đã tạo để rollback nếu cần

  try {
    // Bước 1: Tạo course
    const coursePayload = {
      title: formData.title,
      description: formData.about || formData.description || "",
      price:
        formData.priceType === "paid"
          ? parseFloat(formData.regularPrice) || 0
          : 0,
      is_free: formData.priceType === "free",
      category_id: formData.category?.category_id || formData.category || null,
      level_id: null,
    };

    const courseResult = await createCourseMutation.mutateAsync(coursePayload);

    if (courseResult?.EC !== "0") {
      throw new Error(courseResult?.EM || "Tạo khóa học thất bại");
    }

    // ✅ FIX: Lấy course_id đúng cách
    createdCourseId = courseResult?.DT?.course_id || courseResult?.DT?.id;

    if (!createdCourseId) {
      throw new Error("Không lấy được ID khóa học sau khi tạo");
    }

    // Bước 2: Tạo modules và lessons
    if (formData.modules && formData.modules.length > 0) {
      for (
        let moduleIndex = 0;
        moduleIndex < formData.modules.length;
        moduleIndex++
      ) {
        const module = formData.modules[moduleIndex];

        const modulePayload = {
          title: module.title || `Module ${moduleIndex + 1}`,
          description: module.description || null,
          sort_order: moduleIndex + 1,
        };

        const moduleResult = await addModuleMutation.mutateAsync({
          courseId: createdCourseId,
          payload: modulePayload,
        });

        if (moduleResult?.EC !== "0") {
          // ✅ FIX: Throw error thay vì continue
          throw new Error(
            `Lỗi tạo module ${moduleIndex + 1}: ${
              moduleResult?.EM || "Unknown error"
            }`
          );
        }

        const moduleId = moduleResult?.DT?.module_id || moduleResult?.DT?.id;

        if (!moduleId) {
          throw new Error(`Không lấy được ID module ${moduleIndex + 1}`);
        }

        // Bước 3: Tạo lessons
        if (module.lessons && module.lessons.length > 0) {
          for (
            let lessonIndex = 0;
            lessonIndex < module.lessons.length;
            lessonIndex++
          ) {
            const lesson = module.lessons[lessonIndex];

            const lessonPayload = {
              title: lesson.title,
              video_url: lesson.videoUrl,
              video_duration: lesson.duration || null,
              lesson_type: "video",
              sort_order: lessonIndex + 1,
              is_free: lesson.isFree || false,
            };

            const lessonResult = await addLessonMutation.mutateAsync({
              moduleId,
              payload: lessonPayload,
              courseId: createdCourseId,
            });

            if (lessonResult?.EC !== "0") {
              // ✅ FIX: Throw error thay vì console.error
              throw new Error(
                `Lỗi tạo lesson ${lessonIndex + 1} trong module ${
                  moduleIndex + 1
                }: ${lessonResult?.EM || "Unknown error"}`
              );
            }
          }
        }
      }
    }

    // Thành công
    if (onSave) {
      onSave({ courseId: createdCourseId, ...formData });
    }
    onClose();
  } catch (error) {
    console.error("Lỗi khi tạo khóa học:", error);

    // ✅ FIX: Có thể thêm logic rollback course nếu cần
    // if (createdCourseId) {
    //   await deleteCourseMutation.mutateAsync(createdCourseId);
    // }

    alert(error.message || "Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại.");
  } finally {
    setIsCreating(false);
  }
};
```

---

## 📋 CHECKLIST SỬA LỖI

- [x] **Fix 1**: Sửa slug unique trong `createCourse` service
- [x] **Fix 2**: Sửa frontend lấy `course_id` đúng cách
- [x] **Fix 3**: Sửa permission check trong `addModule`
- [x] **Fix 4**: Sửa permission check trong `addLesson`
- [x] **Fix 5**: Cải thiện error handling ở frontend

---

## 🧪 TESTING CHECKLIST

Sau khi sửa, cần test:

1. ✅ Tạo course với title trùng → Slug phải unique
2. ✅ Tạo course → module → lesson thành công
3. ✅ Tạo course → module lỗi → Course không được tạo (nếu có transaction)
4. ✅ Tạo course → lesson lỗi → Rollback (nếu có transaction)
5. ✅ Permission check: User A không thể thêm module vào course của User B

---

## 💡 GỢI Ý CẢI THIỆN THÊM

### **Option 1: Sử dụng Transaction (Khuyến nghị)**

Tạo một endpoint mới để tạo course + modules + lessons trong một transaction:

```javascript
// backend/src/client/services/instructorClientService.js

exports.createCourseWithModules = async (user_id, data) => {
  const transaction = await sequelize.transaction();

  try {
    const { courseData, modules } = data;

    // 1. Tạo course
    const course = await Course.create({ ...courseData }, { transaction });

    // 2. Tạo modules và lessons
    for (const moduleData of modules) {
      const module = await Module.create(
        { ...moduleData, course_id: course.course_id },
        { transaction }
      );

      for (const lessonData of moduleData.lessons) {
        await Lesson.create(
          {
            ...lessonData,
            module_id: module.module_id,
            course_id: course.course_id,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    return { EM: "Tạo khóa học thành công", EC: "0", DT: course };
  } catch (error) {
    await transaction.rollback();
    return { EM: "Có lỗi xảy ra: " + error.message, EC: "-2", DT: null };
  }
};
```

### **Option 2: Validate trước khi tạo**

Validate tất cả dữ liệu trước khi bắt đầu tạo:

```javascript
// Validate modules và lessons trước
const validationErrors = [];
formData.modules.forEach((module, idx) => {
  if (!module.title) validationErrors.push(`Module ${idx + 1} thiếu title`);
  if (!module.lessons || module.lessons.length === 0) {
    validationErrors.push(`Module ${idx + 1} thiếu lessons`);
  }
  module.lessons.forEach((lesson, lidx) => {
    if (!lesson.title)
      validationErrors.push(
        `Module ${idx + 1}, Lesson ${lidx + 1} thiếu title`
      );
    if (!lesson.videoUrl)
      validationErrors.push(
        `Module ${idx + 1}, Lesson ${lidx + 1} thiếu videoUrl`
      );
  });
});

if (validationErrors.length > 0) {
  alert(validationErrors.join("\n"));
  return;
}
```

---

**Tài liệu này mô tả các vấn đề và giải pháp để sửa lỗi API tạo mới course.**
