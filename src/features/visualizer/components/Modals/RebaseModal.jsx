import { useState } from "react";
import { X, GitCompare } from "lucide-react";
import "./RebaseModal.css"; // we’ll reuse your modern modal styles

const RebaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  branches,
  currentBranch,
}) => {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!source || !target) {
      setError("Please select both branches.");
      return;
    }

    if (source === target) {
      setError("Branches must be different.");
      return;
    }

    // App.jsx expects keys: { sourceBranch, targetBranch }
    onSubmit({ sourceBranch: source, targetBranch: target });
    handleClose();
  };

  const handleClose = () => {
    setSource("");
    setTarget("");
    setError("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <GitCompare className="modal-icon" size={22} />
            <h3 className="modal-title">Rebase Branch</h3>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="rebase-info">
            <p>
              <strong>Rebase</strong> moves commits from one branch onto another
              — like stacking your changes on a fresh base.
            </p>
            <div className="rebase-preview">
              <code>{source || "source"}</code> →{" "}
              <code>{target || "target"}</code>
            </div>
          </div>

          {/* Source branch */}
          <div className="input-wrapper">
            <label htmlFor="source" className="input-label">
              Source branch (to move)
            </label>
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={`modal-input modal-select ${
                error && !source ? "has-error" : ""
              }`}
            >
              <option value="">Select source branch...</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b} {b === currentBranch ? "(current)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="rebase-arrow">↓</div>

          {/* Target branch */}
          <div className="input-wrapper">
            <label htmlFor="target" className="input-label">
              Target branch (new base)
            </label>
            <select
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={`modal-input modal-select ${
                error && !target ? "has-error" : ""
              }`}
            >
              <option value="">Select target branch...</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b} {b === currentBranch ? "(current)" : ""}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="error-text">{error}</p>}

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary">
              <GitCompare size={16} />
              Rebase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RebaseModal;
