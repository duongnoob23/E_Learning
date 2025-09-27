// Client/components/Flashcard/MyLists/MyLists.jsx
import React, { useState } from "react";
import AddWordModal from "../AddWordModal/AddWordModal";
import EditTopicModal from "../EditTopicModal/EditTopicModal";
import "./MyLists.css";

const MyLists = ({
  topics,
  loading,
  error,
  onTopicClick,
  onCreateTopic,
  onUpdateTopic,
  onDeleteTopic,
  onAddWord,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Filter topics based on search
  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (topic.description &&
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort topics
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "name":
        return a.title.localeCompare(b.title);
      case "words":
        return (b.wordCount || 0) - (a.wordCount || 0);
      default:
        return 0;
    }
  });

  const handleEditTopic = (topic) => {
    setSelectedTopic(topic);
    setShowEditModal(true);
  };

  const handleAddWords = (topic) => {
    setSelectedTopic(topic);
    setShowAddWordModal(true);
  };

  const handleSaveTopic = async (topicData) => {
    if (onUpdateTopic) {
      await onUpdateTopic(topicData);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (onDeleteTopic) {
      await onDeleteTopic(topicId);
    }
  };

  const handleSaveWord = async (wordData) => {
    if (onAddWord && selectedTopic) {
      console.log("MyLists handleSaveWord - selectedTopic:", selectedTopic);
      // Truyền selectedTopic lên parent component
      await onAddWord(wordData, selectedTopic);
    } else {
      console.error(
        "MyLists handleSaveWord - selectedTopic is null or onAddWord is not provided"
      );
    }
  };

  if (loading) {
    return (
      <div className="my-lists-page">
        <div className="my-lists-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách từ của bạn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-lists-page">
        <div className="my-lists-error">
          <div className="error-icon">⚠️</div>
          <p>Có lỗi khi tải danh sách từ của bạn</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-lists-page">
      {/* Header Section */}
      <div className="my-lists-header">
        <div className="header-content">
          <h2>📚 Danh sách từ của tôi</h2>
          <p>Quản lý và học từ vựng cá nhân của bạn</p>
        </div>
        <button className="create-new-btn" onClick={onCreateTopic}>
          <span className="btn-icon">+</span>
          Tạo danh sách mới
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card-fix">
          <div className="stat-number-fix">{topics.length}</div>
          <div className="stat-label-fix">Danh sách</div>
        </div>
        <div className="stat-card-fix">
          <div className="stat-number-fix">
            {topics.reduce((total, topic) => total + (topic.wordCount || 0), 0)}
          </div>
          <div className="stat-label-fix">Từ vựng</div>
        </div>
        <div className="stat-card-fix">
          <div className="stat-number-fix">
            {topics.filter((topic) => topic.isActive).length}
          </div>
          <div className="stat-label-fix">Đang hoạt động</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm danh sách từ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="sort-dropdown">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name">Tên A-Z</option>
            <option value="words">Số từ (nhiều nhất)</option>
          </select>
        </div>
      </div>

      {/* Topics List */}
      <div className="topics-list">
        {sortedTopics.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Chưa có danh sách từ nào</h3>
            <p>Hãy tạo danh sách từ đầu tiên để bắt đầu học!</p>
            <button className="create-first-btn" onClick={onCreateTopic}>
              Tạo danh sách đầu tiên
            </button>
          </div>
        ) : (
          <div className="topics-grid">
            {sortedTopics.map((topic) => (
              <div
                key={topic.id}
                className="topic-card"
                onClick={() => {
                  console.log("MyLists topic clicked:", topic);
                  console.log("MyLists topic ID:", topic?.id);
                  onTopicClick(topic);
                }}
              >
                <div className="topic-header">
                  <h3 className="topic-title">{topic.title}</h3>
                </div>

                <p className="topic-description">
                  {topic.description || "Chưa có mô tả"}
                </p>

                <div className="topic-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📖</span>
                    <span className="meta-text">{topic.wordCount || 0} từ</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">🌐</span>
                    <span className="meta-text">
                      {topic.category === "user_created"
                        ? "Cá nhân"
                        : "Hệ thống"}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span className="meta-text">
                      {new Date(topic.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="topic-actions">
                  <button
                    className="action-btn2 primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTopicClick(topic);
                    }}
                  >
                    Học ngay
                  </button>
                  <button
                    className="action-btn2 secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTopic(topic);
                    }}
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Topic Modal */}
      <EditTopicModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        topic={selectedTopic}
        onSave={handleSaveTopic}
        onDelete={handleDeleteTopic}
        onAddWords={handleAddWords}
      />

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={showAddWordModal}
        onClose={() => setShowAddWordModal(false)}
        topic={selectedTopic}
        onSave={handleSaveWord}
      />
    </div>
  );
};

export default MyLists;
