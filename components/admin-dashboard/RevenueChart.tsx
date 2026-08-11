"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export default function RevenueChart() {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] p-6 w-full h-full flex flex-col justify-between min-h-[300px]">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Monthly Revenue</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 p-8 text-center">
        <TrendingUp size={36} className="text-slate-300 dark:text-slate-700 mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Revenue data unavailable</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Payment transactions will populate revenue metrics once payments are processed.</p>
      </div>
    </div>
  );
}
