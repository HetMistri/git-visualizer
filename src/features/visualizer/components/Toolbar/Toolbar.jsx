import { useState } from "react";
import {
  GitCommit,
  GitBranch,
  GitMerge,
  GitCompare,
  Play,
  Terminal,
  Menu,
  X,
} from "lucide-react";
import { getCachedBranchColor } from "../../utils/graphLayout";
import "./Toolbar.css";

const Toolbar = ({
  onCommit,
  onCreateBranch,
  onMerge,
  onRebase,
  // onQuickTest,
  onCheckout,
  onToggleTerminal,
  currentBranch,
  branches,
  terminalOpen,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBranchClick = (branch) => {
    if (branch !== currentBranch) {
      onCheckout(branch);
    }
  };

  const handleMenuItemClick = (action) => {
    action();
    setMenuOpen(false);
  };

  return (
    <>
      {/* Burger Menu Button (Mobile Only) */}
      <button
        className={`burger-menu-btn ${terminalOpen ? "terminal-open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Git Actions</h3>
              <button
                onClick={() => setMenuOpen(false)}
                className="mobile-menu-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-menu-content">
              <button
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick(onCommit)}
              >
                <GitCommit size={20} />
                <span>Commit</span>
              </button>

              <button
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick(onCreateBranch)}
              >
                <GitBranch size={20} />
                <span>New Branch</span>
              </button>

              <button
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick(onMerge)}
              >
                <GitMerge size={20} />
                <span>Merge</span>
              </button>

              <button
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick(onRebase)}
              >
                <GitCompare size={20} />
                <span>Rebase</span>
              </button>

              {/* <button
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick(onQuickTest)}
              >
                <Play size={20} />
                <span>Quick Test</span>
              </button> */}

              <button
                className="mobile-menu-item"
                onClick={() => handleMenuItemClick(onToggleTerminal)}
              >
                <Terminal size={20} />
                <span>Terminal</span>
              </button>

              <div className="mobile-menu-divider" />

              <div className="mobile-menu-branches">
                <h4>Branches</h4>
                <div className="mobile-branch-list">
                  {branches.map((branch) => {
                    const branchColor = getCachedBranchColor(branch);
                    const isActive = branch === currentBranch;

                    return (
                      <button
                        key={branch}
                        className={`mobile-branch-item ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() =>
                          handleMenuItemClick(() => handleBranchClick(branch))
                        }
                      >
                        <span
                          className="mobile-branch-dot"
                          style={{ backgroundColor: branchColor }}
                        />
                        <span className="mobile-branch-name">{branch}</span>
                        {isActive && (
                          <span className="mobile-branch-badge">Current</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Toolbar */}
      <div
        className={`toolbar-pill glass ${terminalOpen ? "terminal-open" : ""}`}
      >
        {/* Git Action Buttons */}
        <div className="toolbar-actions">
          <button
            type="button"
            className="toolbar-icon-btn btn-commit"
            onClick={onCommit}
            data-tooltip="Commit"
            title="Create new commit"
          >
            <GitCommit size={22} />
          </button>

          <button
            type="button"
            className="toolbar-icon-btn btn-branch"
            onClick={onCreateBranch}
            data-tooltip="New Branch"
            title="Create new branch"
          >
            <GitBranch size={22} />
          </button>

          <button
            type="button"
            className="toolbar-icon-btn btn-merge"
            onClick={onMerge}
            data-tooltip="Merge"
            title="Merge branches"
          >
            <GitMerge size={22} />
          </button>

          <button
            type="button"
            className="toolbar-icon-btn btn-rebase"
            onClick={onRebase}
            data-tooltip="Rebase"
            title="Rebase branch"
          >
            <GitCompare size={22} />
          </button>

          {/* <button
            type="button"
            className="toolbar-icon-btn btn-quick"
            onClick={onQuickTest}
            data-tooltip="Quick Test"
            title="Run quick test scenario"
          >
            <Play size={22} />
          </button> */}

          <button
            type="button"
            className="toolbar-icon-btn btn-terminal"
            onClick={onToggleTerminal}
            data-tooltip="Terminal"
            title="Toggle Git terminal"
          >
            <Terminal size={22} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Branch Dots */}
        <div className="branch-dots">
          {branches.map((branch) => {
            const branchColor = getCachedBranchColor(branch);
            const isActive = branch === currentBranch;

            return (
              <button
                type="button"
                key={branch}
                className={`branch-dot ${isActive ? "active" : ""}`}
                onClick={() => handleBranchClick(branch)}
                data-tooltip={branch}
                title={branch}
                style={{
                  backgroundColor: branchColor,
                  boxShadow: isActive
                    ? `0 0 20px ${branchColor}, 0 0 10px ${branchColor} inset`
                    : `0 0 10px ${branchColor}80`,
                }}
              >
                {isActive && (
                  <span
                    className="dot-pulse"
                    style={{ borderColor: branchColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Toolbar;
