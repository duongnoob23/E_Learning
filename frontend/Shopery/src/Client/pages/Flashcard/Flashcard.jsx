// Client/pages/Flashcard/Flashcard.jsx
import { useState } from "react";
import CreateTopicModal from "../../components/Flashcard/CreateTopicModal/CreateTopicModal";
import FlashcardCard from "../../components/Flashcard/FlashcardCard/FlashcardCard";
import FlashcardDetail from "../../components/Flashcard/FlashcardDetail/FlashcardDetail";
import FlashcardTabs from "../../components/Flashcard/FlashcardTabs/FlashcardTabs";
import { useCreateSet } from "../../services/Word/wordMutations";
import {
  usePublicTopics,
  useUserTopics,
  useWordOverview,
} from "../../services/Word/wordQueries";
import "./Flashcard.css";

const Flashcard = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);

  // Fetch data từ API
  const { data: publicTopicsData, isLoading: isLoadingPublic } =
    usePublicTopics(activeTab === "explore");
  const { data: userTopicsData, isLoading: isLoadingUser } = useUserTopics(
    activeTab === "my-lists" || activeTab === "learning"
  );
  const { data: learningOverviewData } = useWordOverview(
    activeTab === "learning"
  );

  // Mutations
  const createSetMutation = useCreateSet();

  // Transform data từ API sang format component
  const transformTopicData = (topic, topicType = "system") => ({
    id: topic.topic_id,
    title: topic.topic_name,
    description: topic.description || "",
    wordCount: topic.word_count || 0,
    // Nếu backend có trường view_count thì dùng, không thì mặc định 0
    viewCount: topic.view_count || 0,
    logo: topic.image_url || topic.logo_url || "/images/study4-logo.png",
    category: "general",
    difficulty: "intermediate",
    topicType: topicType,
    // Provider dùng để hiển thị giống layout Study4
    provider: topic.provider || "study4",
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedTopic(null);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleCreateTopic = async (formData) => {
    try {
      await createSetMutation.mutateAsync({
        topic_name: formData.title,
        description: formData.description,
      });
      setShowCreateTopicModal(false);
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  const getCurrentTopics = () => {
    switch (activeTab) {
      case "explore":
        // Topics hệ thống
        if (publicTopicsData?.EC === "0" && publicTopicsData?.DT) {
          return publicTopicsData.DT.map((topic) =>
            transformTopicData(topic, "system")
          );
        }
        return [];
      case "my-lists":
        // Topics cá nhân
        if (userTopicsData?.EC === "0" && userTopicsData?.DT) {
          return userTopicsData.DT.map((topic) =>
            transformTopicData(topic, "user_created")
          );
        }
        return [];
      case "learning":
        // Topics đang học - lấy từ cả hệ thống và cá nhân có từ đang học
        const learningTopics = [];
        // Lấy topics hệ thống có từ đang học
        if (publicTopicsData?.EC === "0" && publicTopicsData?.DT) {
          publicTopicsData.DT.forEach((topic) => {
            // TODO: Filter topics có từ đang học (cần check UserWordStatus)
            // Tạm thời hiển thị tất cả topics hệ thống
            learningTopics.push(transformTopicData(topic, "system"));
          });
        }
        // Lấy topics cá nhân có từ đang học
        if (userTopicsData?.EC === "0" && userTopicsData?.DT) {
          userTopicsData.DT.forEach((topic) => {
            // TODO: Filter topics có từ đang học
            learningTopics.push(transformTopicData(topic, "user_created"));
          });
        }
        return learningTopics;
      default:
        return [];
    }
  };

  const currentTopics = getCurrentTopics();
  const isLoading =
    (activeTab === "explore" && isLoadingPublic) ||
    ((activeTab === "my-lists" || activeTab === "learning") && isLoadingUser);

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
        <div className="flashcard-header">
          <h1>Flashcards</h1>
        </div>

        <FlashcardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Info Banner */}
        <div className="info-banner">
          <div className="info-icon">ℹ</div>
          <p>
            Chú ý: Bạn có thể tạo flashcards từ highlights (bao gồm các
            highlights các bạn đã tạo trước đây) trong trang chi tiết
          </p>
        </div>

        {/* Content based on active tab */}
        {isLoading && (
          <div className="topics-section">
            <p>Đang tải...</p>
          </div>
        )}

        {!isLoading && activeTab === "explore" && (
          <div className="topics-section">
            <h3>Khám phá các chủ đề:</h3>
            {currentTopics.length > 0 ? (
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
            ) : (
              <div className="empty-learning">
                <p>Không có chủ đề nào.</p>
              </div>
            )}
          </div>
        )}

        {!isLoading && activeTab === "my-lists" && (
          <div className="topics-section">
            <div className="section-header">
              <h3>List từ đã tạo:</h3>
            </div>
            <div className="topics-grid">
              {/* Card tạo topic mới */}
              <FlashcardCard
                isCreateCard={true}
                onClick={() => setShowCreateTopicModal(true)}
              />
              {/* Danh sách topics */}
              {currentTopics.length > 0 &&
                currentTopics.map((topic) => (
                  <FlashcardCard
                    key={topic.id}
                    topic={topic}
                    onClick={handleTopicClick}
                    showUserInfo={true}
                  />
                ))}
            </div>
            {currentTopics.length === 0 && (
              <div className="empty-learning">
                <p>Chưa có list từ nào được tạo. Nhấn vào nút + để tạo mới.</p>
              </div>
            )}
          </div>
        )}

        {!isLoading && activeTab === "learning" && (
          <div className="topics-section">
            <h3>Đang học:</h3>
            {currentTopics.length > 0 ? (
              <div className="topics-grid">
                {currentTopics.map((topic) => (
                  <FlashcardCard
                    key={topic.id}
                    topic={topic}
                    onClick={handleTopicClick}
                    showUserInfo={topic.topicType === "user_created"}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-learning">
                <p>
                  Bạn chưa học list từ nào. Khám phá ngay hoặc bắt đầu tạo các
                  list từ mới.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {currentTopics.length > 0 && (
          <div className="pagination">
            <button className="pagination-btn active">1</button>
          </div>
        )}
      </div>

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={showCreateTopicModal}
        onClose={() => setShowCreateTopicModal(false)}
        onSubmit={handleCreateTopic}
      />
    </div>
  );
};

export default Flashcard;
