export function HeroBanner() {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.2)] dark:border-slate-800 dark:bg-slate-950">
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr] xl:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 shadow-sm">
            PharmaEasy Subscription & Refill
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Good Morning, Priya! 👋</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Here’s what’s happening with your health and subscriptions.
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Your medicine schedule, deliveries, order history and savings are all in one premium dashboard.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-500/10 via-transparent to-white p-6 dark:from-emerald-500/10 dark:to-slate-900">
          <div className="absolute -right-10 top-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="absolute -left-10 bottom-6 h-28 w-28 rounded-full bg-slate-900/10 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between gap-4 rounded-[1.5rem] border border-emerald-200/70 bg-white/70 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-950/95">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Welcome back</p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Let’s keep your meds on track.</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600 text-2xl text-white">+</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Active cycle</p>
                <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">4 plans</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-4 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Next refill</p>
                <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">30 Jul, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
