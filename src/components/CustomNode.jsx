/* eslint-disable no-unused-vars */
import { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { GitBranch, GitMerge } from "lucide-react";
import { nodeVariants } from "../utils/animations";
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
    animationType, // New: determines which animation to play
    isNew, // New: indicates if this is a newly created node
  } = data;

  const [shouldAnimate, setShouldAnimate] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      // Reset animation flag after animation completes
      const timer = setTimeout(() => setShouldAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // Determine which animation variant to use
  const getAnimationVariant = () => {
    if (!shouldAnimate && !animationType) return null;

    if (isOrphaned) return nodeVariants.orphaned;
    if (animationType === "rebaseOld") return nodeVariants.rebaseOld;
    if (animationType === "rebaseNew") return nodeVariants.rebaseNew;
    if (animationType === "merge") return nodeVariants.mergeNew;
    if (animationType === "mergeParent") return nodeVariants.mergeParent;
    if (animationType === "revert") return nodeVariants.revertNew;
    if (animationType === "revertTarget") return nodeVariants.revertTarget;
    if (isNew) return nodeVariants.newCommit;

    return null;
  };

  const animationVariant = getAnimationVariant();

  return (
    <div className="custom-node-wrapper">
      {/* Connection handles for LEFT TO RIGHT flow - positioned at circle center */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="node-handle node-handle-left"
      />

      <motion.div
        className="node-content"
        initial={animationVariant?.initial}
        animate={animationVariant?.animate}
        exit={animationVariant?.exit}
      >
        {/* Main node circle */}
        <motion.div
          className={`commit-node ${isHead ? "head-node" : ""} ${
            isMerge ? "merge-node" : ""
          } ${isSelected ? "selected-node" : ""} ${
            isOrphaned ? "orphaned-node" : ""
          }`}
          style={{
            "--node-color": isOrphaned ? "#6b7280" : color,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isMerge && (
            <div className="merge-icon">
              <GitMerge size={16} />
            </div>
          )}

          {/* Pulse effect for HEAD (not shown for orphaned) */}
          {isHead && !isOrphaned && (
            <motion.div
              className="head-pulse"
              style={{ borderColor: color }}
              animate={nodeVariants.glowPulse.animate}
            />
          )}

          {/* Glow effect for new commits */}
          {isNew && !isOrphaned && (
            <motion.div
              className="glow-pulse"
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                border: `2px solid ${color}`,
                pointerEvents: "none",
              }}
              animate={nodeVariants.glowPulse.animate}
            />
          )}
        </motion.div>

        {/* Commit info below node */}
        <div className={`commit-info ${isOrphaned ? "orphaned-info" : ""}`}>
          <div className="commit-hash">{commit.id.substring(0, 7)}</div>
          {commit.message && (
            <div className="commit-message">{commit.message}</div>
          )}
          {isHead && !isOrphaned && <div className="head-indicator">HEAD</div>}
          {isOrphaned && <div className="orphaned-indicator">ORPHANED</div>}
        </div>
      </motion.div>

      {/* Branch badges */}
      {branches.length > 0 && (
        <motion.div
          className="branch-badges"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {branches.map((branch, index) => {
            // Use the specific branch's color, not the node's color
            const branchColor = branchColors?.[branch] || color;
            return (
              <motion.div
                key={branch}
                className={`branch-badge ${
                  isHead && branch === data.headBranch ? "active-branch" : ""
                }`}
                style={{
                  backgroundColor: branchColor + "20",
                  borderColor: branchColor,
                  color: branchColor,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <GitBranch size={12} />
                <span>{branch}</span>
              </motion.div>
            );
          })}
        </motion.div>
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
