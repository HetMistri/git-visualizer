import { useState, useCallback, useRef } from "react";

/**
 * Central animation hook for all Git graph operations
 * Manages particles, node animations, sequences, and visual effects
 */
export const useGraphAnimation = () => {
  const [particles, setParticles] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const particleIdCounter = useRef(0);

  /**
   * Create particle burst effect from button to graph
   * @param {Object} origin - {x, y} coordinates of button
   * @param {string} color - Particle color
   * @param {number} count - Number of particles
   */
  const createParticleBurst = useCallback((origin, color, count = 12) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 2 + Math.random() * 2;
      const size = 4 + Math.random() * 4;

      newParticles.push({
        id: `particle-${particleIdCounter.current++}`,
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        size,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.01,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Animate particles
    const animateFrame = () => {
      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // Gravity
            life: p.life - p.decay,
          }))
          .filter((p) => p.life > 0);

        if (updated.length > 0) {
          requestAnimationFrame(animateFrame);
        }
        return updated;
      });
    };

    requestAnimationFrame(animateFrame);
  }, []);

  /**
   * Animate new node appearing with fade + slide
   * @param {string} nodeId - ID of the new node
   * @param {Object} origin - Button origin {x, y}
   * @param {Function} callback - Called when animation completes
   */
  const animateNodeAppearance = useCallback((nodeId, origin, callback) => {
    setIsAnimating(true);

    // Store origin for CSS animation
    const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
    if (nodeElement) {
      nodeElement.style.setProperty("--origin-x", `${origin.x}px`);
      nodeElement.style.setProperty("--origin-y", `${origin.y}px`);
      nodeElement.classList.add("node-appearing");

      setTimeout(() => {
        nodeElement.classList.remove("node-appearing");
        setIsAnimating(false);
        callback?.();
      }, 500);
    } else {
      setIsAnimating(false);
      callback?.();
    }
  }, []);

  /**
   * Animate sequential nodes appearing (for Quick Test)
   * @param {Array} nodeIds - Array of node IDs
   * @param {number} delay - Delay between each node (ms)
   * @param {Function} callback - Called when all complete
   */
  const animateSequentialNodes = useCallback(
    (nodeIds, delay = 200, callback) => {
      setIsAnimating(true);

      let index = 0;
      const animateNext = () => {
        if (index >= nodeIds.length) {
          setIsAnimating(false);
          callback?.();
          return;
        }

        const nodeId = nodeIds[index];
        const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);

        if (nodeElement) {
          nodeElement.classList.add("node-sequential");
          setTimeout(() => {
            nodeElement.classList.remove("node-sequential");
          }, 500);
        }

        index++;
        setTimeout(animateNext, delay);
      };

      animateNext();
    },
    []
  );

  /**
   * Animate merge pulse effect on target branch
   * @param {string} targetNodeId - Target branch node ID
   * @param {string} color - Pulse color
   */
  const animateMergePulse = useCallback((targetNodeId, color) => {
    const nodeElement = document.querySelector(`[data-id="${targetNodeId}"]`);
    if (nodeElement) {
      nodeElement.style.setProperty("--pulse-color", color);
      nodeElement.classList.add("node-merge-pulse");

      setTimeout(() => {
        nodeElement.classList.remove("node-merge-pulse");
      }, 1000);
    }
  }, []);

  /**
   * Animate flowing line between nodes
   * @param {string} edgeId - Edge ID to animate
   */
  const animateFlowingEdge = useCallback((edgeId) => {
    const edgeElement = document.querySelector(`[data-id="${edgeId}"]`);
    if (edgeElement) {
      const path = edgeElement.querySelector("path");
      if (path) {
        path.classList.add("edge-flowing");
        setTimeout(() => {
          path.classList.remove("edge-flowing");
        }, 1000);
      }
    }
  }, []);

  /**
   * Shake graph nodes (for reset warning)
   * @param {Function} callback - Called after shake
   */
  const shakeGraph = useCallback((callback) => {
    const container = document.querySelector(".react-flow");
    if (container) {
      container.classList.add("graph-shake");
      setTimeout(() => {
        container.classList.remove("graph-shake");
        callback?.();
      }, 400);
    } else {
      callback?.();
    }
  }, []);

  /**
   * Fade out all nodes (for reset)
   * @param {Function} callback - Called after fade
   */
  const fadeOutGraph = useCallback((callback) => {
    const container = document.querySelector(".react-flow");
    if (container) {
      container.classList.add("graph-fade-out");
      setTimeout(() => {
        container.classList.remove("graph-fade-out");
        callback?.();
      }, 600);
    } else {
      callback?.();
    }
  }, []);

  /**
   * Fade in graph (after reset)
   */
  const fadeInGraph = useCallback(() => {
    const container = document.querySelector(".react-flow");
    if (container) {
      container.classList.add("graph-fade-in");
      setTimeout(() => {
        container.classList.remove("graph-fade-in");
      }, 600);
    }
  }, []);

  /**
   * Animate branch switch with label slide
   * @param {string} branchName - New branch name
   */
  const animateBranchSwitch = useCallback((branchName) => {
    // This will be handled by CSS transitions on the branch indicator
    const indicator = document.querySelector(".current-branch-indicator");
    if (indicator) {
      indicator.classList.add("branch-switching");
      setTimeout(() => {
        indicator.classList.remove("branch-switching");
      }, 400);
    }
  }, []);

  /**
   * Get button position for particle origin
   * @param {Event} event - Click event from button
   */
  const getButtonOrigin = useCallback((event) => {
    if (!event || !event.currentTarget) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  return {
    particles,
    isAnimating,
    createParticleBurst,
    animateNodeAppearance,
    animateSequentialNodes,
    animateMergePulse,
    animateFlowingEdge,
    shakeGraph,
    fadeOutGraph,
    fadeInGraph,
    animateBranchSwitch,
    getButtonOrigin,
  };
};
