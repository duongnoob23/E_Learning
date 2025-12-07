import { useState } from "react";
import MultipleChoiceExercise from "./MultipleChoiceExercise";
import PairMatchingExercise from "./PairMatchingExercise";
import TranslationExercise from "./TranslationExercise";
import VocabularyListExercise from "./VocabularyListExercise";
import "./LessonExercise.css";

/**
 * Lesson Exercise Component
 * Hiển thị bài tập dựa trên exercise_type và exercise_data từ lesson
 */
export default function LessonExercise({ lesson }) {
  if (!lesson || !lesson.has_exercise || !lesson.exercise_data) {
    return null;
  }

  const exerciseData = typeof lesson.exercise_data === 'string' 
    ? JSON.parse(lesson.exercise_data) 
    : lesson.exercise_data;

  const exerciseType = lesson.exercise_type || 'multiple_choice';

  const renderExercise = () => {
    switch (exerciseType) {
      case "multiple_choice":
        return (
          <MultipleChoiceExercise
            exerciseData={exerciseData}
            passScore={lesson.pass_score}
            maxScore={lesson.max_score}
          />
        );

      case "pair_matching":
        return <PairMatchingExercise exerciseData={exerciseData} />;

      case "translation":
        return <TranslationExercise exerciseData={exerciseData} />;

      case "vocabulary_list":
        return <VocabularyListExercise exerciseData={exerciseData} />;

      default:
        return (
          <div className="exercise-unsupported">
            <p>Loại bài tập "{exerciseType}" chưa được hỗ trợ.</p>
          </div>
        );
    }
  };

  return (
    <div className="lesson-exercise">
      <div className="exercise-header">
        <h3 className="exercise-title">📝 Bài tập</h3>
        {lesson.exercise_duration > 0 && (
          <span className="exercise-duration">
            Thời gian: {lesson.exercise_duration} phút
          </span>
        )}
      </div>
      {renderExercise()}
    </div>
  );
}

