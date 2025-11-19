import { useEffect, useRef } from "react";
import gsap from "gsap";
import Button from "@/components/ui/Button";
// import { StaticTestSequenceDemo } from "@/features/visualizer";
import "./Hero.css";

export default function Hero({ onLaunch }) {
  const rootRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef([]);

  const velocity = 300;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate left content
      tl.fromTo(
        titleRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          subtitleRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(
          descRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ctaRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          statsRef.current,
          { autoAlpha: 0, y: 15 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.2"
        );

      // Animate right demo window
      gsap.fromTo(
        rightRef.current,
        { autoAlpha: 0, x: 40, scale: 0.95 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const addStatRef = (el) => {
    if (el && !statsRef.current.includes(el)) {
      statsRef.current.push(el);
    }
  };

  return (
    <section id="home" ref={rootRef} className="section hero-section">
      <div className="hero-container">
        {/* Left Content */}
        <div ref={leftRef} className="hero-left">
          <div className="hero-content">
            <h1 ref={titleRef} className="hero-title">
              Git commit graphs
              <br />
              and operations in{" "}
              <span className="hero-title-highlight">real-time</span>
            </h1>

            <div ref={ctaRef} className="hero-cta-group">
              <Button
                size="large"
                onClick={onLaunch}
                className="hero-cta-primary"
              >
                Launch Visualizer
              </Button>
              <Button
                size="large"
                variant="secondary"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hero-cta-secondary"
              >
                Learn More
              </Button>
            </div>

            <div className="hero-stats">
              <div ref={addStatRef} className="hero-stat">
                <div className="hero-stat-value">Real-time</div>
                <div className="hero-stat-label">Visualization</div>
              </div>
              <div ref={addStatRef} className="hero-stat">
                <div className="hero-stat-value">Interactive</div>
                <div className="hero-stat-label">Learning</div>
              </div>
              <div ref={addStatRef} className="hero-stat">
                <div className="hero-stat-value">Open Source</div>
                <div className="hero-stat-label">MIT License</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Demo Window */}
        <div ref={rightRef} className="hero-right">
          <div className="hero-demo-window">
            <div className="demo-window-header">
              <div className="demo-window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="demo-window-title">Git Workflow</div>
            </div>
            <div className="demo-window-content">
              {/* <StaticTestSequenceDemo key="hero-test-sequence-demo" /> */}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Ambient background effects */}
      <div className="ambient">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>
    </section>
  );
}
