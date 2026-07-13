"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

// Mock preset data for the interactive sandbox
const PRESETS = {
  engineer: {
    role: "Senior Software Engineer",
    name: "Alex Chen",
    scoreBefore: 64,
    scoreAfter: 92,
    matchBefore: 55,
    matchAfter: 91,
    missingKeywords: ["Kubernetes", "gRPC", "CI/CD pipelines", "System Design", "Prometheus"],
    bullets: [
      {
        original: "Responsible for writing backend APIs and maintaining services.",
        improved: "Designed and built high-performance gRPC services, reducing API response times by 40%."
      },
      {
        original: "Worked on dockerizing the application and deploying it.",
        improved: "Orchestrated CI/CD pipelines via Kubernetes, saving 15 engineering hours per week."
      }
    ],
    checklist: {
      contact: true,
      linkedin: false,
      metrics: false,
      verbs: true,
      summary: true,
      certs: false
    },
    checklistAfter: {
      contact: true,
      linkedin: true,
      metrics: true,
      verbs: true,
      summary: true,
      certs: true
    }
  },
  designer: {
    role: "Lead Product Designer",
    name: "Sarah Jenkins",
    scoreBefore: 59,
    scoreAfter: 89,
    matchBefore: 48,
    matchAfter: 87,
    missingKeywords: ["Design System", "Figma Components", "A/B Testing", "User Journeys", "Heuristic Evaluation"],
    bullets: [
      {
        original: "Created design specs and mockups for the checkout screen.",
        improved: "Led Checkout Redesign utilizing a custom Design System, boosting conversion by 22%."
      },
      {
        original: "Did user testing and shared results with product managers.",
        improved: "Conducted A/B testing and customer journeys with 200+ users, streamlining user activation."
      }
    ],
    checklist: {
      contact: true,
      linkedin: true,
      metrics: false,
      verbs: false,
      summary: true,
      certs: false
    },
    checklistAfter: {
      contact: true,
      linkedin: true,
      metrics: true,
      verbs: true,
      summary: true,
      certs: true
    }
  },
  pm: {
    role: "Senior Product Manager",
    name: "Marcus Vance",
    scoreBefore: 61,
    scoreAfter: 90,
    matchBefore: 52,
    matchAfter: 88,
    missingKeywords: ["Product Roadmap", "KPI Alignment", "Agile Scrum", "Customer Discovery", "SQL Queries"],
    bullets: [
      {
        original: "Managed the team backlog and coordinated sprints.",
        improved: "Facilitated Agile Scrum workflows, increasing team delivery velocity by 30%."
      },
      {
        original: "Gathered feedback and launched new features.",
        improved: "Synthesized Customer Discovery data into a strategic Roadmap, yielding $1.2M ARR."
      }
    ],
    checklist: {
      contact: false,
      linkedin: true,
      metrics: false,
      verbs: true,
      summary: false,
      certs: true
    },
    checklistAfter: {
      contact: true,
      linkedin: true,
      metrics: true,
      verbs: true,
      summary: true,
      certs: true
    }
  }
};

export default function Home() {
  const videoRef = useRef(null);
  const [selectedPreset, setSelectedPreset] = useState("engineer");
  const [demoState, setDemoState] = useState("after"); // 'before' or 'after'
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(PRESETS.engineer.scoreAfter);

  // Intersection observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Force play background video on interaction fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      video.play().then(() => {
        window.removeEventListener("click", attemptPlay);
        window.removeEventListener("touchstart", attemptPlay);
      }).catch(() => {});
    };

    video.play().catch(() => {
      window.addEventListener("click", attemptPlay);
      window.addEventListener("touchstart", attemptPlay);
    });

    return () => {
      window.removeEventListener("click", attemptPlay);
      window.removeEventListener("touchstart", attemptPlay);
    };
  }, []);

  // Count up animation logic for the sandbox score ring
  const currentPresetData = PRESETS[selectedPreset];
  const targetScore = demoState === "before" ? currentPresetData.scoreBefore : currentPresetData.scoreAfter;

  useEffect(() => {
    let start = animatedScore;
    const end = targetScore;
    if (start === end) return;

    const duration = 800; // ms
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (cubic ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentScore = Math.round(start + (end - start) * easedProgress);
      setAnimatedScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [targetScore, selectedPreset]);

  // Toggle FAQ items
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-background text-foreground">
      
      {/* ─── FIXED ATMOSPHERIC VIDEO BACKGROUND ─────────────────── */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            type="video/mp4"
          />
        </video>
        {/* Subtle cinematic gradient to transition into deep navy page sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-1" />
      </div>

      {/* ─── NAVIGATION BAR ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-white/[0.04] bg-background/20">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl tracking-tight text-foreground select-none flex items-center gap-1"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            ResumeAI<sup className="text-xs font-normal relative -top-1">®</sup>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-sm font-medium text-foreground transition-colors hover:text-foreground">
              Home
            </a>
            <span className="text-sm text-muted-foreground/30 cursor-default">/</span>
            <a href="#sandbox" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Interactive Demo
            </a>
            <span className="text-sm text-muted-foreground/30 cursor-default">/</span>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <span className="text-sm text-muted-foreground/30 cursor-default">/</span>
            <a href="#faqs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </div>

          <Link
            href="/review"
            className="liquid-glass rounded-full px-6 py-2 text-sm text-foreground hover:scale-[1.03] transition-transform duration-300 flex items-center justify-center font-medium"
          >
            Review Resume
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      <section id="hero" className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-[90px] max-w-7xl mx-auto">
        <h1
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] font-normal text-foreground animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where <em className="not-italic text-muted-foreground">dreams</em> rise <br />
          <em className="not-italic text-muted-foreground">through the silence.</em>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
          We're designing tools for deep thinkers, bold creators, and quiet rebels.
          Amid the chaos, we build digital spaces for sharp focus and inspired work.
        </p>

        <Link
          href="/review"
          className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] transition-transform duration-300 flex items-center justify-center font-medium animate-fade-rise-delay-2"
        >
          Begin Journey
        </Link>
      </section>

      {/* ─── SECTION 2: INTERACTIVE SANDBOX ─────────────────────── */}
      <section id="sandbox" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 reveal-on-scroll">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl tracking-tight font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
            The Interactive Sandbox
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mt-3">
            Select a target profile to test-drive how our AI parses text, identifies missing keywords, and optimizes bullet points instantly.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex justify-center gap-3 mb-10">
          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSelectedPreset(key);
                setAnimatedScore(PRESETS[key].scoreAfter);
              }}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                selectedPreset === key
                  ? "bg-foreground text-background border-foreground shadow-lg"
                  : "bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-foreground"
              }`}
            >
              {PRESETS[key].role}
            </button>
          ))}
        </div>

        {/* Sandbox Console Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Settings & Score */}
          <div className="lg:col-span-4 flex flex-col justify-between p-8 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md">
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Target Candidate</h3>
                <p className="text-xl font-bold tracking-tight">{currentPresetData.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{currentPresetData.role}</p>
              </div>

              {/* Toggle State */}
              <div className="p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] flex">
                <button
                  onClick={() => setDemoState("before")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    demoState === "before"
                      ? "bg-red-500/10 border border-red-500/20 text-red-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Original Resume
                </button>
                <button
                  onClick={() => setDemoState("after")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    demoState === "after"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  AI Optimized
                </button>
              </div>
            </div>

            {/* Glowing Score Ring */}
            <div className="flex flex-col items-center justify-center my-8">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={demoState === "before" ? "#f43f5e" : "#10b981"}
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - animatedScore / 100)}
                    className="transition-all duration-300"
                    style={{ strokeLinecap: "round", filter: `drop-shadow(0 0 4px ${demoState === "before" ? "#f43f5e" : "#10b981"}50)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold tracking-tighter">{animatedScore}</span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-4 font-bold">Overall AI Score</p>
            </div>

            {/* JD Match Percentage */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Target JD Match</p>
                <p className="text-sm font-semibold mt-0.5">Applicant Tracking Compatibility</p>
              </div>
              <span className={`text-xl font-bold ${demoState === "before" ? "text-red-400" : "text-green-400"}`}>
                {demoState === "before" ? currentPresetData.matchBefore : currentPresetData.matchAfter}%
              </span>
            </div>

          </div>

          {/* Right Column: Console Details */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Box 1: Tailored Bullet point comparison */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md flex-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <span>✍️</span> Quantified Bullet Enhancements
              </h4>
              <div className="space-y-4">
                {currentPresetData.bullets.map((b, i) => (
                  <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-red-400 font-bold mb-1">Before (Task description)</p>
                      <p className="text-xs text-muted-foreground line-through leading-relaxed">{b.original}</p>
                    </div>
                    {demoState === "after" && (
                      <div className="border-t border-white/[0.04] pt-3">
                        <p className="text-[9px] uppercase tracking-wider text-green-400 font-bold mb-1">After (Outcome-focused metric)</p>
                        <p className="text-xs text-foreground font-medium leading-relaxed flex items-start gap-2">
                          <span className="text-green-400">✓</span> {b.improved}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Missing Keywords & Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Missing keywords */}
              <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  🔑 Required JD Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentPresetData.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all border ${
                        demoState === "before"
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-green-500/10 border-green-500/20 text-green-400"
                      }`}
                    >
                      {demoState === "before" ? `Missing: ${kw}` : `Integrated: ${kw}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  📋 Fundamental Audit
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                  {[
                    { key: "contact", label: "Contact Info" },
                    { key: "linkedin", label: "LinkedIn Link" },
                    { key: "metrics", label: "Impact Metrics" },
                    { key: "verbs", label: "Action Verbs" },
                  ].map((chk) => {
                    const pass = demoState === "before" ? currentPresetData.checklist[chk.key] : currentPresetData.checklistAfter[chk.key];
                    return (
                      <div
                        key={chk.key}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                          pass
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}
                      >
                        <span>{pass ? "✓" : "✗"}</span>
                        <span>{chk.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ─── SECTION 3: FEATURE SHOWCASE ────────────────────────── */}
      <section id="features" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 reveal-on-scroll">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl tracking-tight font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Engineered for Deep Thinkers
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-3">
            Your career strategy is an art form. We build visual clarity into the review process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Totally Client-Side",
              desc: "Extract text inside your browser automatically via PDF.js. Your resume remains private, offline, and secure."
            },
            {
              icon: Cpu,
              title: "Gemini 2.5 Flash API",
              desc: "Harness sub-second, multi-layered career evaluation logic directly in-browser to bypass slow traditional parsers."
            },
            {
              icon: Sparkles,
              title: "Bullet Optimization",
              desc: "Automatically upgrade simple task descriptions into metric-focused outcomes tailored to the job description."
            },
            {
              icon: FileText,
              title: "Executive Export",
              desc: "Download high-contrast, ATS-friendly report files formatted perfectly for physical prints or digital scanners."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-foreground group-hover:scale-105 transition-transform duration-300 mb-6">
                  <item.icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-bold tracking-tight mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 4: THE ATS VISUALIZER ──────────────────────── */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 reveal-on-scroll">
        <div className="p-8 sm:p-12 rounded-[40px] border border-white/[0.06] bg-white/[0.01] backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex-1 space-y-4">
            <span className="px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border border-white/[0.08] bg-white/[0.02] text-muted-foreground font-semibold">
              Parser Insight
            </span>
            <h2 className="text-3xl sm:text-4xl tracking-tight font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Visualizing the ATS Scan
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Applicant Tracking Systems isolate structural keywords to categorize your rank. ResumeAI simulates the scan path in real-time, highlighting matching skills and locating textual gaps instantly.
            </p>
            <div className="pt-2">
              <Link
                href="/review"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground group"
              >
                Launch scan tool <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Scanner Visual Card */}
          <div className="w-full max-w-[320px] shrink-0 border border-white/[0.08] bg-[#001020] rounded-3xl p-5 relative overflow-hidden h-64 shadow-2xl">
            {/* The Scan Laser Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent z-2 animate-scan" />
            
            <div className="space-y-4 relative z-1 select-none">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                <div>
                  <div className="w-16 h-2 bg-white/20 rounded mb-1" />
                  <div className="w-24 h-1.5 bg-white/10 rounded" />
                </div>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-white font-bold">90</div>
              </div>
              <div className="space-y-2.5">
                {[
                  { w: "w-full", kw: "Led Kubernetes orchestration across multi-region nodes." },
                  { w: "w-[85%]", kw: "Managed CI/CD deployment reducing time by 30%." },
                  { w: "w-[90%]", kw: "Refactored Go backend APIs using gRPC endpoints." },
                ].map((row, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-[9px] text-white/50 leading-relaxed font-mono">
                      {row.kw.split(" ").map((word, idx) => {
                        const isMatch = ["Kubernetes", "CI/CD", "gRPC", "APIs"].includes(word.replace(/[^a-zA-Z]/g, ""));
                        return (
                          <span
                            key={idx}
                            className={`transition-colors duration-500 mr-1 ${
                              isMatch ? "text-[#00b4d8] font-bold drop-shadow-[0_0_2px_rgba(0,180,216,0.5)]" : "text-white/40"
                            }`}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>
                    <div className={`h-1 bg-white/5 rounded ${row.w}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 5: QUIET REBELS (TESTIMONIALS) ───────────────── */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 reveal-on-scroll">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl tracking-tight font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Quiet Rebels. Audited Success.
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2">
            Feedback from builders and creatives who bypassed generic SAAS templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "ResumeAI completely re-framed how I describe my impact. Instead of writing general task descriptions, I focused on outcomes. I secured multiple system engineering interviews within ten days.",
              author: "Elena Rostova",
              role: "Senior Distributed Systems Engineer"
            },
            {
              quote: "The keyword gap tool is incredibly precise. It scanned the job description, compared my design resume layout, and highlighted exactly which Figma and research keywords were missing. Fully client-side.",
              author: "Dorian Mercer",
              role: "Staff Product Designer"
            }
          ].map((card, i) => (
            <div
              key={i}
              className="p-8 rounded-[32px] border border-white/[0.06] bg-white/[0.01] backdrop-blur-md flex flex-col justify-between relative"
            >
              <span className="text-6xl text-white/5 absolute top-3 left-4 font-serif pointer-events-none select-none">“</span>
              <p className="text-xs text-muted-foreground leading-relaxed italic z-1 relative mt-4">
                {card.quote}
              </p>
              <div className="border-t border-white/[0.04] pt-4 mt-6 flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">{card.author}</span>
                <span className="text-muted-foreground/60">{card.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 6: INTERACTIVE FAQS ────────────────────────── */}
      <section id="faqs" className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 reveal-on-scroll">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl tracking-tight font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Quiet Clarity: FAQs
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
            Details on privacy, evaluation methods, and exports.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is my resume data safe and private?",
              a: "Yes. ResumeAI processes your PDF completely client-side in your local browser using PDF.js. No tracking scripts, storage engines, or server file uploads are used. Only the extracted raw text block is forwarded securely via the API to Gemini's models."
            },
            {
              q: "How is the Match Percentage computed?",
              a: "When you supply a target Job Description, our engine maps its core competencies, tech stacks, and metrics against the achievements described in your work experience. The percentage represents structural keyword coverage and skill alignment."
            },
            {
              q: "Why is the downloaded PDF report rendered in light mode?",
              a: "Recruiters and corporate Applicant Tracking System (ATS) document parsers need high-contrast, black-and-white layouts to parse text cleanly. While the web interface is styled in a dark cinematic palette, the export file is built strictly to follow recruiter standards."
            },
            {
              q: "Is ResumeAI open-source and free?",
              a: "Yes. The platform is built as a developer tool. It is 100% open-source and can be self-hosted locally on your own machine. We do not require signups, credit cards, or user accounts."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="border-b border-white/[0.05] pb-4"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between py-3 text-left hover:text-foreground text-sm font-semibold transition-colors focus:outline-none"
              >
                <span>{item.q}</span>
                <span className="text-muted-foreground shrink-0 ml-4">
                  {activeFAQ === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeFAQ === idx ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-xs text-muted-foreground leading-relaxed pr-6">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────── */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 reveal-on-scroll">
        <div className="p-8 sm:p-12 rounded-[40px] border border-white/[0.06] bg-white/[0.01] backdrop-blur-md text-center flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl tracking-tight font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Begin your journey.
          </h2>
          <p className="text-muted-foreground text-xs max-w-xs mt-3 leading-relaxed">
            Restructure your descriptions. Locate keyword matches. Export professional ATS-friendly reports in seconds.
          </p>
          <Link
            href="/review"
            className="liquid-glass rounded-full px-10 py-4 text-sm text-foreground mt-8 hover:scale-[1.03] transition-transform duration-300 flex items-center justify-center font-medium"
          >
            Review Resume
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.04] bg-background/40 py-12 px-8 text-xs text-muted-foreground/60 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-xl" style={{ fontFamily: "'Instrument Serif', serif" }}>ResumeAI<sup className="text-[10px] relative -top-0.5">®</sup></span>
            <span className="text-muted-foreground/20">|</span>
            <span>Premium Career Studio</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#hero" className="hover:text-foreground transition-colors">Home</a>
            <a href="#sandbox" className="hover:text-foreground transition-colors">Demo</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#faqs" className="hover:text-foreground transition-colors">FAQ</a>
            <Link href="/review" className="hover:text-foreground transition-colors font-bold text-foreground">Reviewer</Link>
          </div>

          <div className="text-center md:text-right">
            <p>© 2026 ResumeAI® Studio. All rights reserved.</p>
            <p className="text-[10px] text-muted-foreground/45 mt-0.5">Designed with absolute focus and intent.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
