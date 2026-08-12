"use client";

import React from "react";
import { Users, ClipboardList, Package, AlertTriangle } from "lucide-react";

interface StatCardsProps {
  data: {
    totalUsers: number;
    totalOrders: number;
    totalSubscriptions: number;
    failedPayments: number;
  } | null;
  isLoading?: boolean;
}

export default function StatCards({ data, isLoading }: StatCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: data ? data.totalUsers.toLocaleString() : "0",
      icon: Users,
      color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Orders",
      value: data ? data.totalOrders.toLocaleString() : "0",
      icon: ClipboardList,
      color: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    {
      title: "Subscriptions",
      value: data ? data.totalSubscriptions.toLocaleString() : "0",
      icon: Package,
      color: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Failed Payments",
      value: data ? data.failedPayments.toLocaleString() : "0",
      icon: AlertTriangle,
      color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="animate-pulse bg-white dark:bg-slate-950 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col h-36"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group bg-white dark:bg-slate-950 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.2)] transition-all duration-300 p-6 flex flex-col justify-between"
          >
            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
                <Icon size={24} />
              </div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>Database total</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
