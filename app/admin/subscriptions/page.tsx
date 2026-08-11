"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Loader2, Pill, AlertCircle } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface AdminSub {
  id: string;
  frequency: string;
  quantity: number;
  startDate: string;
  nextRefill: string;
  status: string;
  medicine: { name: string; price: number };
  user: { firstName: string; lastName: string; email: string };
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<AdminSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch("/api/admin/subscriptions");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load subscriptions");
        setSubscriptions(data.subscriptions || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching subscriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
              Admin Subscriptions Overview
            </h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Platform Subscriptions</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            View all active, paused, and cancelled customer medicine subscriptions.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center py-24 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="text-slate-500 dark:text-slate-400">Loading subscriptions...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500">
              <Pill className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No subscriptions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-left font-medium">
                    <th className="px-6 py-3.5">Subscriber</th>
                    <th className="px-6 py-3.5">Medicine</th>
                    <th className="px-6 py-3.5">Frequency</th>
                    <th className="px-6 py-3.5">Quantity</th>
                    <th className="px-6 py-3.5">Start Date</th>
                    <th className="px-6 py-3.5">Next Refill</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {sub.user.firstName} {sub.user.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{sub.user.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {sub.medicine.name} (₹{sub.medicine.price.toFixed(2)})
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {sub.frequency}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {sub.quantity}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {new Date(sub.startDate).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                        {new Date(sub.nextRefill).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          sub.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : sub.status === "PAUSED"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
