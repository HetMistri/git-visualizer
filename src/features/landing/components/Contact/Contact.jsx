import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const rootRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = rootRef.current;
      gsap.set(el, {
        background:
          "linear-gradient(180deg, rgba(102,126,234,0.08), transparent)",
      });
      gsap.fromTo(
        ".contact-card",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just link to GitHub issues.
    window.open(
      "https://github.com/omeepatel04/git-visualizer/issues",
      "_blank"
    );
    setSent(true);
  };

  return (
    <section id="contact" ref={rootRef} className="section">
      <div className="section-inner">
        <h2 className="section-title">Get in touch</h2>
        <p className="section-subtitle">
          Send a note or open an issue — we’d love to hear from you.
        </p>

        <form className="contact-card glass" onSubmit={handleSubmit}>
          <div className="contact-grid">
            <Input
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Ada Lovelace"
              fullWidth
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="ada@example.com"
              fullWidth
              required
            />
          </div>
          <Input.Textarea
            label="Message"
            value={message}
            onChange={setMessage}
            rows={5}
            placeholder="Tell us how you'd use Git-Vis…"
            fullWidth
          />
          <div className="contact-actions">
            <Button type="submit">Open GitHub Issues</Button>
            {sent && (
              <span className="contact-hint">Opened issues in a new tab.</span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
