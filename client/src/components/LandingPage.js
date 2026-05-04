
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">

      {/* NAVIGATION */}
      <nav className="landing-navbar">
        <div className="nav-inner">
          <div className="brand">
            <div className="brand-logo">GP</div>
            <span className="brand-name">GlobalPay SWIFT</span>
          </div>

          <div className="nav-actions">
             <Link to="/Register" className="nav-button primary">
              Register
            </Link>
            <Link to="/login" className="nav-button primary">
              Customer Login
            </Link>
            <Link to="/employee/login" className="nav-button secondary">
              Employee Console
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Enterprise SWIFT <br />
            Payment Infrastructure
          </h1>

          <p>
            Secure international transfers powered by advanced verification,
            internal compliance controls, and direct SWIFT integration.
          </p>

          <div className="hero-cta">
            <Link to="/login" className="cta-btn primary">
              Access Customer Portal
            </Link>

            <Link to="/employee/login" className="cta-btn outline">
              Employee Verification
            </Link>
          </div>
        </div>

        <div className="hero-glow"></div>
      </section>

    </div>
  );

};

export default LandingPage;
