import type { SubscriptionItem } from "@/types/dashboard";
import { Badge } from "@/components/ui/Badge";

interface ActiveSubscriptionsProps {
  items: SubscriptionItem[];
}

export function ActiveSubscriptions({ items }: ActiveSubscriptionsProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Active Subscriptions</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Monitor all recurring medicines</p>
        </div>
        <a href="/subscriptions" className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700">
          View all →
        </a>
      </div>

      {/* Table for desktop/tablet */}
      <div className="mt-5 hidden md:block overflow-x-auto rounded-[1.75rem] border border-slate-200/80 dark:border-slate-800 w-full min-w-0">
        <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200 w-full">
          <thead className="bg-slate-50 text-left uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4">Medicine</th>
              <th className="px-5 py-4">Frequency</th>
              <th className="px-5 py-4">Next Delivery</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {items.map((item) => (
              <tr key={item.medicine} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{item.medicine}</td>
                <td className="px-5 py-4">{item.frequency}</td>
                <td className="px-5 py-4">{item.nextDelivery}</td>
                <td className="px-5 py-4">
                  <Badge tone={item.status === "Active" ? "green" : "amber"}>{item.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="mt-5 space-y-3 md:hidden">
        {items.map((item) => (
          <div key={item.medicine} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Medicine</p>
                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{item.medicine}</p>
              </div>
              <Badge tone={item.status === "Active" ? "green" : "amber"}>{item.status}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Frequency</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.frequency}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Next Delivery</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.nextDelivery}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
