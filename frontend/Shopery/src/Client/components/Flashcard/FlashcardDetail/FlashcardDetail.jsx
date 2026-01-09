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

  // Helper function để fix image URL - tự động thêm https://study4.com/ nếu chưa có
  const fixImageUrl = (url) => {
    if (!url) return null;

    // Nếu đã có http:// hoặc https:// thì giữ nguyên
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Nếu bắt đầu bằng / thì thêm domain
    if (url.startsWith("/")) {
      return `https://study4.com${url}`;
    }

    // Nếu không có / ở đầu thì thêm / và domain
    return `https://study4.com/${url}`;
  };

  // Fetch words từ API với pagination
  const { data: wordsData, isLoading: isLoadingWords } = useWordsBySet(
    topic?.id,
    currentPage,
    limit,
    !!topic?.id
  );

  const { data: progressData } = useProgressByTopic(topic?.id, !!topic?.id);

  const words = React.useMemo(() => {
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
        en: word.word || "",
        vi: word.meaning_vi || word.meaning || "",
        word: word.word || "",
        pronunciation: word.pronunciation || "",
        meaning_vi: word.meaning_vi || word.meaning || "",
        definition_en: word.definition_en || word.notes || "",
        example_en: word.example_en || word.example || "",
        example: word.example_en || word.example || "",
        example_vi: word.example_vi || "",
        part_of_speech: word.part_of_speech || "",
        audio_url: word.audio_url || null,
        image_url: fixImageUrl(word.image_url), // Fix image URL
        is_learned: word.is_learned || false,
        mastery_level: word.mastery_level || 0,
      }));
      console.log("[FlashcardDetail] Transformed words:", transformed);
      return transformed;
    }
    console.log("[FlashcardDetail] No words found or invalid response");
    return [];
  }, [wordsData]);

  const pagination = wordsData?.pagination || null;
  const totalWords = pagination?.total || words.length;
  const totalPages = pagination?.total_pages || 1;

  const progress = progressData?.EC === "0" ? progressData.DT : null;
  const progressPercent = progress?.progress_percentage || 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
