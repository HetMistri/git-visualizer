/**
 * Landing Page Scroll Animations
 *
 * GSAP ScrollTrigger animations for the landing page sections.
 * Handles hero entrance, floating icons, scroll-triggered reveals.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initLandingAnimations = () => {
  const ctx = gsap.context(() => {
    // Hero animations - sequential entrance
    gsap.from(".hero-title", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".hero-subtitle", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    });

    gsap.from(".hero-cta", {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      delay: 0.6,
      ease: "back.out(1.7)",
    });

    gsap.from(".hero-badges", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.8,
      ease: "power2.out",
    });

    // Floating animation for git icons
    gsap.to(".floating-icon", {
      y: -20,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });

    // Features section scroll animation
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Demo section parallax
    gsap.from(".demo-preview", {
      scrollTrigger: {
        trigger: ".demo-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "power2.out",
    });

    // Stats counter animation
    gsap.from(".stat-number", {
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top 80%",
      },
      textContent: 0,
      duration: 2,
      ease: "power1.inOut",
      snap: { textContent: 1 },
      stagger: 0.2,
    });

    // CTA section
    gsap.from(".final-cta", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
    });
  });

  return ctx;
};

// Cleanup function
export const cleanupAnimations = (ctx) => {
  if (ctx) {
    ctx.revert();
  }
};
