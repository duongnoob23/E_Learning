import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import LessonStudio from "../../../../../Client/components/Lesson/Creators/LessonStudio";
import "./LessonStudioModal.scss";

export default function LessonStudioModal({
  open,
  onClose,
  lessonType,
  initialData,
  onSave,
}) {
  const [lessonData, setLessonData] = useState(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [errors, setErrors] = useState({});

  // QUAN TRỌNG: Ưu tiên lessonType từ initialData nếu có, nếu không thì dùng từ props
  const actualLessonType =
    initialData?.lessonType ||
    initialData?.lesson_type ||
    lessonType ||
    "video";

  // Map "video" thành "video_lesson" cho VisualEditor
  const mappedLessonType =
    actualLessonType === "video" ? "video_lesson" : actualLessonType;

  useEffect(() => {
    if (open) {
      setErrors({}); // Reset errors khi mở modal

      if (initialData) {
        console.log("LessonStudioModal - Loading initialData:", initialData);
        const dataLessonType =
          initialData.lessonType ||
          initialData.lesson_type ||
          lessonType ||
          "video";

        // QUAN TRỌNG: Parse lesson_data nếu là string JSON (trường hợp từ API)
        let lessonDataToLoad = initialData.lesson_data;
        if (lessonDataToLoad && typeof lessonDataToLoad === "string") {
          try {
            lessonDataToLoad = JSON.parse(lessonDataToLoad);
            console.log(
              "LessonStudioModal - Parsed lesson_data from string:",
              lessonDataToLoad
            );
          } catch (e) {
            console.error("LessonStudioModal - Error parsing lesson_data:", e);
            lessonDataToLoad = null;
          }
        }

        // Nếu là video lesson và có videoUrl từ form cũ, chuyển đổi sang format mới
        if (
          dataLessonType === "video" &&
          initialData.videoUrl &&
          !lessonDataToLoad
        ) {
          setLessonData({
            type: "video_lesson",
            video_url: initialData.videoUrl,
            video_type:
              initialData.videoSource === "Google Drive" ? "direct" : "youtube",
            content: initialData.content || "",
          });
        } else {
          // Load lesson_data từ initialData (cho tất cả các loại lesson)
          console.log(
            "LessonStudioModal - Loading lesson_data:",
            lessonDataToLoad
          );
          setLessonData(lessonDataToLoad || null);
        }
        setLessonTitle(initialData.title || "");
      } else {
        // Tạo mới - reset về null
        setLessonData(null);
        setLessonTitle("");
      }
    }
  }, [open, initialData, lessonType]);

  // Debug log
  useEffect(() => {
    if (open) {
      console.log("LessonStudioModal opened with:", {
        lessonType,
        actualLessonType,
        mappedLessonType,
        initialData,
      });
    }
  }, [open, lessonType, actualLessonType, mappedLessonType, initialData]);

  if (!open) return null;

  // Handle data change từ LessonStudio (khi click button Lưu trong LessonStudio)
  const handleLessonStudioSave = (newData) => {
    console.log("handleLessonStudioSave called with:", newData);
    setLessonData(newData);
  };

  const validate = () => {
    const newErrors = {};

    if (!lessonTitle.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề bài học";
    }

    // Validate lesson_data theo lesson_type
    if (actualLessonType === "video") {
      // Video lesson: cần video_url trong lesson_data
      if (!lessonData || !lessonData.video_url?.trim()) {
        newErrors.lesson_data = "Vui lòng nhập video URL";
      }
    } else {
      // Các lesson khác: cần lesson_data có nội dung
      if (!lessonData) {
        newErrors.lesson_data = "Vui lòng tạo nội dung bài học trước khi lưu";
      } else {
        // Validate theo từng loại lesson
        if (lessonData.type && lessonData.type !== mappedLessonType) {
          newErrors.lesson_data = "Dữ liệu không đúng định dạng";
        }
        // Kiểm tra có ít nhất một câu hỏi/từ vựng
        if (
          lessonData.questions &&
          Array.isArray(lessonData.questions) &&
          lessonData.questions.length === 0
        ) {
          newErrors.lesson_data = "Vui lòng thêm ít nhất một câu hỏi";
        }
        if (
          lessonData.words &&
          Array.isArray(lessonData.words) &&
          lessonData.words.length === 0
        ) {
          newErrors.lesson_data = "Vui lòng thêm ít nhất một từ vựng";
        }
        // Kiểm tra vocabulary_list: cần có words
        if (
          mappedLessonType === "vocabulary_list" &&
          (!lessonData.words || lessonData.words.length === 0)
        ) {
          newErrors.lesson_data = "Vui lòng thêm ít nhất một từ vựng";
        }
        // Kiểm tra các loại có questions
        if (
          [
            "vocabulary_matching",
            "vocabulary_translation",
            "vocabulary_quiz",
            "vocabulary_listening",
            "vocabulary_image_choice",
            "vocabulary_sentence_completion",
            "toeic_part_1",
          ].includes(mappedLessonType)
        ) {
          if (!lessonData.questions || lessonData.questions.length === 0) {
            newErrors.lesson_data = "Vui lòng thêm ít nhất một câu hỏi";
          }
        }
        // Kiểm tra grammar_theory: cần có sections
        if (
          mappedLessonType === "grammar_theory" &&
          (!lessonData.sections || lessonData.sections.length === 0)
        ) {
          newErrors.lesson_data = "Vui lòng thêm ít nhất một phần lý thuyết";
        }
      }
    }

    console.log("Validation result:", {
      errors: newErrors,
      lessonData,
      lessonType: mappedLessonType,
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    // Tạo payload để lưu
    const payload = {
      title: lessonTitle.trim(),
      lessonType: actualLessonType, // QUAN TRỌNG: Dùng actualLessonType thay vì lessonType từ props
      lesson_data: lessonData, // QUAN TRỌNG: Luôn gửi lesson_data cho tất cả các loại lesson
      description: initialData?.description || "",
      content: initialData?.content || "",
      isFree: initialData?.isFree || false,
    };

    // Backward compatibility: nếu là video, thêm videoUrl và videoSource
    if (actualLessonType === "video" && lessonData) {
      payload.videoUrl = lessonData.video_url || "";
      payload.videoSource =
        lessonData.video_type === "direct" ? "Google Drive" : "YouTube";
    }

    console.log("Saving lesson with payload:", payload);
    onSave(payload);
    onClose();
  };

  return (
    <div
      className="lesson-studio-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("lesson-studio-modal__backdrop")) {
          // Không cho đóng khi click backdrop để tránh mất dữ liệu
          // onClose();
        }
      }}
    >
      <div
        className="lesson-studio-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="lesson-studio-modal__header">
          <div className="lesson-studio-modal__header-left">
            <h3>{initialData ? "Chỉnh sửa bài học" : "Tạo bài học mới"}</h3>
            <div className="lesson-studio-modal__title-input">
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => {
                  setLessonTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: null }));
                  }
                }}
                placeholder="Nhập tiêu đề bài học *"
                className={`lesson-studio-modal__title-field ${
                  errors.title ? "lesson-studio-modal__title-field--error" : ""
                }`}
              />
              {errors.title && (
                <div className="lesson-studio-modal__error">{errors.title}</div>
              )}
            </div>
            {errors.lesson_data && (
              <div className="lesson-studio-modal__error lesson-studio-modal__error--content">
                {errors.lesson_data}
              </div>
            )}
          </div>
          <button
            className="lesson-studio-modal__close"
            onClick={onClose}
            title="Đóng (dữ liệu sẽ được lưu tạm)"
          >
            <HiXMark />
          </button>
        </div>

        <div className="lesson-studio-modal__content">
          {mappedLessonType && (
            <LessonStudio
              lessonType={mappedLessonType}
              initialData={lessonData}
              onSave={handleLessonStudioSave}
            />
          )}
        </div>

        <div className="lesson-studio-modal__footer">
          <button
            type="button"
            className="lesson-studio-modal__btn"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="lesson-studio-modal__btn lesson-studio-modal__btn--primary"
            onClick={handleSave}
          >
            Lưu bài học
          </button>
        </div>
      </div>
    </div>
  );
}
