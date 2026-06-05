import re

file_path = "c:\\Users\\advit\\infopro\\infopro\\src\\pages\\JobPrediction.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

start_str = '<div className="full-width-result-container reveal">'
end_str = '        </div>\n      ) : (\n        <div className="main-content-grid">'

parts = content.split(start_str, 1)
if len(parts) == 2:
    end_parts = parts[1].split(end_str, 1)
    if len(end_parts) == 2:
        new_jsx = """<div className="full-width-result-container reveal bg-slate-50/50 py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4 shadow-sm">
                <Sparkles size={16} /> Analysis Complete
              </span>
              <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Your Career Predictions</h2>
              <p className="text-slate-500 mt-3 text-lg font-medium">Based on your academic profile, skills, and experience.</p>
            </div>

            {/* 1. Top 3 Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-blue-500 relative transform hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-md flex items-center gap-2">
                  <Medal size={14} /> Best Match
                </div>
                <div className="text-center mt-5">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight">{result.role}</h3>
                  <div className="flex flex-col items-center justify-center gap-1 mb-2">
                    <div className="text-5xl font-black text-blue-600 tracking-tighter">{result.confidence}%</div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Confidence Score</span>
                  </div>
                </div>
              </div>

              {(result.predictions && result.predictions.length > 1 ? result.predictions.slice(1, 3) : [
                { role: "Alternative Path 1", score: Math.max(10, result.confidence - 15) },
                { role: "Alternative Path 2", score: Math.max(5, result.confidence - 25) }
              ]).map((p, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative transform hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-slate-200">
                    {i === 0 ? "2nd Match" : "3rd Match"}
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="text-xl font-bold text-slate-700 mb-3 leading-tight">{p.role === result.role ? `${p.role} (Alt)` : p.role}</h3>
                    <div className="flex flex-col items-center justify-center gap-1 mb-2">
                      <div className="text-4xl font-extrabold text-slate-400 tracking-tight">{p.score}%</div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Confidence Score</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Skills Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 rounded-md"><CheckCircle2 size={18} className="text-green-600" /></div>
                  Matched Skills
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {result.matchedSkills.length > 0 ? result.matchedSkills.map(s => (
                    <span key={s} className="px-3.5 py-1.5 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-bold shadow-sm">
                      {s}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-sm font-medium italic">No direct skills matched.</span>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-md"><BrainCircuit size={18} className="text-orange-600" /></div>
                  Missing Skills to Learn
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {result.missingSkills.length > 0 ? result.missingSkills.map(s => (
                    <span key={s} className="px-3.5 py-1.5 bg-white border border-orange-200 text-orange-700 rounded-lg text-sm font-bold shadow-sm">
                      {s}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-sm font-medium italic">You have all the core skills!</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Why this role fits you */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200 mt-10">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg"><User size={20} className="text-blue-600" /></div>
                Why This Role Fits You
              </h3>
              <div className="text-slate-600 text-lg leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                {result.explanation.split('\\n').map((line, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {line.split(' ').map((word, idx) => {
                      const lower = word.toLowerCase();
                      const highlight = result.matchedSkills.some(s => lower.includes(s.toLowerCase())) 
                                     || result.missingSkills.some(s => lower.includes(s.toLowerCase()));
                      return highlight ? <strong key={idx} className="text-blue-700 bg-blue-50 px-1 rounded">{word} </strong> : word + " ";
                    })}
                  </p>
                ))}
              </div>
            </div>

            {/* 4. Recommended Next Steps */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200 mt-10">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg"><Target size={20} className="text-indigo-600" /></div>
                Recommended Next Steps
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {result.actions.map((act, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all bg-white group cursor-default">
                    <div className="bg-blue-50 group-hover:bg-blue-100 p-1.5 rounded-full mt-0.5 transition-colors">
                      <CheckCircle2 size={20} className="text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-semibold text-lg">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-16 pb-8 border-t border-slate-200 pt-10">
              <button 
                className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all text-lg flex items-center justify-center gap-2"
                onClick={() => { setStep(1); setResult(null); }}
              >
                <ArrowLeft size={20} /> Try Again
              </button>
              <button 
                className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-lg"
                onClick={() => { setStep(2); setResult(null); }}
              >
                Modify Inputs
              </button>
              <button 
                className="w-full sm:w-auto sm:ml-auto px-8 py-3.5 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-900 transition-all text-lg flex items-center justify-center gap-2"
                onClick={() => alert("Report generation feature is coming soon!")}
              >
                <Building2 size={20} /> Save Result
              </button>
            </div>

          </div>
"""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(parts[0] + new_jsx + end_str + end_parts[1])
        print("UI Replacement Successful")
    else:
        print("End string not found")
else:
    print("Start string not found")
