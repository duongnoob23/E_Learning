// Client/components/Flashcard/FlashcardDetail/FlashcardDetail.jsx - Updated with pagination
import React, { useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi2";
import {
  useProgressByTopic,
  useWordsBySet,
} from "../../../services/Word/wordQueries";
import AddWordModal from "../AddWordModal/AddWordModal";
import WordListDisplay from "../WordListDisplay/WordListDisplay";
import "./FlashcardDetail.css";

const FlashcardDetail = ({ topic, onBack, topicType = "system" }) => {
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 50;

  // Fetch words từ API với pagination
  const {
    data: wordsData,
    isLoading: isLoadingWords,
    refetch,
  } = useWordsBySet(topic?.id, currentPage, limit, !!topic?.id);

  // Fetch progress
  const { data: progressData } = useProgressByTopic(topic?.id, !!topic?.id);

  // Transform words từ API - format phù hợp với WordListDisplay
  const words = React.useMemo(() => {
    // Debug: Log API response
    if (wordsData) {
      console.log("[FlashcardDetail] wordsData:", wordsData);
      console.log("[FlashcardDetail] wordsData.DT:", wordsData.DT);
      console.log(
        "[FlashcardDetail] Array.isArray(wordsData.DT):",
        Array.isArray(wordsData.DT)
      );
    }

    if (wordsData?.EC === "0" && wordsData?.DT && Array.isArray(wordsData.DT)) {
      const transformed = wordsData.DT.map((word) => ({
        id: word.user_word_id || word.word_id,
        word_id: word.word_id,
        user_word_id: word.user_word_id,
        // WordListDisplay expect: en, vi
        en: word.word || "",
        vi: word.meaning_vi || word.meaning || "",
        word: word.word || "", // Giữ lại để tương thích
        pronunciation: word.pronunciation || "",
        meaning_vi: word.meaning_vi || word.meaning || "",
        definition_en: word.definition_en || word.notes || "",
        example_en: word.example_en || word.example || "",
        example: word.example_en || word.example || "", // WordListDisplay expect: example
        example_vi: word.example_vi || "",
        part_of_speech: word.part_of_speech || "",
        audio_url: word.audio_url || null,
        image_url: word.image_url || null,
        is_learned: word.is_learned || false,
        mastery_level: word.mastery_level || 0,
      }));
      console.log("[FlashcardDetail] Transformed words:", transformed);
      return transformed;
    }
    console.log("[FlashcardDetail] No words found or invalid response");
    return [];
  }, [wordsData]);

  // Pagination info
  const pagination = wordsData?.pagination || null;
  const totalWords = pagination?.total || words.length;
  const totalPages = pagination?.total_pages || 1;

  // Progress data
  const progress = progressData?.EC === "0" ? progressData.DT : null;

  // Calculate progress (chỉ tính trên trang hiện tại)
  const learnedCount = words.filter((w) => w.is_learned).length;
  const progressPercent = progress?.progress_percentage || 0;

  const handleAddWord = () => {
    setShowAddWordModal(false);
    refetch();
    // Reset về trang 1 sau khi thêm từ
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flashcard-detail">
      <div className="flashcard-detail__container">
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
                <span className="word-count">{totalWords} từ</span>
                {progress && (
                  <span className="learned-count">
                    {progress.learned_count || 0} đã học
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="header-right">
            {topicType === "user_created" && (
              <button
                className="btn-add-word"
                onClick={() => setShowAddWordModal(true)}
              >
                <FiPlus />
                <span>Thêm từ</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {totalWords > 0 && (
          <div className="detail-progress">
            <div className="progress-info">
              <span>Tiến độ học</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
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
        {!isLoadingWords && words.length === 0 && totalWords === 0 && (
          <div className="empty-state-detail">
            <HiOutlineBookOpen className="empty-icon" />
            <h3>Chưa có từ vựng</h3>
            <p>Thêm từ vựng đầu tiên vào danh sách này</p>
            {topicType === "user_created" && (
              <button
                className="btn-add-first"
                onClick={() => setShowAddWordModal(true)}
              >
                <FiPlus />
                <span>Thêm từ đầu tiên</span>
              </button>
            )}
          </div>
        )}

        {/* Word List Display */}
        {!isLoadingWords && words.length > 0 && (
          <>
            <WordListDisplay
              words={words}
              topicType={topicType}
              topicId={topic?.id}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft />
                  <span>Trước</span>
                </button>

                <div className="pagination-info">
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <span className="pagination-count">
                    ({(currentPage - 1) * limit + 1} -{" "}
                    {Math.min(currentPage * limit, totalWords)} / {totalWords})
                  </span>
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <span>Sau</span>
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

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
