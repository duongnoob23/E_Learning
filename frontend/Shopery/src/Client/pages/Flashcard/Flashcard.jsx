// Client/pages/Flashcard/Flashcard.jsx - Redesigned
import { useState, useEffect } from "react";
import { FiBook, FiPlus, FiSearch, FiChevronRight, FiGrid, FiList } from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineBookOpen, HiOutlineAcademicCap } from "react-icons/hi2";
import CreateTopicModal from "../../components/Flashcard/CreateTopicModal/CreateTopicModal";
import FlashcardCard from "../../components/Flashcard/FlashcardCard/FlashcardCard";
import FlashcardDetail from "../../components/Flashcard/FlashcardDetail/FlashcardDetail";
import FlashcardTabs from "../../components/Flashcard/FlashcardTabs/FlashcardTabs";
import { useCreateSet } from "../../services/Word/wordMutations";
import {
  usePublicTopics,
  useUserTopics,
  useWordOverview,
  useTodayWords,
} from "../../services/Word/wordQueries";
import "./Flashcard.css";

const Flashcard = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Fetch data từ API
  const { data: publicTopicsData, isLoading: isLoadingPublic, refetch: refetchPublic } =
    usePublicTopics(activeTab === "explore");
  const { data: userTopicsData, isLoading: isLoadingUser, refetch: refetchUser } = 
    useUserTopics(activeTab === "my-lists" || activeTab === "learning");
  const { data: learningOverviewData } = useWordOverview(true);
  const { data: todayWordsData } = useTodayWords(activeTab === "learning");

  // Mutations
  const createSetMutation = useCreateSet();

  // Transform data từ API sang format component
  const transformTopicData = (topic, topicType = "system") => ({
    id: topic.topic_id,
    title: topic.topic_name,
    description: topic.description || "",
    wordCount: topic.word_count || 0,
    viewCount: topic.view_count || 0,
    learnedCount: topic.learned_count || 0,
    logo: topic.image_url || topic.logo_url || null,
    category: topic.category || "general",
    difficulty: topic.difficulty || "intermediate",
    topicType: topicType,
    provider: topic.provider || "EngMoon",
    createdBy: topic.creator ? {
      name: topic.creator.full_name || topic.creator.username,
      avatar: topic.creator.avatar_url,
    } : null,
    createdAt: topic.created_at,
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedTopic(null);
    setSearchQuery("");
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleCreateTopic = async () => {
    // CreateTopicModal will handle the mutation internally
    // This is just a callback to refetch data after success
    refetchUser();
  };

  const handleBack = () => {
    setSelectedTopic(null);
    // Refetch data khi quay lại
    if (activeTab === "explore") {
      refetchPublic();
    } else {
      refetchUser();
    }
  };

  const getCurrentTopics = () => {
    let topics = [];
    
    switch (activeTab) {
      case "explore":
        if (publicTopicsData?.EC === "0" && publicTopicsData?.DT) {
          topics = publicTopicsData.DT.map((topic) =>
            transformTopicData(topic, "system")
          );
        }
        break;
      case "my-lists":
        if (userTopicsData?.EC === "0" && userTopicsData?.DT) {
          topics = userTopicsData.DT.map((topic) =>
            transformTopicData(topic, "user_created")
          );
        }
        break;
      case "learning":
        // Combine topics có từ đang học
        const learningTopics = [];
        if (publicTopicsData?.EC === "0" && publicTopicsData?.DT) {
          publicTopicsData.DT.forEach((topic) => {
            if (topic.learned_count > 0 || topic.learning_count > 0) {
              learningTopics.push(transformTopicData(topic, "system"));
            }
          });
        }
        if (userTopicsData?.EC === "0" && userTopicsData?.DT) {
          userTopicsData.DT.forEach((topic) => {
            learningTopics.push(transformTopicData(topic, "user_created"));
          });
        }
        topics = learningTopics;
        break;
      default:
        break;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      topics = topics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.description.toLowerCase().includes(query)
      );
    }

    return topics;
  };

  const currentTopics = getCurrentTopics();
  const isLoading =
    (activeTab === "explore" && isLoadingPublic) ||
    ((activeTab === "my-lists" || activeTab === "learning") && isLoadingUser);

  // Get learning stats
  const learningStats = learningOverviewData?.EC === "0" ? learningOverviewData.DT : null;
  const todayWords = todayWordsData?.EC === "0" ? todayWordsData.DT : [];

  if (selectedTopic) {
    return (
      <FlashcardDetail
        topic={selectedTopic}
        onBack={handleBack}
        topicType={selectedTopic.topicType || "system"}
      />
    );
  }

  return (
    <div className="flashcard-page">
      <div className="flashcard-container">
        {/* Hero Header */}
        <div className="flashcard-hero">
          <div className="flashcard-hero-content">
            <div className="flashcard-hero-icon">
              <HiOutlineBookOpen />
            </div>
            <div className="flashcard-hero-text">
              <h1>Flashcards</h1>
              <p>Học từ vựng hiệu quả với phương pháp thẻ ghi nhớ</p>
            </div>
          </div>

          {/* Quick Stats */}
          {learningStats && (
            <div className="flashcard-quick-stats">
              <div className="quick-stat">
                <span className="quick-stat-value">{learningStats.total_words_learned || 0}</span>
                <span className="quick-stat-label">Đã học</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">{learningStats.total_words_learning || 0}</span>
                <span className="quick-stat-label">Đang học</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">{todayWords.length || 0}</span>
                <span className="quick-stat-label">Hôm nay</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <FlashcardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Info Banner */}
        <div className="info-banner">
          <div className="info-icon">
            <HiOutlineSparkles />
          </div>
          <div className="info-content">
            <p className="info-text">
              <strong>Mẹo:</strong> Học đều đặn mỗi ngày với phương pháp Spaced Repetition để ghi nhớ từ vựng lâu hơn!
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flashcard-toolbar">
          <div className="toolbar-left">
            {/* Search */}
            <div className="flashcard-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="toolbar-right">
            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Hiển thị dạng lưới"
              >
                <FiGrid />
              </button>
              <button
                className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="Hiển thị dạng danh sách"
              >
                <FiList />
              </button>
            </div>

            {/* Create Button (only for my-lists tab) */}
            {activeTab === "my-lists" && (
              <button
                className="create-topic-btn"
                onClick={() => setShowCreateTopicModal(true)}
              >
                <FiPlus />
                <span>Tạo danh sách</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flashcard-content">
          {/* Loading State */}
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Empty States */}
          {!isLoading && currentTopics.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                {activeTab === "explore" && <HiOutlineBookOpen />}
                {activeTab === "my-lists" && <FiBook />}
                {activeTab === "learning" && <HiOutlineAcademicCap />}
              </div>
              <h3 className="empty-state-title">
                {activeTab === "explore" && "Không tìm thấy chủ đề nào"}
                {activeTab === "my-lists" && "Chưa có danh sách từ vựng"}
                {activeTab === "learning" && "Chưa có từ vựng đang học"}
              </h3>
              <p className="empty-state-text">
                {activeTab === "explore" &&
                  "Hệ thống chưa có chủ đề từ vựng nào. Vui lòng quay lại sau."}
                {activeTab === "my-lists" &&
                  "Bạn chưa tạo danh sách từ vựng nào. Nhấn nút bên dưới để bắt đầu."}
                {activeTab === "learning" &&
                  "Bạn chưa học từ vựng nào. Hãy khám phá các chủ đề và bắt đầu học!"}
              </p>
              {activeTab === "my-lists" && (
                <button
                  className="empty-state-btn"
                  onClick={() => setShowCreateTopicModal(true)}
                >
                  <FiPlus />
                  <span>Tạo danh sách đầu tiên</span>
                </button>
              )}
              {activeTab === "learning" && (
                <button
                  className="empty-state-btn"
                  onClick={() => setActiveTab("explore")}
                >
                  <FiChevronRight />
                  <span>Khám phá chủ đề</span>
                </button>
              )}
            </div>
          )}

          {/* Topics Grid/List */}
          {!isLoading && currentTopics.length > 0 && (
            <>
              {/* Section Title */}
              <div className="section-header">
                <h3 className="section-title">
                  {activeTab === "explore" && "Khám phá các chủ đề"}
                  {activeTab === "my-lists" && "Danh sách của bạn"}
                  {activeTab === "learning" && "Đang học"}
                </h3>
                <span className="section-count">{currentTopics.length} chủ đề</span>
              </div>

              <div className={`topics-${viewMode}`}>
                {/* Create Card - Only in my-lists tab */}
                {activeTab === "my-lists" && (
                  <FlashcardCard
                    isCreateCard={true}
                    onClick={() => setShowCreateTopicModal(true)}
                    viewMode={viewMode}
                  />
                )}

                {/* Topic Cards */}
                {currentTopics.map((topic) => (
                  <FlashcardCard
                    key={topic.id}
                    topic={topic}
                    onClick={handleTopicClick}
                    showUserInfo={activeTab === "my-lists" || topic.topicType === "user_created"}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination - For future use */}
        {currentTopics.length > 12 && (
          <div className="pagination">
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
          </div>
        )}
      </div>

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={showCreateTopicModal}
        onClose={() => setShowCreateTopicModal(false)}
        onSuccess={handleCreateTopic}
      />
    </div>
  );
};

export default Flashcard;
