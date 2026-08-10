"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Shield } from "lucide-react";
import SavedMethodCard from "./SavedMethodCard";
import type { SavedPaymentMethod } from "./types";

interface SavedMethodsProps {
  methods: SavedPaymentMethod[];
  loading: boolean;
  onEdit: (method: SavedPaymentMethod) => void;
  onDelete: (method: SavedPaymentMethod) => void;
}

export default function SavedMethods({
  methods,
  loading,
  onEdit,
  onDelete,
}: SavedMethodsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[76px] animate-pulse rounded-[20px] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Security note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2.5 rounded-2xl px-4 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-900/30"
      >
        <Shield size={16} strokeWidth={2.5} className="text-emerald-500 dark:text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
          Your payment methods are secured with 256-bit encryption
        </span>
      </motion.div>

      {/* Method cards */}
      <AnimatePresence>
        {methods.map((method, index) => (
          <SavedMethodCard
            key={method.id}
            method={method}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>

      {/* Add New Method Button */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: methods.length * 0.08 + 0.15, duration: 0.5 }}
        whileHover={{
          y: -3,
          boxShadow: "0 8px 32px rgba(0, 179, 134, 0.15)",
          borderColor: "#00b386",
        }}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-2.5 rounded-[20px] border-2 border-dashed border-teal-500/30 dark:border-teal-500/20 p-5 text-sm font-bold transition-all text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-350 hover:border-teal-500 bg-transparent"
        id="add-payment-method"
      >
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Plus size={20} strokeWidth={2.5} />
        </motion.div>
        Add New Payment Method
      </motion.button>
    </div>
  );
}
