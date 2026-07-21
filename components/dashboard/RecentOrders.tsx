import type { OrderItem } from "@/types/dashboard";
import { Badge } from "@/components/ui/Badge";

interface RecentOrdersProps {
  items: OrderItem[];
}

export function RecentOrders({ items }: RecentOrdersProps) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">Recent Orders</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">(Delivered)</h3>
        </div>
      </div>

      {/* Table for desktop/tablet */}
      <div className="mt-4 hidden md:block overflow-x-auto rounded-[1.75rem] border border-slate-200/80 dark:border-slate-800 w-full min-w-0">
        <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200 w-full">
          <thead className="bg-slate-50 text-left uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4">Order ID</th>
              <th className="px-5 py-4">Medicine</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {items.map((item) => (
              <tr key={item.orderId} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{item.orderId}</td>
                <td className="px-5 py-4">{item.medicine}</td>
                <td className="px-5 py-4">{item.date}</td>
                <td className="px-5 py-4">{item.amount}</td>
                <td className="px-5 py-4">
                  <Badge tone="green">{item.status}</Badge>
                </td>
                <td className="px-5 py-4">
                  <button className="text-slate-400 hover:text-emerald-600 transition">📄</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="mt-4 space-y-3 md:hidden">
        {items.map((item) => (
          <div key={item.orderId} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Order ID</p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{item.orderId}</p>
              </div>
              <Badge tone="green">{item.status}</Badge>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Medicine</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.medicine}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.date}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.amount}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button className="text-slate-400 hover:text-emerald-600 transition">📄</button>
            </div>
          </div>
        ))}
      </div>

      <a href="/orders" className="mt-4 inline-block text-sm font-semibold text-emerald-600 transition hover:text-emerald-700">
        View all →
      </a>
    </section>
  );
}
