/* eslint-disable no-unused-vars */
import { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { GitBranch, GitMerge } from "lucide-react";
import { nodeVariants } from "../utils/animations";
import "./CustomNode.css";

/**
 * CustomNode.jsx
 * 
 * Represents one commit node in the git graph.
 * Supports animations for new commits, rebase, revert, merge, etc.
 */
const CustomNode = ({ data, isConnectable }) => {
  const {
    commit,
    branches = [],
    branchColors = {},
    color,
    isHead,
    isMerge,
    isSelected,
    isOrphaned,
    animationType,
    isNew,
  } = data;

  const [playAnim, setPlayAnim] = useState(isNew);

  // Stop animation after it plays once (for new commits)
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setPlayAnim(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // Decide which animation to use (kept simple)
  const pickAnim = () => {
    if (isOrphaned) return nodeVariants.orphaned;
    const map = {
      rebaseOld: nodeVariants.rebaseOld,
      rebaseNew: nodeVariants.rebaseNew,
      merge: nodeVariants.mergeNew,
      mergeParent: nodeVariants.mergeParent,
      revert: nodeVariants.revertNew,
      revertTarget: nodeVariants.revertTarget,
    };
    if (animationType && map[animationType]) return map[animationType];
    if (isNew && playAnim) return nodeVariants.newCommit;
    return null;
  };

  const anim = pickAnim();

  return (
    <div className="custom-node-wrapper">
      {/* Small invisible handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="node-handle node-handle-left"
      />

      <motion.div
        className="node-content"
        initial={anim?.initial}
        animate={anim?.animate}
        exit={anim?.exit}
      >
        {/* Commit Circle */}
        <motion.div
          className={`commit-node
            ${isHead ? "head-node" : ""}
            ${isMerge ? "merge-node" : ""}
            ${isSelected ? "selected-node" : ""}
            ${isOrphaned ? "orphaned-node" : ""}
          `}
          style={{ "--node-color": isOrphaned ? "#6b7280" : color }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isMerge && (
            <div className="merge-icon">
              <GitMerge size={16} />
            </div>
          )}

          {/* Glowing pulse for HEAD */}
          {isHead && !isOrphaned && (
            <motion.div
              className="head-pulse"
              style={{ borderColor: color }}
              animate={nodeVariants.glowPulse.animate}
            />
          )}

          {/* Soft glow for new commits */}
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

        {/* Commit info */}
        <div className={`commit-info ${isOrphaned ? "orphaned-info" : ""}`}>
          <div className="commit-hash">{commit.id.slice(0, 7)}</div>
          {commit.message && (
            <div className="commit-message">{commit.message}</div>
          )}
          {isHead && !isOrphaned && <div className="head-indicator">HEAD</div>}
          {isOrphaned && <div className="orphaned-indicator">ORPHANED</div>}
        </div>
      </motion.div>

      {/* Branch tags below each commit */}
      {branches.length > 0 && (
        <motion.div
          className="branch-badges"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {branches.map((b, i) => {
            const bColor = branchColors[b] || color;
            const isActive = isHead && b === data.headBranch;

            return (
              <motion.div
                key={b}
                className={`branch-badge ${isActive ? "active-branch" : ""}`}
                style={{
                  backgroundColor: bColor + "20",
                  borderColor: bColor,
                  color: bColor,
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <GitBranch size={12} />
                <span>{b}</span>
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
