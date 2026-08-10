"use client";

import Link from "next/link";
import Image from "next/image";
import { sidebarItems } from "@/constants/dashboard";
import { SidebarProfileCard } from "@/components/dashboard/SidebarProfileCard";
import { useNotifications } from "@/components/notifications/NotificationProvider";

interface SidebarProps {
  activeHref?: string;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeHref = "/dashboard", isMobileOpen = false, onClose }: SidebarProps) {
  const { unreadCount } = useNotifications();
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 sidebar-overlay"
          onClick={onClose}
        />
      )}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-[260px] flex-col justify-between border-r border-[#E5E7EB] bg-white p-5 transition-transform duration-300 flex dark:border-slate-800 dark:bg-slate-900 translate-x-0 sidebar-nav ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div>
          <div className="flex items-center gap-3 mb-8 px-1">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image 
                src="/images/logo.png" 
                alt="PharmEasy Logo" 
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#00b386] leading-tight dark:text-[#00b386]">PharmEasy</h1>
              <p className="text-xs text-slate-500 font-medium dark:text-slate-400">User Panel</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeHref === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#00b386] text-white shadow-md"
                      : "text-slate-600 hover:bg-[#e6f7f3] hover:text-[#00b386] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#00b386]"
                  }`}
                >
                  <span className="flex w-5 items-center justify-center text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.label.trim() === "Notifications" && unreadCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-br from-[#e6f7f3] to-slate-50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00b386] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop" 
                  alt="Healthcare illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00b386]">Stay Healthy</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Stay On Track</p>
              </div>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">We remind you so you never miss your medicines.</p>
          </div>
        </div>

        <SidebarProfileCard />
      </aside>
    </>
  );
}
