import React from "react";
import { useUserFlashcardProgress } from "../hooks/useUsersAdminQueries";
import { HiFire, HiBookOpen } from "react-icons/hi2";

function formatDate(dateString) {
  if (!dateString) return "Chưa học";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Chưa học";
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UserFlashcardsTab({ userId }) {
  const { data, isLoading, error } = useUserFlashcardProgress(userId);

  if (isLoading) {
    return <div className="user-detail__loading">Loading flashcard progress...</div>;
  }

  if (error) {
    return (
      <div className="user-detail__error">
        <p>Error loading flashcard progress: {error.message}</p>
        <p>Response: {JSON.stringify(data, null, 2)}</p>
      </div>
    );
  }

  const overall = data?.DT?.overall || {};
  const topics = data?.DT?.topics || [];

  return (
    <div className="user-detail__flashcards">
      {/* Overall Statistics */}
      <div className="user-detail__stats-grid">
        <div className="user-detail__stat-card">
          <HiBookOpen className="user-detail__stat-icon" />
          <div className="user-detail__stat-info">
            <div className="user-detail__stat-value">{overall.total_words_learned || 0}</div>
            <div className="user-detail__stat-label">Từ đã học</div>
          </div>
        </div>
        <div className="user-detail__stat-card">
          <HiBookOpen className="user-detail__stat-icon" />
          <div className="user-detail__stat-info">
            <div className="user-detail__stat-value">{overall.total_topics_studied || 0}</div>
            <div className="user-detail__stat-label">Topics đã học</div>
          </div>
        </div>
        <div className="user-detail__stat-card">
          <HiFire className="user-detail__stat-icon" />
          <div className="user-detail__stat-info">
            <div className="user-detail__stat-value">{overall.study_streak || 0}</div>
            <div className="user-detail__stat-label">Ngày liên tiếp</div>
          </div>
        </div>
      </div>

      {/* Topics Progress */}
      <div className="user-detail__table-wrapper">
        <h3 className="user-detail__section-title">Tiến độ học theo topic</h3>
        {topics.length === 0 ? (
          <p className="user-detail__empty">Người dùng chưa học topic nào</p>
        ) : (
          <table className="user-detail__table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Tổng từ</th>
                <th>Đã học</th>
                <th>Đang học</th>
                <th>Chưa học</th>
                <th>Tiến độ</th>
                <th>Lần học gần nhất</th>
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
                  <td>{topic.total_words}</td>
                  <td>
                    <span className="user-detail__badge user-detail__badge--success">
                      {topic.words_learned}
                    </span>
                  </td>
                  <td>
                    <span className="user-detail__badge user-detail__badge--warning">
                      {topic.words_learning}
                    </span>
                  </td>
                  <td>
                    <span className="user-detail__badge user-detail__badge--muted">
                      {topic.words_new}
                    </span>
                  </td>
                  <td>
                    <div className="user-detail__progress">
                      <div
                        className="user-detail__progress-bar"
                        style={{ width: `${topic.progress_percent || 0}%` }}
                      />
                      <span>{topic.progress_percent?.toFixed(1) || 0}%</span>
                    </div>
                  </td>
                  <td>{formatDate(topic.last_studied_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

