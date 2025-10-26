/* eslint-disable no-unused-vars */
import { getSmoothStepPath } from "@xyflow/react";
import { motion } from "framer-motion";
import { edgeAnimations } from "../../../../utils/animations";

/**
 * CustomEdge.jsx
 *
 * A smoother, animated edge for the git graph.
 * Supports different animation types like draw, pulse, and fade.
 */
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data = {},
}) => {
  // Create the smooth edge path
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Basic circle styling
  const dotSize = 4;
  const color = style.stroke || "#667eea";
  const opacity = style.opacity || 1;

  // Animation type (passed in from parent)
  const animType = data?.animationType;
  const isOrphaned = data?.isOrphaned;
  const animationIndex = data?.animationIndex || 0;
  const isMergeEdge = data?.isMergeEdge || false;

  // Simple animation map
  const animMap = {
    draw: isMergeEdge ? edgeAnimations.mergeDraw : edgeAnimations.draw,
    pulse: edgeAnimations.energyFlow,
    fade: edgeAnimations.fadeOut,
    reverse: edgeAnimations.reverseFlow,
  };

  const anim = isOrphaned ? edgeAnimations.fadeOut : animMap[animType] || null;

  return (
    <>
      {/* Edge line */}
      <motion.path
        id={id}
        d={path}
        fill="none"
        className="react-flow__edge-path"
        style={style}
        initial={anim?.initial}
        animate={anim?.animate}
        exit={anim?.exit}
        custom={animationIndex} // Pass index for staggered animations
      />

      {/* Dot marker at target */}
      <motion.circle
        cx={targetX}
        cy={targetY}
        r={dotSize}
        fill={color}
        stroke={color}
        strokeWidth={1.2}
        opacity={opacity}
        className="edge-dot"
        initial={anim ? { scale: 0, opacity: 0 } : undefined}
        animate={anim ? { scale: 1, opacity } : undefined}
        transition={{
          delay: isMergeEdge ? 0.7 : 0.5, // Delay dot for merge edges
          type: "spring",
          stiffness: 180,
          damping: 15,
        }}
        whileHover={{ r: 6, transition: { duration: 0.2 } }}
      />
    </>
  );
};

export default CustomEdge;
