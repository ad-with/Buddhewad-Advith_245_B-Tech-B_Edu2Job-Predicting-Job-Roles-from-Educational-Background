import re

file_path = "c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

start_str = '<div className="full-width-result-container reveal bg-[#F8FAFC] py-12 px-6 min-h-screen">'
end_str = '        </div>\n      ) : (\n        <div className="main-content-grid">'

parts = content.split(start_str, 1)
if len(parts) == 2:
    end_parts = parts[1].split(end_str, 1)
    if len(end_parts) == 2:
        new_jsx = """<div className="full-width-result-container reveal bg-[#F8FAFC] py-12 px-4 sm:px-6 min-h-screen">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Header Area */}
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#2563EB] font-bold text-sm mb-6 shadow-sm border border-blue-100">
                <Sparkles size={18} /> Analysis Complete
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4" style={{ background: 'linear-gradient(to right, #2563eb, #dc2626)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Your Top Career Matches
              </h2>
              <p className="text-[#4b5563] text-lg font-medium max-w-2xl mx-auto">
                Based on our AI analysis of your academic background, core skills, and experience profile.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#2563EB]/10 to-[#dc2626]/10 mx-auto mt-6 rounded-full"></div>
            </div>

            {/* 1. Top 3 Predictions Outline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* RANK 1 CARD */}
              <div 
                className="rounded-[12px] p-5 relative transform hover:-translate-y-2 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                  border: '2px solid rgba(37,99,235,0.2)',
                  borderTop: '2px solid #2563EB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(37, 99, 235, 0.2)';
                  e.currentTarget.style.borderColor = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)';
                  e.currentTarget.style.borderTopColor = '#2563EB';
                }}
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#d97706] text-white flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white z-10">
                  #1
                </div>
                
                <div className="text-center mt-3 h-full flex flex-col justify-between">
                  <h3 className="text-[20px] font-bold text-[#1e293b] leading-tight mb-5 line-clamp-2">{result.role}</h3>
                  
                  <div className="flex flex-col items-center justify-center relative my-4">
                    <svg className="w-[80px] h-[80px] transform -rotate-90">
                      <circle cx="40" cy="40" r="34" className="stroke-[#e5e7eb]" strokeWidth="6" fill="none" />
                      <circle 
                        cx="40" cy="40" r="34" 
                        className="stroke-[#fbbf24] transition-all duration-1000 ease-out" 
                        strokeWidth="6" fill="none" 
                        strokeDasharray="213.6" 
                        strokeDashoffset={213.6 - (213.6 * result.confidence) / 100} 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-[#1e293b]">{result.confidence}%</span>
                    </div>
                  </div>
                  <span className="text-[#6b7280] text-[14px] font-semibold mt-1">Match</span>
                </div>
              </div>

              {/* RANKS 2 & 3 CARDS */}
              {(result.predictions && result.predictions.length > 1 ? result.predictions.slice(1, 3) : [
                { role: "Alternative Role 1", score: Math.max(10, result.confidence - 15) },
                { role: "Alternative Role 2", score: Math.max(5, result.confidence - 25) }
              ]).map((p, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-[12px] p-5 relative transform hover:-translate-y-2 transition-all duration-300 border-[2px] border-[#e5e7eb]"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(37, 99, 235, 0.2)';
                    e.currentTarget.style.borderColor = '#c7d2fe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white z-10 ${i === 0 ? 'bg-[#c7d2fe] text-[#4f46e5]' : 'bg-[#fed7aa] text-[#c2410c]'}`}>
                    #{i + 2}
                  </div>
                  <div className="text-center mt-3 h-full flex flex-col justify-between">
                    <h3 className="text-[20px] font-bold text-[#1e293b] leading-tight mb-5 line-clamp-2">{p.role === result.role ? `${p.role} (Alt)` : p.role}</h3>
                    <div className="flex flex-col items-center justify-center relative my-4">
                      <svg className="w-[80px] h-[80px] transform -rotate-90">
                        <circle cx="40" cy="40" r="34" className="stroke-[#e5e7eb]" strokeWidth="6" fill="none" />
                        <circle 
                          cx="40" cy="40" r="34" 
                          className={`transition-all duration-1000 ease-out ${i === 0 ? 'stroke-[#818cf8]' : 'stroke-[#fb923c]'}`} 
                          strokeWidth="6" fill="none" 
                          strokeDasharray="213.6" 
                          strokeDashoffset={213.6 - (213.6 * p.score) / 100} 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-[#1e293b]">{p.score}%</span>
                      </div>
                    </div>
                    <span className="text-[#6b7280] text-[14px] font-semibold mt-1">Match</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Skills Analysis Section */}
            <div 
              className="rounded-[16px] p-7 md:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(220,38,38,0.06) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(37,99,235,0.2)',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Matched Skills column */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e5e7eb] flex flex-col h-full overflow-hidden">
                  <div className="bg-[#d1fae5] px-4 py-3 flex items-center justify-between border-b border-[#a7f3d0]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-[#10b981]" />
                      <h4 className="text-[16px] font-bold text-[#065f46] m-0 leading-none">Matched Skills</h4>
                    </div>
                    <span className="bg-white text-[#065f46] text-xs font-bold px-2 py-1 rounded-full shadow-sm">{result.matchedSkills.length}</span>
                  </div>
                  <div className="p-5 flex-1 bg-white">
                    <div className="flex flex-wrap gap-2">
                      {result.matchedSkills.length > 0 ? result.matchedSkills.map(s => (
                        <span key={s} className="px-3 py-2 bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] rounded-full text-[14px] font-semibold tracking-wide">
                          {s}
                        </span>
                      )) : (
                        <span className="text-[#6b7280] text-[14px] font-medium italic">No direct skills matched.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills to Learn column */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e5e7eb] flex flex-col h-full overflow-hidden">
                  <div className="bg-[#fef3c7] px-4 py-3 flex items-center justify-between border-b border-[#fcd34d]">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={18} className="text-[#f59e0b]" />
                      <h4 className="text-[16px] font-bold text-[#92400e] m-0 leading-none">Skills to Learn</h4>
                    </div>
                    <span className="bg-white text-[#92400e] text-xs font-bold px-2 py-1 rounded-full shadow-sm">{result.missingSkills.length}</span>
                  </div>
                  <div className="p-5 flex-1 bg-white">
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.length > 0 ? result.missingSkills.map(s => (
                        <span key={s} className="px-3 py-2 bg-[#fef3c7] text-[#92400e] border border-[#fcd34d] rounded-full text-[14px] font-semibold tracking-wide">
                          {s}
                        </span>
                      )) : (
                        <span className="text-[#6b7280] text-[14px] font-medium italic">You are highly equipped! No core skills missing.</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Why This Role Fits You */}
            <div 
              className="rounded-[16px] p-7 md:p-8 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(220,38,38,0.06) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(220,38,38,0.2)',
              }}
            >
              <h3 className="text-[20px] font-bold text-[#1e293b] mb-5 flex items-center gap-2">
                <BrainCircuit size={20} className="text-[#2563eb]" /> Why This Role Fits You
              </h3>
              
              <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-5 shadow-sm">
                <div className="text-[#4b5563] text-[16px] leading-[1.6] font-normal">
                  {result.explanation.split('\\n').map((line, i) => (
                    <p key={i} className="mb-3 last:mb-0">
                      {line.split(' ').map((word, idx) => {
                        const lower = word.toLowerCase();
                        const highlight = result.matchedSkills.some(s => lower.includes(s.toLowerCase())) 
                                       || result.missingSkills.some(s => lower.includes(s.toLowerCase()));
                        return highlight ? <strong key={idx} className="text-[#2563EB] bg-[#eff6ff] px-1 rounded font-semibold">{word} </strong> : word + " ";
                      })}
                    </p>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#e5e7eb]">
                  <div className="bg-white rounded-[8px] border border-[#e5e7eb] py-4 px-3 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1 block text-center">Profile Match</span>
                    <span className="text-[28px] font-bold text-[#2563eb] leading-none block text-center">{result.confidence}%</span>
                  </div>
                  <div className="bg-white rounded-[8px] border border-[#e5e7eb] py-4 px-3 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1 block text-center">Skills Aligned</span>
                    <span className="text-[28px] font-bold text-[#10b981] leading-none block text-center">{result.matchedSkills.length}/{result.matchedSkills.length + result.missingSkills.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Recommended Next Steps Timeline */}
            <div 
              className="rounded-[16px] p-7 md:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(220,38,38,0.06) 100%)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(37,99,235,0.2)',
              }}
            >
              <h3 className="text-[20px] font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                <Compass size={20} className="text-[#2563eb]" /> Recommended Next Steps
              </h3>

              <div className="flex flex-col relative pl-2">
                {result.actions.map((act, i) => {
                  const icons = [BrainCircuit, Briefcase, Award];
                  const IconComponent = icons[i % icons.length];
                  const isLast = i === result.actions.length - 1;

                  return (
                    <div key={i} className="flex gap-4 relative group" style={{ marginBottom: isLast ? 0 : '16px' }}>
                      
                      {/* Vertical Connector Line */}
                      {!isLast && (
                        <div 
                          className="absolute left-[17px] top-[36px] w-[2px] z-0" 
                          style={{ 
                            background: 'linear-gradient(to bottom, #2563eb, #dc2626)',
                            height: 'calc(100% - 20px)'
                          }}
                        ></div>
                      )}

                      {/* Step Number Badge */}
                      <div className="w-[36px] h-[36px] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-[16px] z-10 shadow-md relative" style={{background: 'linear-gradient(135deg, #2563eb, #dc2626)'}}>
                        {i + 1}
                      </div>

                      {/* Step Content */}
                      <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-4 flex-1 shadow-sm transition-all duration-300 group-hover:bg-[#eff6ff] group-hover:translate-x-1 group-hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] group-hover:border-[#bfdbfe] flex items-center gap-3">
                        <IconComponent size={18} className="text-[#2563eb] flex-shrink-0" />
                        <span className="text-[16px] font-medium text-[#374151] leading-[1.5]">{act}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Interactivity Footers (Not in brief explicitly styled but critical for flow) */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 pb-10">
              <button 
                className="w-full sm:w-auto px-6 py-3 bg-white border border-[#e5e7eb] text-[#4b5563] font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all text-[16px] flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                onClick={() => { setStep(1); setResult(null); }}
              >
                <ArrowLeft size={18} /> Try Again
              </button>
              <button 
                className="w-full sm:w-auto px-8 py-3 bg-[#2563eb] text-white font-bold rounded-xl shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-[16px] flex items-center justify-center focus:ring-2 focus:ring-[#2563eb] focus:outline-none focus:ring-offset-2"
                onClick={() => { setStep(2); setResult(null); }}
              >
                Refine Skills Set
              </button>
            </div>

          </div>
"""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(parts[0] + new_jsx + end_str + end_parts[1])
        print("UI Refinement Brief Strict Layout Successful")
    else:
        print("End string not found")
else:
    print("Start string not found")
