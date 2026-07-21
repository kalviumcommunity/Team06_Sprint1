"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title = "Dashboard" }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_34%),linear-gradient(135deg,_#f6fff9_0%,_#f8fafc_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_34%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100">
      <Sidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="ml-[260px] p-8 layout-content">
        <div className="space-y-4 w-full">
          <Navbar title={title} onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          <main className="w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
