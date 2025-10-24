import { useCallback, useRef } from "react";
import { convertToReactFlow } from "../utils/graphLayout";

/**
 * Custom hook for animating graph transitions during rebase
 * This creates the "rewriting history" visual effect
 */
export const useRebaseAnimation = () => {
  const animationFrameRef = useRef(null);
  const isAnimatingRef = useRef(false);

  /**
   * Linear interpolation between two values
   */
  const lerp = (start, end, t) => {
    return start + (end - start) * t;
  };

  /**
   * Easing function for smooth animation
   * Using easeInOutCubic for a natural feel
   */
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  /**
   * Animate nodes from old positions to new positions
   * @param {Array} oldNodes - Nodes before rebase
   * @param {Array} newNodes - Nodes after rebase
   * @param {Function} setNodes - React Flow setNodes function
   * @param {Function} onComplete - Callback when animation completes
   * @param {number} duration - Animation duration in milliseconds (default: 1200ms)
   */
  const animateRebase = useCallback(
    (oldNodes, newNodes, setNodes, onComplete, duration = 1200) => {
      if (isAnimatingRef.current) {
        console.warn("Animation already in progress");
        return;
      }

      isAnimatingRef.current = true;

      // Create a map of node positions for quick lookup
      const oldPositions = new Map();
      oldNodes.forEach((node) => {
        oldPositions.set(node.id, { x: node.position.x, y: node.position.y });
      });

      const newPositions = new Map();
      const newNodeIds = new Set();
      newNodes.forEach((node) => {
        newPositions.set(node.id, { x: node.position.x, y: node.position.y });
        newNodeIds.add(node.id);
      });

      // Identify nodes that are disappearing (orphaned by rebase)
      const disappearingNodes = oldNodes.filter(
        (node) => !newNodeIds.has(node.id)
      );

      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        // Animate disappearing nodes (fade out)
        const fadingOutNodes = disappearingNodes.map((node) => ({
          ...node,
          style: {
            ...node.style,
            opacity: 1 - easedProgress, // Fade out
            transition: "none",
          },
        }));

        // Interpolate positions for all nodes
        const animatedNodes = newNodes.map((node) => {
          const oldPos = oldPositions.get(node.id);
          const newPos = newPositions.get(node.id);

          // If node is new (doesn't exist in old positions), fade it in from new position
          if (!oldPos) {
            return {
              ...node,
              style: {
                ...node.style,
                opacity: easedProgress, // Fade in
              },
            };
          }

          // If node exists, animate its position
          return {
            ...node,
            position: {
              x: lerp(oldPos.x, newPos.x, easedProgress),
              y: lerp(oldPos.y, newPos.y, easedProgress),
            },
            style: {
              ...node.style,
              transition: "none", // Disable CSS transitions during animation
            },
          };
        });

        // Combine animated nodes with fading out nodes during animation
        const allNodes =
          progress < 1 ? [...animatedNodes, ...fadingOutNodes] : animatedNodes;

        setNodes(allNodes);

        // Continue animation or complete
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          isAnimatingRef.current = false;
          // Set final positions without animation styles
          setNodes(
            newNodes.map((node) => ({
              ...node,
              style: {
                ...node.style,
                opacity: 1,
                transition: undefined,
              },
            }))
          );
          if (onComplete) {
            onComplete();
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    []
  );

  /**
   * Cancel ongoing animation
   */
  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      isAnimatingRef.current = false;
    }
  }, []);

  /**
   * Perform animated rebase
   * @param {Object} gitGraph - The GitGraph instance
   * @param {string} sourceBranch - Source branch name
   * @param {string} targetBranch - Target branch name
   * @param {Function} setNodes - React Flow setNodes function
   * @param {Function} setEdges - React Flow setEdges function
   * @param {Function} onComplete - Callback when rebase completes
   */
  const performAnimatedRebase = useCallback(
    (gitGraph, sourceBranch, targetBranch, setNodes, setEdges, onComplete) => {
      try {
        // Step 1: Capture old state
        const oldGraphData = convertToReactFlow(gitGraph);
        const oldNodes = oldGraphData.nodes;
        const oldEdges = oldGraphData.edges;

        // Step 2: Perform the rebase operation
        gitGraph.rebase(sourceBranch, targetBranch);

        // Step 3: Get new state
        const newGraphData = convertToReactFlow(gitGraph);
        const newNodes = newGraphData.nodes;
        const newEdges = newGraphData.edges;

        // Step 4: Update edges immediately (they don't need animation)
        setEdges(newEdges);

        // Step 5: Animate nodes from old to new positions
        animateRebase(oldNodes, newNodes, setNodes, () => {
          if (onComplete) {
            onComplete();
          }
        });

        return { success: true };
      } catch (error) {
        console.error("Rebase animation failed:", error);
        return { success: false, error: error.message };
      }
    },
    [animateRebase]
  );

  return {
    animateRebase,
    performAnimatedRebase,
    cancelAnimation,
    isAnimating: isAnimatingRef.current,
  };
};
