"use client";

import { useState } from "react";

export function JobMatchAnalysis({ results }) {
  const [copied, setCopied] = useState(false);

  const { matchPercentage, matchAnalysis, missingKeywords, projectSuggestions, rewrittenBullets } = results;

  /* ── Colour helpers ── */
  const getHex = (pct) => {
    if (pct > 70) return "#22c55e";
    if (pct >= 50) return "#f59e0b";
    return "#ef4444";
  };
  const getLabelText = (pct) => {
    if (pct > 70) return "Strong Match";
    if (pct >= 50) return "Partial Match";
    return "Low Match";
  };

  const hex    = getHex(matchPercentage ?? 0);
  const label  = getLabelText(matchPercentage ?? 0);

  /* SVG ring */
  const RADIUS       = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset    = CIRCUMFERENCE * (1 - (matchPercentage ?? 0) / 100);

  const copyKeywords = async () => {
    if (!missingKeywords?.length) return;
    try {
      await navigator.clipboard.writeText(missingKeywords.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: "50ms", animationFillMode: "both" }}>

      {/* ── Section header ── */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h2 className="text-lg font-extrabold tracking-tight dark:text-white text-slate-900">
            Job Match Analysis
          </h2>
        </div>
        <div className="flex-1 h-px dark:bg-white/8 bg-slate-200" />
        <span
          className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
          style={{ color: hex, borderColor: `${hex}40`, backgroundColor: `${hex}15` }}
        >
          {label}
        </span>
      </div>

      {/* ── Match circle + analysis ── */}
      <div
        className="rounded-3xl border p-6 sm:p-8 shadow-lg relative overflow-hidden"
        style={{ borderColor: `${hex}30`, background: `linear-gradient(135deg, ${hex}08 0%, transparent 60%)` }}
      >
        {/* Decorative orb */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: hex }}
        />

        <div className="relative flex flex-col sm:flex-row items-center gap-8">
          {/* Circle */}
          <div className="relative w-36 h-36 shrink-0">
            {/* Blur glow */}
            <div
              className="absolute inset-6 rounded-full blur-xl opacity-30"
              style={{ backgroundColor: hex }}
            />
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Track */}
              <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#ffffff0d" strokeWidth="9" />
              {/* Progress */}
              <circle
                cx="50" cy="50" r={RADIUS}
                fill="none"
                stroke={hex}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tabular-nums" style={{ color: hex }}>
                {matchPercentage ?? 0}%
              </span>
              <span className="text-[9px] dark:text-gray-500 text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                Match
              </span>
            </div>
          </div>

          {/* Analysis text */}
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div>
              <p className="text-sm dark:text-gray-200 text-slate-800 leading-relaxed font-medium">
                {matchAnalysis || "Based on the job description, we've identified key ways to improve your resume strategy."}
              </p>
            </div>

            {/* Quick stat pills */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {missingKeywords?.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold dark:bg-purple-500/15 bg-purple-100 dark:text-purple-300 text-purple-700 border dark:border-purple-500/20 border-purple-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  {missingKeywords.length} missing keywords
                </span>
              )}
              {projectSuggestions?.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold dark:bg-amber-500/15 bg-amber-100 dark:text-amber-300 text-amber-700 border dark:border-amber-500/20 border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {projectSuggestions.length} project ideas
                </span>
              )}
              {rewrittenBullets?.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold dark:bg-emerald-500/15 bg-emerald-100 dark:text-emerald-300 text-emerald-700 border dark:border-emerald-500/20 border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {rewrittenBullets.length} rewritten bullets
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Missing Keywords + Project Suggestions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Missing Keywords */}
        {missingKeywords?.length > 0 && (
          <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm p-6 relative overflow-hidden">
            {/* Watermark icon */}
            <div className="absolute top-2 right-2 opacity-[0.04] pointer-events-none">
              <svg className="w-20 h-20 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold dark:text-gray-300 text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <span>🔍</span> Missing Keywords
              </h4>
              <button
                onClick={copyKeywords}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all duration-200 active:scale-95 ${
                  copied
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "dark:bg-white/5 bg-slate-100 hover:bg-purple-500/10 dark:border-white/5 border-slate-200 dark:text-gray-400 text-slate-600 hover:text-purple-400 hover:border-purple-500/30"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v1"/>
                    </svg>
                    Copy All
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg dark:bg-purple-500/10 bg-purple-50 border dark:border-purple-500/20 border-purple-200 dark:text-purple-300 text-purple-700 text-[11px] font-bold transition-all duration-200 hover:scale-105 hover:dark:bg-purple-500/20 hover:bg-purple-100 cursor-default"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Projects */}
        {projectSuggestions?.length > 0 && (
          <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm p-6 relative overflow-hidden">
            {/* Watermark icon */}
            <div className="absolute top-2 right-2 opacity-[0.04] pointer-events-none">
              <svg className="w-20 h-20 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C8.29 12.42 7 10.78 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.78-1.29 3.42-3.15 4.1z"/>
              </svg>
            </div>

            <h4 className="text-xs font-bold dark:text-gray-300 text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span>💡</span> Career Boost Projects
            </h4>
            <div className="space-y-3">
              {projectSuggestions.map((project, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200 group hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:dark:bg-amber-500/5 hover:bg-amber-50/50 transition-all duration-200 hover:translate-x-0.5"
                >
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-500/70 tracking-wider">Project {i + 1}</span>
                    <p className="text-[12px] dark:text-gray-300 text-slate-700 leading-relaxed font-medium mt-0.5">{project}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Rewritten Bullet Points ── */}
      {rewrittenBullets?.length > 0 && (
        <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm p-6">
          <h4 className="text-xs font-bold dark:text-gray-300 text-slate-600 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span>✍️</span> Tailored Bullet Rewrites
            <span className="ml-auto text-[10px] font-normal normal-case dark:text-gray-500 text-slate-400">
              AI-optimized for this job description
            </span>
          </h4>

          <div className="space-y-4">
            {rewrittenBullets.map((bullet, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border dark:border-white/8 border-slate-200 hover:dark:border-purple-500/20 hover:border-purple-200 transition-colors duration-200"
              >
                {/* Bullet number label */}
                <div className="px-4 py-2 dark:bg-white/5 bg-slate-50 border-b dark:border-white/5 border-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[9px] font-black text-purple-400">
                    {i + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter dark:text-gray-500 text-slate-500">
                    Bullet Point Rewrite
                  </span>
                </div>

                <div className="flex flex-col md:flex-row">
                  {/* Original */}
                  <div className="flex-1 p-4 dark:bg-red-950/30 bg-red-50/80 relative">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-red-500">Original</span>
                    </div>
                    <p className="text-[12px] dark:text-red-300/70 text-red-800/80 line-through leading-relaxed italic">
                      {bullet.original}
                    </p>
                  </div>

                  {/* Divider arrow */}
                  <div className="hidden md:flex w-10 shrink-0 items-center justify-center dark:bg-white/[0.02] bg-slate-100 border-x dark:border-white/5 border-slate-200">
                    <svg className="w-5 h-5 dark:text-gray-600 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </div>

                  {/* Mobile divider */}
                  <div className="md:hidden h-px dark:bg-white/5 bg-slate-200 mx-4" />

                  {/* Improved */}
                  <div className="flex-1 p-4 dark:bg-emerald-950/30 bg-emerald-50/80 relative">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500">AI Optimized</span>
                    </div>
                    <p className="text-[12px] dark:text-emerald-200 text-emerald-900 leading-relaxed font-semibold">
                      {bullet.improved}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
