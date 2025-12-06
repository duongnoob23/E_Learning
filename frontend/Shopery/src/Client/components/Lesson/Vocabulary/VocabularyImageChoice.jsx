// VocabularyImageChoice.jsx - Chọn ảnh (en -> image)
import React, { useState } from "react";
import "./VocabularyImageChoice.css";

export default function VocabularyImageChoice({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const question = lessonData.question || {};
  const images = lessonData.images || [];
  const layout = lessonData.layout || "grid";
  const [selectedImage, setSelectedImage] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (imageId) => {
    if (showResult) return;
    setSelectedImage(imageId);
  };

  const handleSubmit = () => {
    if (selectedImage === null) return;
    const selected = images.find(img => img.id === selectedImage);
    setShowResult(selected?.is_correct || false);
  };

  const isCorrect = images.find(img => img.id === selectedImage)?.is_correct || false;

  return (
    <div className="vocabulary-image-choice-container">
      <h3>{lesson.title}</h3>
      
      <div className="vocabulary-image-choice-content">
        <div className="vocabulary-image-choice-question">
          <h2>{question.en}</h2>
          {question.audio_url && (
            <audio controls className="vocabulary-image-choice-audio">
              <source src={question.audio_url} type="audio/mpeg" />
            </audio>
          )}
          <p className="vocabulary-image-choice-instruction">
            Chọn hình ảnh đúng
          </p>
        </div>

        <div className={`vocabulary-image-choice-images vocabulary-image-choice-${layout}`}>
          {images.map((image) => {
            const isSelected = selectedImage === image.id;
            let imageClass = "vocabulary-image-choice-item";
            
            if (showResult) {
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
                {showResult && image.is_correct && (
                  <div className="vocabulary-image-choice-overlay">
                    <i className="fa fa-check-circle"></i>
                  </div>
                )}
                {showResult && isSelected && !image.is_correct && (
                  <div className="vocabulary-image-choice-overlay wrong">
                    <i className="fa fa-times-circle"></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={selectedImage === null}
            className="vocabulary-image-choice-submit"
          >
            Xác nhận
          </button>
        )}

        {showResult && (
          <div className={`vocabulary-image-choice-result ${isCorrect ? "correct" : "wrong"}`}>
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



