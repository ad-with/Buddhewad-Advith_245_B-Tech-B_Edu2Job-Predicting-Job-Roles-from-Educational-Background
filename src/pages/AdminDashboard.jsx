import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { 
  Users, Activity, Target, Zap, 
  TrendingUp, TrendingDown, Minus, Sparkles
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import './AdminDashboard.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

// Simple sparkline for top cards
const Sparkline = ({ data, color, fillId }) => (
  <div className="sparkline-wrapper">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#${fillId})`} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [roles, setRoles] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [skills, setSkills] = useState(null);
  const [trends, setTrends] = useState([]);
  const [insights, setInsights] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, rolesData, growthData, skillsData, trendsData, insightsData, usersData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRoleAnalytics(),
        adminService.getPredictionGrowth(),
        adminService.getSkillsAnalytics(),
        adminService.getCareerTrends(),
        adminService.getAiInsights(),
        adminService.getUsersList()
      ]);
      
      setStats(statsData);
      setRoles(rolesData);
      setGrowth(growthData);
      setSkills(skillsData);
      setTrends(trendsData);
      setInsights(insightsData);
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching admin data", err);
      setError("Failed to establish secure handshake with MongoDB analytics engine. Please verify the backend server is running and the database connection is healthy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const handleRetry = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="admin-dashboard animate-in">
        {/* Top Cards Shimmer Skeletons */}
        <div className="admin-stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="admin-stat-card glass-card skeleton-shimmer">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div className="skeleton-text skeleton-title"></div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}></div>
              </div>
              <div className="skeleton-text skeleton-value"></div>
              <div className="skeleton-text skeleton-trend" style={{ marginTop: '0.5rem' }}></div>
            </div>
          ))}
        </div>

        {/* Charts Grid Shimmer Skeletons */}
        <div className="admin-charts-grid">
          <div className="admin-chart-card glass-card col-span-2 skeleton-shimmer" style={{ height: '18rem' }}>
            <div className="skeleton-text skeleton-title" style={{ marginBottom: '1.5rem' }}></div>
            <div className="skeleton-chart" style={{ height: '80%' }}></div>
          </div>
          <div className="admin-chart-card glass-card col-span-1 skeleton-shimmer" style={{ height: '18rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton-text skeleton-title" style={{ marginBottom: '1.5rem', width: '80%' }}></div>
            <div className="skeleton-chart" style={{ borderRadius: '50%', width: '130px', height: '130px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-card animate-in">
        <h3>Database Synchronization Offline</h3>
        <p>{error}</p>
        <button className="admin-retry-btn" onClick={handleRetry}>
          Re-establish Connection
        </button>
      </div>
    );
  }

  // Handle Empty State
  const isEmpty = stats && stats.total_users === 0 && stats.total_predictions === 0;
  if (isEmpty) {
    return (
      <div className="admin-dashboard animate-in">
        <div className="admin-empty-state">
          <h4>No Analytics Data Available Yet</h4>
          <p>Once users start registering and performing career predictions, live MongoDB metrics will populate this dashboard.</p>
          <button className="admin-retry-btn" onClick={handleRetry} style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
            Refresh Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Generate dynamic sparklines based on real prediction growth data
  const baseSpark = [{value: 3}, {value: 5}, {value: 4}, {value: 7}, {value: 10}];
  const sparkUser = growth && growth.length > 0 ? growth.map(g => ({ value: Math.max(1, Math.round(g.predictions * 0.45)) })) : baseSpark;
  const sparkPred = growth && growth.length > 0 ? growth.map(g => ({ value: g.predictions })) : baseSpark;

  // Format missing skills for bar chart
  const barData = skills?.missing_skills?.slice(0, 5).map(item => ({
    name: item.skill,
    users: item.missing_count
  })) || [];

  return (
    <div className={`admin-dashboard ${mounted ? 'animate-in' : ''}`}>
      
      {/* Top Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass-card">
          <div className="admin-stat-header">
            <h3>Total Users</h3>
            <div className="admin-stat-icon-wrapper users-bg">
              <Users size={18} className="users-icon" />
            </div>
          </div>
          <div className="admin-stat-content">
            <div>
              <div className="admin-stat-value">{stats?.total_users || 0}</div>
              <div className="admin-stat-trend positive">
                <TrendingUp size={14} /> <span>+{stats?.user_growth || 0}% vs last month</span>
              </div>
            </div>
            <Sparkline data={sparkUser} color="#3b82f6" fillId="spark1" />
          </div>
        </div>

        <div className="admin-stat-card glass-card">
          <div className="admin-stat-header">
            <h3>Total Predictions</h3>
            <div className="admin-stat-icon-wrapper preds-bg">
              <Activity size={18} className="preds-icon" />
            </div>
          </div>
          <div className="admin-stat-content">
            <div>
              <div className="admin-stat-value">{stats?.total_predictions || 0}</div>
              <div className="admin-stat-trend positive">
                <TrendingUp size={14} /> <span>+{stats?.prediction_growth || 0}% vs last month</span>
              </div>
            </div>
            <Sparkline data={sparkPred} color="#8b5cf6" fillId="spark2" />
          </div>
        </div>

        <div className="admin-stat-card glass-card">
          <div className="admin-stat-header">
            <h3>Top Predicted Role</h3>
            <div className="admin-stat-icon-wrapper role-bg">
              <Target size={18} className="role-icon" />
            </div>
          </div>
          <div className="admin-stat-content role-content">
            <div className="admin-stat-value text-md">{stats?.top_role || 'N/A'}</div>
            <div className="admin-stat-trend highlight">
              <Zap size={14} /> <span>High market demand</span>
            </div>
          </div>
        </div>

        <div className="admin-stat-card glass-card">
          <div className="admin-stat-header">
            <h3>Avg Confidence</h3>
            <div className="admin-stat-icon-wrapper conf-bg">
              <Zap size={18} className="conf-icon" />
            </div>
          </div>
          <div className="admin-stat-content">
            <div>
              <div className="admin-stat-value">{stats?.avg_confidence || 0}%</div>
              <div className="admin-stat-trend positive">
                <TrendingUp size={14} /> <span>+2% improvement</span>
              </div>
            </div>
            <div className="confidence-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                  strokeDasharray={`${stats?.avg_confidence || 0}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="admin-charts-grid">
        {/* Prediction Growth Area Chart */}
        <div className="admin-chart-card glass-card col-span-2">
          <div className="chart-header">
            <h3 className="admin-card-title">Prediction Trajectory</h3>
            <div className="chart-badge">Live Data</div>
          </div>
          <div className="admin-chart-container h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredsMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="predictions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPredsMain)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Distribution Pie Chart */}
        <div className="admin-chart-card glass-card col-span-1">
          <h3 className="admin-card-title">Market Distribution</h3>
          <div className="admin-chart-container h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roles.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="role"
                  stroke="none"
                  animationDuration={1500}
                >
                  {roles.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0px 0px 6px ${COLORS[index % COLORS.length]}80)` }} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="admin-chart-legend">
            {roles.slice(0, 4).map((r, i) => (
              <div key={i} className="admin-legend-item">
                <div className="admin-legend-color" style={{ backgroundColor: COLORS[i], boxShadow: `0 0 8px ${COLORS[i]}` }}></div>
                <span className="admin-legend-text">{r.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap & Missing Skills Grid */}
      <div className="admin-bottom-grid">
        
        {/* Missing Skills Bar Chart */}
        <div className="admin-chart-card glass-card col-span-1">
          <h3 className="admin-card-title">Missing Skills Gap</h3>
          <div className="admin-chart-container h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" axisLine={false} tickLine={false} width={80} tick={{fill: '#e2e8f0', fontSize: 13, fontWeight: 500}} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="users" fill="#8b5cf6" radius={[0, 4, 4, 0]} animationDuration={1500} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorBar${index})`} />
                  ))}
                </Bar>
                <defs>
                  {barData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`colorBar${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6}/>
                      <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1}/>
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="admin-chart-card ai-insights-panel col-span-1">
          <div className="ai-panel-glow"></div>
          <h3 className="admin-card-title flex items-center gap-2 ai-title">
            <Sparkles size={20} className="text-purple-400" /> 
            AI Intelligence
          </h3>
          <div className="admin-insights-list">
            {insights.map((insight, i) => {
              // Highlight keywords loosely
              const highlighted = insight.replace(
                /(Frontend|DevOps|Cloud|TypeScript|React|growth)/gi, 
                '<span class="highlight-word">$&</span>'
              );
              return (
                <div key={i} className="admin-insight-item">
                  <div className="admin-insight-bullet">
                    <div className="bullet-core"></div>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: highlighted }}></p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Career Trend Heatmap */}
        <div className="admin-chart-card glass-card col-span-1">
          <h3 className="admin-card-title">Career Velocity</h3>
          <div className="admin-velocity-container">
            {trends.slice(0,4).map((trend, i) => (
              <div key={i} className={`velocity-card intensity-${trend.intensity}`}>
                <div className="velocity-glow"></div>
                <div className="velocity-info">
                  <span className="velocity-role">{trend.role}</span>
                  <span className="velocity-status">{trend.status}</span>
                </div>
                <div className="velocity-indicator">
                  <div className="ping-dot"></div>
                </div>
              </div>
            ))}
            {trends.length === 0 && <p className="text-slate-500" style={{color: '#64748b'}}>No trend data available.</p>}
          </div>
        </div>

      </div>


    </div>
  );
}
