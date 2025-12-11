// LessonStudio.jsx - Hệ thống tạo lesson (chỉ Editor, không có Preview)
import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    // Chỉ cập nhật nếu initialData thực sự thay đổi (không phải cùng reference)
    if (initialData && initialData !== prevInitialDataRef.current) {
      console.log(
        "LessonStudio: Updating lessonData from initialData:",
        initialData
      );
      setLessonData(initialData);
      prevInitialDataRef.current = initialData;
    } else if (!initialData && prevInitialDataRef.current !== null) {
      // Nếu không có initialData và trước đó có, reset về default
      setLessonData(getDefaultData(lessonType));
      prevInitialDataRef.current = null;
    }
  }, [initialData, lessonType]);

  // Cập nhật dữ liệu lesson
  const handleDataChange = (newData) => {
    setLessonData(newData);
  };

  return (
    <div className="lesson-studio">
      {/* Editor Content */}
      <div className="lesson-studio-content">
        <div className="lesson-studio-editor">
          <VisualEditor
            lessonType={lessonType}
            data={lessonData}
            onChange={(newData) => {
              handleDataChange(newData);
              // Tự động gọi onSave khi có thay đổi để sync với parent
              onSave?.(newData);
            }}
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
  };
  return defaults[lessonType] || {};
}
