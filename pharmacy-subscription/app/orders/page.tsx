'use client';

import { useEffect, useState } from 'react';
import Header from '@/src/components/Header';
import Sidebar from '@/src/components/Sidebar';
import OrderCard from '@/src/components/OrderCard';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen md:pl-[220px] lg:pl-[260px]">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {loading ? (
              <div className="rounded-[20px] border border-slate-200 bg-white p-8 text-center text-slate-500">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-[20px] border border-slate-200 bg-white p-8 text-center text-slate-500">
                No orders found.
              </div>
            ) : (
              orders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
