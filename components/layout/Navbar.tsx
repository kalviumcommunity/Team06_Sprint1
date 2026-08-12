"use client";

import { useState } from "react";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-lg shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
      <DesktopNavbar />

      <MobileNavbar
        open={open}
        setOpen={setOpen}
      />

      {open && (
        <MobileMenu
          setOpen={setOpen}
        />
      )}
    </nav>
  );
}