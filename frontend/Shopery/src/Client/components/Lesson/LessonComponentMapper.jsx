// LessonComponentMapper.jsx - Map lesson_type to component
import React from "react";

// Import components (sẽ tạo sau)
import VocabularyList from "./Vocabulary/VocabularyList";
import VocabularyMatching from "./Vocabulary/VocabularyMatching";
import VocabularyTranslation from "./Vocabulary/VocabularyTranslation";
import VocabularyQuiz from "./Vocabulary/VocabularyQuiz";
import VocabularyListening from "./Vocabulary/VocabularyListening";
import VocabularyImageChoice from "./Vocabulary/VocabularyImageChoice";
import VocabularySentenceCompletion from "./Vocabulary/VocabularySentenceCompletion";
import GrammarTheory from "./Grammar/GrammarTheory";
import VideoLesson from "./Video/VideoLesson";
import ToeicPart1 from "./Toeic/ToeicPart1";
import ToeicPart2 from "./Toeic/ToeicPart2";

// Component mapper
export const LessonComponentMapper = {
  // Loại cũ (giữ lại để backward compatibility)
  // Sử dụng VideoLesson để hỗ trợ cả YouTube và Google Cloud Storage
  video: VideoLesson,
  document: ({ lesson }) => <div>Document: {lesson.title}</div>,
  quiz: ({ lesson }) => <div>Quiz: {lesson.title}</div>,
  assignment: ({ lesson }) => <div>Assignment: {lesson.title}</div>,
  live: ({ lesson }) => <div>Live: {lesson.title}</div>,
  
  // Loại mới: Video Lesson
  video_lesson: VideoLesson,
  
  // Loại mới: Vocabulary
  vocabulary_list: VocabularyList,
  vocabulary_matching: VocabularyMatching,
  vocabulary_translation: VocabularyTranslation,
  vocabulary_quiz: VocabularyQuiz,
  vocabulary_listening: VocabularyListening,
  vocabulary_image_choice: VocabularyImageChoice,
  vocabulary_sentence_completion: VocabularySentenceCompletion,
  
  // Loại mới: Grammar
  grammar_theory: GrammarTheory,
  
  // TOEIC Parts
  toeic_part_1: ToeicPart1,
  toeic_part_2: ToeicPart2,
  // TODO: Thêm các TOEIC parts khác khi implement
  // toeic_part_3: ToeicPart3,
  // toeic_part_4: ToeicPart4,
  // toeic_part_5: ToeicPart5,
  // toeic_part_6: ToeicPart6,
  // toeic_part_7: ToeicPart7,
};

// Render component dựa trên lesson_type
export const renderLessonComponent = (lesson) => {
  if (!lesson) return null;
  
  const Component = LessonComponentMapper[lesson.lesson_type] || LessonComponentMapper.video;
  
  return <Component lesson={lesson} />;
};

export default LessonComponentMapper;



