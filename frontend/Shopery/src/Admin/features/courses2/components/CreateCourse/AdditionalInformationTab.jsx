import React from "react";
import "./AdditionalInformationTab.scss";

const LANGUAGES = [
  "English",
  "Vietnamese",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
];

export default function AdditionalInformationTab({ data, onChange, errors = {} }) {
  const {
    startDate = "",
    language = "English",
    requirements = "",
    requirementsPerLine = false,
    description = "",
    descriptionPerLine = false,
    durationHour = "",
    durationMinute = "",
    tags = "",
    targetedAudience = "",
  } = data;

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="additional-info-tab">
      <h2 className="additional-info-tab__title">Additional Information</h2>

      {/* Start Date & Language */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__row">
          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">
              Start Date
            </label>
            <div className="additional-info-tab__date-wrapper">
              <input
                type="date"
                className="additional-info-tab__input"
                value={startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                placeholder="dd/mm/yyyy"
              />
              <span className="additional-info-tab__date-icon">📅</span>
            </div>
            {errors.startDate && (
              <div className="additional-info-tab__error">{errors.startDate}</div>
            )}
          </div>

          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">Language</label>
            <div className="additional-info-tab__select-wrapper">
              <select
                className="additional-info-tab__select"
                value={language}
                onChange={(e) => handleChange("language", e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <span className="additional-info-tab__select-arrow">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements & Description */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__row">
          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">Requirements</label>
            <textarea
              className="additional-info-tab__textarea"
              placeholder="Add your course benefits here."
              value={requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              rows={6}
            />
            <label className="additional-info-tab__radio-label">
              <input
                type="radio"
                name="requirementsPerLine"
                checked={requirementsPerLine}
                onChange={(e) => handleChange("requirementsPerLine", e.target.checked)}
              />
              <span>Enter for per line.</span>
            </label>
            {errors.requirements && (
              <div className="additional-info-tab__error">{errors.requirements}</div>
            )}
          </div>

          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">Description</label>
            <textarea
              className="additional-info-tab__textarea"
              placeholder="Add your course benefits here."
              value={description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={6}
            />
            <label className="additional-info-tab__radio-label">
              <input
                type="radio"
                name="descriptionPerLine"
                checked={descriptionPerLine}
                onChange={(e) => handleChange("descriptionPerLine", e.target.checked)}
              />
              <span>Enter for per line.</span>
            </label>
            {errors.description && (
              <div className="additional-info-tab__error">{errors.description}</div>
            )}
          </div>
        </div>
      </div>

      {/* Total Course Duration */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__row">
          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">Hour.</label>
            <input
              type="number"
              className="additional-info-tab__input additional-info-tab__input--number"
              placeholder="00"
              value={durationHour}
              onChange={(e) => handleChange("durationHour", e.target.value)}
              min="0"
              max="999"
            />
            {errors.durationHour && (
              <div className="additional-info-tab__error">{errors.durationHour}</div>
            )}
          </div>

          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">Minute.</label>
            <input
              type="number"
              className="additional-info-tab__input additional-info-tab__input--number"
              placeholder="00"
              value={durationMinute}
              onChange={(e) => handleChange("durationMinute", e.target.value)}
              min="0"
              max="59"
            />
            {errors.durationMinute && (
              <div className="additional-info-tab__error">{errors.durationMinute}</div>
            )}
          </div>
        </div>
      </div>

      {/* Course Tags */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__field">
          <label className="additional-info-tab__label">Course Tags</label>
          <textarea
            className="additional-info-tab__textarea"
            placeholder="Add your course tag here."
            value={tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            rows={4}
          />
          <div className="additional-info-tab__helper">
            Maximum of 15 keywords covering features, usage, and styling. Keywords
            should all be in lowercase and separated by commas. e.g., photography,
            gallery, modern, jquery, wordpress theme.
          </div>
          {errors.tags && (
            <div className="additional-info-tab__error">{errors.tags}</div>
          )}
        </div>
      </div>

      {/* Targeted Audience */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__field">
          <label className="additional-info-tab__label">Targeted Audience</label>
          <textarea
            className="additional-info-tab__textarea"
            placeholder="Add your course tag here."
            value={targetedAudience}
            onChange={(e) => handleChange("targetedAudience", e.target.value)}
            rows={4}
          />
          <div className="additional-info-tab__helper">
            Specify the target audience that will benefit the most from the course.
          </div>
          {errors.targetedAudience && (
            <div className="additional-info-tab__error">{errors.targetedAudience}</div>
          )}
        </div>
      </div>
    </div>
  );
}

