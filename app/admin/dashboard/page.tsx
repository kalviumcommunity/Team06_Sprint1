"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Users, Package, Activity, Pause, XCircle,
  Pill, AlertTriangle, Loader2, AlertCircle, LogOut, ShieldCheck
} from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface Stats {
  totalUsers: number;
  totalMedicines: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  pausedSubscriptions: number;
  cancelledSubscriptions: number;
}

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { subscriptions: number };
}

interface SubRow {
  id: string;
  frequency: string;
  status: string;
  createdAt: string;
  medicine: { name: string; price: number };
  user: { firstName: string; lastName: string; email: string };
}

interface LowStockMed {
  id: string;
  name: string;
  stock: number;
  manufacturer: string;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [lowStock, setLowStock] = useState<LowStockMed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes, subsRes, medsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users"),
          fetch("/api/admin/subscriptions"),
          fetch("/api/admin/medicines"),
        ]);
        if (!statsRes.ok) throw new Error("Failed to load stats");
        const [s, u, sub, m] = await Promise.all([
          statsRes.json(), usersRes.json(), subsRes.json(), medsRes.json()
        ]);
        setStats(s.stats);
        setUsers(u.users?.slice(0, 5) || []);
        setSubs(sub.subscriptions?.slice(0, 5) || []);
        setLowStock(m.lowStock || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-extrabold tracking-tight text-blue-700 dark:text-blue-400">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/medicines" className="hidden sm:inline rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">
              Medicines
            </Link>
            <ThemeToggle />
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Welcome, {session?.user?.name || "Admin"} · Real-time platform statistics
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-slate-500 dark:text-slate-400">Loading dashboard…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Users" value={stats.totalUsers} icon={<Users size={18} />} color="text-blue-600 bg-blue-50 dark:bg-blue-950/40" />
                <StatCard label="Medicines" value={stats.totalMedicines} icon={<Pill size={18} />} color="text-blue-600 bg-blue-50 dark:bg-blue-950/40" />
                <StatCard label="Total Subs" value={stats.totalSubscriptions} icon={<Package size={18} />} color="text-purple-600 bg-purple-50 dark:bg-purple-950/40" />
                <StatCard label="Active" value={stats.activeSubscriptions} icon={<Activity size={18} />} color="text-green-600 bg-green-50 dark:bg-green-950/40" />
                <StatCard label="Paused" value={stats.pausedSubscriptions} icon={<Pause size={18} />} color="text-amber-600 bg-amber-50 dark:bg-amber-950/40" />
                <StatCard label="Cancelled" value={stats.cancelledSubscriptions} icon={<XCircle size={18} />} color="text-red-600 bg-red-50 dark:bg-red-950/40" />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Users */}
              <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="font-semibold text-slate-900 dark:text-white">Recent Users</h2>
                  <span className="text-xs text-slate-400">{users.length} shown</span>
                </div>
                {users.length === 0 ? (
                  <p className="px-5 py-8 text-sm text-center text-slate-400 dark:text-slate-500">No users yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <div key={u.id} className="px-5 py-3.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                          {u._count.subscriptions} subs
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Subscriptions */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="font-semibold text-slate-900 dark:text-white">Recent Subscriptions</h2>
                </div>
                {subs.length === 0 ? (
                  <p className="px-5 py-8 text-sm text-center text-slate-400 dark:text-slate-500">No subscriptions yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                          <th className="px-5 py-3 font-medium">Medicine</th>
                          <th className="px-5 py-3 font-medium">User</th>
                          <th className="px-5 py-3 font-medium">Frequency</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {subs.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                            <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{s.medicine.name}</td>
                            <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{s.user.firstName} {s.user.lastName}</td>
                            <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{s.frequency}</td>
                            <td className="px-5 py-3">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                s.status === "ACTIVE" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : s.status === "PAUSED" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Low Stock */}
            {lowStock.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-amber-200 dark:border-amber-800">
                  <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
                  <h2 className="font-semibold text-amber-800 dark:text-amber-400">Low Stock Medicines</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                  {lowStock.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-xl border border-amber-200 bg-white dark:border-amber-800 dark:bg-slate-900 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{m.manufacturer}</p>
                      </div>
                      <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                        {m.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color }: {
  label: string; value: number; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 shadow-sm">
      <div className={`inline-flex rounded-xl p-2 mb-2 ${color}`}>{icon}</div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
