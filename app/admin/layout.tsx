"use client";

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar/AdminSidebar';
import { AdminNavbar } from '@/components/admin-dashboard/AdminNavbar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hideNavbar = pathname === "/admin/settings" || pathname === "/admin/notifications" || pathname === "/admin/users";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col w-full overflow-hidden">
      {/* Fixed Sidebar */}
      <AdminSidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Main Content Area - Shifted Right on Desktop */}
      <main className="flex-1 w-full lg:ml-[260px] lg:w-[calc(100%-260px)] max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen">
        {!hideNavbar && (
          <div className="p-4 md:p-8 pb-0">
            <AdminNavbar onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </div>
        )}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
