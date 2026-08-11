"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Loader2, Pill, AlertCircle, Edit, X } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface SubscriptionRefill {
  id: string;
  frequency: string;
  quantity: number;
  nextRefill: string;
  status: string;
  medicine: { name: string; price: number };
  user: { firstName: string; lastName: string; email: string };
}

export default function AdminRefillsPage() {
  const [refills, setRefills] = useState<SubscriptionRefill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRefill, setEditingRefill] = useState<SubscriptionRefill | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nextRefill: "",
    quantity: "",
    frequency: "MONTHLY",
    status: "ACTIVE",
  });

  const fetchRefills = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/subscriptions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load refills");
      const sorted = (data.subscriptions || [])
        .filter((s: SubscriptionRefill) => s.status !== "CANCELLED")
        .sort(
          (a: SubscriptionRefill, b: SubscriptionRefill) =>
            new Date(a.nextRefill).getTime() - new Date(b.nextRefill).getTime()
        );
      setRefills(sorted);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error fetching refills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefills();
  }, [fetchRefills]);

  const openEditModal = (refill: SubscriptionRefill) => {
    setEditingRefill(refill);
    setForm({
      nextRefill: refill.nextRefill ? refill.nextRefill.split("T")[0] : "",
      quantity: refill.quantity.toString(),
      frequency: refill.frequency,
      status: refill.status,
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const qtyNum = parseInt(form.quantity, 10);
    if (isNaN(qtyNum) || qtyNum < 1) {
      setError("Please enter a valid positive quantity.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/refills/${editingRefill?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextRefill: form.nextRefill,
          quantity: qtyNum,
          frequency: form.frequency,
          status: form.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update refill schedule");

      setSuccess("Refill schedule updated successfully!");
      setModalOpen(false);
      fetchRefills();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error updating refill schedule");
    } finally {
      setSaving(false);
    }
  };

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
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
              Admin Refill Schedule
            </h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Medicine Refills</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Monitor and track scheduled medicine dispatches across all subscribers.
          </p>
        </div>

        {error && !modalOpen && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
            <AlertCircle size={15} /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400">
            <AlertCircle size={15} /> {success}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center py-24 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="text-slate-500 dark:text-slate-400">Loading scheduled refills...</p>
            </div>
          ) : refills.length === 0 ? (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500">
              <Pill className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No active refills scheduled.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-left font-medium">
                    <th className="px-6 py-3.5">Subscriber</th>
                    <th className="px-6 py-3.5">Medicine</th>
                    <th className="px-6 py-3.5">Quantity</th>
                    <th className="px-6 py-3.5">Frequency</th>
                    <th className="px-6 py-3.5">Next Refill Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {refills.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {item.user.firstName} {item.user.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.user.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {item.medicine.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {item.quantity} unit(s)
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {item.frequency}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">
                        {new Date(item.nextRefill).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : item.status === "PAUSED"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                          title="Edit Refill"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Refill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Refill Schedule ({editingRefill?.user.firstName} {editingRefill?.user.lastName})
              </h3>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine
                </label>
                <input
                  type="text"
                  disabled
                  value={editingRefill?.medicine.name || ""}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Next Scheduled Refill Date
                </label>
                <input
                  type="date"
                  required
                  value={form.nextRefill}
                  onChange={(e) => setForm({ ...form, nextRefill: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PAUSED">Paused</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
