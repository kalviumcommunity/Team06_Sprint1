"use client";

import React, { useState, createContext, useContext } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { usePathname } from "next/navigation";

interface MobileMenuContextType {
  isMobileOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType>({
  isMobileOpen: false,
  toggleMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title = "Dashboard" }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hideNavbar = pathname === "/dashboard/settings" || pathname === "/dashboard/notifications" || pathname === "/dashboard/profile";

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <MobileMenuContext.Provider
      value={{
        isMobileOpen: isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,179,134,0.12),_transparent_34%),linear-gradient(135deg,_#f6fff9_0%,_#f8fafc_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,179,134,0.14),_transparent_34%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100 flex flex-col w-full overflow-x-hidden">
        <Sidebar activeHref={pathname} isMobileOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        <main className="flex-1 w-full lg:ml-[260px] lg:w-[calc(100%-260px)] max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen layout-content">
          <div className="w-full px-4 md:px-8 py-6 space-y-4 flex-1">
            {!hideNavbar && <Navbar title={title} onMobileMenuToggle={toggleMobileMenu} />}
            <div className="w-full">{children}</div>
          </div>
        </main>
      </div>
    </MobileMenuContext.Provider>
  );
}
