'use client';

import { OrderStatus } from '@/lib/types/order';

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending' },
  Pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
  Processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
  'Order Placed': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Order Placed' },
  shipped: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Shipped' },
  Shipped: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Shipped' },
  delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
  Delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
};

const sizeConfig = {
  sm: 'px-2.5 py-1 text-xs font-medium',
  md: 'px-3.5 py-1.5 text-sm font-medium',
  lg: 'px-4 py-2 text-base font-medium',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: String(status),
  };
  const sizeClass = sizeConfig[size];

  return (
    <span className={`inline-block rounded-full ${config.bg} ${config.text} ${sizeClass}`}>
      {config.label}
    </span>
  );
}
