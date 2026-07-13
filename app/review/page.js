"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

import { ScoreRing }        from "@/components/ScoreRing";
import { SectionScores }    from "@/components/SectionScores";
import { JobMatchAnalysis } from "@/components/JobMatchAnalysis";
import { DownloadPDFButton } from "@/components/DownloadPDFButton";
import { SkillTags, ScoreHistory } from "@/components/AnalysisCards";
import { Checklist }        from "@/components/Checklist";
import { FeedbackCard }     from "@/components/FeedbackCard";
import { ConfettiEffect }   from "@/components/ConfettiEffect";
import { 
  Sparkles, 
  Search, 
  Edit3, 
  FileText, 
  Settings, 
  UploadCloud, 
  Check, 
  Copy,
  ChevronRight,
  ArrowRight,
  TrendingUp
} from "lucide-react";

// Mock preset templates for quick loading
const PRESETS = {
  engineer: {
    role: "Senior Software Engineer",
    resume: `Alex Chen
email: alex.chen@email.com | github.com/alexchen
Experience:
- Software Engineer at TechCorp (2023 - Present)
  Responsible for writing backend APIs and maintaining services.
  Worked on dockerizing the application and deploying it.
  Helped team members with debugging issues.
- Junior Developer at StartUpCo (2021 - 2023)
  Wrote unit tests for frontend modules.
  Helped migrate legacy codebase.
Education:
  BS in Computer Science from State University`,
    jd: `We are looking for a Senior Software Engineer to scale our backend systems.
Required Skills:
- Expertise in building high-performance APIs and microservices.
- Experience with Kubernetes and Docker orchestration.
- Knowledge of system architecture, CI/CD pipelines, and Prometheus monitoring.`
  },
  designer: {
    role: "Lead Product Designer",
    resume: `Sarah Jenkins
portfolio: sarahj.design
Experience:
- UI/UX Designer at CreativeLab (2022 - Present)
  Created design specs and mockups for the checkout screen.
  Did user testing and shared results with product managers.
  Helped expand UI libraries.
Education:
  BFA in Interaction Design`,
    jd: `We are hiring a Lead Product Designer to own our product design systems.
Requirements:
- Proven experience creating Design Systems and Figma component libraries.
- Strong user testing methodologies, including A/B testing and User Journeys.
- Experience with Heuristic Evaluation.`
  },
  pm: {
    role: "Senior Product Manager",
    resume: `Marcus Vance
Experience:
- Product Manager at ScaleUp (2022 - Present)
  Managed the team backlog and coordinated sprints.
  Gathered feedback and launched new features.
Education:
  MBA from Business School`,
    jd: `We are seeking a Senior Product Manager to drive ARR growth.
Requirements:
- Experience setting Product Roadmaps and aligning KPIs.
- Hands-on data skills with SQL Queries and product analytics.
- Expert facilitator of Agile Scrum sprints.
- Strong Customer Discovery practices.`
  }
};

const RG_BADGE = {
  emerald: { bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)",   text: "#10b981" },
  red:     { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.25)",   text: "#f87171" },
  pink:    { bg: "rgba(0,180,216,0.08)", border: "rgba(0,180,216,0.25)",  text: "#00b4d8" },
  gold:    { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)",  text: "#fbbf24" },
  blue:    { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.25)",  text: "#60a5fa" },
};

function buildBadges(data) {
  return [
    { label: "ATS Ready",  value: data.atsReady ? "✓ Pass" : "✗ Fail", ck: data.atsReady ? "emerald" : "red" },
    { label: "Keywords",   value: data.keywords ?? "—",                  ck: data.keywords === "Strong" ? "pink" : data.keywords === "Weak" ? "red" : "gold" },
    { label: "Formatting", value: data.formatting ?? "—",                ck: data.formatting === "Clean" ? "gold" : data.formatting === "Messy" ? "red" : "blue" },
  ];
}

const HISTORY_KEY = "resumeai_score_history";
function useScoreHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    try { const raw = localStorage.getItem(HISTORY_KEY); if (raw) setHistory(JSON.parse(raw)); } catch {}
  }, []);
  function addEntry(score, role) {
    const entry = { score, role: role || "General", date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), ts: Date.now() };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 8);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }
  function clearHistory() { setHistory([]); try { localStorage.removeItem(HISTORY_KEY); } catch {} }
  return { history, addEntry, clearHistory };
}

export default function ReviewPage() {
  const [resumeText, setResumeText]         = useState("");
  const [jobRole, setJobRole]               = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading]               = useState(false);
  const [results, setResults]               = useState(null);
  const [error, setError]                   = useState(null);
  const [dragOver, setDragOver]             = useState(false);
  const [showConfetti, setShowConfetti]     = useState(false);
  const [animateScore, setAnimateScore]     = useState(false);
  const [pdfFileName, setPdfFileName]       = useState("");
  const [cooldown, setCooldown]             = useState(0);
  const [confirmReset, setConfirmReset]     = useState(false);

  // Tabs navigation state
  const [activeTab, setActiveTab]           = useState("audit"); // 'audit', 'keywords', 'bullets', 'strategy'

  // Single bullet optimizer state
  const [singleBulletText, setSingleBulletText] = useState("");
  const [singleBulletResult, setSingleBulletResult] = useState(null);
  const [singleBulletLoading, setSingleBulletLoading] = useState(false);
  const [singleBulletCopied, setSingleBulletCopied] = useState(false);

  const resultsRef   = useRef(null);
  const fileInputRef = useRef(null);
  const cooldownRef  = useRef(null);
  const { history, addEntry, clearHistory } = useScoreHistory();

  function startCooldown(seconds = 60) {
    setCooldown(seconds);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => { if (prev <= 1) { clearInterval(cooldownRef.current); return 0; } return prev - 1; });
    }, 1000);
  }
  useEffect(() => () => clearInterval(cooldownRef.current), []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    setPdfFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
        GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const pdf = await getDocument({ data: new Uint8Array(event.target.result) }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          fullText += tc.items.map(it => it.str).join(" ") + "\n";
        }
        setResumeText(fullText);
      } catch (e) { console.error(e); setError("Failed to parse PDF. Please try copy-pasting the text instead."); }
    };
    reader.readAsArrayBuffer(file);
  };

  async function handleAnalyze() {
    if (!resumeText.trim() || loading || cooldown > 0) return;
    setLoading(true); setResults(null); setError(null); setShowConfetti(false); setAnimateScore(false);
    try {
      const res = await fetch("/api/review", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobRole, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
      setResults(data);
      addEntry(data.score ?? 0, jobRole);
      startCooldown(60);
      setActiveTab("audit"); // Reset to dashboard tab on results load
      setTimeout(() => {
        setAnimateScore(true);
        if ((data.score ?? 0) >= 80) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  // Handle single-bullet optimization API call
  async function handleOptimizeSingleBullet() {
    if (!singleBulletText.trim() || singleBulletLoading) return;
    setSingleBulletLoading(true);
    setSingleBulletResult(null);
    setSingleBulletCopied(false);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single-bullet",
          bulletText: singleBulletText,
          jobRole,
          jobDescription
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to optimize sentence.");
      setSingleBulletResult(data);
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setSingleBulletLoading(false);
    }
  }

  const handleResetAll = () => {
    setResumeText("");
    setJobRole("");
    setJobDescription("");
    setResults(null);
    setError(null);
    setPdfFileName("");
    setSingleBulletText("");
    setSingleBulletResult(null);
    setConfirmReset(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load preset data helpers
  const loadPreset = (key) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setResumeText(preset.resume);
    setJobRole(preset.role);
    setJobDescription(preset.jd);
    setPdfFileName("");
    setError(null);
  };

  const copySingleBulletImproved = async () => {
    if (!singleBulletResult?.improved) return;
    try {
      await navigator.clipboard.writeText(singleBulletResult.improved);
      setSingleBulletCopied(true);
      setTimeout(() => setSingleBulletCopied(false), 2000);
    } catch {}
  };

  const canAnalyze  = resumeText.trim().length > 20 && !loading;
  const MAX_CHARS   = 30000;
  const charCount   = resumeText.length;
  const isNearLimit = charCount > MAX_CHARS * 0.85;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-background text-foreground">
      
      {/* Background loop video overlay */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-[#001f3f]/10" />
      </div>

      <ConfettiEffect active={showConfetti} />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-white/[0.04] bg-background/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group select-none">
            <span className="text-2xl transition-transform group-hover:rotate-12">✦</span>
            <span className="text-xl font-bold tracking-tight">
              Resume<span className="text-muted-foreground">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          </div>
        </div>
      </nav>

      {/* Main Review Layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* ── LEFT COLUMN: CONTROLS & INPUTS ── */}
          <div className="xl:col-span-5 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Career Audit Console
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Provide your credentials below. Use one of our targeted templates to test immediate scoring configurations.
              </p>
            </div>

            {/* Presets Selector bar */}
            <div className="p-4 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md">
              <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Load Test Presets</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => loadPreset("engineer")}
                  className="px-3.5 py-1.5 rounded-xl text-[10px] font-semibold border border-white/[0.04] bg-white/[0.02] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Software Eng.
                </button>
                <button
                  onClick={() => loadPreset("designer")}
                  className="px-3.5 py-1.5 rounded-xl text-[10px] font-semibold border border-white/[0.04] bg-white/[0.02] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Product Designer
                </button>
                <button
                  onClick={() => loadPreset("pm")}
                  className="px-3.5 py-1.5 rounded-xl text-[10px] font-semibold border border-white/[0.04] bg-white/[0.02] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Product Manager
                </button>
              </div>
            </div>

            {/* Textarea & File Uploader Container */}
            <div className="space-y-4">
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange({ target: { files: e.dataTransfer.files } }); }}
                className="relative rounded-3xl border border-dashed transition-all duration-300"
                style={dragOver
                  ? { borderColor: "#00b4d8", background: "rgba(0,180,216,0.05)", transform: "scale(1.005)" }
                  : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.01)", backdropFilter: "blur(12px)" }
                }
              >
                <textarea
                  id="resume-textarea"
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here or drag in a PDF..."
                  maxLength={MAX_CHARS}
                  className="w-full h-80 bg-transparent border-none focus:ring-0 p-6 pb-14 text-xs resize-none font-sans leading-relaxed text-foreground outline-none"
                  style={{ caretColor: "#00b4d8" }}
                />

                <div
                  className="absolute bottom-16 right-6 text-[9px] font-bold tabular-nums select-none"
                  style={{ color: isOverLimit ? "#f87171" : isNearLimit ? "#fbbf24" : "rgba(255,255,255,0.3)" }}
                >
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </div>

                {pdfFileName && (
                  <div
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-[#00b4d8]/20 bg-[#00b4d8]/5 text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse" />
                    {pdfFileName}
                  </div>
                )}

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-muted-foreground hover:text-foreground transition-all"
                  >
                    <UploadCloud size={14} />
                    Upload PDF
                  </button>
                  {resumeText && (
                    <button
                      onClick={() => { setResumeText(""); setPdfFileName(""); }}
                      className="px-3 py-2 rounded-xl text-[10px] font-bold border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Job Role Input */}
              <div className="space-y-2">
                <label htmlFor="job-role-input" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Target Job Role
                </label>
                <input
                  id="job-role-input"
                  type="text"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-4 py-3 rounded-2xl text-xs outline-none border border-white/[0.06] bg-white/[0.01] text-foreground focus:border-[#00b4d8]/50 focus:shadow-[0_0_10px_rgba(0,180,216,0.1)] transition-all"
                />
              </div>

              {/* Job Description Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="job-description-textarea" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <span>🎯</span> Job Description
                    <span className="normal-case text-[9px] text-muted-foreground/60">(Optional — unlocks keyword matrix)</span>
                  </label>
                  {jobDescription.trim() && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border border-green-500/20 bg-green-500/5 text-green-400">
                      Active
                    </div>
                  )}
                </div>

                <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
                  <textarea
                    id="job-description-textarea"
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={4}
                    className="w-full px-4 py-3 pb-8 bg-transparent border-none focus:ring-0 text-xs resize-none font-sans leading-relaxed text-foreground outline-none"
                    style={{ caretColor: "#00b4d8" }}
                  />
                  {jobDescription && (
                    <button
                      onClick={() => setJobDescription("")}
                      className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg text-[9px] font-bold border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Analyze CTA */}
              <button
                id="analyze-button"
                onClick={handleAnalyze}
                disabled={!canAnalyze || cooldown > 0}
                className="w-full relative flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300"
                style={canAnalyze && cooldown === 0
                  ? { background: "linear-gradient(135deg, #001f3f, #00b4d8)", border: "1px solid rgba(255,255,255,0.08)", color: "white", boxShadow: "0 0 20px rgba(0,180,216,0.15)" }
                  : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }
                }
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Auditing Credentials…
                  </>
                ) : cooldown > 0 ? (
                  <span>Cooldown: Wait {cooldown}s</span>
                ) : (
                  <>Audit Resume <ArrowRight size={14} /></>
                )}
              </button>
            </div>

            {/* Match History */}
            <ScoreHistory history={history} onClear={clearHistory} />
          </div>

          {/* ── RIGHT COLUMN: RESULTS EXPLORER ── */}
          <div className="xl:col-span-7" ref={resultsRef}>

            {/* Empty state */}
            {!results && !loading && !error && (
              <div
                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-[40px] border border-dashed border-white/[0.08] bg-white/[0.01]"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-5 opacity-40 border border-white/10 bg-white/[0.02]"
                >
                  📑
                </div>
                <h2 className="text-xl font-normal mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Awaiting Credentials</h2>
                <p className="text-xs max-w-xs leading-relaxed text-muted-foreground">
                  Your structured audits, keyword matching matrix, and optimized sentences will appear here.
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-t-[#00b4d8] animate-spin" style={{ borderColor: "rgba(255,255,255,0.05)", borderTopColor: "#00b4d8" }} />
                  <div className="absolute inset-2 rounded-full border-2 border-b-[#fbbf24] animate-spin-slow" style={{ borderColor: "rgba(255,255,255,0.05)", borderBottomColor: "#fbbf24" }} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">The AI is scanning structural layouts…</p>
                  <p className="text-[10px] text-muted-foreground/60">Estimating keyword weights and formatting errors.</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-3xl p-8 text-center space-y-4 border border-red-500/25 bg-red-500/5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto bg-red-500/10">⚠️</div>
                <h3 className="font-semibold text-base text-red-400">Analysis Error</h3>
                <p className="text-xs leading-relaxed max-w-md mx-auto text-red-300">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="px-5 py-2 rounded-full text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results Output */}
            {results && !loading && (
              <div className="space-y-6 animate-fade-rise">

                {/* Dashboard Header Status Card */}
                <div
                  className="rounded-[40px] p-8 border border-white/[0.06] bg-white/[0.01] backdrop-blur-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <span className="text-[100px] font-serif">✦</span>
                  </div>

                  <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.04]">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.08] bg-white/[0.02]">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                        {jobRole.trim() ? "Scored Target Role" : "Audit Mode"}
                      </p>
                      <p className="text-sm font-bold tracking-tight text-foreground truncate">
                        {jobRole.trim() ? jobRole.trim() : "General Resume Audit"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DownloadPDFButton results={results} jobRole={jobRole} />
                      {confirmReset ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-red-400 font-semibold whitespace-nowrap">Sure?</span>
                          <button
                            onClick={handleResetAll}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmReset(false)}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmReset(true)}
                          className="px-4 py-2 rounded-full text-xs font-semibold border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                    <ScoreRing score={results.score} animate={animateScore} />
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                        {buildBadges(results).map(b => (
                          <div key={b.label} className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{b.label}</span>
                            <span
                              className="px-3.5 py-1 rounded-full text-xs font-semibold border"
                              style={{ background: RG_BADGE[b.ck].bg, borderColor: RG_BADGE[b.ck].border, color: RG_BADGE[b.ck].text }}
                            >
                              {b.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── DYNAMIC TABS SELECTOR ─── */}
                <div className="p-1 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md flex gap-1">
                  {[
                    { id: "audit", label: "📊 Audit Dashboard" },
                    { id: "keywords", label: "🔍 Keywords & Match" },
                    { id: "bullets", label: "✍️ Bullet Optimizer" },
                    { id: "strategy", label: "💡 Career Growth" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-foreground text-background border border-foreground shadow-lg"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ─── TAB CONTENT: AUDIT ─── */}
                {activeTab === "audit" && (
                  <div className="space-y-6 animate-fade-rise">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SectionScores sectionScores={results.sectionScores} animate={animateScore} />
                      <Checklist checklist={results.checklist} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FeedbackCard delay={100} icon="💪" title="Major Strengths"
                        accentClass="" headerColor="" dotColor=""
                        items={results.strengths}
                        styleOverride={{
                          card: { background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "24px", backdropFilter: "blur(16px)" },
                          title: { color: "#a7f3d0" },
                          dot: { background: "#10b981" },
                          item: { color: "#a7f3d0" },
                        }}
                      />
                      <FeedbackCard delay={150} icon="⚠️" title="Critical Improvements"
                        accentClass="" headerColor="" dotColor=""
                        items={results.weaknesses}
                        styleOverride={{
                          card: { background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "24px", backdropFilter: "blur(16px)" },
                          title: { color: "#fca5a5" },
                          dot: { background: "#ef4444" },
                          item: { color: "#fca5a5" },
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* ─── TAB CONTENT: KEYWORDS ─── */}
                {activeTab === "keywords" && (
                  <div className="space-y-6 animate-fade-rise">
                    <JobMatchAnalysis results={results} hasJobDescription={!!jobDescription.trim()} />
                    <SkillTags skillTags={results.skillTags} />
                  </div>
                )}

                {/* ─── TAB CONTENT: BULLET EDITOR ─── */}
                {activeTab === "bullets" && (
                  <div className="space-y-6 animate-fade-rise">
                    
                    {/* Comparative Bullet list from parser */}
                    {results.rewrittenBullets?.length > 0 ? (
                      <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                          📝 Resume Bullet Point Rewrites
                        </h4>
                        <div className="space-y-4">
                          {results.rewrittenBullets.map((bullet, i) => (
                            <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[9px] uppercase tracking-wider text-red-400 font-bold mb-1">Original Line</p>
                                  <p className="text-xs text-muted-foreground line-through leading-relaxed">{bullet.original}</p>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-white/[0.04] pt-3 md:pt-0 md:pl-4">
                                  <p className="text-[9px] uppercase tracking-wider text-green-400 font-bold mb-1">AI Optimized</p>
                                  <p className="text-xs text-foreground font-medium leading-relaxed">{bullet.improved}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-white/[0.06] bg-white/[0.01] rounded-3xl">
                        <p className="text-xs text-muted-foreground">Add a job description to extract target resume bullet rewrites.</p>
                      </div>
                    )}

                    {/* LIVE SINGLE BULLET OPTIMIZER FORM */}
                    <div className="p-6 rounded-[32px] border border-white/[0.06] bg-white/[0.01] backdrop-blur-md space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        <h3 className="text-sm font-bold tracking-tight text-foreground">Interactive Single-Bullet Optimizer</h3>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Have a specific resume sentence you want to rewrite? Paste it below and get an instantly optimized version with metrics and action verbs.
                      </p>

                      <div className="space-y-3">
                        <textarea
                          value={singleBulletText}
                          onChange={e => setSingleBulletText(e.target.value)}
                          placeholder="e.g. Led checkout feature and worked with devs to ship it."
                          rows={2}
                          className="w-full px-4 py-3 rounded-2xl text-xs outline-none border border-white/[0.06] bg-transparent text-foreground focus:border-[#00b4d8]/40 focus:shadow-[0_0_10px_rgba(0,180,216,0.05)] transition-all resize-none leading-relaxed"
                          style={{ caretColor: "#00b4d8" }}
                        />

                        <button
                          onClick={handleOptimizeSingleBullet}
                          disabled={!singleBulletText.trim() || singleBulletLoading}
                          className="px-6 py-2.5 rounded-full text-xs font-bold border tracking-wide uppercase transition-all flex items-center justify-center gap-2"
                          style={singleBulletText.trim() && !singleBulletLoading
                            ? { background: "linear-gradient(135deg, #001f3f, #00b4d8)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }
                            : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }
                          }
                        >
                          {singleBulletLoading ? (
                            <>
                              <svg className="w-3.5 h-3.5 animate-spin text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                              Rewriting…
                            </>
                          ) : (
                            <>Optimize Sentence</>
                          )}
                        </button>
                      </div>

                      {/* Display single-bullet optimized outcome */}
                      {singleBulletResult && (
                        <div className="border-t border-white/[0.04] pt-5 mt-4 space-y-4 animate-fade-rise">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Original block */}
                            <div className="p-4 rounded-2xl border border-red-500/10 bg-red-500/[0.02]">
                              <p className="text-[8px] uppercase tracking-widest text-red-400 font-bold mb-1">Original Description</p>
                              <p className="text-xs text-muted-foreground line-through leading-relaxed italic">{singleBulletResult.original}</p>
                            </div>

                            {/* Improved block */}
                            <div className="p-4 rounded-2xl border border-green-500/15 bg-green-500/[0.02] relative group">
                              <p className="text-[8px] uppercase tracking-widest text-green-400 font-bold mb-1">AI Optimized (Copyable)</p>
                              <p className="text-xs text-foreground font-bold leading-relaxed pr-8">{singleBulletResult.improved}</p>
                              
                              <button
                                onClick={copySingleBulletImproved}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
                                title="Copy to clipboard"
                              >
                                {singleBulletCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                              </button>
                            </div>

                          </div>

                          {/* Explanation banner */}
                          <div className="p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] text-[10px] text-muted-foreground flex gap-2 items-start">
                            <span className="text-green-400">💡</span>
                            <span>{singleBulletResult.explanation}</span>
                          </div>

                        </div>
                      )}

                    </div>

                  </div>
                )}

                {/* ─── TAB CONTENT: STRATEGY ─── */}
                {activeTab === "strategy" && (
                  <div className="space-y-6 animate-fade-rise">
                    
                    {/* Strategy Advice suggestions */}
                    <div
                      className="rounded-[32px] p-6 border border-white/[0.06] bg-white/[0.01] backdrop-blur-md"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-xl">💡</span>
                        <h3 className="text-base font-bold text-foreground">Smart Strategy Advice</h3>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.suggestions.map((s, i) => (
                          <li
                            key={i}
                            className="p-4 rounded-2xl text-xs leading-relaxed font-semibold border border-white/[0.04] bg-white/[0.01] text-muted-foreground"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Career Boost Projects */}
                    {results.projectSuggestions?.length > 0 ? (
                      <div className="p-6 rounded-[32px] border border-white/[0.06] bg-white/[0.01] backdrop-blur-md">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                          ⚡ Career Boost Projects
                        </h4>
                        <div className="space-y-3">
                          {results.projectSuggestions.map((project, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 rounded-2xl border border-white/[0.04] bg-white/[0.01]"
                            >
                              <div className="mt-0.5 text-amber-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              </div>
                              <p className="text-xs leading-relaxed font-medium text-muted-foreground">{project}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-white/[0.06] bg-white/[0.01] rounded-3xl">
                        <p className="text-xs text-muted-foreground">Add a job description to generate targeted boost project ideas.</p>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
