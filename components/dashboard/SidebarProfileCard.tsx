"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/components/profile/ProfileProvider";
import { ChevronUp, LogOut } from "lucide-react";

export function SidebarProfileCard() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { profile } = useProfile();

  const fullName = profile?.name || "User";
  const email = profile?.email || "user@example.com";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  const avatarInitial = fullName.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="relative mt-2" ref={dropdownRef}>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">{fullName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-1"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Main Profile Card Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 transition-colors outline-none text-left"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#00b386] text-base font-bold text-white shadow-sm">
            {avatarInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-950 dark:text-white leading-tight">{fullName}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">{email}</p>
          </div>
        </div>
        <ChevronUp 
          size={18} 
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
    </div>
  );
}
