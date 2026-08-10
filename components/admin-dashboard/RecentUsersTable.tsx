"use client";

import React from "react";
import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface RecentUsersTableProps {
  users: RecentUser[];
  isLoading?: boolean;
}

export default function RecentUsersTable({ users, isLoading }: RecentUsersTableProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-blue-600 dark:text-blue-400" size={20} />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Users</h2>
        </div>
        <Link
          href="/admin/users"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <span>View All Users</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
          <Users size={36} className="text-slate-400 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">No recent users found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Newly registered users will appear here automatically.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left hidden md:table">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-4 py-4 font-medium">User</th>
                <th className="px-4 py-4 font-medium">Email</th>
                <th className="px-4 py-4 font-medium text-center">Role</th>
                <th className="px-4 py-4 font-medium text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 dark:bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {getInitials(user.name)}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{user.name || "User"}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-slate-500 dark:text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {users.map((user) => (
              <div key={user.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 dark:bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{user.name || "User"}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                    </div>
                  </div>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                    {user.role}
                  </span>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 text-right mt-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
