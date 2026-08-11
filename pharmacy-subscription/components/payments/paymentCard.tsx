"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Payment } from "./types";

interface PaymentCardProps {
  payment: Payment;
  index: number;
  onRetry: (payment: Payment) => void;
}

export default function PaymentCard({ payment, index, onRetry }: PaymentCardProps) {
  const isSpecificOrder = payment.orderId.toLowerCase() !== "subscription renewal";

  const getDetailsText = () => {
    const cleanMethod = payment.method.replace(" - ", " · ");
    if (payment.method.toLowerCase().includes("visa")) {
      return `${payment.method} • ${payment.date}`;
    }
    return `${cleanMethod} · ${payment.date}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl bg-white dark:bg-slate-800/60 p-5 border border-slate-100 dark:border-slate-700/50 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
    >
      <div className="flex flex-col space-y-1.5">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">
              {payment.paymentId}
            </span>
            <StatusBadge status={payment.status} />
          </div>
          <span className="text-[16px] font-bold text-slate-900 dark:text-white">
            ₹{payment.amount}
          </span>
        </div>

        {/* Transaction ID */}
        {payment.transactionId && (
          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 -mt-0.5">
            {payment.transactionId}
          </div>
        )}

        {/* Middle Row */}
        <div className="text-[13px] text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
          {isSpecificOrder ? (
            <Link
              href={`/orders?orderId=${encodeURIComponent(payment.orderId)}`}
              className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 hover:underline"
            >
              <span>Order {payment.orderId}</span>
              <ExternalLink size={13} strokeWidth={2} />
            </Link>
          ) : (
            <span>Subscription renewal</span>
          )}
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between text-[12px] text-slate-400 dark:text-slate-500 font-semibold pt-1">
          <div className="flex items-center gap-1 tracking-tight">
            {getDetailsText()}
          </div>

          {payment.status === "failed" && (
            <div className="flex items-center gap-2">
              {payment.failureReason && (
                <span className="text-[11px] font-semibold text-rose-400 dark:text-rose-500">
                  {payment.failureReason}
                </span>
              )}
              <button
                onClick={() => onRetry(payment)}
                className="flex items-center gap-1.5 font-bold transition-colors hover:text-emerald-700 active:scale-95 text-[13px] cursor-pointer text-teal-600 dark:text-teal-400"
                id={`retry-${payment.id}`}
              >
                <RefreshCw size={13} strokeWidth={2.5} className="shrink-0" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
