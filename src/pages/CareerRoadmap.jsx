"use client"

import { useState } from "react"
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Compass,
  Rocket,
  Target,
  Brain,
  Wrench,
  Code,
  Award,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react"
import "./CareerRoadmap.css"

// Mock data for realistic demo
const MOCK_ROADMAPS = {
  "data-scientist": {
    brief: [
      "Master Python fundamentals and data manipulation with Pandas/NumPy",
      "Build strong statistical foundation and learn exploratory data analysis",
      "Develop machine learning expertise with scikit-learn and deep learning with TensorFlow/PyTorch",
      "Create portfolio projects showcasing end-to-end ML pipelines",
      "Gain production experience with MLOps tools and cloud platforms",
    ],
    detailed: [
      {
        month_or_phase: "Month 1-2",
        focus_area: "Python & Data Foundations",
        skills_to_learn: ["Python Programming", "Pandas", "NumPy", "Data Cleaning", "SQL"],
        tools_to_practice: ["Jupyter Notebook", "VS Code", "PostgreSQL", "Git"],
        projects_to_build: [
          "Build a data cleaning pipeline for messy CSV datasets",
          "Create an automated reporting system with Python",
        ],
        certifications: ["Google Data Analytics Certificate"],
      },
      {
        month_or_phase: "Month 3-4",
        focus_area: "Statistics & Visualization",
        skills_to_learn: ["Descriptive Statistics", "Probability", "Hypothesis Testing", "Data Visualization"],
        tools_to_practice: ["Matplotlib", "Seaborn", "Plotly", "Tableau"],
        projects_to_build: [
          "Perform A/B test analysis for an e-commerce dataset",
          "Build interactive dashboards for sales analytics",
        ],
        certifications: ["IBM Data Science Professional Certificate"],
      },
      {
        month_or_phase: "Month 5-6",
        focus_area: "Machine Learning Fundamentals",
        skills_to_learn: ["Supervised Learning", "Unsupervised Learning", "Feature Engineering", "Model Evaluation"],
        tools_to_practice: ["scikit-learn", "XGBoost", "MLflow", "Weights & Biases"],
        projects_to_build: [
          "Build a customer churn prediction model",
          "Create a recommendation system for movie ratings",
        ],
        certifications: ["AWS Machine Learning Specialty"],
      },
    ],
  },
  "frontend-developer": {
    brief: [
      "Master HTML, CSS, and JavaScript fundamentals",
      "Learn React.js and modern frontend frameworks",
      "Understand state management and API integration",
      "Build responsive, accessible web applications",
      "Deploy and optimize production applications",
    ],
    detailed: [
      {
        month_or_phase: "Month 1-2",
        focus_area: "Web Fundamentals",
        skills_to_learn: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design", "Git"],
        tools_to_practice: ["VS Code", "Chrome DevTools", "Figma", "GitHub"],
        projects_to_build: [
          "Build a personal portfolio website from scratch",
          "Create a responsive landing page with animations",
        ],
        certifications: ["freeCodeCamp Responsive Web Design"],
      },
      {
        month_or_phase: "Month 3-4",
        focus_area: "React & Modern Frameworks",
        skills_to_learn: ["React.js", "TypeScript", "Component Architecture", "Hooks", "Context API"],
        tools_to_practice: ["Next.js", "Vite", "Tailwind CSS", "shadcn/ui"],
        projects_to_build: [
          "Build a full-featured task management app",
          "Create a weather dashboard with API integration",
        ],
        certifications: ["Meta Front-End Developer Certificate"],
      },
      {
        month_or_phase: "Month 5-6",
        focus_area: "Advanced Patterns & Deployment",
        skills_to_learn: ["State Management", "Testing", "Performance Optimization", "Accessibility"],
        tools_to_practice: ["Redux/Zustand", "Jest", "Playwright", "Vercel"],
        projects_to_build: [
          "Build an e-commerce storefront with cart functionality",
          "Create a real-time chat application",
        ],
        certifications: ["Google UX Design Certificate"],
      },
    ],
  },
  "ai-engineer": {
    brief: [
      "Build strong foundation in Python and software engineering",
      "Master machine learning and deep learning concepts",
      "Learn Large Language Models and prompt engineering",
      "Develop expertise in AI application deployment",
      "Build production AI systems with RAG and agents",
    ],
    detailed: [
      {
        month_or_phase: "Month 1-2",
        focus_area: "Programming & ML Foundations",
        skills_to_learn: ["Python", "Linear Algebra", "Calculus", "Neural Networks Basics", "PyTorch"],
        tools_to_practice: ["Google Colab", "Hugging Face", "Weights & Biases", "Docker"],
        projects_to_build: [
          "Implement neural networks from scratch",
          "Fine-tune a pre-trained image classifier",
        ],
        certifications: ["DeepLearning.AI TensorFlow Developer"],
      },
      {
        month_or_phase: "Month 3-4",
        focus_area: "Large Language Models",
        skills_to_learn: ["Transformers", "Prompt Engineering", "Fine-tuning LLMs", "RAG Systems", "Vector Databases"],
        tools_to_practice: ["OpenAI API", "LangChain", "Pinecone", "ChromaDB"],
        projects_to_build: [
          "Build a document Q&A chatbot with RAG",
          "Create a code review assistant with GPT-4",
        ],
        certifications: ["DeepLearning.AI LLM Specialization"],
      },
      {
        month_or_phase: "Month 5-6",
        focus_area: "Production AI Systems",
        skills_to_learn: ["MLOps", "Model Serving", "AI Agents", "Evaluation & Monitoring", "Cost Optimization"],
        tools_to_practice: ["FastAPI", "Kubernetes", "LangGraph", "Vercel AI SDK"],
        projects_to_build: [
          "Deploy a multi-agent AI system for research",
          "Build an AI-powered SaaS application",
        ],
        certifications: ["AWS Solutions Architect"],
      },
    ],
  },
  default: {
    brief: [
      "Assess current skills and identify knowledge gaps",
      "Build foundational competencies required for the role",
      "Develop hands-on experience through projects",
      "Gain relevant certifications and credentials",
      "Network and apply for target positions",
    ],
    detailed: [
      {
        month_or_phase: "Month 1-2",
        focus_area: "Foundation Building",
        skills_to_learn: ["Core Technical Skills", "Industry Knowledge", "Communication", "Problem Solving"],
        tools_to_practice: ["Industry Standard Tools", "Documentation", "Version Control"],
        projects_to_build: [
          "Complete foundational tutorials and courses",
          "Build a beginner-level project for your portfolio",
        ],
        certifications: ["Relevant Entry-Level Certification"],
      },
      {
        month_or_phase: "Month 3-4",
        focus_area: "Intermediate Development",
        skills_to_learn: ["Advanced Concepts", "Best Practices", "Team Collaboration", "Code Review"],
        tools_to_practice: ["Professional Tools", "CI/CD Pipelines", "Cloud Platforms"],
        projects_to_build: [
          "Build a medium-complexity project",
          "Contribute to open source projects",
        ],
        certifications: ["Professional Level Certification"],
      },
      {
        month_or_phase: "Month 5-6",
        focus_area: "Job Readiness",
        skills_to_learn: ["System Design", "Leadership", "Interview Prep", "Negotiation"],
        tools_to_practice: ["Mock Interview Platforms", "Portfolio Sites", "LinkedIn"],
        projects_to_build: [
          "Complete a capstone project",
          "Prepare case studies from your work",
        ],
        certifications: ["Specialist Certification"],
      },
    ],
  },
}

// Mock API service
const aiService = {
  generateRoadmap: async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const targetLower = payload.target_role.toLowerCase()
    let mockData
    if (targetLower.includes("data") && targetLower.includes("scien")) {
      mockData = MOCK_ROADMAPS["data-scientist"]
    } else if (targetLower.includes("frontend") || targetLower.includes("front-end") || targetLower.includes("react")) {
      mockData = MOCK_ROADMAPS["frontend-developer"]
    } else if (targetLower.includes("ai") || targetLower.includes("machine learning") || targetLower.includes("ml")) {
      mockData = MOCK_ROADMAPS["ai-engineer"]
    } else {
      mockData = MOCK_ROADMAPS["default"]
    }
    const adjustedDetailed = mockData.detailed.map((stage, idx) => {
      const monthsPerStage = Math.ceil(payload.timeline_months / mockData.detailed.length)
      const startMonth = idx * monthsPerStage + 1
      const endMonth = Math.min((idx + 1) * monthsPerStage, payload.timeline_months)
      return {
        ...stage,
        month_or_phase: `Month ${startMonth}-${endMonth}`,
      }
    })
    return {
      brief_roadmap: mockData.brief,
      detailed_roadmap: adjustedDetailed,
    }
  },
}

const POPULAR_TARGETS = [
  "Data Scientist", "Frontend Developer", "AI Engineer", "Backend Developer", "Full Stack Developer"
]

const CURRENT_ROLES = [
  "Student", "Fresher", "Junior Developer", "Analyst", "Career Changer"
]

export default function CareerRoadmap() {
  const [currentRole, setCurrentRole] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [timelineMonths, setTimelineMonths] = useState(6)
  const [experienceLevel, setExperienceLevel] = useState("fresher")
  const [isGenerating, setIsGenerating] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!currentRole || !targetRole) {
      setErrorMsg("Please provide both current and target roles.")
      return
    }
    setErrorMsg("")
    setIsGenerating(true)
    setRoadmap(null)
    try {
      const payload = {
        current_role: currentRole,
        target_role: targetRole,
        timeline_months: timelineMonths,
        experience_level: experienceLevel,
      }
      const response = await aiService.generateRoadmap(payload)
      setRoadmap({
        brief: response.brief_roadmap || [],
        detailed: response.detailed_roadmap || [],
      })
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate roadmap. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusLabel = (idx, total) => {
    if (idx === 0) return "Start Status"
    if (idx === total - 1) return "Career Goal"
    return "Milestone"
  }

  const getStageHeaderColor = (idx, total) => {
    if (idx === 0) return "oklch(0.65 0.20 250)" // Blue for current
    if (idx === total - 1) return "oklch(0.65 0.20 155)" // Green for target
    return "oklch(0.65 0.20 280)" // Indigo for mid
  }

  return (
    <div className="roadmap-page">
      <div className="pattern-overlay" />
      
      <header className="roadmap-header no-print">
        <div className="header-container">
          <div className="header-icon-box">
            <TrendingUp size={24} />
          </div>
          <div className="header-titles">
            <h1>Career Roadmap</h1>
            <p>AI-powered career progression planning</p>
          </div>
        </div>
      </header>

      {/* Print-only Header */}
      <div className="print-only-header">
        <h1>Career Strategy & Roadmap Report</h1>
        <div className="report-metadata">
          <p><strong>Target Role:</strong> {targetRole}</p>
          <p><strong>Current Status:</strong> {currentRole}</p>
          <p><strong>Timeline:</strong> {timelineMonths} Months</p>
          <p><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
        </div>
        <div className="report-border" />
      </div>

      <main className="roadmap-main">
        <div className="roadmap-grid">
          
          <aside className="form-panel no-print">
            <div className="form-card">
              <div className="form-header">
                <div className="form-header-icon">
                  <Compass size={20} />
                </div>
                <h2 style={{fontSize: '1.125rem', fontWeight: '600'}}>Map Your Path</h2>
              </div>
              <div className="form-body">
                <form onSubmit={handleGenerate} className="input-stack">
                  
                  <div className="field-group">
                    <label className="field-label"><GraduationCap size={16} /> Current Status</label>
                    <select value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} className="form-control">
                      <option value="">Select current role</option>
                      {CURRENT_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input className="form-control" style={{marginTop: '0.5rem'}} placeholder="Or type custom..." value={!CURRENT_ROLES.includes(currentRole) ? currentRole : ""} onChange={(e) => setCurrentRole(e.target.value)} />
                  </div>

                  <div className="field-group">
                    <label className="field-label"><Briefcase size={16} /> Target Role</label>
                    <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="form-control">
                      <option value="">Select target role</option>
                      {POPULAR_TARGETS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input className="form-control" style={{marginTop: '0.5rem'}} placeholder="Or type custom..." value={!POPULAR_TARGETS.includes(targetRole) ? targetRole : ""} onChange={(e) => setTargetRole(e.target.value)} />
                  </div>

                  <div className="field-group">
                    <label className="field-label"><Calendar size={16} /> Timeline</label>
                    <select value={timelineMonths} onChange={(e) => setTimelineMonths(parseInt(e.target.value))} className="form-control">
                      <option value={3}>3 Months (Intensive)</option>
                      <option value={6}>6 Months (Recommended)</option>
                      <option value={12}>12 Months (Thorough)</option>
                    </select>
                  </div>

                  {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}

                  <button type="submit" className="generate-button" disabled={isGenerating}>
                    {isGenerating ? <><Clock size={18} className="animate-spin" /> Crafting...</> : <><Sparkles size={18} /> Generate Roadmap</>}
                  </button>
                </form>
              </div>
            </div>
          </aside>

          <section className="content-panel">
            {!roadmap && !isGenerating && (
              <div className="empty-state no-print">
                <div style={{background: 'rgba(0,0,0,0.05)', width: 'fit-content', padding: '1.5rem', borderRadius: '50%', margin: '0 auto 1.5rem'}}>
                  <Compass size={48} color="var(--primary)" />
                </div>
                <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem'}}>Ready to Plan Your Career?</h3>
                <p style={{color: 'var(--muted-foreground)', maxWidth: '400px', margin: '0 auto'}}>Fill out your details to generate an AI-powered roadmap with personalized skills and projects.</p>
              </div>
            )}

            {isGenerating && (
              <div className="loading-state">
                <SpinnerIcon />
                <p style={{marginTop: '1.5rem', fontWeight: '600'}}>Analyzing market trends and crafting your path...</p>
              </div>
            )}

            {roadmap && !isGenerating && (
              <div className="roadmap-output">
                <div className="summary-card">
                  <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem'}}>
                    <Target size={20} color="var(--primary)" /> Executive Progression Strategy
                  </h3>
                  <ul style={{listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {roadmap.brief.map((step, idx) => (
                      <li key={idx} style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                        <CheckCircle2 size={18} color="var(--primary)" style={{marginTop: '0.2rem'}} />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="stage-list">
                  {roadmap.detailed.map((stage, index) => {
                    const headerColor = getStageHeaderColor(index, roadmap.detailed.length)
                    return (
                      <div key={index} className="stage-item">
                        <div className="stage-marker">
                          <div className="marker-dot" style={{borderColor: headerColor}}>
                            <MapPin size={20} color={headerColor} />
                          </div>
                        </div>
                        <div className="stage-card" style={{borderLeftColor: headerColor}}>
                          <div className="stage-card-body">
                            <div className="stage-badges">
                              <span className="badge badge-time"><Clock size={12} /> {stage.month_or_phase}</span>
                              <span className="badge badge-status" style={{background: headerColor}}>{getStatusLabel(index, roadmap.detailed.length)}</span>
                            </div>
                            <h4 className="stage-title">{stage.focus_area}</h4>
                            
                            <div className="stage-grid">
                              <div className="skills-box">
                                <p className="box-label"><Brain size={14} /> Core Skills</p>
                                <div className="chip-group">
                                  {stage.skills_to_learn.map(s => <span key={s} className="chip">{s}</span>)}
                                </div>
                              </div>
                              <div className="tools-box">
                                <p className="box-label"><Wrench size={14} /> Tools</p>
                                <div className="chip-group">
                                  {stage.tools_to_practice.map(t => <span key={t} className="chip">{t}</span>)}
                                </div>
                              </div>
                            </div>

                            <div className="projects-section">
                              <p className="box-label" style={{color: '#10b981'}}><Code size={14} /> Projects</p>
                              <div className="project-list">
                                {stage.projects_to_build.map(p => (
                                  <div key={p} className="project-item">
                                    <Rocket size={16} color="#10b981" /> <span>{p}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="roadmap-footer no-print">
                  <div>
                    <h3 style={{fontWeight: '600'}}>Strategic Roadmap Complete</h3>
                    <p style={{fontSize: '0.875rem', color: 'var(--muted-foreground)'}}>Generate a professional PDF report to save your progress</p>
                  </div>
                  <div className="footer-actions">
                    <button className="btn-primary" onClick={() => window.print()}>
                      <Sparkles size={16} /> Generate Full Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function SpinnerIcon() {
  return (
    <div className="animate-spin" style={{width: '3rem', height: '3rem', border: '4px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto'}}></div>
  )
}
