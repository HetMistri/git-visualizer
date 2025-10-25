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
import { GitBranch } from "lucide-react";
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
    nodes: graphNodes,
    edges: graphEdges,
    branches,
    currentBranch,
    getCommit,
    getBranchesForCommit,
    gitGraph,
  } = useGitGraph();

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);

  // Animation hooks
  const { performAnimatedRebase, isAnimating: isRebaseAnimating } =
    useRebaseAnimation();

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

  // Notification state
  const [notification, setNotification] = useState(null); // Update React Flow nodes/edges when graph changes
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

  // Show notification
  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Handle commit
  const handleCommit = useCallback(
    (message) => {
      const result = commit(message);
      if (result.success) {
        showNotification(`✓ Commit created: ${message}`, "success");
        setCommitModalOpen(false);
        // Push to terminal
        setTerminalCommands((prev) => [...prev, `git commit -m "${message}"`]);
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [commit, showNotification]
  );

  // Handle create branch
  const handleCreateBranch = useCallback(
    (branchName) => {
      const result = createBranch(branchName);
      if (result.success) {
        showNotification(`✓ Branch created: ${branchName}`, "success");
        setBranchModalOpen(false);
        setTerminalCommands((prev) => [...prev, `git branch ${branchName}`]);
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [createBranch, showNotification]
  );

  // Handle checkout
  const handleCheckout = useCallback(
    (branchName) => {
      const result = checkout(branchName);
      if (result.success) {
        showNotification(`✓ Switched to branch: ${branchName}`, "success");
        setTerminalCommands((prev) => [...prev, `git checkout ${branchName}`]);
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [checkout, showNotification]
  );

  // Handle merge
  const handleMerge = useCallback(
    (sourceBranch) => {
      const result = merge(sourceBranch);
      if (result.success) {
        showNotification(
          `✓ Merged ${sourceBranch} into ${currentBranch}`,
          "success"
        );
        setMergeModalOpen(false);
        setTerminalCommands((prev) => [...prev, `git merge ${sourceBranch}`]);
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [merge, currentBranch, showNotification]
  );

  // Handle reset to a specific commit
  const handleResetToCommit = useCallback(
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
          const orphanCount = gitGraph.orphanedCommits.size;
          if (orphanCount > 0) {
            showNotification(
              `✓ Branch reset. ${orphanCount} commit${
                orphanCount > 1 ? "s" : ""
              } orphaned (will be removed on next commit)`,
              "success"
            );
          } else {
            showNotification(
              `✓ Branch ${currentBranch} reset to commit`,
              "success"
            );
          }
        } else {
          showNotification(`✗ ${result.error}`, "error");
        }
      }
    },
    [reset, currentBranch, showNotification, gitGraph]
  );

  // Quick test sequence
  const handleQuickTest = useCallback(() => {
    const frontend = "frontend";
    const backend = "backend";

    showNotification("▶ Running quick test scenario...", "info");

    // Ensure branches exist
    if (!branches.includes(frontend)) {
      const r1 = createBranch(frontend);
      if (!r1.success) {
        showNotification(`✗ ${r1.error}`, "error");
        return;
      }
    }
    if (!branches.includes(backend)) {
      const r2 = createBranch(backend);
      if (!r2.success) {
        showNotification(`✗ ${r2.error}`, "error");
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

    showNotification("✓ Quick test scenario complete", "success");
  }, [branches, createBranch, checkout, commit, showNotification]);

  // Handle revert
  const handleRevert = useCallback(() => {
    if (!selectedCommitId) {
      showNotification("✗ Please select a commit to revert", "error");
      return;
    }

    const commitData = getCommit(selectedCommitId);
    if (
      confirm(`Are you sure you want to revert commit "${commitData.message}"?`)
    ) {
      const result = revert(selectedCommitId);
      if (result.success) {
        showNotification(`✓ Reverted commit: ${commitData.message}`, "success");
        setSelectedCommitId(null);
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    }
  }, [selectedCommitId, revert, getCommit, showNotification]);

  // Handle rebase with animation
  const handleRebase = useCallback(
    (data) => {
      const { sourceBranch, targetBranch } = data;

      if (sourceBranch === targetBranch) {
        showNotification(
          "✗ Source and target branches must be different",
          "error"
        );
        return;
      }

      if (isAnimating) {
        showNotification(
          "✗ Please wait for current animation to complete",
          "warning"
        );
        return;
      }

      // Show notification that animation is starting
      showNotification(
        `🎬 Rebasing ${sourceBranch} onto ${targetBranch}...`,
        "info"
      );
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
          showNotification(
            `✓ Rebased ${sourceBranch} onto ${targetBranch}`,
            "success"
          );
        }
      );

      if (!result.success) {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [
      gitGraph,
      performAnimatedRebase,
      setNodes,
      setEdges,
      showNotification,
      isAnimating,
    ]
  );

  // Handle node click
  const onNodeClick = useCallback(
    (event, node) => {
      // Set selected commit ID for revert operation
      setSelectedCommitId(node.id);

      // Also show commit details
      const commitData = getCommit(node.id);
      const commitBranches = getBranchesForCommit(node.id);

      // Auto-switch HEAD to a sensible target branch for this node
      // Priority:
      // 1) If currentBranch already points here, keep it
      // 2) If some branch tip points here, prefer commitData.createdByBranch if present, else the first branch tip
      // 3) Else fall back to the commit's creating branch (if it exists)
      let targetBranch = null;

      if (commitBranches.includes(currentBranch)) {
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

      if (targetBranch && targetBranch !== currentBranch) {
        const result = checkout(targetBranch);
        if (result.success) {
          showNotification(
            `✓ Switched to branch '${targetBranch}' for this commit`,
            "info"
          );
        }
      }

      setSelectedCommit({
        ...commitData,
        branches: commitBranches,
      });
    },
    [
      getCommit,
      getBranchesForCommit,
      checkout,
      currentBranch,
      branches,
      showNotification,
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
        onQuickTest={handleQuickTest}
        onCheckout={handleCheckout}
        onToggleTerminal={() => setTerminalOpen((prev) => !prev)}
        currentBranch={currentBranch}
        branches={branches}
      />

      {/* React Flow Graph */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={isAnimating ? undefined : onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
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
          position="bottom-left"
          className="rf-controls"
        />
      </ReactFlow>

      {/* Modals */}
      <InputModal
        isOpen={commitModalOpen}
        onClose={() => setCommitModalOpen(false)}
        onSubmit={handleCommit}
        title="Create Commit"
        placeholder="Enter commit message..."
        buttonText="Commit"
      />

      <InputModal
        isOpen={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        onSubmit={handleCreateBranch}
        title="Create Branch"
        placeholder="Enter branch name..."
        buttonText="Create"
      />

      <InputModal
        isOpen={mergeModalOpen}
        onClose={() => setMergeModalOpen(false)}
        onSubmit={handleMerge}
        title="Merge Branch"
        placeholder="Enter branch to merge..."
        buttonText="Merge"
      />

      <RebaseModal
        isOpen={rebaseModalOpen}
        onClose={() => setRebaseModalOpen(false)}
        onSubmit={handleRebase}
        branches={branches}
        currentBranch={currentBranch}
      />

      {selectedCommit && (
        <CommitDetails
          commit={selectedCommit}
          branches={selectedCommit.branches}
          onClose={() => setSelectedCommit(null)}
          onCheckout={handleCheckout}
          onRevert={handleRevert}
          onReset={() => handleResetToCommit(selectedCommit.id)}
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
          onCommandExecute={() => {
            // Trigger graph update after terminal command
            setNodes(graphNodes);
            setEdges(graphEdges);
          }}
          commandsFromToolbar={terminalCommands}
          onClose={() => setTerminalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
