import { getSmoothStepPath } from "@xyflow/react";
import { motion } from "framer-motion";
import { edgeAnimations } from "../utils/animations";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data = {},
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Circle marker properties
  const circleRadius = 4;
  const circleColor = style.stroke || "#667eea";
  const circleOpacity = style.opacity || 1;
  const isOrphaned = data?.isOrphaned;
  const animationType = data?.animationType; // 'draw', 'energyFlow', 'fadeOut', 'reverseFlow'

  // Determine animation variant
  const getEdgeAnimation = () => {
    if (animationType === "draw") return edgeAnimations.draw;
    if (animationType === "energyFlow") return edgeAnimations.energyFlow;
    if (animationType === "fadeOut") return edgeAnimations.fadeOut;
    if (animationType === "reverseFlow") return edgeAnimations.reverseFlow;
    if (isOrphaned) return edgeAnimations.fadeOut;
    return null;
  };

  const animation = getEdgeAnimation();

  return (
    <>
      {/* The edge path */}
      <motion.path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
        initial={animation?.initial}
        animate={animation?.animate}
        exit={animation?.exit}
      />

      {/* Circle marker at the end (target) */}
      <motion.circle
        cx={targetX}
        cy={targetY}
        r={circleRadius}
        fill={circleColor}
        opacity={circleOpacity}
        stroke={circleColor}
        strokeWidth={1.5}
        className="custom-edge-marker"
        initial={animation?.initial ? { scale: 0, opacity: 0 } : undefined}
        animate={
          animation?.animate ? { scale: 1, opacity: circleOpacity } : undefined
        }
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ r: 6, transition: { duration: 0.2 } }}
      />
    </>
  );
};

export default CustomEdge;
