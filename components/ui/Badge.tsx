import type { ReactNode } from "react";

type BadgeTone = "green" | "violet" | "amber" | "slate" | "rose";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClassMap: Record<BadgeTone, string> = {
  green: "bg-[#e6f7f3] text-[#00b386] ring-[#00b386]/30 dark:bg-[#00b386]/10 dark:text-[#00b386] dark:ring-[#00b386]/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
  slate: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:ring-slate-700",
  rose: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20",
};

export function Badge({ children, tone = "green", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${toneClassMap[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
