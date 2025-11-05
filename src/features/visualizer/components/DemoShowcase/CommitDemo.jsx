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
 * CommitDemo - Shows a sequence of commits on main branch
 * Demonstrates: Basic commit flow, linear history
 */
export const CommitDemo = () => {
  // Hard isolate: create a dedicated GitGraph for this demo
  const graphRef = useRef(null);
  if (!graphRef.current) graphRef.current = new GitGraph();
  const { nodes, edges, commit } = useGitGraph({
    instanceId: "demo-commit",
    graph: graphRef.current,
  });
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Create a sequence of commits to demonstrate linear history
    const sequence = [
      "Add README",
      "Setup project structure",
      "Implement core features",
      "Add tests",
      "Update documentation",
    ];

    let delay = 0;
    sequence.forEach((msg) => {
      setTimeout(() => {
        commit(msg);
      }, delay);
      delay += 600;
    });
  }, [commit]);

  return (
    <div className="demo-container">
      <div className="demo-graph">
        <ReactFlow
          key="rf-commit-demo"
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

export default CommitDemo;
