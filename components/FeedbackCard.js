"use client";

/**
 * FeedbackCard — generic card for displaying a list of feedback items.
 * Props: icon, title, accentClass, items[], headerColor, dotColor, delay (ms)
 */
export function FeedbackCard({ icon, title, accentClass, items, headerColor, dotColor, delay }) {
  return (
    <div
      className={`rounded-2xl border p-6 dark:bg-white/[0.03] bg-white shadow-sm dark:shadow-none ${accentClass} animate-fadeInUp`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className={`text-base font-bold tracking-tight ${headerColor}`}>{title}</h3>
        <span className="ml-auto text-[10px] font-bold uppercase py-0.5 px-2 rounded-full border border-current opacity-40">
          {items.length} items
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[13px] leading-relaxed dark:text-gray-300 text-slate-700 font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 mt-2`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
