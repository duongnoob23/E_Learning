import React, { forwardRef } from "react";
import { HiCalendar } from "react-icons/hi2";
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

const AdditionalInformationTab = forwardRef(({ data, onChange, errors = {}, refs = {}, register }, ref) => {
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
    <div className="additional-info-tab" ref={ref}>
      <h2 className="additional-info-tab__title">
        Additional Information <span style={{ color: "#ef4444" }}>*</span>
      </h2>

      {/* Start Date & Language */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__row">
          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">
              Start Date <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div className="additional-info-tab__date-wrapper">
              <input
                ref={refs?.startDateRef}
                type="date"
                className={`additional-info-tab__input ${errors.startDate ? "additional-info-tab__input--error" : ""}`}
                value={startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                placeholder="dd/mm/yyyy"
              />
              <HiCalendar className="additional-info-tab__date-icon" />
            </div>
            {errors.startDate && (
              <div className="additional-info-tab__error">
                {errors.startDate?.message || (typeof errors.startDate === 'string' ? errors.startDate : '')}
              </div>
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
            <label className="additional-info-tab__label">
              Requirements <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              ref={refs?.requirementsRef}
              className={`additional-info-tab__textarea ${errors.requirements ? "additional-info-tab__textarea--error" : ""}`}
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
              <div className="additional-info-tab__error">
                {errors.requirements?.message || (typeof errors.requirements === 'string' ? errors.requirements : '')}
              </div>
            )}
          </div>

          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              ref={refs?.descriptionRef}
              className={`additional-info-tab__textarea ${errors.description ? "additional-info-tab__textarea--error" : ""}`}
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
              <div className="additional-info-tab__error">
                {errors.description?.message || (typeof errors.description === 'string' ? errors.description : '')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Course Duration */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__row">
          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">
              Hour. <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              ref={refs?.durationHourRef}
              type="number"
              className={`additional-info-tab__input additional-info-tab__input--number ${errors.durationHour ? "additional-info-tab__input--error" : ""}`}
              placeholder="00"
              value={durationHour}
              onChange={(e) => handleChange("durationHour", e.target.value)}
              min="0"
              max="999"
            />
            {errors.durationHour && (
              <div className="additional-info-tab__error">
                {errors.durationHour?.message || (typeof errors.durationHour === 'string' ? errors.durationHour : '')}
              </div>
            )}
          </div>

          <div className="additional-info-tab__field additional-info-tab__field--half">
            <label className="additional-info-tab__label">
              Minute. <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              ref={refs?.durationMinuteRef}
              type="number"
              className={`additional-info-tab__input additional-info-tab__input--number ${errors.durationMinute ? "additional-info-tab__input--error" : ""}`}
              placeholder="00"
              value={durationMinute}
              onChange={(e) => handleChange("durationMinute", e.target.value)}
              min="0"
              max="59"
            />
            {errors.durationMinute && (
              <div className="additional-info-tab__error">
                {errors.durationMinute?.message || (typeof errors.durationMinute === 'string' ? errors.durationMinute : '')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Tags */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__field">
          <label className="additional-info-tab__label">
            Course Tags <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea
            ref={refs?.tagsRef}
            className={`additional-info-tab__textarea ${errors.tags ? "additional-info-tab__textarea--error" : ""}`}
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
            <div className="additional-info-tab__error">
              {errors.tags?.message || (typeof errors.tags === 'string' ? errors.tags : '')}
            </div>
          )}
        </div>
      </div>

      {/* Targeted Audience */}
      <div className="additional-info-tab__section">
        <div className="additional-info-tab__field">
          <label className="additional-info-tab__label">
            Targeted Audience <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea
            ref={refs?.targetedAudienceRef}
            className={`additional-info-tab__textarea ${errors.targetedAudience ? "additional-info-tab__textarea--error" : ""}`}
            placeholder="Add your course tag here."
            value={targetedAudience}
            onChange={(e) => handleChange("targetedAudience", e.target.value)}
            rows={4}
          />
          <div className="additional-info-tab__helper">
            Specify the target audience that will benefit the most from the course.
          </div>
          {errors.targetedAudience && (
            <div className="additional-info-tab__error">
              {errors.targetedAudience?.message || (typeof errors.targetedAudience === 'string' ? errors.targetedAudience : '')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AdditionalInformationTab.displayName = "AdditionalInformationTab";

export default AdditionalInformationTab;

