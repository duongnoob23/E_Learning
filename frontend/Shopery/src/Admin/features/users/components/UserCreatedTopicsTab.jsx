import React from "react";
import { useUserCreatedTopics } from "../hooks/useUsersAdminQueries";
import { HiUsers, HiBookOpen } from "react-icons/hi2";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UserCreatedTopicsTab({ userId }) {
  const { data, isLoading, error } = useUserCreatedTopics(userId);

  if (isLoading) {
    return <div className="user-detail__loading">Loading created topics...</div>;
  }

  if (error) {
    return (
      <div className="user-detail__error">
        <p>Error loading created topics: {error.message}</p>
        <p>Response: {JSON.stringify(data, null, 2)}</p>
      </div>
    );
  }

  const topics = data?.DT?.topics || [];
  const statistics = data?.DT?.statistics || {};

  return (
    <div className="user-detail__created-topics">
      {/* Statistics */}
      <div className="user-detail__stats-grid">
        <div className="user-detail__stat-card">
          <HiBookOpen className="user-detail__stat-icon" />
          <div className="user-detail__stat-info">
            <div className="user-detail__stat-value">{statistics.total_topics || 0}</div>
            <div className="user-detail__stat-label">Tổng số topics</div>
          </div>
        </div>
        <div className="user-detail__stat-card">
          <HiBookOpen className="user-detail__stat-icon" />
          <div className="user-detail__stat-info">
            <div className="user-detail__stat-value">{statistics.total_words || 0}</div>
            <div className="user-detail__stat-label">Tổng số từ</div>
          </div>
        </div>
        <div className="user-detail__stat-card">
          <HiUsers className="user-detail__stat-icon" />
          <div className="user-detail__stat-info">
            <div className="user-detail__stat-value">{statistics.total_learners || 0}</div>
            <div className="user-detail__stat-label">Người học</div>
          </div>
        </div>
        <div className="user-detail__stat-card">
          <HiBookOpen className="user-detail__stat-icon" />
          <div className="user-detail__stat-info">
            <div className="user-detail__stat-value">
              {statistics.average_words_per_topic?.toFixed(1) || 0}
            </div>
            <div className="user-detail__stat-label">Trung bình từ/topic</div>
          </div>
        </div>
      </div>

      {/* Topics Table */}
      <div className="user-detail__table-wrapper">
        <h3 className="user-detail__section-title">Danh sách topics đã tạo</h3>
        {topics.length === 0 ? (
          <p className="user-detail__empty">Người dùng chưa tạo topic nào</p>
        ) : (
          <table className="user-detail__table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Số từ</th>
                <th>Người học</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.topic_id}>
                  <td>
                    <div className="user-detail__topic-info">
                      {topic.image_url && (
                        <img src={topic.image_url} alt="" className="user-detail__topic-img" />
                      )}
                      <div>
                        <div className="user-detail__topic-name">{topic.topic_name}</div>
                        {topic.description && (
                          <div className="user-detail__topic-desc">{topic.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{topic.word_count || 0}</td>
                  <td>{topic.learners_count || 0}</td>
                  <td>
                    {topic.is_active ? (
                      <span className="user-detail__badge user-detail__badge--success">Active</span>
                    ) : (
                      <span className="user-detail__badge user-detail__badge--muted">Inactive</span>
                    )}
                  </td>
                  <td>{formatDate(topic.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

