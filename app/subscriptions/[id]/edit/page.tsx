"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Subscription {
  id: string;
  medicineId: string;
  frequency: string;
  quantity: number;
  startDate: string;
  nextRefill: string;
  status: string;
  medicine: { name: string };
}

export default function EditSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [medicineId, setMedicineId] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [subRes, medRes] = await Promise.all([
          fetch(`/api/subscriptions/${id}`),
          fetch("/api/medicines"),
        ]);

        if (subRes.status === 403) {
          setError("You do not have permission to edit this subscription.");
          setLoading(false);
          return;
        }
        if (subRes.status === 404) {
          setError("Subscription not found.");
          setLoading(false);
          return;
        }
        if (!subRes.ok) throw new Error("Failed to load subscription");

        const subData = await subRes.json();
        const medData = await medRes.json();

        setSubscription(subData.subscription);
        setMedicines(medData.medicines || []);
        setMedicineId(subData.subscription.medicineId);
        setFrequency(subData.subscription.frequency);
        setQuantity(subData.subscription.quantity);
        setStartDate(subData.subscription.startDate?.split("T")[0] || "");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicineId, frequency, quantity, startDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
      setTimeout(() => router.push("/subscriptions"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/subscriptions" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">Edit Subscription</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="text-slate-500 dark:text-slate-400">Loading…</p>
          </div>
        ) : error && !subscription ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-6 text-center space-y-3">
            <AlertCircle className="mx-auto h-10 w-10 text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <Link href="/subscriptions" className="inline-block text-sm text-emerald-600 hover:underline dark:text-emerald-400">
              Back to Subscriptions
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Subscription</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Currently: <span className="font-medium text-slate-700 dark:text-slate-300">{subscription?.medicine.name}</span>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400">
                <CheckCircle2 size={15} /> Updated! Redirecting…
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Medicine</label>
                <select value={medicineId} onChange={(e) => setMedicineId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.stock <= 0}>
                      {m.name} — ₹{m.price.toFixed(2)}{m.stock <= 0 ? " (Out of Stock)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
                  <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>

              <div className="flex gap-3 pt-2">
                <Link href="/subscriptions" className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition text-center">
                  Cancel
                </Link>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
