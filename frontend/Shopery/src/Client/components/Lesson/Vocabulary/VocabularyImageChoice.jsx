// VocabularyImageChoice.jsx - Chọn ảnh (en -> image)
import { useMemo, useState } from "react";
import "./VocabularyImageChoice.css";

export default function VocabularyImageChoice({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const questions = useMemo(() => {
    if (lessonData.questions && Array.isArray(lessonData.questions))
      return lessonData.questions;
    if (lessonData.question) return [lessonData.question];
    return [];
  }, [lessonData]);

  const layout = lessonData.layout || "grid";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMap, setSelectedMap] = useState({}); // {questionIndex: imageId}
  const [showResultMap, setShowResultMap] = useState({}); // {questionIndex: boolean}

  const currentQuestion = questions[currentIndex] || {};
  const images =
    (currentQuestion.images || []).map((img, idx) => ({
      id: img.image_id || img.id || `img_${idx + 1}`, // 生成唯一id
      url: img.image_url || img.url || "", // 优先image_url
      is_correct: !!img.is_correct, // 标记正确
    })) ||
    lessonData.images ||
    [];

  const handleSelect = (imageId) => {
    if (showResultMap[currentIndex]) return;
    setSelectedMap((prev) => ({ ...prev, [currentIndex]: imageId }));
  };

  const handleSubmit = () => {
    const selectedImage = selectedMap[currentIndex];
    if (selectedImage == null) return;
    const selected = images.find((img) => img.id === selectedImage);
    setShowResultMap((prev) => ({
      ...prev,
      [currentIndex]: selected?.is_correct || false,
    }));
  };

  const isCorrect =
    images.find((img) => img.id === selectedMap[currentIndex])?.is_correct ||
    false;

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  if (!questions.length && !(lessonData.images || []).length) {
    return (
      <div className="vocabulary-image-choice-container">Không có dữ liệu</div>
    );
  }

  return (
    <div className="vocabulary-image-choice-container">
      {questions.length > 1 && (
        <div className="vocabulary-image-choice-nav">
          <button
            className="vocabulary-image-choice-nav-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ← Câu trước
          </button>
          <div className="vocabulary-image-choice-qnums">
            {questions.map((_, idx) => (
              <button
                key={idx}
                className={`vocabulary-image-choice-qnum ${
                  idx === currentIndex ? "active" : ""
                } ${showResultMap[idx] ? "done" : ""}`}
                onClick={() => setCurrentIndex(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            className="vocabulary-image-choice-nav-btn"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            Câu sau →
          </button>
        </div>
      )}

      <div className="vocabulary-image-choice-content">
        <div className="vocabulary-image-choice-question">
          <h2>{currentQuestion.en}</h2>
          {currentQuestion.audio_url && (
            <audio controls className="vocabulary-image-choice-audio">
              <source src={currentQuestion.audio_url} type="audio/mpeg" />
            </audio>
          )}
          <p className="vocabulary-image-choice-instruction">
            Chọn hình ảnh đúng
          </p>
        </div>

        <div
          className={`vocabulary-image-choice-images vocabulary-image-choice-${layout}`}
        >
          {images.map((image) => {
            const isSelected = selectedMap[currentIndex] === image.id;
            let imageClass = "vocabulary-image-choice-item";

            if (showResultMap[currentIndex]) {
              if (image.is_correct) {
                imageClass += " correct";
              } else if (isSelected && !image.is_correct) {
                imageClass += " wrong";
              }
            } else if (isSelected) {
              imageClass += " selected";
            }

            return (
              <div
                key={image.id}
                className={imageClass}
                onClick={() => handleSelect(image.id)}
              >
                <img src={image.url} alt={`Option ${image.id}`} />
                {showResultMap[currentIndex] && image.is_correct && (
                  <div className="vocabulary-image-choice-overlay">
                    <i className="fa fa-check-circle"></i>
                  </div>
                )}
                {showResultMap[currentIndex] &&
                  isSelected &&
                  !image.is_correct && (
                    <div className="vocabulary-image-choice-overlay wrong">
                      <i className="fa fa-times-circle"></i>
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        {!showResultMap[currentIndex] && (
          <button
            onClick={handleSubmit}
            disabled={selectedMap[currentIndex] == null}
            className="vocabulary-image-choice-submit"
          >
            Xác nhận
          </button>
        )}

        {showResultMap[currentIndex] !== undefined && (
          <div
            className={`vocabulary-image-choice-result ${
              isCorrect ? "correct" : "wrong"
            }`}
          >
            {isCorrect ? (
              <>
                <i className="fa fa-check-circle"></i>
                <p>Chính xác! Bạn đã chọn đúng.</p>
              </>
            ) : (
              <>
                <i className="fa fa-times-circle"></i>
                <p>Sai rồi! Hãy thử lại.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
