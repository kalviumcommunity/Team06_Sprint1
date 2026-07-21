"use client";

import { FiBell, FiMoon } from "react-icons/fi";

export default function Header({ onMenuClick }) {
  return (
    <header className="flex h-18 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-full border border-slate-200 p-2 text-slate-700 transition duration-300 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Orders</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="rounded-full border border-slate-200 p-2.5 text-slate-600 transition duration-300 hover:bg-slate-100"
          aria-label="Toggle dark mode"
        >
          <FiMoon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="relative rounded-full border border-slate-200 p-2.5 text-slate-600 transition duration-300 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <FiBell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}
