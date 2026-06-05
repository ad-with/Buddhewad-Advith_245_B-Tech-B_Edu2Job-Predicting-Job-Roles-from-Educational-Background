import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/api';
import { usePrediction } from '../context/PredictionContext';
import { getRequiredSkillsForRole } from '../data/skillsData';
import { DEGREES_DATA, getDegreeType, getSpecializations } from '../data/degreesData';
import { SPECIALIZATION_MAPPING, getSkillsBySpecialization, getInterestsBySpecialization, getSubjectsBySpecialization } from '../data/specializationData';
import { Sparkles, CheckCircle2, ChevronRight, BrainCircuit, User, Briefcase, GraduationCap, Building2, Layers, ArrowLeft, Info, Trophy, Medal, Search, X, Target, TrendingUp, Compass, BookOpen, AlertCircle, Award, Zap, Lightbulb, RotateCcw, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './JobPrediction.css';

const TECHNICAL_SKILLS = [
  'Python', 'Java', 'C++', 'C#', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'PHP', 'Ruby', 'Swift',
  'HTML5', 'CSS3', 'React', 'Angular', 'Vue.js', 'Tailwind CSS', 'Bootstrap', 'Node.js', 'Express.js',
  'Django', 'Flask', 'Spring Boot', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Ansible',
  'Linux', 'Bash', 'Networking', 'System Architecture', 'System Design', 'API Design', 'Data Modeling',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Pandas', 'NumPy',
  'Scikit-learn', 'Statistics', 'Predictive Modeling', 'Mathematics', 'Jupyter', 'Git',
  'Data Structures', 'Algorithms', 'Object-Oriented Programming (OOP)', 'REST APIs', 'GraphQL',
  'AutoCAD', 'STAAD Pro', 'SolidWorks', 'MATLAB', 'MathCAD', 'Revit', 'ETABS', 'SAP2000',
  'Structural Analysis', 'Fluid Mechanics', 'Geotechnical Engineering', 'Construction Management',
  'Site Supervision', 'Quality Control', 'Safety Management', 'Material Testing', 'Earthquake Engineering',
  'Mechanics of Materials', 'Surveying Instruments', 'Data structure and algorithm(DSA)',
  'Microservices', 'Design Patterns', 'Test-Driven Development (TDD)', 'WebSockets', 'Data Warehousing', 'ETL processes',
  'Cloud Architecture', 'Performance Optimization'
];

const NON_TECH_SKILLS = [
  'Communication', 'Marketing', 'Finance', 'Management', 'Sales', 'Accounting',
  'SEO', 'Content Strategy', 'Digital Marketing', 'Recruiting', 'Employee Relations',
  'Business Analysis', 'Public Speaking', 'Economic Research', 'Tally', 'GST',
  'Financial Modeling', 'Tableau', 'Power BI', 'Excel', 'Data Visualization', 'Data Cleaning',
  'Data Manipulation', 'Analytical Thinking', 'UX Research', 'Interaction Design', 'Wireframing',
  'Prototyping', 'User Testing', 'Information Architecture', 'Visual Design', 'Figma', 'Adobe XD', 'Sketch',
  'InVision', 'Zeplin', 'Miro', 'Product Strategy', 'Agile', 'Scrum', 'Requirements Gathering',
  'Market Research', 'Market Analysis', 'Leadership', 'Jira', 'Confluence', 'Trello', 'Google Analytics',
  'A/B Testing', 'User Stories', 'Project Planning', 'Cost Estimation', 'Resource Management',
  'Risk Management', 'Contract Negotiation', 'MS Project', 'Primavera P6', 'Procore',
  'Cost Accounting Software', 'User Personas', 'Journey Mapping', 'Accessibility Guidelines (WCAG)',
  'Stakeholder Management', 'Data-Driven Decision Making', 'Business Intelligence', 'Exploratory Data Analysis (EDA)'
];

const TECHNICAL_INTERESTS = [
  'Software Development', 'Machine Learning', 'Cloud Engineering', 'Data Science',
  'System Architecture', 'Cybersecurity', 'Web Development', 'Mobile App Development',
  'Game Design', 'IoT', 'Structural Design', 'Automotive Systems'
];

const NON_TECH_INTERESTS = [
  'Finance', 'Marketing', 'Human Resources', 'Business Analytics',
  'Accounting', 'Corporate Strategy', 'Sales Management', 'Public Relations',
  'Economic Research', 'Content Creation', 'Teaching', 'Operations Management'
];

export default function JobPrediction() {
  const navigate = useNavigate();
  const { setPredictionData } = usePrediction();
  const [step, setStep] = useState(1);
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Academic Fields (Step 1)
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [academicScore, setAcademicScore] = useState('');
  const [isCgpa, setIsCgpa] = useState(true);
  const [marks10th, setMarks10th] = useState('');
  const [marks12th, setMarks12th] = useState('');

  // Skills & Interests Fields (Step 2)
  const [selectedCoreSkills, setSelectedCoreSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [skillSearch, setSkillSearch] = useState('');
  const [experience, setExperience] = useState('');

  const [coreSubjects, setCoreSubjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [subjectSearch, setSubjectSearch] = useState('');
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const academicScoreRef = useRef(null);
  const [hasScrolledStep1, setHasScrolledStep1] = useState(false);

  useEffect(() => {
    if (step === 1) {
      setHasScrolledStep1(false);
    }
  }, [step]);

  useEffect(() => {
    if (step === 1 && degree && specialization && !hasScrolledStep1) {
      const timer = setTimeout(() => {
        academicScoreRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        // Optional highlight for high quality UX
        academicScoreRef.current?.classList.add("highlight");
        setTimeout(() => {
          academicScoreRef.current?.classList.remove("highlight");
        }, 2000);
      }, 150);
      setHasScrolledStep1(true);
      return () => clearTimeout(timer);
    }
  }, [degree, specialization, step, hasScrolledStep1]);

  useEffect(() => {
    if (specialization) {
      const subjects = getSubjectsBySpecialization(specialization);
      setCoreSubjects(subjects.map(subject => ({ name: subject, grade: '' })));
      setSubjectSearch('');
      setShowAllSubjects(false);
    } else {
      setCoreSubjects([]);
      setSubjectSearch('');
      setShowAllSubjects(false);
    }
  }, [specialization]);

  // Scroll to top when moving to prediction results (Step 3)
  useEffect(() => {
    if (step === 3) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);


  const toggleItem = (item, selected, setSelected) => {
    setSelected(prev =>
      prev.includes(item)
        ? prev.filter(s => s !== item)
        : [...prev, item]
    );
  };

  const isStep1Valid = () => {
    const score = parseFloat(academicScore);
    const m10 = parseFloat(marks10th);
    const m12 = parseFloat(marks12th);
    const scoreMax = isCgpa ? 10 : 100;

    return (
      degree && specialization &&
      academicScore && score >= 0 && score <= scoreMax &&
      marks10th && m10 >= 0 && m10 <= 100 &&
      marks12th && m12 >= 0 && m12 <= 100
    );
  };

  const isStep2Valid = () => {
    return selectedCoreSkills.length >= 2 && selectedInterests.length >= 1;
  };

  const getEducationRoles = () => {
    const specInterests = getInterestsBySpecialization(specialization);
    if (specInterests.length > 0) {
      return specInterests.slice(0, 4);
    }

    if (degree === 'B.Tech / B.E' || degree === 'BCA' || degree === 'MCA' || degree === 'M.Tech') {
      return ['Software Developer', 'Data Scientist', 'Civil Engineer', 'System Architect'];
    } else if (degree === 'BBA' || degree === 'MBA') {
      return ['Business Analyst', 'Marketing Manager', 'Product Manager', 'HR Manager'];
    } else if (degree === 'B.Com' || degree === 'M.Com') {
      return ['Accountant', 'Financial Analyst', 'Tax Consultant', 'Auditor'];
    } else if (degree === 'B.Sc' || degree === 'M.Sc' || degree === 'BA' || degree === 'MA') {
      return ['Data Analyst', 'Researcher', 'Economist', 'Teaching Professional'];
    } else {
      return ['Subject Matter Expert', 'Operations Executive'];
    }
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!isStep2Valid()) return;

    setIsPredicting(true);
    setResult(null);
    setError(null);

    try {
      const allProjectTech = projects.flatMap(p => p.skillsApplied ? p.skillsApplied.split(',').map(s => s.trim()) : []).filter(Boolean);
      const allInternshipRoles = internships.map(i => i.domain).filter(Boolean);

      const filteredCoreSubjects = coreSubjects.filter(sub => sub.grade !== '');
      const formattedProjects = projects.map(p => ({
        title: p.title || '',
        role: p.role || '',
        skillsApplied: p.skillsApplied ? p.skillsApplied.split(',').map(s => s.trim()).filter(Boolean) : []
      }));
      const formattedInternships = internships.map(i => ({
        company: i.company || '',
        domain: i.domain || '',
        durationMonths: parseInt(i.durationMonths) || 0
      }));

      const payload = {
        degree,
        specialization,
        academic_score: parseFloat(academicScore),
        is_cgpa: isCgpa,
        marks_10th: parseFloat(marks10th),
        marks_12th: parseFloat(marks12th),
        skills: Array.from(new Set([...selectedCoreSkills, ...selectedInterests, ...allProjectTech, ...allInternshipRoles])),
        experience_years: parseInt(experience, 10) || 0,
        core_subjects: filteredCoreSubjects,
        projects: formattedProjects,
        internships: formattedInternships,
        certifications: certifications
      };

      const apiResponse = await aiService.predictJob(payload);

      if (!apiResponse || (!apiResponse.predicted_role && !apiResponse.role)) {
        throw new Error("No prediction received from AI service.");
      }

      const predictions = apiResponse.predictions || [];
      const topRole = apiResponse.predicted_role || apiResponse.role;
      const requiredSkills = getRequiredSkillsForRole(topRole);
      const allUserSkillsList = Array.from(new Set([
        ...selectedCoreSkills, 
        ...selectedInterests, 
        ...allProjectTech, 
        ...allInternshipRoles
      ]));
      const allUserSkillsLower = allUserSkillsList.map(s => s.toLowerCase());
      
      // 1. Role-Specific Matches (Skills that are directly required for the predicted role)
      const coreMatches = requiredSkills.filter(reqSkill => {
        const reqLower = reqSkill.toLowerCase();
        return allUserSkillsLower.some(userSkill => {
          if (userSkill === reqLower) return true;
          if (reqLower === 'java' && userSkill.includes('javascript')) return false;
          if (userSkill === 'java' && reqLower.includes('javascript')) return false;
          return (userSkill.length >= 3 && reqLower.includes(userSkill)) || 
                 (reqLower.length >= 3 && userSkill.includes(reqLower));
        });
      });
      
      // 2. Additional Expertise (Other recognized skills the user has)
      const additionalExpertise = allUserSkillsList.filter(userSkill => {
        const userLower = userSkill.toLowerCase();
        // If it's already in coreMatches, skip it
        if (coreMatches.some(m => m.toLowerCase() === userLower)) return false;
        
        // Check if it matches any known industry skill (fuzzy match)
        return [...TECHNICAL_SKILLS, ...NON_TECH_SKILLS].some(industrySkill => {
          const industryLower = industrySkill.toLowerCase();
          return userLower === industryLower || 
                 (userLower.length >= 3 && industryLower.includes(userLower)) || 
                 (industryLower.length >= 3 && userLower.includes(industryLower));
        });
      });

      const matchedSkills = [...coreMatches, ...additionalExpertise];
      const matchedSkillsLower = matchedSkills.map(s => s.toLowerCase());
      const missingSkills = requiredSkills.filter(s => !coreMatches.some(m => m.toLowerCase() === s.toLowerCase()));

      // Improved Skill Match Logic: Use 10 key skills as proficiency benchmark
      const targetSkillCount = Math.min(requiredSkills.length, 10);
      const skillMatchPercent = targetSkillCount > 0
        ? Math.min(100, Math.round((coreMatches.length / targetSkillCount) * 100))
        : 80;

      const newResult = {
        role: topRole,
        confidence: apiResponse.confidence || 75,
        predictions: predictions,
        explanation: apiResponse.explanation || (apiResponse.top_factors && apiResponse.top_factors.join('\n')) || "AI prediction based on your profile.",
        score: Math.min(100, Math.round(
          (0.4 * (apiResponse.confidence || 75)) + 
          (0.6 * skillMatchPercent)
        ) + 2),
        requiredSkills,
        matchedSkills,
        missingSkills,
        actions: [
          `Master advanced concepts in ${topRole}`,
          'Build a standout portfolio project',
          'Get certified in core technologies'
        ]
      };

      setResult(newResult);
      setPredictionData(newResult);
      setStep(3);
    } catch (error) {
      console.error("Prediction failed:", error);
      setError(error.message);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setDegree('');
    setSpecialization('');
    setAcademicScore('');
    setSelectedCoreSkills([]);
    setSelectedInterests([]);
    setCoreSubjects([]);
    setProjects([]);
    setInternships([]);
    setCertifications([]);
    setExperience('');
    setError(null);
  };

  const isTechDegree = getDegreeType(degree) === 'technical';
  const isTechSpec = ['Computer Science', 'Information Technology', 'Data Science', 'Artificial Intelligence', 'Software Engineering'].includes(specialization);

  const specSkills = getSkillsBySpecialization(specialization);
  const specInterests = getInterestsBySpecialization(specialization);

  let skillOptions = [];
  let interestOptions = [];

  if (isTechDegree || isTechSpec) {
    // For technical paths, combine specialization-specific skills/interests with the full technical lists
    skillOptions = Array.from(new Set([...specSkills, ...TECHNICAL_SKILLS]));
    interestOptions = Array.from(new Set([...specInterests, ...TECHNICAL_INTERESTS]));
  } else if (specSkills.length > 0) {
    // For specialized non-tech paths (Physics, Chemistry, etc.), show ONLY their specific options
    skillOptions = specSkills;
    interestOptions = specInterests;
  } else {
    // Fallback to standard non-technical lists
    skillOptions = NON_TECH_SKILLS;
    interestOptions = NON_TECH_INTERESTS;
  }

  return (
    <div className="prediction-container">
      <header className="page-header">
        <div className="header-logo pt-6">
          <Sparkles size={28} />
        </div>
        <h1 className="page-title">AI Career Predictor</h1>
        <p className="page-subtitle">Personalized career pathing driven by your educational background.</p>
      </header>

      <div className="stepper">
        <div className="step-wrapper">
          <div className={`step-item ${step > 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
            {step > 1 ? <CheckCircle2 size={24} /> : '1'}
          </div>
          <span className="step-label">Academic</span>
        </div>
        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className="step-wrapper">
          <div className={`step-item ${step > 2 || result ? 'completed' : ''} ${step === 2 && !result ? 'active' : ''}`}>
            {step > 2 || result ? <CheckCircle2 size={24} /> : '2'}
          </div>
          <span className="step-label">Experience</span>
        </div>
        <div className={`step-line ${result || step === 3 ? 'active' : ''}`}></div>
        <div className="step-wrapper">
          <div className={`step-item ${result || step === 3 ? 'completed active' : ''}`}>
            {result || step === 3 ? <CheckCircle2 size={24} /> : '3'}
          </div>
          <span className="step-label">Prediction</span>
        </div>
      </div>

      {isPredicting ? (
        <div className="full-page-loading reveal">
          <div className="loading-content">
            <BrainCircuit size={64} className="spin-icon text-blue-500 mb-6 mx-auto" />
            <h2 className="text-3xl font-bold text-slate-800">Analyzing your profile...</h2>
            <p className="text-slate-500 mt-2">Matching your skills to industry demands.</p>
          </div>
        </div>
      ) : step === 3 && result ? (
        <div className="result-container reveal">
          {/* 2. Top Career Matches - Vertical Stack */}
          <div className="career-section">
            <h3 className="section-heading">Top Career Matches</h3>
            <div className="career-stack">
              {(() => {
                const mainItem = { ...result, rank: 1 };
                const altPredictions = (result && Array.isArray(result.predictions) && result.predictions.length > 1)
                  ? result.predictions.slice(1, 3).map((p, idx) => ({
                    ...p,
                    rank: idx + 2,
                    confidence: p.score || p.confidence || Math.max(10, (result.confidence || 70) - (idx + 1) * 10)
                  }))
                  : [
                    { role: "Software Engineer", confidence: Math.max(10, (result.confidence || 75) - 10), rank: 2 },
                    { role: "Data Analyst", confidence: Math.max(5, (result.confidence || 75) - 20), rank: 3 }
                  ];

                const cards = [mainItem, ...altPredictions].slice(0, 3);
                const themes = ['blue', 'purple', 'orange'];

                return cards.map((item, idx) => (
                  <div key={idx} className={`career-card-stacked ${idx === 0 ? 'best-match' : ''} theme-${themes[idx]}`}>
                    <div className="card-rank-badge">#{item.rank}</div>
                    <div className="card-info">
                      <div className="card-role-title">
                        <h4>{item.role}</h4>
                        {idx === 0 && <span className="best-match-tag">Best Match</span>}
                      </div>
                      <div className="card-match-details">
                        <span className="match-percent">{item.confidence}% Match</span>
                        <div className="match-progress-bar">
                          <div className="progress-fill" style={{ width: `${item.confidence}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* 3. Skills Breakdown */}
          <div className="skills-section">
            <h3 className="section-heading">Skills Breakdown</h3>
            <div className="skills-breakdown-container">
              <div className="skills-group glass-panel">
                <div className="group-header">
                  <CheckCircle2 size={20} className="text-emerald-500" />
                  <h4>Your Strengths</h4>
                  <span className="count-badge">{result.matchedSkills.length} skills</span>
                </div>
                <div className="skills-chips">
                  {result.matchedSkills.length > 0 ? result.matchedSkills.map(s => (
                    <span key={s} className="skill-chip-tag strength">{s}</span>
                  )) : <span className="text-slate-400 text-sm italic">Add skills to see your strengths</span>}
                </div>
              </div>

              <div className="skills-group glass-panel">
                <div className="group-header">
                  <AlertCircle size={20} className="text-orange-500" />
                  <h4>Skills to Improve</h4>
                  <span className="count-badge">{result.missingSkills.length} skills</span>
                </div>
                <div className="skills-chips">
                  {result.missingSkills.length > 0 ? result.missingSkills.map(s => (
                    <span key={s} className="skill-chip-tag improvement">{s}</span>
                  )) : <span className="text-slate-400 text-sm italic">You're fully ready!</span>}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Why This Role Fits You */}
          <div className="explanation-section">
            <h3 className="section-heading">Why This Role Fits You</h3>
            <div className="explanation-card glass-panel">
              <div className="p-3 bg-amber-50 rounded-xl">
                <Lightbulb size={24} className="text-amber-500" />
              </div>
              <ul className="explanation-bullets">
                <li>Your background in <strong>{specialization || 'your field'}</strong> provides {result.confidence > 80 ? 'an exceptional' : 'a solid'} foundation for this role.</li>
                <li>The combination of <strong>{result.matchedSkills.slice(0, 2).join(' and ') || 'your core skills'}</strong> matches the high-priority requirements.</li>
                <li>Your academic performance and projects demonstrate strong potential for <strong>{result.role}</strong> positions.</li>
                <li>The roadmap below highlights a clear path to bridge your current <strong>{result.missingSkills.length}</strong> missing skill gaps.</li>
              </ul>
            </div>
          </div>

          {/* 5. New Grid: Projects & Side Highlights */}
          <div className="new-sections-grid">
            {/* Recommended Projects */}
            <div className="projects-column">
              <h3 className="section-heading">Recommended Projects</h3>
              <div className="projects-grid-stack">
                <div className="project-card-new">
                  <h4>Full-stack {result.role} Portfolio</h4>
                  <p>Build a comprehensive application that showcases your ability to handle both frontend and backend logic.</p>
                  <div className="project-stack">
                    <span className="tech-chip">React</span>
                    <span className="tech-chip">Node.js</span>
                    <span className="tech-chip">Database</span>
                  </div>
                  <button className="start-proj-btn-new">Start Project</button>
                </div>
                <div className="project-card-new">
                  <h4>{result.role} Challenge Pack</h4>
                  <p>Solve 10+ industry-standard problems focusing on scalability and performance optimization.</p>
                  <div className="project-stack">
                    <span className="tech-chip">Algorithms</span>
                    <span className="tech-chip">Optimization</span>
                  </div>
                  <button className="start-proj-btn-new">View Challenges</button>
                </div>
              </div>
            </div>

            {/* Time & Impact */}
            <div className="side-highlights">
              <div>
                <h3 className="section-heading">Preparation</h3>
                <div className="highlight-card">
                  <h4>Time to Job Ready</h4>
                  <div className="time-value">
                    {Math.max(4, result.missingSkills.length * 2)}–{Math.max(6, result.missingSkills.length * 3)} Weeks
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Estimated based on your current skill gap and learning pace.</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="highlight-card">
                  <h4>Impact Preview</h4>
                  <div className="impact-list">
                    {result.missingSkills.slice(0, 3).map((s, i) => (
                      <div key={i} className="impact-item">
                        <span className="skill">{s}</span>
                        <span className="improvement">+{10 + i * 5}% Match</span>
                      </div>
                    ))}
                    {result.missingSkills.length === 0 && (
                      <div className="text-center py-2 text-slate-400 text-sm">Skills fully optimized</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Strategic Roadmap - Premium Timeline */}
          <div className="roadmap-container">
            <h3 className="section-heading">Strategic Roadmap</h3>
            <div className="roadmap-timeline">
              {result.actions.map((action, idx) => (
                <div key={idx} className="roadmap-step">
                  <div className="roadmap-icon">
                    {idx === 0 ? <BookOpen size={16} /> : idx === 1 ? <Target size={16} /> : <Zap size={16} />}
                  </div>
                  <div className="roadmap-card">
                    <div className="roadmap-phase">PHASE {idx + 1}</div>
                    <div className="roadmap-text">{action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Action Buttons Section - Navigation Hub */}
          <div className="result-footer-actions">
            <button className="btn-action-premium primary" onClick={() => navigate('/dashboard/courses')}>
              <GraduationCap size={18} />
              View Recommended Courses
            </button>
            <button className="btn-action-premium secondary hover-blue" onClick={() => navigate('/dashboard/skill-gap')}>
              <BarChart3 size={18} />
              Deep Skill Gap Analysis
            </button>
            <button className="btn-action-premium secondary hover-blue" onClick={() => navigate('/dashboard/career-roadmap')}>
              <Compass size={18} />
              Career Roadmap
            </button>
            <button className="btn-action-premium secondary hover-blue" onClick={() => { handleReset(); navigate('/dashboard/job-prediction'); }}>
              <RotateCcw size={18} />
              Modify Profile
            </button>
            <button className="btn-action-premium secondary" onClick={() => { handleReset(); navigate('/dashboard/job-prediction'); }}>
              <ArrowLeft size={18} />
              New Prediction
            </button>
          </div>
        </div>
      ) : (
        <div className="main-content-grid">
          <div className="form-column transition-all duration-300">
            <div className="form-card relative overflow-hidden">
              {step === 1 ? (
                <div className="form-section reveal">
                  <div className="form-section-title">Step 1: Academic Background</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Degree</label>
                      <select className="form-input" value={degree} onChange={(e) => { setDegree(e.target.value); setSpecialization(''); setSelectedCoreSkills([]); setSelectedInterests([]); }} required>
                        <option value="" disabled>Select degree</option>
                        {DEGREES_DATA.map(d => (
                          <option key={d.degree} value={d.degree}>{d.degree}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Specialization</label>
                      <select className="form-input" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required disabled={!degree}>
                        <option value="" disabled>Select specialization</option>
                        {getSpecializations(degree).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div ref={academicScoreRef} className="academic-score-section scroll-offset">
                    <div className="form-grid">
                      <div className="form-group">
                        <div className="section-header-flex">
                          <label style={{ margin: 0 }}>{isCgpa ? 'CGPA' : 'Percentage'}</label>
                          <button type="button" className="toggle-mini" onClick={() => setIsCgpa(!isCgpa)}>
                            Switch to {isCgpa ? '%' : 'CGPA'}
                          </button>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={isCgpa ? 10 : 100}
                          className="form-input"
                          placeholder={isCgpa ? "e.g. 9.5" : "e.g. 85"}
                          value={academicScore}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val !== '') {
                              const num = parseFloat(val);
                              const max = isCgpa ? 10 : 100;
                              if (num > max) val = max.toString();
                              if (num < 0) val = '0';
                            }
                            setAcademicScore(val);
                          }}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>10th Marks (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-input"
                          placeholder="e.g. 92"
                          value={marks10th}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val !== '') {
                              const num = parseFloat(val);
                              if (num > 100) val = '100';
                              if (num < 0) val = '0';
                            }
                            setMarks10th(val);
                          }}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>12th Marks (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-input"
                          placeholder="e.g. 88"
                          value={marks12th}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val !== '') {
                              const num = parseFloat(val);
                              if (num > 100) val = '100';
                              if (num < 0) val = '0';
                            }
                            setMarks12th(val);
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {coreSubjects.length > 0 && (
                    <div className="dynamic-inputs-section reveal">
                      <h4 className="dynamic-section-title mb-4">Core Subjects <span className="text-muted text-sm font-normal">(Optional)</span></h4>

                      <div className="skill-search-wrapper">
                        <div className="skill-search-input-container">
                          <input
                            type="text"
                            className="form-input skill-search-input"
                            placeholder="Search subjects..."
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                          />
                          {subjectSearch && (
                            <X className="clear-search" size={18} onClick={() => setSubjectSearch('')} />
                          )}
                        </div>
                      </div>

                      <div className="skills-chip-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {(() => {
                          const filteredSubjects = coreSubjects.filter(sub => sub.name.toLowerCase().includes(subjectSearch.toLowerCase()));
                          const visibleSubjects = showAllSubjects || subjectSearch ? filteredSubjects : filteredSubjects.slice(0, 3);

                          if (visibleSubjects.length === 0) {
                            return <div className="text-muted col-span-2">No subjects found</div>;
                          }

                          return visibleSubjects.map((subject) => (
                            <div key={subject.name} className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 0 }}>
                              <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600 }}>{subject.name}</span>
                              <select
                                className="form-input"
                                style={{ width: '100px', flex: 'none', padding: '6px' }}
                                value={subject.grade}
                                onChange={(e) => {
                                  const updatedSubjects = coreSubjects.map(sub =>
                                    sub.name === subject.name ? { ...sub, grade: e.target.value } : sub
                                  );
                                  setCoreSubjects(updatedSubjects);
                                }}
                              >
                                <option value="">None</option>
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="B-">B-</option>
                                <option value="C+">C+</option>
                                <option value="C">C</option>
                                <option value="C-">C-</option>
                                <option value="D">D</option>
                              </select>
                            </div>
                          ));
                        })()}
                      </div>

                      {(() => {
                        const filteredSubjects = coreSubjects.filter(sub => sub.name.toLowerCase().includes(subjectSearch.toLowerCase()));
                        if (!subjectSearch && filteredSubjects.length > 3) {
                          return (
                            <button
                              type="button"
                              className="toggle-mini mt-4"
                              onClick={() => setShowAllSubjects(!showAllSubjects)}
                            >
                              {showAllSubjects ? 'Show Less' : `Show More (${filteredSubjects.length - 3})`}
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}

                  <div className="action-row pt-6 border-t border-slate-100">
                    <button className="predict-btn" disabled={!isStep1Valid()} onClick={() => setStep(2)}>
                      Next Step <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="form-section reveal">
                  <button className="back-btn transition-colors hover:bg-slate-50" onClick={() => setStep(1)}>
                    <ArrowLeft size={16} /> Back to Academic Background
                  </button>
                  <div className="form-section-title">Step 2: Skills & Experience</div>

                  {/* CORE SKILLS */}
                  <div className="form-group">
                    <div className="section-header-flex">
                      <label style={{ margin: 0 }}>Core Skills <span className="text-muted font-normal">(Select at least 2)</span></label>
                    </div>

                    <div className="skill-search-wrapper">
                      <div className="skill-search-input-container">
                        <input
                          type="text"
                          className="form-input skill-search-input"
                          placeholder="Search specific skills..."
                          value={skillSearch}
                          onChange={(e) => setSkillSearch(e.target.value)}
                        />
                        {skillSearch && <X className="clear-search" size={18} onClick={() => setSkillSearch('')} />}
                      </div>
                    </div>

                    {selectedCoreSkills.length > 0 && (
                      <div className="skills-chip-container mb-4 pb-4 border-b border-slate-100">
                        {selectedCoreSkills.map(skill => (
                          <button key={skill} type="button" className="skill-chip selected" onClick={() => toggleItem(skill, selectedCoreSkills, setSelectedCoreSkills)}>
                            {skill} <X size={14} />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="skills-chip-container">
                      {skillOptions.filter(skill => !skillSearch || skill.toLowerCase().includes(skillSearch.toLowerCase())).filter(skill => !selectedCoreSkills.includes(skill)).slice(0, 15).map(skill => (
                        <button key={skill} type="button" className="skill-chip unselected" onClick={() => { toggleItem(skill, selectedCoreSkills, setSelectedCoreSkills); setSkillSearch(''); }}>
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INTERESTS */}
                  <div className="form-group mt-8">
                    <label>Career Interests <span className="text-muted font-normal">(Select at least 1)</span></label>
                    <div className="skills-chip-container">
                      {interestOptions.map(interest => (
                        <button
                          key={interest}
                          type="button"
                          className={`skill-chip interest-chip ${selectedInterests.includes(interest) ? 'selected' : 'unselected'}`}
                          onClick={() => toggleItem(interest, selectedInterests, setSelectedInterests)}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-section-title mt-10">Experience Overview</div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Years of Experience</label>
                      <input type="number" min="0" className="form-input" placeholder="e.g. 2" value={experience} onChange={(e) => setExperience(e.target.value)} />
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="dynamic-inputs-section blue">
                    <div className="section-header-flex">
                      <h4 className="dynamic-section-title">Projects</h4>
                      <button type="button" className="add-btn blue-variant" onClick={() => setProjects([...projects, { title: '', role: '', skillsApplied: '' }])}>+ Add</button>
                    </div>
                    {projects.map((proj, idx) => (
                      <div className="form-group mt-6 p-4 bg-white rounded-lg border border-blue-200" key={`proj-${idx}`}>
                        <div className="flex justify-end mb-2">
                          <button type="button" onClick={() => { const newP = [...projects]; newP.splice(idx, 1); setProjects(newP); }} className="remove-btn">Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Title</label>
                            <input type="text" className="form-input" placeholder="Project Name" value={proj.title} onChange={(e) => { const newP = [...projects]; newP[idx].title = e.target.value; setProjects(newP); }} required />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Your Role</label>
                            <input type="text" className="form-input" placeholder="e.g. Lead Developer" value={proj.role} onChange={(e) => { const newP = [...projects]; newP[idx].role = e.target.value; setProjects(newP); }} required />
                          </div>
                        </div>
                        <div className="form-group mt-4" style={{ margin: 0 }}>
                          <label>Skills Applied <span className="text-muted font-normal">(comma separated)</span></label>
                          <input type="text" className="form-input" placeholder="React, Node.js, Python" value={proj.skillsApplied} onChange={(e) => { const newP = [...projects]; newP[idx].skillsApplied = e.target.value; setProjects(newP); }} required />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Internships Section */}
                  <div className="dynamic-inputs-section blue">
                    <div className="section-header-flex">
                      <h4 className="dynamic-section-title">Internships</h4>
                      <button type="button" className="add-btn blue-variant" onClick={() => setInternships([...internships, { company: '', domain: '', durationMonths: '' }])}>+ Add</button>
                    </div>
                    {internships.map((int, idx) => (
                      <div className="form-group mt-6 p-4 bg-white rounded-lg border border-blue-200" key={`int-${idx}`}>
                        <div className="flex justify-end mb-2">
                          <button type="button" onClick={() => { const newI = [...internships]; newI.splice(idx, 1); setInternships(newI); }} className="remove-btn">Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Company</label>
                            <input type="text" className="form-input" placeholder="e.g. Google" value={int.company} onChange={(e) => { const newI = [...internships]; newI[idx].company = e.target.value; setInternships(newI); }} required />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Domain</label>
                            <select className="form-input" value={int.domain} onChange={(e) => { const newI = [...internships]; newI[idx].domain = e.target.value; setInternships(newI); }} required>
                              <option value="" disabled>Select domain</option>
                              <option value="Web Development">Web Development</option>
                              <option value="Data Science">Data Science</option>
                              <option value="Machine Learning">Machine Learning</option>
                              <option value="Cloud Computing">Cloud Computing</option>
                              <option value="Cybersecurity">Cybersecurity</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Finance">Finance</option>
                              <option value="Design">Design</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Duration (Months)</label>
                            <input type="number" min="1" className="form-input" placeholder="e.g. 3" value={int.durationMonths} onChange={(e) => { const newI = [...internships]; newI[idx].durationMonths = e.target.value; setInternships(newI); }} required />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certifications Section */}
                  <div className="dynamic-inputs-section blue">
                    <div className="section-header-flex">
                      <h4 className="dynamic-section-title">Certifications</h4>
                      <button type="button" className="add-btn blue-variant" onClick={() => setCertifications([...certifications, { name: '', platform: '', domain: '' }])}>+ Add</button>
                    </div>
                    {certifications.map((cert, idx) => (
                      <div className="form-group mt-6 p-4 bg-white rounded-lg border border-blue-200" key={`cert-${idx}`}>
                        <div className="flex justify-end mb-2">
                          <button type="button" onClick={() => { const newC = [...certifications]; newC.splice(idx, 1); setCertifications(newC); }} className="remove-btn">Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Name</label>
                            <input type="text" className="form-input" placeholder="e.g. AWS Solutions Architect" value={cert.name} onChange={(e) => { const newC = [...certifications]; newC[idx].name = e.target.value; setCertifications(newC); }} required />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Platform</label>
                            <select className="form-input" value={cert.platform} onChange={(e) => { const newC = [...certifications]; newC[idx].platform = e.target.value; setCertifications(newC); }} required>
                              <option value="" disabled>Select platform</option>
                              <option value="Coursera">Coursera</option>
                              <option value="Udemy">Udemy</option>
                              <option value="edX">edX</option>
                              <option value="NPTEL">NPTEL</option>
                              <option value="Pluralsight">Pluralsight</option>
                              <option value="LinkedIn Learning">LinkedIn Learning</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label>Domain</label>
                            <select className="form-input" value={cert.domain} onChange={(e) => { const newC = [...certifications]; newC[idx].domain = e.target.value; setCertifications(newC); }} required>
                              <option value="" disabled>Select domain</option>
                              <option value="Web Development">Web Development</option>
                              <option value="Machine Learning">Machine Learning</option>
                              <option value="Cloud">Cloud Compute</option>
                              <option value="Data Science">Data Science</option>
                              <option value="Security">Security</option>
                              <option value="Management">Management</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="action-row pt-6 border-t border-slate-100">
                    <button
                      className={`predict-btn step2 ${isPredicting ? 'disabled' : ''}`}
                      disabled={isPredicting || !isStep2Valid()}
                      onClick={handlePredict}
                    >
                      <Sparkles size={20} className="hover:animate-spin" />
                      Predict Career Outcomes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Profiler Preview that scales gracefully alongside Step 1 & 2 */}
          <div className="sidebar-column hidden lg:block">
            <div className="preview-panel reveal min-h-[400px]">
              <h3 className="preview-title"><User size={20} /> Your Profile Preview</h3>

              <div className="preview-card bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
                <span className="preview-label text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Academic Background</span>
                <span className="preview-value text-slate-800 font-semibold text-lg">
                  {degree ? `${degree} ${specialization ? `in ${specialization}` : ''}` : <span className="text-muted font-normal text-sm">Not selected</span>}
                </span>
                {academicScore && <div className="mt-3 text-sm font-semibold text-blue-600 border-t border-slate-100 pt-3">{isCgpa ? 'CGPA' : 'Score'}: {academicScore}</div>}
              </div>

              <div className="preview-card bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
                <span className="preview-label text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Core Subjects</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {coreSubjects.filter(sub => sub.grade !== '').length > 0 ? (
                    coreSubjects
                      .filter(sub => sub.grade !== '')
                      .map(sub => (
                        <span key={sub.name} className="px-3 py-1.5 bg-red-50/80 text-red-700 rounded-full text-xs font-bold shadow-sm border border-red-100">
                          {sub.name}: {sub.grade}
                        </span>
                      ))
                  ) : (
                    <span className="text-slate-400 text-sm">None graded</span>
                  )}
                </div>
              </div>

              <div className="preview-card bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
                <span className="preview-label text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Core Skills ({selectedCoreSkills.length})</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCoreSkills.length > 0 ? selectedCoreSkills.map(s => <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 shadow-sm rounded-full text-xs font-bold">{s}</span>) : <span className="text-slate-400 text-sm">None selected</span>}
                </div>
              </div>

              <div className="preview-card bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
                <span className="preview-label text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Experience & Portfolio</span>
                <div className="flex flex-col gap-3 mt-2">
                  <span className="text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg inline-flex items-center w-fit border border-slate-100">{experience ? `${experience} Years Expr.` : 'No professional experience (Fresher)'}</span>
                  {projects.length > 0 && <span className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg inline-flex items-center gap-2 border border-slate-100"><Briefcase size={16} className="text-blue-500" /> {projects.length} Applied Projects</span>}
                  {internships.length > 0 && <span className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg inline-flex items-center gap-2 border border-slate-100"><Building2 size={16} className="text-amber-500" /> {internships.length} Internships</span>}
                </div>
              </div>

              <div className="mt-8 text-center px-4 py-8 bg-white/50 border-2 border-dashed border-red-200 rounded-xl shadow-inner">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Target size={32} className="opacity-50" />
                  <span className="text-sm font-medium">Complete your profile to unlock precise career predictions.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
