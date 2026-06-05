import { 
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity, Globe, Code2 } from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import './JobMarketTrends.css';

const techDemandData = [
  { year: '2020', ai: 4000, cloud: 6000, web: 8000 },
  { year: '2021', ai: 5000, cloud: 7000, web: 8200 },
  { year: '2022', ai: 7500, cloud: 8500, web: 8500 },
  { year: '2023', ai: 11000, cloud: 9800, web: 9000 },
  { year: '2024', ai: 15000, cloud: 11000, web: 9200 },
];

const salaryData = [
  { role: 'AI Architect', min: 140, median: 180, max: 250 },
  { role: 'Data Scientist', min: 95, median: 130, max: 190 },
  { role: 'Cloud Eng', min: 100, median: 140, max: 185 },
  { role: 'Full Stack', min: 80, median: 115, max: 160 },
];

export default function JobMarketTrends() {
  const { predictionData } = usePrediction();
  const predictedRole = predictionData?.role;

  const displaySalaryData = [...salaryData];
  if (predictedRole && !displaySalaryData.find(s => s.role === predictedRole)) {
    displaySalaryData.unshift({ role: predictedRole, min: 110, median: 145, max: 190 });
    if (displaySalaryData.length > 5) displaySalaryData.pop();
  }

  return (
    <div className="trends-container">
      <header className="page-header">
        <h1 className="page-title">Job Market Trends</h1>
        <p className="page-subtitle">Real-time industry analytics and technology demand forecasts.</p>
      </header>

      {/* Global Indicators */}
      <div className="market-indicators">
        <div className="indicator-card glass-panel">
          <Activity className="indicator-icon text-cyan-400" />
          <div className="indicator-content">
            <span className="indicator-label">Market Growth (YoY)</span>
            <span className="indicator-value">+14.2%</span>
          </div>
        </div>
        
        <div className="indicator-card glass-panel">
          <Globe className="indicator-icon text-purple-400" />
          <div className="indicator-content">
            <span className="indicator-label">Remote Share</span>
            <span className="indicator-value">42.8%</span>
          </div>
        </div>

        <div className="indicator-card glass-panel">
          <Code2 className="indicator-icon text-pink-400" />
          <div className="indicator-content">
            <span className="indicator-label">Fastest Growing</span>
            <span className="indicator-value">AI / MLOps</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="metrics-grid">
        <div className="metric-panel glass-panel">
          <h3>Technology Ecosystem Demand</h3>
          <p className="panel-desc">5-year trajectory of core technology sectors.</p>
          <div className="chart-wrapper area-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={techDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} 
                  itemStyle={{ color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="ai" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                <Area type="monotone" dataKey="cloud" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="web" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <div className="legend-item"><span className="legend-dot" style={{background: '#06b6d4'}}></span> AI / ML</div>
            <div className="legend-item"><span className="legend-dot" style={{background: '#8b5cf6'}}></span> Cloud Infrastructure</div>
            <div className="legend-item"><span className="legend-dot" style={{background: '#3b82f6'}}></span> Web Development</div>
          </div>
        </div>

        <div className="metric-panel glass-panel">
          <h3>Salary Distribution (INR Lakhs)</h3>
          <p className="panel-desc">Median salary ranges across top technical roles.</p>
          <div className="chart-wrapper bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displaySalaryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="role" type="category" stroke="#64748b" width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Bar dataKey="median" fill="url(#colorMedian)" radius={[0, 4, 4, 0]} />
                <defs>
                  <linearGradient id="colorMedian" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
