import re

file_path = "c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

start_str = '      ) : step === 3 && result ? ('
end_str = '        </div>\n      ) : (\n        <div className="main-content-grid">'

parts = content.split(start_str, 1)
if len(parts) == 2:
    end_parts = parts[1].split(end_str, 1)
    if len(end_parts) == 2:
        new_jsx = """
        <div className="full-width-result-container reveal bg-gradient-to-b from-[#e0f2fe] to-white pb-16 min-h-screen">
          {/* Header Section */}
          <div className="pt-12 pb-8 px-6 text-center border-b-[3px] border-b-transparent" style={{borderImage: 'linear-gradient(to right, transparent, #2563eb, transparent) 1'}}>
            <div className="max-w-4xl mx-auto">
              <Sparkles size={24} className="text-[#2563eb] mx-auto mb-3" />
              <h2 className="text-[28px] font-bold text-[#1e293b] mb-2">Analysis Complete</h2>
              <p className="text-[16px] font-normal text-[#6b7280]">
                Based on our AI analysis of your academic background, core skills, and experience profile.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 pt-10">
            
            {/* Section 1: Top Career Matches */}
            <div className="space-y-4">
              <h3 className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#dc2626] mb-5">
                Your Top Career Matches
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* Result Cards Mapping */}
                {[
                  {...result, rank: 1}, 
                  ...((result.predictions && result.predictions.length > 1 ? result.predictions.slice(1, 3) : [
                      { role: "Alternative Role 1", score: Math.max(10, result.confidence - 15) },
                      { role: "Alternative Role 2", score: Math.max(5, result.confidence - 25) }
                    ]).map((p, i) => ({...p, rank: i + 2, confidence: p.score})))
                ].map((item, idx) => {
                  const rank = item.rank;
                  const isTop = rank === 1;
                  
                  let bgColors = isTop ? 'from-[#eff6ff] to-white' : (rank === 2 ? 'from-[#f5f3ff] to-white' : 'from-[#fffbeb] to-white');
                  let topBorder = isTop ? 'linear-gradient(to right, #3b82f6, #ef4444)' : 'transparent';
                  
                  let badgeBg = '';
                  if (rank === 1) badgeBg = 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)';
                  if (rank === 2) badgeBg = 'linear-gradient(to bottom right, #a78bfa, #7c3aed)';
                  if (rank === 3) badgeBg = 'linear-gradient(to bottom right, #fbbf24, #f59e0b)';

                  let textColor = rank === 1 ? 'text-[#2563eb]' : (rank === 2 ? 'text-[#7c3aed]' : 'text-[#f59e0b]');

                  return (
                    <div 
                      key={idx}
                      className={`relative rounded-[12px] p-6 bg-gradient-to-b ${bgColors} shadow-[0_4px_6px_rgba(0,0,0,0.07)] transform hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center w-full group`}
                      style={{ borderTop: `3px solid transparent`, borderImage: topBorder !== 'transparent' ? `${topBorder} 1` : 'none', ...(topBorder === 'transparent' ? {borderTop: '3px solid transparent'} : {}) }}
                    >
                      <div className="flex items-center w-full md:w-1/5 gap-4 md:justify-center">
                        <div 
                          className="w-[56px] h-[56px] rounded-full flex items-center justify-center text-white font-bold text-[24px] flex-shrink-0"
                          style={{
                             background: badgeBg,
                             textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          #{rank}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="w-full">
                          <h3 className="text-[20px] font-bold text-[#4b5563] group-hover:text-[#1e293b] transition-colors line-clamp-2 md:mb-0 mb-4">{item.role === result.role && !isTop ? `${item.role} (Alt)` : item.role}</h3>
                        </div>
                        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                          <span className="text-[12px] font-semibold text-[#6b7280] mb-1">Match</span>
                          <span className={`text-[32px] font-bold ${textColor} leading-none`}>{item.confidence}%</span>
                          <span className="text-[12px] text-[#6b7280] mt-1 whitespace-nowrap">based on profile</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Skills Analysis */}
            <div 
              className="bg-white rounded-[12px] p-7 md:p-8"
              style={{
                border: '2px solid #e5e7eb',
                marginTop: '32px',
                marginBottom: '32px'
              }}
            >
              <div className="mb-6">
                <h3 className="text-[22px] font-bold text-[#1e293b] flex items-center gap-2 m-0">
                  <Target size={18} className="text-[#2563eb]" /> Your Skills Breakdown
                </h3>
                <p className="text-[14px] font-normal text-[#6b7280] ml-7 mt-1">For the #1 Recommended Role</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div 
                  className="rounded-[8px] p-5"
                  style={{
                    background: 'linear-gradient(135deg, #d1fae5, #ecfdf5)',
                    border: '2px solid #6ee7b7'
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#a7f3d0] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-[#10b981]" />
                      <h4 className="text-[18px] font-bold text-[#065f46] m-0 leading-none">Your Strengths</h4>
                    </div>
                    <span className="bg-[#10b981] text-white text-[12px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">{result.matchedSkills.length} skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.length > 0 ? result.matchedSkills.map(s => (
                      <span key={s} className="px-3 py-2 bg-white text-[#065f46] border-[2px] border-[#6ee7b7] rounded-[20px] text-[13px] font-medium tracking-wide hover:bg-[#d1fae5] hover:scale-[1.02] transition-all cursor-default">
                        {s}
                      </span>
                    )) : (
                      <span className="text-[#6b7280] text-[14px] font-medium italic">No direct skills matched.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div 
                  className="rounded-[8px] p-5"
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
                    border: '2px solid #fcd34d'
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#fde68a] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-[#f59e0b]" />
                      <h4 className="text-[18px] font-bold text-[#92400e] m-0 leading-none">Growth Areas</h4>
                    </div>
                    <span className="bg-[#f59e0b] text-white text-[12px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">{result.missingSkills.length} skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.length > 0 ? result.missingSkills.map(s => (
                      <span key={s} className="px-3 py-2 bg-white text-[#92400e] border-[2px] border-[#fcd34d] rounded-[20px] text-[13px] font-medium tracking-wide hover:bg-[#fef3c7] hover:scale-[1.02] transition-all cursor-default">
                        {s}
                      </span>
                    )) : (
                      <span className="text-[#6b7280] text-[14px] font-medium italic">You are highly equipped!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Why This Role Fits You */}
            <div 
              className="rounded-[12px] p-7 md:p-8"
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
                border: '2px solid #bfdbfe',
                marginBottom: '32px'
              }}
            >
              <h3 className="text-[22px] font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                <Lightbulb size={18} className="text-[#2563eb]" /> Why This Role Fits You
              </h3>
              
              <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-5 mb-6">
                <div className="text-[#4b5563] text-[16px] leading-[1.6] font-normal">
                  {result.explanation.split('\\n').map((line, i) => (
                    <p key={i} className="mb-3 last:mb-0">
                      {line.split(' ').map((word, idx) => {
                        const lower = word.toLowerCase();
                        const highlight = result.matchedSkills.some(s => lower.includes(s.toLowerCase())) 
                                       || result.missingSkills.some(s => lower.includes(s.toLowerCase()));
                        return highlight ? <strong key={idx} className="text-[#2563eb] bg-[#eff6ff] px-1 rounded font-semibold">{word} </strong> : word + " ";
                      })}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-4 text-center">
                  <div className="text-[12px] font-semibold text-[#6b7280] mb-1">Profile Match</div>
                  <div className="text-[28px] font-bold text-[#2563eb]">{result.confidence}%</div>
                </div>
                <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-4 text-center">
                  <div className="text-[12px] font-semibold text-[#6b7280] mb-1">Skills Aligned</div>
                  <div className="text-[28px] font-bold text-[#10b981]">{result.matchedSkills.length}/{result.matchedSkills.length + result.missingSkills.length}</div>
                </div>
              </div>
            </div>

            {/* Section 4: Recommended Next Steps */}
            <div 
              className="bg-white rounded-[12px] p-7 md:p-8"
              style={{
                border: '2px solid #e5e7eb',
                marginBottom: '32px'
              }}
            >
              <div className="mb-8">
                <h3 className="text-[22px] font-bold text-[#1e293b] flex items-center gap-2 m-0">
                  <Compass size={18} className="text-[#2563eb]" /> Your Next Steps
                </h3>
                <p className="text-[14px] font-normal text-[#6b7280] ml-7 mt-1">Follow this roadmap to secure your ideal role</p>
              </div>

              <div className="flex flex-col relative pl-2 lg:pl-4">
                {/* Timeline connector line */}
                <div 
                  className="hidden md:block absolute left-[34px] lg:left-[42px] top-[40px] w-[2px] z-0" 
                  style={{ 
                    background: 'linear-gradient(to bottom, #2563eb, #dc2626)',
                    height: 'calc(100% - 80px)'
                  }}
                ></div>

                {result.actions.map((act, i) => {
                  const icons = [BrainCircuit, Briefcase, Award];
                  const Icon = icons[i % icons.length];
                  
                  return (
                    <div key={i} className="flex flex-col md:flex-row gap-4 mb-6 last:mb-0 group relative z-10 transition-all duration-200">
                      
                      {/* Step Circle */}
                      <div className="w-[56px] h-[56px] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-[20px] shadow-[0_4px_12px_rgba(37,99,235,0.3)] z-10 mx-auto md:mx-0" style={{background: 'linear-gradient(135deg, #2563eb, #dc2626)'}}>
                        {i + 1}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 flex flex-col justify-center pt-2 md:pt-0 group-hover:bg-[#f0f9ff] group-hover:translate-x-1 group-hover:px-4 group-hover:-ml-2 group-hover:rounded-[8px] transition-all duration-200 p-2 md:p-0">
                        <div className="flex justify-center md:justify-start items-center gap-2 mb-1">
                          <Icon size={18} className="text-[#2563eb]" />
                          <h4 className="text-[16px] font-semibold text-[#374151] m-0">Action Step {i + 1}</h4>
                        </div>
                        <p className="text-[14px] font-normal text-[#6b7280] leading-[1.5] text-center md:text-left">{act}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pb-12">
              <button 
                className="w-full sm:w-auto px-6 py-3 bg-white border-[2px] border-[#3b82f6] text-[#2563eb] font-semibold rounded-[8px] hover:bg-[#f0f9ff] hover:text-[#1d4ed8] transition-all text-[14px] flex items-center justify-center gap-2 group focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 outline-none"
                onClick={() => { setStep(2); setResult(null); }}
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Modify Inputs
              </button>
              <button 
                className="w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-[8px] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(37,99,235,0.3)] transition-all text-[14px] flex items-center justify-center gap-2 group focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 outline-none border-none"
                style={{background: 'linear-gradient(to right, #2563eb, #1d4ed8)'}}
                onClick={() => { setStep(1); setResult(null); }}
              >
                <RotateCcw size={16} className="group-active:rotate-180 transition-transform duration-300" /> Start Over
              </button>
            </div>

          </div>
"""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(parts[0] + new_jsx + end_str + end_parts[1])
        print("V7 Design Write Successful")
    else:
        print("End string not found")
else:
    print("Start string not found")
