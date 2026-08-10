"use client";

import { useState, useEffect, useMemo } from "react";
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
import type {
  SubscriptionItem,
  OrderItem,
  DeliveryItem,
  ReminderInfo,
  ProductItem,
  CategoryItem,
  StatItem,
} from "@/types/dashboard";

const toneClasses: Record<string, string> = {
  green: "from-[#00b386]/20 to-[#00b386]/5 text-[#00b386] dark:from-[#00b386]/20 dark:to-[#00b386]/10 dark:text-[#00b386]",
  violet: "from-violet-500/15 to-violet-500/5 text-violet-700 dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-300",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-700 dark:from-amber-500/20 dark:to-amber-500/10 dark:text-amber-300",
  slate: "from-slate-500/15 to-slate-500/5 text-slate-700 dark:from-slate-500/20 dark:to-slate-500/10 dark:text-slate-300",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([
    { title: "Active Subscriptions", value: "0", icon: "💊", tone: "green", status: "Active" },
    { title: "Upcoming Delivery", value: "0", icon: "📦", tone: "violet", status: "Scheduled" },
    { title: "Total Orders", value: "0", icon: "🧾", tone: "amber", status: "Fulfilled" },
  ]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [rawDeliveriesData, setRawDeliveriesData] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [reminder, setReminder] = useState<ReminderInfo | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [summaryRes, subsRes, ordersRes, delivRes, remRes, prodsRes, catsRes] = await Promise.all([
          fetch("/api/dashboard/summary").then((res) => res.json()).catch(() => null),
          fetch("/api/dashboard/subscriptions").then((res) => res.json()).catch(() => null),
          fetch("/api/dashboard/orders").then((res) => res.json()).catch(() => null),
          fetch("/api/dashboard/deliveries").then((res) => res.json()).catch(() => null),
          fetch("/api/dashboard/reminder").then((res) => res.json()).catch(() => null),
          fetch("/api/dashboard/products").then((res) => res.json()).catch(() => null),
          fetch("/api/dashboard/categories").then((res) => res.json()).catch(() => null),
        ]);

        if (summaryRes?.success && summaryRes.data) {
          setStats([
            { title: "Active Subscriptions", value: String(summaryRes.data.activeSubscriptions ?? 0), icon: "💊", tone: "green", status: "Active" },
            { title: "Upcoming Delivery", value: String(summaryRes.data.upcomingDeliveries ?? 0), icon: "📦", tone: "violet", status: "Scheduled" },
            { title: "Total Orders", value: String(summaryRes.data.totalOrders ?? 0), icon: "🧾", tone: "amber", status: "Fulfilled" },
          ]);
        }

        if (subsRes?.success && Array.isArray(subsRes.data)) {
          const mappedSubs: SubscriptionItem[] = subsRes.data.map((item: any) => ({
            medicine: item.medicine,
            frequency: item.frequency,
            nextDelivery: item.nextDelivery
              ? new Date(item.nextDelivery).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
              : "N/A",
            status: item.status,
          }));
          setSubscriptions(mappedSubs);
        }

        if (ordersRes?.success && Array.isArray(ordersRes.data)) {
          const mappedOrders: OrderItem[] = ordersRes.data.map((item: any) => ({
            orderId: item.orderNumber || item.id,
            medicine: item.medicine,
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
              : "N/A",
            amount: `₹${item.amount}`,
            status: item.status || "Delivered",
          }));
          setOrders(mappedOrders);
        }

        if (delivRes?.success && Array.isArray(delivRes.data)) {
          setRawDeliveriesData(delivRes.data);
          const mappedDeliveries: DeliveryItem[] = delivRes.data.map((item: any) => {
            const delivDate = item.date ? new Date(item.date) : new Date();
            const daysLeft = Math.max(0, Math.ceil((delivDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            return {
              name: item.name,
              date: delivDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
              time: "9:00 AM",
              daysLeft,
              status: item.status,
              quantity: item.quantity,
            };
          });
          setDeliveries(mappedDeliveries);
        }

        if (remRes?.success && remRes.data) {
          setReminder({
            medicine: remRes.data.medicine,
            time: remRes.data.time,
          });
        } else {
          setReminder(null);
        }

        if (prodsRes?.success && Array.isArray(prodsRes.data)) {
          setProducts(prodsRes.data);
        }

        if (catsRes?.success && Array.isArray(catsRes.data)) {
          setCategories(catsRes.data);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Compute highlight dates dynamically for current month calendar from real delivery dates
  const highlightDates = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return rawDeliveriesData
      .map((item: any) => {
        if (!item.date) return null;
        const d = new Date(item.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          return String(d.getDate());
        }
        return null;
      })
      .filter(Boolean) as string[];
  }, [rawDeliveriesData]);

  const moneySavedSummary = {
    amount: "Coming Soon",
    comparison: "Savings will appear once pricing comparison data becomes available.",
    percentage: "N/A",
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Top Section */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <div className="md:col-span-2 xl:col-span-3">
            <DashboardHeader />
          </div>
          <div className="xl:row-span-2">
            <CalendarWidget highlightDates={highlightDates} />
          </div>
          {stats.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,179,134,0.45)] dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className={`flex h-7 w-7 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses[item.tone ?? "slate"]}`}>
                  <span className="text-xs">{item.icon}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.title}</p>
                    <p className="mt-0.5 text-xl font-semibold text-slate-900 dark:text-white">
                      {loading ? "..." : item.value}
                    </p>
                  </div>
                  <Badge tone={item.tone ?? "slate"}>{item.status ?? ""}</Badge>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Section 3: Upcoming + Active */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-[1.2fr_1fr] md:items-start xl:items-stretch">
          <UpcomingDeliveries items={deliveries} />
          <ActiveSubscriptions items={subscriptions} />
        </div>

        {/* Section 4: Recent Orders + Recommended */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-[1.2fr_1fr] md:items-start xl:items-stretch">
          <RecentOrders items={orders} />
          <RecommendedProducts items={products} />
        </div>

        {/* Section 5: Money Saved + Reminder */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 md:items-start xl:items-stretch">
          <MoneySavedCard summary={moneySavedSummary} />
          <ReminderCard reminder={reminder} />
        </div>

        {/* Section 6: Popular Categories */}
        <PopularCategories items={categories} />
      </div>
    </DashboardLayout>
  );
}
