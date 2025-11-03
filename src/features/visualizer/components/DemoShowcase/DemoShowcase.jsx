import CommitDemo from "./CommitDemo";
import BranchingDemo from "./BranchingDemo";
import MergeDemo from "./MergeDemo";
import TestSequenceDemo from "./TestSequenceDemo";
import "./DemoShowcase.css";

/**
 * DemoShowcase - Container component that displays all demo visualizations
 * Each demo is independent with its own GitGraph instance
 */
export const DemoShowcase = () => {
  return (
    <div className="demo-showcase-root">
      <div className="demo-showcase-header">
        <h1 className="demo-showcase-title">Git Visualizer Demos</h1>
        <p className="demo-showcase-subtitle">
          Interactive demonstrations of core Git operations
        </p>
      </div>

      <div className="demo-grid">
        <CommitDemo />
        <BranchingDemo />
        <MergeDemo />
        <TestSequenceDemo />
      </div>
    </div>
  );
};

export default DemoShowcase;
