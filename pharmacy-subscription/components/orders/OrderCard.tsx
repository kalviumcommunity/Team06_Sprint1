'use client';

import { Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Order } from '@/lib/types/order';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  isLoading?: boolean;
}

export default function OrderCard({ order, onViewDetails, isLoading }: OrderCardProps) {
  const displayDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : order.date || '';

  const itemArray = order.items || [];
  const totalVal = order.totalAmount ?? order.price ?? 0;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Order Number</p>
          <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{order.orderNumber || order.id}</h3>
        </div>
        <StatusBadge status={order.status} size="sm" />
      </div>

      <div className="mb-6 space-y-2">
        <p className="text-sm text-gray-600 dark:text-slate-300">
          <span className="font-medium text-gray-900 dark:text-white">Date: </span>
          {displayDate}
        </p>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          <span className="font-medium text-gray-900 dark:text-white">Items: </span>
          {itemArray.length} item{itemArray.length !== 1 ? 's' : ''}
        </p>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          <span className="font-medium text-gray-900 dark:text-white">Total: </span>
          <span className="font-semibold text-gray-900 dark:text-white">₹{totalVal.toLocaleString('en-IN')}</span>
        </p>
      </div>

      <button
        onClick={() => onViewDetails(order)}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-teal-700 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        <Eye size={18} />
        <span>{isLoading ? 'Loading...' : 'View Details'}</span>
      </button>
    </div>
  );
}
