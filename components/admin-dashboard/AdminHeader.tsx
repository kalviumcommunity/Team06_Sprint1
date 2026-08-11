"use client";

import React from 'react';
import Link from 'next/link';
import { Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const pathname = usePathname();
  const isDashboard = pathname === '/admin/dashboard';

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-blue-500/10 via-transparent to-white dark:from-blue-500/10 dark:to-slate-900 rounded-[2rem] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] border border-slate-200/80 dark:border-slate-800 p-6 md:px-8 md:py-8 mb-8 flex justify-between items-center w-full relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -right-10 top-4 h-24 w-24 rounded-full bg-blue-400/20 blur-2xl" />
      <div className="absolute -left-10 bottom-6 h-28 w-28 rounded-full bg-slate-900/10 blur-2xl" />
      
      {/* Left Text Content */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Welcome back, Admin!</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{currentDate}</p>
      </div>
      
      {/* Right Icons Container */}
      {isDashboard && (
        <div className="flex items-center gap-4 relative z-10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm">
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-blue-400 rounded-full transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Link 
          href="/admin/notifications"
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-blue-400 rounded-full transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell size={20} />
        </Link>
        </div>
      )}
    </div>
  );
}
