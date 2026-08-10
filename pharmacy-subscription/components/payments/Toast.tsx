"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import type { ToastNotification } from "./types";

interface ToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

const toastConfig = {
  success: {
    bgClass: "bg-emerald-50 dark:bg-emerald-950/80",
    borderClass: "border-emerald-200 dark:border-emerald-900/40",
    textClass: "text-emerald-800 dark:text-emerald-250",
    Icon: CheckCircle,
    iconColor: "text-emerald-500 dark:text-emerald-450",
    bgProgressClass: "bg-emerald-500",
  },
  error: {
    bgClass: "bg-rose-50 dark:bg-rose-950/80",
    borderClass: "border-rose-200 dark:border-rose-900/40",
    textClass: "text-rose-800 dark:text-rose-250",
    Icon: AlertCircle,
    iconColor: "text-rose-500 dark:text-rose-450",
    bgProgressClass: "bg-rose-500",
  },
  info: {
    bgClass: "bg-blue-50 dark:bg-blue-950/80",
    borderClass: "border-blue-200 dark:border-blue-900/40",
    textClass: "text-blue-800 dark:text-blue-250",
    Icon: Info,
    iconColor: "text-blue-500 dark:text-blue-450",
    bgProgressClass: "bg-blue-500",
  },
  warning: {
    bgClass: "bg-amber-50 dark:bg-amber-950/80",
    borderClass: "border-amber-200 dark:border-amber-900/40",
    textClass: "text-amber-800 dark:text-amber-250",
    Icon: AlertCircle,
    iconColor: "text-amber-500 dark:text-amber-450",
    bgProgressClass: "bg-amber-500",
  },
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  return (
    <AnimatePresence>
      {toast && (() => {
        const config = toastConfig[toast.type];
        const Icon = config.Icon;

        return (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-4 shadow-xl sm:left-auto sm:right-6 sm:translate-x-0 border ${config.bgClass} ${config.borderClass}`}
            style={{
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)`,
              minWidth: "300px",
              maxWidth: "420px",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
            >
              <Icon size={22} strokeWidth={2.5} className={config.iconColor} />
            </motion.div>

            <span
              className={`flex-1 text-sm font-semibold ${config.textClass}`}
            >
              {toast.message}
            </span>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDismiss}
              className="ml-1 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Dismiss notification"
            >
              <X size={14} className="text-slate-400 dark:text-slate-500" />
            </motion.button>

            {/* Auto-dismiss progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: (toast.duration || 3000) / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-[3px] w-full origin-left rounded-b-2xl opacity-30 ${config.bgProgressClass}`}
            />
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
}
