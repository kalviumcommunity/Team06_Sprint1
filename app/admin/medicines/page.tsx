"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Search, Plus, Edit, Trash2, Loader2,
  AlertCircle, CheckCircle2, Pill, X, AlertTriangle
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

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    manufacturer: "",
    price: "",
    stock: "",
    dosage: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  const fetchMedicines = useCallback(async (q: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/medicines${q ? `?search=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch medicines");
      setMedicines(data.medicines || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error fetching medicines");
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

  const openCreateModal = () => {
    setEditingMed(null);
    setForm({ name: "", description: "", manufacturer: "", price: "", stock: "", dosage: "", manufacturingDate: "", expiryDate: "" });
    setModalOpen(true);
  };

  const openEditModal = (med: Medicine) => {
    setEditingMed(med);
    setForm({
      name: med.name,
      description: med.description || "",
      manufacturer: med.manufacturer,
      price: med.price.toString(),
      stock: med.stock.toString(),
      dosage: med.dosage || "",
      manufacturingDate: med.manufacturingDate ? med.manufacturingDate.split("T")[0] : "",
      expiryDate: med.expiryDate ? med.expiryDate.split("T")[0] : "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const priceNum = parseFloat(form.price);
    const stockNum = parseInt(form.stock, 10);

    if (isNaN(priceNum) || priceNum < 0) {
      setError("Please enter a valid positive price.");
      setSaving(false);
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError("Please enter a valid stock quantity.");
      setSaving(false);
      return;
    }

    try {
      const url = editingMed ? `/api/medicines/${editingMed.id}` : "/api/medicines";
      const method = editingMed ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          manufacturer: form.manufacturer,
          price: priceNum,
          stock: stockNum,
          dosage: form.dosage || undefined,
          manufacturingDate: form.manufacturingDate || undefined,
          expiryDate: form.expiryDate || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");

      setSuccess(editingMed ? "Medicine updated successfully!" : "Medicine added successfully!");
      setModalOpen(false);
      fetchMedicines(search);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving medicine");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete medicine");

      setSuccess("Medicine deleted successfully!");
      fetchMedicines(search);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting medicine");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
              Admin Medicines Management
            </h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={16} /> Add New Medicine
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
            <AlertCircle size={15} /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400">
            <CheckCircle2 size={15} /> {success}
          </div>
        )}

        {/* Content Table */}
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center py-24 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="text-slate-500 dark:text-slate-400">Loading inventory...</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500">
              <Pill className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No medicines found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-left font-medium">
                    <th className="px-6 py-3.5">Medicine Name</th>
                    <th className="px-6 py-3.5">Manufacturer</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Stock</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {medicines.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{med.name}</p>
                        {med.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{med.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{med.manufacturer}</td>
                      <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">₹{med.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          med.stock <= 0
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : med.stock <= 10
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}>
                          {med.stock <= 10 && med.stock > 0 && <AlertTriangle size={12} />}
                          {med.stock <= 0 ? "Out of Stock" : `${med.stock} units`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(med)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(med.id)}
                            disabled={deletingId === med.id}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === med.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingMed ? "Edit Medicine" : "Add New Medicine"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Paracetamol 500mg"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  required
                  value={form.manufacturer}
                  onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                  placeholder="e.g. Cipla Pharma"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="25.00"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="100"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={form.dosage}
                  onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                  placeholder="e.g. 500mg twice daily"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Manufacturing Date
                  </label>
                  <input
                    type="date"
                    value={form.manufacturingDate}
                    onChange={(e) => setForm({ ...form, manufacturingDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional medicine notes or usage details..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
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
                  {saving ? "Saving..." : editingMed ? "Update Medicine" : "Create Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
