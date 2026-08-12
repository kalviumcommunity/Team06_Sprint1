"use client";

import React from "react";
import { useMobileMenu } from "@/components/layout/DashboardLayout";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export function PageHeader({
  title,
  showBack = false,
}: PageHeaderProps) {
  const { toggleMobileMenu } = useMobileMenu();

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 mb-6 rounded-md flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Open mobile menu"
            className="md:hidden flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-900 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
      </div>
    </div>
  );
}
