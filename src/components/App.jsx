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
import Toolbar from "./Toolbar";
import InputModal from "./InputModal";
import RebaseModal from "./RebaseModal";
import CommitDetails from "./CommitDetails";
import { useGitGraph } from "../hooks/useGitGraph";
import { useRebaseAnimation } from "../hooks/useRebaseAnimation";
import { useGraphAnimation } from "../hooks/useGraphAnimation";
import { GitBranch } from "lucide-react";
import "./App.css";

const nodeTypes = {
  custom: CustomNode,
};

function App() {
  const {
    commit,
    createBranch,
    checkout,
    merge,
    reset,
    revert,
    rebase,
    nodes: graphNodes,
    edges: graphEdges,
    branches,
    currentBranch,
    stats,
    getCommit,
    getBranchesForCommit,
    gitGraph,
  } = useGitGraph();

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);

  // Animation hooks
  const { performAnimatedRebase, isAnimating: isRebaseAnimating } =
    useRebaseAnimation();
  const {
    particles,
    isAnimating: isGraphAnimating,
    createParticleBurst,
    animateSequentialNodes,
    animateMergePulse,
    shakeGraph,
    fadeOutGraph,
    fadeInGraph,
    animateBranchSwitch,
    getButtonOrigin,
  } = useGraphAnimation();

  const isAnimating = isRebaseAnimating || isGraphAnimating;

  // Modal states
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [rebaseModalOpen, setRebaseModalOpen] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);

  // Selected commit for revert operation
  const [selectedCommitId, setSelectedCommitId] = useState(null);

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

  // Handle commit with animation
  const handleCommit = useCallback(
    (message, event) => {
      const result = commit(message);
      if (result.success) {
        // Particle burst from button
        const origin = getButtonOrigin(event);
        createParticleBurst(origin, "#667eea", 15);

        showNotification(`✓ Commit created: ${message}`, "success");
        setCommitModalOpen(false);
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [commit, showNotification, createParticleBurst, getButtonOrigin]
  );

  // Handle create branch with animation
  const handleCreateBranch = useCallback(
    (branchName, event) => {
      const result = createBranch(branchName);
      if (result.success) {
        // Particle burst with success color
        const origin = getButtonOrigin(event);
        createParticleBurst(origin, "#4ade80", 15);

        showNotification(`✓ Branch created: ${branchName}`, "success");
        setBranchModalOpen(false);
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [createBranch, showNotification, createParticleBurst, getButtonOrigin]
  );

  // Handle checkout with animation
  const handleCheckout = useCallback(
    (branchName) => {
      const result = checkout(branchName);
      if (result.success) {
        // Animate branch switch
        animateBranchSwitch(branchName);
        showNotification(`✓ Switched to branch: ${branchName}`, "success");
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [checkout, showNotification, animateBranchSwitch]
  );

  // Handle merge with animation
  const handleMerge = useCallback(
    (sourceBranch) => {
      const result = merge(sourceBranch);
      if (result.success) {
        // Pulse animation on target branch tip
        const targetCommitId = gitGraph.branches.get(currentBranch);
        if (targetCommitId) {
          animateMergePulse(targetCommitId, "#fbbf24");
        }

        showNotification(
          `✓ Merged ${sourceBranch} into ${currentBranch}`,
          "success"
        );
        setMergeModalOpen(false);
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [merge, currentBranch, showNotification, gitGraph, animateMergePulse]
  );

  // Handle reset with animation
  const handleReset = useCallback(() => {
    if (
      confirm(
        "Are you sure you want to reset the entire graph? This cannot be undone."
      )
    ) {
      // Shake warning then fade out
      shakeGraph(() => {
        fadeOutGraph(() => {
          const result = reset();
          if (result.success) {
            // Fade in new blank graph
            setTimeout(() => {
              fadeInGraph();
            }, 100);
            showNotification("✓ Graph reset successfully", "success");
            setSelectedCommitId(null);
          }
        });
      });
    }
  }, [reset, showNotification, shakeGraph, fadeOutGraph, fadeInGraph]);

  // Quick test sequence with animation
  const handleQuickTest = useCallback(() => {
    const frontend = "frontend";
    const backend = "backend";

    showNotification("▶ Running quick test scenario...", "info");

    // Store initial node count
    const initialCount = gitGraph.commits.size;

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

    // Collect new node IDs and animate them sequentially
    setTimeout(() => {
      const newNodeIds = Array.from(gitGraph.commits.keys()).slice(
        initialCount
      );
      if (newNodeIds.length > 0) {
        animateSequentialNodes(newNodeIds, 150, () => {
          showNotification("✓ Quick test scenario complete", "success");
        });
      } else {
        showNotification("✓ Quick test scenario complete", "success");
      }
    }, 100);
  }, [
    branches,
    createBranch,
    checkout,
    commit,
    showNotification,
    gitGraph,
    animateSequentialNodes,
  ]);

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

      setSelectedCommit({
        ...commitData,
        branches: commitBranches,
      });
    },
    [getCommit, getBranchesForCommit]
  );

  return (
    <div className="app-container">
      {/* Header */}
      {/* <header className="app-header glass">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <GitBranch size={24} />
            </div>
            <div className="logo-text">
              <h1>Git-Vis</h1>
              <p>Interactive Git Visualizer</p>
            </div>
          </div>

          <div className="header-stats">
            <div className="stat-badge">
              <div>
                <div className="stat-label">Commits</div>
                <div className="stat-number">{stats.commits}</div>
              </div>
            </div>
            <div className="stat-badge">
              <div>
                <div className="stat-label">Branches</div>
                <div className="stat-number">{stats.branches}</div>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      {/* Toolbar */}
      <Toolbar
        onCommit={() => setCommitModalOpen(true)}
        onCreateBranch={() => setBranchModalOpen(true)}
        onMerge={() => setMergeModalOpen(true)}
        onRebase={() => setRebaseModalOpen(true)}
        onQuickTest={handleQuickTest}
        onReset={handleReset}
        onCheckout={handleCheckout}
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
        />
      )}

      {/* Particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.life,
            }}
          />
        ))}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;
