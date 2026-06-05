import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { 
  ArrowLeft, Brain, Target, Activity, CheckCircle, 
  XCircle, Zap, Star, Shield, TrendingUp
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import './AdminUserAnalytics.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export default function AdminUserAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminService.getUserDetails(id);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="admin-analytics-page skeleton-page">
        <div className="skel-header skeleton-shimmer"></div>
        <div className="skel-grid">
          <div className="skel-card skeleton-shimmer"></div>
          <div className="skel-card skeleton-shimmer"></div>
        </div>
        <div className="skel-table skeleton-shimmer"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="admin-error-card">
        <h3>Failed to load user analytics</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const { 
    user, prediction_history, missing_skills, matched_skills, 
    top_strengths, ai_summary, 
    roadmap_progress, avg_resume_score 
  } = data;

  // Prepare Chart Data
  const lineData = [...prediction_history].reverse().map(p => ({
    date: new Date(p.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
    confidence: p.confidence_score
  }));

  const roleCount = {};
  prediction_history.forEach(p => {
    roleCount[p.predicted_role] = (roleCount[p.predicted_role] || 0) + 1;
  });
  const pieData = Object.keys(roleCount).map(role => ({
    name: role,
    value: roleCount[role]
  }));



  const getConfidenceColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#3b82f6'; // Blue
    return '#f59e0b'; // Orange/Red
  };

  return (
    <div className="admin-analytics-page animate-in">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/admin/users')}>
        <ArrowLeft size={18} />
        Back to Users
      </button>

      {/* 1. User Profile & Career Readiness */}
      <div className="analytics-top-grid">
        <div className="glass-card profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p className="profile-email">{user.email}</p>
              <div className="profile-badges">
                <span className="role-badge">{user.role}</span>
                <span className="join-badge">Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-label">Total Predictions</span>
              <span className="stat-value">{user.total_predictions}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Avg Confidence</span>
              <span className="stat-value">{user.avg_confidence}%</span>
            </div>
          </div>
        </div>

        <div className="glass-card readiness-card">
          <h3>Avg Confidence</h3>
          <div className="circular-progress-container">
            <svg viewBox="0 0 36 36" className="circular-chart readiness-chart">
              <defs>
                <linearGradient id="gradientConf" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${user.avg_confidence}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="progress-value">
              <span className="number">{user.avg_confidence}</span>
              <span className="percent">%</span>
            </div>
          </div>
        </div>
        
        {/* Top Strengths & Roadmap */}
        <div className="glass-card strengths-card">
          <h3><Star size={18} className="text-yellow-400" /> Top Strengths</h3>
          <ul className="strengths-list">
            {top_strengths.map((str, i) => (
              <li key={i}><CheckCircle size={16} className="text-emerald-400"/> {str}</li>
            ))}
          </ul>
          
          <div className="roadmap-mini">
            <div className="roadmap-header">
              <span>Roadmap Progress</span>
              <span>{roadmap_progress}%</span>
            </div>
            <div className="mini-progress-bar">
              <div className="mini-progress-fill" style={{width: `${roadmap_progress}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass-card ai-summary-card">
        <div className="ai-glow"></div>
        <Brain size={24} className="ai-icon" />
        <div className="ai-content">
          <h3>AI User Summary</h3>
          <p>{ai_summary}</p>
        </div>
      </div>

      {/* 2. Charts & Trends */}
      <div className="analytics-charts-grid">
        <div className="glass-card chart-card">
          <h3>Prediction Confidence Trend</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line type="monotone" dataKey="confidence" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card chart-card">
          <h3>Role Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



      {/* 4. Prediction History */}
      <div className="glass-card history-card">
        <h3>Prediction History</h3>
        {prediction_history.length === 0 ? (
          <div className="empty-history">
            <Activity size={32} className="text-slate-600 mb-2" />
            <p>No prediction history available</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Role Predicted</th>
                  <th>Confidence Score</th>
                  <th>Top Missing Skill</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {prediction_history.map((pred) => (
                  <tr key={pred.id} className="hover-row">
                    <td className="font-medium">{pred.predicted_role}</td>
                    <td>
                      <span 
                        className="conf-badge" 
                        style={{ 
                          backgroundColor: `${getConfidenceColor(pred.confidence_score)}20`,
                          color: getConfidenceColor(pred.confidence_score),
                          border: `1px solid ${getConfidenceColor(pred.confidence_score)}40`
                        }}
                      >
                        {pred.confidence_score}% Match
                      </span>
                    </td>
                    <td>
                      <span className="miss-text">{pred.top_missing_skill}</span>
                    </td>
                    <td className="text-slate-400">
                      {new Date(pred.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
