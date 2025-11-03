import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TerminalShowcase.css";

gsap.registerPlugin(ScrollTrigger);

export default function TerminalShowcase() {
  const sectionRef = useRef(null);
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Commands to demonstrate
    const commands = [
      {
        cmd: "git commit -m 'Initial commit'",
        output: "✓ Commit created successfully",
      },
      { cmd: "git branch feature", output: "✓ Branch 'feature' created" },
      { cmd: "git checkout feature", output: "✓ Switched to branch 'feature'" },
      {
        cmd: "git commit -m 'Add new feature'",
        output: "✓ Commit created successfully",
      },
      { cmd: "git checkout main", output: "✓ Switched to branch 'main'" },
      { cmd: "git merge feature", output: "✓ Merge completed successfully" },
    ];

    let delay = 1000;

    commands.forEach((command, index) => {
      // Type the command
      setTimeout(() => {
        setCurrentCommand(command.cmd);
      }, delay);

      // Show output and add to history
      setTimeout(() => {
        setTerminalLines((prev) => [
          ...prev,
          { type: "command", text: command.cmd },
          { type: "output", text: command.output },
        ]);
        setCurrentCommand("");
      }, delay + 800);

      delay += 1600;
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".terminal-showcase-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".terminal-showcase-terminal", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power2.out",
        delay: 0.2,
      });

      gsap.from(".terminal-showcase-cta", {
        scrollTrigger: {
          trigger: ".terminal-showcase-cta",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="terminal-showcase"
      ref={sectionRef}
      className="terminal-showcase-section"
    >
      <div className="terminal-showcase-container">
        <div className="terminal-showcase-terminal">
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red"></span>
              <span className="terminal-dot terminal-dot-yellow"></span>
              <span className="terminal-dot terminal-dot-green"></span>
            </div>
            <div className="terminal-body">
              {terminalLines.map((line, index) => (
                <div
                  key={index}
                  className={`terminal-line terminal-${line.type}`}
                >
                  {line.type === "command" && (
                    <span className="terminal-prompt">$</span>
                  )}
                  <span className="terminal-text">{line.text}</span>
                </div>
              ))}
              {currentCommand && (
                <div className="terminal-line terminal-command terminal-typing">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-text">{currentCommand}</span>
                  <span className="terminal-cursor">|</span>
                </div>
              )}
              {!currentCommand && terminalLines.length === 0 && (
                <div className="terminal-line terminal-command">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-text"></span>
                  <span className="terminal-cursor">|</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
