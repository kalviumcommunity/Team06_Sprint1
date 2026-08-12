"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  Package,
  User,
  RefreshCw,
  ShieldCheck,
  X,
  ShoppingBag,
  CreditCard,
  Bell,
  Settings,
  Users,
  BarChart3
} from "lucide-react";

import { useNotifications } from "@/app/context/NotificationProvider";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (pathname: string) => boolean;
};

type PortalSidebarProps = {
  role: "USER" | "ADMIN";
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

function isExactOrNested(pathname: string, href: string) {
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

const userNav: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    match: (p) => p === "/dashboard",
  },
  {
    href: "/medicines",
    label: "Medicines",
    icon: <Pill size={20} />,
    match: (p) => isExactOrNested(p, "/medicines"),
  },
  {
    href: "/subscriptions",
    label: "Subscriptions",
    icon: <Package size={20} />,
    match: (p) => isExactOrNested(p, "/subscriptions"),
  },
  {
    href: "/orders",
    label: "Orders",
    icon: <ShoppingBag size={20} />,
    match: (p) => isExactOrNested(p, "/orders"),
  },
  {
    href: "/payments",
    label: "Payments",
    icon: <CreditCard size={20} />,
    match: (p) => isExactOrNested(p, "/payments"),
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: <Bell size={20} />,
    match: (p) => isExactOrNested(p, "/notifications"),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User size={20} />,
    match: (p) => isExactOrNested(p, "/profile"),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings size={20} />,
    match: (p) => isExactOrNested(p, "/settings"),
  },
];

const adminNav: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    match: (p) => p === "/admin/dashboard",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <Users size={20} />,
    match: (p) => isExactOrNested(p, "/admin/users"),
  },
  {
    href: "/admin/medicines",
    label: "Medicines",
    icon: <Pill size={20} />,
    match: (p) => isExactOrNested(p, "/admin/medicines"),
  },
  {
    href: "/admin/subscriptions",
    label: "Subscriptions",
    icon: <Package size={20} />,
    match: (p) => isExactOrNested(p, "/admin/subscriptions"),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: <ShoppingBag size={20} />,
    match: (p) => isExactOrNested(p, "/admin/orders"),
  },
  {
    href: "/admin/payments",
    label: "Payments",
    icon: <CreditCard size={20} />,
    match: (p) => isExactOrNested(p, "/admin/payments"),
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: <Bell size={20} />,
    match: (p) => isExactOrNested(p, "/admin/notifications"),
  },
  {
    href: "/admin/refills",
    label: "Refill",
    icon: <RefreshCw size={20} />,
    match: (p) => isExactOrNested(p, "/admin/refills"),
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: <BarChart3 size={20} />,
    match: (p) => isExactOrNested(p, "/admin/reports"),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <Settings size={20} />,
    match: (p) => isExactOrNested(p, "/admin/settings"),
  },
];

export default function PortalSidebar({
  role,
  mobileOpen = false,
  onMobileClose,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const items = role === "ADMIN" ? adminNav : userNav;

  // Role-aware accent colors
  const isAdmin = role === "ADMIN";
  const brandIcon = isAdmin
    ? "text-blue-600"
    : "text-emerald-600";
  const brandText = isAdmin
    ? "text-blue-700 dark:text-blue-400"
    : "text-emerald-700 dark:text-emerald-400";
  const activeClass = isAdmin
    ? "bg-blue-600 text-white shadow-sm"
    : "bg-emerald-600 text-white shadow-sm";

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          {role === "ADMIN" ? (
            <ShieldCheck className={`h-6 w-6 flex-shrink-0 ${brandIcon}`} />
          ) : (
            <Pill className={`h-6 w-6 flex-shrink-0 ${brandIcon}`} />
          )}
          <div className="min-w-0">
            <p className={`truncate text-sm font-extrabold ${brandText}`}>
              PharmaEase
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {role === "ADMIN" ? "Admin Portal" : "User Portal"}
            </p>
          </div>
        </div>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active = item.match
            ? item.match(pathname)
            : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? activeClass
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.label === "Notifications" && unreadCount > 0 && (
                <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white ${active ? (role === "ADMIN" ? "bg-white text-blue-600" : "bg-white text-emerald-600") : (role === "ADMIN" ? "bg-blue-600" : "bg-emerald-600")}`}>
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
