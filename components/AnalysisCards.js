"use client";

const glass = {
  background:          "var(--card-bg)",
  backdropFilter:      "blur(20px)",
  WebkitBackdropFilter:"blur(20px)",
  border:              "1px solid var(--glass-border)",
  borderRadius:        "16px",
};

const TAG_COLORS = [
  { bg: "rgba(225,29,116,0.15)", border: "rgba(225,29,116,0.3)",  text: "var(--text-muted)" },
  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)",  text: "var(--accent-gold)" },
  { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)",  text: "#1d4ed8" },
  { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)",   text: "#15803d" },
  { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",   text: "#b91c1c" },
];

// In dark mode the --accent-gold and --text-muted are already light enough.
// We override the light-hostile tag colors in dark mode via CSS custom props.
// For blue/green/red we use proper dark values instead of hardcoded pastels.
const TAG_COLORS_DARK = [
  { bg: "rgba(225,29,116,0.15)", border: "rgba(225,29,116,0.3)",  text: "#f9a8d4" },
  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)",  text: "#fde68a" },
  { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)",  text: "#93c5fd" },
  { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)",   text: "#86efac" },
  { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",   text: "#fca5a5" },
];

export function SkillTags({ skillTags }) {
  if (!skillTags?.length) return null;
  // We read the computed dark class — simplest way without useEffect overhead
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const palette = isDark ? TAG_COLORS_DARK : TAG_COLORS;

  return (
    <div className="p-6 animate-fadeInUp" style={{ ...glass, animationDelay: "200ms", animationFillMode: "both" }}>
      <h3 className="text-sm font-bold tracking-wide uppercase mb-4 flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
        <span>🏷️</span> Detected Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {skillTags.map((skill, i) => {
          const c = palette[i % palette.length];
          return (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            >
              {skill}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function scoreHex(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#e11d74";
}

export function ScoreHistory({ history, onClear }) {
  if (!history.length) return null;
  return (
    <div className="p-5" style={glass}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: "var(--text-label)" }}>
          <span>📈</span> Match History
        </p>
        <button onClick={onClear} className="text-[11px] font-black uppercase tracking-tight" style={{ color: "#e11d74" }}>Clear All</button>
      </div>
      <div className="flex items-end gap-2 h-16">
        {[...history].reverse().map((entry, i) => {
          const hex = scoreHex(entry.score);
          const heightPct = Math.max(10, entry.score);
          return (
            <div key={entry.ts} className="flex flex-col items-center gap-1 flex-1 group relative">
              <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex rounded-lg px-2 py-1 text-[10px] whitespace-nowrap z-10 flex-col items-center shadow-2xl"
                style={{ background: "var(--bg-secondary)", border: "1px solid rgba(225,29,116,0.2)", color: "var(--text-primary)" }}
              >
                <span className="font-black" style={{ color: hex }}>{entry.score}</span>
                <span className="text-[8px] uppercase" style={{ color: "var(--text-label)" }}>{entry.role || "General"}</span>
              </div>
              <div
                className="w-full rounded-t-sm transition-all duration-700 hover:scale-x-125 min-h-[4px]"
                style={{ height: `${heightPct}%`, background: hex === "#e11d74" ? "linear-gradient(180deg,#e11d74,#f59e0b)" : hex, opacity: 0.7 + i * 0.04 }}
              />
              <span className="text-[9px] font-bold" style={{ color: "var(--text-faint)" }}>{entry.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
