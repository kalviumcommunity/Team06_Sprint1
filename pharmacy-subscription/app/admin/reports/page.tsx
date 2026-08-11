'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, ShoppingBag, PieChart } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RevenueTrendPoint {
  month: string;
  revenue: number;
}

interface MonthlyOrderPoint {
  month: string;
  orders: number;
}

interface CategoryPoint {
  name: string;
  count: number;
  percentage: number;
}

interface ReportsData {
  revenueTrend: RevenueTrendPoint[];
  monthlyOrders: MonthlyOrderPoint[];
  topCategories: CategoryPoint[];
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const PIE_COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatCurrency = (val: number) =>
  `₹${val >= 100000 ? `${(val / 100000).toFixed(1)}L` : val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val.toFixed(0)}`;

const formatRevenueTick = (val: number) => formatCurrency(val);

// ─── Custom Tooltip for Revenue ───────────────────────────────────────────────
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg">
        <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-base font-bold text-teal-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

// ─── Custom Tooltip for Orders ────────────────────────────────────────────────
function OrdersTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg">
        <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-base font-bold text-blue-600">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
}

// ─── Custom Pie Label ─────────────────────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percentage: number;
}) => {
  if (percentage < 5) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${percentage}%`}
    </text>
  );
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard({ height = 280 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-5 h-5 w-40 animate-pulse rounded-lg bg-slate-100" />
      <div
        className="animate-pulse rounded-xl bg-slate-100"
        style={{ height }}
      />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
      <PieChart className="h-8 w-8 opacity-40" />
      <p className="text-sm font-medium">No data available for {label}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/reports');
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json: ReportsData = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Reports &amp; Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Real-time insights from your orders, payments and medicines.
        </p>
      </div>

      {/* ── Error Banner ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Revenue Trend (full width) ────────────────────────────────────── */}
      {loading ? (
        <SkeletonCard height={300} />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
              <TrendingUp className="h-4 w-4 text-teal-600" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Revenue Trend</h2>
          </div>

          {!data?.revenueTrend?.length ? (
            <EmptyState label="Revenue Trend" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data.revenueTrend}
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatRevenueTick}
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* ── Bottom Row: Monthly Orders + Top Categories ─────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Monthly Orders */}
        {loading ? (
          <SkeletonCard height={260} />
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </span>
              <h2 className="text-base font-bold text-slate-900">Monthly Orders</h2>
            </div>

            {!data?.monthlyOrders?.length ? (
              <EmptyState label="Monthly Orders" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data.monthlyOrders}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<OrdersTooltip />} />
                  <Bar
                    dataKey="orders"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={52}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Top Categories */}
        {loading ? (
          <SkeletonCard height={260} />
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                <PieChart className="h-4 w-4 text-amber-500" />
              </span>
              <h2 className="text-base font-bold text-slate-900">Top Categories</h2>
            </div>

            {!data?.topCategories?.length ? (
              <EmptyState label="Top Categories" />
            ) : (
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                {/* Pie chart */}
                <div className="shrink-0">
                  <ResponsiveContainer width={200} height={200}>
                    <RePieChart>
                      <Pie
                        data={data.topCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="count"
                        labelLine={false}
                        label={renderPieLabel}
                      >
                        {data.topCategories.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend list */}
                <div className="flex flex-1 flex-col gap-2.5 self-center">
                  {data.topCategories.map((cat, index) => (
                    <div key={cat.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
