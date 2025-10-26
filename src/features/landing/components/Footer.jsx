/**
 * Footer Component
 *
 * Landing page footer with credits and external links.
 */

const Footer = () => {
  return (
    <footer className="home-footer">
      <p>
        Built with ❤️ using React Flow & GSAP
        <br />
        <span className="footer-links">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {" · "}
          <a
            href="https://reactflow.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Flow
          </a>
          {" · "}
          <a href="https://gsap.com" target="_blank" rel="noopener noreferrer">
            GSAP
          </a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
