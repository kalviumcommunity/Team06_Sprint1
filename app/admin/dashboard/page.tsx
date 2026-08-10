"use client";

import React, { useEffect, useState } from "react";
import StatCards from "@/components/admin-dashboard/StatCards";
import RevenueChart from "@/components/admin-dashboard/RevenueChart";
import AgeDistributionChart from "@/components/admin-dashboard/AgeDistributionChart";
import RecentUsersTable, { RecentUser } from "@/components/admin-dashboard/RecentUsersTable";

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalSubscriptions: number;
  failedPayments: number;
  recentUsers: RecentUser[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.message || "Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Failed to fetch admin dashboard summary:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 w-full flex-1 transition-colors">
      <div className="w-full px-4 md:px-8 py-6 pt-4">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}

        <StatCards data={data} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart />
          <AgeDistributionChart />
        </div>

        <RecentUsersTable users={data?.recentUsers || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
