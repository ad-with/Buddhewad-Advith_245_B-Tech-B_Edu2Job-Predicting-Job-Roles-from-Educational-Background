import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Activity, BarChart2, 
  TrendingUp, Zap, LogOut, Search, Bell, User, ChevronDown
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('user_role');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Predictions', icon: Activity, path: '/admin/predictions' },
    { name: 'Analytics', icon: BarChart2, path: '/admin/analytics' },
    { name: 'Trends', icon: TrendingUp, path: '/admin/trends' },
  ];

  const pageTitle = navItems.find(item => item.path === location.pathname)?.name || 'Command Center';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">E2J</div>
            <span className="admin-logo-text">Admin Portal</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.name} 
                to={item.path} 
                className={({ isActive }) => `admin-nav-item ${isActive && item.path === '/admin/dashboard' ? 'active' : ''}`}
                end={item.path === '/admin/dashboard'}
              >
                <div className="admin-nav-icon-wrapper">
                  <Icon size={20} className="admin-nav-icon" />
                </div>
                <span className="admin-nav-text">{item.name}</span>
                <div className="admin-nav-active-glow"></div>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <div className="admin-logout-icon-wrapper">
              <LogOut size={20} />
            </div>
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Top Navbar */}
        <header className="admin-top-navbar">
          <div className="admin-top-left">
            <button 
              className="admin-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </button>
            <h1 className="admin-page-title">{pageTitle}</h1>
          </div>
          
          <div className="admin-top-right">
            <div className="admin-search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search analytics..." />
              <div className="search-border-glow"></div>
            </div>
            
            <div className="admin-profile-dropdown">
              <div className="admin-profile-avatar">
                <User size={18} />
              </div>
              <div className="admin-profile-info">
                <span className="admin-profile-name">Super Admin</span>
                <span className="admin-profile-role">System Ops</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-main-content">
          <div className="admin-content-bg-glow glow-1"></div>
          <div className="admin-content-bg-glow glow-2"></div>
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}
