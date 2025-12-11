import React, { useEffect, forwardRef } from "react";
import { HiInformationCircle } from "react-icons/hi2";
import "./CourseInfoTab.scss";

const CourseInfoTab = forwardRef(({ data, onChange, errors = {}, refs = {}, register }, ref) => {
  const {
    title = "",
    slug = "",
    about = "",
    priceType = "paid",
    regularPrice = "",
    discountedPrice = "",
    category = null,
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

  return (
    <div className="course-info-tab">
      <h2 className="course-info-tab__title">Course Info</h2>

      {/* Course Title */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">
          Course Title <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          ref={refs?.titleRef}
          type="text"
          className={`course-info-tab__input ${errors.title ? "course-info-tab__input--error" : ""}`}
          placeholder="New Course"
          value={title}
          onChange={(e) => handleChange("title", e.target.value)}
          maxLength={200}
        />
        <div className="course-info-tab__helper">
          <HiInformationCircle className="course-info-tab__helper-icon" />
          Title should be at least 3 characters and less than 200 characters.
        </div>
        {errors.title && (
          <div className="course-info-tab__error">{errors.title.message || errors.title}</div>
        )}
      </div>

      {/* Course Slug */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">
          Course Slug <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          ref={refs?.slugRef}
          type="text"
          className={`course-info-tab__input ${errors.slug ? "course-info-tab__input--error" : ""}`}
          placeholder="new-course"
          value={slug}
          onChange={(e) => handleChange("slug", e.target.value)}
        />
        <div className="course-info-tab__helper">
          <HiInformationCircle className="course-info-tab__helper-icon" />
          Permalink: https://yourdomain.com/{slug || "new-course"}
        </div>
        {errors.slug && (
          <div className="course-info-tab__error">{errors.slug.message || errors.slug}</div>
        )}
      </div>

      {/* About Course */}
      <div className="course-info-tab__field">
        <label className="course-info-tab__label">
          About Course <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea
          ref={refs?.aboutRef}
          className={`course-info-tab__textarea ${errors.about ? "course-info-tab__textarea--error" : ""}`}
          placeholder="Enter course description..."
          value={about}
          onChange={(e) => handleChange("about", e.target.value)}
          rows={6}
        />
        <div className="course-info-tab__helper">
          <HiInformationCircle className="course-info-tab__helper-icon" />
          HTML or plain text allowed. No emoji. This field is used for search,
          so please be descriptive! (At least 10 characters)
        </div>
        {errors.about && (
          <div className="course-info-tab__error">{errors.about.message || errors.about}</div>
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
                Regular Price ($) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                ref={refs?.regularPriceRef}
                type="number"
                className={`course-info-tab__input ${errors.regularPrice ? "course-info-tab__input--error" : ""}`}
                placeholder="$ Regular Price"
                value={regularPrice}
                onChange={(e) => handleChange("regularPrice", e.target.value)}
                min="0"
                max="10000"
                step="0.01"
              />
              <div className="course-info-tab__helper">
                The Course Price Includes Your Author Fee. (Must be greater than 0 and less than $10,000)
              </div>
              {errors.regularPrice && (
                <div className="course-info-tab__error">
                  {errors.regularPrice.message || errors.regularPrice}
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

    </div>
  );
});

CourseInfoTab.displayName = "CourseInfoTab";

export default CourseInfoTab;
