// VisualEditor.jsx - Editor thông minh với inline editing và visual feedback
import GrammarTheoryEditor from "./editors/GrammarTheoryEditor";
import ImageChoiceEditor from "./editors/ImageChoiceEditor";
import ListeningEditor from "./editors/ListeningEditor";
import MatchingEditor from "./editors/MatchingEditor";
import QuizEditor from "./editors/QuizEditor";
import SentenceCompletionEditor from "./editors/SentenceCompletionEditor";
import ToeicPart1Editor from "./editors/ToeicPart1Editor";
import ToeicPart2Editor from "./editors/ToeicPart2Editor";
import ToeicPart3Editor from "./editors/ToeicPart3Editor";
import ToeicPart5Editor from "./editors/ToeicPart5Editor";
import ToeicPart6Editor from "./editors/ToeicPart6Editor";
import TranslationEditor from "./editors/TranslationEditor";
import VideoLessonEditor from "./editors/VideoLessonEditor";
import VocabularyListEditor from "./editors/VocabularyListEditor";
import "./VisualEditor.css";

export default function VisualEditor({ lessonType, data, onChange }) {
  // console.log("JSON-DATA", data);
  // console.log("JSON-DATA",JSON.stringify(data,null,2));

  const handleAddItem = (type, parentPath = null) => {
    // Validate trước khi thêm
    if (type === "question") {
      if (!validateAddQuestion(data, lessonType)) {
        return;
      }
    } else if (type === "pair" && parentPath) {
      const questionIndex = parseInt(parentPath.split(".")[1]);
      const question = data.questions?.[questionIndex];
      if (question && !validateAddPair(question)) {
        alert(
          `Số cặp tối đa là ${
            (question.grid_size.rows * question.grid_size.cols) / 2
          }. Vui lòng tăng grid size trước.`
        );
        return;
      }
    } else if (
      type === "word" &&
      parentPath &&
      parentPath.includes("questions")
    ) {
      // Nếu thêm word vào question (sentence completion), cần tạo id mới
      const questionIndex = parseInt(parentPath.split(".")[1]);
      const question = data.questions?.[questionIndex];
      const maxId = Math.max(
        ...(question.shuffled_words || []).map((w) => w.id || 0),
        0
      );
      const newItem = {
        id: maxId + 1,
        text: "",
      };
      const newData = addItemToData(data, parentPath, newItem);
      onChange(newData);
      return;
    } else if (
      type === "blank" &&
      parentPath &&
      parentPath.includes("questions")
    ) {
      // Nếu thêm blank vào question (sentence completion)
      console.log("run");

      const questionIndex = parseInt(parentPath.split(".")[1]);
      console.log(questionIndex);
      const question = data.questions?.[questionIndex];
      console.log(question);
      const blankCount = (question.blanks || []).length;
      console.log(blankCount);
      console.log(question.shuffled_words?.[0]?.id);
      const newItem = {
        id: `blank${blankCount + 1}`,
        correct_word_id: question.shuffled_words?.[0]?.id || null,
      };
      const newData = addItemToData(data, parentPath, newItem);
      onChange(newData);
      return;
    }

    const newItem = getDefaultItem(lessonType, type);
    const newData = addItemToData(data, parentPath, newItem);
    onChange(newData);
  };
  // Render editor dựa trên lesson type
  const renderEditor = () => {
    switch (lessonType) {
      case "vocabulary_list":
        return <VocabularyListEditor data={data} onChange={onChange} />;
      case "vocabulary_matching":
        return <MatchingEditor data={data} onChange={onChange} />;
      case "vocabulary_translation":
        return <TranslationEditor data={data} onChange={onChange} />;
      case "vocabulary_quiz":
        return <QuizEditor data={data} onChange={onChange} />;
      case "vocabulary_listening":
        return <ListeningEditor data={data} onChange={onChange} />;
      case "vocabulary_image_choice":
        return <ImageChoiceEditor data={data} onChange={onChange} />;
      case "vocabulary_sentence_completion":
        return <SentenceCompletionEditor data={data} onChange={onChange} />;
      case "video_lesson":
        return <VideoLessonEditor data={data} onChange={onChange} />;
      case "grammar_theory":
        return <GrammarTheoryEditor data={data} onChange={onChange} />;
      case "toeic_part_1":
        return <ToeicPart1Editor data={data} onChange={onChange} />;
      case "toeic_part_2":
        return <ToeicPart2Editor data={data} onChange={onChange} />;
      case "toeic_part_3":
        return <ToeicPart3Editor data={data} onChange={onChange} />;
      case "toeic_part_5":
        return <ToeicPart5Editor data={data} onChange={onChange} />;
      case "toeic_part_6":
        return <ToeicPart6Editor data={data} onChange={onChange} />;
      default:
        return <div>Chưa hỗ trợ editor cho loại này</div>;
    }
  };

  return (
    <div className="visual-editor">
      <div className="visual-editor-header">
        {/* <h3>Visual Editor</h3>
        <button
          className="visual-editor-add-btn"
          onClick={() => {
            handleAddItem("question");
            console.log("run");
          }}
        >
          + Thêm câu hỏi
        </button> */}
      </div>
      <div className="visual-editor-content">{renderEditor()}</div>
    </div>
  );
}
function addItemToData(data, parentPath, newItem) {
  const newData = JSON.parse(JSON.stringify(data));
  if (!parentPath) {
    // Add to root questions array hoặc words array
    if (data.type === "vocabulary_list") {
      if (!newData.words) newData.words = [];
      newData.words.push(newItem);
    } else {
      if (!newData.questions) newData.questions = [];
      newData.questions.push(newItem);
    }
  } else {
    const keys = parentPath.split(".");
    let current = newData;
    for (const key of keys) {
      const index = parseInt(key);
      if (!isNaN(index)) {
        current = current[index];
      } else {
        current = current[key];
      }
    }
    if (Array.isArray(current)) {
      current.push(newItem);
    } else if (current && typeof current === "object") {
      // Xác định array cần thêm vào dựa trên type của newItem
      if (newItem.pair_id !== undefined) {
        if (!current.pairs) current.pairs = [];
        current.pairs.push(newItem);
      } else if (newItem.choice_id !== undefined) {
        if (!current.choices) current.choices = [];
        current.choices.push(newItem);
      } else if (newItem.cell_id !== undefined) {
        if (!current.grid) current.grid = { rows: 3, cols: 3, cells: [] };
        if (!current.grid.cells) current.grid.cells = [];
        current.grid.cells.push(newItem);
      } else if (newItem.image_id !== undefined) {
        if (!current.images) current.images = [];
        current.images.push(newItem);
      } else if (newItem.id && newItem.id.startsWith("blank")) {
        if (!current.blanks) current.blanks = [];
        current.blanks.push(newItem);
      } else if (newItem.id && !newItem.id.startsWith("blank")) {
        // shuffled_words
        if (!current.shuffled_words) current.shuffled_words = [];
        current.shuffled_words.push(newItem);
      } else if (newItem.word_id !== undefined) {
        if (!current.words) current.words = [];
        current.words.push(newItem);
      }
    }
  }
  return newData;
}

function getDefaultItem(lessonType, type) {
  if (type === "question") {
    return getDefaultQuestion(lessonType);
  }
  if (type === "pair") {
    return {
      pair_id: Date.now(),
      left_text: "",
      left_image_url: "",
      right_text: "",
    };
  }
  if (type === "word") {
    // Lấy ảnh ngẫu nhiên từ Unsplash
    const unsplashId = Math.floor(Math.random() * 1000);
    return {
      word_id: Date.now(),
      en: "",
      vi: "",
      image_url: `https://source.unsplash.com/400x400/?nature,${unsplashId}`,
      audio_url: "",
      example: "",
    };
  }
  if (type === "choice") {
    const unsplashId = Math.floor(Math.random() * 1000);
    return {
      choice_id: Date.now(),
      text: "",
      image_url: `https://source.unsplash.com/400x400/?object,${unsplashId}`,
      is_correct: false,
    };
  }
  if (type === "cell") {
    const unsplashId = Math.floor(Math.random() * 1000);
    return {
      cell_id: Date.now(),
      vi_text: "",
      image_url: `https://source.unsplash.com/400x400/?emotion,${unsplashId}`,
      is_correct: false,
      position: { row: 0, col: 0 },
    };
  }
  if (type === "image") {
    const unsplashId = Math.floor(Math.random() * 1000);
    return {
      image_id: Date.now(),
      image_url: `https://source.unsplash.com/400x400/?item,${unsplashId}`,
      is_correct: false,
    };
  }
  if (type === "blank") {
    return {
      id: `blank${Date.now()}`,
      correct_word_id: null,
    };
  }
  return {};
}

function getDefaultQuestion(lessonType) {
  const defaults = {
    vocabulary_matching: {
      question_id: Date.now(),
      pairs: [],
      grid_size: { rows: 4, cols: 4 },
    },
    vocabulary_translation: {
      question_id: Date.now(),
      vi_text: "",
      image_url: "",
      correct_answer: "",
    },
    vocabulary_quiz: {
      question_id: Date.now(),
      question_type: "text",
      question_text: "",
      question_image_url: "",
      question_audio_url: "",
      choices: [],
    },
    vocabulary_listening: {
      question_id: Date.now(),
      audio_url: "",
      grid: { rows: 3, cols: 3, cells: [] },
      play_count: 3,
    },
    vocabulary_image_choice: {
      question_id: Date.now(),
      question_type: "text",
      question_text: "",
      question_audio_url: "",
      images: [],
    },
    vocabulary_sentence_completion: {
      question_id: Date.now(),
      vi_text: "",
      sentence_template: "",
      shuffled_words: [],
      blanks: [],
    },
  };
  return defaults[lessonType] || { question_id: Date.now() };
}

// Validation functions
function validateAddQuestion(data, lessonType) {
  // Có thể thêm validation chung ở đây
  return true;
}

function validateAddPair(question) {
  if (!question.grid_size) return false;
  const maxPairs = (question.grid_size.rows * question.grid_size.cols) / 2;
  const currentPairs = question.pairs?.length || 0;
  return currentPairs < maxPairs;
}
