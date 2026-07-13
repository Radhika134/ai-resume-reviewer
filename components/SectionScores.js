"use client";

const glass = {
  background:          "var(--card-bg)",
  backdropFilter:      "blur(20px)",
  WebkitBackdropFilter:"blur(20px)",
  border:              "1px solid var(--glass-border)",
  borderRadius:        "16px",
};

function scoreColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#e11d74";
}

export function SectionScores({ sectionScores, animate }) {
  const sections = [
    { key: "experience", label: "Experience", icon: "💼" },
    { key: "skills",     label: "Skills",     icon: "🛠️" },
    { key: "education",  label: "Education",  icon: "🎓" },
    { key: "formatting", label: "Formatting", icon: "📐" },
    { key: "impact",     label: "Impact",     icon: "🎯" },
  ];

  return (
    <div className="p-6 animate-fadeInUp" style={{ ...glass, animationDelay: "150ms", animationFillMode: "both" }}>
      <h3 className="text-sm font-bold tracking-wide uppercase mb-5 flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
        <span>📊</span> Section Breakdown
      </h3>
      <div className="space-y-3.5">
        {sections.map(({ key, label, icon }) => {
          const val = sectionScores?.[key] ?? 0;
          const hex = scoreColor(val);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: "var(--text-label)" }}>
                  <span>{icon}</span>{label}
                </span>
                <span className="text-xs font-bold" style={{ color: hex }}>{val}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(225,29,116,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animate ? `${val}%` : "0%",
                    background: hex === "#e11d74"
                      ? "linear-gradient(90deg,#e11d74,#f59e0b)"
                      : hex,
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
