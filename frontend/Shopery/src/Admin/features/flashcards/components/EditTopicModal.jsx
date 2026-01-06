import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { useUpdateTopic } from "../../words/hooks/useWordsAdminMutations";
import { wordsAdminApi } from "../../words/api/wordsAdminApi";
import "./TopicModals.scss";

export default function EditTopicModal({ topicId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    topic_name: "",
    description: "",
    image_url: "",
    logo_url: "",
    topic_type: "system",
    is_public: true,
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const updateTopicMutation = useUpdateTopic();
  
  // Fetch topic detail using API directly
  useEffect(() => {
    if (topicId) {
      setIsLoading(true);
      wordsAdminApi.getTopics({ page: 1, limit: 1000 }).then((response) => {
        if (response?.EC === "0") {
          const topic = response.DT?.topics?.find((t) => t.topic_id === parseInt(topicId));
          if (topic) {
            setFormData({
              topic_name: topic.topic_name || "",
              description: topic.description || "",
              image_url: topic.image_url || "",
              logo_url: topic.logo_url || "",
              topic_type: topic.topic_type || "system",
              is_public: topic.is_public !== undefined ? topic.is_public : true,
            });
          }
        }
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  }, [topicId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.topic_name.trim()) {
      newErrors.topic_name = "Topic name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    updateTopicMutation.mutate(
      { topicId, payload: formData },
      {
        onSuccess: (data) => {
          if (data?.EC === "0") {
            onSuccess?.();
          }
        },
      }
    );
  };
  
  if (isLoading) {
    return (
      <div className="topic-modal-overlay" onClick={onClose}>
        <div className="topic-modal" onClick={(e) => e.stopPropagation()}>
          <div className="topic-modal__loading">Loading topic...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="topic-modal-overlay" onClick={onClose}>
      <div className="topic-modal" onClick={(e) => e.stopPropagation()}>
        <div className="topic-modal__header">
          <h2 className="topic-modal__title">Edit Topic</h2>
          <button className="topic-modal__close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>
        
        <form className="topic-modal__form" onSubmit={handleSubmit}>
          <div className="topic-modal__field">
            <label className="topic-modal__label">
              Topic Name <span className="topic-modal__required">*</span>
            </label>
            <input
              type="text"
              name="topic_name"
              className={`topic-modal__input ${
                errors.topic_name ? "topic-modal__input--error" : ""
              }`}
              value={formData.topic_name}
              onChange={handleChange}
              placeholder="Enter topic name..."
            />
            {errors.topic_name && (
              <div className="topic-modal__error">{errors.topic_name}</div>
            )}
          </div>
          
          <div className="topic-modal__field">
            <label className="topic-modal__label">Description</label>
            <textarea
              name="description"
              className="topic-modal__textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter topic description..."
              rows={4}
            />
          </div>
          
          <div className="topic-modal__field">
            <label className="topic-modal__label">Image URL</label>
            <input
              type="text"
              name="image_url"
              className="topic-modal__input"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="topic-modal__field">
            <label className="topic-modal__label">Logo URL</label>
            <input
              type="text"
              name="logo_url"
              className="topic-modal__input"
              value={formData.logo_url}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          <div className="topic-modal__field">
            <label className="topic-modal__label">Topic Type</label>
            <select
              name="topic_type"
              className="topic-modal__select"
              value={formData.topic_type}
              onChange={handleChange}
            >
              <option value="system">System</option>
              <option value="user_created">User Created</option>
            </select>
          </div>
          
          <div className="topic-modal__field">
            <label className="topic-modal__checkbox-label">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
              />
              <span>Is Public</span>
            </label>
          </div>
          
          <div className="topic-modal__footer">
            <button
              type="button"
              className="topic-modal__btn topic-modal__btn--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="topic-modal__btn topic-modal__btn--submit"
              disabled={updateTopicMutation.isPending}
            >
              {updateTopicMutation.isPending ? "Updating..." : "Update Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

