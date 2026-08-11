"use client";

import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "../common/ThemeToggle";

type MobileNavbarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileNavbar({ open, setOpen }: MobileNavbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 lg:hidden">
      {/* Logo */}
      <Logo mobile />

      {/* Right side: theme toggle + hamburger */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </div>
  );
}