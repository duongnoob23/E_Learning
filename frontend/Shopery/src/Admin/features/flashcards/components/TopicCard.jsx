import {
  HiCheckCircle,
  HiEllipsisVertical,
  HiEye,
  HiPencil,
  HiTrash,
  HiXCircle,
} from "react-icons/hi2";
import "./TopicCard.scss";

export default function TopicCard({
  topic,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  onPreview,
  showActionMenu,
  onToggleActionMenu,
}) {
  return (
    <div className="topic-card">
      <div className="topic-card__image-wrapper">
        {topic.image_url ? (
          <img
            src={topic.image_url}
            alt={topic.topic_name}
            className="topic-card__image"
          />
        ) : (
          <div className="topic-card__image-placeholder">
            <HiEye />
          </div>
        )}
        <div className="topic-card__overlay">
          <button className="topic-card__view-btn" onClick={onView}>
            View Words
          </button>
        </div>
      </div>

      <div className="topic-card__content">
        <div className="topic-card__header">
          <h3 className="topic-card__title">{topic.topic_name}</h3>
          <div className="topic-card__action-menu-wrapper">
            <button
              className="topic-card__action-btn"
              onClick={onToggleActionMenu}
            >
              <HiEllipsisVertical />
            </button>
            {showActionMenu && (
              <div className="topic-card__action-menu">
                <button
                  className="topic-card__action-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview?.();
                  }}
                >
                  <HiEye /> Preview
                </button>
                <button className="topic-card__action-item" onClick={onEdit}>
                  <HiPencil /> Edit
                </button>
                <button
                  className="topic-card__action-item"
                  onClick={onToggleActive}
                >
                  {topic.is_active ? (
                    <>
                      <HiXCircle /> Deactivate
                    </>
                  ) : (
                    <>
                      <HiCheckCircle /> Activate
                    </>
                  )}
                </button>
                <button
                  className="topic-card__action-item topic-card__action-item--danger"
                  onClick={onDelete}
                >
                  <HiTrash /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="topic-card__description">
          {topic.description || "No description"}
        </p>

        <div className="topic-card__footer">
          <div className="topic-card__badges">
            <span
              className={`topic-card__type-badge ${
                topic.topic_type === "system"
                  ? "topic-card__type-badge--system"
                  : "topic-card__type-badge--user"
              }`}
            >
              {topic.topic_type === "system" ? "SYSTEM" : "USER"}
            </span>
            <span
              className={`topic-card__status-badge ${
                topic.is_active
                  ? "topic-card__status-badge--active"
                  : "topic-card__status-badge--inactive"
              }`}
            >
              {topic.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="topic-card__word-count">
            {topic.word_count || 0} words
          </div>
        </div>
      </div>
    </div>
  );
}
