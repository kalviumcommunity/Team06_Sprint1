'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  Users,
  Pill,
  RefreshCw,
  Settings,
  X,
  ShieldCheck,
  Bell,
  BarChart2,
} from 'lucide-react';

const adminNav = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Medicines', icon: Pill, href: '/admin/medicines' },
  { label: 'Subscriptions', icon: RefreshCw, href: '/admin/subscriptions' },
  { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
  { label: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { label: 'Reports', icon: BarChart2, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-blue-100 bg-white shadow-xl transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-blue-50 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-md">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                PharmEasy
              </p>
              <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                Admin Portal
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Main Menu
          </p>
          {adminNav.map(({ label, icon: Icon, href }) => {
            const isActive =
              pathname ? (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)) : false;

            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-50 px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
              <ShoppingBag className="h-3.5 w-3.5" />
            </span>
            Switch to User View
          </Link>
        </div>
      </aside>
    </>
  );
}
