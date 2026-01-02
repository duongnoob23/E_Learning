import React, { useEffect, useRef, useState } from "react";
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
  // QUAN TRỌNG: Ref để lưu data mới nhất từ LessonStudio (tránh vấn đề debounce)
  const latestLessonDataRef = useRef(null);

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
          (dataLessonType === "video" || dataLessonType === "video_lesson") &&
          initialData.videoUrl &&
          !lessonDataToLoad
        ) {
          const newData = {
            type: "video_lesson",
            video_url: initialData.videoUrl,
            video_type:
              initialData.videoSource === "Google Drive" ? "direct" : "youtube",
            content: initialData.content || "",
          };
          setLessonData(newData);
          latestLessonDataRef.current = newData;
        } else {
          // Load lesson_data từ initialData (cho tất cả các loại lesson)
          // QUAN TRỌNG: Nếu là video_lesson nhưng lessonDataToLoad không có video_url,
          // thử lấy từ initialData.videoUrl
          if (
            (dataLessonType === "video" || dataLessonType === "video_lesson") &&
            (!lessonDataToLoad || !lessonDataToLoad.video_url) &&
            initialData.videoUrl
          ) {
            const newData = {
              type: "video_lesson",
              video_url: initialData.videoUrl,
              video_type:
                initialData.videoSource === "Google Drive"
                  ? "direct"
                  : "youtube",
              content: lessonDataToLoad?.content || initialData.content || "",
            };
            setLessonData(newData);
            latestLessonDataRef.current = newData;
          } else {
            console.log(
              "LessonStudioModal - Loading lesson_data:",
              lessonDataToLoad
            );
            setLessonData(lessonDataToLoad || null);
            // QUAN TRỌNG: Cập nhật ref khi load initial data
            latestLessonDataRef.current = lessonDataToLoad || null;
          }
        }
        setLessonTitle(initialData.title || "");
      } else {
        // Tạo mới - reset về null
        setLessonData(null);
        latestLessonDataRef.current = null;
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
    // QUAN TRỌNG: Lưu vào ref để có thể lấy ngay khi cần (tránh vấn đề debounce)
    latestLessonDataRef.current = newData;
  };

  const validate = (dataToValidate = null) => {
    // QUAN TRỌNG: Dùng data từ parameter hoặc từ ref (mới nhất) hoặc từ state
    const dataToCheck =
      dataToValidate || latestLessonDataRef.current || lessonData;
    const newErrors = {};

    if (!lessonTitle.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề bài học";
    }

    // Validate lesson_data theo lesson_type
    if (actualLessonType === "video" || actualLessonType === "video_lesson") {
      // Video lesson: cần video_url trong lesson_data
      if (!dataToCheck || !dataToCheck.video_url?.trim()) {
        newErrors.lesson_data = "Vui lòng nhập video URL";
      }
    } else {
      // Các lesson khác: cần lesson_data có nội dung
      if (!dataToCheck) {
        newErrors.lesson_data = "Vui lòng tạo nội dung bài học trước khi lưu";
      } else {
        // Validate theo từng loại lesson
        if (dataToCheck.type && dataToCheck.type !== mappedLessonType) {
          newErrors.lesson_data = "Dữ liệu không đúng định dạng";
        }
        // Kiểm tra có ít nhất một câu hỏi/từ vựng
        if (
          dataToCheck.questions &&
          Array.isArray(dataToCheck.questions) &&
          dataToCheck.questions.length === 0
        ) {
          newErrors.lesson_data = "Vui lòng thêm ít nhất một câu hỏi";
        }
        if (
          dataToCheck.words &&
          Array.isArray(dataToCheck.words) &&
          dataToCheck.words.length === 0
        ) {
          newErrors.lesson_data = "Vui lòng thêm ít nhất một từ vựng";
        }
        // Kiểm tra vocabulary_list: cần có words
        if (
          mappedLessonType === "vocabulary_list" &&
          (!dataToCheck.words || dataToCheck.words.length === 0)
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
          if (!dataToCheck.questions || dataToCheck.questions.length === 0) {
            newErrors.lesson_data = "Vui lòng thêm ít nhất một câu hỏi";
          }
        }
        // Kiểm tra grammar_theory: cần có sections
        if (
          mappedLessonType === "grammar_theory" &&
          (!dataToCheck.sections || dataToCheck.sections.length === 0)
        ) {
          newErrors.lesson_data = "Vui lòng thêm ít nhất một phần lý thuyết";
        }
      }
    }

    console.log("Validation result:", {
      errors: newErrors,
      lessonData: dataToCheck,
      lessonType: mappedLessonType,
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // QUAN TRỌNG: Lấy data mới nhất từ ref (tránh vấn đề debounce)
    // Nếu ref có data thì dùng ref, nếu không thì dùng state
    const currentLessonData = latestLessonDataRef.current || lessonData;

    // Validate với data mới nhất
    if (!validate(currentLessonData)) {
      return;
    }

    // Tạo payload để lưu với data mới nhất
    const payload = {
      title: lessonTitle.trim(),
      lessonType: actualLessonType, // QUAN TRỌNG: Dùng actualLessonType thay vì lessonType từ props
      lesson_data: currentLessonData, // QUAN TRỌNG: Dùng data từ ref (mới nhất)
      description: initialData?.description || "",
      content: initialData?.content || "",
      isFree: initialData?.isFree || false,
    };

    // Backward compatibility: nếu là video, thêm videoUrl và videoSource
    if (
      (actualLessonType === "video" || actualLessonType === "video_lesson") &&
      currentLessonData
    ) {
      payload.videoUrl = currentLessonData.video_url || "";
      payload.videoSource =
        currentLessonData.video_type === "direct" ? "Google Drive" : "YouTube";
    }

    console.log("Saving lesson with payload:", payload);
    console.log("Current lessonData from ref:", latestLessonDataRef.current);
    console.log("Current lessonData from state:", lessonData);
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
