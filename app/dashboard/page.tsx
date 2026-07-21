import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { UpcomingDeliveries } from "@/components/dashboard/UpcomingDeliveries";
import { ActiveSubscriptions } from "@/components/dashboard/ActiveSubscriptions";
import { RecommendedProducts } from "@/components/dashboard/RecommendedProducts";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { MoneySavedCard } from "@/components/dashboard/MoneySavedCard";
import { ReminderCard } from "@/components/dashboard/ReminderCard";
import { PopularCategories } from "@/components/dashboard/PopularCategories";
import { Badge } from "@/components/ui/Badge";
import {
  moneySavedSummary,
  productRecommendations,
  popularCategories,
  recentOrders,
  stats,
  subscriptionItems,
  todayReminder,
  upcomingDeliveries,
} from "@/constants/dashboard";

const toneClasses: Record<string, string> = {
  green: "from-emerald-500/15 to-emerald-500/5 text-emerald-700 dark:from-emerald-500/20 dark:to-emerald-500/10 dark:text-emerald-300",
  violet: "from-violet-500/15 to-violet-500/5 text-violet-700 dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-300",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-700 dark:from-amber-500/20 dark:to-amber-500/10 dark:text-amber-300",
  slate: "from-slate-500/15 to-slate-500/5 text-slate-700 dark:from-slate-500/20 dark:to-slate-500/10 dark:text-slate-300",
};

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Top Section: Desktop 4-column grid, tablet 2-column, mobile 1-column */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {/* Hero: spans 3 on desktop, 2 on tablet, full on mobile */}
          <div className="md:col-span-2 xl:col-span-3">
            <DashboardHeader />
          </div>
          {/* Calendar: spans 1 column, 2 rows on desktop only */}
          <div className="xl:row-span-2">
            <CalendarWidget />
          </div>
          {/* Stats cards: each spans 1 column */}
          {stats.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.45)] dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className={`flex h-7 w-7 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses[item.tone ?? "slate"]}`}>
                  <span className="text-xs">{item.icon}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.title}</p>
                    <p className="mt-0.5 text-xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                  <Badge tone={item.tone ?? "slate"}>{item.status ?? ""}</Badge>
                </div>
              </div>
              {item.actionLabel && item.actionHref && (
                <div className="mt-auto pt-3">
                  <a href={item.actionHref} className="inline-block text-xs font-semibold text-emerald-600 transition hover:text-emerald-700">
                    {item.actionLabel} →
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Section 3: Upcoming + Active - side-by-side on desktop, stack on tablet/mobile */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-[1.2fr_1fr] md:items-start xl:items-stretch">
          <UpcomingDeliveries items={upcomingDeliveries} />
          <ActiveSubscriptions items={subscriptionItems} />
        </div>

        {/* Section 4: Recent Orders + Recommended - side-by-side on desktop, stack on tablet/mobile */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-[1.2fr_1fr] md:items-start xl:items-stretch">
          <RecentOrders items={recentOrders} />
          <RecommendedProducts items={productRecommendations} />
        </div>

        {/* Section 5: Money Saved + Reminder - side-by-side on desktop, stack on tablet/mobile */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 md:items-start xl:items-stretch">
          <MoneySavedCard summary={moneySavedSummary} />
          <ReminderCard reminder={todayReminder} />
        </div>

        {/* Section 6: Popular Categories */}
        <PopularCategories items={popularCategories} />
      </div>
    </DashboardLayout>
  );
}
