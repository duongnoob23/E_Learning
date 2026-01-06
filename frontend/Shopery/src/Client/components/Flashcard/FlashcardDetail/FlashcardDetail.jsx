// Client/components/Flashcard/FlashcardDetail/FlashcardDetail.jsx - Updated to use WordListDisplay
import React, { useState } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi2";
// AddWordModal handles mutations internally
import { useWordsBySet, useProgressByTopic } from "../../../services/Word/wordQueries";
import AddWordModal from "../AddWordModal/AddWordModal";
import WordListDisplay from "../WordListDisplay/WordListDisplay";
import "./FlashcardDetail.css";

const FlashcardDetail = ({
  topic,
  onBack,
  topicType = "system",
}) => {
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  // Fetch words từ API
  const { data: wordsData, isLoading: isLoadingWords, refetch } = useWordsBySet(
    topic?.id,
    !!topic?.id
  );

  // Fetch progress
  const { data: progressData } = useProgressByTopic(topic?.id, !!topic?.id);

  // Mutations - không cần dùng trực tiếp vì AddWordModal đã handle

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
        definition_en: word.definition_en || word.notes || "",
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

  // Calculate progress
  const learnedCount = words.filter(w => w.is_learned).length;
  const progressPercent = words.length > 0 ? Math.round((learnedCount / words.length) * 100) : 0;

  const handleAddWord = async (wordData) => {
    // AddWordModal handles the mutation internally
    // This callback is triggered after successful submission
    setShowAddWordModal(false);
    refetch();
  };

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

      {/* Word List Display */}
      {!isLoadingWords && words.length > 0 && (
        <WordListDisplay
          words={words}
          topicType={topicType}
          topicId={topic?.id}
        />
      )}

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={showAddWordModal}
        onClose={() => setShowAddWordModal(false)}
        topicId={topic?.id}
        existingWords={words}
      />
    </div>
  );
};

export default FlashcardDetail;
