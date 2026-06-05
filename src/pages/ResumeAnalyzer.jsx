import { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileType, 
  CheckCircle, 
  Zap, 
  X, 
  AlertCircle, 
  Target, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  Sparkles, 
  User, 
  BrainCircuit, 
  Award, 
  Check, 
  FileText,
  Layout,
  TrendingUp,
  Search,
  BookOpen,
  Map
} from 'lucide-react';
import { aiService } from '../services/api';
import { usePrediction } from '../context/PredictionContext';
import { getRequiredSkillsForRole, isSupportingTool, isOptionalSkill, OPTIONAL_SKILLS } from '../data/skillsData';
import { Link } from 'react-router-dom';
import './ResumeAnalyzer.css';

export default function ResumeAnalyzer() {
  const { setPredictionData } = usePrediction();
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // States for loading animations
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setLoadingStep(1);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const isTxt = selectedFile.type === "text/plain" || selectedFile.name.endsWith('.txt');
    const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.endsWith('.pdf');

    if (!isTxt && !isPdf) {
      setErrorMsg("Only .txt and .pdf files are allowed");
      return;
    }
    setErrorMsg('');
    setFile(selectedFile);
  };

  const analyze = async () => {
    if (!file) {
      setErrorMsg("Please upload a resume file first.");
      return;
    }

    const startTime = Date.now();
    setErrorMsg('');
    setIsAnalyzing(true);
    setResults(null);

    try {
      // Step 1: Extract Features using NLP
      const formData = new FormData();
      formData.append("file", file);
      const extraction = await aiService.extractResumeFeatures(formData);
      const extractedSkills = extraction.skills || [];
      const extractedEdu = extraction.education || 'Unknown';
      const extractedExp = extraction.experience_years || 0;
      const extractedProjects = extraction.projects || [];
      const extractedCerts = extraction.certifications || [];
      const backendScore = extraction.score || 0;

      // Step 2: Predict Job Role using ML Model
      const mlPayload = {
        degree: extractedEdu,
        specialization: "Computer Science", 
        academic_score: 8.0, 
        is_cgpa: true,
        marks_10th: 80.0,
        marks_12th: 80.0,
        skills: extractedSkills.join(', '),
        experience_years: extractedExp
      };

      const predictionResponse = await aiService.predictJob(mlPayload);
      const predictedRole = predictionResponse.role || predictionResponse.predicted_role || "Software Engineer";
      const modelConfidence = predictionResponse.confidence || 75.0;

      // Step 3: Compute Skill Gap
      const requiredSkills = getRequiredSkillsForRole(predictedRole);
      const allUserSkills = extractedSkills.map(s => s.toLowerCase());

      const matchedSkills = requiredSkills.filter(skill =>
        allUserSkills.some(userSkill => userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill))
      );

      const missingSkills = requiredSkills.filter(skill => !matchedSkills.includes(skill));

      // Improved Skill Match Logic: Target 10 key skills as a benchmark for "high proficiency"
      const targetSkillCount = Math.min(requiredSkills.length, 10);
      const skillMatchPercent = targetSkillCount > 0
        ? Math.min(100, Math.round((matchedSkills.length / targetSkillCount) * 100))
        : 0;

      // Calculate Dynamic Resume Strength Score
      const totalScore = backendScore;

      // Harmonized Final Match Score:
      // Combines Model Confidence, Skill Match, and Resume Strength with a +2 accuracy bonus
      const finalMatch = Math.min(100, Math.round(
        (0.25 * modelConfidence) + 
        (0.45 * skillMatchPercent) + 
        (0.30 * totalScore)
      ) + 2);

      // Simulate Score Improvements using GenAI backend
      let topImprovements = [];
      try {
        const improvementPayload = {
          predicted_role: predictedRole,
          missing_skills: missingSkills,
          experience_years: extractedExp
        };
        const improvementRes = await aiService.simulateImprovements(improvementPayload);
        topImprovements = improvementRes.improvements || [];
      } catch (err) {
        console.error("Failed to generate simulated improvements:", err);
        // Fallback
        if (missingSkills.length > 0) topImprovements.push({ label: `Learn & Add ${missingSkills[0]}`, gain: 4 });
        if (extractedExp < 2) topImprovements.push({ label: `Gain 1 year relevant experience`, gain: 10 });
      }

      // Calculate elapsed time and handle minimum delay
      const elapsedTime = Date.now() - startTime;
      const minDelay = 3000;
      if (elapsedTime < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime));
      }

      // Update Global Context
      const newPredictionContext = {
        role: predictedRole,
        confidence: modelConfidence,
        match: finalMatch,
        requiredSkills,
        matchedSkills,
        missingSkills,
        inputs: {
          degree: extractedEdu,
          experience: extractedExp,
          selectedSkills: extractedSkills,
        }
      };
      setPredictionData(newPredictionContext);

      // Set Local State for UI
      setResults({
        education: extractedEdu,
        experience: extractedExp,
        extractedSkills,
        extractedProjects,
        extractedCerts,
        role: predictedRole,
        confidence: modelConfidence,
        matchScore: finalMatch,
        totalScore,
        missingSkills,
        matchedSkills,
        improvements: topImprovements,
        predictions: predictionResponse.predictions || []
      });

    } catch (err) {
      setErrorMsg(err.message || "Failed to analyze resume.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`resume-container resume-active ${!results ? 'resume-home' : ''}`}>
      <div className="resume-content">
        
        {/* Header - Show only on Upload screen */}
        {!results && !isAnalyzing && (
          <header className="page-header">
            <div className="badge-ai">
              <Zap size={14} fill="currentColor" />
              <span>AI-Powered Career Analysis</span>
            </div>
            <h1>Resume Analyzer</h1>
            <p>
              Unlock your career potential with AI-powered insights. Upload your resume and discover your ideal role, skill gaps, and personalized growth path.
            </p>
          </header>
        )}

        {/* Main UI Logic */}
        <div className="main-content-wrapper-inner">
          {isAnalyzing ? (
            /* STATE 2: LOADING SCREEN */
            <div className="loading-screen animate-fade-in">
              <div className="spinner-large"></div>
              <h2>Analyzing your resume...</h2>
              <p>Please wait while we process your data</p>
              <div className="loading-steps">
                {(file?.type === "application/pdf" || file?.name.endsWith('.pdf')) && (
                  <div className={`loading-step ${loadingStep >= 1 ? 'active' : ''}`}>
                    {loadingStep >= 1 ? <CheckCircle className="text-emerald-500" size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                    <span>Extracting text from PDF...</span>
                  </div>
                )}
                <div className={`loading-step ${loadingStep >= 1 ? 'active' : ''}`}>
                  {loadingStep >= 1 ? <CheckCircle className="text-emerald-500" size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                  <span>Extracting skills</span>
                </div>
                <div className={`loading-step ${loadingStep >= 2 ? 'active' : ''}`}>
                  {loadingStep >= 2 ? <CheckCircle className="text-emerald-500" size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                  <span>Running AI prediction</span>
                </div>
                <div className={`loading-step ${loadingStep >= 3 ? 'active' : ''}`}>
                  {loadingStep >= 3 ? <CheckCircle className="text-emerald-500" size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                  <span>Matching job roles</span>
                </div>
              </div>
            </div>
          ) : results ? (
            /* STATE 3: RESULTS DASHBOARD */
            <div className="results-dashboard animate-fade-in-up">
              
              {/* 1. Header Bar */}
              <div className="results-header-bar">
                <div className="status-info">
                  <div className="check-circle-wrapper">
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <div className="status-text">
                    <h3>Analysis Complete!</h3>
                    <p>{file?.name || 'resume_analysis.txt'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setResults(null); setFile(null); }}
                  className="analyze-another-btn"
                >
                  <Layout size={16} />
                  Analyze Another
                </button>
              </div>

              {/* 2. Quick Info Cards - Removed Target Role, Replaced with Extracted Profile summary */}
              <div className="quick-info-grid">
                <div className="info-card">
                  <div className="info-icon bg-blue-50 text-blue-600">
                    <User size={20} />
                  </div>
                  <div className="info-content">
                    <div className="label">Extracted Profile</div>
                    <div className="value">{results.education}</div>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon bg-purple-50 text-purple-600">
                    <Briefcase size={20} />
                  </div>
                  <div className="info-content">
                    <div className="label">Experience</div>
                    <div className="value">{results.experience} Yrs</div>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon bg-emerald-50 text-emerald-600">
                    <Search size={20} />
                  </div>
                  <div className="info-content">
                    <div className="label">Skills Found</div>
                    <div className="value">{results.extractedSkills.length}</div>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon bg-indigo-50 text-indigo-600">
                    <FileText size={20} />
                  </div>
                  <div className="info-content">
                    <div className="label">Projects Found</div>
                    <div className="value">{results.extractedProjects.length}</div>
                  </div>
                </div>
              </div>

              {/* 3. Main Grid - SWAPPED (AI Predictions on Left, Extracted Profile on Right) */}
              <div className="results-main-grid">
                
                {/* Left Side: AI Predictions (Enhanced) */}
                <div className="dashboard-card">
                  <h3 className="card-title">
                    <BrainCircuit size={18} className="text-purple-600" />
                    AI Predictions
                  </h3>
                  <div className="skills-title">Top Matched Roles</div>
                  <div className="prediction-items">
                    {results.predictions.slice(0, 3).map((pred, idx) => {
                      const score = pred.score;
                      const colors = ["blue", "purple", "green"];
                      const colorClass = colors[idx] || "blue";
                      
                      return (
                        <div key={idx} className={`prediction-item ${colorClass}`}>
                          <div className="pred-header">
                            <span className="pred-role">{pred.role}</span>
                            <span className={`pred-pct ${colorClass}-text`}>{score}%</span>
                          </div>
                          <div className="progress-container">
                            <div 
                              className={`progress-fill ${colorClass}`} 
                              style={{ width: `${score}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Extracted Profile */}
                <div className="dashboard-card">
                  <h3 className="card-title">
                    <User size={18} className="text-blue-600" />
                    Extracted Profile
                  </h3>
                  <div className="profile-badges">
                    <div className="profile-badge">
                      <GraduationCap size={16} /> {results.education}
                    </div>
                    <div className="profile-badge">
                      <Clock size={16} /> {results.experience} Yrs
                    </div>
                  </div>
                  <div className="skills-title">Identified Skills</div>
                  <div className="skills-cloud">
                    {results.extractedSkills.map((s, i) => (
                      <span key={i} className="skill-chip">{s}</span>
                    ))}
                  </div>

                  {results.extractedProjects.length > 0 && (
                    <>
                      <div className="skills-title mt-4">Key Projects</div>
                      <div className="space-y-2 mt-2">
                        {results.extractedProjects.map((p, i) => (
                          <div key={i} className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                            {p}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {results.extractedCerts.length > 0 && (
                    <>
                      <div className="skills-title mt-4">Certifications</div>
                      <div className="space-y-2 mt-2">
                        {results.extractedCerts.map((c, i) => (
                          <div key={i} className="text-xs bg-emerald-50 p-2 rounded-lg border border-emerald-100 flex items-start gap-2">
                            <Award size={12} className="text-emerald-600 mt-0.5" />
                            {c}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* 4. Skill Gap Analysis */}
              <div className="dashboard-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="card-title m-0">
                    <Target size={20} className="text-rose-600" />
                    Skill Gap Analysis
                  </h3>
                  <Link to="/dashboard/skills" className="text-blue-600 font-bold text-xs hover:underline">Details →</Link>
                </div>

                <div className="skill-gap-sections">
                  <div className="gap-section">
                    <div className="gap-title red">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      MISSING CORE SKILLS
                    </div>
                    <div className="skills-cloud">
                      {results.missingSkills.filter(s => !isSupportingTool(s) && !isOptionalSkill(s)).length > 0 ? (
                        results.missingSkills.filter(s => !isSupportingTool(s) && !isOptionalSkill(s)).map((s, i) => (
                          <span key={i} className="skill-chip chip-red">{s}</span>
                        ))
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                          <CheckCircle size={14} /> All acquired
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="gap-section">
                    <div className="gap-title blue">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      MISSING TOOLS & EXTRAS
                    </div>
                    <div className="skills-cloud">
                      {results.missingSkills.filter(s => isSupportingTool(s)).length > 0 ? (
                        results.missingSkills.filter(s => isSupportingTool(s)).map((s, i) => (
                          <span key={i} className="skill-chip chip-blue">{s}</span>
                        ))
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                          <CheckCircle size={14} /> All acquired
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Resume Strength Score Card */}
              {(() => {
                const { totalScore } = results;
                let scoreColorClass = "score-red";
                let scoreTitle = "Needs Improvement";
                let scoreMessage = "Focus on acquiring core skills and building related projects to increase your chances.";

                if (totalScore >= 80) {
                  scoreColorClass = "score-green";
                  scoreTitle = "Excellent!";
                  scoreMessage = "Your resume is highly competitive and well-aligned with your target role.";
                } else if (totalScore >= 60) {
                  scoreColorClass = "score-blue";
                  scoreTitle = "Good Job!";
                  scoreMessage = "With a few improvements, you can stand out more to recruiters.";
                } else if (totalScore >= 40) {
                  scoreColorClass = "score-orange";
                  scoreTitle = "Average Profile";
                  scoreMessage = "Focus on strengthening key skills and gaining more practical experience.";
                }

                return (
                  <div className="resume-score-card">
                    <div className="score-left">
                      <svg viewBox="0 0 100 100" className="circle-progress">
                        <circle cx="50" cy="50" r="45" className="bg" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          className={`progress ${scoreColorClass}`} 
                          style={{ 
                            strokeDasharray: 283, 
                            strokeDashoffset: 283 - (283 * totalScore) / 100 
                          }} 
                        />
                      </svg>
                      <div className="score-value-overlay">
                        <h2>{totalScore}</h2>
                        <span>Score</span>
                      </div>
                    </div>
                    
                    <div className="score-right">
                      <h4>{scoreTitle}</h4>
                      <p>{scoreMessage}</p>
                      
                      <div className="score-insights">
                        <div className="score-insight-badge">
                          <Sparkles size={14} className="text-blue-500" /> Skills: <span className="pts">{results.extractedSkills.length} identified</span>
                        </div>
                        <div className="score-insight-badge">
                          <Briefcase size={14} className="text-purple-500" /> Experience: <span className="pts">{results.experience} Years</span>
                        </div>
                        <div className="score-insight-badge">
                          <GraduationCap size={14} className="text-indigo-500" /> Education: <span className="pts">{results.education}</span>
                        </div>
                        <div className="score-insight-badge">
                          <Award size={14} className="text-emerald-500" /> Extras: <span className="pts">{results.extractedProjects.length + results.extractedCerts.length} points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 5.1 Score Improvement Simulation */}
              {results.improvements && results.improvements.length > 0 && (
                <div className="improvement-section mb-8">
                  <h4>
                    <Sparkles size={18} className="text-amber-500" />
                    🚀 Improve Your Score
                  </h4>
                  <div className="improvements-list">
                    {results.improvements.map((imp, idx) => {
                      const colorClass = imp.gain >= 12 ? "green" : imp.gain >= 9 ? "purple" : "blue";
                      const newScore = Math.min(results.totalScore + imp.gain, 100);
                      
                      return (
                        <div key={idx} className="improvement-card">
                          <div className="imp-left">
                            <p>{imp.label}</p>
                            <span className={`imp-gain-badge ${colorClass}`}>+{imp.gain} pts</span>
                          </div>
                          <div className="imp-right">
                            <span className="arrow text-sm font-semibold">{results.totalScore}</span>
                            <span className="arrow">→</span>
                            <strong className="new-score">{newScore} <span className="text-green-500 text-lg">↑</span></strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Next Steps & Highlights */}
              <div className="results-main-grid">
                <div className="dashboard-card next-steps-card">
                  <div className="next-steps-content">
                    <h3>Next Steps</h3>
                    <p>You are <span className="font-bold underline">{results.missingSkills.length} skills</span> away from becoming a top candidate.</p>
                  </div>
                  <div className="next-steps-actions">
                    <Link to="/dashboard/skills" className="primary-btn">
                      <Target size={16}/> View Skill Gap
                    </Link>
                    <Link to="/dashboard/roadmap" className="secondary-btn">
                      <Map size={16}/> Build Career Roadmap
                    </Link>
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3 className="card-title">
                    <TrendingUp size={18} className="text-indigo-600" />
                    Resume Highlights
                  </h3>
                  <div className="highlights-grid">
                    <div className="highlight-badge"><CheckCircle size={14} /> Clear Structure</div>
                    <div className="highlight-badge"><CheckCircle size={14} /> Relevant Skills</div>
                    <div className="highlight-badge"><CheckCircle size={14} /> Well Written</div>
                    <div className="highlight-badge"><CheckCircle size={14} /> No Critical Issues</div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* STATE 1: UPLOAD SCREEN */
            <div className="upload-wrapper animate-fade-in">
              <div className="upload-card">
                <div 
                  className="upload-box"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".txt,.pdf"
                      onChange={handleFileInput}
                    />
                    
                    {file ? (
                      <div className="file-selected-state">
                        <div className="upload-icon-wrapper bg-emerald-50 text-emerald-600">
                          <FileType size={60} />
                        </div>
                        <div className="upload-text">
                          <h3>{file.name}</h3>
                          <p>{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <div className="ready-badge">
                          <CheckCircle size={14} /> Ready for analysis
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="upload-icon-wrapper">
                          <UploadCloud size={60} />
                        </div>
                        <div className="upload-text">
                          <h3>Drop your resume here</h3>
                          <p>Drag & drop or click to browse (.txt or .pdf, max 5MB)</p>
                        </div>
                      <button className="analyze-another-btn mt-2 bg-blue-600 text-white border-none px-6">
                        Choose File
                      </button>
                    </>
                  )}
                </div>

                {errorMsg && (
                  <div className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl text-xs font-bold border border-rose-100">
                    <AlertCircle size={16} /> {errorMsg}
                  </div>
                )}

                <button
                  onClick={analyze}
                  disabled={!file}
                  className="analyze-btn-main"
                >
                  Analyze Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
