"use client";
import { scoreColor } from "@/lib/utils";

export function SectionScores({ sectionScores, animate }) {
  const sections = [
    { key: "experience", label: "Experience",  icon: "💼" },
    { key: "skills",     label: "Skills",      icon: "🛠️" },
    { key: "education",  label: "Education",   icon: "🎓" },
    { key: "formatting", label: "Formatting",  icon: "📐" },
    { key: "impact",     label: "Impact",      icon: "🎯" },
  ];

  return (
    <div className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm p-6 animate-fadeInUp" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
      <h3 className="text-sm font-bold dark:text-gray-300 text-slate-700 tracking-wide uppercase mb-5 flex items-center gap-2">
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
              <div className="h-2 rounded-full dark:bg-white/5 bg-white shadow-sm overflow-hidden">
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
