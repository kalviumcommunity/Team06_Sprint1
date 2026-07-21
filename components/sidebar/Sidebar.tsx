"use client";

import Link from "next/link";
import { sidebarItems } from "@/constants/dashboard";
import { SidebarProfileCard } from "@/components/dashboard/SidebarProfileCard";

interface SidebarProps {
  activeHref?: string;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeHref = "/dashboard", isMobileOpen = false, onClose }: SidebarProps) {
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
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-semibold text-white">P</div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">PharmEasy</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Subscription</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = activeHref === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                  {item.label.trim() === "Notifications" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">3</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-br from-emerald-50 to-slate-50 p-4 dark:border-slate-800 dark:from-emerald-950/30 dark:to-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop" 
                  alt="Healthcare illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Stay Healthy</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Stay On Track</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">We remind you so you never miss your medicines.</p>
          </div>
        </div>

        <SidebarProfileCard />
      </aside>
    </>
  );
}
