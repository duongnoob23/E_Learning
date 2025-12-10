import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AdditionalInformationTab from "../components/CreateCourse/AdditionalInformationTab";
import CourseBuilderTab from "../components/CreateCourse/CourseBuilderTab";
import CourseInfoTab from "../components/CreateCourse/CourseInfoTab";
import CourseIntroVideoTab from "../components/CreateCourse/CourseIntroVideoTab";
import { useCreateCourseWithDetails } from "../hooks/useCoursesAdminMutations";
import "./CreateCoursePage.scss";

const initialFormData = {
  // Course Info
  title: "",
  slug: "",
  about: "",
  priceType: "paid", // "paid" | "free"
  regularPrice: "",
  discountedPrice: "",
  category: null,
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

export default function CreateCoursePage({ onClose, onSave }) {
  const [activeTab, setActiveTab] = useState(0); // 0: Course Info, 1: Intro Video, 2: Builder, 3: Additional Info
  const [isCreating, setIsCreating] = useState(false);

  // Refs để scroll đến error field
  const titleRef = useRef(null);
  const slugRef = useRef(null);
  const aboutRef = useRef(null);
  const regularPriceRef = useRef(null);
  const modulesRef = useRef(null);
  // Course Intro Video refs
  const videoSourceRef = useRef(null);
  const videoUrlRef = useRef(null);
  // Additional Information refs
  const startDateRef = useRef(null);
  const requirementsRef = useRef(null);
  const descriptionRef = useRef(null);
  const durationHourRef = useRef(null);
  const durationMinuteRef = useRef(null);
  const tagsRef = useRef(null);
  const targetedAudienceRef = useRef(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const formData = watch(); // Watch all form values

  // Hooks cho mutations
  const createCourseWithDetailsMutation = useCreateCourseWithDetails();

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ thông tin đã nhập?")) {
      Object.keys(initialFormData).forEach((key) => {
        setValue(key, initialFormData[key]);
      });
      clearErrors();
      setActiveTab(0);
    }
  };

  // ✅ Function để scroll đến trường bị lỗi đầu tiên với hiệu ứng mượt mà
  const scrollToFirstError = (errorFields) => {
    // Map error field names to refs and tabs
    const errorMap = {
      title: { ref: titleRef, tab: 0 },
      slug: { ref: slugRef, tab: 0 },
      about: { ref: aboutRef, tab: 0 },
      regularPrice: { ref: regularPriceRef, tab: 0 },
      videoSource: { ref: videoSourceRef, tab: 1 },
      videoUrl: { ref: videoUrlRef, tab: 1 },
      startDate: { ref: startDateRef, tab: 3 },
      requirements: { ref: requirementsRef, tab: 3 },
      description: { ref: descriptionRef, tab: 3 },
      durationHour: { ref: durationHourRef, tab: 3 },
      durationMinute: { ref: durationMinuteRef, tab: 3 },
      tags: { ref: tagsRef, tab: 3 },
      targetedAudience: { ref: targetedAudienceRef, tab: 3 },
      modules: { ref: modulesRef, tab: 2 },
    };

    // Tìm trường lỗi đầu tiên
    const firstErrorField = Object.keys(errorFields)[0];

    if (firstErrorField) {
      const errorInfo = errorMap[firstErrorField];

      // Nếu có module hoặc lesson error, chuyển sang tab Builder
      if (
        firstErrorField.startsWith("module_") ||
        firstErrorField.startsWith("lesson_")
      ) {
        setActiveTab(2);
        setTimeout(() => {
          if (modulesRef.current) {
            // Scroll mượt mà với offset
            const element = modulesRef.current;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 100;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });

            // Thêm class error để highlight
            element.classList.add("error-highlight");
            setTimeout(() => {
              element.classList.remove("error-highlight");
            }, 2000);
          }
        }, 300);
      } else if (errorInfo) {
        // Chuyển sang tab chứa trường lỗi
        setActiveTab(errorInfo.tab);
        setTimeout(() => {
          if (errorInfo.ref?.current) {
            const element = errorInfo.ref.current;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 100;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });

            // Focus và highlight
            element.focus();
            element.classList.add("error-highlight");
            setTimeout(() => {
              element.classList.remove("error-highlight");
            }, 2000);
          }
        }, 300);
      }
    }
  };

  // ✅ Custom validation function
  const validateAllFields = async () => {
    const validationErrors = {};

    // 1. Course Info validation
    if (!formData.title || !formData.title.trim()) {
      validationErrors.title = "Course title is required";
    } else if (formData.title.trim().length < 3) {
      validationErrors.title = "Course title must be at least 3 characters";
    } else if (formData.title.trim().length > 200) {
      validationErrors.title = "Course title must be less than 200 characters";
    }

    if (!formData.slug || !formData.slug.trim()) {
      validationErrors.slug = "Course slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      validationErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formData.about || !formData.about.trim()) {
      validationErrors.about = "About course is required";
    } else if (formData.about.trim().length < 10) {
      validationErrors.about = "About course must be at least 10 characters";
    }

    if (formData.priceType === "paid") {
      if (!formData.regularPrice || parseFloat(formData.regularPrice) <= 0) {
        validationErrors.regularPrice = "Regular price must be greater than 0";
      } else if (parseFloat(formData.regularPrice) > 10000) {
        validationErrors.regularPrice =
          "Regular price must be less than $10,000";
      }
    }

    // 2. Builder validation (Modules & Lessons)
    if (!formData.modules || formData.modules.length === 0) {
      validationErrors.modules = "At least one module is required";
    } else {
      formData.modules.forEach((module, moduleIndex) => {
        if (!module.title || !module.title.trim()) {
          validationErrors[`module_${moduleIndex}_title`] = `Module ${
            moduleIndex + 1
          } title is required`;
        }
        if (!module.lessons || module.lessons.length === 0) {
          validationErrors[`module_${moduleIndex}`] = `Module ${
            moduleIndex + 1
          } must have at least one lesson`;
        } else {
          module.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title || !lesson.title.trim()) {
              validationErrors[
                `lesson_${moduleIndex}_${lessonIndex}_title`
              ] = `Lesson ${lessonIndex + 1} in Module ${
                moduleIndex + 1
              } title is required`;
            }
            if (!lesson.videoUrl || !lesson.videoUrl.trim()) {
              validationErrors[
                `lesson_${moduleIndex}_${lessonIndex}_videoUrl`
              ] = `Lesson ${lessonIndex + 1} in Module ${
                moduleIndex + 1
              } video URL is required`;
            }
          });
        }
      });
    }

    // 3. Course Intro Video validation
    if (!formData.videoSource || !formData.videoSource.trim()) {
      validationErrors.videoSource = "Video source is required";
    }

    if (
      formData.videoSource &&
      (!formData.videoUrl || !formData.videoUrl.trim())
    ) {
      validationErrors.videoUrl = "Video URL is required";
    } else if (formData.videoSource && formData.videoUrl) {
      // Validate URL format based on source
      if (
        formData.videoSource === "YouTube" &&
        !formData.videoUrl.includes("youtube.com") &&
        !formData.videoUrl.includes("youtu.be")
      ) {
        validationErrors.videoUrl = "Invalid YouTube URL format";
      } else if (
        formData.videoSource === "Vimeo" &&
        !formData.videoUrl.includes("vimeo.com")
      ) {
        validationErrors.videoUrl = "Invalid Vimeo URL format";
      } else if (
        formData.videoSource === "Google Drive" &&
        !formData.videoUrl.includes("drive.google.com")
      ) {
        validationErrors.videoUrl = "Invalid Google Drive URL format";
      }
    }

    // 4. Additional Information validation (all required)
    if (!formData.startDate || !formData.startDate.trim()) {
      validationErrors.startDate = "Start date is required";
    }

    if (!formData.requirements || !formData.requirements.trim()) {
      validationErrors.requirements = "Requirements is required";
    } else if (formData.requirements.trim().length < 5) {
      validationErrors.requirements =
        "Requirements must be at least 5 characters";
    }

    if (!formData.description || !formData.description.trim()) {
      validationErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      validationErrors.description =
        "Description must be at least 10 characters";
    }

    if (!formData.durationHour || formData.durationHour.trim() === "") {
      validationErrors.durationHour = "Duration hour is required";
    } else if (
      parseInt(formData.durationHour) < 0 ||
      parseInt(formData.durationHour) > 999
    ) {
      validationErrors.durationHour = "Duration hour must be between 0 and 999";
    }

    if (!formData.durationMinute || formData.durationMinute.trim() === "") {
      validationErrors.durationMinute = "Duration minute is required";
    } else if (
      parseInt(formData.durationMinute) < 0 ||
      parseInt(formData.durationMinute) > 59
    ) {
      validationErrors.durationMinute =
        "Duration minute must be between 0 and 59";
    }

    if (!formData.tags || !formData.tags.trim()) {
      validationErrors.tags = "Course tags is required";
    } else {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      if (tagsArray.length === 0) {
        validationErrors.tags = "At least one tag is required";
      } else if (tagsArray.length > 15) {
        validationErrors.tags = "Maximum 15 tags allowed";
      }
    }

    if (!formData.targetedAudience || !formData.targetedAudience.trim()) {
      validationErrors.targetedAudience = "Targeted audience is required";
    } else if (formData.targetedAudience.trim().length < 5) {
      validationErrors.targetedAudience =
        "Targeted audience must be at least 5 characters";
    }

    return validationErrors;
  };

  const handlePreview = async () => {
    const validationErrors = await validateAllFields();
    if (Object.keys(validationErrors).length > 0) {
      // Set errors để hiển thị
      Object.keys(validationErrors).forEach((key) => {
        setError(key, { message: validationErrors[key] });
      });
      scrollToFirstError(validationErrors);
      alert("Vui lòng điền đầy đủ thông tin trước khi preview");
      return;
    }
    console.log("Preview course:", formData);
    // TODO: Open preview modal
  };

  // ✅ Clear errors khi user nhập đúng
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && errors[name]) {
        // Validate lại trường vừa thay đổi
        const fieldValue = value[name];
        let isValid = true;

        // Validate theo từng trường
        if (name === "title") {
          isValid =
            fieldValue &&
            fieldValue.trim().length >= 3 &&
            fieldValue.trim().length <= 200;
        } else if (name === "slug") {
          isValid = fieldValue && /^[a-z0-9-]+$/.test(fieldValue);
        } else if (name === "about") {
          isValid = fieldValue && fieldValue.trim().length >= 10;
        } else if (name === "regularPrice") {
          if (formData.priceType === "paid") {
            isValid =
              fieldValue &&
              parseFloat(fieldValue) > 0 &&
              parseFloat(fieldValue) <= 10000;
          } else {
            isValid = true;
          }
        } else if (name === "videoSource") {
          isValid = fieldValue && fieldValue.trim() !== "";
        } else if (name === "videoUrl") {
          isValid = fieldValue && fieldValue.trim() !== "";
        } else if (name === "startDate") {
          isValid = fieldValue && fieldValue.trim() !== "";
        } else if (name === "requirements") {
          isValid = fieldValue && fieldValue.trim().length >= 5;
        } else if (name === "description") {
          isValid = fieldValue && fieldValue.trim().length >= 10;
        } else if (name === "durationHour") {
          isValid =
            fieldValue &&
            fieldValue.trim() !== "" &&
            parseInt(fieldValue) >= 0 &&
            parseInt(fieldValue) <= 999;
        } else if (name === "durationMinute") {
          isValid =
            fieldValue &&
            fieldValue.trim() !== "" &&
            parseInt(fieldValue) >= 0 &&
            parseInt(fieldValue) <= 59;
        } else if (name === "tags") {
          if (fieldValue && fieldValue.trim()) {
            const tagsArray = fieldValue
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t);
            isValid = tagsArray.length > 0 && tagsArray.length <= 15;
          } else {
            isValid = false;
          }
        } else if (name === "targetedAudience") {
          isValid = fieldValue && fieldValue.trim().length >= 5;
        }

        if (isValid) {
          clearErrors(name);
        }
      }

      // Clear module/lesson errors khi modules thay đổi
      if (name === "modules" && value.modules) {
        const modules = value.modules;
        // Clear module errors nếu đã có đủ modules và lessons
        if (modules.length > 0) {
          clearErrors("modules");
          modules.forEach((module, moduleIndex) => {
            if (module.title && module.title.trim()) {
              clearErrors(`module_${moduleIndex}_title`);
            }
            if (module.lessons && module.lessons.length > 0) {
              clearErrors(`module_${moduleIndex}`);
              module.lessons.forEach((lesson, lessonIndex) => {
                if (lesson.title && lesson.title.trim()) {
                  clearErrors(`lesson_${moduleIndex}_${lessonIndex}_title`);
                }
                if (lesson.videoUrl && lesson.videoUrl.trim()) {
                  clearErrors(`lesson_${moduleIndex}_${lessonIndex}_videoUrl`);
                }
              });
            }
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, errors, formData.priceType, clearErrors]);

  // ✅ Handle Create Course - CHỈ VALIDATE, KHÔNG ALERT, TỰ ĐỘNG SCROLL
  const handleCreateCourse = async () => {
    // Validate tất cả các trường
    const validationErrors = await validateAllFields();

    if (Object.keys(validationErrors).length > 0) {
      // Set errors để hiển thị trong form
      Object.keys(validationErrors).forEach((key) => {
        setError(key, { message: validationErrors[key] });
      });

      // Scroll đến trường lỗi đầu tiên (không alert)
      scrollToFirstError(validationErrors);
      return;
    }

    // Set loading state
    setIsCreating(true);

    try {
      // Log payload size trước khi gửi
      const payloadBefore = {
        // Course basic info
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        about: formData.about.trim(),
        priceType: formData.priceType,
        regularPrice: formData.regularPrice,
        discountedPrice: formData.discountedPrice,
        category: formData.category,
        category_id: formData.category?.category_id || null,

        // Intro Video
        videoSource: formData.videoSource,
        videoUrl: formData.videoUrl,

        // Additional Information
        startDate: formData.startDate,
        language: formData.language,
        requirements: formData.requirements,
        requirementsPerLine: formData.requirementsPerLine,
        description: formData.description,
        descriptionPerLine: formData.descriptionPerLine,
        durationHour: formData.durationHour,
        durationMinute: formData.durationMinute,
        tags: formData.tags,
        targetedAudience: formData.targetedAudience,

        // Modules with lessons
        modules: formData.modules.map((module, moduleIndex) => ({
          title: module.title || module.name,
          description: module.description || null,
          sort_order: moduleIndex + 1,
          lessons: (module.lessons || []).map((lesson, lessonIndex) => ({
            title: lesson.title,
            description: lesson.description || null,
            content: lesson.content || null,
            videoUrl: lesson.videoUrl,
            videoDuration: lesson.videoDuration || null,
            lessonType: lesson.lessonType || "video",
            isFree: lesson.isFree || false,
            sort_order: lessonIndex + 1,
          })),
        })),
      };

      // Log payload size
      const payloadString = JSON.stringify(payloadBefore);
      const payloadSize = payloadString.length;
      console.log("=".repeat(50));
      console.log("📦 FRONTEND - PAYLOAD SIZE BEFORE SEND");
      console.log("=".repeat(50));
      console.log(
        `📊 Total payload size: ${(payloadSize / 1024 / 1024).toFixed(2)} MB`
      );
      console.log(`📊 Total payload size: ${payloadSize} bytes`);

      // Log modules và lessons
      if (payloadBefore.modules) {
        const totalLessons = payloadBefore.modules.reduce(
          (sum, m) => sum + (m.lessons?.length || 0),
          0
        );
        console.log(`📚 Modules count: ${payloadBefore.modules.length}`);
        console.log(`📖 Total lessons: ${totalLessons}`);
      }

      console.log("=".repeat(50));

      // Gọi API
      const result = await createCourseWithDetailsMutation.mutateAsync(
        payloadBefore
      );

      if (result?.EC === "0") {
        // Success - close modal và refresh list
        if (onSave) {
          onSave(result.DT);
        }
        if (onClose) {
          onClose();
        }
      } else {
        // Error đã được xử lý trong hook (toast)
        console.error("Error creating course:", result);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      // Error đã được xử lý trong hook (toast)
    } finally {
      setIsCreating(false);
    }
  };

  const tabs = [
    { id: 0, name: "Course Info", icon: "📝" },
    { id: 1, name: "Course Intro Video", icon: "🎥" },
    { id: 2, name: "Course Builder", icon: "📚" },
    { id: 3, name: "Additional Information", icon: "ℹ️" },
  ];

  return (
    <div className="course-create-page">
      <div className="course-create-page__container">
        {/* Left Side - Accordion Menu + Content */}
        <div className="course-create-page__left">
          {/* Accordion Menu */}
          <div className="course-create-page__accordion">
            {tabs.map((tab) => (
              <React.Fragment key={tab.id}>
                <div
                  className={`course-create-page__accordion-item ${
                    activeTab === tab.id
                      ? "course-create-page__accordion-item--active"
                      : ""
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <div className="course-create-page__accordion-header">
                    <span className="course-create-page__accordion-title">
                      {tab.name}
                    </span>
                    <span className="course-create-page__accordion-icon">
                      {activeTab === tab.id ? "−" : "+"}
                    </span>
                  </div>
                </div>
                {/* Tab Content - Show directly below active tab */}
                {activeTab === tab.id && (
                  <div className="course-create-page__content">
                    {activeTab === 0 && (
                      <CourseInfoTab
                        data={formData}
                        onChange={(data) => {
                          Object.keys(data).forEach((key) => {
                            setValue(key, data[key]);
                          });
                        }}
                        errors={errors}
                        refs={{ titleRef, slugRef, aboutRef, regularPriceRef }}
                        register={register}
                      />
                    )}
                    {activeTab === 1 && (
                      <CourseIntroVideoTab
                        data={formData}
                        onChange={(data) => {
                          Object.keys(data).forEach((key) => {
                            setValue(key, data[key]);
                          });
                        }}
                        errors={errors}
                        register={register}
                      />
                    )}
                    {activeTab === 2 && (
                      <CourseBuilderTab
                        modules={formData.modules || []}
                        onChange={(modules) => {
                          setValue("modules", modules);
                        }}
                        errors={errors}
                        modulesRef={modulesRef}
                      />
                    )}
                    {activeTab === 3 && (
                      <AdditionalInformationTab
                        data={formData}
                        onChange={(data) => {
                          Object.keys(data).forEach((key) => {
                            setValue(key, data[key]);
                          });
                        }}
                        errors={errors}
                        register={register}
                        refs={{
                          startDateRef,
                          requirementsRef,
                          descriptionRef,
                          durationHourRef,
                          durationMinuteRef,
                          tagsRef,
                          targetedAudienceRef,
                        }}
                      />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Bottom Action Buttons */}
          <div className="course-create-page__actions">
            <button
              className="course-create-page__btn course-create-page__btn--reset"
              onClick={handleReset}
              type="button"
            >
              Reset All
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                style={{ marginLeft: "8px" }}
              >
                <path
                  d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M3 21a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 16M21 21v-5h-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="course-create-page__btn course-create-page__btn--preview"
              onClick={handlePreview}
              type="button"
            >
              Preview
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                style={{ marginLeft: "8px" }}
              >
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button
              className="course-create-page__btn course-create-page__btn--create"
              onClick={handleCreateCourse}
              type="button"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Course"}
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                style={{ marginLeft: "8px" }}
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side - Tips Panel */}
        <div className="course-create-page__right">
          <div className="course-create-page__tips-panel">
            <h3 className="course-create-page__tips-title">
              Course Upload Tips
            </h3>
            <ul className="course-create-page__tips-list">
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Set the Course Price option or make it free.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Standard size for the course thumbnail is 700x430.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Video section controls the course overview video.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Course Builder is where you create & organize content.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Add Topics inside Course Builder for lessons, quizzes, and
                assignments.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Prerequisites define courses required before this course.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Additional Data shows on the course single page.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
