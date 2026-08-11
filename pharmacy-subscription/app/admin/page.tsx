'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  TrendingUp,
  Package,
  AlertCircle,
} from 'lucide-react';

interface OrderSummary {
  total: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  pending: number;
}

interface PaymentSummary {
  all: number;
  success: number;
  pending: number;
  failed: number;
  retrying: number;
}

export default function AdminDashboardPage() {
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const [orderRes, paymentRes] = await Promise.all([
          fetch('/api/admin/orders?page=1&pageSize=1'),
          fetch('/api/admin/payments?page=1&pageSize=1'),
        ]);
        if (!orderRes.ok || !paymentRes.ok) throw new Error('Failed to load dashboard data');
        const [orderData, paymentData] = await Promise.all([
          orderRes.json(),
          paymentRes.json(),
        ]);
        setOrderSummary(orderData.summary);
        setPaymentSummary(paymentData.summary);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const orderCards = orderSummary
    ? [
        { label: 'Total Orders', value: orderSummary.total, icon: ShoppingBag, color: 'blue', href: '/admin/orders' },
        { label: 'Processing', value: orderSummary.processing, icon: RefreshCw, color: 'indigo', href: '/admin/orders?status=Processing' },
        { label: 'Shipped', value: orderSummary.shipped, icon: Package, color: 'amber', href: '/admin/orders?status=Shipped' },
        { label: 'Delivered', value: orderSummary.delivered, icon: CheckCircle, color: 'green', href: '/admin/orders?status=Delivered' },
        { label: 'Cancelled', value: orderSummary.cancelled, icon: XCircle, color: 'red', href: '/admin/orders?status=Cancelled' },
      ]
    : [];

  const paymentCards = paymentSummary
    ? [
        { label: 'All Payments', value: paymentSummary.all, icon: CreditCard, color: 'blue', href: '/admin/payments' },
        { label: 'Successful', value: paymentSummary.success, icon: CheckCircle, color: 'green', href: '/admin/payments?status=SUCCESS' },
        { label: 'Pending', value: paymentSummary.pending, icon: Clock, color: 'amber', href: '/admin/payments?status=PENDING' },
        { label: 'Failed', value: paymentSummary.failed, icon: XCircle, color: 'red', href: '/admin/payments?status=FAILED' },
        { label: 'Retrying', value: paymentSummary.retrying, icon: RefreshCw, color: 'purple', href: '/admin/payments?status=RETRYING' },
      ]
    : [];

  const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/30',   icon: 'text-blue-600 dark:text-blue-400',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/30', icon: 'text-indigo-600 dark:text-indigo-400', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-900/30',  icon: 'text-amber-600 dark:text-amber-400',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    red:    { bg: 'bg-red-50 dark:bg-red-900/30',    icon: 'text-red-600 dark:text-red-400',    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage and monitor all customer orders and payments across the platform.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Orders Section ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Orders Overview</h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
          >
            View All Orders →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ))
            : orderCards.map((card) => {
                const colors = colorMap[card.color];
                const Icon = card.icon;
                return (
                  <Link
                    key={card.label}
                    href={card.href}
                    className="group flex flex-col gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}>
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{card.value}</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
                    </div>
                  </Link>
                );
              })}
        </div>
      </section>

      {/* ── Payments Section ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Payments Overview</h2>
          </div>
          <Link
            href="/admin/payments"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
          >
            View All Payments →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ))
            : paymentCards.map((card) => {
                const colors = colorMap[card.color];
                const Icon = card.icon;
                return (
                  <Link
                    key={card.label}
                    href={card.href}
                    className="group flex flex-col gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}>
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{card.value}</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
                    </div>
                  </Link>
                );
              })}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/payments"
            className="group flex items-center gap-4 rounded-2xl border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Manage Payments</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">View, filter and retry customer payments</p>
            </div>
            <TrendingUp className="ml-auto h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors" />
          </Link>
          <Link
            href="/admin/orders"
            className="group flex items-center gap-4 rounded-2xl border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Manage Orders</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Update order status and track deliveries</p>
            </div>
            <TrendingUp className="ml-auto h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors" />
          </Link>
        </div>
      </section>
    </div>
  );
}
