"use client";

const glass = {
  background: "rgba(255,20,100,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(225,29,116,0.15)",
  borderRadius: "16px",
};

export function JobMatchAnalysis({ results }) {
  const hasJobMatchData =
    results.matchPercentage != null ||
    results.missingKeywords?.length > 0 ||
    results.projectSuggestions?.length > 0 ||
    results.rewrittenBullets?.length > 0;

  if (!hasJobMatchData) {
    return (
      <div className="p-6 text-center animate-fadeInUp" style={glass}>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(249,168,212,0.5)" }}>
          💡 Add a job description above to get personalized keyword and project suggestions
        </p>
      </div>
    );
  }

  const { matchPercentage, missingKeywords, projectSuggestions, rewrittenBullets } = results;

  const getMatchColor = (score) => {
    if (score > 70) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#e11d74";
  };

  const hex = getMatchColor(matchPercentage);
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (matchPercentage / 100) * circ;

  const copyKeywords = () => {
    if (missingKeywords) navigator.clipboard.writeText(missingKeywords.join(", "));
  };

  return (
    <div className="space-y-5 animate-fadeInUp" style={{ animationDelay: "50ms", animationFillMode: "both" }}>

      {/* Match Circle */}
      <div
        className="p-6"
        style={{
          background: "linear-gradient(135deg, rgba(225,29,116,0.08) 0%, rgba(245,158,11,0.05) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(225,29,116,0.2)",
          borderRadius: "20px",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e11d74" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(225,29,116,0.1)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r={radius} fill="none"
                stroke={matchPercentage > 70 ? "#22c55e" : "url(#matchGrad)"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1s ease", filter: "drop-shadow(0 0 6px rgba(225,29,116,0.5))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold" style={{ color: hex }}>{matchPercentage}%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(249,168,212,0.5)" }}>Match</span>
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-lg font-bold mb-2 flex items-center justify-center sm:justify-start gap-2" style={{ color: "#fce7f3" }}>
              <span className="animate-pulse">🎯</span> Job Match Analysis
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#f9a8d4" }}>
              {results.matchAnalysis || "Based on the job description, we've identified key ways to improve your resume strategy."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Missing Keywords */}
        {missingKeywords?.length > 0 && (
          <div className="p-6 overflow-hidden relative" style={glass}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: "rgba(249,168,212,0.5)" }}>
                <span>🔍</span> Missing Keywords
              </h4>
              <button
                onClick={copyKeywords}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all active:scale-95"
                style={{ background: "rgba(225,29,116,0.10)", border: "1px solid rgba(225,29,116,0.2)", color: "#f9a8d4" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v1"/></svg>
                Copy All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all hover:scale-105"
                  style={{ background: "rgba(225,29,116,0.15)", border: "1px solid rgba(225,29,116,0.3)", color: "#f9a8d4" }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Suggestions */}
        {projectSuggestions?.length > 0 && (
          <div className="p-6 relative overflow-hidden" style={glass}>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: "rgba(249,168,212,0.5)" }}>
              <span>💡</span> Career Boost Projects
            </h4>
            <div className="space-y-2.5">
              {projectSuggestions.map((project, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl transition-all hover:translate-x-1"
                  style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}
                >
                  <div className="mt-0.5" style={{ color: "#f59e0b" }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <p className="text-[11px] leading-relaxed font-medium" style={{ color: "#fde68a" }}>{project}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rewritten Bullets */}
      {rewrittenBullets?.length > 0 && (
        <div className="p-6 overflow-hidden" style={glass}>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: "rgba(249,168,212,0.5)" }}>
            <span>✍️</span> Tailored Bullet Rewrites
          </h4>
          <div className="space-y-4">
            {rewrittenBullets.map((bullet, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-0.5 md:gap-0 rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(225,29,116,0.15)" }}
              >
                <div className="flex-1 p-4 relative" style={{ background: "rgba(225,29,116,0.06)" }}>
                  <div
                    className="absolute top-0 left-0 px-2 py-1 text-[8px] font-black uppercase tracking-tighter"
                    style={{ background: "rgba(225,29,116,0.15)", color: "#f9a8d4" }}
                  >Original</div>
                  <p className="text-[11px] leading-relaxed italic mt-3 line-through" style={{ color: "rgba(252,165,165,0.5)" }}>{bullet.original}</p>
                </div>
                <div
                  className="w-10 hidden md:flex items-center justify-center"
                  style={{ background: "rgba(225,29,116,0.04)", borderLeft: "1px solid rgba(225,29,116,0.1)", borderRight: "1px solid rgba(225,29,116,0.1)", color: "rgba(249,168,212,0.3)" }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
                <div className="flex-1 p-4 relative" style={{ background: "rgba(245,158,11,0.06)" }}>
                  <div
                    className="absolute top-0 left-0 px-2 py-1 text-[8px] font-black uppercase tracking-tighter"
                    style={{ background: "rgba(245,158,11,0.18)", color: "#fde68a" }}
                  >AI Optimized</div>
                  <p className="text-[11px] leading-relaxed font-bold mt-3" style={{ color: "#fde68a" }}>{bullet.improved}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
