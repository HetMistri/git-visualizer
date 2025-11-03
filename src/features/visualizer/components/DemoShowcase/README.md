# Demo Showcase Components

These components demonstrate the Git Visualizer's core functionality by showcasing different Git workflows. Each demo is **fully independent** with its own GitGraph instance, using the visualizer's existing logic, layout, and node rendering.

## Components

### 1. CommitDemo

**Shows:** Sequential commits on a single branch (linear history)

**Demonstrates:**

- Basic commit flow
- Linear commit history
- Commit message tracking

**Timeline:**

```
main: Initial commit → Add README → Setup project → Core features → Tests → Docs
```

---

### 2. BranchingDemo

**Shows:** Branch creation and parallel development

**Demonstrates:**

- Creating branches with `createBranch()`
- Switching branches with `checkout()`
- Parallel commits on multiple branches
- Branch color differentiation

**Timeline:**

```
main:    Base → Foundation → [create feature] → Bug fix → [create hotfix]
feature:                    └─→ Feature A → Feature B
hotfix:                                        └─→ Critical fix
```

---

### 3. MergeDemo

**Shows:** Merging branches back together

**Demonstrates:**

- Branch merging with `merge()`
- Merge commits with multiple parents
- Integration of parallel work
- Post-merge commits

**Timeline:**

```
main:    Initial → Base features → Hotfix → [Merge develop] → Cleanup
develop:          └─→ Feature 1 → Feature 2 ─┘
```

---

### 4. TestSequenceDemo

**Shows:** Complete testing workflow with feature branches

**Demonstrates:**

- Feature branch workflow (`test/feature-a`, `test/feature-b`)
- Testing sequences (unit tests → integration tests → fixes)
- Multiple feature development in parallel
- CI/CD integration points
- Final deployment after integration

**Timeline:**

```
main:          Init → Setup tests → [merge test/feature-a] → CI/CD → [merge test/feature-b] → Integration → Deploy
test/feature-a:      └─→ Impl A → Unit tests → Integration tests → Fix failures ─┘
test/feature-b:                                                     └─→ Impl B → Test coverage ─┘
```

---

## Usage

### Option 1: Use DemoShowcase (All Demos in Grid)

```jsx
import { DemoShowcase } from "@/features/visualizer";

function DemoPage() {
  return <DemoShowcase />;
}
```

### Option 2: Use Individual Demos

```jsx
import {
  CommitDemo,
  BranchingDemo,
  MergeDemo,
  TestSequenceDemo,
} from "@/features/visualizer";

function CustomDemoPage() {
  return (
    <div>
      <CommitDemo />
      <BranchingDemo />
      {/* ... */}
    </div>
  );
}
```

---

## How It Works

Each demo component:

1. **Creates its own GitGraph instance** via `useGitGraph()` hook
2. **Executes a predefined sequence** of Git operations on mount
3. **Uses the visualizer's existing components:**
   - `CustomNode` for rendering commits
   - `CustomEdge` for rendering relationships
   - `convertToReactFlow()` for graph layout
4. **Renders with ReactFlow** for visualization

### Independence

- Each demo has **its own graph** (no shared state)
- Animations run **automatically on mount** with staggered delays
- Graphs are **read-only** (no user interaction)

---

## Architecture

```
DemoShowcase/
├── DemoShowcase.jsx       # Container with grid layout
├── CommitDemo.jsx         # Linear commit demo
├── BranchingDemo.jsx      # Branching demo
├── MergeDemo.jsx          # Merge demo
├── TestSequenceDemo.jsx   # Full test workflow demo
├── DemoShowcase.css       # Shared styles
└── index.js               # Barrel exports
```

---

## Customization

### Add a New Demo

```jsx
import { useEffect, useRef } from "react";
import { ReactFlow } from "@xyflow/react";
import { useGitGraph } from "../../hooks/useGitGraph";
import CustomNode from "../Graph/CustomNode";
import CustomEdge from "../Graph/CustomEdge";

export const MyCustomDemo = () => {
  const { nodes, edges, commit, createBranch, checkout, merge } = useGitGraph();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Define your sequence
    const sequence = [
      { action: "commit", arg: "Start" },
      { action: "createBranch", arg: "my-branch" },
      { action: "checkout", arg: "my-branch" },
      { action: "commit", arg: "My feature" },
      { action: "checkout", arg: "main" },
      { action: "merge", arg: "my-branch" },
    ];

    let delay = 0;
    sequence.forEach(({ action, arg }) => {
      setTimeout(() => {
        switch (action) {
          case "commit":
            commit(arg);
            break;
          case "createBranch":
            createBranch(arg);
            break;
          case "checkout":
            checkout(arg);
            break;
          case "merge":
            merge(arg);
            break;
        }
      }, delay);
      delay += 700; // Adjust timing
    });
  }, [commit, createBranch, checkout, merge]);

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h3 className="demo-title">My Custom Demo</h3>
        <p className="demo-description">Description here</p>
      </div>
      <div className="demo-graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ custom: CustomNode }}
          edgeTypes={{ custom: CustomEdge }}
          fitView
          nodesDraggable={false}
          panOnDrag={false}
          zoomOnScroll={false}
        />
      </div>
    </div>
  );
};
```

---

## Styling

The CSS uses theme variables for consistency:

- Glass morphism effects
- Theme-aware colors (light/dark)
- Responsive grid layout
- Consistent spacing and shadows

---

## Integration with Landing Page

You can embed any demo in your landing page's DemoPreview section:

```jsx
import { CommitDemo } from "@/features/visualizer";

function DemoPreview() {
  return (
    <section id="demo">
      <CommitDemo />
    </section>
  );
}
```

---

## API Reference

### useGitGraph Hook Returns:

- `nodes` - ReactFlow nodes array
- `edges` - ReactFlow edges array
- `commit(message)` - Create a commit
- `createBranch(name)` - Create a branch
- `checkout(branch)` - Switch to a branch
- `merge(sourceBranch)` - Merge a branch into current
- `reset(commitId)` - Reset to a commit
- `revert(commitId)` - Revert a commit
- `rebase(source, target)` - Rebase (with animation)
- `clearGraph()` - Reset to initial state

---

## Notes

- Each demo auto-plays its sequence once on mount
- Timing is tuned for smooth, readable animations
- No user input required—purely demonstrative
- Uses existing visualizer components for consistency
- Fully responsive and theme-aware
