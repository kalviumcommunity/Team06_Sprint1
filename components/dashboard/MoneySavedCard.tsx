"use client";

import { useState } from "react";
import type { MoneySavedSummary } from "@/types/dashboard";

interface MoneySavedCardProps {
  summary: MoneySavedSummary;
}

export function MoneySavedCard({ summary }: MoneySavedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAvailable = Boolean(
    summary &&
      summary.amount &&
      summary.amount !== "Data unavailable" &&
      summary.amount !== "Coming Soon" &&
      summary.amount !== "N/A" &&
      summary.amount !== ""
  );

  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#00b386]">
            {isAvailable ? "Money Saved" : "Savings Analytics"}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            {isAvailable ? summary.amount : "Coming Soon"}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
          {isAvailable ? `+${summary.percentage}` : "Coming Soon"}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {isAvailable
          ? summary.comparison
          : "Savings will appear once pricing comparison data becomes available."}
      </p>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Savings Breakdown</h4>
          
          {isAvailable ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Monthly Subscription Savings</span>
                <span className="font-medium text-slate-900 dark:text-white">{summary.amount}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No pricing comparison fields (actualPrice, discountedPrice, or discountAmount) currently exist in database records. Once real pricing data is tracked, automated savings analytics will populate here.
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-5 inline-flex text-sm font-semibold text-[#00b386] transition hover:text-[#009e76] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b386] rounded px-1"
      >
        {isExpanded ? "Hide details ↑" : "View details →"}
      </button>
    </section>
  );
}
