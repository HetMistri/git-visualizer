import {
  GitCommit,
  GitBranch,
  GitMerge,
  GitCompare,
  Play,
  Sun,
  Moon,
  Terminal,
} from "lucide-react";
import { getCachedBranchColor } from "../utils/graphLayout";
import { useTheme } from "../context/ThemeContext";
import "./Toolbar.css";

const Toolbar = ({
  onCommit,
  onCreateBranch,
  onMerge,
  onRebase,
  onQuickTest,
  onCheckout,
  onToggleTerminal,
  currentBranch,
  branches,
  terminalOpen,
}) => {
  const { toggleTheme, isDark } = useTheme();

  const handleBranchClick = (branch) => {
    if (branch !== currentBranch) {
      onCheckout(branch);
    }
  };

  return (
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

        <button
          type="button"
          className="toolbar-icon-btn btn-quick"
          onClick={onQuickTest}
          data-tooltip="Quick Test"
          title="Run quick test scenario"
        >
          <Play size={22} />
        </button>

        <button
          type="button"
          className="toolbar-icon-btn btn-theme"
          onClick={toggleTheme}
          data-tooltip={isDark ? "Light Mode" : "Dark Mode"}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>

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
  );
};

export default Toolbar;
