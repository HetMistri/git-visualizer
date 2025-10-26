/**
 * Features Component
 *
 * Displays feature cards showcasing the visualizer's capabilities.
 * Uses Card component for consistent styling.
 */

import {
  Eye,
  GitBranch,
  GitMerge,
  Terminal,
  Zap,
  GitCommit,
} from "lucide-react";
import { Card } from "../../../components/ui";

const Features = () => {
  const features = [
    {
      icon: <Eye size={32} />,
      title: "Visual Understanding",
      description:
        "See your git operations come to life with interactive node-based visualization",
    },
    {
      icon: <GitBranch size={32} />,
      title: "Branch Management",
      description:
        "Create, switch, and manage branches with intuitive visual feedback",
    },
    {
      icon: <GitMerge size={32} />,
      title: "Merge & Rebase",
      description:
        "Understand complex operations with animated, step-by-step visualization",
    },
    {
      icon: <Terminal size={32} />,
      title: "CLI Integration",
      description:
        "Execute git commands in an integrated terminal with real-time graph updates",
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Feedback",
      description:
        "Every action reflects immediately in both the graph and command history",
    },
    {
      icon: <GitCommit size={32} />,
      title: "Commit History",
      description:
        "Track your commit timeline with detailed metadata and branch relationships",
    },
  ];

  return (
    <section className="features-section">
      <div className="section-header">
        <h2 className="section-title">Why Git Visualizer?</h2>
        <p className="section-subtitle">
          Powerful features designed to make git intuitive and accessible
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <Card
            key={index}
            variant="elevated"
            hoverable
            className="feature-card"
          >
            <Card.Icon>{feature.icon}</Card.Icon>
            <Card.Title>{feature.title}</Card.Title>
            <Card.Description>{feature.description}</Card.Description>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
