"use client";

import { useState } from "react";
import type { MoneySavedSummary } from "@/types/dashboard";

interface MoneySavedCardProps {
  summary: MoneySavedSummary;
}

export function MoneySavedCard({ summary }: MoneySavedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Money Saved</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{summary.amount}</p>
        </div>
        <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
          +{summary.percentage}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{summary.comparison}</p>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Savings Breakdown</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Monthly Subscription Savings</span>
              <span className="font-medium text-slate-900 dark:text-white">₹850</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Auto Refill Discounts</span>
              <span className="font-medium text-slate-900 dark:text-white">₹350</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Coupon Savings</span>
              <span className="font-medium text-slate-900 dark:text-white">₹250</span>
            </div>
            
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white text-sm">Total Saved</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹1,450</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Progress</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">72%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[72%] transition-all duration-1000 ease-out"></div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              You&apos;ve saved more than 72% of users this month.
            </p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-5 inline-flex text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1"
      >
        {isExpanded ? "Hide details ↑" : "View details →"}
      </button>
    </section>
  );
}
