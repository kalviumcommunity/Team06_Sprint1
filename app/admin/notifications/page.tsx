"use client";

import { useNotifications } from "@/components/notifications/NotificationProvider";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminNotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 w-full flex-1 transition-colors">
      <div className="w-full px-4 md:px-8 py-6">
        <div className="space-y-6">
          <PageHeader title="Notifications" />
          <div className="space-y-6">
            {unreadCount > 0 && (
              <div className="flex justify-end">
                <button 
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-semibold rounded-xl text-sm border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 p-6 rounded-[1.5rem] shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Error</h2>
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-slate-200/80 dark:border-slate-800">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : !error && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 p-12 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] text-center">
              <span className="text-6xl mb-4 opacity-50">📭</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notifications available</h2>
              <p className="text-slate-500 dark:text-slate-400">System is up to date.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border ${notification.isRead ? 'border-slate-200/80 dark:border-slate-800' : 'border-blue-300 dark:border-blue-700 shadow-md'} transition-all`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-bold ${notification.isRead ? 'text-slate-700 dark:text-slate-200' : 'text-slate-900 dark:text-white'}`}>
                        {notification.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {notification.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="flex-shrink-0 flex items-start">
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
