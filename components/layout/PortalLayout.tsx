"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import PortalSidebar from "./PortalSidebar";

type PortalLayoutProps = {
  children: React.ReactNode;
  role: "USER" | "ADMIN";
};

export default function PortalLayout({ children, role }: PortalLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <PortalSidebar
        role={role}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile menu trigger — fixed so it works on every portal page */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={`fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg lg:hidden transition ${role === "ADMIN" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
