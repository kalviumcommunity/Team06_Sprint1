"use client";

import React from "react";
import { motion } from "framer-motion";

interface TabControlProps {
  activeTab: "payments" | "history";
  onTabChange: (tab: "payments" | "history") => void;
}

export default function TabControl({ activeTab, onTabChange }: TabControlProps) {
  const tabs = [
    { key: "payments" as const, label: "Payments" },
    { key: "history" as const, label: "Payment History" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative flex rounded-2xl p-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/40"
      style={{ boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.04)" }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`relative z-10 flex flex-1 items-center justify-center rounded-xl px-5 py-3 text-sm transition-colors cursor-pointer ${
              isActive
                ? "text-slate-900 dark:text-white font-bold"
                : "text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200"
            }`}
            id={`tab-${tab.key}`}
          >
            {tab.label}

            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-xl bg-white dark:bg-slate-700"
                style={{
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)",
                  zIndex: -1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
              />
            )}
          </button>
        );
      })}
    </motion.div>
  );
}
