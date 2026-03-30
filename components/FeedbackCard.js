"use client";

/**
 * FeedbackCard — generic card for displaying a list of feedback items.
 * Props: icon, title, items[], delay (ms)
 * styleOverride: { card, title, dot, item } — inline style objects for theming
 */
export function FeedbackCard({ icon, title, items, delay, styleOverride = {} }) {
  const cardStyle = {
    padding: "24px",
    borderRadius: "16px",
    background: "rgba(255,20,100,0.04)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(225,29,116,0.15)",
    animationDelay: `${delay}ms`,
    animationFillMode: "both",
    ...styleOverride.card,
  };
  const titleStyle = { color: "#f9a8d4", ...styleOverride.title };
  const dotStyle   = { background: "#e11d74", ...styleOverride.dot };
  const itemStyle  = { color: "#fce7f3", ...styleOverride.item };

  return (
    <div className="animate-fadeInUp" style={cardStyle}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="text-base font-bold tracking-tight" style={titleStyle}>{title}</h3>
        <span
          className="ml-auto text-[10px] font-bold uppercase py-0.5 px-2 rounded-full"
          style={{ border: "1px solid currentColor", opacity: 0.4, color: titleStyle.color }}
        >
          {items.length} items
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[13px] leading-relaxed font-medium" style={itemStyle}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={dotStyle} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
