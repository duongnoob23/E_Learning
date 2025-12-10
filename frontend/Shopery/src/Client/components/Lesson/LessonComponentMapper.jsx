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

// Video component (hiện tại)
const VideoPlayer = ({ lesson }) => {
  const convertYoutubeUrlToEmbed = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      let videoId = "";
      
      if (urlObj.searchParams.get("v")) {
        videoId = urlObj.searchParams.get("v");
      } else if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.replace("/", "");
      } else if (urlObj.pathname.startsWith("/embed/")) {
        videoId = urlObj.pathname.split("/embed/")[1];
      }
      
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      return null;
    }
  };

  const embedUrl = convertYoutubeUrlToEmbed(lesson.video_url);
  
  return (
    <div className="lesson-video-container">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="lesson-video-iframe"
        />
      ) : (
        <div className="lesson-video-placeholder">
          Video không khả dụng
        </div>
      )}
      {lesson.content && (
        <div className="lesson-content">
          {lesson.content.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// Component mapper
export const LessonComponentMapper = {
  // Loại cũ (giữ lại để backward compatibility)
  video: VideoPlayer,
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
};

// Render component dựa trên lesson_type
export const renderLessonComponent = (lesson) => {
  if (!lesson) return null;
  
  const Component = LessonComponentMapper[lesson.lesson_type] || LessonComponentMapper.video;
  
  return <Component lesson={lesson} />;
};

export default LessonComponentMapper;



