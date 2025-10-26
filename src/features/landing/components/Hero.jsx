/**
 * Hero Component
 *
 * Landing page hero section with title, badges, CTA buttons,
 * and floating git icons animation.
 */

import { GitBranch, GitMerge, GitCommit, Play, ArrowRight } from "lucide-react";
import { Button, Badge } from "../../../components/ui";

const Hero = ({ onLaunch }) => {
  const scrollToFeatures = () => {
    document
      .querySelector(".features-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="floating-icon floating-icon-1">
          <GitBranch size={48} />
        </div>
        <div className="floating-icon floating-icon-2">
          <GitMerge size={40} />
        </div>
        <div className="floating-icon floating-icon-3">
          <GitCommit size={44} />
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-badges">
          <Badge variant="primary" pill>
            Interactive
          </Badge>
          <Badge variant="success" pill>
            Educational
          </Badge>
          <Badge variant="info" pill>
            Open Source
          </Badge>
        </div>

        <h1 className="hero-title">
          Understand Git
          <br />
          <span className="gradient-text">Visually</span>
        </h1>

        <p className="hero-subtitle">
          An interactive way to visualize git branches, merges, rebases, and
          commits.
          <br />
          Master version control through real-time visual feedback.
        </p>

        <div className="hero-cta">
          <Button
            variant="primary"
            size="large"
            icon={<Play size={20} />}
            onClick={onLaunch}
          >
            Launch Visualizer
            <ArrowRight size={20} />
          </Button>
          <Button variant="secondary" size="large" onClick={scrollToFeatures}>
            Learn More
          </Button>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

export default Hero;
