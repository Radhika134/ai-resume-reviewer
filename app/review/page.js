"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

/* ─── Badge color config ───────────────────────────────────────── */
const badgeColors = {
  emerald: { bg: "dark:bg-emerald-500/10 bg-emerald-100", border: "border-emerald-500/25", text: "text-emerald-400", dot: "bg-emerald-400" },
  purple:  { bg: "dark:bg-purple-500/10 bg-purple-100",  border: "border-purple-500/25",  text: "text-purple-400",  dot: "bg-purple-400"  },
  blue:    { bg: "dark:bg-blue-500/10 bg-blue-100",    border: "border-blue-500/25",    text: "text-blue-400",    dot: "bg-blue-400"    },
  red:     { bg: "dark:bg-red-500/10 bg-red-100",     border: "border-red-500/25",     text: "text-red-400",     dot: "bg-red-400"     },
  amber:   { bg: "dark:bg-amber-500/10 bg-amber-100",   border: "border-amber-500/25",   text: "text-amber-400",   dot: "bg-amber-400"   },
};

function buildBadges(data) {
  return [
    { label: "ATS Ready", value: data.atsReady ? "✓ Pass" : "✗ Fail", color: data.atsReady ? "emerald" : "red" },
    { label: "Keywords",  value: data.keywords ?? "—",  color: data.keywords === "Strong" ? "purple" : data.keywords === "Weak" ? "red" : "blue" },
    { label: "Formatting", value: data.formatting ?? "—", color: data.formatting === "Clean" ? "blue" : data.formatting === "Messy" ? "red" : "purple" },
  ];
}

/* ─── Score color helper ───────────────────────────────────────── */
function scoreColor(score) {
  if (score >= 80) return { hex: "#22c55e", label: "Excellent" };
  if (score >= 50) return { hex: "#f59e0b", label: "Good" };
  return { hex: "#ef4444", label: "Needs Work" };
}

/* ─── Count-up hook ────────────────────────────────────────────── */
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

/* ─── Confetti ─────────────────────────────────────────────────── */
function ConfettiEffect({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#a855f7","#ec4899","#f59e0b","#10b981","#3b82f6","#f43f5e"];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: -10 - Math.random() * 100,
      r: 4 + Math.random() * 6, d: Math.random() * 80 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0, opacity: 1,
    }));
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += Math.cos(frame * 0.01 + p.d) + 1.5;
        p.x += Math.sin(frame * 0.01);
        p.tilt = Math.sin(p.tiltAngle) * 15;
        if (p.y > canvas.height * 0.6) p.opacity = Math.max(0, p.opacity - 0.015);
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      if (frame < 220) animRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ width: "100vw", height: "100vh" }} />;
}

/* ─── Score Ring ───────────────────────────────────────────────── */
function ScoreRing({ score, animate }) {
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
        <p className="text-sm font-semibold dark:dark:text-gray-300 text-slate-700 text-slate-700 tracking-wide">Resume Score</p>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: hex, backgroundColor: `${hex}20`, border: `1px solid ${hex}40` }}>{label}</span>
      </div>
    </div>
  );
}

/* ─── Section Scores ───────────────────────────────────────────── */
function SectionScores({ sectionScores, animate }) {
  const sections = [
    { key: "experience", label: "Experience",  icon: "💼" },
    { key: "skills",     label: "Skills",      icon: "🛠️" },
    { key: "education",  label: "Education",   icon: "🎓" },
    { key: "formatting", label: "Formatting",  icon: "📐" },
    { key: "impact",     label: "Impact",      icon: "🎯" },
  ];
  return (
    <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none p-6 animate-fadeInUp" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
      <h3 className="text-sm font-bold dark:dark:text-gray-300 text-slate-700 text-slate-700 tracking-wide uppercase mb-5 flex items-center gap-2">
        <span>📊</span> Section Breakdown
      </h3>
      <div className="space-y-3.5">
        {sections.map(({ key, label, icon }) => {
          const val = sectionScores?.[key] ?? 0;
          const { hex } = scoreColor(val);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs dark:text-gray-400 text-slate-600 font-medium flex items-center gap-1.5">
                  <span>{icon}</span>{label}
                </span>
                <span className="text-xs font-bold" style={{ color: hex }}>{val}</span>
              </div>
              <div className="h-2 rounded-full dark:bg-white/5 bg-white shadow-sm dark:shadow-none overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animate ? `${val}%` : "0%",
                    backgroundColor: hex,
                    boxShadow: `0 0 8px ${hex}60`,
                    transitionDelay: "200ms",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Skill Tags ───────────────────────────────────────────────── */
function SkillTags({ skillTags }) {
  if (!skillTags?.length) return null;
  const colors = [
    "bg-purple-500/15 border-purple-500/25 dark:text-purple-300 text-purple-700",
    "bg-blue-500/15 border-blue-500/25 text-blue-300",
    "bg-emerald-500/15 border-emerald-500/25 dark:text-emerald-300 text-emerald-800",
    "bg-amber-500/15 border-amber-500/25 text-amber-300",
    "bg-pink-500/15 border-pink-500/25 text-pink-300",
  ];
  return (
    <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none p-6 animate-fadeInUp" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
      <h3 className="text-sm font-bold dark:dark:text-gray-300 text-slate-700 text-slate-700 tracking-wide uppercase mb-4 flex items-center gap-2">
        <span>🏷️</span> Detected Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {skillTags.map((skill, i) => (
          <span key={i} className={`px-3 py-1 rounded-full border text-xs font-semibold ${colors[i % colors.length]}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Completeness Checklist ───────────────────────────────────── */
function Checklist({ checklist }) {
  if (!checklist) return null;
  const items = [
    { key: "hasContactInfo",    label: "Contact Information" },
    { key: "hasLinkedIn",       label: "LinkedIn / Portfolio" },
    { key: "hasMetrics",        label: "Quantified Metrics" },
    { key: "hasActionVerbs",    label: "Action Verbs" },
    { key: "hasSummary",        label: "Professional Summary" },
    { key: "hasCertifications", label: "Certifications" },
  ];
  const passCount = items.filter(({ key }) => checklist[key]).length;
  return (
    <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none p-6 animate-fadeInUp" style={{ animationDelay: "250ms", animationFillMode: "both" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold dark:dark:text-gray-300 text-slate-700 text-slate-700 tracking-wide uppercase flex items-center gap-2">
          <span>✅</span> Resume Checklist
        </h3>
        <span className="text-xs font-bold dark:text-gray-400 text-slate-600">{passCount}/{items.length} complete</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ key, label }) => {
          const passed = checklist[key];
          return (
            <div key={key} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
              passed
                ? "dark:dark:bg-emerald-500/8 bg-emerald-50 bg-emerald-50 dark:border-emerald-500/20 border-emerald-500/10 dark:text-emerald-300 text-emerald-800"
                : "dark:bg-red-500/5 bg-red-50/50 dark:border-red-500/15 border-red-200 text-red-400"
            }`}>
              <span className="text-base shrink-0">{passed ? "✓" : "✗"}</span>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Score History ────────────────────────────────────────────── */
const HISTORY_KEY = "resumeai_score_history";
function useScoreHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);
  function addEntry(score, role) {
    const entry = { score, role: role || "General", date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), ts: Date.now() };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 8);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }
  function clearHistory() {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
  }
  return { history, addEntry, clearHistory };
}

function ScoreHistory({ history, onClear }) {
  if (!history.length) return null;
  return (
    <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold dark:text-gray-400 text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <span>📈</span> Score History
        </p>
        <button onClick={onClear} className="text-[11px] dark:text-gray-600 text-slate-400 hover:text-red-400 transition-colors">Clear</button>
      </div>
      <div className="flex items-end gap-2 h-16">
        {[...history].reverse().map((entry, i) => {
          const { hex } = scoreColor(entry.score);
          const heightPct = Math.max(10, entry.score);
          return (
            <div key={entry.ts} className="flex flex-col items-center gap-1 flex-1 group relative">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-[#1a1a1a] border dark:border-white/10 border-slate-200 rounded-lg px-2 py-1 text-[10px] dark:text-white text-slate-900 whitespace-nowrap z-10 flex-col items-center">
                <span className="font-bold">{entry.score}</span>
                <span className="dark:text-gray-500 text-slate-500">{entry.role}</span>
              </div>
              <div
                className="w-full rounded-t-sm transition-all duration-500 min-h-[4px]"
                style={{ height: `${heightPct}%`, backgroundColor: hex, opacity: 0.7 + i * 0.04 }}
              />
              <span className="text-[9px] dark:text-gray-600 text-slate-400">{entry.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Copy Button ──────────────────────────────────────────────── */
function CopyFeedbackButton({ results, jobRole }) {
  const [copied, setCopied] = useState(false);
  function buildText() {
    const lines = [];
    lines.push(`=== AI Resume Review Results ===`);
    if (jobRole) lines.push(`Target Role: ${jobRole}`);
    lines.push(`Score: ${results.score ?? 0}/100`);
    lines.push(`ATS Ready: ${results.atsReady ? "Yes ✓" : "No ✗"}`);
    if (results.keywords) lines.push(`Keywords: ${results.keywords}`);
    if (results.formatting) lines.push(`Formatting: ${results.formatting}`);
    lines.push("");
    if (results.matchPercentage != null) {
      lines.push(`🎯 JD Match: ${results.matchPercentage}%`);
      if (results.matchAnalysis) lines.push(`   ${results.matchAnalysis}`);
      lines.push("");
    }
    if (results.sectionScores) {
      lines.push("📊 SECTION SCORES:");
      Object.entries(results.sectionScores).forEach(([k, v]) => lines.push(`  ${k}: ${v}/100`));
      lines.push("");
    }
    if (results.skillTags?.length) { lines.push(`🏷️ SKILLS: ${results.skillTags.join(", ")}`); lines.push(""); }
    if (results.strengths?.length) {
      lines.push("💪 STRENGTHS:");
      results.strengths.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
      lines.push("");
    }
    if (results.weaknesses?.length) {
      lines.push("⚠️ AREAS TO IMPROVE:");
      results.weaknesses.forEach((w, i) => lines.push(`  ${i + 1}. ${w}`));
      lines.push("");
    }
    if (results.suggestions?.length) {
      lines.push("✨ AI SUGGESTIONS:");
      results.suggestions.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
      lines.push("");
    }
    lines.push("--- Generated by ResumeAI ---");
    return lines.join("\n");
  }
  async function handleCopy() {
    try { await navigator.clipboard.writeText(buildText()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }
  return (
    <button onClick={handleCopy} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
      copied
        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 scale-105"
        : "dark:bg-white/5 bg-white shadow-sm dark:shadow-none border dark:border-white/10 border-slate-200 dark:text-gray-400 text-slate-600 dark:hover:bg-white/10 bg-slate-100 dark:hover:text-white text-slate-900 hover:scale-105"
    }`}>
      {copied ? (
        <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Copied!</>
      ) : (
        <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>
      )}
    </button>
  );
}

/* ─── Download PDF Button ──────────────────────────────────────── */
function DownloadPDFButton({ results, jobRole }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = 210;
      const margin = 18;
      const colW = pageW - margin * 2;
      let y = 20;

      const addText = (text, x, fontSize, color, bold, maxW) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        const lines = maxW ? doc.splitTextToSize(text, maxW) : [text];
        doc.text(lines, x, y);
        y += lines.length * (fontSize * 0.4) + 2;
      };

      const addRule = (color = [255,255,255], opacity = 0.08) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 4;
      };

      const checkPage = (needed = 20) => {
        if (y + needed > 275) { doc.addPage(); y = 20; }
      };

      // Header
      doc.setFillColor(15, 15, 20);
      doc.rect(0, 0, pageW, 297, "F");
      doc.setFillColor(80, 40, 160);
      doc.rect(0, 0, pageW, 36, "F");

      doc.setFontSize(20); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold");
      doc.text("Resume", margin, 16);
      doc.setTextColor(180,140,255);
      doc.text("AI", margin + 36, 16);
      doc.setFontSize(9); doc.setTextColor(200,180,255); doc.setFont("helvetica","normal");
      doc.text("AI-Powered Resume Review Report", margin, 24);
      const dateStr = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });
      doc.text(dateStr, pageW - margin, 24, { align: "right" });
      y = 46;

      // Role
      if (jobRole) {
        doc.setFontSize(9); doc.setTextColor(160,120,240); doc.setFont("helvetica","bold");
        doc.text(`Target Role: ${jobRole}`, margin, y); y += 8;
      }

      // Score
      const scoreVal = results.score ?? 0;
      const scoreClr = scoreVal >= 80 ? [34,197,94] : scoreVal >= 50 ? [245,158,11] : [239,68,68];
      doc.setFontSize(42); doc.setFont("helvetica","bold"); doc.setTextColor(...scoreClr);
      doc.text(`${scoreVal}`, margin, y + 6);
      doc.setFontSize(14); doc.setTextColor(150,150,160);
      doc.text("/ 100", margin + 28, y + 6);
      doc.setFontSize(9); doc.setTextColor(140,140,150); doc.setFont("helvetica","normal");
      doc.text(scoreVal >= 80 ? "Excellent" : scoreVal >= 50 ? "Good" : "Needs Work", margin, y + 13);
      y += 22; addRule();

      // Badges row
      const badges = [
        { label:"ATS Ready", value: results.atsReady?"Pass":"Fail", color: results.atsReady?[34,197,94]:[239,68,68] },
        { label:"Keywords",  value: results.keywords ?? "—", color:[147,51,234] },
        { label:"Formatting",value: results.formatting ?? "—", color:[59,130,246] },
      ];
      const bW = colW / 3 - 2;
      badges.forEach((b, i) => {
        const bx = margin + i * (bW + 3);
        doc.setFillColor(30,30,40); doc.roundedRect(bx, y, bW, 14, 2, 2, "F");
        doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(...b.color);
        doc.text(b.value, bx + bW / 2, y + 6, { align: "center" });
        doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(120,120,130);
        doc.text(b.label, bx + bW / 2, y + 11, { align: "center" });
      });
      y += 20; addRule();

      // Section scores
      if (results.sectionScores) {
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(200,200,210);
        doc.text("Section Breakdown", margin, y); y += 7;
        const secs = [["experience","Experience"],["skills","Skills"],["education","Education"],["formatting","Formatting"],["impact","Impact"]];
        secs.forEach(([k, lbl]) => {
          const val = results.sectionScores[k] ?? 0;
          const clr = val >= 80 ? [34,197,94] : val >= 50 ? [245,158,11] : [239,68,68];
          doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(160,160,170);
          doc.text(lbl, margin, y);
          doc.setTextColor(...clr); doc.setFont("helvetica","bold");
          doc.text(`${val}`, pageW - margin, y, { align:"right" });
          const barW = colW * (val / 100);
          doc.setFillColor(40,40,50); doc.roundedRect(margin, y + 1.5, colW, 3, 1, 1, "F");
          doc.setFillColor(...clr); doc.roundedRect(margin, y + 1.5, Math.max(2, barW), 3, 1, 1, "F");
          y += 9;
        });
        y += 2; addRule();
      }

      // Skill tags
      if (results.skillTags?.length) {
        checkPage(30);
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(200,200,210);
        doc.text("Detected Skills", margin, y); y += 7;
        let tx = margin;
        results.skillTags.forEach((skill) => {
          const tw = doc.getTextWidth(skill) + 8;
          if (tx + tw > pageW - margin) { tx = margin; y += 8; }
          doc.setFillColor(60,30,100); doc.roundedRect(tx, y - 4, tw, 6, 1, 1, "F");
          doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(180,140,255);
          doc.text(skill, tx + 4, y);
          tx += tw + 3;
        });
        y += 10; addRule();
      }

      // Checklist
      if (results.checklist) {
        checkPage(40);
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(200,200,210);
        doc.text("Resume Checklist", margin, y); y += 7;
        const cl = [
          ["hasContactInfo","Contact Information"],["hasLinkedIn","LinkedIn / Portfolio"],
          ["hasMetrics","Quantified Metrics"],["hasActionVerbs","Action Verbs"],
          ["hasSummary","Professional Summary"],["hasCertifications","Certifications"],
        ];
        const half = Math.ceil(cl.length / 2);
        const col1 = cl.slice(0, half), col2 = cl.slice(half);
        const maxLen = Math.max(col1.length, col2.length);
        for (let i = 0; i < maxLen; i++) {
          [[col1[i], margin],[col2[i], margin + colW/2 + 3]].forEach(([item, x]) => {
            if (!item) return;
            const [key, lbl] = item;
            const passed = results.checklist[key];
            doc.setFontSize(8.5);
            doc.setFont("helvetica", passed ? "bold" : "normal");
            doc.setTextColor(passed ? 34 : 239, passed ? 197 : 68, passed ? 94 : 68);
            doc.text(`${passed ? "✓" : "✗"} ${lbl}`, x, y);
          });
          y += 7;
        }
        y += 2; addRule();
      }

      // Strengths
      if (results.strengths?.length) {
        checkPage(25);
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(34,197,94);
        doc.text("💪 Strengths", margin, y); y += 7;
        results.strengths.forEach((s) => {
          checkPage(14);
          doc.setFillColor(20,50,30); doc.roundedRect(margin, y-3, colW, 10, 2, 2, "F");
          doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(160,230,180);
          const lines = doc.splitTextToSize(`• ${s}`, colW - 6);
          doc.text(lines, margin + 3, y + 1);
          y += lines.length * 4 + 5;
        });
        y += 2;
      }

      // Weaknesses
      if (results.weaknesses?.length) {
        checkPage(25);
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(239,68,68);
        doc.text("⚠️ Areas to Improve", margin, y); y += 7;
        results.weaknesses.forEach((w) => {
          checkPage(14);
          doc.setFillColor(50,15,15); doc.roundedRect(margin, y-3, colW, 10, 2, 2, "F");
          doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(240,150,150);
          const lines = doc.splitTextToSize(`• ${w}`, colW - 6);
          doc.text(lines, margin + 3, y + 1);
          y += lines.length * 4 + 5;
        });
        y += 2;
      }

      // Suggestions
      if (results.suggestions?.length) {
        checkPage(25);
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(167,139,250);
        doc.text("✨ AI Suggestions", margin, y); y += 7;
        results.suggestions.forEach((s, i) => {
          checkPage(14);
          doc.setFillColor(30,15,50); doc.roundedRect(margin, y-3, colW, 10, 2, 2, "F");
          doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(200,180,255);
          const lines = doc.splitTextToSize(`${i+1}. ${s}`, colW - 6);
          doc.text(lines, margin + 3, y + 1);
          y += lines.length * 4 + 5;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        doc.setFontSize(7); doc.setTextColor(80,80,90); doc.setFont("helvetica","normal");
        doc.text(`Generated by ResumeAI  •  Page ${p} of ${pageCount}`, pageW / 2, 290, { align: "center" });
      }

      doc.save(`ResumeAI_Review_${jobRole ? jobRole.replace(/\s+/g,"-") + "_" : ""}${Date.now()}.pdf`);
    } catch (e) {
      console.error("PDF error:", e);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button onClick={handleDownload} disabled={downloading} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
      downloading
        ? "bg-purple-500/20 border border-purple-500/40 text-purple-400 cursor-wait"
        : "bg-purple-600/20 border border-purple-500/30 dark:text-purple-300 text-purple-700 hover:bg-purple-600/30 hover:scale-105"
    }`}>
      {downloading ? (
        <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating…</>
      ) : (
        <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3"/></svg>Download PDF</>
      )}
    </button>
  );
}

/* ─── Result Section ───────────────────────────────────────────── */
function ResultSection({ icon, title, accentClass, headerColor, dotColor, items, itemBg, delay = 0 }) {
  return (
    <div className={`rounded-2xl border p-6 ${accentClass} animate-fadeInUp`} style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className={`text-base font-bold tracking-tight ${headerColor}`}>{title}</h3>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full border ${headerColor} border-current opacity-70`}>{items.length} items</span>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${itemBg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 mt-2`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────────────────── */
export default function ReviewPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");
  const resultsRef = useRef(null);
  const fileInputRef = useRef(null);
  const { history, addEntry, clearHistory } = useScoreHistory();

  async function handleAnalyze() {
    if (!resumeText.trim() || loading) return;
    setLoading(true); setResults(null); setError(null);
    setShowConfetti(false); setAnimateScore(false);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
      setResults(data);
      addEntry(data.score ?? 0, jobRole);
      setTimeout(() => {
        setAnimateScore(true);
        if ((data.score ?? 0) >= 80) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
      }, 150);
      setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResults(null); setResumeText(""); setJobRole("");
    setError(null); setShowConfetti(false); setAnimateScore(false);
  }

  async function extractPdfText(file) {
    if (!file || file.type !== "application/pdf") return;
    setPdfLoading(true);
    setPdfFileName(file.name);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const textParts = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        textParts.push(pageText);
      }
      const extracted = textParts.join("\n\n").trim();
      if (extracted.length < 20) {
        setResumeText("Could not extract readable text from this PDF. It may be image-based or scanned. Please paste the text manually.");
      } else {
        setResumeText(extracted);
      }
    } catch (err) {
      console.error("PDF extraction error:", err);
      setResumeText("Failed to read the PDF. Please paste your resume text directly.");
    } finally {
      setPdfLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) extractPdfText(file);
  }

  function handleFileInput(e) {
    const file = e.target.files?.[0];
    if (file) extractPdfText(file);
    e.target.value = "";
  }

  const canAnalyze = resumeText.trim().length > 20 && !loading;
  const badges = results ? buildBadges(results) : [];

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-slate-50 dark:text-white text-slate-900 flex flex-col">
      <ConfettiEffect active={showConfetti} />

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease both; }
      `}</style>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-md dark:bg-[#0a0a0a] bg-slate-50/80">
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">✦</span>
            <span className="text-lg font-bold tracking-tight">Resume<span className="text-purple-400">AI</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs dark:text-gray-400 text-slate-600 border dark:border-white/10 border-slate-200 dark:bg-white/5 bg-white shadow-sm dark:shadow-none px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini AI Ready
            </span>
            <ThemeToggle />
            <Link href="/" className="text-sm dark:text-gray-400 text-slate-600 dark:dark:hover:text-white text-slate-900 hover:text-slate-900 transition-colors">← Back to Home</Link>
          </div>
        </div>
      </nav>

      {/* Page header */}
      <div className="relative z-10 px-6 pt-10 pb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          AI Resume <span className="text-purple-400">Analyzer</span>
        </h1>
        <p className="mt-2 dark:text-gray-400 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Paste your resume, set a target role, and get a detailed AI-powered review in seconds.
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="relative z-10 flex-1 max-w-8xl w-full mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ════ LEFT — Input Panel ════ */}
          <div className="w-full lg:w-[48%] lg:sticky lg:top-6 flex flex-col gap-4">
            <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none p-6">
              <h2 className="text-lg font-bold dark:text-white text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-sm">📋</span>
                Paste Your Resume
              </h2>

              {/* Job role targeting */}
              <div className="mb-4">
                <label className="block text-xs font-semibold dark:text-gray-400 text-slate-600 mb-1.5 tracking-wide">
                  🎯 Target Job Role or Description <span className="dark:text-gray-600 text-slate-400 font-normal">(for tailored feedback)</span>
                </label>
                <textarea
                  id="job-role-input"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Data Scientist, or paste the entire job description..."
                  className="w-full min-h-[100px] resize-y dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none border dark:border-white/10 border-slate-200 dark:hover:border-white/20 border-slate-300 focus:border-purple-500/50 rounded-xl px-4 py-2.5 text-sm dark:text-gray-200 text-slate-800 dark:placeholder-gray-600 placeholder-slate-400 outline-none transition-all duration-200"
                />
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileInput}
              />

              {/* Textarea */}
              <div
                className={`relative rounded-xl border transition-all duration-200 ${dragOver ? "border-purple-500 dark:bg-purple-500/5 bg-purple-50/50" : "dark:border-white/10 border-slate-200 dark:bg-white/[0.02] bg-white shadow-sm dark:shadow-none dark:hover:border-white/20 border-slate-300"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <textarea
                  id="resume-input"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder={"Paste your resume text here...\n\nInclude your work experience, skills, education, and any other relevant sections."}
                  className="w-full min-h-[360px] bg-transparent dark:text-gray-200 text-slate-800 dark:placeholder-gray-600 placeholder-slate-400 text-sm leading-relaxed resize-y p-4 rounded-xl outline-none focus:ring-1 focus:ring-purple-500/50 transition-all duration-200 font-mono"
                />
                {pdfLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 dark:bg-[#0a0a0a] bg-slate-50/80 rounded-xl backdrop-blur-sm">
                    <svg className="w-8 h-8 animate-spin text-purple-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <p className="text-sm dark:text-purple-300 text-purple-700 font-medium">Extracting text from PDF…</p>
                    <p className="text-xs dark:text-gray-500 text-slate-500">{pdfFileName}</p>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 text-[10px] dark:text-gray-600 text-slate-400">
                  {pdfLoading ? "" : `${resumeText.length} chars`}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs dark:text-gray-500 text-slate-500">
                <div className="flex-1 h-px dark:bg-white/5 bg-white shadow-sm dark:shadow-none" /><span>Or drag and drop your PDF</span><div className="flex-1 h-px dark:bg-white/5 bg-white shadow-sm dark:shadow-none" />
              </div>
              <div
                className={`mt-3 rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-3 p-4 cursor-pointer ${dragOver ? "border-purple-500 dark:bg-purple-500/10 bg-purple-100 dark:text-purple-300 text-purple-700" : pdfLoading ? "border-purple-500/50 dark:bg-purple-500/5 bg-purple-50/50 text-purple-400" : "dark:border-white/10 border-slate-200 dark:text-gray-600 text-slate-400 dark:hover:border-white/20 border-slate-300 dark:hover:text-gray-400 text-slate-600"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !pdfLoading && fileInputRef.current?.click()}
              >
                {pdfLoading ? (
                  <><svg className="w-5 h-5 animate-spin text-purple-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span className="text-xs">Reading {pdfFileName}…</span></>
                ) : (
                  <><span className="text-xl">📄</span><span className="text-xs">{dragOver ? "Drop your PDF here!" : "Drop PDF here or click to upload"}</span></>
                )}
              </div>

              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`mt-5 w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${
                  canAnalyze
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30 hover:scale-[1.02] active:scale-[0.98]"
                    : "dark:bg-white/5 bg-white shadow-sm dark:shadow-none dark:text-gray-500 text-slate-500 cursor-not-allowed border dark:border-white/5 border-slate-200"
                }`}
              >
                {loading ? (
                  <><svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>Analyzing with Gemini AI…</span></>
                ) : (
                  <span>Analyze My Resume{jobRole ? ` for ${jobRole}` : ""} →</span>
                )}
              </button>

              {!resumeText.trim() && <p className="mt-3 text-center text-xs dark:text-gray-600 text-slate-400">Paste at least a few lines to enable analysis</p>}
            </div>

            {/* Score history */}
            <ScoreHistory history={history} onClear={clearHistory} />

            {/* Tips */}
            <div className="rounded-2xl border dark:border-purple-500/15 border-purple-200 dark:bg-purple-500/5 bg-purple-50/50 p-5">
              <p className="text-xs font-semibold text-purple-400 mb-3 tracking-wide uppercase">💡 Tips for best results</p>
              <ul className="space-y-2 text-xs dark:text-gray-400 text-slate-600">
                {[
                  "Set a target job role for more tailored suggestions",
                  "Include all sections — experience, skills, education",
                  "Paste raw text (not formatted PDF content)",
                  "Include certifications or measurable achievements",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">›</span>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ════ RIGHT — Results Panel ════ */}
          <div ref={resultsRef} className="w-full lg:flex-1 flex flex-col gap-5">

            {/* Empty state */}
            {!loading && !results && !error && (
              <div className="rounded-2xl border-2 border-dashed dark:border-white/8 border-slate-200 dark:bg-white/[0.015] bg-white shadow-sm dark:shadow-none flex flex-col items-center justify-center text-center p-16 min-h-[480px]">
                <div className="w-16 h-16 rounded-2xl dark:bg-white/5 bg-white shadow-sm dark:shadow-none border dark:border-white/10 border-slate-200 flex items-center justify-center text-3xl mb-5">📊</div>
                <p className="dark:dark:text-gray-300 text-slate-700 text-slate-700 font-semibold text-lg mb-2">Your results will appear here</p>
                <p className="dark:text-gray-600 text-slate-400 text-sm max-w-xs">
                  Paste your resume on the left and click <span className="text-purple-400 font-medium">Analyze My Resume</span> to get started.
                </p>
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-500/25 dark:bg-red-500/5 bg-red-50/50 p-8 flex flex-col items-center text-center gap-4 min-h-[300px] justify-center animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl dark:bg-red-500/10 bg-red-100 border dark:border-red-500/20 border-red-500/10 flex items-center justify-center text-2xl">⚠️</div>
                <div><p className="text-red-400 font-semibold text-base mb-1">Analysis Failed</p><p className="dark:text-gray-400 text-slate-600 text-sm max-w-sm leading-relaxed">{error}</p></div>
                <button onClick={() => setError(null)} className="px-5 py-2.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 dark:text-red-300 text-red-800 text-sm font-semibold transition-all duration-200">Try Again</button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none p-8 flex flex-col items-center justify-center min-h-[480px] gap-6 animate-fadeIn">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-600/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
                </div>
                <div className="text-center">
                  <p className="dark:text-white text-slate-900 font-semibold text-lg">Analyzing your resume…</p>
                  <p className="dark:text-gray-500 text-slate-500 text-sm mt-1">{jobRole ? `Tailoring feedback for ${jobRole}` : "Gemini AI is reading every line"}</p>
                </div>
                <div className="w-full max-w-sm space-y-3 mt-2">
                  {[80, 60, 90, 50].map((w, i) => <div key={i} className="h-3 rounded-full dark:bg-white/5 bg-white shadow-sm dark:shadow-none animate-pulse" style={{ width: `${w}%` }} />)}
                </div>
              </div>
            )}

            {/* RESULTS */}
            {results && !loading && (
              <>
                {/* Score + badges card */}
                <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none p-7 animate-fadeInUp" style={{ animationFillMode: "both" }}>
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                    <div>
                      <p className="text-xs font-semibold dark:text-gray-500 text-slate-500 uppercase tracking-wider">Analysis Complete</p>
                      {jobRole && <p className="text-xs text-purple-400 mt-0.5 font-medium">Targeted for: {jobRole}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CopyFeedbackButton results={results} jobRole={jobRole} />
                      <DownloadPDFButton results={results} jobRole={jobRole} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <ScoreRing score={results.score ?? 0} animate={animateScore} />
                    <div className="flex-1 grid grid-cols-3 gap-3 w-full">
                      {badges.map((badge) => {
                        const c = badgeColors[badge.color];
                        return (
                          <div key={badge.label} className={`rounded-xl border ${c.bg} ${c.border} p-3.5 text-center`}>
                            <div className={`text-base font-extrabold ${c.text} mb-1`}>{badge.value}</div>
                            <div className="text-[11px] dark:text-gray-400 text-slate-600 leading-tight">{badge.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {(results.score ?? 0) >= 80 && (
                    <div className="mt-5 rounded-xl border border-emerald-500/25 dark:dark:bg-emerald-500/8 bg-emerald-50 bg-emerald-50 px-4 py-3 flex items-center gap-3 animate-fadeIn">
                      <span className="text-xl">🎉</span>
                      <div>
                        <p className="text-emerald-400 font-semibold text-sm">Outstanding score!</p>
                        <p className="dark:text-emerald-300 text-emerald-800/60 text-xs">Your resume is well-polished and ready to impress recruiters.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* JD Matcher Widget */}
                {results.matchPercentage != null && (
                  <div className="rounded-2xl border border-purple-500/25 bg-gradient-to-br dark:from-purple-500/10 from-purple-100 dark:to-indigo-500/5 to-indigo-50 p-6 animate-fadeInUp" style={{ animationDelay: "50ms", animationFillMode: "both" }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div className="relative w-24 h-24 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff10" strokeWidth="8" />
                          <circle
                            cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 40} strokeDashoffset={(2 * Math.PI * 40) * (1 - (results.matchPercentage / 100))}
                            style={{ transition: "stroke-dashoffset 1s ease" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-extrabold text-purple-400">{results.matchPercentage}%</span>
                          <span className="text-[9px] dark:text-gray-400 text-slate-600 font-medium uppercase tracking-widest">Match</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-2 flex items-center gap-2">
                          <span className="text-purple-400">⚡</span> Job Description Analyzer
                        </h3>
                        <p className="text-sm dark:dark:text-gray-300 text-slate-700 text-slate-700 leading-relaxed max-w-xl">
                          {results.matchAnalysis || "Based on your resume, the AI has calculated this match score against the job description provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Scores */}
                {results.sectionScores && <SectionScores sectionScores={results.sectionScores} animate={animateScore} />}

                {/* Two-col: skill tags + checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SkillTags skillTags={results.skillTags} />
                  <Checklist checklist={results.checklist} />
                </div>

                {/* Strengths */}
                {results.strengths?.length > 0 && (
                  <ResultSection icon="💪" title="Strengths"
                    accentClass="dark:border-emerald-500/20 border-emerald-500/10 dark:bg-emerald-500/5 bg-emerald-50/50" headerColor="text-emerald-400"
                    dotColor="bg-emerald-400" items={results.strengths}
                    itemBg="dark:dark:bg-emerald-500/8 bg-emerald-50 bg-emerald-50 dark:border-emerald-500/15 border-emerald-200 dark:text-emerald-300 text-emerald-800" delay={100} />
                )}

                {/* Weaknesses */}
                {results.weaknesses?.length > 0 && (
                  <ResultSection icon="⚠️" title="Areas to Improve"
                    accentClass="dark:border-red-500/20 border-red-500/10 dark:bg-red-500/5 bg-red-50/50" headerColor="text-red-400"
                    dotColor="bg-red-400" items={results.weaknesses}
                    itemBg="dark:bg-red-500/8 bg-red-50 dark:border-red-500/15 border-red-200 dark:text-red-300 text-red-800" delay={200} />
                )}

                {/* Suggestions */}
                {results.suggestions?.length > 0 && (
                  <div className="rounded-2xl border dark:border-purple-500/20 border-purple-500/10 dark:bg-purple-500/5 bg-purple-50/50 p-6 animate-fadeInUp" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-lg">✨</span>
                      <h3 className="text-base font-bold dark:text-purple-300 text-purple-700 tracking-tight">AI Suggestions</h3>
                      <span className="ml-auto text-[10px] font-medium text-purple-400 border border-purple-500/25 dark:bg-purple-500/10 bg-purple-100 px-2 py-0.5 rounded-full">Powered by Gemini</span>
                    </div>
                    <ul className="space-y-3">
                      {results.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 rounded-xl border dark:border-purple-500/15 border-purple-200 dark:bg-purple-600/8 bg-purple-50 px-4 py-3.5 text-sm dark:text-purple-100 text-purple-900 leading-relaxed">
                          <span className="text-purple-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer CTA */}
                <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.02] bg-white shadow-sm dark:shadow-none p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeInUp" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
                  <div>
                    <p className="text-sm font-semibold dark:text-white text-slate-900">Want to improve your score?</p>
                    <p className="text-xs dark:text-gray-500 text-slate-500 mt-0.5">Apply the suggestions above and re-analyze for a higher score.</p>
                  </div>
                  <button onClick={handleReset} className="shrink-0 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 dark:text-white text-slate-900 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap">
                    Start Over →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
