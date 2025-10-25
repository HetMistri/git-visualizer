/**
 * Animation System for Git Operations
 *
 * High-Level Principle:
 * - Growth → expansion or pop-in
 * - Rewrite → motion across the timeline
 * - Deletion → fade or shrink
 * - Recovery → reverse flow
 *
 * Animation Language:
 * - Spring physics for "alive" actions (commit, merge)
 * - Ease-in-out cubic for "corrections" (rebase, reset)
 * - Ease-in cubic + fade for "removals" (orphaned, revert)
 */

// ============================================================================
// Animation Variants for Framer Motion
// ============================================================================

export const nodeVariants = {
  // 🟢 Commit / New Node - Growth & Progress
  newCommit: {
    initial: {
      scale: 0.6,
      opacity: 0,
      x: -10,
    },
    animate: {
      scale: 1,
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  },

  // 🔄 Rebase - Rewrite & Realignment
  rebaseOld: {
    initial: { opacity: 1, scale: 1 },
    animate: {
      opacity: 0.3,
      scale: 0.9,
      filter: "grayscale(0.8)",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  },
  rebaseNew: {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: -20,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 18,
        delay: 0.2,
      },
    },
  },

  // 🕓 Reset - Rewind & Correction
  resetOrphaned: {
    initial: { opacity: 1, scale: 1 },
    animate: {
      opacity: 0.5,
      scale: 0.85,
      y: 5,
      filter: "grayscale(0.9)",
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1], // ease-in-out cubic
      },
    },
  },
  resetBranchMove: {
    animate: {
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
      },
    },
  },

  // 🔙 Revert - Undo & Counteraction
  revertTarget: {
    animate: {
      boxShadow: [
        "0 0 0px rgba(239, 68, 68, 0)",
        "0 0 20px rgba(239, 68, 68, 0.8)",
        "0 0 0px rgba(239, 68, 68, 0)",
      ],
      transition: {
        duration: 1,
        times: [0, 0.5, 1],
      },
    },
  },
  revertNew: {
    initial: {
      scale: 0.7,
      opacity: 0,
      x: 10,
    },
    animate: {
      scale: 1,
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 16,
        delay: 0.3,
      },
    },
  },

  // 🧬 Merge - Unification & Convergence
  mergeParent: {
    animate: {
      boxShadow: [
        "0 0 0px rgba(102, 126, 234, 0)",
        "0 0 15px rgba(102, 126, 234, 0.6)",
        "0 0 0px rgba(102, 126, 234, 0)",
      ],
      transition: {
        duration: 0.8,
        times: [0, 0.5, 1],
      },
    },
  },
  mergeNew: {
    initial: {
      scale: 1.4,
      opacity: 0.8,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  },

  // ⚪ Orphaned - Decay & Fading
  orphaned: {
    initial: { opacity: 1, scale: 1, y: 0 },
    animate: {
      opacity: 0.5,
      scale: 0.9,
      y: 3,
      filter: "grayscale(0.9)",
      transition: {
        duration: 0.6,
        ease: "easeIn",
      },
    },
  },

  // 🗑️ Removal - Cleanup
  removed: {
    initial: { opacity: 0.5, scale: 0.9 },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  },

  // ✨ Glow Pulse - Emphasis
  glowPulse: {
    animate: {
      boxShadow: [
        "0 0 0px var(--node-color)",
        "0 0 20px var(--node-color)",
        "0 0 0px var(--node-color)",
      ],
      transition: {
        duration: 1,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
    },
  },

  // 🎯 Branch Checkout - Highlight
  checkout: {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.4,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
    },
  },
};

// ============================================================================
// Edge Animation Functions
// ============================================================================

export const edgeAnimations = {
  // Draw edge from parent to child
  draw: {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.3 },
      },
    },
  },

  // Edge energy flow (for merge/rebase)
  energyFlow: {
    animate: {
      strokeDashoffset: [0, -20],
      transition: {
        duration: 1.5,
        repeat: 2,
        ease: "linear",
      },
    },
  },

  // Edge fade out (for orphaned)
  fadeOut: {
    animate: {
      opacity: 0.3,
      strokeDasharray: "8,8",
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  },

  // Edge reverse flow (for revert)
  reverseFlow: {
    animate: {
      strokeDashoffset: [0, 20],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get animation config for a specific Git operation
 */
export const getOperationAnimation = (operation, role = "main") => {
  const animations = {
    commit: {
      node: nodeVariants.newCommit,
      edge: edgeAnimations.draw,
      duration: 600,
    },
    rebase: {
      node: role === "old" ? nodeVariants.rebaseOld : nodeVariants.rebaseNew,
      edge: edgeAnimations.energyFlow,
      duration: 1200,
    },
    reset: {
      node:
        role === "orphaned"
          ? nodeVariants.resetOrphaned
          : nodeVariants.resetBranchMove,
      edge: edgeAnimations.fadeOut,
      duration: 800,
    },
    revert: {
      node:
        role === "target" ? nodeVariants.revertTarget : nodeVariants.revertNew,
      edge: edgeAnimations.reverseFlow,
      duration: 1000,
    },
    merge: {
      node:
        role === "parent" ? nodeVariants.mergeParent : nodeVariants.mergeNew,
      edge: edgeAnimations.energyFlow,
      duration: 1000,
    },
    orphaned: {
      node: nodeVariants.orphaned,
      edge: edgeAnimations.fadeOut,
      duration: 600,
    },
    remove: {
      node: nodeVariants.removed,
      edge: edgeAnimations.fadeOut,
      duration: 400,
    },
    checkout: {
      node: nodeVariants.checkout,
      duration: 400,
    },
  };

  return animations[operation] || animations.commit;
};

/**
 * Create stagger effect for multiple nodes
 */
export const createStaggerVariants = (baseVariant, staggerDelay = 0.1) => {
  return {
    initial: baseVariant.initial,
    animate: (custom) => ({
      ...baseVariant.animate,
      transition: {
        ...baseVariant.animate.transition,
        delay: custom * staggerDelay,
      },
    }),
  };
};

/**
 * Easing functions
 */
export const easings = {
  spring: {
    type: "spring",
    stiffness: 200,
    damping: 15,
  },
  springGentle: {
    type: "spring",
    stiffness: 150,
    damping: 20,
  },
  springBouncy: {
    type: "spring",
    stiffness: 250,
    damping: 12,
  },
  easeInOutCubic: [0.4, 0, 0.2, 1],
  easeInCubic: [0.4, 0, 1, 1],
  easeOutCubic: [0, 0, 0.2, 1],
};

export default {
  nodeVariants,
  edgeAnimations,
  getOperationAnimation,
  createStaggerVariants,
  easings,
};
