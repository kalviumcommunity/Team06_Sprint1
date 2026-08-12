"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface SubscriptionData {
  id: string;
  medicineId: string;
  frequency: string;
  quantity: number;
  startDate: string;
  status: string;
  medicine?: { name: string };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: SubscriptionData | null;
}

export default function CreateEditModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicineId, setMedicineId] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/medicines")
        .then((r) => r.json())
        .then((d) => setMedicines(d.medicines || []))
        .catch(() => {});

      if (initialData) {
        setMedicineId(initialData.medicineId);
        setFrequency(initialData.frequency);
        setQuantity(initialData.quantity);
        setStartDate(initialData.startDate?.split("T")[0] ?? new Date().toISOString().split("T")[0]);
      } else {
        setMedicineId("");
        setFrequency("MONTHLY");
        setQuantity(1);
        setStartDate(new Date().toISOString().split("T")[0]);
      }
      setError("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!medicineId) {
      setError("Please select a medicine.");
      return;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    setLoading(true);
    try {
      const url = initialData
        ? `/api/subscriptions/${initialData.id}`
        : "/api/subscriptions";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicineId, frequency, quantity, startDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save subscription");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedMed = medicines.find((m) => m.id === medicineId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialData ? "Edit Subscription" : "New Subscription"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Medicine
            </label>
            <select
              value={medicineId}
              onChange={(e) => setMedicineId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-500/30"
            >
              <option value="">Select a medicine…</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id} disabled={m.stock <= 0}>
                  {m.name} — ₹{m.price.toFixed(2)}{m.stock <= 0 ? " (Out of Stock)" : ""}
                </option>
              ))}
            </select>
            {selectedMed && selectedMed.stock <= 0 && (
              <p className="text-xs text-red-500">This medicine is out of stock.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Saving…" : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
