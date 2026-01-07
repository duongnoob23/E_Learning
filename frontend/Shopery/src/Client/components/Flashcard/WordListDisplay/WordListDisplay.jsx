// WordListDisplay.jsx - Component hiển thị danh sách từ vựng (list/flashcard mode)
// Tham khảo VocabularyList từ lesson vocabulary
import { useState, useEffect } from "react";
import { useDeleteUserWord } from "../../../services/Word/wordMutations";
import "./WordListDisplay.css";

export default function WordListDisplay({ words = [], topicType = "system", topicId = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [studyMode, setStudyMode] = useState("list"); // "list" hoặc "flashcard"
  
  // Mutation để xóa từ
  const deleteWordMutation = useDeleteUserWord();

  if (words.length === 0) {
    return <div className="word-list-empty">Không có từ vựng nào</div>;
  }

  // Transform word data để phù hợp với component
  const transformedWords = words.map((word) => ({
    id: word.user_word_id || word.word_id,
    user_word_id: word.user_word_id, // Lưu để xóa
    word_id: word.word_id, // Lưu để xóa
    en: word.word,
    vi: word.meaning_vi || word.meaning || "",
    pronunciation: word.pronunciation || `/${word.word}/`,
    audio_url: word.audio_url || null,
    image_url: word.image_url || null,
    example: word.example_en || word.example || "",
    example_vi: word.example_vi || "",
  }));

  const currentWord = transformedWords[currentIndex];

  const handleNext = () => {
    if (currentIndex < transformedWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDefinition(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDefinition(false);
    }
  };

  const handleFlip = () => {
    setShowDefinition(!showDefinition);
  };

  const handleModeChange = (mode) => {
    setStudyMode(mode);
    setCurrentIndex(0);
    setShowDefinition(false);
  };

  // Load voices cho Web Speech API
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      loadVoices();
    }
  }, []);

  // Phát âm UK
  const playUKAudio = () => {
    if (!currentWord) return;
    
    const word = currentWord.en || currentWord.word;
    if (!word) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word.trim());
      utterance.lang = 'en-GB'; // UK English
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      // Tìm giọng UK
      const ukVoice = voices.find(voice => 
        voice.lang.startsWith('en-GB') || 
        (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('british'))
      ) || voices.find(voice => voice.lang.startsWith('en-GB')) || voices[0];
      
      if (ukVoice) {
        utterance.voice = ukVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else if (currentWord.audio_url) {
      // Fallback to audio file if Web Speech API not available
      const audio = new Audio(currentWord.audio_url);
      audio.play().catch(err => console.error('Error playing audio:', err));
    }
  };

  // Phát âm US
  const playUSAudio = () => {
    if (!currentWord) return;
    
    const word = currentWord.en || currentWord.word;
    if (!word) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word.trim());
      utterance.lang = 'en-US'; // US English
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      // Tìm giọng US
      const usVoice = voices.find(voice => 
        voice.lang.startsWith('en-US') || 
        (voice.lang.startsWith('en') && (voice.name.toLowerCase().includes('american') || voice.name.toLowerCase().includes('us')))
      ) || voices.find(voice => voice.lang.startsWith('en-US')) || voices[0];
      
      if (usVoice) {
        utterance.voice = usVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else if (currentWord.audio_url) {
      // Fallback to audio file if Web Speech API not available
      const audio = new Audio(currentWord.audio_url);
      audio.play().catch(err => console.error('Error playing audio:', err));
    }
  };

  // Helper functions để phát âm từ trong list mode
  const playWordUK = (wordText) => {
    if (!wordText) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(wordText.trim());
      utterance.lang = 'en-GB'; // UK English
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const ukVoice = voices.find(voice => 
        voice.lang.startsWith('en-GB') || 
        (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('british'))
      ) || voices.find(voice => voice.lang.startsWith('en-GB')) || voices[0];
      
      if (ukVoice) {
        utterance.voice = ukVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const playWordUS = (wordText) => {
    if (!wordText) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(wordText.trim());
      utterance.lang = 'en-US'; // US English
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const usVoice = voices.find(voice => 
        voice.lang.startsWith('en-US') || 
        (voice.lang.startsWith('en') && (voice.name.toLowerCase().includes('american') || voice.name.toLowerCase().includes('us')))
      ) || voices.find(voice => voice.lang.startsWith('en-US')) || voices[0];
      
      if (usVoice) {
        utterance.voice = usVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Xóa từ vựng
  const handleDeleteWord = async (word) => {
    // Chỉ cho phép xóa từ user_created
    if (topicType !== "user_created") {
      return;
    }

    // Chỉ xóa được từ có user_word_id (từ cá nhân)
    if (!word.user_word_id) {
      return;
    }

    if (window.confirm(`Bạn có chắc muốn xóa từ "${word.en}"?`)) {
      try {
        await deleteWordMutation.mutateAsync(word.user_word_id);
        // Nếu đang ở flashcard mode và xóa từ hiện tại, chuyển sang từ trước
        if (studyMode === "flashcard" && currentIndex === transformedWords.findIndex(w => w.id === word.id)) {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          } else if (transformedWords.length > 1) {
            setCurrentIndex(0);
          }
        }
      } catch (error) {
        console.error("Error deleting word:", error);
      }
    }
  };

  // Chế độ Flashcard
  if (studyMode === "flashcard") {
    return (
      <div className="word-list-container word-flashcard-mode">
        {/* Study Mode Toggle */}
        <div className="word-study-mode-toggle">
          <button
            className={`word-mode-btn ${studyMode === "list" ? "active" : ""}`}
            onClick={() => handleModeChange("list")}
          >
            📋 Danh sách từ
          </button>
          <button
            className={`word-mode-btn ${
              studyMode === "flashcard" ? "active" : ""
            }`}
            onClick={() => handleModeChange("flashcard")}
          >
            🃏 Flashcard
          </button>
        </div>

        {/* Flashcard Container */}
        <div className="word-flashcard-wrapper">
          {/* Badge "Từ mới" */}
          <div className="word-new-badge">Từ mới</div>

          {/* Flashcard */}
          <div className="word-flashcard" onClick={handleFlip}>
            <div
              className={`word-flashcard-inner ${
                showDefinition ? "flipped" : ""
              }`}
            >
              {/* Front - Từ tiếng Anh */}
              <div className="word-flashcard-front">
                {currentWord.image_url && (
                  <div className="word-image">
                    <img src={currentWord.image_url} alt={currentWord.en} />
                  </div>
                )}
                <div className="word-section">
                  <h2 className="word-text">{currentWord.en}</h2>
                </div>
                <div className="word-pronunciation-section">
                  <span className="word-pronunciation">
                    {currentWord.pronunciation}
                  </span>
                  <div className="word-audio-buttons">
                    <button
                      className="word-audio-btn uk-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playUKAudio();
                      }}
                      title="Phát âm UK"
                    >
                      🔊 UK
                    </button>
                    <button
                      className="word-audio-btn us-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playUSAudio();
                      }}
                      title="Phát âm US"
                    >
                      🔊 US
                    </button>
                  </div>
                </div>
                <p className="word-flip-hint">Nhấp để xem nghĩa</p>
              </div>

              {/* Back - Nghĩa tiếng Việt */}
              <div className="word-flashcard-back">
                {currentWord.image_url && (
                  <div className="word-image">
                    <img src={currentWord.image_url} alt={currentWord.en} />
                  </div>
                )}
                <h2 className="word-definition">{currentWord.vi}</h2>
                {currentWord.example && (
                  <>
                    <div className="word-example">
                      <p className="word-example-title">Example: </p>
                      <div></div>
                      <p className="word-example-en">{currentWord.example}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="word-flashcard-controls">
            <button
              className="word-control-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← Trước
            </button>

            <button className="word-control-btn flip-btn" onClick={handleFlip}>
              {showDefinition ? "Xem từ" : "Xem nghĩa"}
            </button>

            <button
              className="word-control-btn next-btn"
              onClick={handleNext}
              disabled={currentIndex === transformedWords.length - 1}
            >
              Tiếp →
            </button>
          </div>

          {/* Delete button for user_created topics - chỉ hiển thị trong list mode */}
          {studyMode !== "flashcard" && topicType === "user_created" && currentWord.user_word_id && (
            <button
              className="word-delete-btn-flashcard"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWord(currentWord);
              }}
              title="Xóa từ này"
            >
              ×
            </button>
          )}

          {/* Progress */}
          <div className="word-progress">
            {currentIndex + 1} / {transformedWords.length}
          </div>
        </div>
      </div>
    );
  }

  // Chế độ Danh sách
  return (
    <div className="word-list-container word-list-mode">
      {/* Study Mode Toggle */}
      <div className="word-study-mode-toggle">
        <button
          className={`word-mode-btn ${studyMode === "list" ? "active" : ""}`}
          onClick={() => handleModeChange("list")}
        >
          📋 Danh sách từ
        </button>
        <button
          className={`word-mode-btn ${
            studyMode === "flashcard" ? "active" : ""
          }`}
          onClick={() => handleModeChange("flashcard")}
        >
          🃏 Flashcard
        </button>
      </div>

      {/* Word List */}
      <div className="word-list-container-inner">
        <div className="word-list">
          {transformedWords.map((word, index) => (
            <div key={word.id || index} className="word-list-item">
              <div className="word-list-number">{index + 1}</div>
              <div className="word-list-content">
                {/* Delete button for user_created topics - positioned on the right */}
                {topicType === "user_created" && word.user_word_id && (
                  <button
                    className="word-list-delete-btn"
                    onClick={() => handleDeleteWord(word)}
                    title="Xóa từ này"
                  >
                    ×
                  </button>
                )}
                <div className="word-list-text">
                  <div className="word-list-header">
                    <h3 className="word-list-word">{word.en}</h3>
                    <span className="word-list-pronunciation">
                      {word.pronunciation}
                    </span>
                    <div className="word-list-audio">
                      <button
                        className="word-audio-btn-small uk-btn"
                        onClick={() => playWordUK(word.en)}
                        title="Phát âm UK"
                      >
                        🔊 UK
                      </button>
                      <button
                        className="word-audio-btn-small us-btn"
                        onClick={() => playWordUS(word.en)}
                        title="Phát âm US"
                      >
                        🔊 US
                      </button>
                    </div>
                  </div>
                  <p className="word-list-definition">{word.vi}</p>
                  {word.example && (
                    <div className="word-list-example">
                      <p className="word-example-en">{word.example}</p>
                    </div>
                  )}
                </div>
                {word.image_url && (
                  <div className="word-list-image">
                    <img src={word.image_url} alt={word.en} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





















































