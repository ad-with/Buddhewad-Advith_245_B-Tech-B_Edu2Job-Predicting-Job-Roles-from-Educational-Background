import React, { useState, useEffect, useCallback } from 'react';
import {
  Target, ArrowRight, Zap, CheckCircle2, AlertCircle, Wrench,
  Sparkles, Check, X, AlertTriangle, BookOpen, Clock,
  Brain, Rocket, BarChart3, Briefcase, Code, Layers,
  Database, Shield, Globe, Cpu, Terminal, Smartphone,
  Settings, BarChart, PenTool, Search as SearchIcon,
  Presentation, Share2, Server, ExternalLink, Award, Users, Trophy
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { useNavigate, Link } from 'react-router-dom';
import { isSupportingTool, isOptionalSkill } from '../data/skillsData';
import { aiService } from '../services/api';
import './SkillGapAnalysis.css';

export default function SkillGapAnalysis() {
  const { predictionData } = usePrediction();
  const navigate = useNavigate();

  // State for AI Recommended Projects
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // State for Backend Skill Gap Analysis
  const [gapData, setGapData] = useState(null);
  const [loadingGap, setLoadingGap] = useState(false);

  // 1. PROJECT ENGINE LOGIC
  const fetchProjectRecommendations = useCallback(async () => {
    if (!predictionData?.role || !predictionData?.missingSkills) return;

    setLoadingProjects(true);
    try {
      const data = await aiService.getProjectRecommendations({
        role: predictionData.role,
        skills: predictionData.matchedSkills || [],
        missing_skills: predictionData.missingSkills
      });
      if (data && data.projects) setRecommendedProjects(data.projects);
    } catch (error) { console.error("Projects failed:", error); }
    finally { setLoadingProjects(false); }
  }, [predictionData]);

  // 2. SKILL GAP LOGIC (Backend)
  const fetchSkillGapAnalysis = useCallback(async () => {
    if (!predictionData?.role) return;

    setLoadingGap(true);
    try {
      const data = await aiService.analyzeSkillGap({
        role: predictionData.role,
        score: predictionData.score || predictionData.match || 0,
        matched_skills: predictionData.matchedSkills || [],
        missing_skills: predictionData.missingSkills || []
      });
      setGapData(data);
    } catch (error) { console.error("Gap analysis failed:", error); }
    finally { setLoadingGap(false); }
  }, [predictionData]);

  useEffect(() => {
    fetchProjectRecommendations();
    fetchSkillGapAnalysis();
  }, [fetchProjectRecommendations, fetchSkillGapAnalysis]);

  if (!predictionData || !predictionData.missingSkills) {
    return (
      <div className="gap-container empty-state glass-panel">
        <Target size={48} className="text-muted mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Career Data Found</h2>
        <p className="text-muted mb-6">Please use the Job Prediction module or Resume Analyzer first to generate your skill gap analysis.</p>
        <Link to="/dashboard/prediction" className="action-btn">Go to Prediction</Link>
      </div>
    );
  }

  const role = predictionData?.role || "Target Role";
  const score = predictionData?.score || predictionData?.match || 0;
  const matchedSkills = predictionData?.matchedSkills || [];
  const missingSkills = predictionData?.missingSkills || [];

  // Derive logic (use backend data if available, fallback to frontend logic)
  const isHighScore = gapData ? gapData.status === 'job_ready' : score >= 80;
  const mentorMessage = gapData?.message || `Your fundamentals in ${matchedSkills[0] || 'your core stack'} are strong.`;
  const nextSteps = gapData?.next_level_suggestions;

  const coreMissing = Array.isArray(missingSkills) ? missingSkills.filter(s => !isSupportingTool(s) && !isOptionalSkill(s)) : [];
  const toolsMissing = Array.isArray(missingSkills) ? missingSkills.filter(s => isSupportingTool(s)) : [];

  const highPriority = coreMissing.slice(0, 3);
  const mediumPriority = coreMissing.slice(3, 7);
  const lowPriority = [...coreMissing.slice(7), ...toolsMissing];

  const roadmapSteps = [...coreMissing, ...toolsMissing].slice(0, 5);
  const totalMissingCount = coreMissing.length + toolsMissing.length;
  const estWeeksMin = Math.max(1, totalMissingCount * 2 - 2);
  const estWeeksMax = totalMissingCount * 2;
  const impactSkills = [...coreMissing, ...toolsMissing].slice(0, 3);

  const handleLearnClick = (skill) => {
    navigate(`/dashboard/courses?skill=${encodeURIComponent(skill)}`);
  };

  const getDomainIcon = (domain) => {
    const d = (domain || '').toLowerCase();
    if (d.includes('front')) return <Layers size={18} />;
    if (d.includes('back')) return <Database size={18} />;
    if (d.includes('data')) return <Brain size={18} />;
    if (d.includes('devops')) return <Server size={18} />;
    return <Code size={18} />;
  };

  return (
    <div className="gap-container">
      {/* 1. TOP HEADER */}
      <header className="page-header text-center">
        <h1 className="page-title">AI Career Mentor</h1>
        <p className="page-subtitle text-lg">
          Your step-by-step roadmap to becoming a <strong>{role}</strong>
        </p>
      </header>

      <div className="gap-flow-layout">

        {/* 2. WHERE YOU STAND */}
        <section className="section reveal">
          <div className="glass-panel">
            <div className="stand-container">
              <div className="flex items-center gap-10">
                <div className="circular-progress-wrapper" data-percentage={score}>
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" />
                    <circle
                      cx="50" cy="50" r="45"
                      strokeDasharray={`${score * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="section-title mb-1">Where You Stand</h3>
                  <h4 className="text-3xl font-black text-slate-800 mb-1">
                    {isHighScore ? "You're job-ready! 🎉" : `You are ${score}% job-ready`}
                  </h4>
                  <p className={`text-sm font-semibold ${isHighScore ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isHighScore
                      ? "Focus on real-world experience and placement readiness."
                      : `${100 - score}% skill gap remaining to reach full proficiency.`
                    }
                  </p>
                  {isHighScore && <div className="ready-badge mt-2 inline-block">Job Ready</div>}
                </div>
              </div>

              <div className="stand-right">
                <div className="info-card">
                  <span>Target Role</span>
                  <strong>{role}</strong>
                </div>
                <div className="info-card">
                  <span>Experience</span>
                  <strong>Fresher</strong>
                </div>
                <div className="info-card">
                  <span>Analyzed Data</span>
                  <strong>{gapData?.readiness_insights?.strength || 'Skills, Projects'}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isHighScore ? (
          /* HIGH SCORE VIEW (>= 80%) */
          <section className="section reveal">
            <div className="high-score-box mb-8">
              <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
                <Trophy size={24} />
              </div>
              <div>
                <strong className="block text-lg">Excellent Progress!</strong>
                <p className="text-sm opacity-90">{gapData?.readiness_insights?.focus_area || "You have mastered the core requirements for this role."}</p>
              </div>
            </div>

            <h3 className="section-title mb-6">
              <Sparkles size={18} className="text-emerald-600" /> Next Level Growth
            </h3>

            <div className="growth-grid">
              <div className="growth-card">
                <h4><Rocket size={18} className="text-blue-500" /> Real Experience</h4>
                <ul className="growth-list">
                  {nextSteps?.experience?.map(item => <li key={item}>{item}</li>) || (
                    <>
                      <li>Contribute to open source projects</li>
                      <li>Take freelance or internship work</li>
                      <li>Build real-world applications</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="growth-card">
                <h4><Layers size={18} className="text-purple-500" /> Portfolio Upgrade</h4>
                <ul className="growth-list">
                  {nextSteps?.portfolio?.map(item => <li key={item}>{item}</li>) || (
                    <>
                      <li>Deploy your projects (Vercel/AWS)</li>
                      <li>Add README with screenshots</li>
                      <li>Showcase 2–3 strong projects</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="growth-card">
                <h4><BookOpen size={18} className="text-orange-500" /> Interview Prep</h4>
                <ul className="growth-list">
                  {nextSteps?.interview?.map(item => <li key={item}>{item}</li>) || (
                    <>
                      <li>Practice DSA (LeetCode/GFG)</li>
                      <li>Prepare core subjects</li>
                      <li>Do mock interviews</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="growth-card">
                <h4><Users size={18} className="text-emerald-500" /> Networking</h4>
                <ul className="growth-list">
                  {nextSteps?.networking?.map(item => <li key={item}>{item}</li>) || (
                    <>
                      <li>Optimize LinkedIn profile</li>
                      <li>Post your work regularly</li>
                      <li>Connect with recruiters</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </section>
        ) : (
          /* STANDARD SKILL GAP VIEW (< 80%) */
          <>
            {/* 3. SKILL GAPS */}
            <div className="section reveal">
              <div className="priority-grid">
                <div className="priority-card high glass-panel">
                  <div className="section-title text-rose-700">
                    <AlertCircle size={18} /> Must Learn First
                  </div>
                  <div className="flex flex-wrap flex-grow">
                    {highPriority.length > 0 ? highPriority.map(s => (
                      <button key={s} onClick={() => handleLearnClick(s)} className="skill-action-chip high">
                        {s} <ArrowRight size={12} />
                      </button>
                    )) : <span className="text-xs text-slate-400">No high priority gaps</span>}
                  </div>
                </div>

                <div className="priority-card medium glass-panel">
                  <div className="section-title text-amber-700">
                    <Zap size={18} /> Important Next
                  </div>
                  <div className="flex flex-wrap flex-grow">
                    {mediumPriority.length > 0 ? mediumPriority.map(s => (
                      <button key={s} onClick={() => handleLearnClick(s)} className="skill-action-chip medium">
                        {s} <ArrowRight size={12} />
                      </button>
                    )) : <span className="text-xs text-slate-400">No medium priority gaps</span>}
                  </div>
                </div>

                <div className="priority-card low glass-panel">
                  <div className="section-title text-emerald-700">
                    <CheckCircle2 size={18} /> Good to Have
                  </div>
                  <div className="flex flex-wrap flex-grow">
                    {lowPriority.length > 0 ? lowPriority.map(s => (
                      <button key={s} onClick={() => handleLearnClick(s)} className="skill-action-chip low">
                        {s} <ArrowRight size={12} />
                      </button>
                    )) : <span className="text-xs text-slate-400">No additional gaps</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. MAIN CONTENT */}
            <div className="section reveal">
              <div className="main-layout">
                <section className="glass-panel roadmap-section">
                  <h3 className="section-title">
                    <Rocket size={18} className="text-blue-600" /> Your Learning Path
                  </h3>
                  <div className="vertical-roadmap mb-6">
                    {roadmapSteps.map((skill, index) => (
                      <div key={skill} className="roadmap-step">
                        <div className="step-number bg-blue-600 text-white">{index + 1}</div>
                        <div className="flex-grow">
                          <div className="skill-name">{skill}</div>
                          <div className="text-xs text-slate-500">Estimated: 4–6 weeks</div>
                        </div>
                        <Link to={`/dashboard/courses?skill=${encodeURIComponent(skill)}`} className="roadmap-action-btn">
                          Find Courses <ArrowRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <Clock size={20} className="text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase">Estimated Readiness</span>
                      <div className="text-lg font-bold text-blue-900">~{estWeeksMin}–{estWeeksMax} weeks</div>
                    </div>
                  </div>
                </section>

                <div className="flex flex-col gap-6">
                  <section className="glass-panel insight-section mentor-card">
                    <h3 className="section-title">
                      <Sparkles size={18} className="text-orange-500" /> AI Career Mentor
                    </h3>
                    <p className="text-sm text-slate-600 italic leading-relaxed">
                      "{mentorMessage}"
                    </p>
                  </section>

                  <section className="glass-panel impact-section impact-card">
                    <h3 className="section-title">
                      <Zap size={18} className="text-emerald-600" /> Impact Preview
                    </h3>
                    <div className="flex flex-col gap-4">
                      {impactSkills.map((skill, idx) => (
                        <div key={skill}>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>{skill}</span>
                            <span className="text-emerald-600">+{idx === 0 ? 8 : 5}% Match</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${score + (idx === 0 ? 8 : 5)}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 5. RECOMMENDED PROJECTS */}
        <section className="section reveal">
          <h3 className="section-title">
            <Briefcase size={18} className="text-blue-600" /> Recommended Focus Projects
          </h3>
          <div className="projects-grid">
            {loadingProjects ? (
              <div className="col-span-full text-center py-10 text-slate-400 italic bg-white rounded-xl border border-dashed border-slate-200">
                Generating custom, role-aligned projects based on your skill gaps...
              </div>
            ) : recommendedProjects.length > 0 ? (
              recommendedProjects.map((proj, idx) => (
                <div key={idx} className="glass-panel project-card flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      {getDomainIcon(proj.domain)}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      (proj.difficulty || '').toLowerCase() === 'beginner' ? 'bg-emerald-50 text-emerald-600' :
                      (proj.difficulty || '').toLowerCase() === 'intermediate' ? 'bg-blue-50 text-blue-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {proj.difficulty}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 mb-1">{proj.title}</h4>
                  <p className="text-xs text-slate-500 mb-4 flex-grow line-clamp-3">{proj.description}</p>

                  <div className="mb-4">
                    {Array.isArray(proj.skills_used) ? proj.skills_used.map(t => <span key={t} className="tech-tag">{t}</span>) : null}
                  </div>

                  <div className="project-card-footer">
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {proj.impact}
                    </span>
                    <button className="start-proj-btn">Start Project</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-slate-400">
                No specific project recommendations found.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
