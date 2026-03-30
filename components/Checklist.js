"use client";

const glass = {
  background: "rgba(255,20,100,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(225,29,116,0.15)",
  borderRadius: "16px",
};

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
    <div className="p-6 animate-fadeInUp" style={{ ...glass, animationDelay: "250ms", animationFillMode: "both" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2" style={{ color: "#f9a8d4" }}>
          <span>✅</span> Resume Checklist
        </h3>
        <span className="text-xs font-bold" style={{ color: "rgba(249,168,212,0.5)" }}>{passCount}/{items.length} complete</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ key, label }) => {
          const passed = checklist[key];
          return (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors"
              style={passed
                ? { background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }
                : { background: "rgba(225,29,116,0.06)", border: "1px solid rgba(225,29,116,0.15)", color: "rgba(252,165,165,0.6)" }
              }
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
