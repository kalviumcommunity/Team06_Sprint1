"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Activity, Package, Clock, Pill, CalendarDays,
  LogOut, User, ArrowRight, AlertCircle, Loader2
} from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface Medicine {
  name: string;
  price: number;
}

interface Subscription {
  id: string;
  medicineId: string;
  frequency: string;
  quantity: number;
  startDate: string;
  nextRefill: string;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  medicine: Medicine;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/subscriptions");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setSubscriptions(data.subscriptions || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const active = subscriptions.filter((s) => s.status === "ACTIVE");
  const upcoming = active
    .slice()
    .sort((a, b) => new Date(a.nextRefill).getTime() - new Date(b.nextRefill).getTime())[0];
  const recent = subscriptions.slice(0, 5);

  const firstName = session?.user?.name?.split(" ")[0] ?? "User";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
              PharmaEase
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Here&apos;s a summary of your medicine subscriptions.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="text-slate-500 dark:text-slate-400">Loading your dashboard…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Activity className="h-5 w-5 text-emerald-600" />}
                label="Active Subscriptions"
                value={active.length}
                bg="bg-emerald-50 dark:bg-emerald-950/40"
              />
              <StatCard
                icon={<Package className="h-5 w-5 text-blue-600" />}
                label="Total Subscriptions"
                value={subscriptions.length}
                bg="bg-blue-50 dark:bg-blue-950/40"
              />
              <StatCard
                icon={<Clock className="h-5 w-5 text-amber-600" />}
                label="Paused"
                value={subscriptions.filter((s) => s.status === "PAUSED").length}
                bg="bg-amber-50 dark:bg-amber-950/40"
              />
              <StatCard
                icon={<CalendarDays className="h-5 w-5 text-purple-600" />}
                label="Cancelled"
                value={subscriptions.filter((s) => s.status === "CANCELLED").length}
                bg="bg-purple-50 dark:bg-purple-950/40"
              />
            </div>

            {/* Upcoming Refill */}
            {upcoming ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Next Upcoming Refill
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {upcoming.medicine.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {upcoming.frequency} · Qty {upcoming.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Refill Date</p>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {new Date(upcoming.nextRefill).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 text-center text-slate-400 dark:text-slate-500">
                No upcoming refills. Subscribe to medicines to get started.
              </div>
            )}

            {/* Recent Subscriptions */}
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-semibold text-slate-900 dark:text-white">Recent Subscriptions</h2>
                <Link href="/subscriptions" className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              {recent.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  No subscriptions yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recent.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{sub.medicine.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{sub.frequency} · Qty {sub.quantity}</p>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickAction href="/medicines" icon={<Pill className="h-5 w-5" />} label="New Subscription" color="bg-emerald-600 hover:bg-emerald-700" />
              <QuickAction href="/subscriptions" icon={<Package className="h-5 w-5" />} label="My Subscriptions" color="bg-blue-600 hover:bg-blue-700" />
              <QuickAction href="/profile" icon={<User className="h-5 w-5" />} label="My Profile" color="bg-purple-600 hover:bg-purple-700" />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon, label, value, bg
}: {
  icon: React.ReactNode; label: string; value: number; bg: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 shadow-sm">
      <div className={`inline-flex rounded-xl p-2 ${bg} mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === "ACTIVE"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : status === "PAUSED"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
}

function QuickAction({ href, icon, label, color }: {
  href: string; icon: React.ReactNode; label: string; color: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-sm transition ${color}`}
    >
      {icon}
      {label}
    </Link>
  );
}
