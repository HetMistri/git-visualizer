import { useViewport } from "@xyflow/react";
import HeadPointer from "./HeadPointer";

/**
 * HeadPointerOverlay Component
 *
 * Wraps HeadPointer to work with ReactFlow's viewport transformation.
 * This makes the pointer move with pan/zoom operations.
 */
const HeadPointerOverlay = ({ position, branchName, color }) => {
  const { x, y, zoom } = useViewport();

  if (!position) return null;

  // Base vertical gap between pointer and node (in screen px at zoom=1)
  const baseGap = 28;

  // Transform flow (graph) coords to screen coords
  const screenX = position.x * zoom + x;
  const screenY = position.y * zoom + y - baseGap; // keep a constant screen gap

  return (
    <div
      className="head-pointer-overlay"
      style={{
        position: "absolute",
        left: screenX,
        top: screenY,
        transform: "translate(-50%, 0)", // center horizontally, no vertical shift
        transformOrigin: "center",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <HeadPointer
        position={{ x: 0, y: 0 }}
        branchName={branchName}
        color={color}
      />
    </div>
  );
};

export default HeadPointerOverlay;
