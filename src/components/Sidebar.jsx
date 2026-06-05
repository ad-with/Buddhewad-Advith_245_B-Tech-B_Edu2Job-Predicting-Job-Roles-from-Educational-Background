import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeMenu, 
  setActiveMenu, 
  onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'prediction', label: 'Job Prediction', icon: '🎯', path: '/dashboard/job-prediction' },
    { id: 'resume', label: 'Resume Analyzer', icon: '📄', path: '/dashboard/resume' },
    { id: 'skills', label: 'Skill Gap Analysis', icon: '🎓', path: '/dashboard/skill-gap' },
    { id: 'trends', label: 'Job Market Trends', icon: '📈', path: '/dashboard/trends' },
    { id: 'roadmap', label: 'Career Roadmap', icon: '🗺️', path: '/dashboard/career-roadmap' },
    { id: 'courses', label: 'Courses', icon: '📚', path: '/dashboard/courses' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">Edu2Job</div>
        <button 
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveMenu(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {sidebarOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <span className="nav-icon">🚪</span>
        {sidebarOpen && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
