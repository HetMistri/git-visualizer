import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "./Landing.css";

import logo from "@/assets/logo.png";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TerminalShowcase from "./components/TerminalShowcase";
import FeaturesSection from "./components/Features";
import ContributorsSection from "./components/Contributors";
import ContactSection from "./components/Contact";
import LandingFooter from "./components/Footer";

import { ScrollVelocity } from "./components/ReactBits";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Landing() {
  const velocity = 300;
  const navigate = useNavigate();

  useEffect(() => {
    // global ScrollTrigger defaults and refresh on route change
    ScrollTrigger.defaults({
      markers: false,
      toggleActions: "play none none reverse",
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      // kill triggers on unmount (route away)
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const handleLaunch = () => navigate("/visualizer");

  const handleScrollTo = (id) => {
    if (id === "top") {
      gsap.to(window, { duration: 0.8, scrollTo: 0, ease: "power2.out" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: el, offsetY: 72 },
        ease: "power2.out",
      });
    }
  };

  const items = [
    {
      label: "Explore",
      links: [
        { label: "Home", ariaLabel: "Go to top", targetId: "top" },
        {
          label: "Features",
          ariaLabel: "Jump to features",
          targetId: "features",
        },
        { label: "Demo", ariaLabel: "Jump to demo", targetId: "demo" },
      ],
    },
    {
      label: "Learn",
      links: [
        {
          label: "Architecture",
          ariaLabel: "Jump to architecture",
          targetId: "architecture",
        },
        {
          label: "Contributors",
          ariaLabel: "Jump to contributors",
          targetId: "contributors",
        },
      ],
    },
    {
      label: "Connect",
      links: [
        { label: "Contact", ariaLabel: "Jump to contact", targetId: "contact" },
        {
          label: "GitHub",
          ariaLabel: "Open GitHub",
          href: "https://github.com/omeepatel04/git-visualizer",
          external: true,
        },
      ],
    },
  ];

  return (
    <div className="landing-root">
      <div className="landing-bg" aria-hidden="true" />
      <nav className="nav">
        <Navbar
          logo={logo}
          logoAlt="Git-Vis Logo"
          items={items}
          ease="power3.out"
          onNav={(target) => handleScrollTo(target)}
          onGoVisualizer={handleLaunch}
        />
      </nav>

      <main>
        <div className="scroll-velocity">
          <ScrollVelocity
            texts={[
              "Visulize Your Git",
              "With Git-Vis",
              "Real-time Git Visualization",
            ]}
            velocity={velocity}
            className="custom-scroll-text"
          />
        </div>

        <Hero onLaunch={handleLaunch} />
        <TerminalShowcase />
        <FeaturesSection />
        {/* <DemoPreview /> */}
        {/* <ArchitectureSection /> */}
        <ContributorsSection />
        <ContactSection />
      </main>

      <LandingFooter />
    </div>
  );
}
