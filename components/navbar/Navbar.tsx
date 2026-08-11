"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

export function Navbar({ title, onMobileMenuToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();
  
  const { notifications, unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
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

  // Only show icons on main dashboard, hide on settings and notifications
  const hideIcons = pathname === "/dashboard/notifications" || pathname === "/dashboard/settings";
  const showHeaderIcons = pathname.startsWith("/dashboard") && !hideIcons;

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
        {showHeaderIcons && (
          <>
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="flex h-10 w-10 relative items-center justify-center rounded-full border border-slate-200 bg-white text-black transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50 overflow-hidden transform origin-top-right transition-all">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700/50">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.slice(0, 5).map(n => (
                      <div key={n.id} className="p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition last:border-0">
                        <p className={`text-sm font-semibold line-clamp-1 ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{n.title}</p>
                        <p className={`text-xs mt-1 line-clamp-2 ${!n.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2">{formatTimeAgo(n.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>
                <Link 
                  href="/dashboard/notifications" 
                  onClick={() => setShowNotifications(false)}
                  className="block p-3 text-center text-sm font-medium text-[#00b386] bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:text-[#00b386] dark:hover:bg-slate-800/80 transition"
                >
                  View All Notifications
                </Link>
              </div>
            )}
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
          </>
        )}
      </div>
    </header>
  );
}
