'use client';

import { OrderStatus } from '@/lib/types/order';

interface TrackingStep {
  status: OrderStatus;
  completedAt?: Date | null;
}

interface TrackingTimelineProps {
  trackingNumber: string;
  currentStatus: OrderStatus;
  steps: TrackingStep[];
}

const stepLabels: Record<OrderStatus, string> = {
  pending: 'Order Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const stepOrder: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

export default function TrackingTimeline({
  trackingNumber,
  currentStatus,
  steps,
}: TrackingTimelineProps) {
  // Determine which steps are completed based on current status
  const getStepStatus = (status: OrderStatus): 'completed' | 'current' | 'pending' => {
    const currentIndex = stepOrder.indexOf(currentStatus);
    const statusIndex = stepOrder.indexOf(status);

    if (statusIndex < currentIndex) return 'completed';
    if (statusIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Tracking</h3>

      {/* Tracking Number */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-600">Tracking Number</span>
        <code className="rounded bg-gray-100 px-3 py-1 font-mono text-sm font-medium text-gray-900">
          {trackingNumber}
        </code>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {stepOrder.map((status, index) => {
          const stepStatus = getStepStatus(status);
          const isLast = index === stepOrder.length - 1;

          return (
            <div key={status} className="flex items-start gap-4">
              {/* Circle */}
              <div className="mt-1 flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    stepStatus === 'completed'
                      ? 'border-green-500 bg-green-50'
                      : stepStatus === 'current'
                        ? 'border-green-500 bg-green-100'
                        : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      stepStatus === 'completed' || stepStatus === 'current'
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {stepStatus === 'completed' ? '✓' : index + 1}
                  </span>
                </div>
                {/* Line */}
                {!isLast && (
                  <div
                    className={`mt-2 h-12 w-1 transition-colors ${
                      stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <div className="pt-1">
                <p
                  className={`text-sm font-medium transition-colors ${
                    stepStatus === 'completed'
                      ? 'text-green-700'
                      : stepStatus === 'current'
                        ? 'text-green-600'
                        : 'text-gray-500'
                  }`}
                >
                  {stepLabels[status]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
