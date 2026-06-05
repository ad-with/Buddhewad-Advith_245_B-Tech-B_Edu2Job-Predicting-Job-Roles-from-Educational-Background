import re

with open("c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.jsx", "r", encoding="utf-8") as f:
    content = f.read()

parts = content.split('return (', 1)
if len(parts) == 2:
    prefix = parts[0]
    
    new_jsx = """return (
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
        <div className="full-width-result-container reveal">
          <div className="result-card main-result text-center p-12">
            <div className="result-header justify-center mb-6">
              <span className="ai-badge text-lg px-6 py-2"><Sparkles size={20} /> AI Predicted Career Match</span>
            </div>
            
            <h2 className="predicted-role justify-center text-5xl mb-8">{result.role}</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">{result.explanation.split('\\n')[0]}</p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-16 mb-16 border-y border-slate-100 py-12">
              <div className="confidence-score m-0 flex-col gap-4">
                <div className="confidence-circle" style={{width: '140px', height: '140px', fontSize: '2rem'}}>
                  {result.confidence}%
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-slate-800 text-xl">Confidence Score</h4>
                  <p className="text-sm text-slate-500">Based on data match</p>
                </div>
              </div>

              <div className="flex-1 max-w-2xl text-left">
                <div className="match-grid m-0">
                  <div className="match-card success">
                    <h4 className="text-lg"><CheckCircle2 size={20} /> Matched Skills</h4>
                    <div className="match-skill-list mt-3">
                      {result.matchedSkills.length > 0 ? result.matchedSkills.map(s => <span key={s} className="match-skill-pill bg-white text-green-700 font-medium px-3 py-1 scaleIn">{s}</span>) : <span className="text-sm opacity-80">None</span>}
                    </div>
                  </div>
                  <div className="match-card warning">
                    <h4 className="text-lg"><BrainCircuit size={20} /> Missing Skills to Learn</h4>
                    <div className="match-skill-list mt-3">
                      {result.missingSkills.length > 0 ? result.missingSkills.map(s => <span key={s} className="match-skill-pill bg-white text-amber-700 font-medium px-3 py-1 scaleIn">{s}</span>) : <span className="text-sm opacity-80">None! You are well prepared.</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-left mb-16">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Why this role fits you</h3>
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-slate-700 leading-relaxed text-lg">
                {result.explanation.split('\\n').slice(1).map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">{line}</p>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto text-left mb-16">
              <div>
                <h4 className="font-bold text-slate-800 text-xl mb-6">Recommended Next Steps</h4>
                <div className="flex flex-col gap-3">
                  {result.actions.map((act, i) => (
                    <div key={i} className="next-step-item bg-white border border-slate-200 shadow-sm text-lg py-4 px-5">
                      <CheckCircle2 size={20} className="text-blue-500 min-w-[20px]" /> 
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {result.predictions && result.predictions.length > 1 && (
                  <div className="alt-roles-container mt-0">
                    <h4 className="font-bold text-slate-800 text-xl mb-6">Alternative Paths</h4>
                    <div className="flex flex-col gap-3">
                      {result.predictions.slice(1, 4).map((p, i) => (
                        <div key={i} className="alt-role-card shadow-sm border border-slate-200 py-4 px-5 text-lg">
                          <div className="flex items-center gap-3 font-semibold text-slate-700">
                            {i === 0 ? <Medal size={22} className="text-slate-400" /> : <Medal size={22} className="text-amber-600" />}
                            {p.role}
                          </div>
                          <span className="font-bold text-blue-600">{p.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-16 pt-8 border-t border-slate-100">
              <button className="back-btn px-8 py-3 text-lg" onClick={() => { setStep(1); setResult(null); }}>
                Restart Analysis
              </button>
              <button className="predict-btn w-auto px-8 py-3 text-lg" onClick={() => { setStep(2); setResult(null); }}>
                Refine Inputs & Recalculate
              </button>
            </div>
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

                  <div className="form-grid">
                    <div className="form-group">
                      <div className="section-header-flex">
                        <label style={{margin: 0}}>{isCgpa ? 'CGPA' : 'Percentage'}</label>
                        <button type="button" className="toggle-mini" onClick={() => setIsCgpa(!isCgpa)}>
                          Switch to {isCgpa ? '%' : 'CGPA'}
                        </button>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        placeholder={isCgpa ? "e.g. 9.5" : "e.g. 85"}
                        value={academicScore}
                        onChange={(e) => setAcademicScore(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>10th Marks (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 92"
                        value={marks10th}
                        onChange={(e) => setMarks10th(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>12th Marks (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 88"
                        value={marks12th}
                        onChange={(e) => setMarks12th(e.target.value)}
                        required
                      />
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
                      <label style={{margin: 0}}>Core Skills <span className="text-muted font-normal">(Select at least 2)</span></label>
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
                        <button key={skill} type="button" className="skill-chip unselected" onClick={() => toggleItem(skill, selectedCoreSkills, setSelectedCoreSkills)}>
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
                          <div className="form-group" style={{margin: 0}}>
                            <label>Title</label>
                            <input type="text" className="form-input" placeholder="Project Name" value={proj.title} onChange={(e) => { const newP = [...projects]; newP[idx].title = e.target.value; setProjects(newP); }} required />
                          </div>
                          <div className="form-group" style={{margin: 0}}>
                            <label>Your Role</label>
                            <input type="text" className="form-input" placeholder="e.g. Lead Developer" value={proj.role} onChange={(e) => { const newP = [...projects]; newP[idx].role = e.target.value; setProjects(newP); }} required />
                          </div>
                        </div>
                        <div className="form-group mt-4" style={{margin: 0}}>
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
                          <div className="form-group" style={{margin: 0}}>
                            <label>Company</label>
                            <input type="text" className="form-input" placeholder="e.g. Google" value={int.company} onChange={(e) => { const newI = [...internships]; newI[idx].company = e.target.value; setInternships(newI); }} required />
                          </div>
                          <div className="form-group" style={{margin: 0}}>
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
                          <div className="form-group" style={{margin: 0}}>
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
                          <div className="form-group" style={{margin: 0}}>
                            <label>Name</label>
                            <input type="text" className="form-input" placeholder="e.g. AWS Solutions Architect" value={cert.name} onChange={(e) => { const newC = [...certifications]; newC[idx].name = e.target.value; setCertifications(newC); }} required />
                          </div>
                          <div className="form-group" style={{margin: 0}}>
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
                          <div className="form-group" style={{margin: 0}}>
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
                  {projects.length > 0 && <span className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg inline-flex items-center gap-2 border border-slate-100"><Briefcase size={16} className="text-blue-500"/> {projects.length} Applied Projects</span>}
                  {internships.length > 0 && <span className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg inline-flex items-center gap-2 border border-slate-100"><Building2 size={16} className="text-amber-500"/> {internships.length} Internships</span>}
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
"""
    
    with open("c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.jsx", "w", encoding="utf-8") as f:
        f.write(prefix + new_jsx)

print("Rewritten successfully")
