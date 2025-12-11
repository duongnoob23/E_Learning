import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { useAdminCourseDetail, useAdminCourseStructure } from "../hooks/useCoursesAdminQueries";
import { useUpdateCourse, useUpdateModule, useUpdateLesson } from "../hooks/useCoursesAdminMutations";
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

export default function EditCourseModal({ open, onClose, courseId, onSuccess }) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch course data
  const { data: courseDetailRes, isLoading: isLoadingDetail } = useAdminCourseDetail(
    courseId,
    open && !!courseId
  );
  const { data: courseStructureRes, isLoading: isLoadingStructure } = useAdminCourseStructure(
    courseId,
    open && !!courseId
  );

  // Hooks cho mutations
  const updateCourseMutation = useUpdateCourse();
  const updateModuleMutation = useUpdateModule();
  const updateLessonMutation = useUpdateLesson();

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
          lessons: (module.lessons || []).map((lesson) => ({
            id: lesson.lesson_id,
            lesson_id: lesson.lesson_id, // Keep original ID for API calls
            title: lesson.title || "",
            description: lesson.description || lesson.content || "",
            videoSource: lesson.video_url?.includes("youtube") ? "YouTube" : 
                        lesson.video_url?.includes("vimeo") ? "Vimeo" : 
                        lesson.video_url?.includes("drive.google") ? "Google Drive" : "Local Upload",
            videoUrl: lesson.video_url || "",
            duration: lesson.video_duration || "",
            isFree: lesson.is_free || false,
          })),
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
          videoSource: course.video_preview?.includes("youtube") ? "YouTube" : 
                      course.video_preview?.includes("vimeo") ? "Vimeo" : "",
          videoUrl: course.video_preview || "",
          modules: mappedModules,
          startDate: course.start_date || "",
          language: course.language || "English",
          requirements: course.requirements || "",
          requirementsPerLine: false,
          description: course.details?.description || "",
          descriptionPerLine: false,
          durationHour: course.total_duration ? Math.floor(course.total_duration / 60).toString() : "",
          durationMinute: course.total_duration ? (course.total_duration % 60).toString() : "",
          tags: course.tags || "",
          targetedAudience: course.targeted_audience || "",
        });
      }
    }
  }, [open, courseId, courseDetailRes, courseStructureRes]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setValidationErrors({});
      setActiveTab(0);
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
        price: formData.priceType === "paid" ? parseFloat(formData.regularPrice) || 0 : 0,
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

      // Update modules and lessons if changed
      if (formData.modules && formData.modules.length > 0) {
        for (const module of formData.modules) {
          // Update module if it has module_id (existing module)
          if (module.module_id) {
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

          // Update lessons
          if (module.lessons && module.lessons.length > 0) {
            for (const lesson of module.lessons) {
              if (lesson.lesson_id) {
                // Update existing lesson
                const lessonPayload = {
                  title: lesson.title,
                  video_url: lesson.videoUrl,
                  video_duration: lesson.duration || null,
                  lesson_type: "video",
                  is_free: lesson.isFree || false,
                };
                await updateLessonMutation.mutateAsync({
                  lessonId: lesson.lesson_id,
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
      alert(error.message || "Có lỗi xảy ra khi cập nhật khóa học. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    { id: 0, name: "Course Info", icon: "📝" },
    { id: 1, name: "Course Intro Video", icon: "🎥" },
    { id: 2, name: "Course Builder", icon: "📚" },
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
          <div style={{ fontWeight: 600, fontSize: "18px" }}>
            Edit Course
          </div>
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

