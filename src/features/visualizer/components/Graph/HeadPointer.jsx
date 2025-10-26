import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import "./HeadPointer.css";

/**
 * HeadPointer Component
 *
 * A visual pointer that shows where HEAD is currently pointing.
 * Animates smoothly when moving between commits.
 * Designed to work within HeadPointerOverlay for proper ReactFlow integration.
 */
const HeadPointer = ({ position, branchName, color = "#667eea" }) => {
  if (!position) return null;

  return (
    <motion.div
      className="head-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
      style={{
        "--pointer-color": color,
      }}
    >
      <div className="pointer-content">
        <GitBranch size={16} className="pointer-icon" />
        <span className="pointer-label">HEAD → {branchName}</span>
      </div>
      <motion.div
        className="pointer-arrow"
        animate={{
          y: [0, 5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ↓
      </motion.div>
    </motion.div>
  );
};

export default HeadPointer;
