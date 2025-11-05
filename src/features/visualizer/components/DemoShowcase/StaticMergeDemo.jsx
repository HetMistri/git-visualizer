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

// Pre-computed static graph data for merge demo
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
      commit: { id: "e4f5g6h", message: "Initial setup", parents: ["commit1"] },
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
        message: "Add base features",
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
      commit: {
        id: "m0n1o2p",
        message: "Develop feature 1",
        parents: ["commit3"],
      },
      branches: [],
      branchColors: {},
      color: "#22C55E",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit5",
    type: "custom",
    position: { x: 950, y: 100 },
    data: {
      commit: {
        id: "q3r4s5t",
        message: "Develop feature 2",
        parents: ["commit4"],
      },
      branches: ["develop"],
      branchColors: { develop: "#22C55E" },
      color: "#22C55E",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit6",
    type: "custom",
    position: { x: 750, y: 220 },
    data: {
      commit: {
        id: "u6v7w8x",
        message: "Hotfix on main",
        parents: ["commit3"],
      },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit7",
    type: "custom",
    position: { x: 1150, y: 220 },
    data: {
      commit: {
        id: "y9z0a1b",
        message: "Merge develop",
        parents: ["commit6", "commit5"],
      },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: true,
    },
  },
  {
    id: "commit8",
    type: "custom",
    position: { x: 1350, y: 220 },
    data: {
      commit: {
        id: "c2d3e4f",
        message: "Post-merge cleanup",
        parents: ["commit7"],
      },
      branches: ["main"],
      branchColors: { main: "#3B82F6" },
      color: "#3B82F6",
      isHead: true,
      headBranch: "main",
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
    style: { stroke: "#22C55E", strokeWidth: 2.5, strokeDasharray: "8,4" },
  },
  {
    id: "commit4-commit5",
    source: "commit4",
    target: "commit5",
    type: "custom",
    style: { stroke: "#22C55E", strokeWidth: 3 },
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
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "commit5-commit7",
    source: "commit5",
    target: "commit7",
    type: "custom",
    style: {
      stroke: "#22C55E",
      strokeWidth: 2.5,
      strokeDasharray: "8,4",
      opacity: 0.7,
    },
  },
  {
    id: "commit7-commit8",
    source: "commit7",
    target: "commit8",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
];

/**
 * StaticMergeDemo - Lightweight static visualization
 * Shows merge commits without executing commands
 */
export const StaticMergeDemo = () => {
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
            maxZoom: 0.7,
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

export default StaticMergeDemo;
