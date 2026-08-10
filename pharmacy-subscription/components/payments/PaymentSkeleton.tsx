"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PaymentSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="rounded-2xl bg-white dark:bg-slate-800/60 p-5 border border-slate-100 dark:border-slate-700/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              {/* Title + badge */}
              <div className="flex items-center gap-3">
                <div className="h-5 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              {/* Lines */}
              <div className="space-y-2">
                {[80, 120, 60].map((w, j) => (
                  <div
                    key={j}
                    className="h-3 animate-pulse rounded-md bg-slate-100 dark:bg-slate-700/60"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
            {/* Amount */}
            <div className="h-6 w-14 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 ml-4" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
