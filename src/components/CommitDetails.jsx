import { X, GitCommit, GitBranch, Calendar, Hash, Undo2 } from "lucide-react";
import "./CommitDetails.css";

const CommitDetails = ({ commit, branches, onClose, onCheckout, onRevert }) => {
  if (!commit) return null;

  const handleBranchClick = (branchName) => {
    onCheckout(branchName);
    onClose();
  };

  const handleRevert = () => {
    if (onRevert) {
      onRevert();
      onClose();
    }
  };

  return (
    <div className="details-overlay" onClick={onClose}>
      <div
        className="details-container glass-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="details-header">
          <div className="header-icon">
            <GitCommit size={24} />
          </div>
          <h2 className="details-title">Commit Details</h2>
          <button
            className="details-revert"
            onClick={handleRevert}
            aria-label="Revert commit"
            title="Revert this commit"
          >
            <Undo2 size={18} />
            <span>Revert</span>
          </button>
          <button
            className="details-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="details-body">
          {/* Commit Hash */}
          <div className="detail-section">
            <div className="detail-label">
              <Hash size={16} />
              <span>Commit Hash</span>
            </div>
            <div className="detail-value hash-value">{commit.id}</div>
          </div>

          {/* Commit Message */}
          <div className="detail-section">
            <div className="detail-label">
              <GitCommit size={16} />
              <span>Message</span>
            </div>
            <div className="detail-value message-value">{commit.message}</div>
          </div>

          {/* Timestamp */}
          <div className="detail-section">
            <div className="detail-label">
              <Calendar size={16} />
              <span>Timestamp</span>
            </div>
            <div className="detail-value">{commit.timestamp}</div>
          </div>

          {/* Parents */}
          {commit.parents.length > 0 && (
            <div className="detail-section">
              <div className="detail-label">
                <GitCommit size={16} />
                <span>Parent{commit.parents.length > 1 ? "s" : ""}</span>
              </div>
              <div className="parents-list">
                {commit.parents.map((parentId, index) => (
                  <div key={parentId} className="parent-item">
                    <span className="parent-number">{index + 1}</span>
                    <span className="parent-hash">{parentId}</span>
                  </div>
                ))}
              </div>
              {commit.parents.length > 1 && (
                <div className="merge-badge">
                  <span>🔀 Merge Commit</span>
                </div>
              )}
            </div>
          )}

          {/* Branches */}
          {branches && branches.length > 0 && (
            <div className="detail-section">
              <div className="detail-label">
                <GitBranch size={16} />
                <span>Branches</span>
              </div>
              <div className="branches-list">
                {branches.map((branch) => (
                  <button
                    key={branch}
                    className="branch-chip"
                    onClick={() => handleBranchClick(branch)}
                    title={`Checkout to ${branch}`}
                  >
                    <GitBranch size={14} />
                    <span>{branch}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommitDetails;
