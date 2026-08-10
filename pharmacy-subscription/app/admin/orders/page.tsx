'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import {
  ShoppingBag,
  CheckCircle,
  RefreshCw,
  Package,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────── */
interface AdminOrderItem {
  id: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  trackingId: string | null;
  scheduledDate: string | null;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
}

interface OrderSummary {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/* ── Status config ──────────────────────────────────────────── */
const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  Pending:    { label: 'Pending',    classes: 'bg-slate-50  text-slate-700  border border-slate-200',   dot: 'bg-slate-400'  },
  Processing: { label: 'Processing', classes: 'bg-blue-50   text-blue-700   border border-blue-200',    dot: 'bg-blue-500'   },
  Shipped:    { label: 'Shipped',    classes: 'bg-amber-50  text-amber-700  border border-amber-200',   dot: 'bg-amber-500'  },
  Delivered:  { label: 'Delivered',  classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  Cancelled:  { label: 'Cancelled',  classes: 'bg-red-50    text-red-700    border border-red-200',     dot: 'bg-red-500'    },
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

const VALID_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

/* ── Summary card ───────────────────────────────────────────── */
function SummaryCard({
  label, value, icon: Icon, color, active, onClick,
}: {
  label: string; value: number; icon: React.ElementType; color: string; active: boolean; onClick: () => void;
}) {
  const colors: Record<string, { bg: string; icon: string; ring: string }> = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   ring: 'ring-blue-300'   },
    slate:  { bg: 'bg-slate-50',  icon: 'text-slate-600',  ring: 'ring-slate-300'  },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', ring: 'ring-indigo-300' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  ring: 'ring-amber-300'  },
    green:  { bg: 'bg-emerald-50',icon: 'text-emerald-600',ring: 'ring-emerald-300' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',    ring: 'ring-red-300'    },
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

/* ── Status update modal ────────────────────────────────────── */
function StatusModal({
  order,
  onClose,
  onUpdated,
}: {
  order: AdminOrder;
  onClose: () => void;
  onUpdated: (orderId: string, newStatus: string) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (selectedStatus === order.status) { onClose(); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to update status');
      onUpdated(order.id, selectedStatus);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-1 text-lg font-extrabold text-slate-900">Update Order Status</h3>
        <p className="mb-4 text-sm text-slate-500">
          Order <span className="font-mono font-semibold text-blue-700">{order.orderNumber}</span>
        </p>
        <div className="mb-4 grid grid-cols-1 gap-2">
          {VALID_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedStatus(s)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                selectedStatus === s
                  ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${statusConfig[s]?.dot ?? 'bg-slate-400'}`} />
              {s}
              {order.status === s && (
                <span className="ml-auto text-xs text-slate-400">(current)</span>
              )}
            </button>
          ))}
        </div>
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            id={`save-status-${order.id}`}
            type="button"
            onClick={handleSave}
            disabled={loading || selectedStatus === order.status}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
function AdminOrdersContent() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '10',
        status: statusFilter,
        search,
      });
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error(`Failed to load orders (${res.status})`);
      const data = await res.json();
      setOrders(data.orders);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [statusFilter, search]);

  const handleStatusUpdated = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setSuccessMsg(`Order status updated to ${newStatus}`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const summaryCards = summary
    ? [
        { label: 'Total Orders', value: summary.total, icon: ShoppingBag, color: 'blue', filterVal: 'ALL' },
        { label: 'Pending', value: summary.pending, icon: Clock, color: 'slate', filterVal: 'Pending' },
        { label: 'Processing', value: summary.processing, icon: RefreshCw, color: 'indigo', filterVal: 'Processing' },
        { label: 'Shipped', value: summary.shipped, icon: Package, color: 'amber', filterVal: 'Shipped' },
        { label: 'Delivered', value: summary.delivered, icon: CheckCircle, color: 'green', filterVal: 'Delivered' },
        { label: 'Cancelled', value: summary.cancelled, icon: XCircle, color: 'red', filterVal: 'Cancelled' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">Track and manage all customer orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {loading && !summary
          ? Array.from({ length: 6 }).map((_, i) => (
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

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          <CheckCircle className="h-5 w-5 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="order-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, user or medicine..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          id="order-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="ALL">All Status</option>
          {VALID_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="text-sm font-medium text-slate-500">Loading orders...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry Loading
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ShoppingBag className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No orders found</p>
            <p className="text-xs text-slate-400">
              {statusFilter !== 'ALL' || search
                ? 'Try adjusting your filters'
                : 'No order records exist yet'}
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Order No.', 'User', 'Items', 'Amount', 'Status', 'Scheduled', 'Created', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="group transition-colors hover:bg-blue-50/40">
                    <td className="px-4 py-4 font-mono text-xs font-bold text-blue-700">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{o.userName}</p>
                      <p className="text-xs text-slate-400">{o.userEmail}</p>
                    </td>
                    <td className="max-w-[200px] px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {o.items.slice(0, 2).map((item) => (
                          <span
                            key={item.id}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                            title={`Qty: ${item.quantity} × ₹${item.unitPrice}`}
                          >
                            {item.medicineName}
                          </span>
                        ))}
                        {o.items.length > 2 && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            +{o.items.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900">
                      ₹{o.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {o.scheduledDate
                        ? new Date(o.scheduledDate).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        id={`update-status-${o.id}`}
                        type="button"
                        onClick={() => setEditingOrder(o)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-100 active:scale-95"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Update Status
                      </button>
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
            {pagination.totalCount} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              id="orders-prev-page"
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
              id="orders-next-page"
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

      {/* Status update modal */}
      {editingOrder && (
        <StatusModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
