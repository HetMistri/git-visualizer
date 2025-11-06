import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Github } from "lucide-react";
import { ScrollVelocity } from "../landing/components/ReactBits";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  const scrollMessages = [
    "404 • Page Not Found",
    "Lost in the Git Graph",
    "Branch Not Found",
    "Commit to Return Home",
    "404 • Page Not Found",
    "Lost in the Git Graph",
    "Branch Not Found",
    "Commit to Return Home",
  ];

  return (
    <div className="not-found">
      {/* Animated Scroll Text Background */}
      <div className="scroll-text-container">
        <ScrollVelocity velocity={2} className="scroll-text-row">
          {scrollMessages.map((msg, i) => (
            <span key={i} className="scroll-text-item">
              {msg}
            </span>
          ))}
        </ScrollVelocity>
        <ScrollVelocity velocity={-2} className="scroll-text-row reverse">
          {scrollMessages.map((msg, i) => (
            <span key={i} className="scroll-text-item">
              {msg}
            </span>
          ))}
        </ScrollVelocity>
        <ScrollVelocity velocity={2} className="scroll-text-row">
          {scrollMessages.map((msg, i) => (
            <span key={i} className="scroll-text-item">
              {msg}
            </span>
          ))}
        </ScrollVelocity>
      </div>

      {/* Content */}
      <div className="not-found-content">
        <div className="not-found-card">
          <div className="not-found-header">
            <h1 className="not-found-title">
              <span className="gradient-text">404</span>
            </h1>
            <h2 className="not-found-subtitle">Page Not Found</h2>
            <p className="not-found-description">
              Looks like this branch doesn't exist in the commit graph.
              <br />
              Let's get you back on track!
            </p>
          </div>

          <div className="not-found-actions">
            <button
              className="not-found-btn primary"
              onClick={() => navigate("/")}
              aria-label="Go to home page"
            >
              <Home size={20} />
              <span>Go Home</span>
            </button>
            <button
              className="not-found-btn secondary"
              onClick={() => navigate(-1)}
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
            <button
              className="not-found-btn secondary"
              onClick={() => navigate("/visualizer")}
              aria-label="Launch visualizer"
            >
              <span>Launch Visualizer</span>
            </button>
          </div>

          <div className="not-found-footer">
            <a
              href="https://github.com/omeepatel04/git-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              aria-label="View project on GitHub"
            >
              <Github size={20} />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
