"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, ShoppingBag, X, CheckCheck, Package } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  orderId: string | null;
  paymentId: string | null;
  createdAt: string;
};

export default function Header({ title = "Orders" }) {
  const pathname = usePathname();
  const isOrders = pathname === "/orders" || pathname === "/";
  const isPayments = pathname === "/payments";

  // ── Notification state ──
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch {
      // silently fail – notifications are non-critical
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 8 seconds for new notifications
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const getNotifLink = (n: Notification) => {
    if (n.orderId) return `/orders?orderId=${n.orderId}`;
    if (n.paymentId) return `/payments`;
    return "#";
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString("en-IN", { month: "short", day: "2-digit" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 sm:px-6 lg:px-8 backdrop-blur shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo-emblem.png" alt="PharmEasy" className="h-12 w-auto shrink-0 object-contain drop-shadow-sm" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">PharmEasy</h1>
            <p className="text-xs font-semibold text-teal-600">Pharmacy Portal</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200/80 dark:border-slate-700/80">
          <Link
            href="/orders"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              isOrders
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </Link>
          <Link
            href="/payments"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              isPayments
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </Link>
        </div>

        {/* Right Actions — Notifications Bell */}
        <div className="flex items-center gap-1 sm:gap-2" ref={dropdownRef}>
          <div className="relative">
            <button
              type="button"
              id="notifications-bell"
              aria-label="Notifications"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative rounded-xl p-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Bell size={20} strokeWidth={2} className="text-slate-500 dark:text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div
                className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
                      >
                        <CheckCheck size={12} />
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <Package size={22} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No notifications yet</p>
                      <p className="text-xs text-slate-400 mt-1">Order and payment updates will appear here</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={getNotifLink(n)}
                        onClick={() => {
                          if (!n.isRead) handleMarkOneRead(n.id);
                          setNotifOpen(false);
                        }}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800/60 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                          !n.isRead ? "bg-teal-50/60 dark:bg-teal-950/20" : ""
                        }`}
                      >
                        {/* Dot indicator */}
                        <div className="mt-1.5 shrink-0">
                          {!n.isRead ? (
                            <span className="block h-2 w-2 rounded-full bg-teal-500" />
                          ) : (
                            <span className="block h-2 w-2 rounded-full bg-transparent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold truncate ${!n.isRead ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                            {n.title}
                          </p>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                            {formatTime(n.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-[12px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
