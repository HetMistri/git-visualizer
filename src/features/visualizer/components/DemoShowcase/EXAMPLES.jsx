/**
 * Example: How to use Demo Components
 *
 * This file shows different ways to integrate the demo components
 * into your application.
 */

// ============================================
// EXAMPLE 1: Use All Demos (Grid Layout)
// ============================================
import { DemoShowcase } from "@/features/visualizer";

export function AllDemosPage() {
  return <DemoShowcase />;
}

// ============================================
// EXAMPLE 2: Use Individual Demos
// ============================================
import {
  CommitDemo,
  BranchingDemo,
  MergeDemo,
  TestSequenceDemo,
} from "@/features/visualizer";

export function CustomLayoutPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Git Operations</h1>
      <section>
        <h2>Basic Commits</h2>
        <CommitDemo />
      </section>

      <section>
        <h2>Branching</h2>
        <BranchingDemo />
      </section>

      <section>
        <h2>Merging</h2>
        <MergeDemo />
      </section>

      <section>
        <h2>Testing Workflow</h2>
        <TestSequenceDemo />
      </section>
    </div>
  );
}

// ============================================
// EXAMPLE 3: Single Demo in Landing Page
// ============================================
import { CommitDemo } from "@/features/visualizer";

export function LandingDemoSection() {
  return (
    <section id="demo" style={{ padding: "60px 20px" }}>
      <h2>See It In Action</h2>
      <CommitDemo />
    </section>
  );
}

// ============================================
// EXAMPLE 4: Add Route for Demo Page
// ============================================
// In your App.jsx or router config:

import { DemoShowcase } from "@/features/visualizer";
import { Routes, Route } from "react-router-dom";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/visualizer" element={<VisualizerPage />} />
      <Route path="/demos" element={<DemoShowcase />} />
    </Routes>
  );
}

// ============================================
// EXAMPLE 5: Embed in Existing Components
// ============================================
import { MergeDemo } from "@/features/visualizer";

export function TutorialSection() {
  return (
    <div className="tutorial">
      <h3>Understanding Git Merge</h3>
      <p>
        When you merge branches, Git creates a new commit with multiple parents.
        Watch the visualization below:
      </p>
      <MergeDemo />
      <p>Notice how the merge commit connects both branches...</p>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Side-by-Side Comparison
// ============================================
import { CommitDemo, BranchingDemo } from "@/features/visualizer";

export function ComparisonView() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
    >
      <div>
        <h3>Linear History</h3>
        <CommitDemo />
      </div>
      <div>
        <h3>Branching History</h3>
        <BranchingDemo />
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 7: Conditional Rendering
// ============================================
import { CommitDemo, BranchingDemo, MergeDemo } from "@/features/visualizer";
import { useState } from "react";

export function InteractiveDemoSelector() {
  const [selectedDemo, setSelectedDemo] = useState("commit");

  const demos = {
    commit: <CommitDemo />,
    branching: <BranchingDemo />,
    merge: <MergeDemo />,
  };

  return (
    <div>
      <nav>
        <button onClick={() => setSelectedDemo("commit")}>Commits</button>
        <button onClick={() => setSelectedDemo("branching")}>Branching</button>
        <button onClick={() => setSelectedDemo("merge")}>Merge</button>
      </nav>
      {demos[selectedDemo]}
    </div>
  );
}
