import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./InputModal.css";

const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Enter Value",
  placeholder = "Type here...",
  buttonText = "Submit",
  type = "text",
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setInput("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please fill this field");
      return;
    }
    onSubmit(input.trim());
    setInput("");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            ref={inputRef}
            type={type}
            value={input}
            placeholder={placeholder}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            className={`modal-input ${error ? "has-error" : ""}`}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            autoComplete="off"
          />
          {error && <p className="error-text">{error}</p>}

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn secondary">
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
