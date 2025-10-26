/**
 * HomeButton Component
 *
 * A fixed-position button that navigates back to the home/landing page.
 * Typically displayed in the visualizer view.
 *
 * @example
 * <HomeButton onClick={() => setShowHome(true)} />
 */

import { Home } from "lucide-react";
import "./HomeButton.css";

const HomeButton = ({ onClick, className = "" }) => {
  return (
    <button
      className={`home-button ${className}`}
      onClick={onClick}
      title="Back to Home"
      aria-label="Back to Home"
    >
      <Home size={20} />
    </button>
  );
};

export default HomeButton;
