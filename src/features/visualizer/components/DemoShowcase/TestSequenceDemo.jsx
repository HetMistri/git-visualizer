import { useEffect, useRef } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import { useGitGraph } from "../../hooks/useGitGraph";
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

/**
 * TestSequenceDemo - Shows a complete test workflow
 * Demonstrates: Feature branch workflow, testing, and integration
 */
export const TestSequenceDemo = () => {
  const { nodes, edges, commit, createBranch, checkout, merge } = useGitGraph();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Demonstrate a complete test sequence workflow
    const sequence = [
      { action: "commit", arg: "Project initialization" },
      { action: "commit", arg: "Setup test framework" },
      { action: "createBranch", arg: "test/feature-a" },
      { action: "checkout", arg: "test/feature-a" },
      { action: "commit", arg: "Implement feature A" },
      { action: "commit", arg: "Add unit tests" },
      { action: "commit", arg: "Add integration tests" },
      { action: "commit", arg: "Fix test failures" },
      { action: "checkout", arg: "main" },
      { action: "createBranch", arg: "test/feature-b" },
      { action: "checkout", arg: "test/feature-b" },
      { action: "commit", arg: "Implement feature B" },
      { action: "commit", arg: "Add test coverage" },
      { action: "checkout", arg: "main" },
      { action: "merge", arg: "test/feature-a" },
      { action: "commit", arg: "Run CI/CD pipeline" },
      { action: "merge", arg: "test/feature-b" },
      { action: "commit", arg: "Final integration tests" },
      { action: "commit", arg: "Deploy to production" },
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
          default:
            break;
        }
      }, delay);
      delay += 600;
    });
  }, [commit, createBranch, checkout, merge]);

  return (
    <div className="demo-container">
      {/* <div className="demo-header">
        <h3 className="demo-title">Test Sequence Demo</h3>
        <p className="demo-description">
          Complete testing workflow with feature branches
        </p>
      </div> */}
      <div className="demo-graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{
            padding: 0.3,
            maxZoom: 0.9,
            minZoom: 0.4,
            includeHiddenNodes: false,
          }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          preventScrolling={true}
          minZoom={0.1}
          maxZoom={2}
        >
          <Background color="#94a3b8" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default TestSequenceDemo;
