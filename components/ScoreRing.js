"use client";

import { useState, useEffect } from "react";

function scoreColor(score) {
  if (score >= 80) return { hex: "#22c55e", label: "Excellent" };
  if (score >= 50) return { hex: "#f59e0b", label: "Good" };
  return { hex: "#e11d74", label: "Needs Work" };
}

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
        {/* Glow behind ring */}
        <div
          className="absolute inset-4 rounded-full blur-xl opacity-30 transition-colors duration-700"
          style={{ backgroundColor: hex }}
        />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          {/* Define linear gradient for the ring stroke */}
          <defs>
            <linearGradient id="pinkGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#e11d74" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(225,29,116,0.12)" strokeWidth="10" />

          {/* Progress arc — always uses pink-gold gradient */}
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={score >= 80 ? "#22c55e" : "url(#pinkGold)"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear", filter: "drop-shadow(0 0 6px rgba(225,29,116,0.5))" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {score >= 80 ? (
            <span className="text-4xl font-extrabold" style={{ color: hex }}>{displayScore}</span>
          ) : (
            <span className="score-gradient-text text-4xl font-extrabold">{displayScore}</span>
          )}
          <span className="text-[11px] font-medium tracking-wide" style={{ color: "rgba(249,168,212,0.5)" }}>/ 100</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: "#f9a8d4" }}>AI Final Score</p>
        <span
          className="text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-tighter"
          style={{ color: hex, backgroundColor: `${hex}18`, border: `1px solid ${hex}35` }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
