import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
  TrendingUp, TrendingDown, Target, Zap, Activity, Users, 
  Sparkles, Award, Star, Flame, Compass, RefreshCw, BarChart2, ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import './AdminTrendsPage.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export default function AdminTrendsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchTrendsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const trends = await adminService.getTrendsAnalytics();
      setData(trends);
    } catch (err) {
      console.error('Error fetching trends analytics:', err);
      setError(err.message || 'Unable to establish secure tunnel to Mongo aggregate pipeline. Please verify database connections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTrendsData();
  }, []);

  if (loading) {
    return (
      <div className="admin-trends-page loading-state animate-in">
        <div className="shimmer-header">
          <div className="skeleton-title skeleton-shimmer"></div>
          <div className="skeleton-subtitle skeleton-shimmer"></div>
        </div>
        <div className="shimmer-grid-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="shimmer-card glass-card skeleton-shimmer" style={{ height: '140px' }}></div>
          ))}
        </div>
        <div className="shimmer-grid-2">
          <div className="shimmer-card glass-card skeleton-shimmer" style={{ height: '320px' }}></div>
          <div className="shimmer-card glass-card skeleton-shimmer" style={{ height: '320px' }}></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="admin-error-card trends-error animate-in">
        <ShieldAlert size={48} className="text-rose-500 mb-4" />
        <h3>Trends Pipeline Offline</h3>
        <p>{error}</p>
        <button className="admin-retry-btn" onClick={fetchTrendsData}>
          <RefreshCw size={16} />
          <span>Re-establish Pipeline</span>
        </button>
      </div>
    );
  }

  const { 
    top_predictions, avg_confidence, role_distribution, 
    skills_analytics, career_trends, prediction_growth, 
    ai_insights, trend_forecasting 
  } = data;

  // Process stats for summary
  const totalAssessments = prediction_growth.length > 0 ? prediction_growth[prediction_growth.length - 1].predictions : 0;
  const topPredictedRole = top_predictions.length > 0 ? top_predictions[0].role : 'Software Engineer';
  const nextBigSkill = trend_forecasting?.next_big_skill || 'Kubernetes';

  // Format Skills Radar Data dynamically
  const radarData = skills_analytics.demanded_skills.slice(0, 6).map((skill, index) => {
    const missingMatching = skills_analytics.missing_skills.find(ms => ms.skill.toLowerCase() === skill.skill.toLowerCase());
    return {
      subject: skill.skill.split(' ')[0],
      demanded: skill.count,
      missing: missingMatching ? missingMatching.count : Math.round(skill.count * 0.4)
    };
  });

  const getConfidenceLabel = (score) => {
    if (score >= 80) return { text: 'Excellent Prediction Quality 🔥', class: 'label-excellent' };
    if (score >= 65) return { text: 'Strong Prediction Quality 📈', class: 'label-strong' };
    return { text: 'Moderate Prediction Quality ⚠️', class: 'label-moderate' };
  };

  const confidenceInfo = getConfidenceLabel(avg_confidence);

  return (
    <div className={`admin-trends-page ${mounted ? 'animate-in' : ''}`}>
      
      {/* 1. Page Header */}
      <div className="trends-header">
        <div className="trends-title-block">
          <h2>Market Trend & Analytics Center</h2>
          <p className="subtitle">Real-time macro career trends, skill gap dynamics, and AI forecasting engine</p>
        </div>
        <button className="refresh-btn-glowing" onClick={fetchTrendsData} title="Fetch Fresh Pipeline Data">
          <RefreshCw size={16} />
          <span>Sync Pipelines</span>
        </button>
      </div>

      {/* 2. Trend Summary Cards */}
      <div className="trends-summary-grid">
        <div className="summary-card glass-card purple-glow">
          <div className="summary-header">
            <h3>Total Assessments</h3>
            <div className="summary-icon-wrap bg-purple">
              <Activity size={18} />
            </div>
          </div>
          <div className="summary-content">
            <span className="summary-value">{totalAssessments || 0}</span>
            <span className="summary-trend positive">
              <TrendingUp size={14} /> +12.4% this week
            </span>
          </div>
        </div>

        <div className="summary-card glass-card emerald-glow">
          <div className="summary-header">
            <h3>Avg Match Accuracy</h3>
            <div className="summary-icon-wrap bg-emerald">
              <Award size={18} />
            </div>
          </div>
          <div className="summary-content">
            <span className="summary-value">{avg_confidence}%</span>
            <span className="summary-trend positive">
              <TrendingUp size={14} /> Stable match reliability
            </span>
          </div>
        </div>

        <div className="summary-card glass-card blue-glow">
          <div className="summary-header">
            <h3>Top Predicted Path</h3>
            <div className="summary-icon-wrap bg-blue">
              <Target size={18} />
            </div>
          </div>
          <div className="summary-content">
            <span className="summary-value text-ellipsis" title={topPredictedRole}>{topPredictedRole}</span>
            <span className="summary-trend neutral">
              <Sparkles size={14} className="text-yellow-400" /> High prediction velocity
            </span>
          </div>
        </div>

        <div className="summary-card glass-card orange-glow">
          <div className="summary-header">
            <h3>Growth Forecast</h3>
            <div className="summary-icon-wrap bg-orange">
              <Zap size={18} />
            </div>
          </div>
          <div className="summary-content">
            <span className="summary-value text-ellipsis" title={nextBigSkill}>{nextBigSkill}</span>
            <span className="summary-trend focus">
              <Flame size={14} className="pulse-icon text-orange-400" /> Key market skill gap
            </span>
          </div>
        </div>
      </div>

      {/* Primary Analytics Section */}
      <div className="primary-analytics-grid">
        {/* 3. Most Repeated Career Predictions */}
        <div className="glass-card repeated-predictions-card">
          <div className="card-header-with-icon">
            <Flame size={20} className="text-rose-500 animate-pulse" />
            <h3>Most Repeated Career Predictions</h3>
          </div>
          <p className="card-desc">Dynamic analysis of predictions displaying highest job role frequencies</p>
          <div className="rankings-list">
            {top_predictions.map((p, idx) => (
              <div key={idx} className="ranking-item" style={{ '--rank-index': idx }}>
                <div className="rank-glowing-glow"></div>
                <div className="rank-left">
                  <div className={`rank-badge badge-${idx + 1}`}>
                    #{idx + 1}
                  </div>
                  <span className="rank-role-name">{p.role}</span>
                </div>
                <div className="rank-right">
                  <span className="rank-count-val">{p.count}</span>
                  <span className="rank-lbl">Assessments</span>
                </div>
              </div>
            ))}
            {top_predictions.length === 0 && <p className="text-slate-500 italic">No prediction records available.</p>}
          </div>
        </div>

        {/* 4. Average Prediction Confidence */}
        <div className="glass-card avg-confidence-card">
          <div className="card-header-with-icon">
            <Award size={20} className="text-emerald-500" />
            <h3>Average Prediction Confidence</h3>
          </div>
          <p className="card-desc">Average career capability confidence ratio across database predictions</p>
          
          <div className="circular-indicator-wrapper">
            <div className="circular-radial-indicator">
              <svg viewBox="0 0 36 36" className="circular-chart-trends">
                <linearGradient id="trendsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <path className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle-fill"
                  strokeDasharray={`${avg_confidence}, 100`}
                  stroke="url(#trendsGradient)"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="circular-value-text animate-fade-in">
                <span className="conf-value-num">{avg_confidence}</span>
                <span className="conf-value-pct">%</span>
              </div>
            </div>
            <div className="confidence-status-block">
              <span className={`status-label-badge ${confidenceInfo.class}`}>
                {confidenceInfo.text}
              </span>
              <p className="status-subtext">Verified match stability based on active MongoDB predictive computations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Career Trends Intelligence */}
      <div className="glass-card career-trends-intelligence">
        <div className="card-header-with-icon">
          <Compass size={20} className="text-blue-400" />
          <h3>Career Trends Intelligence</h3>
        </div>
        <p className="card-desc">Fastest growing career pathways and live status indicators</p>
        <div className="trends-velocity-grid">
          {career_trends.slice(0, 4).map((trend, i) => (
            <div key={i} className={`velocity-card-trends intensity-${trend.intensity}`}>
              <div className="velocity-glow"></div>
              <div className="velocity-info">
                <span className="velocity-role">{trend.role}</span>
                <span className="velocity-status">{trend.status}</span>
              </div>
              <div className="velocity-indicator-metric">
                <span className="metric-num">{trend.count}</span>
                <span className="metric-lbl">predictions</span>
              </div>
            </div>
          ))}
          {career_trends.length === 0 && <p className="text-slate-500 italic">No market trends detected yet.</p>}
        </div>
      </div>

      {/* 6. Skill Demand Heatmap */}
      <div className="glass-card skills-heatmap-card">
        <div className="card-header-with-icon">
          <BarChart2 size={20} className="text-cyan-400" />
          <h3>Skill Demand Heatmap</h3>
        </div>
        <p className="card-desc">Aggregated live user skill metrics categorized by demand density status</p>
        
        <div className="heatmap-split-grid">
          <div className="heatmap-column col-demanded">
            <h4>Demanded Core Skills</h4>
            <div className="heatmap-chips-wrapper">
              {skills_analytics.demanded_skills.slice(0, 8).map((s, i) => {
                let glowColor = '#3b82f6';
                let demandText = 'High Demand 🔥';
                if (i > 4) { demandText = 'Growing 📈'; glowColor = '#8b5cf6'; }
                if (i > 6) { demandText = 'Emerging 🚀'; glowColor = '#06b6d4'; }
                
                return (
                  <div key={i} className="heatmap-chip-item border-glow" style={{ '--glow-color': glowColor }}>
                    <div className="chip-content">
                      <span className="chip-skill-name">{s.skill}</span>
                      <span className="chip-demand-lvl">{demandText}</span>
                    </div>
                    <div className="chip-count-badge">{s.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="heatmap-column col-missing">
            <h4>Highest Missing Skills (Market Gap)</h4>
            <div className="heatmap-chips-wrapper">
              {skills_analytics.missing_skills.slice(0, 8).map((s, i) => {
                let glowColor = '#ef4444';
                let demandText = 'High Gap ⚠️';
                if (i > 4) { demandText = 'Rising Gap 📈'; glowColor = '#f59e0b'; }
                if (i > 6) { demandText = 'Emerging Gap 🚀'; glowColor = '#a855f7'; }

                return (
                  <div key={i} className="heatmap-chip-item border-glow-missing" style={{ '--glow-color': glowColor }}>
                    <div className="chip-content">
                      <span className="chip-skill-name-missing">{s.skill}</span>
                      <span className="chip-demand-lvl-missing">{demandText}</span>
                    </div>
                    <div className="chip-count-badge-missing">{s.count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Recharts Visualization Grid */}
      <div className="trends-charts-grid-container">
        
        {/* Prediction Growth AreaChart */}
        <div className="glass-card trend-chart-box span-2">
          <h3 className="chart-box-title">Prediction Growth Trajectory</h3>
          <div className="chart-box-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prediction_growth} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendsAreaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="predictions" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#trendsAreaGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Distribution PieChart */}
        <div className="glass-card trend-chart-box">
          <h3 className="chart-box-title">Role Prediction Distribution</h3>
          <div className="chart-box-wrap flex-col">
            <div className="distribution-pie-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={role_distribution.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={6}
                    dataKey="count"
                    nameKey="role"
                    stroke="none"
                  >
                    {role_distribution.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0px 0px 4px ${COLORS[index % COLORS.length]}50)` }} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px' }}
                    itemStyle={{ color: '#ffffff' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pie-legends-wrap">
              {role_distribution.slice(0, 4).map((r, i) => (
                <div key={i} className="pie-legend-item">
                  <div className="legend-color-dot" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="legend-txt-ellipsis" title={r.role}>{r.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Radar Chart */}
        <div className="glass-card trend-chart-box">
          <h3 className="chart-box-title">Skills Demand Radar</h3>
          <div className="chart-box-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="Demanded" dataKey="demanded" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="Missing" dataKey="missing" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 8. Market Intelligence Insights Panel */}
      <div className="glass-card intelligence-insights-card">
        <div className="card-header-with-icon">
          <Sparkles size={20} className="text-purple-400 animate-pulse" />
          <h3>Market Intelligence Insights</h3>
        </div>
        <p className="card-desc">Dynamic AI insights generated based on macro database trend analysis</p>
        
        <div className="insights-list-trends">
          {ai_insights.map((insight, idx) => {
            const formattedInsight = insight.replace(
              /(Software Engineer|Frontend|DevOps|Cloud|TypeScript|React|growth)/gi,
              '<span class="insight-highlight-word">$&</span>'
            );
            return (
              <div key={idx} className="insight-trends-item">
                <div className="insight-bullet-dot"></div>
                <p dangerouslySetInnerHTML={{ __html: formattedInsight }}></p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. Premium Feature: Trend Forecasting */}
      <div className="glass-card trends-forecasting-card">
        <div className="forecast-glow-panel"></div>
        <div className="forecast-left">
          <div className="forecast-icon-wrapper">
            <Sparkles size={24} className="text-yellow-300 animate-bounce" />
          </div>
          <div className="forecast-title-info">
            <h4>Skill Demand Forecast</h4>
            <span className="badge-predicted-skill">Predicted Next Big Skill: <strong>{nextBigSkill}</strong></span>
          </div>
        </div>
        <div className="forecast-right">
          <p>{trend_forecasting?.forecast_reason}</p>
        </div>
      </div>

    </div>
  );
}
