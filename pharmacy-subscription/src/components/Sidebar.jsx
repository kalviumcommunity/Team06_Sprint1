"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBell,
  FiCreditCard,
  FiHome,
  FiPackage,
  FiRepeat,
  FiSettings,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";

const navigationItems = [
  { label: "Dashboard", icon: FiHome, href: "/" },
  { label: "Orders", icon: FiShoppingBag, href: "/orders" },
  { label: "Payments", icon: FiCreditCard, href: "/payments" },
  { label: "Subscriptions", icon: FiRepeat, href: "/payments" },
  { label: "Medicines", icon: FiPackage, href: "#" },
  { label: "Notifications", icon: FiBell, href: "#", badge: 3 },
  { label: "Profile", icon: FiUser, href: "#" },
  { label: "Settings", icon: FiSettings, href: "#" },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-6 shadow-sm transition-transform duration-300 md:w-[220px] lg:w-[260px] ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            {/* Exact uploaded logo emblem image with transparent background */}
            <img src="/logo-emblem.png" alt="PharmEasy" className="h-16 w-auto shrink-0 object-contain drop-shadow-sm" />
            <div>
              <p className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                PharmEasy
              </p>
              <p className="text-xs font-semibold text-teal-600">Pharmacy Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 dark:text-slate-400 transition duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Close navigation"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map(({ label, icon: Icon, href, badge }) => {
            const isActive = href !== "#" && pathname === href;

            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition duration-300 ${
                  isActive
                    ? "bg-teal-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                  {label}
                </span>
                {badge ? (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-2 text-xs font-semibold text-white">
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}


