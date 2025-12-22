// LessonStudio.jsx - Hệ thống tạo lesson (chỉ Editor, không có Preview)
import { useCallback, useEffect, useRef, useState } from "react";
import "./LessonStudio.css";
import VisualEditor from "./VisualEditor";

export default function LessonStudio({ lessonType, initialData, onSave }) {
  // Khởi tạo dữ liệu lesson
  const [lessonData, setLessonData] = useState(
    initialData || getDefaultData(lessonType)
  );

  // Cập nhật lessonData khi initialData thay đổi (khi edit)
  // Sử dụng ref để tránh reset khi đang edit
  const prevInitialDataRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    // Chỉ cập nhật nếu initialData thực sự thay đổi (không phải cùng reference)
    if (initialData && initialData !== prevInitialDataRef.current) {
      setLessonData(initialData);
      prevInitialDataRef.current = initialData;
    } else if (!initialData && prevInitialDataRef.current !== null) {
      // Nếu không có initialData và trước đó có, reset về default
      setLessonData(getDefaultData(lessonType));
      prevInitialDataRef.current = null;
    }
  }, [initialData, lessonType]);

  // QUAN TRỌNG: Debounce onSave để tránh gọi liên tục gây re-render
  const debouncedOnSave = useCallback(
    (newData) => {
      // Clear timeout trước đó
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set timeout mới - chỉ gọi onSave sau 300ms không có thay đổi
      saveTimeoutRef.current = setTimeout(() => {
        onSave?.(newData);
      }, 300);
    },
    [onSave]
  );

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Cập nhật dữ liệu lesson
  const handleDataChange = (newData) => {
    setLessonData(newData);
    // Gọi debounced onSave thay vì gọi trực tiếp
    debouncedOnSave(newData);
  };

  return (
    <div className="lesson-studio">
      {/* Editor Content */}
      <div className="lesson-studio-content">
        <div className="lesson-studio-editor">
          <VisualEditor
            lessonType={lessonType}
            data={lessonData}
            onChange={handleDataChange}
          />
        </div>
      </div>
    </div>
  );
}

// Lấy dữ liệu khởi tạo mặc định nếu initData rỗng
function getDefaultData(lessonType) {
  const defaults = {
    vocabulary_list: {
      type: "vocabulary_list",
      display_mode: "flashcard",
      words: [],
    },
    vocabulary_matching: {
      type: "vocabulary_matching",
      questions: [],
    },
    vocabulary_translation: {
      type: "vocabulary_translation",
      questions: [],
    },
    vocabulary_quiz: {
      type: "vocabulary_quiz",
      questions: [],
    },
    vocabulary_listening: {
      type: "vocabulary_listening",
      questions: [],
    },
    vocabulary_image_choice: {
      type: "vocabulary_image_choice",
      questions: [],
    },
    vocabulary_sentence_completion: {
      type: "vocabulary_sentence_completion",
      questions: [],
    },
    video_lesson: {
      type: "video_lesson",
      video_url: "",
      video_type: "youtube",
      content: "",
    },
    grammar_theory: {
      type: "grammar_theory",
      sections: [],
    },
    toeic_part_1: {
      type: "toeic_part_1",
      questions: [],
    },
    toeic_part_2: {
      type: "toeic_part_2",
      questions: [],
    },
  };
  return defaults[lessonType] || {};
}
