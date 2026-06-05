import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, User } from 'lucide-react';
import { authService } from '../services/api';
import './Login.css'; // Reusing Login CSS for identical centered layout

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.signup({ 
        email: email, 
        password: password, 
        full_name: name 
      });

      // Success
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Redirect after 1.5 seconds

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="login-logo">
            <Sparkles className="text-cyan-400" size={32} />
          </div>
          <h2 className="login-title">Create an Account</h2>
          <p className="login-subtitle">Join Edu2Job Career Intelligence</p>
        </div>

        {error && (
            <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '8px' }}>
                {error}
            </div>
        )}

        {success && (
            <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '8px' }}>
                Account created successfully! Redirecting...
            </div>
        )}

        <form onSubmit={handleSignup} className="login-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-field">
              <User className="input-icon" size={20} />
              <input 
                type="text" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading || success}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-field">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || success}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="password-header">
              <label>Password</label>
            </div>
            <div className="input-field">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading || success}
              />
            </div>
          </div>

          <button type="submit" className="btn full-width-btn" disabled={isLoading || success}>
            {isLoading ? 'Creating account...' : <><Sparkles size={20} /> Register Now</>}
          </button>
        </form>

        <div className="login-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
