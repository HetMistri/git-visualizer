import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Features.css";
import commitDemoImg from "@/assets/demo/commit.png";
import branchingDemoImg from "@/assets/demo/branching.png";
import mergeDemoImg from "@/assets/demo/merge.png";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    id: "commits",
    title: "Ready out-of-the-box",
    subtitle: "Watch Commits Appear in Real-Time",
    description:
      "The things you need are already there: dragging nodes, zooming, panning, selecting multiple nodes, and adding/removing elements are all built-in. See commits materialize on the DAG with animated edges and smooth transitions.",
    image: commitDemoImg,
    align: "left", // text left, demo right
  },
  {
    id: "branching",
    title: "Powered by us. Designed by you.",
    subtitle: "Branch Management Made Visual",
    description:
      "Git-Vis nodes are simply React components, ready for your interactive elements. Create, checkout, and manage color-coded branches. We play nice with Tailwind and plain old CSS.",
    image: branchingDemoImg,
    align: "right", // text right, demo left
  },
  {
    id: "merging",
    title: "All the right plugins",
    subtitle: "Merge & DAG Structure",
    description:
      "Make more advanced apps with Background, Minimap, Controls, Panel, NodeToolbar, and NodeResizer components. Visualize two-parent merges with smooth edge paths and understand complex Git histories.",
    image: mergeDemoImg,
    align: "left", // text left, demo right
  },
];

export default function FeaturesSection() {
  const rootRef = useRef(null);
  const connectorRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate feature rows
      const rows = gsap.utils.toArray(".feature-row");
      rows.forEach((row, i) => {
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
          autoAlpha: 0,
          y: 60,
          duration: 0.8,
          ease: "power2.out",
        });
      });

      // Animate connector lines
      connectorRefs.current.forEach((connector, i) => {
        if (connector) {
          const path = connector.querySelector("path");
          if (path) {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            gsap.to(path, {
              scrollTrigger: {
                trigger: connector,
                start: "top 80%",
                end: "top 30%",
                scrub: 1,
              },
              strokeDashoffset: 0,
              ease: "none",
            });
          }
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={rootRef} className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-main-title">Why Git-Vis?</h2>
          <p className="features-main-subtitle">
            A modern, animated way to learn and teach Git
          </p>
        </div>

        <div className="features-content">
          {FEATURES.map((feature, index) => {
            const isLeft = feature.align === "left";

            return (
              <div key={feature.id}>
                <div
                  className={`feature-row ${
                    isLeft ? "feature-left" : "feature-right"
                  }`}
                >
                  <div className="feature-text">
                    <h3 className="feature-title">{feature.title}</h3>
                    <h4 className="feature-subtitle">{feature.subtitle}</h4>
                    <p className="feature-description">{feature.description}</p>
                    <button className="feature-button">Learn more</button>
                  </div>

                  <div className="feature-demo">
                    <div className="feature-demo-window">
                      <div className="feature-demo-header">
                        <div className="feature-demo-dots">
                          <span className="dot dot-red"></span>
                          <span className="dot dot-yellow"></span>
                          <span className="dot dot-green"></span>
                        </div>
                      </div>
                      <div className="feature-demo-content">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="feature-demo-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector SVG between features */}
                {/* {index < FEATURES.length - 1 && (
                  <svg
                    ref={(el) => (connectorRefs.current[index] = el)}
                    className={`feature-connector ${
                      isLeft
                        ? "connector-left-to-right"
                        : "connector-right-to-left"
                    }`}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={isLeft ? "M 95 5 Q 95 50 5 95" : "M 5 5 Q 5 50 95 95"}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                    />
                    <circle
                      cx={isLeft ? "95" : "5"}
                      cy="5"
                      r="1.5"
                      fill="var(--color-primary)"
                    />
                    <circle
                      cx={isLeft ? "5" : "95"}
                      cy="95"
                      r="1.5"
                      fill="var(--color-primary)"
                    />
                  </svg>
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
