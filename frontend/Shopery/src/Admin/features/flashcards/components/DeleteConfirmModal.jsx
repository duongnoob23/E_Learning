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
  const [confirmName, setConfirmName] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Yêu cầu nhập đúng tên topic để xác nhận xóa
    if (confirmName.trim() !== name) {
      setErrors({ name: `Vui lòng nhập chính xác "${name}" để xác nhận xóa` });
      return;
    }

    onConfirm();
    setConfirmName("");
    setErrors({});
  };

  const handleCancel = () => {
    setConfirmName("");
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
            Xác nhận xóa vĩnh viễn
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
              Bạn đang thực hiện <strong>xóa vĩnh viễn</strong> {type === "topic" ? "chủ đề" : "từ vựng"}:
            </p>
            <p className="delete-confirm-modal__item-name">"{name}"</p>
            <p className="delete-confirm-modal__warning-text">
              Hành động này <strong>không thể hoàn tác</strong>. Tất cả dữ liệu liên quan đến {type === "topic" ? "chủ đề" : "từ vựng"} này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </p>
            {type === "topic" && (
              <p className="delete-confirm-modal__warning-text delete-confirm-modal__warning-text--danger">
                <strong>⚠️ Cảnh báo:</strong> Tất cả từ vựng trong chủ đề này cũng sẽ bị xóa vĩnh viễn.
              </p>
            )}
          </div>

          <form className="delete-confirm-modal__form" onSubmit={handleSubmit}>
            <div className="delete-confirm-modal__field">
              <label className="delete-confirm-modal__label">
                Để xác nhận xóa, vui lòng nhập lại tên: <strong>{name}</strong>
              </label>
              <input
                type="text"
                className={`delete-confirm-modal__input ${
                  errors.name ? "delete-confirm-modal__input--error" : ""
                }`}
                value={confirmName}
                onChange={(e) => {
                  setConfirmName(e.target.value);
                  if (errors.name) {
                    setErrors({});
                  }
                }}
                placeholder={`Nhập "${name}" để xác nhận`}
                autoFocus
              />
              {errors.name && (
                <div className="delete-confirm-modal__error">
                  {errors.name}
                </div>
              )}
            </div>

            <div className="delete-confirm-modal__footer">
              <button
                type="button"
                className="delete-confirm-modal__btn delete-confirm-modal__btn--cancel"
                onClick={handleCancel}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="delete-confirm-modal__btn delete-confirm-modal__btn--delete"
                disabled={confirmName.trim() !== name}
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
