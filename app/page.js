export default function Home() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">

      {/* ─── BACKGROUND GLOW BLOBS ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-[90px]" />
      </div>

      {/* ─── NAVBAR ────────────────────────────────────────────── */}
      <nav className="relative z-50 w-full border-b border-white/5 backdrop-blur-md bg-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">✦</span>
            <span className="text-xl font-bold tracking-tight text-white">
              Resume<span className="text-purple-400">AI</span>
            </span>
          </div>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">
              How it works
            </a>
          </div>

          {/* CTA */}
          <a
            href="/review"
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 glow-purple-sm hover:scale-105 active:scale-95"
          >
            <span>Get Started</span>
            <span className="text-base">→</span>
          </a>
        </div>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      <section
        id="hero"
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-32"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Powered by Claude AI
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl mx-auto">
          Get Your Resume{" "}
          <span className="shimmer-text">Reviewed by AI</span>
          <br className="hidden sm:block" />
          {" "}in Seconds
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Upload your resume and get instant feedback, score, and suggestions
          powered by{" "}
          <span className="text-purple-400 font-medium">Claude AI</span>.
          Land your dream job faster.
        </p>

        {/* CTA Button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="/review"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold transition-all duration-300 glow-purple hover:scale-105 active:scale-95"
          >
            <span>Review My Resume</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          {/* Trust badges */}
          <p className="text-gray-500 text-sm flex flex-wrap justify-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5">
              <span className="text-purple-400">✓</span> Free to use
            </span>
            <span className="text-gray-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-purple-400">✓</span> No signup required
            </span>
            <span className="text-gray-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-purple-400">✓</span> Instant results
            </span>
          </p>
        </div>

        {/* Hero visual — mock resume card */}
        <div className="mt-20 w-full max-w-2xl mx-auto animate-float">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-left glow-purple">
            {/* Card header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-base font-semibold text-white">Alex Johnson</div>
                <div className="text-xs text-gray-400 mt-0.5">Senior Frontend Developer</div>
              </div>
              {/* Score badge */}
              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-purple-500 bg-purple-500/10">
                <span className="text-xl font-extrabold text-purple-300">92</span>
                <span className="text-[9px] text-purple-400/80 leading-none">Score</span>
              </div>
            </div>

            {/* Score bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>AI Resume Score</span>
                <span className="text-purple-400 font-medium">92 / 100</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-400 transition-all duration-1000"
                  style={{ width: "92%" }}
                />
              </div>
            </div>

            {/* Feedback chips */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "ATS Ready", val: "✓", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                { label: "Keywords", val: "Strong", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
                { label: "Formatting", val: "Clean", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className={`rounded-xl border px-3 py-2.5 text-center ${chip.color}`}
                >
                  <div className="text-sm font-bold">{chip.val}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{chip.label}</div>
                </div>
              ))}
            </div>

            {/* Suggestion pill */}
            <div className="flex items-start gap-3 rounded-xl bg-purple-600/10 border border-purple-500/20 px-4 py-3">
              <span className="text-purple-400 text-lg mt-0.5">💡</span>
              <div>
                <div className="text-xs font-semibold text-purple-300">AI Suggestion</div>
                <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Add quantifiable achievements to your bullet points — e.g. "Increased performance by 40%"
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
            <span className="text-xs font-semibold tracking-widest uppercase text-purple-400 border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 rounded-full">
              Features
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight max-w-2xl mx-auto leading-tight">
            Everything you need to{" "}
            <span className="text-purple-400">land your dream job</span>
          </h2>
          <p className="text-center text-gray-400 mt-4 text-base max-w-xl mx-auto">
            Our AI analyzes your resume across multiple dimensions and gives you
            actionable, personalized feedback.
          </p>

          {/* Cards grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Instant AI Score",
                desc: "Get a precise score out of 100 for your resume in seconds. Understand where you stand and what to improve.",
                highlight: "Score out of 100",
                delay: "delay-100",
              },
              {
                icon: "✍️",
                title: "Smart Suggestions",
                desc: "AI rewrites weak bullet points, suggests stronger action verbs, and recommends quantifiable achievements.",
                highlight: "Auto-rewritten bullets",
                delay: "delay-200",
              },
              {
                icon: "🤖",
                title: "ATS Friendly Check",
                desc: "Know instantly if your resume passes Applicant Tracking Systems used by top companies.",
                highlight: "Pass ATS filters",
                delay: "delay-300",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`group relative rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-500/40 p-8 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${card.delay}`}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-violet-800/5 transition-all duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">
                    {card.desc}
                  </p>

                  {/* Highlight chip */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-purple-400" />
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
        {/* Divider glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-600/40 to-transparent" />

        <div className="max-w-5xl mx-auto">

          {/* Section label */}
          <div className="flex justify-center mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-purple-400 border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 rounded-full">
              Process
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight">
            3 simple{" "}
            <span className="text-purple-400">steps</span>
          </h2>
          <p className="text-center text-gray-400 mt-4 text-base max-w-xl mx-auto">
            Go from uncertain to confident about your resume in under a minute.
          </p>

          {/* Steps */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-purple-600/50 via-purple-400/30 to-purple-600/50" />

            {[
              {
                step: "01",
                icon: "📋",
                title: "Paste Your Resume",
                desc: "Simply paste your resume text or upload your PDF directly into the editor. No formatting required.",
              },
              {
                step: "02",
                icon: "🧠",
                title: "AI Analyzes It",
                desc: "Claude AI reads every line, checking for clarity, impact, ATS compatibility, and keyword relevance.",
              },
              {
                step: "03",
                icon: "🚀",
                title: "Get Instant Feedback",
                desc: "Receive your score, section-by-section feedback, and rewritten bullet points in seconds.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center group">
                {/* Circle with step number */}
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full bg-purple-600/20 border border-purple-500/30 group-hover:border-purple-400/60 transition-colors duration-300 glow-purple-sm" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  {/* Step number badge */}
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0a0a0a]">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 via-purple-800/10 to-[#0a0a0a] p-12 text-center glow-purple relative overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-700/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Ready to improve your{" "}
              <span className="text-purple-400">resume?</span>
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-8">
              Join thousands of job seekers who got their dream job with
              AI-powered resume feedback.
            </p>
            <a
              href="/review"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold transition-all duration-300 glow-purple hover:scale-105 active:scale-95"
            >
              Review My Resume
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <p className="mt-4 text-gray-500 text-xs">
              Free · No signup · Instant feedback
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl">✦</span>
            <span className="text-base font-bold text-white">
              Resume<span className="text-purple-400">AI</span>
            </span>
          </div>

          {/* Attribution */}
          <p className="text-gray-500 text-sm text-center">
            Built with{" "}
            <span className="text-red-400">❤️</span>{" "}
            using{" "}
            <span className="text-purple-400 font-medium">Claude AI</span>
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-300 transition-colors">How it works</a>
            <span>© 2026 ResumeAI</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
