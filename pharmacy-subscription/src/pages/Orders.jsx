"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import OrderCard from "../components/OrderCard";
import OrderDetailsModal from "../components/OrderDetailsModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsLoadingId, setDetailsLoadingId] = useState(null);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleViewDetails = async (order) => {
    setDetailsLoadingId(order.id);
    setDetailsError(null);

    try {
      const response = await fetch(`/api/orders/${order.id}`);
      if (!response.ok) {
        throw new Error("Unable to load order details");
      }
      const data = await response.json();
      setSelectedOrder(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load order details", error);
      setDetailsError(error.message || "Failed to load order details");
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
      <Header title="Orders" />

      <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {loading ? (
            <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-400">
              No orders found.
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
                isLoading={detailsLoadingId === order.id}
              />
            ))
          )}

          {detailsError && (
            <div className="rounded-[20px] border border-rose-200 dark:border-rose-950/30 bg-rose-50 dark:bg-rose-950/10 p-4 text-sm text-rose-700 dark:text-rose-400">
              {detailsError}
            </div>
          )}
        </div>
      </main>

      <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}


