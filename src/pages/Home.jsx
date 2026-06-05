import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <div className="logo">Edu2Job</div>

          </div>
          <div className="navbar-right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" />
              </svg>
            </div>
            <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
            <button className="btn-signup" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">AI CAREER EVOLUTION ENGINE</span>
          </div>
          <h1 className="hero-title">
            Bridge the gap between <span className="text-blue">Education</span> and <span className="text-teal">Success</span>.
          </h1>
          <p className="hero-subtitle">
            Predictive intelligence that maps your skills to real-time global market demands. Transform your career trajectory with AI-powered insights designed for you.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/signup")}>Get Started Free</button>

          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* Features Section */}
      <section className="features">
        <div className="features-header">
          <h2 className="section-title">Engineered for your trajectory</h2>
          <p className="section-subtitle">
            Everything you need to transform your career potential into reality with AI-powered tools and insights
          </p>
        </div>

        <div className="features-grid">

          {/* AI Career Prediction */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 3a4 4 0 0 0-4 4v1a4 4 0 0 0 4 4h1v2H9a4 4 0 0 0-4 4v1" />
                <path d="M15 3a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-1v2h1a4 4 0 0 1 4 4v1" />
                <circle cx="9" cy="9" r="1" />
                <circle cx="15" cy="9" r="1" />
              </svg>
            </div>
            <h3 className="feature-title">AI Career Prediction</h3>
            <p className="feature-description">
              Get personalized career recommendations powered by advanced AI that understands your unique goals.
            </p>
          </div>

          {/* Skill Gap Analysis */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 20V10" />
                <path d="M10 20V4" />
                <path d="M16 20v-6" />
                <path d="M22 20H2" />
              </svg>
            </div>
            <h3 className="feature-title">Skill Gap Analysis</h3>
            <p className="feature-description">
              Identify exactly what skills you need to acquire to reach your career goals.
            </p>
          </div>

          {/* Market Insights */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l6-6 4 4 8-8" />
                <path d="M14 7h7v7" />
              </svg>
            </div>
            <h3 className="feature-title">Market Insights</h3>
            <p className="feature-description">
              Stay ahead with real-time data on trending skills and emerging job opportunities.
            </p>
          </div>

          {/* Curated Learning Paths */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2" />
              </svg>
            </div>
            <h3 className="feature-title">Curated Learning Paths</h3>
            <p className="feature-description">
              Follow personalized learning roadmaps designed to accelerate your professional growth.
            </p>
          </div>

        </div>
      </section>
      {/* Mid Section */}
      <section className="mid-section">
        <div className="mid-content">
          <div className="mid-left">
            <h2 className="mid-title">Empowering the next generation of leaders</h2>
            <p className="mid-description">
              Join thousands of professionals who have transformed their careers using AI-powered insights and personalized guidance. Our platform combines cutting-edge machine learning with human-centered career coaching to accelerate your success.
            </p>
            <div className="mid-stats">
              <div className="stat-item">
                <p className="stat-number">10K+</p>
                <p className="stat-label">Career Transformations</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <p className="stat-number">95%</p>
                <p className="stat-label">Success Rate</p>
              </div>
            </div>
          </div>
          <div className="mid-right">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "Edu2Job transformed how I approach my career. The AI insights helped me identify skills I needed to develop, and the personalized learning paths made the journey smooth and achievable."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SK</div>
                <div className="author-info">
                  <p className="author-name">Sarah Kim</p>
                  <p className="author-title">Senior Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to curate your future career?</h2>
          <p className="cta-subtitle">
            Start your AI-powered career transformation today and unlock your full potential.
          </p>
          <div className="cta-stats">
            <div className="cta-stat">
              <p className="cta-stat-number">500K+</p>
              <p className="cta-stat-label">Insights Generated</p>
            </div>
            <div className="cta-stat">
              <p className="cta-stat-number">150+</p>
              <p className="cta-stat-label">Career Paths</p>
            </div>
            <div className="cta-stat">
              <p className="cta-stat-number">24/7</p>
              <p className="cta-stat-label">AI Support</p>
            </div>
          </div>
          <div className="cta-buttons">
            <button className="btn btn-primary">Create Your Roadmap</button>
            <button className="btn btn-outline">View API Docs</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Edu2Job</h4>
            <p className="footer-description">
              Transform your career with AI-powered guidance and real-time market insights.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#api">API</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Edu2Job. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
