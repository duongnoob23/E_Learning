import React, { useEffect } from "react";
import "./CourseInfoTab.scss";

export default function CourseInfoTab({ data, onChange, errors = {} }) {
  const {
    title = "",
    slug = "",
    about = "",
    priceType = "paid",
    regularPrice = "",
    discountedPrice = "",
    category = null,
    thumbnail = null,
  } = data;

  // Auto-generate slug from title (only if slug is empty)
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      onChange({ slug: generatedSlug });
    }
  }, [title]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="course-info-tab">
      <h2 className="course-info-tab__title">Course Info</h2>

      {/* Course Title */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">Course Title</label>
        <input
          type="text"
          className="course-info-tab__input"
          placeholder="New Course"
          value={title}
          onChange={(e) => handleChange("title", e.target.value)}
          maxLength={30}
        />
        <div className="course-info-tab__helper">
          <span className="course-info-tab__helper-icon">ℹ️</span>
          Title should be 30 characters.
        </div>
        {errors.title && (
          <div className="course-info-tab__error">{errors.title}</div>
        )}
      </div>

      {/* Course Slug */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">Course Slug</label>
        <input
          type="text"
          className="course-info-tab__input"
          placeholder="new-course"
          value={slug}
          onChange={(e) => handleChange("slug", e.target.value)}
        />
        <div className="course-info-tab__helper">
          <span className="course-info-tab__helper-icon">ℹ️</span>
          Permalink: https://yourdomain.com/{slug || "new-course"}
        </div>
        {errors.slug && (
          <div className="course-info-tab__error">{errors.slug}</div>
        )}
      </div>

      {/* About Course */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">About Course</label>
        <textarea
          className="course-info-tab__textarea"
          placeholder="Enter course description..."
          value={about}
          onChange={(e) => handleChange("about", e.target.value)}
          rows={6}
        />
        <div className="course-info-tab__helper">
          <span className="course-info-tab__helper-icon">ℹ️</span>
          HTML or plain text allowed. No emoji. This field is used for search,
          so please be descriptive!
        </div>
        {errors.about && (
          <div className="course-info-tab__error">{errors.about}</div>
        )}
      </div>

      {/* Course Price */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">Course Price</label>
        <div className="course-info-tab__price-toggle">
          <button
            type="button"
            className={`course-info-tab__toggle-btn ${
              priceType === "paid" ? "course-info-tab__toggle-btn--active" : ""
            }`}
            onClick={() => handleChange("priceType", "paid")}
          >
            Paid
          </button>
          <button
            type="button"
            className={`course-info-tab__toggle-btn ${
              priceType === "free" ? "course-info-tab__toggle-btn--active" : ""
            }`}
            onClick={() => handleChange("priceType", "free")}
          >
            Free
          </button>
        </div>

        {priceType === "paid" && (
          <div className="course-info-tab__price-fields">
            <div className="course-info-tab__price-field">
              <label className="course-info-tab__price-label">
                Regular Price ($)
              </label>
              <input
                type="number"
                className="course-info-tab__input"
                placeholder="$ Regular Price"
                value={regularPrice}
                onChange={(e) => handleChange("regularPrice", e.target.value)}
              />
              <div className="course-info-tab__helper">
                The Course Price Includes Your Author Fee.
              </div>
              {errors.regularPrice && (
                <div className="course-info-tab__error">
                  {errors.regularPrice}
                </div>
              )}
            </div>
            <div className="course-info-tab__price-field">
              <label className="course-info-tab__price-label">
                Discounted Price ($)
              </label>
              <input
                type="number"
                className="course-info-tab__input"
                placeholder="$ Discounted Price"
                value={discountedPrice}
                onChange={(e) =>
                  handleChange("discountedPrice", e.target.value)
                }
              />
              <div className="course-info-tab__helper">
                The Course Price Includes Your Author Fee.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Choose Categories */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">Choose Categories</label>
        <div className="course-info-tab__dropdown-wrapper">
          <input
            type="text"
            className="course-info-tab__input course-info-tab__input--dropdown"
            placeholder="Search Course Category. ex. Design, Development, Business"
            value={category?.name || "aaa"}
            onChange={(e) => {
              // TODO: Implement search dropdown
              console.log("Search category:", e.target.value);
            }}
          />
          <span className="course-info-tab__dropdown-arrow">▼</span>
        </div>
        {errors.category && (
          <div className="course-info-tab__error">{errors.category}</div>
        )}
      </div>

      {/* Course Thumbnail */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">Course Thumbnail</label>
        <div className="course-info-tab__upload-box">
          {thumbnail ? (
            <div className="course-info-tab__thumbnail-preview">
              <img src={thumbnail} alt="Thumbnail preview" />
              <button
                type="button"
                className="course-info-tab__remove-thumbnail"
                onClick={() => handleChange("thumbnail", null)}
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <div className="course-info-tab__upload-icon">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7 18h10M12 6v12m-6-6l6-6 6 6"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="course-info-tab__upload-text">
                Choose A File
              </span>
            </>
          )}
          <input
            type="file"
            className="course-info-tab__file-input"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleThumbnailChange}
          />
        </div>
        <div className="course-info-tab__helper">
          Size: 700x430 pixels, File Support: JPG, JPEG, PNG, GIF, WEBP
        </div>
        {errors.thumbnail && (
          <div className="course-info-tab__error">{errors.thumbnail}</div>
        )}
      </div>
    </div>
  );
}
