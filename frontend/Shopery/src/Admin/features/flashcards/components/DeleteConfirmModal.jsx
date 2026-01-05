import { useState } from "react";
import { HiExclamationTriangle, HiXMark } from "react-icons/hi2";
import "./DeleteConfirmModal.scss";

export default function DeleteConfirmModal({
  open,
  type, // "topic" or "word"
  name,
  onConfirm,
  onCancel,
}) {
  const [deleteReason, setDeleteReason] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!deleteReason.trim()) {
      setErrors({ reason: "Please provide a reason for deletion" });
      return;
    }

    if (deleteReason.trim().length < 10) {
      setErrors({ reason: "Reason must be at least 10 characters" });
      return;
    }

    onConfirm(deleteReason.trim());
  };

  const handleCancel = () => {
    setDeleteReason("");
    setErrors({});
    onCancel();
  };

  if (!open) return null;

  return (
    <div className="delete-confirm-modal-overlay" onClick={handleCancel}>
      <div
        className="delete-confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-confirm-modal__header">
          <div className="delete-confirm-modal__icon">
            <HiExclamationTriangle />
          </div>
          <h2 className="delete-confirm-modal__title">
            Confirm Permanent Deletion
          </h2>
          <button
            className="delete-confirm-modal__close"
            onClick={handleCancel}
          >
            <HiXMark />
          </button>
        </div>

        <div className="delete-confirm-modal__content">
          <div className="delete-confirm-modal__warning">
            <p>
              You are about to <strong>permanently delete</strong> this {type}:
            </p>
            <p className="delete-confirm-modal__item-name">"{name}"</p>
            <p className="delete-confirm-modal__warning-text">
              This action cannot be undone. All data associated with this {type}{" "}
              will be permanently removed from the system.
            </p>
            {type === "topic" && (
              <p className="delete-confirm-modal__warning-text">
                <strong>Warning:</strong> All words in this topic will also be
                permanently deleted.
              </p>
            )}
          </div>

          <form className="delete-confirm-modal__form" onSubmit={handleSubmit}>
            <div className="delete-confirm-modal__field">
              <label className="delete-confirm-modal__label">
                Reason for Deletion{" "}
                <span className="delete-confirm-modal__required">*</span>
              </label>
              <textarea
                className={`delete-confirm-modal__textarea ${
                  errors.reason ? "delete-confirm-modal__textarea--error" : ""
                }`}
                value={deleteReason}
                onChange={(e) => {
                  setDeleteReason(e.target.value);
                  if (errors.reason) {
                    setErrors({});
                  }
                }}
                placeholder="Please explain why you are deleting this item (minimum 10 characters)..."
                rows={4}
                required
              />
              {errors.reason && (
                <div className="delete-confirm-modal__error">
                  {errors.reason}
                </div>
              )}
              <div className="delete-confirm-modal__hint">
                Minimum 10 characters required
              </div>
            </div>

            <div className="delete-confirm-modal__footer">
              <button
                type="button"
                className="delete-confirm-modal__btn delete-confirm-modal__btn--cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="delete-confirm-modal__btn delete-confirm-modal__btn--delete"
              >
                Delete Permanently
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
