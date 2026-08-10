"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { PaymentStatus } from "./types";

interface StatusBadgeProps {
  status: PaymentStatus;
}

const statusConfig = {
  success: {
    label: "Success",
    className: "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400",
    Icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    Icon: Clock,
  },
  failed: {
    label: "Failed",
    className: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    Icon: XCircle,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.Icon;

  return (
    <motion.span
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, delay: 0.15 }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={12} strokeWidth={2.5} className="shrink-0" />
      <span>{config.label}</span>
    </motion.span>
  );
}
