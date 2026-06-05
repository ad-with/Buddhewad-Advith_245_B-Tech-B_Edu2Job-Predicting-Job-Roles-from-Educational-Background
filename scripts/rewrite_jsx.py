import re

with open("c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# We need to find the `return (` statement that starts the JSX.
# It is located after `interestOptions = NON_TECH_INTERESTS; }`
# We'll split the content there.
marker = "return ("

parts = content.split("return (", 1)
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
        <div className={`step-line ${result ? 'active' : ''}`}></div>
        <div className="step-wrapper">
          <div className={`step-item ${result ? 'completed active' : ''}`}>
            {result ? <CheckCircle2 size={24} /> : '3'}
          </div>
          <span className="step-label">Prediction</span>
        </div>
      </div>

      <div className="main-content-grid">
        <div className="form-column">
          <div className="form-card">
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
                    <h4 className="dynamic-section-title mb-4">Core Subjects <span className="text-muted text-sm">(Optional)</span></h4>

                    <div className="skill-search-wrapper">
                      <div className="skill-search-input-container">
                        <Search className="search-icon" size={18} />
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
                <button className="back-btn" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back to Academic
                </button>
                <div className="form-section-title">Step 2: Skills & Experience</div>

                {/* CORE SKILLS */}
                <div className="form-group">
                  <div className="section-header-flex">
                    <label style={{margin: 0}}>Core Skills <span className="text-muted font-normal">(Select at least 2)</span></label>
                  </div>

                  <div className="skill-search-wrapper">
                    <div className="skill-search-input-container">
                      <Search className="search-icon" size={18} />
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

                <div className="action-row pt-6 border-t border-slate-100">
                  <button
                    className={`predict-btn step2 ${isPredicting ? 'disabled' : ''}`}
                    disabled={isPredicting || !isStep2Valid()}
                    onClick={handlePredict}
                  >
                    {isPredicting ? (
                      <>
                        <BrainCircuit className="spin-icon" size={20} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} className="hover:animate-spin" />
                        Predict Career Outcomes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar-column">
          {result ? (
            <div className="result-card main-result reveal">
              <div className="result-header">
                <span className="ai-badge"><Sparkles size={16} /> AI Matched Role</span>
              </div>
              <h2 className="predicted-role">{result.role}</h2>
              <p className="text-muted mt-2">{result.explanation.split('\\n')[0]}</p>

              <div className="confidence-score">
                <div className="confidence-circle">
                  {result.confidence}%
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Confidence Match</h4>
                  <p className="text-sm text-slate-500">Based on your academic performance, skills, and industry alignment</p>
                </div>
              </div>

              <div className="match-grid">
                <div className="match-card success">
                  <h4><CheckCircle2 size={18} /> Matched Skills</h4>
                  <div className="match-skill-list">
                    {result.matchedSkills.length > 0 ? result.matchedSkills.map(s => <span key={s} className="match-skill-pill">{s}</span>) : <span className="text-sm opacity-80">None</span>}
                  </div>
                </div>
                <div className="match-card warning">
                  <h4><BrainCircuit size={18} /> Required to Learn</h4>
                  <div className="match-skill-list">
                    {result.missingSkills.length > 0 ? result.missingSkills.map(s => <span key={s} className="match-skill-pill">{s}</span>) : <span className="text-sm opacity-80">None! You are well prepared.</span>}
                  </div>
                </div>
              </div>

              {result.predictions && result.predictions.length > 1 && (
                <div className="alt-roles-container">
                  <h4 className="font-bold text-slate-800">Other Potential Paths</h4>
                  {result.predictions.slice(1, 4).map((p, i) => (
                    <div key={i} className="alt-role-card">
                      <div className="flex items-center gap-3 font-semibold text-slate-700">
                        {i === 0 ? <Medal size={18} className="text-slate-400" /> : <Medal size={18} className="text-amber-600" />}
                        {p.role}
                      </div>
                      <span className="font-bold text-blue-600">{p.score}%</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="next-steps-list">
                <h4 className="font-bold text-slate-800 mb-4">Recommended Next Steps</h4>
                {result.actions.map((act, i) => (
                  <div key={i} className="next-step-item">
                    <CheckCircle2 size={16} /> {act}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button className="back-btn w-full justify-center" style={{margin: 0}} onClick={() => setResult(null)}>Refine Profile</button>
              </div>
            </div>
          ) : (
            <div className="preview-panel reveal">
              <h3 className="preview-title"><User size={20} /> Your Profile Preview</h3>
              
              <div className="preview-card">
                <span className="preview-label">Academic Background</span>
                <span className="preview-value">
                  {degree ? `${degree} ${specialization ? `in ${specialization}` : ''}` : <span className="text-muted font-normal">Not selected</span>}
                </span>
                {academicScore && <div className="mt-2 text-sm font-semibold text-blue-600 border-t pt-2 mt-2">{isCgpa ? 'CGPA' : 'Score'}: {academicScore}</div>}
              </div>

              <div className="preview-card">
                <span className="preview-label">Core Skills ({selectedCoreSkills.length})</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCoreSkills.length > 0 ? selectedCoreSkills.map(s => <span key={s} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">{s}</span>) : <span className="text-muted text-sm">None</span>}
                </div>
              </div>

              <div className="preview-card">
                <span className="preview-label">Experience & Portfolio</span>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-sm font-medium">{experience ? `${experience} Years Expr.` : 'Fresher'}</span>
                  {projects.length > 0 && <span className="text-sm text-slate-600 flex items-center gap-2"><Briefcase size={14}/> {projects.length} Projects</span>}
                  {internships.length > 0 && <span className="text-sm text-slate-600 flex items-center gap-2"><Building2 size={14}/> {internships.length} Internships</span>}
                </div>
              </div>
              
              <div className="mt-8 text-center px-4 py-6 border-2 border-dashed border-red-200 rounded-lg">
                {isPredicting ? (
                  <div className="flex flex-col items-center gap-3 text-red-500">
                    <BrainCircuit size={32} className="spin-icon" />
                    <span className="font-semibold text-sm">AI is compiling...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Target size={32} />
                    <span className="text-sm font-medium">Complete your profile to unlock precise career predictions.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"""
    
    final_content = prefix + new_jsx
    with open("c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.jsx", "w", encoding="utf-8") as f:
        f.write(final_content)
    print("JSX updated successfully")
else:
    print("Could not find the start of the return statement.")


