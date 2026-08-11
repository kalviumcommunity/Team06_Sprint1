"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export default function PaymentsHeader() {
  return (
    <div className="flex items-center justify-between">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-[30px] font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
          Payments
        </h1>
        <p className="mt-0.5 text-sm font-medium text-slate-400 dark:text-slate-500">
          Manage your payment history &amp; saved methods
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1"
      >
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative rounded-xl p-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Notifications"
          id="notifications-bell"
        >
          <Bell size={20} strokeWidth={2} className="text-slate-500 dark:text-slate-400" />
          {/* Animated red notification dot */}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.6 }}
            className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
}
