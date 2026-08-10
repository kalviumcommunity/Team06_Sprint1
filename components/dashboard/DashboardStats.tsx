import type { StatItem } from "@/types/dashboard";
import { Badge } from "@/components/ui/Badge";

interface DashboardStatsProps {
  items: StatItem[];
}

const toneClasses: Record<NonNullable<StatItem["tone"]>, string> = {
  green: "from-[#00b386]/20 to-[#00b386]/5 text-[#00b386] dark:from-[#00b386]/20 dark:to-[#00b386]/10 dark:text-[#00b386]",
  violet: "from-violet-500/15 to-violet-500/5 text-violet-700 dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-300",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-700 dark:from-amber-500/20 dark:to-amber-500/10 dark:text-amber-300",
  slate: "from-slate-500/15 to-slate-500/5 text-slate-700 dark:from-slate-500/20 dark:to-slate-500/10 dark:text-slate-300",
};

export function DashboardStats({ items }: DashboardStatsProps) {
  return (
    <>
      {items.map((item) => (
        <article
          key={item.title}
          className="group rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,179,134,0.45)] dark:border-slate-800 dark:bg-slate-900"
        >
          <div className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses[item.tone ?? "slate"]}`}>
            <span className="text-base">{item.icon}</span>
          </div>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
            </div>
            <Badge tone={item.tone ?? "slate"}>{item.status ?? ""}</Badge>
          </div>
          {item.actionLabel && item.actionHref && (
            <a href={item.actionHref} className="mt-2 inline-block text-sm font-semibold text-[#00b386] transition hover:text-[#009e76]">
              {item.actionLabel} →
            </a>
          )}
        </article>
      ))}
    </>
  );
}
