"use client";

/**
 * Checklist — shows a grid of resume fundamentals (pass/fail).
 * Props: checklist: { hasContactInfo, hasLinkedIn, hasMetrics,
 *                     hasActionVerbs, hasSummary, hasCertifications }
 */
export function Checklist({ checklist }) {
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
    <div
      className="rounded-2xl border dark:border-white/8 border-slate-200 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none p-6 animate-fadeInUp"
      style={{ animationDelay: "250ms", animationFillMode: "both" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold dark:text-gray-300 text-slate-700 tracking-wide uppercase flex items-center gap-2">
          <span>✅</span> Resume Checklist
        </h3>
        <span className="text-xs font-bold dark:text-gray-400 text-slate-600">
          {passCount}/{items.length} complete
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ key, label }) => {
          const passed = checklist[key];
          return (
            <div
              key={key}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                passed
                  ? "dark:bg-emerald-500/8 bg-emerald-50/50 dark:border-emerald-500/20 border-emerald-500/10 dark:text-emerald-300 text-emerald-800"
                  : "dark:bg-red-500/5 bg-red-50/50 dark:border-red-500/15 border-red-200 text-red-500/70"
              }`}
            >
              <span className="text-base shrink-0">{passed ? "✓" : "✗"}</span>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
