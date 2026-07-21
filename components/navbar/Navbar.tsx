"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface NavbarProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

export function Navbar({ title, onMobileMenuToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex flex-row items-center justify-between gap-4 flex-nowrap rounded-[2rem] border border-slate-200/80 bg-white/80 p-4 px-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 navbar-layout">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={onMobileMenuToggle}
          className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 navbar-menu-btn"
        >
          ☰
        </button>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-black transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          
          <div 
            className={`absolute right-0 mt-3 w-[280px] origin-top-right rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${
              showNotifications ? "scale-100 opacity-100 pointer-events-auto z-50" : "scale-95 opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <span className="mb-3 text-4xl">🔔</span>
              <p className="text-base font-semibold text-slate-900 dark:text-white">No new notifications</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">You&apos;re all caught up.</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-black transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800"
        >
          <span className="transition-transform duration-500">
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            )}
          </span>
        </button>
      </div>
    </header>
  );
}
