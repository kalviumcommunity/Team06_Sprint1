"use client";

import React from "react";
import { motion } from "framer-motion";
import { Inbox, SearchX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  isSearchResult?: boolean;
}

export default function EmptyState({
  message = "No payment history available.",
  subMessage = "Your payments will appear here once you make a purchase.",
  isSearchResult = false,
}: EmptyStateProps) {
  const Icon = isSearchResult ? SearchX : Inbox;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center rounded-[20px] bg-white dark:bg-slate-800/60 py-20 px-6 text-center shadow-sm border border-slate-100 dark:border-slate-700/50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-600"
          style={{ boxShadow: "0 0 0 8px var(--color-bg-blue), 0 0 0 16px color-mix(in srgb, var(--color-bg-blue) 50%, transparent)" }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Icon size={40} strokeWidth={1.5} className="text-slate-400 dark:text-slate-500" />
          </motion.div>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute inset-0"
        >
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              className="absolute h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateX(52px) translateY(-50%)`,
                opacity: 0.4,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-2 text-lg font-bold text-slate-800 dark:text-slate-100"
      >
        {message}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-sm text-sm leading-relaxed text-slate-400 dark:text-slate-500"
      >
        {subMessage}
      </motion.p>
    </motion.div>
  );
}
