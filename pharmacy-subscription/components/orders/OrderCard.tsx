'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Order } from '@/lib/types/order';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Order Number</p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">{order.orderNumber}</h3>
        </div>
        <StatusBadge status={order.status} size="sm" />
      </div>

      <div className="mb-6 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Date: </span>
          {new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Items: </span>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Total: </span>
          <span className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </p>
      </div>

      <button
        onClick={() => onViewDetails(order)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-green-700 active:scale-95"
      >
        <Eye size={18} />
        <span>View Details</span>
      </button>
    </div>
  );
}
