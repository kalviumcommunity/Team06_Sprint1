"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="relative w-full max-w-md rounded-[20px] bg-white dark:bg-slate-900 p-7 shadow-2xl border border-slate-100 dark:border-slate-700/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close dialog"
            >
              <X size={16} className="text-slate-400 dark:text-slate-500" />
            </motion.button>

            {/* Warning icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950/50 dark:to-amber-900/40"
            >
              <AlertTriangle size={26} strokeWidth={2.5} className="text-amber-500" />
            </motion.div>

            <h3 className="mb-2.5 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="mb-7 text-sm leading-relaxed text-slate-500 dark:text-slate-400" style={{ lineHeight: 1.7 }}>
              {message}
            </p>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 179, 134, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #00b386 0%, #00d4a0 100%)", boxShadow: "0 2px 8px rgba(0, 179, 134, 0.25)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                      <Loader2 size={16} />
                    </motion.div>
                    Processing...
                  </span>
                ) : confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
