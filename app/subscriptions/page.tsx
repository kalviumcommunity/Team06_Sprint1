"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowLeft, RefreshCw, Filter, ListFilter, Loader2, AlertCircle, Pill } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import CreateEditModal from "@/components/subscriptions/CreateEditModal";

interface Medicine {
  id: string;
  name: string;
  price: number;
}

interface Subscription {
  id: string;
  userId: string;
  medicineId: string;
  frequency: string;
  quantity: number;
  startDate: string;
  nextRefill: string;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  createdAt: string;
  medicine: Medicine;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscriptions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubscriptions(data.subscriptions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, []);

  const filtered = subscriptions
    .filter((s) => statusFilter === "ALL" || s.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "NEWEST") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "MEDICINE") return a.medicine.name.localeCompare(b.medicine.name);
      if (sortBy === "NEXT_REFILL") return new Date(a.nextRefill).getTime() - new Date(b.nextRefill).getTime();
      return 0;
    });

  const handleAction = async (id: string, action: "pause" | "resume" | "cancel") => {
    setActionLoading(id + action);
    try {
      let res;
      if (action === "pause") {
        res = await fetch(`/api/subscriptions/${id}/pause`, { method: "PATCH" });
      } else if (action === "resume") {
        res = await fetch(`/api/subscriptions/${id}/resume`, { method: "PATCH" });
      } else {
        res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      }
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message);
      }
      await fetchSubscriptions();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Action failed");
      setTimeout(() => setError(""), 4000);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">Subscriptions</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-emerald-600 dark:text-emerald-400" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <ListFilter size={14} className="text-emerald-600 dark:text-emerald-400" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                <option value="NEWEST">Newest First</option>
                <option value="MEDICINE">Medicine Name</option>
                <option value="NEXT_REFILL">Next Refill</option>
              </select>
            </div>
          </div>
          <Link href="/medicines"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm">
            <Plus size={16} strokeWidth={2.5} /> New Subscription
          </Link>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <Loader2 size={36} className="animate-spin text-emerald-500" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading subscriptions…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Pill className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No Subscriptions Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Create your first subscription above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((sub) => (
              <SubCard
                key={sub.id}
                sub={sub}
                actionLoading={actionLoading}
                onEdit={() => { setSelectedSub(sub); setIsModalOpen(true); }}
                onPause={() => handleAction(sub.id, "pause")}
                onResume={() => handleAction(sub.id, "resume")}
                onCancel={() => handleAction(sub.id, "cancel")}
              />
            ))}
          </div>
        )}
      </main>

      <CreateEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSubscriptions}
        initialData={selectedSub}
      />
    </div>
  );
}

function SubCard({ sub, actionLoading, onEdit, onPause, onResume, onCancel }: {
  sub: Subscription;
  actionLoading: string | null;
  onEdit: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}) {
  const statusClasses = sub.status === "ACTIVE"
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    : sub.status === "PAUSED"
    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex-shrink-0">
            <Pill className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{sub.medicine.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">₹{sub.medicine.price.toFixed(2)} · {sub.frequency}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0 ${statusClasses}`}>
          {sub.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoCell label="Quantity" value={`${sub.quantity} unit${sub.quantity > 1 ? "s" : ""}`} />
        <InfoCell label="Start Date" value={new Date(sub.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
        <InfoCell label="Next Refill" value={new Date(sub.nextRefill).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
        <InfoCell label="Status" value={sub.status} />
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {sub.status !== "CANCELLED" && (
          <button onClick={onEdit}
            className="rounded-xl border border-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition">
            Edit
          </button>
        )}
        {sub.status === "ACTIVE" && (
          <button onClick={onPause} disabled={actionLoading === sub.id + "pause"}
            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition">
            {actionLoading === sub.id + "pause" ? "…" : "Pause"}
          </button>
        )}
        {sub.status === "PAUSED" && (
          <button onClick={onResume} disabled={actionLoading === sub.id + "resume"}
            className="rounded-xl bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition">
            {actionLoading === sub.id + "resume" ? "…" : "Resume"}
          </button>
        )}
        {sub.status !== "CANCELLED" && (
          <button onClick={onCancel} disabled={actionLoading === sub.id + "cancel"}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition">
            {actionLoading === sub.id + "cancel" ? "…" : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
