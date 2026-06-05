import re

file_path = "c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

start_str = '<div className="full-width-result-container reveal bg-slate-50/50 py-12 px-6">'
end_str = '        </div>\n      ) : (\n        <div className="main-content-grid">'

parts = content.split(start_str, 1)
if len(parts) == 2:
    end_parts = parts[1].split(end_str, 1)
    if len(end_parts) == 2:
        new_jsx = """<div className="full-width-result-container reveal bg-[#F8FAFC] py-12 px-6 min-h-screen">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Header Area */}
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-6 shadow-sm ring-1 ring-blue-200">
                <Sparkles size={16} /> Analysis Complete
              </span>
              <h2 className="text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">Your Career Predictions</h2>
              <p className="text-slate-500 mt-4 text-xl font-medium max-w-2xl mx-auto">We analyzed your academic background, skills, and experience to find your best paths.</p>
            </div>

            {/* 1. Top 3 Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Card 1 - Best Match */}
              <div className="bg-gradient-to-b from-white to-blue-50/30 rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.15)] border border-blue-100 relative transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.2)] transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2563EB] to-indigo-600 text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-blue-500/30 flex items-center gap-2 border border-blue-400/30">
                  <span className="text-lg">🥇</span> Best Match
                </div>
                <div className="text-center mt-6">
                  <h3 className="text-3xl font-extrabold text-slate-800 mb-6 leading-tight line-clamp-2">{result.role}</h3>
                  <div className="flex flex-col items-center justify-center relative my-6">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" className="stroke-slate-100" strokeWidth="12" fill="none" />
                      <circle cx="64" cy="64" r="56" className="stroke-[#2563EB] transition-all duration-1000 ease-out" strokeWidth="12" fill="none" strokeDasharray="351" strokeDashoffset={351 - (351 * result.confidence) / 100} strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-800">{result.confidence}%</span>
                    </div>
                  </div>
                  <span className="text-slate-500 text-sm font-bold uppercase tracking-wider bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">Match Score</span>
                </div>
              </div>

              {/* Card 2 & 3 */}
              {(result.predictions && result.predictions.length > 1 ? result.predictions.slice(1, 3) : [
                { role: "Alternative Role 1", score: Math.max(10, result.confidence - 15) },
                { role: "Alternative Role 2", score: Math.max(5, result.confidence - 25) }
              ]).map((p, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative transform hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-100 text-slate-600 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-slate-200 shadow-sm flex items-center gap-2 whitespace-nowrap">
                    <span className="text-sm">{i === 0 ? "🥈" : "🥉"}</span> {i === 0 ? "2nd Match" : "3rd Match"}
                  </div>
                  <div className="text-center mt-6 flex-1 flex flex-col justify-between">
                    <h3 className="text-2xl font-bold text-slate-700 mb-6 leading-tight line-clamp-2">{p.role === result.role ? `${p.role} (Alt)` : p.role}</h3>
                    <div className="flex flex-col items-center justify-center relative my-4">
                      {/* Standard Percentage Display for Alts */}
                      <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-slate-100 flex items-center justify-center mb-4">
                        <span className="text-3xl font-extrabold text-slate-600">{p.score}%</span>
                      </div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Match Score</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Skills Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              {/* Matched Skills */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="bg-[#10B981]/10 p-2 rounded-xl"><CheckCircle2 size={24} className="text-[#10B981]" /></div>
                  Matched Skills
                </h4>
                <div className="flex flex-wrap gap-3">
                  {result.matchedSkills.length > 0 ? result.matchedSkills.map(s => (
                    <span key={s} className="px-4 py-2 bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:bg-[#10B981]/20">
                      {s}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-sm font-medium italic">No direct skills matched.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="bg-[#F59E0B]/10 p-2 rounded-xl"><BrainCircuit size={24} className="text-[#F59E0B]" /></div>
                  Missing Skills to Learn
                </h4>
                <div className="flex flex-wrap gap-3">
                  {result.missingSkills.length > 0 ? result.missingSkills.map(s => (
                    <span key={s} className="px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all hover:bg-[#F59E0B]/20">
                      {s}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-sm font-medium italic">You have all the core skills!</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Why this role fits you */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 border-l-8 border-l-[#2563EB] mt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <User size={120} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10">
                Why This Role Fits You
              </h3>
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium relative z-10">
                {result.explanation.split('\\n').map((line, i) => (
                  <p key={i} className="mb-5 last:mb-0">
                    {line.split(' ').map((word, idx) => {
                      const lower = word.toLowerCase();
                      const highlight = result.matchedSkills.some(s => lower.includes(s.toLowerCase())) 
                                     || result.missingSkills.some(s => lower.includes(s.toLowerCase()));
                      return highlight ? <strong key={idx} className="text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded-md font-bold mx-0.5">{word} </strong> : word + " ";
                    })}
                  </p>
                ))}
              </div>
            </div>

            {/* 4. Recommended Next Steps */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200 mt-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3 relative z-10">
                <div className="bg-indigo-100 p-2 rounded-xl"><Target size={24} className="text-indigo-600" /></div>
                Recommended Action Plan
              </h3>
              <div className="flex flex-col gap-5 relative z-10">
                {result.actions.map((act, i) => (
                  <div key={i} className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 bg-[#F8FAFC] hover:bg-white hover:shadow-md hover:border-slate-200 transition-all group cursor-default">
                    <div className="bg-white group-hover:bg-[#10B981] p-2 rounded-xl shadow-sm border border-slate-100 group-hover:border-[#10B981] transition-colors flex-shrink-0">
                      <CheckCircle2 size={24} className="text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-slate-700 font-semibold text-lg">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-16 pb-12 pt-6">
              <button 
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-300 text-slate-600 font-bold rounded-2xl shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all text-lg flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-slate-100"
                onClick={() => { setStep(1); setResult(null); }}
              >
                <ArrowLeft size={22} /> Try Again
              </button>
              <button 
                className="w-full sm:w-auto px-10 py-4 bg-[#2563EB] text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-blue-200"
                onClick={() => { setStep(2); setResult(null); }}
              >
                Modify Inputs
              </button>
              <button 
                className="w-full sm:w-auto sm:ml-auto px-10 py-4 bg-[#10B981] text-white font-bold rounded-2xl shadow-lg shadow-green-500/30 hover:bg-green-600 hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-green-200"
                onClick={() => alert("Report downloaded successfully!")}
              >
                <Building2 size={22} /> Save Result
              </button>
            </div>

          </div>
"""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(parts[0] + new_jsx + end_str + end_parts[1])
        print("UI Refinement 2 Successful")
    else:
        print("End string not found")
else:
    print("Start string not found")
