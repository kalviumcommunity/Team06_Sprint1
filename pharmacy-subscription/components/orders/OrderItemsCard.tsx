'use client';

import { OrderItem } from '@/lib/types/order';

interface OrderItemsCardProps {
  items: OrderItem[];
  totalAmount: number;
}

export default function OrderItemsCard({ items, totalAmount }: OrderItemsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Items</h3>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between text-gray-700">
            <span className="text-sm">
              {item.medicineName} {item.dosage && <span className="text-gray-500">({item.dosage})</span>}
            </span>
            <span className="font-medium">×{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-200" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Total</span>
        <span className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
