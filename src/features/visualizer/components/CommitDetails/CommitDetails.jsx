import {
  X,
  GitCommit,
  GitBranch,
  Calendar,
  Hash,
  Undo2,
  RotateCcw,
} from "lucide-react";
import "./CommitDetails.css";

const CommitDetails = ({
  commit,
  branches,
  onClose,
  onCheckout,
  onRevert,
  onReset,
  currentBranch,
}) => {
  if (!commit) return null;

  const isOrphan = !!commit.isOrphaned;

  const clickBranch = (name) => {
    if (isOrphan) return; // read-only
    onCheckout(name);
    onClose();
  };

  const clickRevert = () => {
    if (isOrphan) return;
    onRevert?.();
    onClose();
  };

  const clickReset = () => {
    if (isOrphan) return;
    onReset?.();
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="card-header">
          <div className="icon-box">
            <GitCommit size={22} />
          </div>
          <h2 className="title">Commit Details</h2>

          {isOrphan && (
            <div
              className="badge read-only"
              title="Orphaned commit – actions disabled"
            >
              Read-only
            </div>
          )}

          <div className="header-buttons">
            <button
              className="btn reset"
              onClick={clickReset}
              title={
                isOrphan
                  ? "Reset disabled for orphaned commit"
                  : `Reset ${currentBranch} to this commit`
              }
              disabled={isOrphan}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            <button
              className="btn revert"
              onClick={clickRevert}
              title={
                isOrphan
                  ? "Revert disabled for orphaned commit"
                  : "Revert this commit"
              }
              disabled={isOrphan}
            >
              <Undo2 size={16} />
              <span>Revert</span>
            </button>
            <button className="btn close" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          <Info
            label="Commit Hash"
            icon={<Hash size={14} />}
            value={commit.id}
            code
          />
          <Info
            label="Message"
            icon={<GitCommit size={14} />}
            value={commit.message}
          />
          <Info
            label="Timestamp"
            icon={<Calendar size={14} />}
            value={commit.timestamp}
          />

          {commit.parents.length > 0 && (
            <div className="section">
              <Label
                icon={<GitCommit size={14} />}
                text={`Parent${commit.parents.length > 1 ? "s" : ""}`}
              />
              <div className="parent-list">
                {commit.parents.map((pid, i) => (
                  <div key={pid} className="parent">
                    <span className="num">{i + 1}</span>
                    <span className="hash">{pid}</span>
                  </div>
                ))}
              </div>
              {commit.parents.length > 1 && (
                <div className="merge-tag">🔀 Merge Commit</div>
              )}
            </div>
          )}

          {branches?.length > 0 && (
            <div className="section">
              <Label icon={<GitBranch size={14} />} text="Branches" />
              <div className="branch-list">
                {branches.map((b) => (
                  <button
                    key={b}
                    className="branch-chip"
                    onClick={() => clickBranch(b)}
                    disabled={isOrphan}
                    title={
                      isOrphan
                        ? "Checkout disabled on orphaned commit"
                        : `Switch to ${b}`
                    }
                  >
                    <GitBranch size={12} />
                    <span>{b}</span>
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

// Small helper subcomponents
const Info = ({ label, icon, value, code }) => (
  <div className="section">
    <Label icon={icon} text={label} />
    <div className={`value ${code ? "code" : ""}`}>{value}</div>
  </div>
);

const Label = ({ icon, text }) => (
  <div className="label">
    {icon}
    <span>{text}</span>
  </div>
);

export default CommitDetails;
