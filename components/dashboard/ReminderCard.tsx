"use client";

import { useState, useEffect } from "react";
import type { ReminderInfo } from "@/types/dashboard";

interface ReminderCardProps {
  reminder: ReminderInfo | null;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  // Reminder acknowledgement is intentionally client-side only because medication adherence tracking is outside the current MVP scope.
  const [isTaken, setIsTaken] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const getTodayKey = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `reminder-taken-${year}-${month}-${day}`;
  };

  useEffect(() => {
    const key = getTodayKey();
    const stored = localStorage.getItem(key);
    if (stored === "true") {
      setIsTaken(true);
    }
  }, []);

  const handleMarkAsTaken = () => {
    const key = getTodayKey();
    localStorage.setItem(key, "true");
    setIsTaken(true);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (!reminder) {
    return (
      <section className="relative flex flex-col justify-between rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#00b386]">Today’s Reminder</p>
          <div className="mt-4 p-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No reminders for today
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex flex-col justify-between rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950 transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#00b386]">Today’s Reminder</p>
          <p className={`mt-2 text-lg font-semibold text-slate-950 dark:text-white transition-all ${isTaken ? 'line-through opacity-50' : ''}`}>
            {reminder.medicine}
          </p>
        </div>
        <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {reminder.time}
        </span>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleMarkAsTaken}
          disabled={isTaken}
          className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ${
            isTaken
              ? "bg-[#e6f7f3] text-[#00b386] dark:bg-[#00b386]/20 dark:text-[#00b386] border border-[#00b386]/30 cursor-not-allowed"
              : "bg-[#00b386] text-white hover:bg-[#009e76] active:scale-[0.98]"
          }`}
        >
          {isTaken ? "Taken ✓" : "Mark as taken"}
        </button>

        {showToast && (
          <div className="text-xs font-semibold text-[#00b386] dark:text-[#00b386] text-center mt-2 animate-pulse">
            Dose logged successfully!
          </div>
        )}
      </div>
    </section>
  );
}
