import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Architecture.css";

export default function ArchitectureSection() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".arch-item");
      gsap.set(items, { y: 20, autoAlpha: 0 });
      ScrollTrigger.batch(items, {
        start: "top 80%",
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }),
        onLeaveBack: (batch) =>
          gsap.to(batch, { y: 20, autoAlpha: 0, duration: 0.3 }),
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="architecture" ref={rootRef} className="section">
      <div className="section-inner">
        <h2 className="section-title">Feature-based Architecture</h2>
        <p className="section-subtitle">
          Modular surfaces, reusable UI, and a clean state facade for Git
          operations.
        </p>

        <div className="arch-grid">
          <div className="arch-item glass">
            <div className="arch-title">src/features/visualizer</div>
            <div className="arch-desc">
              Core Git model (GitGraph), ReactFlow graph UI, toolbar, terminal,
              and modals.
            </div>
          </div>
          <div className="arch-item glass">
            <div className="arch-title">hooks/useGitGraph</div>
            <div className="arch-desc">
              Facade over GitGraph with error handling, operations, and derived
              helpers.
            </div>
          </div>
          <div className="arch-item glass">
            <div className="arch-title">utils/graphLayout</div>
            <div className="arch-desc">
              Level and lane assignment, deterministic branch colors, and edges.
            </div>
          </div>
          <div className="arch-item glass">
            <div className="arch-title">components/ui</div>
            <div className="arch-desc">
              Atomic UI: Button, Card, Modal, Input — used consistently across
              pages.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
