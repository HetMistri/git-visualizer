import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import "./Navbar.css";

const Navbar = ({
  logo,
  logoAlt = "Logo",
  items = [],
  className = "",
  ease = "power3.out",
  onNav,
  onGoVisualizer,
}) => {
  const navigate = useNavigate();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        // force layout to measure
        // eslint-disable-next-line no-unused-expressions
        contentEl.offsetHeight;

        const topBar = 64;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 64, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    setIsHamburgerOpen(false);
    tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
    tl.reverse();
  };

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      closeMenu();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  const handleLinkClick = (lnk) => (e) => {
    if (lnk?.onClick) return; // allow custom handler upstream if passed
    e.preventDefault();
    
    // Handle scroll targets (internal page sections)
    if (lnk?.targetId && typeof onNav === "function") {
      onNav(lnk.targetId);
      closeMenu();
      return;
    }
    
    // Handle hash links
    if (
      typeof lnk?.href === "string" &&
      lnk.href.startsWith("#") &&
      typeof onNav === "function"
    ) {
      onNav(lnk.href.slice(1));
      closeMenu();
      return;
    }
    
    // Handle external links
    if (typeof lnk?.href === "string" && /^https?:\/\//.test(lnk.href)) {
      window.open(lnk.href, "_blank", "noopener noreferrer");
      closeMenu();
      return;
    }
    
    // Handle internal routes (React Router)
    if (typeof lnk?.href === "string" && lnk.href.startsWith("/")) {
      navigate(lnk.href);
      closeMenu();
      return;
    }
    
    // Fallback for other hrefs
    if (typeof lnk?.href === "string") {
      window.location.href = lnk.href;
      closeMenu();
    }
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? "open" : ""}`}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div
            className="logo-container"
            onClick={() => onNav?.("top")}
            role="button"
            aria-label="Go to top"
            tabIndex={0}
          >
            <img src={logo} alt={logoAlt} className="logo" />
          </div>

          <button
            type="button"
            className="card-nav-cta-button"
            onClick={() =>
              typeof onGoVisualizer === "function"
                ? onGoVisualizer()
                : onNav?.("top")
            }
          >
            Get Started
          </button>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    href={lnk.href || "#"}
                    aria-label={lnk.ariaLabel || lnk.label}
                    onClick={handleLinkClick(lnk)}
                  >
                    <GoArrowUpRight
                      className="nav-card-link-icon"
                      aria-hidden="true"
                    />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
