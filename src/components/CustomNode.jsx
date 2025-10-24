import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { GitBranch, GitMerge } from "lucide-react";
import "./CustomNode.css";

const CustomNode = ({ data, isConnectable }) => {
  const {
    commit,
    branches,
    branchColors,
    color,
    isHead,
    isMerge,
    isSelected,
    isOrphaned,
  } = data;

  return (
    <div className="custom-node-wrapper">
      {/* Connection handles for LEFT TO RIGHT flow - positioned at circle center */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="node-handle node-handle-left"
      />

      <div className="node-content">
        {/* Main node circle */}
        <div
          className={`commit-node ${isHead ? "head-node" : ""} ${
            isMerge ? "merge-node" : ""
          } ${isSelected ? "selected-node" : ""} ${
            isOrphaned ? "orphaned-node" : ""
          }`}
          style={{
            "--node-color": isOrphaned ? "#6b7280" : color,
          }}
        >
          {isMerge && (
            <div className="merge-icon">
              <GitMerge size={16} />
            </div>
          )}

          {/* Pulse effect for HEAD (not shown for orphaned) */}
          {isHead && !isOrphaned && (
            <div className="head-pulse" style={{ borderColor: color }} />
          )}
        </div>

        {/* Commit info below node */}
        <div className={`commit-info ${isOrphaned ? "orphaned-info" : ""}`}>
          <div className="commit-hash">{commit.id.substring(0, 7)}</div>
          {commit.message && (
            <div className="commit-message">{commit.message}</div>
          )}
          {isHead && !isOrphaned && <div className="head-indicator">HEAD</div>}
          {isOrphaned && <div className="orphaned-indicator">ORPHANED</div>}
        </div>
      </div>

      {/* Branch badges */}
      {branches.length > 0 && (
        <div className="branch-badges">
          {branches.map((branch) => {
            // Use the specific branch's color, not the node's color
            const branchColor = branchColors?.[branch] || color;
            return (
              <div
                key={branch}
                className={`branch-badge ${
                  isHead && branch === data.headBranch ? "active-branch" : ""
                }`}
                style={{
                  backgroundColor: branchColor + "20",
                  borderColor: branchColor,
                  color: branchColor,
                }}
              >
                <GitBranch size={12} />
                <span>{branch}</span>
              </div>
            );
          })}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="node-handle node-handle-right"
      />
    </div>
  );
};

export default memo(CustomNode);
