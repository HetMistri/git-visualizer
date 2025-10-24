import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./InputModal.css";

const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  buttonText,
  type = "text",
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue("");
      setError("");
      // Focus input when modal opens
      setTimeout(() => {
        document.getElementById("modal-input")?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!value.trim()) {
      setError("This field cannot be empty");
      return;
    }

    onSubmit(value.trim(), e);
    setValue("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-wrapper">
            <input
              id="modal-input"
              type={type}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`modal-input ${error ? "input-error" : ""}`}
              autoComplete="off"
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
