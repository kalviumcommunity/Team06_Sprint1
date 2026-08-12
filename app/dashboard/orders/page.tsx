'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/src/components/Header';
import OrderCard from '@/src/components/OrderCard';
import OrderDetailsModal from '@/src/components/OrderDetailsModal';

type OrderItem = {
  id: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  price?: number;
};

type Order = {
  id: string;
  orderNumber?: string;
  date: string;
  orderDate?: string;
  status: string;
  price: number;
  totalAmount?: number;
  address: string;
  deliveryAddress?: string;
  trackingId?: string;
  medicines: string[];
  items?: OrderItem[];
};

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsLoadingId, setDetailsLoadingId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const queryOrderId = searchParams ? searchParams.get('orderId') : null;

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error(`Failed to load orders (${response.status})`);
      }
      const data: Order[] = await response.json();
      setOrders(data);

      // Auto open modal if orderId passed in URL
      if (queryOrderId && data.length > 0) {
        const found = data.find(
          (o) => o.id === queryOrderId || o.orderNumber === queryOrderId
        );
        if (found) {
          setSelectedOrder(found);
          setIsModalOpen(true);
        }
      }
    } catch (err) {
      console.error('Failed to load orders', err);
      setError(err instanceof Error ? err.message : 'Unable to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewDetails = async (order: Order) => {
    setDetailsLoadingId(order.id);
    try {
      const response = await fetch(`/api/orders/${order.id}`);
      if (!response.ok) {
        throw new Error('Unable to load order details');
      }
      const data = await response.json();
      setSelectedOrder(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to load order details', err);
      setSelectedOrder(order);
      setIsModalOpen(true);
    } finally {
      setDetailsLoadingId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Header with Navigation Tabs */}
      <Header title="Orders" />

      {/* Main Content Area */}
      <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-center rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-slate-500 dark:text-slate-400 shadow-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading your orders...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-[20px] border border-rose-200 dark:border-rose-950/30 bg-rose-50 dark:bg-rose-950/10 p-6 text-center shadow-sm">
              <p className="text-base font-semibold text-rose-800 dark:text-rose-400">{error}</p>
              <button
                onClick={loadOrders}
                className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-95 cursor-pointer"
              >
                Retry Loading
              </button>
            </div>
          )}

          {/* Empty Orders State */}
          {!loading && !error && orders.length === 0 && (
            <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400 shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Orders Found</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">You haven't placed any subscription orders yet.</p>
            </div>
          )}

          {/* Populated Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewDetails}
                  isLoading={detailsLoadingId === order.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}


export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}

