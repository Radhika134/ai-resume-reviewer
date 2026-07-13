"use client";

import { Check, Copy, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function JobMatchAnalysis({ results, hasJobDescription }) {
  const [copied, setCopied] = useState(false);
  
  const hasMissingKeywords     = results.missingKeywords?.length > 0;
  const hasProjectSuggestions  = results.projectSuggestions?.length > 0;
  const hasRewrittenBullets    = results.rewrittenBullets?.length > 0;
  const hasMatchPercentage     = hasJobDescription && typeof results.matchPercentage === "number";
  const hasAnyData             = hasMissingKeywords || hasProjectSuggestions || hasRewrittenBullets || hasMatchPercentage;

  if (!hasJobDescription) {
    return (
      <div className="p-8 text-center rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md">
        <p className="text-xs leading-relaxed text-muted-foreground">
          💡 Provide a target Job Description in the sidebar to calculate ATS match percentages and locate keyword discrepancies.
        </p>
      </div>
    );
  }

  if (hasJobDescription && !hasAnyData) {
    return (
      <div className="p-8 text-center rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md">
        <p className="text-xs leading-relaxed text-muted-foreground">
          ⚙️ Job match metrics could not be parsed. Try re-running the audit.
        </p>
      </div>
    );
  }

  const { matchPercentage, missingKeywords, projectSuggestions, rewrittenBullets } = results;

  const getMatchColor = (score) => {
    if (score >= 80) return "#10b981"; // green
    if (score >= 50) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const hex    = getMatchColor(matchPercentage);
  const radius = 40;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (matchPercentage / 100) * circ;

  const copyKeywords = async () => {
    if (!missingKeywords?.length) return;
    try {
      await navigator.clipboard.writeText(missingKeywords.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6 animate-fade-rise">

      {/* Match Score Row Banner */}
      <div
        className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Match Score SVG Dial */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r={radius} fill="none"
                stroke={hex}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset}
                className="transition-all duration-1000"
                style={{ filter: `drop-shadow(0 0 4px ${hex}40)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tracking-tighter" style={{ color: hex }}>{matchPercentage}%</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Match</span>
            </div>
          </div>

          <div className="text-center sm:text-left flex-1 space-y-1">
            <h3 className="text-base font-bold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <span>🎯</span> Job Match Analysis
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {results.matchAnalysis || "Comparison of resume achievements and requirements detailed in the job description."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Missing Keywords Panel */}
        {missingKeywords?.length > 0 && (
          <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Missing Keywords
                </h4>
                <button
                  onClick={copyKeywords}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy Gaps"}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                Inject these missing keywords from the JD into your skills list or experience bullet points to satisfy scanning algorithms.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-[10px] font-semibold border border-red-500/20 bg-red-500/5 text-red-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Matched Keywords/Skills panel */}
        {results.skillTags?.length > 0 && (
          <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-green-400 flex items-center gap-1.5 mb-4">
                <Check size={14} /> Matching Core Skills
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                These core terms match key requirements found in standard JD formats. Keep them prominently displayed.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.skillTags.slice(0, 10).map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-[10px] font-semibold border border-green-500/20 bg-green-500/5 text-green-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
