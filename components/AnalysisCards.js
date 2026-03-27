"use client";
import { scoreColor } from "@/lib/utils";

export function SkillTags({ skillTags }) {
  if (!skillTags?.length) return null;
  const colors = [
    "bg-purple-500/15 border-purple-500/25 dark:text-purple-300 text-purple-700",
    "bg-blue-500/15 border-blue-500/25 dark:text-blue-300 text-blue-700",
    "bg-emerald-500/15 border-emerald-500/25 dark:text-emerald-300 text-emerald-800",
    "bg-amber-500/15 border-amber-500/25 dark:text-amber-300 text-amber-700",
    "bg-pink-500/15 border-pink-500/25 dark:text-pink-300 text-pink-700",
  ];
  return (
    <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm p-6 animate-fadeInUp" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
      <h3 className="text-sm font-bold dark:text-gray-300 text-slate-700 tracking-wide uppercase mb-4 flex items-center gap-2">
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

export function ScoreHistory({ history, onClear }) {
  if (!history.length) return null;
  return (
    <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold dark:text-gray-400 text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
          <span>📈</span> Match History
        </p>
        <button onClick={onClear} className="text-[11px] font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-tight">Clear All</button>
      </div>
      <div className="flex items-end gap-2 h-16">
        {[...history].reverse().map((entry, i) => {
          const { hex } = scoreColor(entry.score);
          const heightPct = Math.max(10, entry.score);
          return (
            <div key={entry.ts} className="flex flex-col items-center gap-1 flex-1 group relative">
              {/* Fix: light-mode-safe tooltip — uses themed bg instead of hardcoded dark */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-slate-200 rounded-lg px-2 py-1 text-[10px] dark:text-white text-slate-800 whitespace-nowrap z-10 flex-col items-center shadow-2xl">
                <span className="font-black" style={{ color: hex }}>{entry.score}</span>
                <span className="dark:text-gray-500 text-slate-400 text-[8px] uppercase">{entry.role || "General"}</span>
              </div>
              <div
                className="w-full rounded-t-sm transition-all duration-700 hover:scale-x-125 min-h-[4px]"
                style={{ height: `${heightPct}%`, backgroundColor: hex, opacity: 0.7 + i * 0.04 }}
              />
              <span className="text-[9px] dark:text-gray-600 text-slate-400 font-bold">{entry.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
