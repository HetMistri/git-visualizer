/**
 * Demo Component
 *
 * Interactive demo preview section with animated graph nodes.
 * Shows a preview of the visualizer in action.
 */

import { Play } from "lucide-react";

const Demo = () => {
  return (
    <section className="demo-section">
      <div className="section-header">
        <h2 className="section-title">See It In Action</h2>
        <p className="section-subtitle">
          Watch how git operations transform into visual elements
        </p>
      </div>

      <div className="demo-preview">
        <div className="demo-placeholder">
          <div className="demo-graph">
            <div className="demo-node"></div>
            <div className="demo-node"></div>
            <div className="demo-node"></div>
            <div className="demo-branch"></div>
          </div>
          <div className="demo-overlay">
            <Play size={64} />
            <p>Interactive Demo</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
