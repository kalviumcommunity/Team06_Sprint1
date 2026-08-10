"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Star,
  Edit3,
  Trash2,
  Shield,
} from "lucide-react";
import type { SavedPaymentMethod, SavedMethodType } from "./types";

interface SavedMethodCardProps {
  method: SavedPaymentMethod;
  index: number;
  onEdit: (method: SavedPaymentMethod) => void;
  onDelete: (method: SavedPaymentMethod) => void;
}

const iconMap: Record<
  SavedMethodType,
  { icon: React.ElementType; color: string; bg: string; gradient: string }
> = {
  visa: {
    icon: CreditCard,
    color: "#1e40af",
    bg: "#dbeafe",
    gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
  },
  mastercard: {
    icon: CreditCard,
    color: "#ea580c",
    bg: "#ffedd5",
    gradient: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)",
  },
  googlepay: {
    icon: Smartphone,
    color: "#16a34a",
    bg: "#dcfce7",
    gradient: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
  },
  phonepe: {
    icon: Smartphone,
    color: "#7c3aed",
    bg: "#ede9fe",
    gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
  },
  paytm: {
    icon: Wallet,
    color: "#0284c7",
    bg: "#e0f2fe",
    gradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
  },
};

export default function SavedMethodCard({
  method,
  index,
  onEdit,
  onDelete,
}: SavedMethodCardProps) {
  const config = iconMap[method.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 16px 48px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)",
      }}
      className="group rounded-[20px] bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-300 md:p-6 border border-slate-100 dark:border-slate-800"
      style={{
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left - Icon & Details */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex h-13 w-13 items-center justify-center rounded-2xl"
            style={{
              background: config.gradient,
              width: "52px",
              height: "52px",
            }}
          >
            <Icon size={24} strokeWidth={2} style={{ color: config.color }} />
          </motion.div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                {method.name}
              </span>
              {method.isDefault && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.2 }}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 shadow-sm"
                >
                  <Star size={9} fill="currentColor" />
                  Default
                </motion.span>
              )}
            </div>
            {method.maskedNumber && (
              <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                <Shield size={10} className="text-slate-300 dark:text-slate-600" />
                {method.maskedNumber}
              </span>
            )}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(method)}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            aria-label={`Edit ${method.name}`}
          >
            <Edit3 size={15} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(method)}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 dark:text-rose-400"
            aria-label={`Delete ${method.name}`}
          >
            <Trash2 size={15} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
