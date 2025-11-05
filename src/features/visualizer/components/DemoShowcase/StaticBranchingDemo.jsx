import { ReactFlow, Background, Controls } from "@xyflow/react";
import CustomNode from "../Graph/CustomNode";
import CustomEdge from "../Graph/CustomEdge";
import "@xyflow/react/dist/style.css";
import "./DemoShowcase.css";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// Pre-computed static graph data for branching demo
const staticNodes = [
  {
    id: "commit1",
    type: "custom",
    position: { x: 150, y: 220 },
    data: {
      commit: { id: "a1b2c3d", message: "Initial commit", parents: [] },
      branches: ["main"],
      branchColors: { main: "#3B82F6" },
      color: "#3B82F6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit2",
    type: "custom",
    position: { x: 350, y: 220 },
    data: {
      commit: { id: "e4f5g6h", message: "Base commit", parents: ["commit1"] },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit3",
    type: "custom",
    position: { x: 550, y: 220 },
    data: {
      commit: {
        id: "i7j8k9l",
        message: "Setup foundation",
        parents: ["commit2"],
      },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit4",
    type: "custom",
    position: { x: 750, y: 100 },
    data: {
      commit: { id: "m0n1o2p", message: "Add feature A", parents: ["commit3"] },
      branches: [],
      branchColors: {},
      color: "#F59E0B",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit5",
    type: "custom",
    position: { x: 950, y: 100 },
    data: {
      commit: { id: "q3r4s5t", message: "Add feature B", parents: ["commit4"] },
      branches: ["feature"],
      branchColors: { feature: "#F59E0B" },
      color: "#F59E0B",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit6",
    type: "custom",
    position: { x: 750, y: 220 },
    data: {
      commit: { id: "u6v7w8x", message: "Fix main bug", parents: ["commit3"] },
      branches: ["main"],
      branchColors: { main: "#3B82F6" },
      color: "#3B82F6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit7",
    type: "custom",
    position: { x: 950, y: 340 },
    data: {
      commit: {
        id: "y9z0a1b",
        message: "Critical hotfix",
        parents: ["commit6"],
      },
      branches: ["hotfix"],
      branchColors: { hotfix: "#EF4444" },
      color: "#EF4444",
      isHead: true,
      headBranch: "hotfix",
      isMerge: false,
    },
  },
];

const staticEdges = [
  {
    id: "commit1-commit2",
    source: "commit1",
    target: "commit2",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "commit2-commit3",
    source: "commit2",
    target: "commit3",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "commit3-commit4",
    source: "commit3",
    target: "commit4",
    type: "custom",
    style: { stroke: "#F59E0B", strokeWidth: 2.5, strokeDasharray: "8,4" },
  },
  {
    id: "commit4-commit5",
    source: "commit4",
    target: "commit5",
    type: "custom",
    style: { stroke: "#F59E0B", strokeWidth: 3 },
  },
  {
    id: "commit3-commit6",
    source: "commit3",
    target: "commit6",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "commit6-commit7",
    source: "commit6",
    target: "commit7",
    type: "custom",
    style: { stroke: "#EF4444", strokeWidth: 2.5, strokeDasharray: "8,4" },
  },
];

/**
 * StaticBranchingDemo - Lightweight static visualization
 * Shows branching without executing commands
 */
export const StaticBranchingDemo = () => {
  return (
    <div className="demo-container">
      <div className="demo-graph">
        <ReactFlow
          nodes={staticNodes}
          edges={staticEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{
            padding: 0.3,
            maxZoom: 0.8,
            minZoom: 0.4,
            includeHiddenNodes: false,
          }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={true}
        >
          <Background color="#94a3b8" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default StaticBranchingDemo;
