"use client";

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
  { label: "Dashboard", icon: FiHome, active: false },
  { label: "Medicines", icon: FiPackage, active: false },
  { label: "Subscriptions", icon: FiRepeat, active: false },
  { label: "Orders", icon: FiShoppingBag, active: true },
  { label: "Payments", icon: FiCreditCard, active: false },
  { label: "Notifications", icon: FiBell, active: false, badge: 3 },
  { label: "Profile", icon: FiUser, active: false },
  { label: "Settings", icon: FiSettings, active: false },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-sm transition-transform duration-300 md:w-[220px] lg:w-[260px] ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-lg font-semibold text-white shadow-sm">
              P
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900">
                PharmEasy
              </p>
              <p className="text-sm font-medium text-teal-500">Smart</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition duration-300 hover:bg-slate-100 md:hidden"
            aria-label="Close navigation"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map(({ label, icon: Icon, active, badge }) => {
            const isActive = active;

            return (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition duration-300 ${
                  isActive
                    ? "bg-teal-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  {label}
                </span>
                {badge ? (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-2 text-xs font-semibold text-white">
                    {badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
