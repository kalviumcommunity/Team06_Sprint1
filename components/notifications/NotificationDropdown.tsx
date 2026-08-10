"use client";

import { useEffect, useRef, useState } from "react";
import type { NotificationItem } from "@/types/dashboard";
import { Button } from "@/components/common/Button";

interface NotificationDropdownProps {
  items: NotificationItem[];
}

export function NotificationDropdown({ items }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(items);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#00b386] hover:text-[#00b386] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        🔔
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#00b386]">Inbox</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Latest Notifications</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setNotifications((prev) => prev.map((item) => ({ ...item, unread: false }))) }>
              Mark all read
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
                  </div>
                  {item.unread ? <span className="h-2.5 w-2.5 rounded-full bg-[#00b386]" /> : null}
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
