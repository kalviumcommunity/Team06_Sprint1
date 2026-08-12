"use client";

import { useEffect, useState } from "react";
import { CreditCard, Calendar, User, Loader2, AlertCircle } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

interface Order {
  id: string;
  orderNumber: string;
}

interface Payment {
  id: string;
  amount: number;
  method: "CASH" | "CARD" | "UPI" | "NET_BANKING";
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  retryCount: number;
  createdAt: string;
  order: Order;
  user: UserDetails;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load payments");
      setPayments(data.payments || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "FAILED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "REFUNDED":
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  const getFriendlyMethod = (method: string) => {
    return method.replace("_", " ");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl font-extrabold text-blue-700 dark:text-blue-400">Admin Payments Management</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Platform Transactions</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Monitor payment statuses and methods for all customer accounts.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-slate-500 dark:text-slate-400">Loading payments...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-24 gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <CreditCard className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No Payments Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Payments will show up as users start subscribing.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-medium">
                    <th className="px-6 py-4">Payment ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Order Number</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Retries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white">
                        <div className="font-semibold">{payment.user?.firstName} {payment.user?.lastName}</div>
                        <div className="text-xs text-slate-400">{payment.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {payment.order?.orderNumber}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-blue-600 dark:text-blue-400">
                        ₹{payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {getFriendlyMethod(payment.method)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {payment.retryCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
