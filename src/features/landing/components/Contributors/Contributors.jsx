import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "@/components/ui/Card";
import "./Contributors.css";

const CONTRIBUTORS = [
  {
    name: "Omee Patel",
    role: "Creator / Engineer",
    github: "https://github.com/omeepatel04",
  },
  {
    name: "Het Mistri",
    role: "Engineer",
    github: "https://github.com/hetm2004",
  },
];

export default function ContributorsSection() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".contrib-card");
      gsap.set(cards, { y: 18, autoAlpha: 0 });
      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }),
        onLeaveBack: (batch) =>
          gsap.to(batch, { y: 18, autoAlpha: 0, duration: 0.3 }),
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contributors" ref={rootRef} className="section">
      <div className="section-inner">
        <h2 className="section-title">Contributors</h2>
        <p className="section-subtitle">
          Made with ❤️ by passionate developers.
        </p>
        <div className="grid grid-3">
          {CONTRIBUTORS.map((c, idx) => (
            <a
              key={idx}
              href={c.github}
              target="_blank"
              rel="noreferrer"
              className="contrib-link"
            >
              <Card
                className="contrib-card"
                variant="glass"
                padding="large"
                hoverable
              >
                <Card.Title>{c.name}</Card.Title>
                <Card.Description>{c.role}</Card.Description>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
