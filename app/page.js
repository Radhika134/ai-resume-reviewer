"use client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{
        background: `
          radial-gradient(ellipse at top left, rgba(225,29,116,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(245,158,11,0.10) 0%, transparent 50%),
          var(--bg-primary)
        `,
      }}
    >
      {/* Floating ambient orbs */}
      <div className="orb-pink" aria-hidden="true" />
      <div className="orb-gold"  aria-hidden="true" />

      {/* ─── BACKGROUND GLOW BLOBS ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: "rgba(225,29,116,0.12)" }} />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full blur-[100px]" style={{ background: "rgba(245,158,11,0.08)" }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-[90px]" style={{ background: "rgba(225,29,116,0.06)" }} />
      </div>

      {/* ─── NAVBAR ────────────────────────────────────────────── */}
      <nav
        className="relative z-50 w-full"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">✦</span>
            <span className="text-xl font-bold tracking-tight">
              Resume<span className="gradient-text">AI</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-muted)" }}>
            <a href="#features" className="hover:text-[#e11d74] transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-[#e11d74] transition-colors duration-200">How it works</a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* CTA */}
            <a
              href="/review"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #e11d74, #f59e0b)",
                boxShadow: "0 0 20px rgba(225,29,116,0.3)",
              }}
            >
              <span>Get Started</span>
              <span className="text-base">→</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      <section id="hero" className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-32">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase"
          style={{ border: "1px solid var(--glass-border)", background: "rgba(225,29,116,0.1)", color: "var(--text-muted)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#e11d74" }} />
          Powered by AI
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl mx-auto">
          Get Your Resume{" "}
          <span className="shimmer-text">Reviewed by AI</span>
          <br className="hidden sm:block" />
          {" "}in Seconds
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Upload your resume and get instant feedback, score, and suggestions
          powered by{" "}
          <span className="font-semibold gradient-text">Advanced AI</span>.
          Land your dream job faster.
        </p>

        {/* CTA Button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="/review"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #e11d74, #f59e0b)",
              boxShadow: "0 0 30px rgba(225,29,116,0.35)",
            }}
          >
            <span>Review My Resume</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          {/* Trust badges */}
          <p className="text-sm flex flex-wrap justify-center gap-x-3 gap-y-1" style={{ color: "rgba(249,168,212,0.6)" }}>
            <span className="flex items-center gap-1.5"><span style={{ color: "#f59e0b" }}>✓</span> Free to use</span>
            <span style={{ color: "rgba(225,29,116,0.4)" }}>•</span>
            <span className="flex items-center gap-1.5"><span style={{ color: "#f59e0b" }}>✓</span> No signup required</span>
            <span style={{ color: "rgba(225,29,116,0.4)" }}>•</span>
            <span className="flex items-center gap-1.5"><span style={{ color: "#f59e0b" }}>✓</span> Instant results</span>
          </p>
        </div>

        {/* Hero visual — mock resume card */}
        <div className="mt-20 w-full max-w-2xl mx-auto animate-float">
          <div
            className="relative rounded-2xl p-6 text-left glow-rose"
            style={{
              background: "rgba(255,20,100,0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(225,29,116,0.2)",
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-base font-semibold" style={{ color: "#fce7f3" }}>Alex Johnson</div>
                <div className="text-xs mt-0.5" style={{ color: "#f9a8d4" }}>Senior Frontend Developer</div>
              </div>
              {/* Score badge */}
              <div
                className="flex flex-col items-center justify-center w-14 h-14 rounded-full"
                style={{ border: "2px solid #e11d74", background: "rgba(225,29,116,0.15)" }}
              >
                <span className="text-xl font-extrabold" style={{ color: "#f9a8d4" }}>92</span>
                <span className="text-[9px] leading-none" style={{ color: "rgba(249,168,212,0.7)" }}>Score</span>
              </div>
            </div>

            {/* Score bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-2" style={{ color: "#f9a8d4" }}>
                <span>AI Resume Score</span>
                <span style={{ color: "#f59e0b" }}>92 / 100</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: "92%", background: "linear-gradient(90deg, #e11d74, #f59e0b)" }}
                />
              </div>
            </div>

            {/* Feedback chips */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "ATS Ready", val: "✓", color: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)", text: "#86efac" },
                { label: "Keywords", val: "Strong", color: "rgba(225,29,116,0.15)", border: "rgba(225,29,116,0.3)", text: "#f9a8d4" },
                { label: "Formatting", val: "Clean", color: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", text: "#fde68a" },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="rounded-xl px-3 py-2.5 text-center"
                  style={{ background: chip.color, border: `1px solid ${chip.border}`, color: chip.text }}
                >
                  <div className="text-sm font-bold">{chip.val}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{chip.label}</div>
                </div>
              ))}
            </div>

            {/* Suggestion pill */}
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <span className="text-lg mt-0.5" style={{ color: "#f59e0b" }}>💡</span>
              <div>
                <div className="text-xs font-semibold" style={{ color: "#fde68a" }}>AI Suggestion</div>
                <div className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(253,230,138,0.7)" }}>
                  Add quantifiable achievements to your bullet points — e.g. &quot;Increased performance by 40%&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ──────────────────────────────────── */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <div className="flex justify-center mb-4">
            <span
              className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
              style={{ color: "#f9a8d4", border: "1px solid rgba(225,29,116,0.3)", background: "rgba(225,29,116,0.10)" }}
            >
              Features
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight max-w-2xl mx-auto leading-tight">
            Everything you need to{" "}
            <span className="gradient-text">land your dream job</span>
          </h2>
          <p className="text-center mt-4 text-base max-w-xl mx-auto" style={{ color: "#f9a8d4" }}>
            Our AI analyzes your resume across multiple dimensions and gives you actionable, personalized feedback.
          </p>

          {/* Cards grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Instant AI Score", desc: "Get a precise score out of 100 for your resume in seconds.", highlight: "Score out of 100", delay: "delay-100" },
              { icon: "✍️", title: "Smart Suggestions", desc: "AI rewrites weak bullet points and recommends quantifiable achievements.", highlight: "Auto-rewritten bullets", delay: "delay-200" },
              { icon: "🤖", title: "ATS Friendly Check", desc: "Know instantly if your resume passes Applicant Tracking Systems.", highlight: "Pass ATS filters", delay: "delay-300" },
            ].map((card) => (
              <div
                key={card.title}
                className={`group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${card.delay}`}
                style={{
                  background: "rgba(255,20,100,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(225,29,116,0.15)",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(225,29,116,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(225,29,116,0.15)"}
              >
                <div className="relative z-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: "rgba(225,29,116,0.12)", border: "1px solid rgba(225,29,116,0.25)" }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ color: "#fce7f3" }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "#f9a8d4" }}>{card.desc}</p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ color: "#fde68a", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}
                  >
                    <span className="w-1 h-1 rounded-full" style={{ background: "#f59e0b" }} />
                    {card.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-28 px-6">
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(225,29,116,0.4), transparent)" }} />

        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-4">
            <span
              className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
              style={{ color: "#f9a8d4", border: "1px solid rgba(225,29,116,0.3)", background: "rgba(225,29,116,0.10)" }}
            >
              Process
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight">
            3 simple{" "}<span className="gradient-text">steps</span>
          </h2>
          <p className="text-center mt-4 text-base max-w-xl mx-auto" style={{ color: "#f9a8d4" }}>
            Go from uncertain to confident about your resume in under a minute.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px"
              style={{ background: "linear-gradient(to right, rgba(225,29,116,0.5), rgba(245,158,11,0.3), rgba(225,29,116,0.5))" }}
            />

            {[
              { icon: "📋", title: "Paste Your Resume", desc: "Paste your resume text or upload your PDF. No formatting required." },
              { icon: "🧠", title: "AI Analyzes It", desc: "The AI reads every line, checking for clarity, impact, ATS compatibility." },
              { icon: "🚀", title: "Get Instant Feedback", desc: "Receive your score, section-by-section feedback, and rewritten bullets." },
            ].map((item, i) => (
              <div key={item.title} className="flex flex-col items-center text-center group">
                <div className="relative w-20 h-20 mb-6">
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-300 glow-rose-sm"
                    style={{ background: "rgba(225,29,116,0.12)", border: "1px solid rgba(225,29,116,0.3)" }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <span
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2"
                    style={{ background: "linear-gradient(135deg,#e11d74,#f59e0b)", borderColor: "#0d0608" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: "#fce7f3" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: "#f9a8d4" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center glow-rose relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(225,29,116,0.15) 0%, rgba(245,158,11,0.08) 100%)",
            border: "1px solid rgba(225,29,116,0.25)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl" style={{ background: "rgba(225,29,116,0.2)" }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl" style={{ background: "rgba(245,158,11,0.15)" }} />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Ready to improve your{" "}
              <span className="gradient-text">resume?</span>
            </h2>
            <p className="text-base max-w-xl mx-auto mb-8" style={{ color: "#f9a8d4" }}>
              Join thousands of job seekers who got their dream job with AI-powered resume feedback.
            </p>
            <a
              href="/review"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg,#e11d74,#f59e0b)", boxShadow: "0 0 30px rgba(225,29,116,0.35)" }}
            >
              Review My Resume
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <p className="mt-4 text-xs" style={{ color: "rgba(249,168,212,0.5)" }}>
              Free · No signup · Instant feedback
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer
        className="relative z-10 py-10 px-6"
        style={{ borderTop: "1px solid rgba(225,29,116,0.12)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✦</span>
            <span className="text-base font-bold">Resume<span className="gradient-text">AI</span></span>
          </div>

          <p className="text-sm text-center" style={{ color: "rgba(249,168,212,0.5)" }}>
            Built with <span style={{ color: "#e11d74" }}>❤️</span> using <span className="gradient-text font-medium">AI</span>
          </p>

          <div className="flex items-center gap-6 text-xs" style={{ color: "rgba(249,168,212,0.4)" }}>
            <a href="#features" className="hover:text-[#f9a8d4] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#f9a8d4] transition-colors">How it works</a>
            <span>© 2026 ResumeAI</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
