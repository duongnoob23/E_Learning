// Client/components/Flashcard/FlashcardDetail/FlashcardDetail.jsx - Enhanced Version
import React, { useState, useEffect, useCallback } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiVolume2,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiSkipForward,
  FiList,
  FiGrid,
  FiSettings,
} from "react-icons/fi";
import { HiOutlineBookOpen, HiOutlineAcademicCap } from "react-icons/hi2";
import {
  useAddWordToSet,
  useMarkLearned,
  useSubmitFeedback,
} from "../../../services/Word/wordMutations";
import { useWordsBySet, useProgressByTopic } from "../../../services/Word/wordQueries";
import AddWordModal from "../AddWordModal/AddWordModal";
import "./FlashcardDetail.css";

const FlashcardDetail = ({
  topic,
  onBack,
  topicType = "system",
}) => {
  // State
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [studyMode, setStudyMode] = useState("list"); // "list" | "flashcard"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ learned: 0, reviewing: 0, skipped: 0 });
  const [shuffledWords, setShuffledWords] = useState([]);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);

  // Fetch words từ API
  const { data: wordsData, isLoading: isLoadingWords, refetch } = useWordsBySet(
    topic?.id,
    !!topic?.id
  );

  // Fetch progress
  const { data: progressData } = useProgressByTopic(topic?.id, !!topic?.id);

  // Mutations
  const markLearnedMutation = useMarkLearned();
  const addWordMutation = useAddWordToSet();
  const submitFeedbackMutation = useSubmitFeedback();

  // Transform words từ API
  const words = React.useMemo(() => {
    if (wordsData?.EC === "0" && wordsData?.DT && Array.isArray(wordsData.DT)) {
      return wordsData.DT.map(word => ({
        id: word.user_word_id || word.word_id,
        word_id: word.word_id,
        user_word_id: word.user_word_id,
        word: word.word,
        pronunciation: word.pronunciation || "",
        meaning_vi: word.meaning_vi || word.meaning || "",
        definition_en: word.definition_en || "",
        example_en: word.example_en || word.example || "",
        example_vi: word.example_vi || "",
        part_of_speech: word.part_of_speech || "",
        audio_url: word.audio_url || null,
        image_url: word.image_url || null,
        is_learned: word.is_learned || false,
        mastery_level: word.mastery_level || 0,
      }));
    }
    return [];
  }, [wordsData]);

  // Progress data
  const progress = progressData?.EC === "0" ? progressData.DT : null;

  // Shuffle words for flashcard mode
  useEffect(() => {
    if (words.length > 0 && studyMode === "flashcard") {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [words, studyMode]);

  // Current word in flashcard mode
  const currentWord = shuffledWords[currentIndex] || null;

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

  // Speak word function
  const speakWord = useCallback((wordText, lang = 'en-US') => {
    if (!wordText || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(wordText.trim());
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(voice => 
      voice.lang.startsWith(lang.split('-')[0])
    ) || voices[0];
    
    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, []);

  // Auto play audio when card changes
  useEffect(() => {
    if (autoPlayAudio && currentWord && studyMode === "flashcard" && !isFlipped) {
      const timer = setTimeout(() => {
        speakWord(currentWord.word, 'en-US');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlayAudio, currentWord, studyMode, isFlipped, speakWord]);

  // Handlers
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFeedback = async (feedback) => {
    if (!currentWord) return;

    try {
      // Submit feedback to API
      if (feedback === "learned" || feedback === "remember") {
        await markLearnedMutation.mutateAsync({
          word_id: currentWord.word_id || currentWord.id,
          topic_id: topic.id,
        });
        setSessionStats(prev => ({ ...prev, learned: prev.learned + 1 }));
      } else if (feedback === "skip") {
        setSessionStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
      } else {
        setSessionStats(prev => ({ ...prev, reviewing: prev.reviewing + 1 }));
      }

      // Move to next card
      if (currentIndex < shuffledWords.length - 1) {
        handleNext();
      } else {
        // Session complete
        setStudyMode("complete");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      handleNext();
    }
  };

  const handleRestart = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ learned: 0, reviewing: 0, skipped: 0 });
    setStudyMode("flashcard");
  };

  const handleAddWord = async (wordData) => {
    try {
      await addWordMutation.mutateAsync({
        ...wordData,
        topic_id: topic.id,
        meaning_vi: wordData.definition,
        example_en: wordData.exampleEn,
        example_vi: wordData.exampleVi,
        partOfSpeech: wordData.type,
      });
      setShowAddWordModal(false);
      refetch();
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  // Calculate progress
  const learnedCount = words.filter(w => w.is_learned).length;
  const progressPercent = words.length > 0 ? Math.round((learnedCount / words.length) * 100) : 0;

  // Session complete view
  if (studyMode === "complete") {
    return (
      <div className="flashcard-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={onBack}>
            <FiArrowLeft />
            <span>Quay lại</span>
          </button>
        </div>

        <div className="session-complete">
          <div className="complete-icon">
            <HiOutlineAcademicCap />
          </div>
          <h2>Hoàn thành phiên học!</h2>
          <p>Bạn đã ôn tập xong {shuffledWords.length} từ vựng</p>
          
          <div className="session-stats-grid">
            <div className="session-stat learned">
              <span className="stat-number">{sessionStats.learned}</span>
              <span className="stat-label">Đã thuộc</span>
            </div>
            <div className="session-stat reviewing">
              <span className="stat-number">{sessionStats.reviewing}</span>
              <span className="stat-label">Cần ôn lại</span>
            </div>
            <div className="session-stat skipped">
              <span className="stat-number">{sessionStats.skipped}</span>
              <span className="stat-label">Bỏ qua</span>
            </div>
          </div>

          <div className="complete-actions">
            <button className="btn-primary" onClick={handleRestart}>
              <FiRefreshCw />
              <span>Học lại</span>
            </button>
            <button className="btn-secondary" onClick={() => setStudyMode("list")}>
              <FiList />
              <span>Xem danh sách</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <FiArrowLeft />
            <span>Quay lại</span>
          </button>
          
          <div className="topic-info">
            <h1 className="topic-title">{topic.title}</h1>
            <div className="topic-meta">
              <span className="word-count">{words.length} từ</span>
              {progress && (
                <span className="learned-count">{learnedCount} đã học</span>
              )}
            </div>
          </div>
        </div>

        <div className="header-right">
          {topicType === "user_created" && (
            <button className="btn-add-word" onClick={() => setShowAddWordModal(true)}>
              <FiPlus />
              <span>Thêm từ</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {words.length > 0 && (
        <div className="detail-progress">
          <div className="progress-info">
            <span>Tiến độ học</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      )}

      {/* Study Mode Toggle */}
      <div className="study-mode-toggle">
        <button
          className={`mode-btn ${studyMode === "list" ? "active" : ""}`}
          onClick={() => setStudyMode("list")}
        >
          <FiList />
          <span>Danh sách</span>
        </button>
        <button
          className={`mode-btn ${studyMode === "flashcard" ? "active" : ""}`}
          onClick={() => { setStudyMode("flashcard"); setCurrentIndex(0); setIsFlipped(false); }}
          disabled={words.length === 0}
        >
          <FiGrid />
          <span>Flashcard</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoadingWords && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Đang tải từ vựng...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingWords && words.length === 0 && (
        <div className="empty-state-detail">
          <HiOutlineBookOpen className="empty-icon" />
          <h3>Chưa có từ vựng</h3>
          <p>Thêm từ vựng đầu tiên vào danh sách này</p>
          {topicType === "user_created" && (
            <button className="btn-add-first" onClick={() => setShowAddWordModal(true)}>
              <FiPlus />
              <span>Thêm từ đầu tiên</span>
            </button>
          )}
        </div>
      )}

      {/* List Mode */}
      {!isLoadingWords && words.length > 0 && studyMode === "list" && (
        <div className="word-list-view">
          {words.map((word, index) => (
            <div key={word.id} className={`word-list-item ${word.is_learned ? "learned" : ""}`}>
              <div className="word-number">{index + 1}</div>
              
              <div className="word-content">
                <div className="word-main">
                  <h3 className="word-text">{word.word}</h3>
                  {word.pronunciation && (
                    <span className="word-pronunciation">/{word.pronunciation}/</span>
                  )}
                  <button 
                    className="btn-audio"
                    onClick={() => speakWord(word.word, 'en-US')}
                  >
                    <FiVolume2 />
                  </button>
                </div>
                
                <p className="word-meaning">{word.meaning_vi}</p>
                
                {word.example_en && (
                  <div className="word-example">
                    <p className="example-en">{word.example_en}</p>
                    {word.example_vi && (
                      <p className="example-vi">{word.example_vi}</p>
                    )}
                  </div>
                )}
              </div>

              {word.image_url && (
                <div className="word-image">
                  <img src={word.image_url} alt={word.word} />
                </div>
              )}

              {word.is_learned && (
                <div className="learned-badge">
                  <FiCheck />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Flashcard Mode */}
      {!isLoadingWords && words.length > 0 && studyMode === "flashcard" && currentWord && (
        <div className="flashcard-study-mode">
          {/* Progress indicator */}
          <div className="flashcard-progress-indicator">
            <span>{currentIndex + 1} / {shuffledWords.length}</span>
          </div>

          {/* Flashcard */}
          <div className="flashcard-wrapper" onClick={handleFlip}>
            <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
              {/* Front - Word */}
              <div className="flashcard-face flashcard-front">
                {currentWord.image_url && (
                  <div className="flashcard-image">
                    <img src={currentWord.image_url} alt={currentWord.word} />
                  </div>
                )}
                
                <div className="flashcard-word">{currentWord.word}</div>
                
                {currentWord.pronunciation && (
                  <div className="flashcard-pronunciation">
                    /{currentWord.pronunciation}/
                  </div>
                )}
                
                {currentWord.part_of_speech && (
                  <div className="flashcard-pos">({currentWord.part_of_speech})</div>
                )}

                <div className="flashcard-audio-btns">
                  <button 
                    className="audio-btn"
                    onClick={(e) => { e.stopPropagation(); speakWord(currentWord.word, 'en-GB'); }}
                  >
                    <FiVolume2 /> UK
                  </button>
                  <button 
                    className="audio-btn"
                    onClick={(e) => { e.stopPropagation(); speakWord(currentWord.word, 'en-US'); }}
                  >
                    <FiVolume2 /> US
                  </button>
                </div>

                <div className="flip-hint">Nhấp để xem nghĩa</div>
              </div>

              {/* Back - Meaning */}
              <div className="flashcard-face flashcard-back">
                <div className="flashcard-meaning">{currentWord.meaning_vi}</div>
                
                {currentWord.definition_en && (
                  <div className="flashcard-definition">
                    {currentWord.definition_en}
                  </div>
                )}
                
                {currentWord.example_en && (
                  <div className="flashcard-example">
                    <p className="example-label">Example:</p>
                    <p className="example-text">{currentWord.example_en}</p>
                    {currentWord.example_vi && (
                      <p className="example-translation">{currentWord.example_vi}</p>
                    )}
                  </div>
                )}

                <div className="flip-hint">Nhấp để xem từ</div>
              </div>
            </div>
          </div>

          {/* Feedback Buttons */}
          <div className="flashcard-feedback">
            <button 
              className="feedback-btn forgot"
              onClick={() => handleFeedback("forgot")}
            >
              <FiX />
              <span>Chưa nhớ</span>
            </button>
            
            <button 
              className="feedback-btn skip"
              onClick={() => handleFeedback("skip")}
            >
              <FiSkipForward />
              <span>Bỏ qua</span>
            </button>
            
            <button 
              className="feedback-btn learned"
              onClick={() => handleFeedback("learned")}
            >
              <FiCheck />
              <span>Đã nhớ</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flashcard-navigation">
            <button 
              className="nav-btn"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← Trước
            </button>
            <button className="nav-btn flip-btn" onClick={handleFlip}>
              {isFlipped ? "Xem từ" : "Xem nghĩa"}
            </button>
            <button 
              className="nav-btn"
              onClick={handleNext}
              disabled={currentIndex === shuffledWords.length - 1}
            >
              Tiếp →
            </button>
          </div>
        </div>
      )}

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={showAddWordModal}
        onClose={() => setShowAddWordModal(false)}
        onSubmit={handleAddWord}
        topicId={topic?.id}
        existingWords={words}
      />
    </div>
  );
};

export default FlashcardDetail;
