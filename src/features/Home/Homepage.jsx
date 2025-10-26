import { Link } from "react-router-dom";
import {
  Rocket,
  GitBranch,
  GitMerge,
  GitCompare,
  Layers,
  Zap,
  Users,
  Github,
} from "lucide-react";
import { ThemeToggle } from "../../components/layout";
import "./Homepage.css";

function HomePage() {
  return (
    <main className="home">
      {/* Top navigation */}
      <nav className="home-nav">
        <div className="brand">
          <div className="brand-icon">
            <GitBranch size={24} strokeWidth={2.5} />
          </div>
          <span className="brand-name">GitGraph</span>
        </div>
        <div className="nav-actions">
          <a
            className="nav-link"
            href="https://github.com/omeepatel04/git-visualizer"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          <a className="nav-link" href="#features">
            Features
          </a>
          <Link to="/visualizer" className="nav-btn-primary">
            <Rocket size={16} />
            Launch Visualizer
          </Link>
                {/* Theme toggle (fixed) */}
            <ThemeToggle />
        </div>
      </nav>



      {/* Hero Section */}
      <header className="hero">
        <div className="hero-background">
          <div className="hero-grid-dots" />
          <div className="hero-gradient-orb orb-1" />
          <div className="hero-gradient-orb orb-2" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} />
            <span>Interactive Git Learning Platform</span>
          </div>

          <h1 className="hero-title">
            Visualize. Learn.
            <br />
            <span className="gradient-text">Master Git.</span>
          </h1>

          <p className="hero-subtitle">
            An interactive Git visualizer that helps students understand
            branches, merges, and rebases like never before. Experiment safely,
            learn visually, and build confidence with version control.
          </p>

          <div className="hero-cta">
            <Link to="/visualizer" className="btn-primary glow">
              <Rocket size={20} />
              Launch Visualizer
            </Link>
            <a
              className="btn-secondary"
              href="https://github.com/omeepatel04/git-visualizer"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github size={20} />
              View on GitHub
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">10k+</div>
              <div className="stat-label">Commits Visualized</div>
            </div>
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Students Learning</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Open Source</div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Highlights */}
      <section className="features" id="features">
        <div className="section-header">
          <h2 className="section-title">Why GitGraph?</h2>
          <p className="section-subtitle">
            Built by students, for students. Master Git visually.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon brain">
              <Layers size={28} />
            </div>
            <h3 className="feature-title">🧠 Understand Git Better</h3>
            <p className="feature-desc">
              Learn visually instead of memorizing commands. See how branches,
              commits, and merges work in real-time with animated graphs.
            </p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon branch">
              <GitBranch size={28} />
            </div>
            <h3 className="feature-title">🌿 Branch & Merge with Ease</h3>
            <p className="feature-desc">
              Create and explore branches interactively. Understand merge
              conflicts, fast-forwards, and three-way merges without fear.
            </p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon rebase">
              <GitCompare size={28} />
            </div>
            <h3 className="feature-title">🔄 Rebase, Reset & Revert</h3>
            <p className="feature-desc">
              Experiment safely without breaking anything. Learn advanced Git
              operations in a sandbox environment with instant visual feedback.
            </p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon students">
              <Users size={28} />
            </div>
            <h3 className="feature-title">⚡ For Students by Students</h3>
            <p className="feature-desc">
              Built to make Git simple for learners. No complex setup, no
              installations—just open and start learning immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="preview-section">
        <div className="section-header">
          <h2 className="section-title">See It In Action</h2>
          <p className="section-subtitle">
            Watch how GitGraph makes complex operations crystal clear
          </p>
        </div>

        <div className="preview-container glass">
          <div className="preview-window">
            <div className="window-header">
              <div className="window-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="window-title">GitGraph Visualizer</div>
            </div>
            <div className="preview-canvas">
              <div className="demo-nodes">
                <div className="demo-node node-1">
                  <GitBranch size={16} />
                  <span>main</span>
                </div>
                <div className="demo-edge edge-1" />
                <div className="demo-node node-2">
                  <GitMerge size={16} />
                  <span>feature</span>
                </div>
                <div className="demo-edge edge-2" />
                <div className="demo-node node-3">
                  <GitCompare size={16} />
                  <span>merge</span>
                </div>
              </div>
              <div className="demo-overlay">
                <Link to="/visualizer" className="demo-cta">
                  <Rocket size={18} />
                  Try Live Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="final-cta-content glass">
          <h2 className="final-cta-title">Start Learning Git Visually</h2>
          <p className="final-cta-text">
            Join hundreds of students already mastering version control with
            GitGraph. It's free, open source, and always will be.
          </p>
          <Link to="/visualizer" className="btn-primary glow large">
            <Rocket size={22} />
            Launch Visualizer Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/visualizer">Visualizer</Link>
            <a
              href="https://github.com/omeepatel04/git-visualizer"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
            <a href="#features">Features</a>
          </nav>

          <div className="footer-attribution">
            Made with ❤️ by students for students
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;
