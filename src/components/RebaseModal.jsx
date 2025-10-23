import { useState } from "react";
import { X, GitCompare } from "lucide-react";
import "./InputModal.css";

const RebaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  branches,
  currentBranch,
}) => {
  const [sourceBranch, setSourceBranch] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!sourceBranch || !targetBranch) {
      setError("Please select both source and target branches");
      return;
    }

    if (sourceBranch === targetBranch) {
      setError("Source and target branches must be different");
      return;
    }

    onSubmit({ sourceBranch, targetBranch });
    setSourceBranch("");
    setTargetBranch("");
  };

  const handleClose = () => {
    setSourceBranch("");
    setTargetBranch("");
    setError("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <GitCompare size={24} className="modal-icon" />
            <h2 className="modal-title">Rebase Branch</h2>
          </div>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="rebase-explanation">
            <p>
              Rebase will replay commits from the source branch onto the target
              branch.
            </p>
            <p className="rebase-formula">
              <code>{sourceBranch || "source"}</code> →{" "}
              <code>{targetBranch || "target"}</code>
            </p>
          </div>

          <div className="input-wrapper">
            <label htmlFor="sourceBranch" className="input-label">
              Source Branch (to rebase)
            </label>
            <select
              id="sourceBranch"
              value={sourceBranch}
              onChange={(e) => setSourceBranch(e.target.value)}
              className={`modal-input modal-select ${
                error && !sourceBranch ? "input-error" : ""
              }`}
            >
              <option value="">Select source branch...</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch} {branch === currentBranch ? "(current)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="rebase-arrow">↓</div>

          <div className="input-wrapper">
            <label htmlFor="targetBranch" className="input-label">
              Target Branch (new base)
            </label>
            <select
              id="targetBranch"
              value={targetBranch}
              onChange={(e) => setTargetBranch(e.target.value)}
              className={`modal-input modal-select ${
                error && !targetBranch ? "input-error" : ""
              }`}
            >
              <option value="">Select target branch...</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch} {branch === currentBranch ? "(current)" : ""}
                </option>
              ))}
            </select>
          </div>

          {error && <span className="error-message">{error}</span>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <GitCompare size={18} />
              Rebase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RebaseModal;
