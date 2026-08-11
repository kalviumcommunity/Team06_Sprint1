"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, User } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  place: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    place: "",
    dob: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUser(data.user);
        setForm({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          gender: data.user.gender,
          place: data.user.place,
          dob: data.user.dob?.split("T")[0] || "",
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.user);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
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
          <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">My Profile</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="text-slate-500 dark:text-slate-400">Loading profile…</p>
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-400 mb-2" />
            <p className="text-red-700 dark:text-red-400">{error || "Could not load profile."}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Avatar / Role card */}
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 flex items-center gap-5 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex-shrink-0">
                <User className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {user.role}
                </span>
              </div>
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

            {/* Edit form */}
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-sm space-y-5">
              <h2 className="font-semibold text-slate-900 dark:text-white">Edit Profile</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="First Name" value={form.firstName} onChange={set("firstName")} type="text" />
                <FormField label="Last Name" value={form.lastName} onChange={set("lastName")} type="text" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Date of Birth" value={form.dob} onChange={set("dob")} type="date" />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                  <select value={form.gender} onChange={set("gender")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <FormField label="Phone Number" value={form.phone} onChange={set("phone")} type="tel" />
              <FormField label="City / Place" value={form.place} onChange={set("place")} type="text" />

              {/* Read-only email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input type="email" value={user.email} readOnly
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400" />
                <p className="text-xs text-slate-400 dark:text-slate-500">Email cannot be changed.</p>
              </div>

              {/* Read-only role */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <input type="text" value={user.role} readOnly
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400" />
              </div>

              <button type="submit" disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition">
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function FormField({
  label, value, onChange, type
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input type={type} value={value} onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-500/30 transition" />
    </div>
  );
}
