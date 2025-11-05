import { useEffect, useRef } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import { useGitGraph } from "../../hooks/useGitGraph";
import { GitGraph } from "../../core/gitGraph";
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
 * BranchingDemo - Shows branch creation and parallel development
 * Demonstrates: Branch creation, checkout, parallel commits
 */
export const BranchingDemo = () => {
  const graphRef = useRef(null);
  if (!graphRef.current) graphRef.current = new GitGraph();
  const { nodes, edges, commit, createBranch, checkout } = useGitGraph({
    instanceId: "demo-branching",
    graph: graphRef.current,
  });
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Demonstrate branching workflow
    const sequence = [
      { action: "commit", arg: "Base commit" },
      { action: "commit", arg: "Setup foundation" },
      { action: "createBranch", arg: "feature" },
      { action: "checkout", arg: "feature" },
      { action: "commit", arg: "Add feature A" },
      { action: "commit", arg: "Add feature B" },
      { action: "checkout", arg: "main" },
      { action: "commit", arg: "Fix main bug" },
      { action: "createBranch", arg: "hotfix" },
      { action: "checkout", arg: "hotfix" },
      { action: "commit", arg: "Critical hotfix" },
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
          default:
            break;
        }
      }, delay);
      delay += 700;
    });
  }, [commit, createBranch, checkout]);

  return (
    <div className="demo-container">
      <div className="demo-graph">
        <ReactFlow
          key="rf-branching-demo"
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{
            padding: 0.3,
            maxZoom: 1,
            minZoom: 0.5,
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

export default BranchingDemo;
