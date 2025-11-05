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
 * MergeDemo - Shows merge operations between branches
 * Demonstrates: Branch merge, merge commits with multiple parents
 */
export const MergeDemo = () => {
  const graphRef = useRef(null);
  if (!graphRef.current) graphRef.current = new GitGraph();
  const { nodes, edges, commit, createBranch, checkout, merge } = useGitGraph({
    instanceId: "demo-merge",
    graph: graphRef.current,
  });
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Demonstrate merge workflow
    const sequence = [
      { action: "commit", arg: "Initial setup" },
      { action: "commit", arg: "Add base features" },
      { action: "createBranch", arg: "develop" },
      { action: "checkout", arg: "develop" },
      { action: "commit", arg: "Develop feature 1" },
      { action: "commit", arg: "Develop feature 2" },
      { action: "checkout", arg: "main" },
      { action: "commit", arg: "Hotfix on main" },
      { action: "merge", arg: "develop" },
      { action: "commit", arg: "Post-merge cleanup" },
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
      delay += 800;
    });
  }, [commit, createBranch, checkout, merge]);

  return (
    <div className="demo-container">
      <div className="demo-graph">
        <ReactFlow
          key="rf-merge-demo"
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

export default MergeDemo;
