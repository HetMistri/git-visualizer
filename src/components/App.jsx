import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import Toolbar from "./Toolbar";
import InputModal from "./InputModal";
import RebaseModal from "./RebaseModal";
import CommitDetails from "./CommitDetails";
import Terminal from "./Terminal";
import { useGitGraph } from "../hooks/useGitGraph";
import { useRebaseAnimation } from "../hooks/useRebaseAnimation";
import { GitBranch, Eraser } from "lucide-react";
import "./App.css";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

function App() {
  const {
    commit,
    createBranch,
    checkout,
    merge,
    reset,
    revert,
    clearGraph,
    nodes: graphNodes,
    edges: graphEdges,
    branches,
    currentBranch,
    getCommit,
    getBranchesForCommit,
    gitGraph,
    forceUpdate,
  } = useGitGraph();

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);

  // Animation hooks
  const { performAnimatedRebase, isAnimating: isRebaseAnimating } =
    useRebaseAnimation();
  // Local alias used throughout the component
  const isAnimating = isRebaseAnimating;

  // Modal states
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [rebaseModalOpen, setRebaseModalOpen] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);

  // Selected commit for revert operation
  const [selectedCommitId, setSelectedCommitId] = useState(null);

  // Terminal state
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalCommands, setTerminalCommands] = useState([]);

  // Toasts (lightweight notifications)
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    // Add selection state to node data
    const nodesWithSelection = graphNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isSelected: node.id === selectedCommitId,
      },
    }));
    setNodes(nodesWithSelection);
    setEdges(graphEdges);
  }, [graphNodes, graphEdges, selectedCommitId, setNodes, setEdges]);

  // Tiny toast helper
  const toast = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // 1) commit
  const onCommit = useCallback(
    (message) => {
      const result = commit(message);
      if (result.success) {
        toast(`✓ Commit created: ${message}`, "success");
        setCommitModalOpen(false);
        // Push to terminal
        setTerminalCommands((prev) => [...prev, `git commit -m "${message}"`]);
      } else {
        toast(`✗ ${result.error}`, "error");
      }
    },
    [commit, toast]
  );

  // 2) branch
  const onBranch = useCallback(
    (branchName) => {
      const result = createBranch(branchName);
      if (result.success) {
        toast(`✓ Branch created: ${branchName}`, "success");
        setBranchModalOpen(false);
        setTerminalCommands((prev) => [...prev, `git branch ${branchName}`]);
      } else {
        toast(`✗ ${result.error}`, "error");
      }
    },
    [createBranch, toast]
  );

  // 3) checkout
  const onCheckout = useCallback(
    (branchName) => {
      const result = checkout(branchName);
      if (result.success) {
        toast(`✓ Switched to branch: ${branchName}`, "success");
        setTerminalCommands((prev) => [...prev, `git checkout ${branchName}`]);
      } else {
        toast(`✗ ${result.error}`, "error");
      }
    },
    [checkout, toast]
  );

  // 4) merge
  const onMerge = useCallback(
    (sourceBranch) => {
      const result = merge(sourceBranch);
      if (result.success) {
        toast(`✓ Merged ${sourceBranch} into ${currentBranch}`, "success");
        setMergeModalOpen(false);
        setTerminalCommands((prev) => [...prev, `git merge ${sourceBranch}`]);
      } else {
        toast(`✗ ${result.error}`, "error");
      }
    },
    [merge, currentBranch, toast]
  );

  // 7) reset (to specific commit)
  const onResetToCommit = useCallback(
    (commitId) => {
      // Preview: compute which commits on the target branch would become orphaned
      const targetBranch = gitGraph.HEAD;
      const targetTip = gitGraph.branches.get(targetBranch);
      const oldReachable = gitGraph.getReachableCommits(targetTip);
      const selectedReachable = gitGraph.getReachableCommits(commitId);

      // Collect reachable commits from all OTHER branches
      const otherReachable = new Set();
      for (const [bName, bTip] of gitGraph.branches.entries()) {
        if (bName === targetBranch) continue;
        const r = gitGraph.getReachableCommits(bTip);
        r.forEach((id) => otherReachable.add(id));
      }

      const keepSet = new Set([...selectedReachable, ...otherReachable]);
      const wouldOrphan = [];
      for (const id of oldReachable) {
        if (!keepSet.has(id)) wouldOrphan.push(id);
      }

      const isInLineage = oldReachable.has(commitId);

      const warning = isInLineage
        ? ""
        : `\n\n⚠️ Selected commit is not in ${targetBranch}'s current lineage. The branch pointer will move to a different history.`;

      const confirmMsg =
        `Reset branch '${targetBranch}' to this commit?` +
        `\n\nThis will move '${targetBranch}' from ${targetTip} to ${commitId}.` +
        `\nCommits unique to '${targetBranch}' that would be orphaned: ${wouldOrphan.length}` +
        `\n\nOrphaned commits are shown greyed out and will be permanently removed after the next commit.` +
        warning +
        `\n\nProceed?`;

      if (confirm(confirmMsg)) {
        const result = reset(commitId);
        if (result.success) {
          // Reflect in terminal
          setTerminalCommands((prev) => [
            ...prev,
            `git reset --hard ${commitId}`,
          ]);
          const orphanCount = gitGraph.orphanedCommits.size;
          if (orphanCount > 0) {
            toast(
              `✓ Branch reset. ${orphanCount} commit${
                orphanCount > 1 ? "s" : ""
              } orphaned (will be removed on next commit)`,
              "success"
            );
          } else {
            toast(`✓ Branch ${currentBranch} reset to commit`, "success");
          }
        } else {
          toast(`✗ ${result.error}`, "error");
        }
      }
    },
    [reset, currentBranch, toast, gitGraph]
  );

  // Quick test sequence (demo)
  const onQuickRun = useCallback(() => {
    const frontend = "frontend";
    const backend = "backend";

    toast("▶ Running quick test scenario...", "info");

    // Ensure branches exist
    if (!branches.includes(frontend)) {
      const r1 = createBranch(frontend);
      if (!r1.success) {
        toast(`✗ ${r1.error}`, "error");
        return;
      }
    }
    if (!branches.includes(backend)) {
      const r2 = createBranch(backend);
      if (!r2.success) {
        toast(`✗ ${r2.error}`, "error");
        return;
      }
    }

    // Perform the sequence
    checkout(frontend);
    commit("Feat: add X");
    commit("Feat: add Y");
    checkout(backend);
    commit("Feat: add A");
    checkout(frontend);
    commit("Feat: add X");
    checkout(backend);
    commit("Feat: add B");

    toast("✓ Quick test scenario complete", "success");
  }, [branches, createBranch, checkout, commit, toast]);

  // 6) revert
  const onRevert = useCallback(() => {
    if (!selectedCommitId) {
      toast("✗ Please select a commit to revert", "error");
      return;
    }

    const commitData = getCommit(selectedCommitId);
    if (
      confirm(`Are you sure you want to revert commit "${commitData.message}"?`)
    ) {
      const result = revert(selectedCommitId);
      if (result.success) {
        toast(`✓ Reverted commit: ${commitData.message}`, "success");
        // Reflect in terminal
        setTerminalCommands((prev) => [
          ...prev,
          `git revert ${selectedCommitId}`,
        ]);
        setSelectedCommitId(null);
      } else {
        toast(`✗ ${result.error}`, "error");
      }
    }
  }, [selectedCommitId, revert, getCommit, toast]);

  // 5) rebase (animated)
  const onRebase = useCallback(
    (data) => {
      const { sourceBranch, targetBranch } = data;

      if (sourceBranch === targetBranch) {
        toast("✗ Source and target branches must be different", "error");
        return;
      }

      if (isAnimating) {
        toast("✗ Please wait for current animation to complete", "warning");
        return;
      }

      // Show notification that animation is starting
      toast(`🎬 Rebasing ${sourceBranch} onto ${targetBranch}...`, "info");
      setRebaseModalOpen(false);

      // Perform animated rebase
      const result = performAnimatedRebase(
        gitGraph,
        sourceBranch,
        targetBranch,
        setNodes,
        setEdges,
        () => {
          // Animation complete callback
          toast(`✓ Rebased ${sourceBranch} onto ${targetBranch}`, "success");
        }
      );

      if (!result.success) {
        toast(`✗ ${result.error}`, "error");
      } else {
        // Reflect in terminal – common CLI sequence
        setTerminalCommands((prev) => [
          ...prev,
          `git checkout ${sourceBranch}`,
          `git rebase ${targetBranch}`,
        ]);
      }
    },
    [gitGraph, performAnimatedRebase, setNodes, setEdges, toast, isAnimating]
  );

  // Node select → auto-branch context + details
  const onNodeSelect = useCallback(
    (event, node) => {
      // Set selected commit ID for revert operation
      setSelectedCommitId(node.id);

      // Also show commit details
      const commitData = getCommit(node.id);
      const commitBranches = getBranchesForCommit(node.id);

      // Orphaned commits are view-only
      const isOrphan = gitGraph.orphanedCommits.has(node.id);

      // Autoo-switch HEAD to a sensible target branch for this node
      // Priority:
      // 1) If currentBranch already points here, keep it
      // 2) If some branch tip pints here, prefer commitData.createdByBranch if present, else the first branch tip
      // 3) Else fall back to the commit's creating branch (if it exists)
      let targetBranch = null;

      if (isOrphan) {
        targetBranch = null;
        toast("Orphaned commit (read-only)", "warning");
      } else if (commitBranches.includes(currentBranch)) {
        targetBranch = currentBranch;
      } else if (commitBranches.length > 0) {
        if (
          commitData?.createdByBranch &&
          commitBranches.includes(commitData.createdByBranch)
        ) {
          targetBranch = commitData.createdByBranch;
        } else {
          targetBranch = commitBranches[0];
        }
      } else if (
        commitData?.createdByBranch &&
        branches.includes(commitData.createdByBranch)
      ) {
        targetBranch = commitData.createdByBranch;
      }

      if (!isOrphan && targetBranch && targetBranch !== currentBranch) {
        const result = checkout(targetBranch);
        if (result.success) {
          toast(
            `✓ Switched to branch '${targetBranch}' for this commit`,
            "info"
          );
        }
      }

      setSelectedCommit({
        ...commitData,
        branches: commitBranches,
        isOrphaned: isOrphan,
      });
    },
    [
      getCommit,
      getBranchesForCommit,
      checkout,
      currentBranch,
      branches,
      toast,
      gitGraph,
    ]
  );

  return (
    <div className="app-container">
      {/* Toolbar */}
      <Toolbar
        onCommit={() => setCommitModalOpen(true)}
        onCreateBranch={() => setBranchModalOpen(true)}
        onMerge={() => setMergeModalOpen(true)}
        onRebase={() => setRebaseModalOpen(true)}
        onQuickTest={onQuickRun}
        onCheckout={onCheckout}
        onToggleTerminal={() => setTerminalOpen((prev) => !prev)}
        currentBranch={currentBranch}
        branches={branches}
        terminalOpen={terminalOpen}
      />

      {/* React Flow Graph */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={isAnimating ? undefined : onNodeSelect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={(instance) => instance.fitView({ padding: 0.2, duration: 500 })}
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        panOnScroll={!isAnimating}
        selectionOnDrag={false}
        panOnDrag={isAnimating ? false : [1, 2]} // Disable pan during animation
        zoomOnScroll={!isAnimating}
        zoomOnPinch={!isAnimating}
        preventScrolling={true}
        className={isAnimating ? "animating" : ""}
      >
        <Background color="#94a3b8" gap={25} size={1.5} variant="dots" />
        <Controls
          showInteractive={false}
          position="top-left"
          className="rf-controls"
        />
        {/* Clear Canvas button near controls */}
        <div className="clear-canvas-panel">
          <button
            className="clear-canvas-btn"
            onClick={() => {
              if (
                confirm(
                  "Clear canvas? This will reset to a fresh repo with only the initial commit on 'main'."
                )
              ) {
                const res = clearGraph();
                if (res.success) {
                  toast("✓ Canvas cleared", "success");
                  // Log to terminal (informational)
                  setTerminalCommands((prev) => [...prev, "git init"]);
                } else {
                  toast(`✗ ${res.error}`, "error");
                }
              }
            }}
            title="Clear Canvas"
          >
            <Eraser size={16} />
          </button>
        </div>
      </ReactFlow>

      {/* Modals */}
      <InputModal
        isOpen={commitModalOpen}
        onClose={() => setCommitModalOpen(false)}
        onSubmit={onCommit}
        title="Create Commit"
        placeholder="Enter commit message..."
        buttonText="Commit"
      />

      <InputModal
        isOpen={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        onSubmit={onBranch}
        title="Create Branch"
        placeholder="Enter branch name..."
        buttonText="Create"
      />

      <InputModal
        isOpen={mergeModalOpen}
        onClose={() => setMergeModalOpen(false)}
        onSubmit={onMerge}
        title="Merge Branch"
        placeholder="Enter branch to merge..."
        buttonText="Merge"
      />

      <RebaseModal
        isOpen={rebaseModalOpen}
        onClose={() => setRebaseModalOpen(false)}
        onSubmit={onRebase}
        branches={branches}
        currentBranch={currentBranch}
      />

      {selectedCommit && (
        <CommitDetails
          commit={selectedCommit}
          branches={selectedCommit.branches}
          onClose={() => setSelectedCommit(null)}
          onCheckout={onCheckout}
          onRevert={onRevert}
          onReset={() => onResetToCommit(selectedCommit.id)}
          currentBranch={currentBranch}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Terminal */}
      {terminalOpen && (
        <Terminal
          gitGraph={gitGraph}
          currentBranch={currentBranch}
          onCommandExecute={forceUpdate}
          commandsFromToolbar={terminalCommands}
          onClose={() => setTerminalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
