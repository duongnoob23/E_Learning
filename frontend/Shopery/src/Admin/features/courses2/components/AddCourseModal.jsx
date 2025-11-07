import React, { useState } from "react";
import "./AddCourseModal.scss";

export default function AddCourseModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    status: "Draft",
    enrollments: 0,
    rating: 0,
    createdOn: new Date().toISOString().split("T")[0],
    thumbnail: null,
  });

  const [errors, setErrors] = useState({});

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.enrollments < 0) {
      newErrors.enrollments = "Enrollments must be >= 0";
    }
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      // Reset form
      setFormData({
        title: "",
        status: "Draft",
        enrollments: 0,
        rating: 0,
        createdOn: new Date().toISOString().split("T")[0],
        thumbnail: null,
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    if (
      formData.title ||
      window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      setFormData({
        title: "",
        status: "Draft",
        enrollments: 0,
        rating: 0,
        createdOn: new Date().toISOString().split("T")[0],
        thumbnail: null,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <div
      className="course-modal2__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("course-modal2__backdrop")) {
          handleClose();
        }
      }}
    >
      <div className="course-modal2" onMouseDown={(e) => e.stopPropagation()}>
        <div className="course-modal2__header">
          <div style={{ fontWeight: 600, fontSize: "18px" }}>
            Add New Course
          </div>
          <button className="course-modal2__btn-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="course-modal2__content">
          <div className="course-modal2__field">
            <label>
              Course Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter course title"
              className={errors.title ? "course-modal2__field--error" : ""}
            />
            {errors.title && (
              <div className="course-modal2__field-error">{errors.title}</div>
            )}
          </div>

          <div className="course-modal2__field">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="course-modal2__field-row">
            <div className="course-modal2__field">
              <label>Enrollments</label>
              <input
                type="number"
                min="0"
                value={formData.enrollments}
                onChange={(e) =>
                  handleChange("enrollments", parseInt(e.target.value) || 0)
                }
                className={
                  errors.enrollments ? "course-modal2__field--error" : ""
                }
              />
              {errors.enrollments && (
                <div className="course-modal2__field-error">
                  {errors.enrollments}
                </div>
              )}
            </div>

            <div className="course-modal2__field">
              <label>Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) =>
                  handleChange("rating", parseFloat(e.target.value) || 0)
                }
                className={errors.rating ? "course-modal2__field--error" : ""}
              />
              {errors.rating && (
                <div className="course-modal2__field-error">
                  {errors.rating}
                </div>
              )}
            </div>
          </div>

          <div className="course-modal2__field">
            <label>Created On</label>
            <input
              type="date"
              value={formData.createdOn}
              onChange={(e) => handleChange("createdOn", e.target.value)}
            />
          </div>

          <div className="course-modal2__field">
            <label>Thumbnail (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange("thumbnail", reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ padding: "6px" }}
            />
            {formData.thumbnail && (
              <div style={{ marginTop: "8px" }}>
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "120px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>
            )}
          </div>

          <div className="course-modal2__footer">
            <button
              type="button"
              className="course-modal2__btn"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="course-modal2__btn course-modal2__btn--primary"
            >
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
