"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Calendar, MapPin, Loader2, AlertCircle } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

interface OrderItem {
  id: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  deliveryAddress: string | null;
  scheduledDate: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load orders");
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-emerald-600" />
          <h1 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">My Orders</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order History</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Track and manage your automated medicine deliveries.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="text-slate-500 dark:text-slate-400">Loading your orders…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-24 gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No Orders Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Create a subscription to receive orders.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Order Number</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{order.orderNumber}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Items</h4>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-2 flex justify-between text-sm">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">{item.medicineName}</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-2">x {item.quantity}</span>
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            ₹{(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span>Ordered: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    {order.deliveryAddress && (
                      <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span className="line-clamp-2">{order.deliveryAddress}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Amount</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
