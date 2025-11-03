import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./DemoPreview.css";

export default function DemoPreview() {
  const rootRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.8,
        },
      });
      tl.fromTo(
        boxRef.current,
        { scale: 0.9, autoAlpha: 0 },
        { scale: 1.06, autoAlpha: 1, ease: "none" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="demo" ref={rootRef} className="section demo-section">
      <div className="section-inner">
        <div ref={boxRef} className="demo-box glass">
          <div className="demo-head">Live Demo Preview</div>
          <div className="demo-body">
            {/* Replace with real GIF/screenshot later */}
            <div className="demo-placeholder">DAG Preview</div>
          </div>
        </div>
      </div>
    </section>
  );
}
