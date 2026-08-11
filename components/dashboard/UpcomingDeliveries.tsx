import type { DeliveryItem } from "@/types/dashboard";
import { Badge } from "@/components/ui/Badge";

interface UpcomingDeliveriesProps {
  items: DeliveryItem[];
}

export function UpcomingDeliveries({ items }: UpcomingDeliveriesProps) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#00b386]">Upcoming</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Deliveries</h3>
        </div>
        <Badge tone="violet">{items.length} scheduled</Badge>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 p-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          No upcoming deliveries
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item, idx) => (
            <article key={item.name + idx} className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.date}</p>
                </div>
                <Badge tone={item.status === "In Transit" ? "amber" : "green"}>In {item.daysLeft} days</Badge>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
