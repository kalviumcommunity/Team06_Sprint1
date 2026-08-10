'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────── */
interface AdminPayment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId: string | null;
  orderNumber: string | null;
  medicines: string[];
  amount: number;
  method: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'RETRYING';
  retryCount: number;
  createdAt: string;
}

interface PaymentSummary {
  all: number;
  success: number;
  pending: number;
  failed: number;
  retrying: number;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/* ── Status config ──────────────────────────────────────────── */
const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  SUCCESS:  { label: 'Success',  classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  PENDING:  { label: 'Pending',  classes: 'bg-amber-50   text-amber-700   border border-amber-200',   dot: 'bg-amber-500'   },
  FAILED:   { label: 'Failed',   classes: 'bg-red-50     text-red-700     border border-red-200',     dot: 'bg-red-500'     },
  RETRYING: { label: 'Retrying', classes: 'bg-purple-50  text-purple-700  border border-purple-200',  dot: 'bg-purple-500'  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, classes: 'bg-slate-100 text-slate-600 border border-slate-200', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ── Summary card ───────────────────────────────────────────── */
function SummaryCard({
  label, value, icon: Icon, color, active, onClick,
}: {
  label: string; value: number; icon: React.ElementType; color: string; active: boolean; onClick: () => void;
}) {
  const colors: Record<string, { bg: string; icon: string; ring: string }> = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   ring: 'ring-blue-300'   },
    green:  { bg: 'bg-emerald-50',icon: 'text-emerald-600',ring: 'ring-emerald-300' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  ring: 'ring-amber-300'  },
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',    ring: 'ring-red-300'    },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'ring-purple-300' },
  };
  const c = colors[color] ?? colors.blue;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-3 rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        active ? `ring-2 ${c.ring} border-transparent` : 'border-slate-200/80'
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
        <Icon className={`h-5 w-5 ${c.icon}`} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="mt-0.5 text-xs font-semibold text-slate-500">{label}</p>
      </div>
    </button>
  );
}

/* ── Main component ─────────────────────────────────────────── */
function AdminPaymentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [retryMsg, setRetryMsg] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  const [search, setSearch] = useState(searchParams?.get('search') ?? '');
  const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') ?? 'ALL');
  const [page, setPage] = useState(1);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '10',
        status: statusFilter,
        search,
      });
      const res = await fetch(`/api/admin/payments?${params}`);
      if (!res.ok) throw new Error(`Failed to load payments (${res.status})`);
      const data = await res.json();
      setPayments(data.payments);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load payments');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [statusFilter, search]);

  const handleRetry = async (paymentId: string) => {
    setRetrying(paymentId);
    setRetryMsg(null);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/retry`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setRetryMsg({ id: paymentId, success: false, msg: data.error ?? 'Retry failed' });
      } else {
        setRetryMsg({ id: paymentId, success: true, msg: data.message ?? 'Retry initiated' });
        // Refresh list after a short delay to show RETRYING status
        setTimeout(() => fetchPayments(), 800);
      }
    } catch {
      setRetryMsg({ id: paymentId, success: false, msg: 'Network error during retry' });
    } finally {
      setRetrying(null);
    }
  };

  const summaryCards = summary
    ? [
        { label: 'All Payments', value: summary.all, icon: CreditCard, color: 'blue', filterVal: 'ALL' },
        { label: 'Successful', value: summary.success, icon: CheckCircle, color: 'green', filterVal: 'SUCCESS' },
        { label: 'Pending', value: summary.pending, icon: Clock, color: 'amber', filterVal: 'PENDING' },
        { label: 'Failed', value: summary.failed, icon: XCircle, color: 'red', filterVal: 'FAILED' },
        { label: 'Retrying', value: summary.retrying, icon: RefreshCw, color: 'purple', filterVal: 'RETRYING' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-slate-500">Manage and monitor all customer payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {loading && !summary
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            ))
          : summaryCards.map((c) => (
              <SummaryCard
                key={c.label}
                label={c.label}
                value={c.value}
                icon={c.icon}
                color={c.color}
                active={statusFilter === c.filterVal}
                onClick={() => setStatusFilter(c.filterVal)}
              />
            ))}
      </div>

      {/* Retry message banner */}
      {retryMsg && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${
            retryMsg.success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {retryMsg.success ? (
            <CheckCircle className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          {retryMsg.msg}
          <button
            type="button"
            className="ml-auto text-xs opacity-60 hover:opacity-100"
            onClick={() => setRetryMsg(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="payment-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, payment ID or order number..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          id="payment-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="ALL">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="RETRYING">Retrying</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="text-sm font-medium text-slate-500">Loading payments...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              onClick={fetchPayments}
              className="mt-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && payments.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <CreditCard className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No payments found</p>
            <p className="text-xs text-slate-400">
              {statusFilter !== 'ALL' || search
                ? 'Try adjusting your filters'
                : 'No payment records exist yet'}
            </p>
          </div>
        )}

        {/* Table rows */}
        {!loading && !error && payments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Payment ID', 'User', 'Order', 'Medicines', 'Amount', 'Method', 'Status', 'Date', 'Retries', 'Action'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className="group transition-colors hover:bg-blue-50/40"
                  >
                    <td className="px-4 py-4 font-mono text-xs font-semibold text-blue-700">
                      {p.id.slice(0, 12)}…
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{p.userName}</p>
                      <p className="text-xs text-slate-400">{p.userEmail}</p>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-600">
                      {p.orderNumber ?? '—'}
                    </td>
                    <td className="max-w-[180px] px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.medicines.length > 0
                          ? p.medicines.slice(0, 2).map((m, i) => (
                              <span
                                key={i}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                              >
                                {m}
                              </span>
                            ))
                          : <span className="text-xs text-slate-400">—</span>}
                        {p.medicines.length > 2 && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            +{p.medicines.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {p.method}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-bold ${
                          p.retryCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.retryCount}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {(p.status === 'FAILED' || p.status === 'RETRYING') && p.retryCount < 3 ? (
                        <button
                          id={`retry-btn-${p.id}`}
                          type="button"
                          onClick={() => handleRetry(p.id)}
                          disabled={retrying === p.id}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                        >
                          <RotateCcw className={`h-3.5 w-3.5 ${retrying === p.id ? 'animate-spin' : ''}`} />
                          {retrying === p.id ? 'Retrying…' : 'Retry'}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{' '}
            {pagination.totalCount} payments
          </p>
          <div className="flex items-center gap-2">
            <button
              id="payments-prev-page"
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-blue-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-xl text-sm font-bold transition ${
                  page === p
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-blue-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              id="payments-next-page"
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-blue-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      }
    >
      <AdminPaymentsContent />
    </Suspense>
  );
}
