"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useNotifications, Notification } from "@/components/notifications/NotificationProvider";
import { Package, CheckCircle2, XCircle, RefreshCw, Truck, Bell } from "lucide-react";

const getNotificationStyle = (type: string) => {
  switch (type) {
    case 'REFILL_REMINDER':
      return { icon: RefreshCw, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' };
    case 'ORDER_GENERATED':
      return { icon: Package, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' };
    case 'PAYMENT_SUCCESSFUL':
      return { icon: CheckCircle2, bg: 'bg-[#e6f7f3] dark:bg-[#00b386]/20', text: 'text-[#00b386] dark:text-[#00b386]' };
    case 'PAYMENT_FAILED':
      return { icon: XCircle, bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' };
    case 'PAYMENT_RETRY':
      return { icon: RefreshCw, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' };
    case 'ORDER_DELIVERED':
      return { icon: Truck, bg: 'bg-[#e6f7f3] dark:bg-[#00b386]/20', text: 'text-[#00b386] dark:text-[#00b386]' };
    default:
      return { icon: Bell, bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' };
  }
};

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  return (
    <DashboardLayout title="Notifications">
      <div className="w-full space-y-6">
        <PageHeader title="Notifications" showBack={true} />
        <div className="bg-gradient-to-br from-white via-[#e6f7f3]/40 to-white border border-[#00b386]/20 shadow-sm rounded-3xl p-6 dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-950 dark:border-slate-800 min-h-[calc(100vh-16rem)]">
        <div className="space-y-6">
        {unreadCount > 0 && (
          <div className="flex justify-end">
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#e6f7f3] text-[#00b386] dark:bg-[#00b386]/10 dark:text-[#00b386] font-semibold rounded-xl text-sm border border-[#00b386]/30 hover:bg-[#00b386]/20 transition-colors"
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
          <div className="flex flex-col items-center justify-center rounded-3xl p-12 text-center">
            <span className="text-6xl mb-6">✨</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No notifications available</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">You have no new or unread notifications at this time.</p>
            
            <div className="bg-white/60 dark:bg-slate-800/50 border border-[#00b386]/20 dark:border-slate-700 p-6 rounded-2xl w-full max-w-sm text-left backdrop-blur-sm">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">We'll notify you when:</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><span className="text-[#00b386]">•</span> Your refill is due</li>
                <li className="flex items-center gap-2"><span className="text-[#00b386]">•</span> Your order status changes</li>
                <li className="flex items-center gap-2"><span className="text-[#00b386]">•</span> A payment needs attention</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => {
              const style = getNotificationStyle(notification.type);
              const Icon = style.icon;
              return (
                <div 
                  key={notification.id} 
                  className={`flex flex-col sm:flex-row items-start gap-4 justify-between bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border ${notification.isRead ? 'border-slate-200/80 dark:border-slate-800' : 'border-[#00b386] dark:border-[#00b386] shadow-md'} transition-all`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${style.bg}`}>
                      <Icon className={style.text} size={24} />
                    </div>
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
                  </div>
                {!notification.isRead && (
                  <div className="flex-shrink-0 flex items-start">
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm font-semibold text-[#00b386] dark:text-[#00b386] hover:text-[#009e76] dark:hover:text-[#009e76] transition-colors"
                    >
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
