import { useState } from 'react';
import { FiX, FiDownload, FiTruck, FiMapPin } from 'react-icons/fi';

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-gray-100 text-gray-700',
};

const trackingSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !order) return null;

  const getTrackingProgress = () => {
    const statusMap = {
      Pending: 0,
      Processing: 1,
      Shipped: 2,
      Delivered: 3,
      Cancelled: 3,
    };
    return statusMap[order.status] || 0;
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
      a.download = `invoice-${order.id}.pdf`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order Number</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{order.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{order.date}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
              <div className="mt-2">
                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusColors[order.status] || statusColors.Pending}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Items</h3>
            <div className="space-y-3">
              {order.medicines.map((medicine, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm text-slate-700">
                  <span>{medicine}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between">
              <span className="text-slate-600">Total</span>
              <span className="text-xl font-bold text-slate-900">₹{order.price}</span>
            </div>
          </div>

          {/* Tracking Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiTruck className="text-slate-600" />
              <h3 className="font-semibold text-slate-900">Tracking</h3>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-2">
                {trackingSteps.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        idx <= progress
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx <= progress ? '✓' : idx + 1}
                    </div>
                    <p className="mt-2 text-xs font-medium text-center text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
              
              {/* Connection Lines */}
              <div className="flex gap-2 mt-3 px-5">
                {trackingSteps.map((_, idx) => {
                  if (idx === trackingSteps.length - 1) return null;
                  return (
                    <div
                      key={`line-${idx}`}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        idx < progress ? 'bg-green-500' : 'bg-slate-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <FiMapPin className="mt-1 text-slate-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery Address</p>
              <p className="mt-2 text-slate-900">{order.address}</p>
            </div>
          </div>

          {/* Download Invoice Button */}
          <button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-teal-600 px-6 py-3 font-semibold text-teal-600 transition duration-300 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload size={18} />
            {isDownloading ? 'Downloading...' : 'Download Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
}
