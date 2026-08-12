"use client";

import { useNotifications } from "@/app/context/NotificationProvider";
import { Bell, CheckCircle2, Calendar, Trash, Check, Loader2, AlertCircle } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "SUBSCRIPTION_CREATED":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "REFILL_REMINDER":
        return <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getBg = (type: string, isRead: boolean) => {
    if (isRead) return "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800";
    switch (type) {
      case "SUBSCRIPTION_CREATED":
        return "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30";
      case "REFILL_REMINDER":
        return "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30";
      default:
        return "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-600" />
          <h1 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">Notifications</h1>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 transition"
            >
              <Check size={14} /> Mark all as read
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inbox</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Keep track of your subscription statuses and upcoming medicine refills.
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <Bell className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">All Caught Up</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">No new notifications at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${getBg(notification.type, notification.isRead)}`}
              >
                <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`text-sm font-semibold truncate ${notification.isRead ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                      {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${notification.isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-600 dark:text-slate-300"}`}>
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition self-center"
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
