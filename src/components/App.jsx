import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomNode from "./CustomNode";
import Toolbar from "./Toolbar";
import InputModal from "./InputModal";
import CommitDetails from "./CommitDetails";
import { useGitGraph } from "../hooks/useGitGraph";
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
    nodes: graphNodes,
    edges: graphEdges,
    branches,
    currentBranch,
    stats,
    getCommit,
    getBranchesForCommit,
  } = useGitGraph();

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);

  // Modal states
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Update React Flow nodes/edges when graph changes
  useEffect(() => {
    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [graphNodes, graphEdges, setNodes, setEdges]);

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
      } else {
        showNotification(`✗ ${result.error}`, "error");
      }
    },
    [merge, currentBranch, showNotification]
  );

  // Handle reset
  const handleReset = useCallback(() => {
    if (
      confirm(
        "Are you sure you want to reset the entire graph? This cannot be undone."
      )
    ) {
      const result = reset();
      if (result.success) {
        showNotification("✓ Graph reset successfully", "success");
      }
    }
  }, [reset, showNotification]);

  // Handle node click
  const onNodeClick = useCallback(
    (event, node) => {
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
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.15,
          minZoom: 0.5,
          maxZoom: 1.2,
          duration: 400,
        }}
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        panOnScroll={true}
        selectionOnDrag={false}
        panOnDrag={[1, 2]} // Pan with middle or right mouse button
        zoomOnScroll={true}
        zoomOnPinch={true}
        preventScrolling={true}
      >
        <Background color="#94a3b8" gap={25} size={1.5} variant="dots" />
        <Controls
          showInteractive={false}
          position="bottom-right"
          className="rf-controls"
        />
        <MiniMap
          nodeColor={(node) => node.data.color}
          pannable
          zoomable
          position="bottom-left"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
          }}
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

      {selectedCommit && (
        <CommitDetails
          commit={selectedCommit}
          branches={selectedCommit.branches}
          onClose={() => setSelectedCommit(null)}
          onCheckout={handleCheckout}
        />
      )}

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
