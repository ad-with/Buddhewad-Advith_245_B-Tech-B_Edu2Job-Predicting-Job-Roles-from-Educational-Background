import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts';
import {
  Briefcase, Target, IndianRupee, TrendingUp, Monitor, Zap,
  CheckCircle2, AlertCircle, Award, BookOpen, Lightbulb,
  Clock, MapPin, Search, FileText, ShieldCheck, Layers,
  Trophy, BarChart3, Map, Download, ExternalLink, UserPlus,
  Compass, ChevronRight, GraduationCap, ArrowRight, Loader2
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Dashboard.css';

import { roleAnalytics } from '../data/dashboardData';
import { userService } from '../services/api';


// Reusable mini sparkline wrapper
const SparkLine = ({ data, dataKey, color }) => (
  <div className="sparkline-container">
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const roleSalaryMap = {
  "AI Engineer": "₹16 LPA",
  "Accountant": "₹5 LPA",
  "Backend Developer": "₹10 LPA",
  "Business Analyst": "₹8 LPA",
  "Civil Engineer": "₹6 LPA",
  "Construction Manager": "₹9 LPA",
  "Data Analyst": "₹7 LPA",
  "Data Scientist": "₹15 LPA",
  "DevOps Engineer": "₹14 LPA",
  "Economist": "₹10 LPA",
  "Financial Analyst": "₹9 LPA",
  "Frontend Developer": "₹8 LPA",
  "Full Stack Developer": "₹12 LPA",
  "HR Manager": "₹7 LPA",
  "Machine Learning Engineer": "₹18 LPA",
  "Marketing Specialist": "₹6 LPA",
  "Mechanical Engineer": "₹6 LPA",
  "Product Manager": "₹16 LPA",
  "Research Analyst": "₹8 LPA",
  "Site Engineer": "₹5 LPA",
  "Software Engineer": "₹10 LPA",
  "Structural Engineer": "₹8 LPA",
  "Teaching Professional": "₹5 LPA",
  "UX Designer": "₹9 LPA"
};

const growthMap = {
  "AI Engineer": "+35%",
  "Accountant": "+10%",
  "Backend Developer": "+24%",
  "Business Analyst": "+15%",
  "Civil Engineer": "+12%",
  "Construction Manager": "+14%",
  "Data Analyst": "+18%",
  "Data Scientist": "+30%",
  "DevOps Engineer": "+28%",
  "Economist": "+12%",
  "Financial Analyst": "+16%",
  "Frontend Developer": "+20%",
  "Full Stack Developer": "+28%",
  "HR Manager": "+12%",
  "Machine Learning Engineer": "+38%",
  "Marketing Specialist": "+15%",
  "Mechanical Engineer": "+10%",
  "Product Manager": "+22%",
  "Research Analyst": "+14%",
  "Site Engineer": "+10%",
  "Software Engineer": "+22%",
  "Structural Engineer": "+12%",
  "Teaching Professional": "+8%",
  "UX Designer": "+20%"
};

const StatCard = ({ title, value, icon: Icon, color, sparklineData, sparklineKey, isGlowing, glowColor, children }) => (
  <div 
    className="stat-card glass-panel" 
    style={{
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isGlowing ? `0 10px 30px -5px ${glowColor}25, 0 0 15px -3px ${glowColor}40` : 'var(--shadow-premium)',
      borderColor: isGlowing ? glowColor : 'var(--border-subtle)'
    }}
  >
    <div className="stat-card-header">
      <div className="stat-card-info">
        <h3 className="stat-title">{title}</h3>
        <span className="stat-card-value">{value}</span>
      </div>
      <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}20`, color: color }}>
        <Icon size={24} />
      </div>
    </div>
    {children}
    {sparklineData && (
      <SparkLine data={sparklineData} dataKey={sparklineKey} color={color} />
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const fetchLatestPrediction = async () => {
      try {
        const data = await userService.getLatestPrediction();
        setLatestPrediction(data);
      } catch (err) {
        console.error("Error fetching latest prediction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestPrediction();
  }, []);

  useEffect(() => {
    if (latestPrediction?.confidence_score) {
      let start = 0;
      const end = Math.round(latestPrediction.confidence_score);
      if (start === end) {
        setAnimatedScore(end);
        return;
      }
      let duration = 800;
      let range = end - start;
      let current = start;
      let increment = end > start ? 1 : -1;
      let stepTime = Math.abs(Math.floor(duration / range));
      let timer = setInterval(() => {
        current += increment;
        setAnimatedScore(current);
        if (current === end) {
          clearInterval(timer);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [latestPrediction?.confidence_score]);

  // Use dynamic user name
  const userName = user?.name || user?.username || 'Learner';

  // Fallbacks for data when prediction is missing
  const hasPrediction = !!latestPrediction;
  const displayRole = latestPrediction?.predicted_role || (hasPrediction ? "Analyzing..." : "Software Engineer");
  const displayMatch = hasPrediction ? Math.round(latestPrediction.confidence_score) : 0;
  const missingSkills = latestPrediction?.missing_skills || ["Node.js", "System Design"];

  // Match score color logic
  const getMatchColor = (score) => {
    if (score >= 80) return "#10B981"; // Green
    if (score >= 60) return "#2563EB"; // Blue
    return "#F97316"; // Orange
  };
  const matchColor = getMatchColor(displayMatch);

  // Safely extract role analytics
  const analytics = roleAnalytics[displayRole] || roleAnalytics["Software Engineer"];
  
  // Custom Dynamic mapping for Salary & Growth
  const displaySalary = hasPrediction ? (roleSalaryMap[displayRole] || "₹10 LPA") : "N/A";
  const displayGrowth = hasPrediction ? (growthMap[displayRole] || "+22%") : "N/A";
  
  // Dynamic Best Matched Skill or fallback
  const displaySkill = hasPrediction 
    ? (latestPrediction.matched_skills && latestPrediction.matched_skills.length > 0 ? latestPrediction.matched_skills[0] : "Skill Emerging") 
    : "Skill Emerging";

  const demandData = analytics?.demandTrend || [];
  const skillsData = [...(analytics?.topSkills || [])].sort((a, b) => b.value - a.value);

  // Custom tooltips
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100 flex flex-col pointer-events-none">
          <p className="font-semibold text-slate-700 text-sm mb-1">{label}</p>
          <p className="text-[#06b6d4] font-bold text-sm">Index: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100 flex flex-col pointer-events-none">
          <p className="font-semibold text-slate-700 text-sm mb-1">{label}</p>
          <p className="text-[#8b5cf6] font-bold text-sm">Relevance: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="flex flex-col items-center">
          <div className="loader-ring"></div>
          <Zap className="text-[#2563EB] animate-pulse mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-800">Processing Talent Data</h2>
          <p className="text-slate-500">Calculating your personalized career trajectories...</p>
        </div>
      </div>
    );
  }

  // Prediction mapping for the report card
  const predictionForReport = hasPrediction ? {
    role: displayRole,
    score: displayMatch,
    confidence: displayMatch,
    missingSkills: missingSkills,
    matchedSkills: latestPrediction?.matched_skills || [],
    predictions: [{ role: displayRole, confidence: displayMatch }]
  } : null;

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome back, {userName} 👋</h2>
        <p>Here's your personalized career insights and progress</p>
      </section>

      {!hasPrediction && (
        <div className="empty-state-card mb-8">
          <div className="empty-state-icon">
            <AlertCircle size={32} />
          </div>
          <div className="empty-state-content">
            <h3>No prediction data available.</h3>
            <p>Complete your first assessment.</p>
            <button onClick={() => navigate('/dashboard/job-prediction')} className="cta-button shadow-premium">
              Start Prediction
            </button>
          </div>
        </div>
      )}

      {/* Top Statistic Cards */}
      <div className="stats-grid mb-8">
        <StatCard
          title="Predicted Role"
          value={displayRole}
          icon={Briefcase}
          color="#2563EB"
        />
        <StatCard
          title="Match Score"
          value={`${animatedScore}%`}
          icon={Target}
          color={matchColor}
          isGlowing={hasPrediction}
          glowColor={matchColor}
        >
          {hasPrediction && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000" 
                style={{ width: `${animatedScore}%`, backgroundColor: matchColor }}
              ></div>
            </div>
          )}
        </StatCard>
        <StatCard
          title="Avg Salary"
          value={displaySalary}
          icon={IndianRupee}
          color="#7C3AED"
          sparklineData={demandData}
          sparklineKey="demand"
        />
        <StatCard
          title="Demand Growth"
          value={displayGrowth}
          icon={TrendingUp}
          color="#F59E0B"
          sparklineData={demandData}
          sparklineKey="demand"
        />
        <StatCard
          title="Top Skill"
          value={displaySkill}
          icon={Monitor}
          color="#2563EB"
        />
      </div>

      {/* Main Dashboard Grid */}
      <section className="dashboard-grid">
        {/* Skill Score Card */}
        <div className="dashboard-card skill-card">
          <h3>Skill Readiness Score</h3>
          <div className="score-circle" style={{ borderColor: matchColor }}>
            <div className="score-value" style={{ color: matchColor }}>{animatedScore}</div>
            <div className="score-label">/ 100</div>
          </div>
          <div className="progress-items">
            <div className="progress-item">
              <div className="progress-label">Technical Depth</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${Math.min(displayMatch + 10, 95)}%`, background: `linear-gradient(90deg, ${matchColor}, #7C3AED)` }}></div>
              </div>
              <div className="progress-percent">{Math.min(displayMatch + 10, 95)}%</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Conceptual Balance</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${Math.max(displayMatch - 13, 40)}%`, background: `linear-gradient(90deg, ${matchColor}, #7C3AED)` }}></div>
              </div>
              <div className="progress-percent">{Math.max(displayMatch - 13, 40)}%</div>
            </div>
          </div>
        </div>

        {/* Learning Progress Card */}
        <div className="dashboard-card learning-card">
          <h3>Learning Pipeline</h3>
          <div className="course-items">
            <div className="course-item">
              <div className="course-title">Mastering {displayRole} Essentials</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '65%' }}></div>
              </div>
              <div className="progress-percent">65%</div>
            </div>
            <div className="course-item">
              <div className="course-title">Project: Build a Production App</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '40%' }}></div>
              </div>
              <div className="progress-percent">40%</div>
            </div>
          </div>
          <button className="find-courses-btn" onClick={() => navigate('/dashboard/courses')}>
            Continue Learning Path →
          </button>
        </div>

        {/* AI Insights Card */}
        <div className="dashboard-card insights-card">
          <h3>AI Talent Insights</h3>
          <div className="insight-list">
            <div className="insight-item variant-info">
              <div className="insight-title-text">Market Shift Detected</div>
              <div className="insight-desc-text font-medium">{displaySkill} skills demand increasing significantly in your region.</div>
            </div>
            {hasPrediction && (
              <div className="insight-item variant-success">
                <div className="insight-title-text text-green-700">Upskilling Opportunity</div>
                <div className="insight-desc-text">You are {displayMatch}% ready for {displayRole} roles. Just a few more skills left!</div>
              </div>
            )}
            <div className="insight-item variant-warning">
              <div className="insight-title-text text-orange-700">Action Required</div>
              <div className="insight-desc-text">Update your resume to include your latest {displaySkill} projects.</div>
            </div>
            <div className="insight-timestamp flex items-center gap-1 font-semibold">
              <Clock size={12} /> AI Insights updated 2 mins ago
            </div>
          </div>
        </div>

        {/* Top Matches Card */}
        <div className="dashboard-card jobs-card">
          <h3>Recommended Opportunities</h3>
          <div className="job-list">
            <div className="job-list-item">
              <div className="job-header-info flex justify-between">
                <div className="job-title-text font-bold">Senior {displayRole}</div>
                <div className="job-match-percent font-bold text-blue-600">{Math.min(displayMatch + 7, 99)}% Match</div>
              </div>
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <MapPin size={12} /> Tech Solutions • Remote
              </div>
              <div className="job-skills-tags flex gap-2">
                <span className="job-skill-badge text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{displaySkill}</span>
                <span className="job-skill-badge text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">System Design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="dashboard-card activity-card">
          <h3>Recent Milestones</h3>
          <div className="activity-timeline">
            {hasPrediction && (
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-title-text font-medium">New Prediction Generated</div>
                  <div className="timeline-time text-xs text-gray-500">Today at 10:30 AM</div>
                </div>
              </div>
            )}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-title-text font-medium">Assessment Started</div>
                <div className="timeline-time text-xs text-gray-500">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Career Report Section */}
      {hasPrediction ? (
        <AICareerReport prediction={predictionForReport} analytics={analytics} navigate={navigate} />
      ) : (
        <section className="insights-recommendations-section">
          <div className="section-header">
            <h2>Strategic Recommendations</h2>
            <div className="section-underline-marker"></div>
          </div>
          <div className="empty-state-placeholder glass-panel p-12 text-center rounded-2xl border-dashed border-2 border-slate-200">
            <Trophy className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-400">Complete Your Assessment</h3>
            <p className="text-slate-400 max-w-md mx-auto mt-2">Finish your career prediction to unlock your detailed AI analysis, roadmap, and personalized growth plan.</p>
          </div>
        </section>
      )}
    </div>
  );
};


const AICareerReport = ({ prediction, analytics, navigate }) => {
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();
  const missingSkills = prediction?.missingSkills || [];
  const matchedSkills = prediction?.matchedSkills || [];
  const userName = user?.name || user?.username || 'Learner';
  
  const currentScore = prediction?.score || 75;
  const potentialScore = Math.min(98, currentScore + Math.floor((100 - currentScore) * 0.65));

  const priorities = missingSkills.reduce((acc, skill, idx) => {
    if (idx % 3 === 0) acc.high.push(skill);
    else if (idx % 3 === 1) acc.medium.push(skill);
    else acc.low.push(skill);
    return acc;
  }, { high: [], medium: [], low: [] });

  const handleGenerateReport = async () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleDateString();
      
      // -- Title & Header --
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235); // Blue-600
      doc.text("AI Career Analysis Report", 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Generated for: ${userName}`, 20, 28);
      doc.text(`Date: ${timestamp}`, 20, 33);
      doc.line(20, 38, 190, 38);

      // -- 1. Career Prediction Summary --
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text("1. Career Prediction Summary", 20, 48);
      
      const rolesData = (prediction.predictions || []).length > 0 
        ? prediction.predictions.slice(0, 3).map((p, idx) => [idx + 1, p.role, `${p.confidence || 70}%`])
        : [[1, prediction.role, `${prediction.confidence}%`]];

      autoTable(doc, {
        startY: 53,
        head: [['Rank', 'Predicted Role', 'Match Confidence']],
        body: rolesData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }
      });

      // -- 2. Skills Analysis --
      let finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("2. Skills Analysis", 20, finalY);
      
      doc.setFontSize(11);
      doc.setTextColor(16, 185, 129); // Success-600
      doc.text("Matched Skills:", 20, finalY + 7);
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const matchedText = matchedSkills.join(', ') || "None identified";
      const splitMatched = doc.splitTextToSize(matchedText, 170);
      doc.text(splitMatched, 20, finalY + 13);
      
      finalY += (splitMatched.length * 5) + 15;
      doc.setFontSize(11);
      doc.setTextColor(225, 29, 72); // Rose-600
      doc.text("Missing Skills:", 20, finalY);
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const missingText = missingSkills.join(', ') || "No missing skills identified";
      const splitMissing = doc.splitTextToSize(missingText, 170);
      doc.text(splitMissing, 20, finalY + 6);

      // -- 3. Skill Gap Priority --
      finalY += (splitMissing.length * 5) + 15;
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("3. Skill Gap Priority Insights", 20, finalY);
      
      const priorityData = [
        ['High Priority', priorities.high.join(', ') || 'N/A'],
        ['Medium Priority', priorities.medium.join(', ') || 'N/A'],
        ['Low Priority', priorities.low.join(', ') || 'N/A']
      ];

      autoTable(doc, {
        startY: finalY + 5,
        body: priorityData,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: { 0: { fontStyle: 'bold', width: 40 } }
      });

      // -- 4. Learning Roadmap --
      finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("4. Strategic Learning Roadmap", 20, finalY);
      
      const roadmap = [
        ['Phase 1', 'Foundation (Weeks 1-2)', `Focus on ${missingSkills[0] || 'essential concepts'}`],
        ['Phase 2', 'Deep Dive (Weeks 3-5)', `Master ${missingSkills[1] || 'advanced implementations'}`],
        ['Phase 3', 'Project Integration (Weeks 6-8)', 'Apply skills to production-ready projects']
      ];

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Phase', 'Duration', 'Action Plan']],
        body: roadmap,
        headStyles: { fillColor: [79, 70, 229] } // Indigo-600
      });

      // -- 5. Recommendations --
      finalY = doc.lastAutoTable.finalY + 15;
      if (finalY > 240) { doc.addPage(); finalY = 20; }
      
      doc.setFontSize(14);
      doc.text("5. AI Recommendations", 20, finalY);
      
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text("Top Recommended Courses:", 20, finalY + 8);
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`- Mastering ${missingSkills[0] || prediction.role} Fundamentals`, 25, finalY + 14);
      doc.text(`- Advanced ${missingSkills[1] || 'System Design'} for ${prediction.role}`, 25, finalY + 20);
      doc.text(`- Industry Projects in ${prediction.role}`, 25, finalY + 26);

      doc.setFontSize(11);
      doc.setTextColor(245, 158, 11); // Amber-500
      doc.text("Suggested Hands-on Projects:", 20, finalY + 36);
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`- Build a production-ready ${prediction.role} Portfolio`, 25, finalY + 42);
      doc.text(`- ${prediction.role} Technical Case Study Integration`, 25, finalY + 48);

      // -- 6. Summary & Readiness --
      finalY += 65;
      if (finalY > 240) { doc.addPage(); finalY = 20; }
      
      doc.setFillColor(248, 250, 252); // Slate-50
      doc.rect(20, finalY, 170, 45, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(20, finalY, 170, 45, 'D');
      
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Final AI Insight Summary", 25, finalY + 10);
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const summaryText = `Based on our analysis, you are ${prediction.confidence}% aligned with your target career. By following the recommended roadmap and mastering the identified ${missingSkills.length} skill gaps, your industry readiness score can improve from ${currentScore}% to an impressive ${potentialScore}%.`;
      const splitSummary = doc.splitTextToSize(summaryText, 160);
      doc.text(splitSummary, 25, finalY + 18);
      
      doc.setFontSize(12);
      doc.setTextColor(37, 99, 235);
      doc.text(`Current Readiness: ${currentScore}%`, 25, finalY + 38);
      doc.setTextColor(16, 185, 129);
      doc.text(`Potential Readiness: ${potentialScore}%`, 110, finalY + 38);

      // Save the PDF
      doc.save(`Career_Report_${userName.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="ai-report-section reveal">
      <div className="report-generator-card glass-panel p-10 rounded-3xl text-center border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
        <div className="icon-wrapper w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-200">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-blue-600">AI Career Report Generator</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Transform your assessment data into a complete, structured PDF report including skill analysis, roadmaps, and strategic recommendations.
        </p>
        
        <div className="flex flex-col items-center gap-4 mt-8">
          <button 
            className={`generate-report-btn px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all shadow-lg ${
              generating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'
            }`}
            onClick={handleGenerateReport}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Download size={24} />
                Generate Complete Report
              </>
            )}
          </button>
          
          <div className="flex gap-4 mt-2">
            <button className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors" onClick={() => navigate('/dashboard/skill-gap')}>
              <ExternalLink size={14} /> View Detailed Analysis
            </button>
            <button className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors" onClick={() => navigate('/dashboard/courses')}>
              <UserPlus size={14} /> Improve My Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
