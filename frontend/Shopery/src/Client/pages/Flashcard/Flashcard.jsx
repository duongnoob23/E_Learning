// Client/pages/Flashcard/Flashcard.jsx
import React, { useState } from "react";
import FlashcardTabs from "../../components/Flashcard/FlashcardTabs/FlashcardTabs";
import FlashcardCard from "../../components/Flashcard/FlashcardCard/FlashcardCard";
import FlashcardDetail from "../../components/Flashcard/FlashcardDetail/FlashcardDetail";
import CreateTopicModal from "../../components/Flashcard/CreateTopicModal/CreateTopicModal";
import MyLists from "../../components/Flashcard/MyLists/MyLists";
import { useExploreTopics, useUserTopics, useCreateTopic, useDeleteTopic, useUpdateTopic, useAddWordToTopic } from "../../hooks/Flashcard/useFlashcardQueries";
import "./Flashcard.css";

const Flashcard = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // API calls
  const { 
    data: exploreTopicsData, 
    isLoading: exploreLoading, 
    error: exploreError 
  } = useExploreTopics({ 
    page: 1, 
    limit: 12, 
    search: searchQuery,
    topic_type: 'system'
  });

  const { 
    data: userTopicsData, 
    isLoading: userTopicsLoading, 
    error: userTopicsError 
  } = useUserTopics({ 
    page: 1, 
    limit: 12, 
    search: searchQuery 
  });

  const createTopicMutation = useCreateTopic();
  const updateTopicMutation = useUpdateTopic();
  const deleteTopicMutation = useDeleteTopic();
  const addWordMutation = useAddWordToTopic();

  // Topics data từ API - sử dụng trực tiếp từ hook


  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedTopic(null);
  };

  const handleTopicClick = (topic) => {
    console.log("Topic clicked:", topic);
    console.log("Topic ID:", topic?.id);
    setSelectedTopic(topic);
  };


  const handleBack = () => {
    setSelectedTopic(null);
  };

  // Xử lý tạo topic mới
  const handleCreateTopic = async (topicData) => {
    try {
      console.log('Creating topic with data:', topicData);
      console.log('Current userTopicsData before create:', userTopicsData);
      
      await createTopicMutation.mutateAsync({
        topic_name: topicData.title,
        description: topicData.description || "Chưa có mô tả",
        topic_type: "user_created",
        is_public: true,
        is_active: true,
        word_count: 0
      });
      
      console.log('Topic created, closing modal');
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating topic:", error);
      // Error handling is done in the mutation hook
    }
  };

  const handleUpdateTopic = async (topicData) => {
    try {
      console.log("Updating topic:", topicData);
      await updateTopicMutation.mutateAsync({
        topicId: topicData.id,
        topicData: {
          topic_name: topicData.title,
          description: topicData.description,
          is_public: topicData.isPublic
        }
      });
    } catch (error) {
      console.error("Error updating topic:", error);
      throw error;
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      console.log("Deleting topic:", topicId);
      await deleteTopicMutation.mutateAsync(topicId);
    } catch (error) {
      console.error("Error deleting topic:", error);
      throw error;
    }
  };

  const handleAddWord = async (wordData, topicFromMyLists = null) => {
    try {
      // Sử dụng topic từ MyLists nếu có, nếu không thì dùng selectedTopic
      const targetTopic = topicFromMyLists || selectedTopic;
      
      if (!targetTopic || !targetTopic.id) {
        throw new Error("Không tìm thấy topic để thêm từ");
      }
      
      console.log("Adding word:", wordData);
      console.log("Target topic:", targetTopic);
      
      await addWordMutation.mutateAsync({
        topicId: targetTopic.id,
        wordData: wordData
      });
    } catch (error) {
      console.error("Error adding word:", error);
      throw error;
    }
  };

  const getCurrentTopics = () => {
    switch (activeTab) {
      case "explore":
        return exploreTopicsData?.DT?.topics || [];
      case "my-lists":
        return userTopicsData?.DT?.topics || [];
      case "learning":
        return [];
      default:
        return [];
    }
  };

  const currentTopics = getCurrentTopics();
  const isLoading = exploreLoading || userTopicsLoading;
  const hasError = exploreError || userTopicsError;

  // Debug logs
  console.log('Current active tab:', activeTab);
  console.log('Current topics:', currentTopics);
  console.log('User topics data:', userTopicsData);
  console.log('User topics loading:', userTopicsLoading);
  console.log('User topics error:', userTopicsError);

  if (selectedTopic) {
    // Kiểm tra xem topic có phải từ "List từ của tôi" không
    // Topics từ "List từ của tôi" sẽ có created_by hoặc topic_type = 'user_created'
    const isFromMyLists = selectedTopic.created_by || selectedTopic.topic_type === 'user_created';
    
    return (
      <FlashcardDetail
        topic={selectedTopic}
        onBack={handleBack}
        showActionButtons={isFromMyLists}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flashcard-page">
        <div className="flashcard-container">
          <div className="flashcard-header">
            <h1>Flashcards</h1>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="flashcard-page">
        <div className="flashcard-container">
          <div className="flashcard-header">
            <h1>Flashcards</h1>
          </div>
          <div className="error-container">
            <p>Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-page">
      <div className="flashcard-container">
        <div className="flashcard-header">
          <h1>Flashcards</h1>
        </div>

        <FlashcardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Info Banner */}
        <div className="info-banner">
          <div className="info-icon">ℹ</div>
          <p>
            Chú ý: Bạn có thể tạo flashcards từ highlights (bao gồm các
            highlights các bạn đã tạo trước đây) trong trang chi tiết
          </p>
        </div>


        {/* Content based on active tab */}
        {activeTab === "explore" && (
          <div className="topics-section">
            <h3>Khám phá các chủ đề:</h3>
            {exploreLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải topics khám phá...</p>
              </div>
            ) : exploreError ? (
              <div className="error-container">
                <p>Có lỗi khi tải topics khám phá</p>
              </div>
            ) : (
              <div className="topics-grid">
                {currentTopics.map((topic) => (
                  <FlashcardCard
                    key={topic.id}
                    topic={topic}
                    onClick={handleTopicClick}
                    showUserInfo={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "my-lists" && (
          <MyLists
            topics={currentTopics}
            loading={userTopicsLoading}
            error={userTopicsError}
            onTopicClick={handleTopicClick}
            onCreateTopic={() => setShowCreateModal(true)}
            onUpdateTopic={handleUpdateTopic}
            onDeleteTopic={handleDeleteTopic}
            onAddWord={handleAddWord}
          />
        )}

        {activeTab === "learning" && (
          <div className="topics-section">
            <h3>Đang học:</h3>
            <div className="empty-learning">
              <p>
                Bạn chưa học list từ nào. Khám phá ngay hoặc bắt đầu tạo các
                list từ mới.
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {currentTopics.length > 0 && (
          <div className="pagination">
            <button className="pagination-btn active">1</button>
          </div>
        )}
      </div>

      {/* Modal tạo list từ */}
      <CreateTopicModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTopic}
      />
    </div>
  );
};

export default Flashcard;