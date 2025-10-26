/**
 * Landing Page Component
 *
 * Main landing/home page that composes all sub-components.
 * Handles GSAP scroll animations and overall page structure.
 *
 * @param {Function} onLaunch - Callback to navigate to the visualizer
 */

import { useEffect, useRef } from "react";
import {
  initLandingAnimations,
  cleanupAnimations,
} from "./animations/scrollAnimations";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Demo from "./components/Demo";
import Stats from "./components/Stats";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import "./Landing.css";

const Landing = ({ onLaunch }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize all GSAP scroll animations
    const animationContext = initLandingAnimations();

    // Cleanup on unmount
    return () => cleanupAnimations(animationContext);
  }, []);

  return (
    <div className="landing-container" ref={containerRef}>
      <Hero onLaunch={onLaunch} />
      <Features />
      <Demo />
      <Stats />
      <CTA onLaunch={onLaunch} />
      <Footer />
    </div>
  );
};

export default Landing;
