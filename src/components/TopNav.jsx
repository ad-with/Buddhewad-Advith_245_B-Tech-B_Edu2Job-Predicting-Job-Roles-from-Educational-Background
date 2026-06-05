import React, { useState, useEffect, useRef } from 'react';
import './TopNav.css';

const TopNav = ({ userName, onLogout }) => {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Shadow/Height effect
      setIsScrolled(currentScrollY > 20);

      // Hide/Show logic
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setProfileDropdown(false);
    onLogout();
  };

  return (
    <header className={`dashboard-header ${!isVisible ? 'nav-hidden' : 'nav-visible'} ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="header-left">
        <h1>Edu2Job Dashboard</h1>
      </div>
      
      <div className="header-right">
        <button className="header-icon" title="Notifications">
          <span>🔔</span>
        </button>
        <button className="header-icon" title="Settings">
          <span>⚙️</span>
        </button>
        <div className="profile-dropdown-wrapper">
          <button 
            className="header-icon profile-btn"
            onClick={() => setProfileDropdown(!profileDropdown)}
            title="Profile"
          >
            👤
          </button>
          {profileDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item profile-info">
                <strong>{userName}</strong>
              </div>
              <button className="dropdown-item">
                <span>👤</span> Account Settings
              </button>
              <button 
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <span>🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
