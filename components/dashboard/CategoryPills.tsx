import type { CategoryPill } from "@/types/dashboard";

interface CategoryPillsProps {
  items: CategoryPill[];
}

export function CategoryPills({ items }: CategoryPillsProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center gap-3">
        {items.map((pill) => (
          <button
            key={pill.name}
            type="button"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {pill.name}
          </button>
        ))}
      </div>
    </section>
  );
}
