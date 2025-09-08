import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaEnvelope } from "react-icons/fa";
import "../styles/Home.css";
import NavBar from "../components/NavBar"; // Import Navbar

function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({ duration: 1000 });
    }
  }, []);

  return (
    <div className="home-container">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content" data-aos="fade-up">
          <h1>TalentHive</h1>
          <div className="line"></div>
          <p>Find the best freelancers for your projects.</p>
          <Link to="/login" className="cta-button">Get Started</Link>
        </div>
      </div>

      {/* Floating Contact Button */}
      <div className="floating-button">
        <a href="mailto:support@talenttrend.com">
          <FaEnvelope />
        </a>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">⚡️ TalentHive</div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} TalentHive. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
