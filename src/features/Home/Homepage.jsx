import "./Homepage.css";
import {
  Navbar,
  TextPressure,
  LiquidEther,
  ScrollVelocity,
} from "./components";
import { Button } from "../../components/ui";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Visualize", href: "/visualizer" },
  { label: "GitHub", href: "https://github.com/omeepatel04/git-visualizer" },
  { label: "Documentation", href: "/documentation" },
];

const velocity = 100;

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="landing">
        <div className="background liquid-bg" aria-hidden="true">
          <LiquidEther
            /* Derive palette from CSS variables automatically */
            useThemeColors={true}
            mouseForce={18}
            cursorSize={120}
            isViscous={true}
            viscous={28}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.6}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.45}
            autoIntensity={2.0}
            takeoverDuration={0.25}
            autoResumeDelay={1500}
            autoRampDuration={0.6}
          />
        </div>
        <nav className="home-nav">
          <Navbar
            logo={logo}
            logoAlt="Company Logo"
            items={navItems}
            activeHref="/"
            className="custom-nav"
            ease="power2.easeOut"
          />
        </nav>
        <div className="landing-container">
          <div className="landing-text">
            <ScrollVelocity
              texts={["Git Visualizer", "Scroll Down"]}
              velocity={velocity}
              className="custom-scroll-text"
            />
          </div>
        </div>

        <div className="container"></div>
      </div>
    </div>
  );
}

export default HomePage;
