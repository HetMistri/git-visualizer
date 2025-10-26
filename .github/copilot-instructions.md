# AI agent instructions for this repo

Purpose: Git-Vis is a React + Vite app that teaches Git by visualizing the commit DAG in real time using React Flow. The visualizer is a self‑contained feature with core git logic, state hooks, graph layout, and animated UX.

Build/run/lint

- Dev: npm run dev (Vite)
- Build: npm run build; Preview: npm run preview
- Lint: npm run lint (eslint config in eslint.config.js)

Architecture at a glance

- Feature-based modules in src/features; shared UI in src/components; app shell in src/app/App.jsx; theme in src/context/ThemeContext.jsx.
- Visualizer feature exports a full surface from a barrel: src/features/visualizer/index.js
  - Core git model: src/features/visualizer/core/gitGraph.js (CommitNode, GitGraph)
  - State facade: src/features/visualizer/hooks/useGitGraph.js (wraps GitGraph, exposes ops + success/error)
  - Rebase animation: src/features/visualizer/hooks/useRebaseAnimation.js (capture old/new nodes, animate, disable interactions)
  - Graph layout: src/features/visualizer/utils/graphLayout.js (levels by timestamp/parents, lanes by branch, deterministic branch colors)
  - Graph UI: CustomNode/CustomEdge in src/features/visualizer/components/Graph
  - Toolbar, Modals, CommitDetails, Terminal under src/features/visualizer/components

Core data model and rules (GitGraph)

- commits: Map<id, CommitNode>; branches: Map<branch, tipId>; HEAD: string (active branch); orphanedCommits: Set<id>.
- CommitNode: { id, message, parents[], createdByBranch, timestampMs } (id is random 7-char; timestampMs is stable for ordering).
- commit(): adds commit on HEAD; first garbage-collects any orphaned commits (deleted permanently on the next commit to mimic GC).
- createBranch(name): points new branch to current tip. checkout(name): sets HEAD.
- merge(source): creates a two-parent merge commit on HEAD.
- reset(commitId): moves HEAD branch pointer; marks commits no longer reachable from any branch as orphaned (grey, dashed); they’re GC’d on next commit.
- rebase(source, target): replays unique commits from source onto target as new commits (createdByBranch preserved); old source commits are marked orphaned; HEAD becomes source.
- revert(commitId): creates a new revert commit on HEAD.

Graph rendering (React Flow)

- convertToReactFlow(gitGraph) → { nodes, edges } using:
  - calculateLevels(): chronological levels (left→right) with parent-after-child enforcement, then compressed.
  - assignLanes(): vertical lanes by branch with main/master centered; createdByBranch drives persistent node color.
  - Edges: parent→child smooth paths; main-line thicker; merge edges dashed; orphaned nodes/edges dim and dashed.

State and UI integration

- useGitGraph returns ops (commit/createBranch/checkout/merge/reset/revert/rebase) that catch errors and return { success, error } plus derived nodes/edges and helpers (getCommit, getBranchesForCommit, forceUpdate, clearGraph).
- Visualizer.jsx orchestrates:
  - Local modals; notifications; toolbar; ReactFlow config; selection→auto-checkout to sensible branch; terminal passthrough; clearGraph button.
  - Rebase uses performAnimatedRebase(gitGraph, src, tgt, setNodes, setEdges, onDone); disables panning/zooming while animating.
- Terminal.jsx executes simplified git commands against the same gitGraph; toolbar actions append commands to history (log-only), not executed.

Conventions and patterns

- Barrel exports everywhere (index.js) — import from feature roots (e.g., import { useGitGraph } from "@/features/visualizer").
- Branch color is deterministic: getCachedBranchColor(name) wraps getBranchColor(name); createdByBranch controls each node’s persistent color even if branch pointers move.
- Node data schema includes: { commit, branches, branchColors, color, isHead, isMerge, isSelected, isOrphaned }.
- During animations, Visualizer disables pan/zoom and adds className "animating"; keep interactions side‑effect free during that time.

Extending the visualizer (example: add cherry-pick)

1. Add operation in GitGraph (produce a new CommitNode on HEAD with parent=current tip; preserve createdByBranch; set message like "Cherry-pick <hash>").
2. Expose in useGitGraph with try/catch → { success, error }.
3. UI: add toolbar control or modal, and extend Terminal parsing (Terminal.jsx) with git cherry-pick <id>.
4. If visuals differ (e.g., special edge/animation), pass data.animationType to nodes/edges and extend utils/animations.
5. Maintain layout via convertToReactFlow; don’t manually mutate ReactFlow state outside the hook.

Gotchas and tips

- Orphaned commits are view-only and removed on the next commit; don’t allow reset/revert to orphaned ids.
- Selection is tracked in Visualizer and merged into node.data.isSelected; HEAD overlay is available but currently commented out.
- Keep graph changes in GitGraph; call convertToReactFlow via useGitGraph to update UI consistently.

Key files to skim first

- README.md, src/features/visualizer/core/gitGraph.js, hooks/useGitGraph.js, utils/graphLayout.js, Visualizer.jsx, components/Graph/\*, components/Toolbar/Toolbar.jsx, components/Terminal/Terminal.jsx
