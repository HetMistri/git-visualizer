import { useEffect, useRef, useState } from "react";
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
 * TerminalDemo - Shows terminal-like command execution with Git operations
 * Demonstrates: Terminal commands being executed and their visual effects
 */
export const TerminalDemo = () => {
  const { nodes, edges, commit, createBranch, checkout, merge } = useGitGraph();
  const [terminalLines, setTerminalLines] = useState([
    { type: "prompt", text: "$ " },
  ]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Simulate terminal commands being typed and executed
    const commands = [
      {
        cmd: "git commit -m 'Initial commit'",
        action: () => commit("Initial commit"),
        delay: 800,
      },
      {
        cmd: "git commit -m 'Add feature'",
        action: () => commit("Add feature"),
        delay: 800,
      },
      {
        cmd: "git branch develop",
        action: () => createBranch("develop"),
        delay: 800,
      },
      {
        cmd: "git checkout develop",
        action: () => checkout("develop"),
        delay: 800,
      },
      {
        cmd: "git commit -m 'Develop changes'",
        action: () => commit("Develop changes"),
        delay: 800,
      },
      {
        cmd: "git checkout main",
        action: () => checkout("main"),
        delay: 800,
      },
      {
        cmd: "git merge develop",
        action: () => merge("develop"),
        delay: 800,
      },
    ];

    let cumulativeDelay = 500;
    commands.forEach(({ cmd, action, delay }) => {
      // Type command
      setTimeout(() => {
        setTerminalLines((prev) => {
          const newLines = [...prev];
          newLines[newLines.length - 1] = { type: "prompt", text: `$ ${cmd}` };
          return newLines;
        });
      }, cumulativeDelay);

      // Execute command
      setTimeout(() => {
        action();
        setTerminalLines((prev) => [
          ...prev,
          { type: "output", text: "✓ Command executed successfully" },
          { type: "prompt", text: "$ " },
        ]);
      }, cumulativeDelay + 400);

      cumulativeDelay += delay;
    });
  }, [commit, createBranch, checkout, merge]);

  return (
    <div className="demo-container terminal-demo-container">
      <div className="terminal-demo-layout">
        {/* Terminal Window */}
        <div className="terminal-demo-window">
          <div className="terminal-demo-header">
            <div className="terminal-demo-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <span className="terminal-demo-title">git-visualizer</span>
          </div>
          <div className="terminal-demo-content">
            {terminalLines.map((line, index) => (
              <div
                key={index}
                className={`terminal-line ${
                  line.type === "prompt" ? "terminal-prompt" : "terminal-output"
                }`}
              >
                {line.text}
                {index === terminalLines.length - 1 &&
                  line.type === "prompt" && (
                    <span className="terminal-cursor">|</span>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Graph Visualization */}
        <div className="terminal-demo-graph">
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
    </div>
  );
};

export default TerminalDemo;
