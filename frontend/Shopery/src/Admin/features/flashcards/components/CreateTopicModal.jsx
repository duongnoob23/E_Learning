import React, { useState, useEffect, useRef } from "react";
import { HiXMark, HiMagnifyingGlass } from "react-icons/hi2";
import { useCreateTopic } from "../../words/hooks/useWordsAdminMutations";
import { useSearchUsers } from "../../users/hooks/useUsersAdminQueries";
import "./TopicModals.scss";

export default function CreateTopicModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    topic_name: "",
    description: "",
    image_url: "",
    logo_url: "",
    topic_type: "system",
    created_by: null,
    is_public: true,
  });
  
  const [errors, setErrors] = useState({});
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const userDropdownRef = useRef(null);
  
  const createTopicMutation = useCreateTopic();
  
  const { data: searchUsersData } = useSearchUsers(
    userSearchQuery,
    formData.topic_type === "user_created" && userSearchQuery.length > 0
  );
  
  const searchResults = searchUsersData?.EC === "0" ? searchUsersData.DT || [] : [];
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "topic_type") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        created_by: value === "user_created" ? null : prev.created_by,
      }));
      setSelectedUser(null);
      setUserSearchQuery("");
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      created_by: user.user_id,
    }));
    setUserSearchQuery(`${user.full_name || user.username} (${user.email})`);
    setShowUserDropdown(false);
  };
  
  const handleUserSearchChange = (e) => {
    const value = e.target.value;
    setUserSearchQuery(value);
    setShowUserDropdown(value.length > 0);
    if (!value) {
      setSelectedUser(null);
      setFormData((prev) => ({
        ...prev,
        created_by: null,
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.topic_name.trim()) {
      newErrors.topic_name = "Topic name is required";
    }
    if (formData.topic_type === "user_created" && !formData.created_by) {
      newErrors.created_by = "Please select a user";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const payload = {
      topic_name: formData.topic_name,
      description: formData.description || "",
      image_url: formData.image_url || "",
      logo_url: formData.logo_url || "",
      topic_type: formData.topic_type,
      is_public: formData.is_public,
    };
    
    if (formData.topic_type === "user_created" && formData.created_by) {
      payload.created_by = formData.created_by;
    }
    
    console.log("[CreateTopicModal] Submitting payload:", payload);
    
    createTopicMutation.mutate(payload, {
      onSuccess: (data) => {
        if (data?.EC === "0") {
          onSuccess?.();
        }
      },
    });
  };
  
  return (
    <div className="topic-modal-overlay" onClick={onClose}>
      <div className="topic-modal" onClick={(e) => e.stopPropagation()}>
        <div className="topic-modal__header">
          <h2 className="topic-modal__title">Create New Topic</h2>
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
          
          {/* User Selection - Only show when topic_type = "user_created" */}
          {formData.topic_type === "user_created" && (
            <div className="topic-modal__field" ref={userDropdownRef}>
              <label className="topic-modal__label">
                Select User <span className="topic-modal__required">*</span>
              </label>
              <div className="topic-modal__user-search-wrapper">
                <div className="topic-modal__user-search-input-wrapper">
                  <HiMagnifyingGlass className="topic-modal__search-icon" />
                  <input
                    type="text"
                    className={`topic-modal__input topic-modal__user-search-input ${
                      errors.created_by ? "topic-modal__input--error" : ""
                    }`}
                    value={userSearchQuery}
                    onChange={handleUserSearchChange}
                    onFocus={() => setShowUserDropdown(userSearchQuery.length > 0)}
                    placeholder="Search by email or name..."
                  />
                </div>
                {showUserDropdown && searchResults.length > 0 && (
                  <div className="topic-modal__user-dropdown">
                    {searchResults.map((user) => (
                      <div
                        key={user.user_id}
                        className="topic-modal__user-option"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="topic-modal__user-option-name">
                          {user.full_name || user.username}
                        </div>
                        <div className="topic-modal__user-option-email">{user.email}</div>
                      </div>
                    ))}
                  </div>
                )}
                {showUserDropdown && userSearchQuery.length > 0 && searchResults.length === 0 && (
                  <div className="topic-modal__user-dropdown">
                    <div className="topic-modal__user-option topic-modal__user-option--empty">
                      No users found
                    </div>
                  </div>
                )}
              </div>
              {errors.created_by && (
                <div className="topic-modal__error">{errors.created_by}</div>
              )}
            </div>
          )}
          
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
              disabled={createTopicMutation.isPending}
            >
              {createTopicMutation.isPending ? "Creating..." : "Create Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

