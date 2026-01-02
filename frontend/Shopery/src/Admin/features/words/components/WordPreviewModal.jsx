import React from "react";
import { HiXMark, HiSpeakerWave, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { useAdminWordDetail } from "../hooks/useWordsAdminQueries";
import "./WordModals.scss";

export default function WordPreviewModal({ wordId, onClose }) {
  const { data: wordData, isLoading, error } = useAdminWordDetail(wordId);

  const word = wordData?.DT;

  const playAudio = () => {
    if (word?.audio_url) {
      const audio = new Audio(word.audio_url);
      audio.play();
    }
  };

  if (isLoading) {
    return (
      <div className="word-modal-overlay" onClick={onClose}>
        <div className="word-modal word-modal--preview" onClick={(e) => e.stopPropagation()}>
          <div className="word-modal__loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className="word-modal-overlay" onClick={onClose}>
        <div className="word-modal word-modal--preview" onClick={(e) => e.stopPropagation()}>
          <div className="word-modal__error">Error loading word</div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-modal-overlay" onClick={onClose}>
      <div className="word-modal word-modal--preview" onClick={(e) => e.stopPropagation()}>
        <div className="word-modal__header">
          <h2>Word Preview</h2>
          <button className="word-modal__close-btn" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <div className="word-preview">
          {/* Word Header */}
          <div className="word-preview__header">
            <div className="word-preview__word-info">
              <h1 className="word-preview__word">{word.word}</h1>
              {word.pronunciation && (
                <span className="word-preview__pronunciation">/{word.pronunciation}/</span>
              )}
              {word.audio_url && (
                <button className="word-preview__audio-btn" onClick={playAudio}>
                  <HiSpeakerWave />
                </button>
              )}
            </div>
            <div className="word-preview__meta">
              {word.part_of_speech && (
                <span className="word-preview__pos">{word.part_of_speech}</span>
              )}
              <span className={`word-preview__status ${word.is_active ? "word-preview__status--active" : "word-preview__status--inactive"}`}>
                {word.is_active ? <><HiCheckCircle /> Active</> : <><HiXCircle /> Inactive</>}
              </span>
            </div>
          </div>

          {/* Image */}
          {word.image_url && (
            <div className="word-preview__image-wrapper">
              <img src={word.image_url} alt={word.word} className="word-preview__image" />
            </div>
          )}

          {/* Meanings */}
          <div className="word-preview__section">
            <h3>Meaning</h3>
            <div className="word-preview__meaning">
              <div className="word-preview__meaning-vi">
                <span className="word-preview__label">Vietnamese:</span>
                <span>{word.meaning_vi}</span>
              </div>
              {word.meaning_en && (
                <div className="word-preview__meaning-en">
                  <span className="word-preview__label">English:</span>
                  <span>{word.meaning_en}</span>
                </div>
              )}
            </div>
          </div>

          {/* Example */}
          {word.example_sentence && (
            <div className="word-preview__section">
              <h3>Example</h3>
              <div className="word-preview__example">
                <p className="word-preview__example-en">{word.example_sentence}</p>
                {word.example_translation && (
                  <p className="word-preview__example-vi">{word.example_translation}</p>
                )}
              </div>
            </div>
          )}

          {/* Topic & Difficulty */}
          <div className="word-preview__section">
            <h3>Details</h3>
            <div className="word-preview__details">
              <div className="word-preview__detail-item">
                <span className="word-preview__label">Topic:</span>
                <span className="word-preview__topic-badge">{word.Topic?.topic_name || "N/A"}</span>
              </div>
              <div className="word-preview__detail-item">
                <span className="word-preview__label">Difficulty:</span>
                <span className={`word-preview__difficulty word-preview__difficulty--${word.difficulty_level || "medium"}`}>
                  {word.difficulty_level || "medium"}
                </span>
              </div>
              <div className="word-preview__detail-item">
                <span className="word-preview__label">Created:</span>
                <span>{new Date(word.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

