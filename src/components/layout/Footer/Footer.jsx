import "./Footer.css";
import logo from "../../../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="Git-Vis Logo" className="footer-logo-img" />
            <span className="footer-logo-text">Git-Vis</span>
          </div>
          <p className="footer-tagline">
            Interactive Git Visualization Platform
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/" className="footer-link">
                Home
              </a>
            </li>
            <li>
              <a href="/visualizer" className="footer-link">
                Visualizer
              </a>
            </li>
            <li>
              <a
                href="https://git-scm.com/docs"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
            </li>
            <li>
              <a
                href="https://github.com/omeepatel04/git-visualizer"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repo
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h3 className="footer-heading">Resources</h3>
          <ul className="footer-links">
            <li>
              <a href="#tutorials" className="footer-link">
                Tutorials
              </a>
            </li>
            <li>
              <a href="#about" className="footer-link">
                About
              </a>
            </li>
            <li>
              <a href="#changelog" className="footer-link">
                Changelog
              </a>
            </li>
            <li>
              <a href="#license" className="footer-link">
                License
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>
          <ul className="footer-links">
            <li>
              <a href="mailto:support@gitvis.dev" className="footer-link">
                support@gitvis.dev
              </a>
            </li>
            <li>
              <a
                href="https://github.com/omeepatel04"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                @omeepatel04
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} Git-Vis. Open-source and built with ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;
