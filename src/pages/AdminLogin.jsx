import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import { Shield, Lock, ChevronRight, User, Cpu } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await adminService.login({ email, password });
      if (data.access_token) {
        localStorage.setItem('admin_access_token', data.access_token);
        localStorage.setItem('user_role', data.user.role);
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1200); // login success animation delay
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Unauthorized access detected.');
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Background elements */}
      <div className="admin-grid-bg"></div>
      <div className="admin-glow-orb orb-1"></div>
      <div className="admin-glow-orb orb-2"></div>
      <div className="admin-glow-orb orb-3"></div>
      
      {/* Optional: scanning line effect */}
      <div className="admin-scanning-line"></div>

      <div className={`admin-login-card ${isSuccess ? 'success-state' : ''}`}>
        <div className="admin-card-border-glow"></div>
        <div className="admin-card-content">
          <div className="admin-login-header">
            <div className="shield-icon-wrapper">
              <Shield size={36} className="shield-icon" />
              <div className="shield-pulse"></div>
            </div>
            <h2 className="admin-title">Admin Portal</h2>
            <p className="admin-subtitle">Edu2Job AI Analytics & Monitoring</p>
          </div>

          {error && (
            <div className="admin-error-message">
              <span className="error-dot"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="admin-input"
                  autoComplete="off"
                />
                <label className="floating-label">Administrator Email</label>
              </div>
            </div>

            <div className="form-group">
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="admin-input"
                />
                <label className="floating-label">Security Key</label>
              </div>
            </div>

            <button 
              type="submit" 
              className={`admin-login-btn ${isSuccess ? 'btn-success' : ''}`} 
              disabled={isLoading || isSuccess}
            >
              {isLoading && !isSuccess ? (
                <span className="btn-content">Authenticating<span className="dots">...</span></span>
              ) : isSuccess ? (
                <span className="btn-content">Access Granted <Cpu size={18} className="ml-2"/></span>
              ) : (
                <span className="btn-content">
                  Secure Login
                  <ChevronRight size={18} className="btn-icon-right" />
                </span>
              )}
              <div className="btn-shine"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
