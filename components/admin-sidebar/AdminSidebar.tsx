"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { 
  LayoutDashboard, 
  Users, 
  Pill, 
  Package, 
  ClipboardList, 
  CreditCard, 
  Bell, 
  RefreshCw,
  BarChart, 
  Settings,
  LogOut,
  ChevronUp
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Medicines', href: '/admin/medicines', icon: Pill },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Refill', href: '/admin/refill', icon: RefreshCw },
  { name: 'Reports', href: '/admin/reports', icon: BarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isMobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminName, setAdminName] = useState<string>("Admin User");
  const [adminEmail, setAdminEmail] = useState<string>("admin@pharmeasy.com");
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAdminProfile() {
      try {
        const res = await fetch('/api/admin/profile');
        const json = await res.json();
        if (json.success && json.data) {
          setAdminName(json.data.name || "Admin User");
          setAdminEmail(json.data.email || "admin@pharmeasy.com");
        }
      } catch (error) {
        console.error("Failed to load admin profile for sidebar:", error);
      }
    }
    loadAdminProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-[260px] bg-white border-r border-slate-200/80 transition-transform duration-300 flex flex-col dark:bg-slate-900 dark:border-slate-800 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200/80 dark:border-slate-800">
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
            <h1 className="text-lg font-bold text-slate-900 leading-tight dark:text-white">PharmEasy</h1>
            <p className="text-xs text-slate-500 font-medium dark:text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-400'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'} />
                {item.name}
                {item.name === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 relative" ref={profileRef}>
          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute bottom-[80px] left-4 right-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-2 space-y-1">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white leading-tight">{adminName}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">{adminEmail}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Profile Button */}
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{adminName}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{adminEmail}</span>
              </div>
            </div>
            <ChevronUp 
              size={18} 
              className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </aside>
    </>
  );
}
