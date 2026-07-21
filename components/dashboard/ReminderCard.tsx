import type { ReminderInfo } from "@/types/dashboard";

interface ReminderCardProps {
  reminder: ReminderInfo;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Today’s Reminder</p>
          <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{reminder.medicine}</p>
        </div>
        <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {reminder.time}
        </span>
      </div>
      <button type="button" className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
        Mark as taken
      </button>
    </section>
  );
}
