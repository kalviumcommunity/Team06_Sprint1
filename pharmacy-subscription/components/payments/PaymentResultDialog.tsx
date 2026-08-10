"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, FileText, RefreshCw, X } from "lucide-react";

interface PaymentResultDialogProps {
  open: boolean;
  variant: "success" | "failure";
  paymentId?: string;
  transactionId?: string;
  amount?: number;
  method?: string;
  onViewReceipt?: () => void;
  onDone?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
}

export default function PaymentResultDialog({
  open, variant, paymentId, transactionId, amount, method,
  onViewReceipt, onDone, onRetry, onCancel,
}: PaymentResultDialogProps) {
  const isSuccess = variant === "success";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)" }}
          onClick={isSuccess ? onDone : onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="relative w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-8 shadow-2xl text-center border border-slate-100 dark:border-slate-700/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={isSuccess ? onDone : onCancel}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              aria-label="Close"
            >
              <X size={14} className="text-slate-400 dark:text-slate-500" />
            </button>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.1 }}
              className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
                isSuccess
                  ? "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950/50 dark:to-green-900/40"
                  : "bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-950/50 dark:to-rose-900/40"
              }`}
            >
              {isSuccess
                ? <CheckCircle2 size={40} strokeWidth={2} className="text-green-500" />
                : <XCircle size={40} strokeWidth={2} className="text-rose-500" />}
            </motion.div>

            {/* Heading */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${isSuccess ? "text-green-500" : "text-rose-500"}`}>
                {isSuccess ? "Payment Successful" : "Payment Failed"}
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                {isSuccess ? "Payment Confirmed" : "Could Not Process"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {isSuccess
                  ? "Your subscription has been renewed successfully."
                  : "Your payment could not be completed. Please try again or use a different method."}
              </p>
            </motion.div>

            {/* Details pill */}
            {(transactionId || amount) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 px-5 py-4 text-left space-y-2.5"
              >
                {transactionId && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Transaction ID</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">{transactionId}</span>
                  </div>
                )}
                {paymentId && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Payment ID</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{paymentId}</span>
                  </div>
                )}
                {method && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Method</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{method}</span>
                  </div>
                )}
                {amount && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Amount</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">₹{amount}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex gap-3"
            >
              {isSuccess ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onViewReceipt}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 dark:border-emerald-800 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-400 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer"
                    id="view-receipt-btn"
                  >
                    <FileText size={15} strokeWidth={2.5} />
                    View Receipt
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,179,134,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDone}
                    className="flex-1 rounded-2xl py-3 text-sm font-bold text-white cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #00b386 0%, #00c896 100%)", boxShadow: "0 2px 8px rgba(0,179,134,0.25)" }}
                    id="result-done-btn"
                  >
                    Done
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancel}
                    className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    id="failure-cancel-btn"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,179,134,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRetry}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #00b386 0%, #00c896 100%)", boxShadow: "0 2px 8px rgba(0,179,134,0.25)" }}
                    id="retry-payment-btn"
                  >
                    <RefreshCw size={14} strokeWidth={2.5} />
                    Retry Payment
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
