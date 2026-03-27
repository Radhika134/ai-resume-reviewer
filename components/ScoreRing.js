"use client";
import { useState, useEffect } from "react";
import { scoreColor } from "@/lib/utils";

function useCountUp(target, duration = 1500, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    setCount(0);
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

export function ScoreRing({ score, animate }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const displayScore = useCountUp(score, 1500, animate);
  const { hex, label } = scoreColor(score);
  const offset = circumference - (displayScore / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <div className="absolute inset-4 rounded-full blur-xl opacity-25 transition-colors duration-700" style={{ backgroundColor: hex }} />
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#ffffff10" strokeWidth="10" />
          <circle cx="64" cy="64" r={radius} fill="none" stroke={hex} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.8s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold" style={{ color: hex }}>{displayScore}</span>
          <span className="text-[11px] dark:text-gray-400 text-slate-600 font-medium tracking-wide">/ 100</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <p className="text-sm font-semibold dark:text-gray-300 text-slate-700 tracking-wide uppercase">AI Final Score</p>
        <span className="text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-tighter" style={{ color: hex, backgroundColor: `${hex}15`, border: `1px solid ${hex}30` }}>
          {label}
        </span>
      </div>
    </div>
  );
}
