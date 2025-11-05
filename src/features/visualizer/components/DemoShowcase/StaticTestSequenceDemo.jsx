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

// Pre-computed static graph data for test sequence demo
const staticNodes = [
  {
    id: "commit1",
    type: "custom",
    position: { x: 150, y: 280 },
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
    position: { x: 350, y: 280 },
    data: {
      commit: {
        id: "e4f5g6h",
        message: "Project initialization",
        parents: ["commit1"],
      },
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
    position: { x: 550, y: 280 },
    data: {
      commit: {
        id: "i7j8k9l",
        message: "Setup test framework",
        parents: ["commit2"],
      },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: false,
    },
  },
  // Test/feature-a branch
  {
    id: "commit4",
    type: "custom",
    position: { x: 750, y: 160 },
    data: {
      commit: {
        id: "m0n1o2p",
        message: "Implement feature A",
        parents: ["commit3"],
      },
      branches: [],
      branchColors: {},
      color: "#8B5CF6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit5",
    type: "custom",
    position: { x: 950, y: 160 },
    data: {
      commit: {
        id: "q3r4s5t",
        message: "Add unit tests",
        parents: ["commit4"],
      },
      branches: [],
      branchColors: {},
      color: "#8B5CF6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit6",
    type: "custom",
    position: { x: 1150, y: 160 },
    data: {
      commit: {
        id: "u6v7w8x",
        message: "Add integration tests",
        parents: ["commit5"],
      },
      branches: [],
      branchColors: {},
      color: "#8B5CF6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit7",
    type: "custom",
    position: { x: 1350, y: 160 },
    data: {
      commit: {
        id: "y9z0a1b",
        message: "Fix test failures",
        parents: ["commit6"],
      },
      branches: ["test/feature-a"],
      branchColors: { "test/feature-a": "#8B5CF6" },
      color: "#8B5CF6",
      isHead: false,
      isMerge: false,
    },
  },
  // Test/feature-b branch
  {
    id: "commit8",
    type: "custom",
    position: { x: 750, y: 400 },
    data: {
      commit: {
        id: "c2d3e4f",
        message: "Implement feature B",
        parents: ["commit3"],
      },
      branches: [],
      branchColors: {},
      color: "#F59E0B",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit9",
    type: "custom",
    position: { x: 950, y: 400 },
    data: {
      commit: {
        id: "g5h6i7j",
        message: "Add test coverage",
        parents: ["commit8"],
      },
      branches: ["test/feature-b"],
      branchColors: { "test/feature-b": "#F59E0B" },
      color: "#F59E0B",
      isHead: false,
      isMerge: false,
    },
  },
  // Main branch merges
  {
    id: "commit10",
    type: "custom",
    position: { x: 1550, y: 280 },
    data: {
      commit: {
        id: "k8l9m0n",
        message: "Merge test/feature-a",
        parents: ["commit3", "commit7"],
      },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: true,
    },
  },
  {
    id: "commit11",
    type: "custom",
    position: { x: 1750, y: 280 },
    data: {
      commit: {
        id: "o1p2q3r",
        message: "Run CI/CD pipeline",
        parents: ["commit10"],
      },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit12",
    type: "custom",
    position: { x: 1950, y: 280 },
    data: {
      commit: {
        id: "s4t5u6v",
        message: "Merge test/feature-b",
        parents: ["commit11", "commit9"],
      },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: true,
    },
  },
  {
    id: "commit13",
    type: "custom",
    position: { x: 2150, y: 280 },
    data: {
      commit: {
        id: "w7x8y9z",
        message: "Final integration tests",
        parents: ["commit12"],
      },
      branches: [],
      branchColors: {},
      color: "#3B82F6",
      isHead: false,
      isMerge: false,
    },
  },
  {
    id: "commit14",
    type: "custom",
    position: { x: 2350, y: 280 },
    data: {
      commit: {
        id: "a0b1c2d",
        message: "Deploy to production",
        parents: ["commit13"],
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
  // Main branch
  {
    id: "e1",
    source: "commit1",
    target: "commit2",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "e2",
    source: "commit2",
    target: "commit3",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },

  // Test/feature-a branch
  {
    id: "e3",
    source: "commit3",
    target: "commit4",
    type: "custom",
    style: { stroke: "#8B5CF6", strokeWidth: 2.5, strokeDasharray: "8,4" },
  },
  {
    id: "e4",
    source: "commit4",
    target: "commit5",
    type: "custom",
    style: { stroke: "#8B5CF6", strokeWidth: 3 },
  },
  {
    id: "e5",
    source: "commit5",
    target: "commit6",
    type: "custom",
    style: { stroke: "#8B5CF6", strokeWidth: 3 },
  },
  {
    id: "e6",
    source: "commit6",
    target: "commit7",
    type: "custom",
    style: { stroke: "#8B5CF6", strokeWidth: 3 },
  },

  // Test/feature-b branch
  {
    id: "e7",
    source: "commit3",
    target: "commit8",
    type: "custom",
    style: { stroke: "#F59E0B", strokeWidth: 2.5, strokeDasharray: "8,4" },
  },
  {
    id: "e8",
    source: "commit8",
    target: "commit9",
    type: "custom",
    style: { stroke: "#F59E0B", strokeWidth: 3 },
  },

  // Merges
  {
    id: "e9",
    source: "commit3",
    target: "commit10",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "e10",
    source: "commit7",
    target: "commit10",
    type: "custom",
    style: {
      stroke: "#8B5CF6",
      strokeWidth: 2.5,
      strokeDasharray: "8,4",
      opacity: 0.7,
    },
  },
  {
    id: "e11",
    source: "commit10",
    target: "commit11",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "e12",
    source: "commit11",
    target: "commit12",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "e13",
    source: "commit9",
    target: "commit12",
    type: "custom",
    style: {
      stroke: "#F59E0B",
      strokeWidth: 2.5,
      strokeDasharray: "8,4",
      opacity: 0.7,
    },
  },
  {
    id: "e14",
    source: "commit12",
    target: "commit13",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
  {
    id: "e15",
    source: "commit13",
    target: "commit14",
    type: "custom",
    style: { stroke: "#3B82F6", strokeWidth: 3 },
  },
];

/**
 * StaticTestSequenceDemo - Lightweight static visualization
 * Shows complete test workflow without executing commands
 */
export const StaticTestSequenceDemo = () => {
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
            maxZoom: 0.5,
            minZoom: 0.3,
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

export default StaticTestSequenceDemo;
