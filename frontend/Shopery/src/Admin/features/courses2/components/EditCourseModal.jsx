import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import {
  useAddLesson,
  useAddModule,
  useDeleteLesson,
  useDeleteModule,
  useUpdateCourse,
  useUpdateLesson,
  useUpdateModule,
} from "../hooks/useCoursesAdminMutations";
import {
  useAdminCourseDetail,
  useAdminCourseStructure,
} from "../hooks/useCoursesAdminQueries";
import AdditionalInformationTab from "./CreateCourse/AdditionalInformationTab";
import CourseBuilderTab from "./CreateCourse/CourseBuilderTab";
import CourseInfoTab from "./CreateCourse/CourseInfoTab";
import CourseIntroVideoTab from "./CreateCourse/CourseIntroVideoTab";
import "./EditCourseModal.scss";

const initialFormData = {
  // Course Info
  title: "",
  slug: "",
  about: "",
  priceType: "paid",
  regularPrice: "",
  discountedPrice: "",
  category: null,
  thumbnail: null,
  // Intro Video
  videoSource: "",
  videoUrl: "",
  // Builder
  modules: [],
  // Additional Information
  startDate: "",
  language: "English",
  requirements: "",
  requirementsPerLine: false,
  description: "",
  descriptionPerLine: false,
  durationHour: "",
  durationMinute: "",
  tags: "",
  targetedAudience: "",
};

export default function EditCourseModal({
  open,
  onClose,
  courseId,
  onSuccess,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [originalModules, setOriginalModules] = useState([]); // Lưu dữ liệu ban đầu để so sánh

  // Fetch course data
  const { data: courseDetailRes, isLoading: isLoadingDetail } =
    useAdminCourseDetail(courseId, open && !!courseId);
  const { data: courseStructureRes, isLoading: isLoadingStructure } =
    useAdminCourseStructure(courseId, open && !!courseId);

  // Hooks cho mutations
  const updateCourseMutation = useUpdateCourse();
  const updateModuleMutation = useUpdateModule();
  const updateLessonMutation = useUpdateLesson();
  const addModuleMutation = useAddModule();
  const addLessonMutation = useAddLesson();
  const deleteLessonMutation = useDeleteLesson();
  const deleteModuleMutation = useDeleteModule();

  // Load course data into form
  useEffect(() => {
    if (open && courseId && courseDetailRes && courseStructureRes) {
      const course = courseDetailRes?.DT?.course || courseDetailRes?.DT || null;
      const structure = courseStructureRes?.DT || null;
      const modules = structure?.modules || course?.modules || [];

      if (course) {
        // Map course data to form data
        const mappedModules = modules.map((module) => ({
          id: module.module_id,
          module_id: module.module_id, // Keep original ID for API calls
          name: module.title || module.name,
          title: module.title || module.name,
          description: module.description || "",
          lessons: (module.lessons || []).map((lesson) => {
            // Load lesson_data và lesson_type từ API
            // QUAN TRỌNG: Parse lesson_data nếu là string JSON
            let lessonData = lesson.lesson_data;
            if (lessonData && typeof lessonData === "string") {
              try {
                lessonData = JSON.parse(lessonData);
              } catch (e) {
                console.error(
                  "Error parsing lesson_data in EditCourseModal:",
                  e
                );
                lessonData = null;
              }
            }
            // Nếu lesson_data là null hoặc undefined, giữ nguyên null (không convert thành {})
            if (!lessonData) {
              lessonData = null;
            }

            const lessonType = lesson.lesson_type || "video";
            // QUAN TRỌNG: Kiểm tra lessonData trước khi truy cập thuộc tính để tránh lỗi null
            const videoUrl = lesson.video_url || lessonData?.video_url || "";
            const videoType =
              lessonData?.video_type ||
              (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
                ? "youtube"
                : "direct");

            // Detect video source từ URL và video_type
            let videoSource = "";
            if (videoUrl) {
              if (
                videoUrl.includes("youtube.com") ||
                videoUrl.includes("youtu.be")
              ) {
                videoSource = "YouTube";
              } else if (videoUrl.includes("vimeo.com")) {
                videoSource = "Vimeo";
              } else if (videoUrl.includes("drive.google.com")) {
                videoSource = "Google Drive";
              } else if (
                videoUrl.includes("storage.googleapis.com") ||
                videoUrl.includes("googleapis.com") ||
                videoUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i)
              ) {
                videoSource = "Local Upload";
              } else {
                videoSource = "Local Upload";
              }
            }

            return {
              id: lesson.lesson_id,
              lesson_id: lesson.lesson_id, // Keep original ID for API calls
              title: lesson.title || "",
              description: lesson.description || lesson.content || "",
              lessonType: lessonType, // QUAN TRỌNG: Load lesson_type
              lesson_type: lessonType, // Alias
              lesson_data: lessonData, // QUAN TRỌNG: Load lesson_data
              videoSource: videoSource,
              videoUrl: videoUrl,
              duration: lesson.video_duration || "",
              isFree: lesson.is_free || false,
            };
          }),
        }));

        setFormData({
          title: course.title || "",
          slug: course.slug || "",
          about: course.description || course.details?.about || "",
          priceType: course.is_free ? "free" : "paid",
          regularPrice: course.price?.toString() || "",
          discountedPrice: "",
          category: course.category || null,
          thumbnail: course.image || null,
          videoSource: course.video_preview?.includes("youtube")
            ? "YouTube"
            : course.video_preview?.includes("vimeo")
            ? "Vimeo"
            : "",
          videoUrl: course.video_preview || "",
          modules: mappedModules,
          startDate: course.start_date || "",
          language: course.language || "English",
          requirements: course.requirements || "",
          requirementsPerLine: false,
          description: course.details?.description || "",
          descriptionPerLine: false,
          durationHour: course.total_duration
            ? Math.floor(course.total_duration / 60).toString()
            : "",
          durationMinute: course.total_duration
            ? (course.total_duration % 60).toString()
            : "",
          tags: course.tags || "",
          targetedAudience: course.targeted_audience || "",
        });

        // Lưu dữ liệu ban đầu để so sánh khi xóa
        setOriginalModules(mappedModules);
      }
    }
  }, [open, courseId, courseDetailRes, courseStructureRes]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setValidationErrors({});
      setActiveTab(0);
      setOriginalModules([]); // Reset originalModules khi đóng modal
    }
  }, [open]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const validateForm = () => {
    const errors = {};

    // Course Info validation
    if (!formData.title.trim()) {
      errors.title = "Course title is required";
    }
    if (!formData.slug.trim()) {
      errors.slug = "Course slug is required";
    }
    if (!formData.about.trim()) {
      errors.about = "About course is required";
    }
    if (formData.priceType === "paid") {
      if (!formData.regularPrice || parseFloat(formData.regularPrice) <= 0) {
        errors.regularPrice = "Regular price is required";
      }
    }

    // Intro Video validation
    if (!formData.videoSource) {
      errors.videoSource = "Video source is required";
    }
    if (!formData.videoUrl.trim()) {
      errors.videoUrl = "Video URL is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateCourse = async () => {
    if (!validateForm()) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (isUpdating) return;
    setIsUpdating(true);

    try {
      // Update course basic info
      const coursePayload = {
        title: formData.title,
        description: formData.about || formData.description || "",
        price:
          formData.priceType === "paid"
            ? parseFloat(formData.regularPrice) || 0
            : 0,
        image: formData.thumbnail,
        video_preview: formData.videoUrl,
      };

      const courseResult = await updateCourseMutation.mutateAsync({
        courseId,
        payload: coursePayload,
      });

      if (courseResult?.EC !== "0") {
        throw new Error(courseResult?.EM || "Cập nhật khóa học thất bại");
      }

      // QUAN TRỌNG: Xử lý xóa lessons và modules trước khi update/add
      // So sánh originalModules với formData.modules để tìm lesson/module bị xóa
      if (originalModules && originalModules.length > 0) {
        for (const originalModule of originalModules) {
          const currentModule = formData.modules?.find(
            (m) => m.module_id === originalModule.module_id
          );

          if (!currentModule) {
            // Module bị xóa - xóa tất cả lessons trong module đó trước
            if (originalModule.lessons && originalModule.lessons.length > 0) {
              for (const lesson of originalModule.lessons) {
                if (lesson.lesson_id) {
                  await deleteLessonMutation.mutateAsync({
                    lessonId: lesson.lesson_id,
                    courseId,
                  });
                }
              }
            }
            // Sau đó xóa module
            if (originalModule.module_id) {
              await deleteModuleMutation.mutateAsync({
                moduleId: originalModule.module_id,
                courseId,
              });
            }
          } else {
            // Module còn tồn tại - kiểm tra lessons bị xóa
            const originalLessonIds = (originalModule.lessons || [])
              .map((l) => l.lesson_id)
              .filter(Boolean);
            const currentLessonIds = (currentModule.lessons || [])
              .map((l) => l.lesson_id)
              .filter(Boolean);

            // Tìm lessons bị xóa
            const deletedLessonIds = originalLessonIds.filter(
              (id) => !currentLessonIds.includes(id)
            );

            for (const lessonId of deletedLessonIds) {
              await deleteLessonMutation.mutateAsync({
                lessonId,
                courseId,
              });
            }
          }
        }
      }

      // Update modules and lessons if changed
      if (formData.modules && formData.modules.length > 0) {
        for (const module of formData.modules) {
          let currentModuleId = module.module_id;

          // Thêm module mới nếu không có module_id
          if (!module.module_id) {
            const modulePayload = {
              title: module.title || module.name,
              description: module.description || null,
              sort_order: formData.modules.indexOf(module) + 1,
            };
            const addModuleResult = await addModuleMutation.mutateAsync({
              courseId,
              payload: modulePayload,
            });
            if (addModuleResult?.EC === "0" && addModuleResult?.DT?.module_id) {
              currentModuleId = addModuleResult.DT.module_id;
            } else {
              throw new Error(addModuleResult?.EM || "Thêm module thất bại");
            }
          } else {
            // Update existing module
            const modulePayload = {
              title: module.title || module.name,
              description: module.description || null,
            };
            await updateModuleMutation.mutateAsync({
              moduleId: module.module_id,
              payload: modulePayload,
              courseId,
            });
          }

          // Xử lý lessons
          if (module.lessons && module.lessons.length > 0) {
            for (
              let lessonIndex = 0;
              lessonIndex < module.lessons.length;
              lessonIndex++
            ) {
              const lesson = module.lessons[lessonIndex];

              if (lesson.lesson_id) {
                // Update existing lesson
                const lessonType =
                  lesson.lessonType || lesson.lesson_type || "video";

                // Detect video_type từ videoSource và URL
                let detectedVideoType = "youtube";
                if (lesson.videoSource === "YouTube") {
                  detectedVideoType = "youtube";
                } else if (
                  lesson.videoSource === "Local Upload" ||
                  lesson.videoUrl?.includes("storage.googleapis.com") ||
                  lesson.videoUrl?.includes("googleapis.com") ||
                  lesson.videoUrl?.match(/\.(mp4|webm|ogg|mov|avi)$/i)
                ) {
                  detectedVideoType = "direct";
                }

                // QUAN TRỌNG: Map "video_lesson" thành "video" vì backend ENUM chỉ có "video"
                const lessonTypeForBackend =
                  lessonType === "video_lesson" ? "video" : lessonType;

                const lessonPayload = {
                  title: lesson.title,
                  description: lesson.description || null,
                  lesson_type: lessonTypeForBackend, // Map video_lesson -> video
                  is_free: lesson.isFree || false,
                  sort_order: lessonIndex + 1,
                };

                // Nếu là video lesson (cả "video" và "video_lesson"), thêm video_url và video_duration
                if (lessonType === "video" || lessonType === "video_lesson") {
                  // QUAN TRỌNG: Ưu tiên lấy video_url từ lesson_data (từ LessonStudioModal)
                  const videoUrlToSave =
                    lesson.lesson_data?.video_url || lesson.videoUrl || "";
                  const videoTypeToSave =
                    lesson.lesson_data?.video_type || detectedVideoType;
                  const contentToSave =
                    lesson.lesson_data?.content || lesson.description || "";

                  lessonPayload.video_url = videoUrlToSave;
                  lessonPayload.video_duration = lesson.duration || null;

                  // QUAN TRỌNG: Lưu video_type vào lesson_data
                  lessonPayload.lesson_data = {
                    type: "video_lesson",
                    video_type: videoTypeToSave,
                    video_url: videoUrlToSave,
                    content: contentToSave,
                  };
                } else {
                  // Với các lesson type khác, QUAN TRỌNG: Luôn gửi lesson_data nếu có
                  // Đảm bảo lesson_data được giữ nguyên (không bị mất khi update)
                  if (
                    lesson.lesson_data !== null &&
                    lesson.lesson_data !== undefined
                  ) {
                    lessonPayload.lesson_data = lesson.lesson_data;
                  } else {
                    // Nếu lesson_data là null, vẫn gửi null để backend biết
                    lessonPayload.lesson_data = null;
                  }
                }

                // Debug log để kiểm tra
                console.log("EditCourseModal - Updating lesson:", {
                  lesson_id: lesson.lesson_id,
                  lesson_type: lessonType,
                  title: lesson.title,
                  has_lesson_data: !!lesson.lesson_data,
                  lesson_data: lesson.lesson_data,
                  payload_lesson_data: lessonPayload.lesson_data,
                });

                await updateLessonMutation.mutateAsync({
                  lessonId: lesson.lesson_id,
                  payload: lessonPayload,
                  courseId,
                });
              } else {
                // Thêm lesson mới
                const lessonType =
                  lesson.lessonType || lesson.lesson_type || "video";

                // Detect video_type từ videoSource và URL
                let detectedVideoType = "youtube";
                if (lesson.videoSource === "YouTube") {
                  detectedVideoType = "youtube";
                } else if (
                  lesson.videoSource === "Local Upload" ||
                  lesson.videoUrl?.includes("storage.googleapis.com") ||
                  lesson.videoUrl?.includes("googleapis.com") ||
                  lesson.videoUrl?.match(/\.(mp4|webm|ogg|mov|avi)$/i)
                ) {
                  detectedVideoType = "direct";
                }

                // QUAN TRỌNG: Map "video_lesson" thành "video" vì backend ENUM chỉ có "video"
                const lessonTypeForBackend =
                  lessonType === "video_lesson" ? "video" : lessonType;

                const lessonPayload = {
                  title: lesson.title,
                  description: lesson.description || null,
                  lesson_type: lessonTypeForBackend, // Map video_lesson -> video
                  is_free: lesson.isFree || false,
                  sort_order: lessonIndex + 1,
                };

                // Nếu là video lesson (cả "video" và "video_lesson"), thêm video_url và video_duration
                if (lessonType === "video" || lessonType === "video_lesson") {
                  // QUAN TRỌNG: Ưu tiên lấy video_url từ lesson_data (từ LessonStudioModal)
                  const videoUrlToSave =
                    lesson.lesson_data?.video_url || lesson.videoUrl || "";
                  const videoTypeToSave =
                    lesson.lesson_data?.video_type || detectedVideoType;
                  const contentToSave =
                    lesson.lesson_data?.content || lesson.description || "";

                  lessonPayload.video_url = videoUrlToSave;
                  lessonPayload.video_duration = lesson.duration || null;

                  // QUAN TRỌNG: Lưu video_type vào lesson_data
                  lessonPayload.lesson_data = {
                    type: "video_lesson",
                    video_type: videoTypeToSave,
                    video_url: videoUrlToSave,
                    content: contentToSave,
                  };
                } else {
                  // Với các lesson type khác, dùng lesson_data từ form
                  if (lesson.lesson_data) {
                    lessonPayload.lesson_data = lesson.lesson_data;
                  }
                }

                await addLessonMutation.mutateAsync({
                  moduleId: currentModuleId,
                  payload: lessonPayload,
                  courseId,
                });
              }
            }
          }
        }
      }

      // Success
      if (onSuccess) {
        onSuccess({ courseId, ...formData });
      }
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật khóa học:", error);
      alert(
        error.message ||
          "Có lỗi xảy ra khi cập nhật khóa học. Vui lòng thử lại."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    { id: 0, name: "Course Info", icon: "📝" },
    { id: 1, name: "Course Intro Video", icon: "🎥" },
    { id: 2, name: "Course Builder", icon: "" },
    { id: 3, name: "Additional Information", icon: "ℹ️" },
  ];

  if (!open) return null;

  const isLoading = isLoadingDetail || isLoadingStructure;

  return (
    <div
      className="admin-edit-course-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("admin-edit-course-modal__backdrop")) {
          onClose();
        }
      }}
    >
      <div
        className="admin-edit-course-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-edit-course-modal__header">
          <div style={{ fontWeight: 600, fontSize: "18px" }}>Edit Course</div>
          <button className="admin-btn-close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <div className="admin-edit-course-modal__content">
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
              }}
            >
              Loading...
            </div>
          ) : (
            <div className="admin-edit-course-modal__form">
              {/* Accordion Menu */}
              <div className="admin-edit-course-modal__accordion">
                {tabs.map((tab) => (
                  <React.Fragment key={tab.id}>
                    <div
                      className={`admin-edit-course-modal__accordion-item ${
                        activeTab === tab.id
                          ? "admin-edit-course-modal__accordion-item--active"
                          : ""
                      }`}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <div className="admin-edit-course-modal__accordion-header">
                        <span className="admin-edit-course-modal__accordion-title">
                          {tab.name}
                        </span>
                        <span className="admin-edit-course-modal__accordion-icon">
                          {activeTab === tab.id ? "−" : "+"}
                        </span>
                      </div>
                    </div>
                    {/* Tab Content */}
                    {activeTab === tab.id && (
                      <div className="admin-edit-course-modal__content-area">
                        {activeTab === 0 && (
                          <CourseInfoTab
                            data={formData}
                            onChange={(data) =>
                              setFormData((prev) => ({ ...prev, ...data }))
                            }
                            errors={validationErrors}
                          />
                        )}
                        {activeTab === 1 && (
                          <CourseIntroVideoTab
                            data={formData}
                            onChange={(data) =>
                              setFormData((prev) => ({ ...prev, ...data }))
                            }
                            errors={validationErrors}
                          />
                        )}
                        {activeTab === 2 && (
                          <CourseBuilderTab
                            modules={formData.modules || []}
                            onChange={(modules) =>
                              setFormData((prev) => ({ ...prev, modules }))
                            }
                            errors={validationErrors}
                          />
                        )}
                        {activeTab === 3 && (
                          <AdditionalInformationTab
                            data={formData}
                            onChange={(data) =>
                              setFormData((prev) => ({ ...prev, ...data }))
                            }
                            errors={validationErrors}
                          />
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Bottom Action Buttons */}
              <div className="admin-edit-course-modal__actions">
                <button
                  className="admin-edit-course-modal__btn admin-edit-course-modal__btn--cancel"
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="admin-edit-course-modal__btn admin-edit-course-modal__btn--update"
                  onClick={handleUpdateCourse}
                  type="button"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Course"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
