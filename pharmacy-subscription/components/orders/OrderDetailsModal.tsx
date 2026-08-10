'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { OrderDetailsModalProps } from '@/lib/types/order';
import StatusBadge from './StatusBadge';
import OrderItemsCard from './OrderItemsCard';
import TrackingTimeline from './TrackingTimeline';
import DownloadInvoiceButton from './DownloadInvoiceButton';

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  isLoading = false,
  error = null,
  onRetry,
}: OrderDetailsModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayDate = order?.orderDate
    ? new Date(order.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : order?.date || '';

  const trackingNum = order?.tracking?.trackingNumber || order?.trackingId || `TRK-${order?.orderNumber || order?.id}`;
  const trackingSteps = order?.tracking?.steps;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-4 max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
                <p className="text-gray-600">Loading order details...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <p className="mb-4 text-center text-red-700">{error}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mx-auto block rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-colors hover:bg-red-700"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {!isLoading && !error && order && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Order Number
                      </p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{order.orderNumber || order.id}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{displayDate}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={order.status} size="md" />
                      </div>
                    </div>
                  </div>
                </div>

                <OrderItemsCard items={order.items || []} totalAmount={order.totalAmount || order.price || 0} />

                <TrackingTimeline
                  trackingNumber={trackingNum}
                  currentStatus={order.status}
                  steps={trackingSteps}
                />

                <DownloadInvoiceButton
                  orderId={order.id}
                  isLoading={isDownloading}
                  onClick={async (orderId) => {
                    setIsDownloading(true);
                    try {
                      await handleDownloadInvoice(orderId);
                    } finally {
                      setIsDownloading(false);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function handleDownloadInvoice(orderId: string): Promise<void> {
  try {
    const response = await fetch(`/api/orders/${orderId}/invoice`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Failed to download invoice');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to download invoice:', error);
    alert('Failed to download invoice. Please try again.');
  }
}
