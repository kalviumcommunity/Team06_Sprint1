'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center border-b border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 shadow-sm md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-base font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
