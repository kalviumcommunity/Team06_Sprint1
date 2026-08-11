"use client";

import { Settings } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-600" />
          <h1 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">Settings</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
          <Settings className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Account preferences and notification settings coming soon.
        </p>
      </main>
    </div>
  );
}
