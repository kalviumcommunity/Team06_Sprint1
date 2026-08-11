"use client";

import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "../common/ThemeToggle";

export default function DesktopNavbar() {
  return (
    <div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-4 lg:flex">
      {/* Left */}
      <div className="flex flex-1 justify-start">
        <Logo />
      </div>

      {/* Center */}
      <div className="flex items-center justify-center gap-8">
        <Link href="/" className="font-medium text-slate-700 transition hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400">
          Home
        </Link>
        <Link href="/#features" className="font-medium text-slate-700 transition hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400">
          Features
        </Link>
        <Link href="/#how" className="font-medium text-slate-700 transition hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400">
          How It Works
        </Link>
        <Link href="/#demo" className="font-medium text-slate-700 transition hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400">
          Demo
        </Link>
        <Link href="/#faq" className="font-medium text-slate-700 transition hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400">
          FAQ
        </Link>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-3">
        <ThemeToggle />
        <Link
          href="/login"
          className="font-semibold text-teal-600 transition hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
}