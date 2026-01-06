// Client/components/Flashcard/CreateTopicModal/CreateTopicModal.jsx - Updated based on admin design
import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { useCreateSet } from "../../../services/Word/wordMutations";
import "./CreateTopicModal.css";

export default function CreateTopicModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    topic_name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const createSetMutation = useCreateSet();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
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

    createSetMutation.mutate(
      {
        topic_name: formData.topic_name.trim(),
        description: formData.description.trim() || null,
      },
      {
        onSuccess: (data) => {
          if (data?.EC === "0") {
            setFormData({ topic_name: "", description: "" });
            setErrors({});
            onSuccess?.();
            onClose();
          }
        },
      }
    );
  };

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({ topic_name: "", description: "" });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="create-topic-modal-overlay" onClick={onClose}>
      <div className="create-topic-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-topic-modal__header">
          <h2 className="create-topic-modal__title">Create New Topic</h2>
          <button className="create-topic-modal__close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <form className="create-topic-modal__form" onSubmit={handleSubmit}>
          <div className="create-topic-modal__field">
            <label className="create-topic-modal__label">
              Topic Name <span className="create-topic-modal__required">*</span>
            </label>
            <input
              type="text"
              name="topic_name"
              className={`create-topic-modal__input ${
                errors.topic_name ? "create-topic-modal__input--error" : ""
              }`}
              value={formData.topic_name}
              onChange={handleChange}
              placeholder="Enter topic name..."
            />
            {errors.topic_name && (
              <div className="create-topic-modal__error">{errors.topic_name}</div>
            )}
          </div>

          <div className="create-topic-modal__field">
            <label className="create-topic-modal__label">Description</label>
            <textarea
              name="description"
              className="create-topic-modal__textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter topic description..."
              rows={4}
            />
          </div>

          <div className="create-topic-modal__footer">
            <button
              type="button"
              className="create-topic-modal__btn create-topic-modal__btn--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-topic-modal__btn create-topic-modal__btn--submit"
              disabled={createSetMutation.isPending}
            >
              {createSetMutation.isPending ? "Creating..." : "Create Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
