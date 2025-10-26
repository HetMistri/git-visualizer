/**
 * Modal Component
 *
 * A reusable base modal component with backdrop and animations.
 * Can be composed with other components for specific modal types.
 *
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="My Modal">
 *   <p>Modal content goes here</p>
 * </Modal>
 */

import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  size = "medium",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
  ...rest
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  const modalClassNames = ["modal", `modal-${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={modalClassNames} {...rest}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

// Sub-components for composition
Modal.Header = ({ children, className = "", ...rest }) => (
  <div className={`modal-section-header ${className}`} {...rest}>
    {children}
  </div>
);

Modal.Body = ({ children, className = "", ...rest }) => (
  <div className={`modal-body ${className}`} {...rest}>
    {children}
  </div>
);

Modal.Footer = ({ children, className = "", ...rest }) => (
  <div className={`modal-footer ${className}`} {...rest}>
    {children}
  </div>
);

export default Modal;
