/**
 * Shared utility functions for the AI Resume Reviewer.
 * Import from here instead of duplicating across components.
 */

/**
 * Returns a color hex and label based on a 0–100 score.
 * @param {number} score
 * @returns {{ hex: string, label: string }}
 */
export function scoreColor(score) {
  if (score >= 80) return { hex: "#22c55e", label: "Excellent" };
  if (score >= 50) return { hex: "#f59e0b", label: "Good" };
  return { hex: "#ef4444", label: "Needs Work" };
}

/**
 * Tailwind class maps for colored badge variants used in the review results.
 */
export const badgeColors = {
  emerald: {
    bg:     "dark:bg-emerald-500/10 bg-emerald-100",
    border: "border-emerald-500/25",
    text:   "text-emerald-400",
    dot:    "bg-emerald-400",
  },
  purple: {
    bg:     "dark:bg-purple-500/10 bg-purple-100",
    border: "border-purple-500/25",
    text:   "text-purple-400",
    dot:    "bg-purple-400",
  },
  blue: {
    bg:     "dark:bg-blue-500/10 bg-blue-100",
    border: "border-blue-500/25",
    text:   "text-blue-400",
    dot:    "bg-blue-400",
  },
  red: {
    bg:     "dark:bg-red-500/10 bg-red-100",
    border: "border-red-500/25",
    text:   "text-red-400",
    dot:    "bg-red-400",
  },
  amber: {
    bg:     "dark:bg-amber-500/10 bg-amber-100",
    border: "border-amber-500/25",
    text:   "text-amber-400",
    dot:    "bg-amber-400",
  },
};
