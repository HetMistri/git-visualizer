# Animation System Implementation Guide

## Overview

This animation system brings Git operations to life using **Framer Motion**, providing visual feedback that communicates the intention and energy of each Git action.

## Installation

First, install Framer Motion:

```bash
npm install framer-motion
```

## Animation Philosophy

Each Git action has a distinct visual language:

- **Growth** (commit, branch) → expansion or pop-in
- **Rewrite** (rebase, reset) → motion across the timeline
- **Deletion** (orphaned) → fade or shrink
- **Recovery** (revert) → reverse flow
- **Unification** (merge) → convergence

## Files Created

### 1. `/src/utils/animations.js`

Central animation configuration with:

- `nodeVariants` - Animation presets for different node states
- `edgeAnimations` - Animation presets for edges
- `getOperationAnimation()` - Helper to get animations by operation type
- `easings` - Reusable easing functions

### 2. Updated Components

#### `CustomNode.jsx`

- Now uses Framer Motion `<motion.div>`
- Accepts `animationType` and `isNew` in data prop
- Auto-detects and applies appropriate animations
- Includes hover interactions

#### `CustomEdge.jsx`

- Uses Framer Motion `<motion.path>` and `<motion.circle>`
- Supports animation types: 'draw', 'energyFlow', 'fadeOut', 'reverseFlow'
- Circle marker grows on hover

## Usage Examples

### 1. New Commit Animation

When creating a commit, mark the new node:

```javascript
// In graphLayout.js or component
const newNode = {
  id: commitId,
  type: "custom",
  data: {
    commit,
    isNew: true, // Triggers pop-in animation
    animationType: null,
    // ... other props
  },
};
```

**Result**: Node pops in with spring physics + glow pulse

### 2. Rebase Animation

```javascript
// Mark old commits being replaced
oldNodes.forEach((node) => {
  node.data.animationType = "rebaseOld"; // Fades to gray
});

// Mark new rebased commits
newNodes.forEach((node) => {
  node.data.animationType = "rebaseNew"; // Slides in from parent
  node.data.isNew = true;
});

// Mark edges with energy flow
edges.forEach((edge) => {
  edge.data.animationType = "energyFlow"; // Animated stroke dash
});
```

**Result**: Old commits fade → new commits slide in → edges show energy flow

### 3. Reset Animation

```javascript
// Mark orphaned commits
orphanedNodes.forEach((node) => {
  node.data.isOrphaned = true; // Auto-triggers orphaned animation
});

// Optionally animate branch label movement
branchNode.data.animationType = "resetBranchMove";
```

**Result**: Orphaned commits fade/shrink → branch pointer animates back

### 4. Merge Animation

```javascript
// Highlight parent branches
parentNodes.forEach((node) => {
  node.data.animationType = "mergeParent"; // Glow pulse
});

// Merge commit pops in larger
mergeNode.data.animationType = "merge";
mergeNode.data.isNew = true;

// Edges converge with energy flow
edges.forEach((edge) => {
  if (edge.target === mergeCommitId) {
    edge.data.animationType = "energyFlow";
  }
});
```

**Result**: Parents glow → edges converge → merge node pops in large then settles

### 5. Revert Animation

```javascript
// Flash the reverted commit red
targetNode.data.animationType = "revertTarget";

// New revert commit
revertNode.data.animationType = "revert";
revertNode.data.isNew = true;

// Edge animates backward then forward
edge.data.animationType = "reverseFlow";
```

**Result**: Target flashes red → edge flows backward → new commit appears

## Integration with useGitGraph

To automatically track new commits, update the hook:

```javascript
import { useState, useCallback } from "react";

export const useGitGraph = () => {
  const [gitGraph] = useState(() => new GitGraph());
  const [lastOperation, setLastOperation] = useState(null);
  const [newCommitId, setNewCommitId] = useState(null);

  const commit = useCallback(
    (message) => {
      try {
        const oldTip = gitGraph.branches.get(gitGraph.HEAD);
        gitGraph.commit(message);
        const newTip = gitGraph.branches.get(gitGraph.HEAD);

        setLastOperation("commit");
        setNewCommitId(newTip);

        // Clear after animation duration
        setTimeout(() => setNewCommitId(null), 1000);

        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [gitGraph]
  );

  // ... other operations

  return {
    // ... existing returns
    lastOperation,
    newCommitId,
  };
};
```

Then in `graphLayout.js`:

```javascript
export const convertToReactFlow = (gitGraph, options = {}) => {
  const { newCommitId, lastOperation } = options;

  // ... existing code

  nodes.push({
    id,
    type: "custom",
    data: {
      commit,
      branches: commitBranches,
      color,
      isNew: id === newCommitId, // Mark new commits
      animationType: getAnimationType(id, lastOperation),
      // ... other props
    },
  });
};
```

## Animation Timing Reference

| Operation    | Duration | Easing            | Description       |
| ------------ | -------- | ----------------- | ----------------- |
| **Commit**   | 600ms    | Spring (200/15)   | Pop-in with glow  |
| **Rebase**   | 1200ms   | Spring (180/18)   | Slide + fade      |
| **Reset**    | 800ms    | Cubic ease-in-out | Fade + shrink     |
| **Revert**   | 1000ms   | Spring (180/16)   | Flash + pop       |
| **Merge**    | 1000ms   | Spring (200/15)   | Converge + absorb |
| **Orphaned** | 600ms    | Ease-in           | Fade + drift      |
| **Removal**  | 400ms    | Ease-in           | Dissolve          |

## CSS Enhancements

Add these to support animations:

```css
/* Smooth transitions for Framer Motion */
.custom-node-wrapper {
  will-change: transform, opacity;
}

.commit-node {
  will-change: transform, box-shadow;
}

/* Glow pulse */
.glow-pulse {
  animation: glow-pulse-keyframes 1s ease-in-out;
}

@keyframes glow-pulse-keyframes {
  0%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Edge animations */
.react-flow__edge-path {
  will-change: stroke-dashoffset, opacity;
}

.custom-edge-marker {
  will-change: r, opacity;
  transition: r 0.2s ease;
}
```

## Advanced: Staggered Animations

For animating multiple commits (like in rebase):

```javascript
import { createStaggerVariants } from "../utils/animations";

// Stagger commits with 100ms delay between each
const staggered = createStaggerVariants(nodeVariants.rebaseNew, 0.1);

// Apply with index
newCommits.forEach((commit, index) => {
  commit.data.animationCustom = index; // Used by Framer Motion
});
```

## Performance Considerations

1. **Use `memo` on CustomNode**: Already implemented
2. **Limit simultaneous animations**: Max 10-15 nodes at once
3. **Disable during drag**: Already handled by React Flow
4. **Use `will-change` CSS**: Prevents layout thrashing

## Testing Animations

```javascript
// Quick test in console:
const testNode = {
  data: {
    isNew: true,
    animationType: "merge",
  },
};

// Renders with merge animation (pop in large → settle)
```

## Troubleshooting

**Animation not playing?**

- Check `isNew` or `animationType` is set correctly
- Verify Framer Motion is installed
- Check browser console for errors

**Animation too fast/slow?**

- Adjust durations in `/src/utils/animations.js`
- Modify spring stiffness/damping values

**Animation causing lag?**

- Reduce number of simultaneous animations
- Use simpler easing (cubic instead of spring)
- Add `performance.now()` checks to skip animations on slow devices

## Next Steps

1. ✅ Install Framer Motion: `npm install framer-motion`
2. ✅ Files are created and updated
3. ⏳ Update `useGitGraph` to track operation types
4. ⏳ Update `graphLayout.js` to pass animation flags
5. ⏳ Test each operation visually
6. ⏳ Fine-tune timing and easing

## Result

Your Git visualizer now has:

- ✨ Smooth, intentional animations for every action
- 🎯 Visual language that teaches Git semantics
- 💫 Professional polish with spring physics
- 🎨 Consistent animation signature across all operations

The animations don't just look good—they **communicate** what's happening in Git! 🚀
