'use client';

import { useState, useCallback } from 'react';
import { Order } from '@/lib/types/order';
import OrderCard from './OrderCard';
import OrderDetailsModal from './OrderDetailsModal';

interface OrderListWithModalProps {
  orders: Order[];
}

export default function OrderListWithModal({ orders }: OrderListWithModalProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewDetails = useCallback(async (order: Order) => {
    setSelectedOrder(order);
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Fetch order details from backend
      // const response = await fetch(`/api/orders/${order.id}`);
      // if (!response.ok) throw new Error('Failed to fetch order details');
      // const data = await response.json();
      // setSelectedOrder(data);

      // For now, use the order passed from the list
      setIsLoading(false);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order details');
      setIsLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (selectedOrder) {
      handleViewDetails(selectedOrder);
    }
  }, [selectedOrder, handleViewDetails]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setError(null);
  }, []);

  return (
    <>
      {/* Orders Grid */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
      />
    </>
  );
}
