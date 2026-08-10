"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiX, FiDownload, FiTruck, FiMapPin, FiCheck, FiCreditCard } from 'react-icons/fi';

const statusColors = {
  Delivered: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30',
  Processing: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30',
  Shipped: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30',
  'Order Placed': 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30',
  Pending: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  Cancelled: 'bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30',
};

const trackingSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !order) return null;

  // Active timeline step calculation based on database status
  const getTrackingProgress = () => {
    const statusMap = {
      'Order Placed': 0,
      Pending: 0,
      Processing: 1,
      Shipped: 2,
      Delivered: 3,
      Cancelled: 0,
    };
    const s = order.status || 'Processing';
    return statusMap[s] !== undefined ? statusMap[s] : 1;
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/invoice`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to download invoice');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.orderNumber || order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const progress = getTrackingProgress();
  const displayOrderNumber = order.orderNumber || order.id;
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-6 py-5 backdrop-blur flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">View complete order info and tracking status</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Order Info Bar */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 p-4 border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order Number</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{displayOrderNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order Date</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{order.date}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</p>
              <div className="mt-1">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] || statusColors.Processing}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm tracking-wide uppercase text-slate-500 dark:text-slate-400">Items Ordered</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.medicineName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">₹{(item.price || item.unitPrice * item.quantity).toFixed(2)}</p>
                      {item.unitPrice && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">₹{item.unitPrice} each</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                order.medicines?.map((med, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-sm">
                    <p className="font-medium text-slate-900 dark:text-white">{med}</p>
                  </div>
                ))
              )}
            </div>
            {/* Total Section */}
            <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-350">Grand Total</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{order.price ?? order.totalAmount}</span>
            </div>
          </div>

          {/* Tracking Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiTruck className="text-teal-600 dark:text-teal-400 h-5 w-5" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm tracking-wide uppercase text-slate-500 dark:text-slate-400">Tracking Status</h3>
              </div>
              {order.trackingId && (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  Tracking ID: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{order.trackingId}</span>
                </span>
              )}
            </div>
            
            {/* Dynamic Step Timeline */}
            <div className="py-3">
              <div className="grid grid-cols-4 gap-2">
                {trackingSteps.map((step, idx) => {
                  const isCompleted = !isCancelled && idx <= progress;
                  const isCurrent = !isCancelled && idx === progress;

                  return (
                    <div key={step} className="flex flex-col items-center text-center">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCancelled
                            ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30'
                            : isCompleted
                            ? 'bg-teal-500 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isCompleted ? <FiCheck className="h-5 w-5 stroke-[3]" /> : idx + 1}
                      </div>
                      <p className={`mt-2 text-xs font-semibold ${isCurrent ? 'text-teal-600 dark:text-teal-400' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4">
            <FiMapPin className="mt-0.5 text-teal-600 dark:text-teal-400 shrink-0 h-5 w-5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Delivery Address</p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{order.address || order.deliveryAddress}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-teal-600 dark:border-teal-500 px-4 py-3.5 font-semibold text-teal-600 dark:text-teal-400 transition duration-300 hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm cursor-pointer"
            >
              <FiDownload size={18} />
              {isDownloading ? 'Generating...' : 'Download Invoice'}
            </button>
            <Link
              href={`/payments?orderId=${displayOrderNumber}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3.5 font-semibold text-white transition duration-300 hover:bg-teal-700 shadow-sm text-sm"
            >
              <FiCreditCard size={18} />
              <span>Payment Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

