"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Search, Loader2, AlertCircle,
  ShoppingBag, Pill, X, Info, Calendar, FlaskConical, MapPin
} from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface Medicine {
  id: string;
  name: string;
  description: string | null;
  manufacturer: string;
  price: number;
  stock: number;
  dosage: string | null;
  manufacturingDate: string | null;
  expiryDate: string | null;
}

export default function MedicinesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [subscribeModal, setSubscribeModal] = useState<Medicine | null>(null);
  const [detailModal, setDetailModal] = useState<Medicine | null>(null);

  const fetchMedicines = useCallback(async (q: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/medicines${q ? `?search=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMedicines(data.medicines || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines("");
  }, [fetchMedicines]);

  useEffect(() => {
    const t = setTimeout(() => fetchMedicines(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchMedicines]);

  const handleSubscribe = (medicine: Medicine) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setSubscribeModal(medicine);
  };

  const confirmSubscribe = async (medicine: Medicine, freq: string, qty: number, deliveryAddress: string) => {
    setSubscribing(medicine.id);
    setSubscribeModal(null);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: medicine.id,
          frequency: freq,
          quantity: qty,
          startDate: new Date().toISOString(),
          deliveryAddress: deliveryAddress || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg(`Subscribed to ${medicine.name}!`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Subscription failed");
      setTimeout(() => setError(""), 4000);
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-emerald-600" />
              <h1 className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                Medicines
              </h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Browse Medicines</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Find medicines and subscribe for automatic refills.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400">
            <ShoppingBag size={16} /> {successMsg}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicines…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-500/30"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="text-slate-500 dark:text-slate-400">Loading medicines…</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="py-24 text-center">
            <Pill className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No medicines found{search ? ` for "${search}"` : ""}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {medicines.map((med) => (
              <MedicineCard
                key={med.id}
                medicine={med}
                subscribing={subscribing === med.id}
                onSubscribe={() => handleSubscribe(med)}
                onViewDetails={() => setDetailModal(med)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Subscribe Modal */}
      {subscribeModal && (
        <SubscribeModal
          medicine={subscribeModal}
          onClose={() => setSubscribeModal(null)}
          onConfirm={confirmSubscribe}
        />
      )}

      {/* Details Modal */}
      {detailModal && (
        <DetailsModal
          medicine={detailModal}
          onClose={() => setDetailModal(null)}
          onSubscribe={() => {
            setDetailModal(null);
            handleSubscribe(detailModal);
          }}
        />
      )}
    </div>
  );
}

function MedicineCard({
  medicine, subscribing, onSubscribe, onViewDetails
}: {
  medicine: Medicine;
  subscribing: boolean;
  onSubscribe: () => void;
  onViewDetails: () => void;
}) {
  const outOfStock = medicine.stock <= 0;

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
      <div className="absolute top-3 right-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          outOfStock
            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            : medicine.stock <= 10
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        }`}>
          {outOfStock ? "Out of Stock" : `${medicine.stock} left`}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
          <Pill className="h-7 w-7 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{medicine.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{medicine.manufacturer}</p>
        </div>
        {medicine.dosage && (
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full w-fit">
            {medicine.dosage}
          </p>
        )}
        {medicine.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{medicine.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-bold text-emerald-600">₹{medicine.price.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <Info size={13} /> Details
          </button>
          <button
            onClick={onSubscribe}
            disabled={outOfStock || subscribing}
            className="flex-1 rounded-xl py-2.5 text-xs font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700"
          >
            {subscribing ? "Subscribing…" : outOfStock ? "Out of Stock" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailsModal({
  medicine, onClose, onSubscribe
}: {
  medicine: Medicine;
  onClose: () => void;
  onSubscribe: () => void;
}) {
  const outOfStock = medicine.stock <= 0;
  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
              <Pill className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{medicine.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="grid grid-cols-2 gap-3 pb-3">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">Manufacturer</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{medicine.manufacturer}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">Price</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{medicine.price.toFixed(2)}</p>
            </div>
          </div>

          {medicine.dosage && (
            <div className="py-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5 flex items-center gap-1">
                <FlaskConical size={12} /> Dosage
              </p>
              <p className="text-sm text-slate-900 dark:text-white">{medicine.dosage}</p>
            </div>
          )}

          {medicine.description && (
            <div className="py-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">Description / Purpose</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{medicine.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 py-3">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5 flex items-center gap-1">
                <Calendar size={12} /> Manufacturing Date
              </p>
              <p className="text-sm text-slate-900 dark:text-white">{fmt(medicine.manufacturingDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5 flex items-center gap-1">
                <Calendar size={12} /> Expiry Date
              </p>
              <p className={`text-sm font-semibold ${medicine.expiryDate && new Date(medicine.expiryDate) < new Date() ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
                {fmt(medicine.expiryDate)}
              </p>
            </div>
          </div>

          <div className="pt-3">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">Availability</p>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              outOfStock
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : medicine.stock <= 10
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}>
              {outOfStock ? "Out of Stock" : `${medicine.stock} units in stock`}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">
            Close
          </button>
          <button
            onClick={onSubscribe}
            disabled={outOfStock}
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscribeModal({
  medicine, onClose, onConfirm
}: {
  medicine: Medicine;
  onClose: () => void;
  onConfirm: (m: Medicine, freq: string, qty: number, deliveryAddress: string) => void;
}) {
  const [freq, setFreq] = useState("MONTHLY");
  const [qty, setQty] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Subscribe</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Subscribing to <strong className="text-slate-900 dark:text-white">{medicine.name}</strong> (₹{medicine.price.toFixed(2)})
        </p>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Frequency</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <MapPin size={13} /> Delivery Address <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="e.g. 42 MG Road, Bangalore 560001"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(medicine, freq, qty, deliveryAddress)}
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
