import { useEffect, useRef } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorCircleRef = useRef(null);
  const rafRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const pos = useRef({
    x: window?.innerWidth / 2 || 0,
    y: window?.innerHeight / 2 || 0,
  });

  useEffect(() => {
    const dot = cursorDotRef.current;
    const circle = cursorCircleRef.current;
    if (!dot || !circle) return;

    // Don't enable on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) {
      dot.style.display = "none";
      circle.style.display = "none";
      return;
    }

    // Only hide native cursor on pointer-capable devices (desktop)
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) document.body.classList.add("has-custom-cursor");

    let prefersReduced = false;
    try {
      prefersReduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      prefersReduced = false;
    }

    // Move inner dot immediately to pointer, outer circle trails with easing
    function onMove(e) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // inner dot snaps to pointer (exact)
      dot.style.left = `${mouse.current.x}px`;
      dot.style.top = `${mouse.current.y}px`;

      // check for custom color on target or ancestors
      const el =
        e.target && e.target.closest
          ? e.target.closest(
              "[data-cursor-color], a, button, [data-cursor-interactive]"
            )
          : null;
      const color = el ? el.getAttribute("data-cursor-color") : null;
      if (color) {
        dot.style.background = color;
        circle.style.borderColor = color;
      } else {
        dot.style.background = "var(--cursor-dot, rgba(16,24,40,0.9))";
        circle.style.borderColor = "var(--cursor-border, rgba(16,24,40,0.65))";
      }

      // interactive scaling
      const interactive =
        e.target &&
        e.target.closest &&
        !!e.target.closest(
          "a,button,input,textarea,select,summary,[role=button],[data-cursor-interactive]"
        );
      dot.classList.toggle("cursor__dot--interactive", interactive);
      circle.classList.toggle("cursor--interactive", interactive);

      // if user prefers reduced motion, jump outer to pointer too
      if (prefersReduced) {
        circle.style.left = `${mouse.current.x}px`;
        circle.style.top = `${mouse.current.y}px`;
      }
    }

    // animation loop for trailing outer circle
    function loop() {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;
      circle.style.left = `${pos.current.x}px`;
      circle.style.top = `${pos.current.y}px`;
      rafRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (canHover) document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className="cursor__dot" aria-hidden="true" />
      <div
        ref={cursorCircleRef}
        className="custom-cursor cursor-outer"
        aria-hidden="true"
      />
    </>
  );
}
