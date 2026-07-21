export function SidebarProfileCard() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-600 text-lg font-semibold text-white">P</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">Priya Sharma</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">Premium User</p>
        </div>
      </div>
      <button className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">
        <span>Account Menu</span>
        <span className="text-base">▾</span>
      </button>
    </div>
  );
}
