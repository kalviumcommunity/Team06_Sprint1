'use client';

import { OrderStatus } from '@/lib/types/order';

interface TrackingStep {
  status: OrderStatus;
  completedAt?: Date | string | null;
}

interface TrackingTimelineProps {
  trackingNumber: string;
  currentStatus: OrderStatus | string;
  steps?: TrackingStep[];
}

const displaySteps = [
  { key: 'Order Placed', label: 'Order Placed' },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
];

export default function TrackingTimeline({
  trackingNumber,
  currentStatus,
}: TrackingTimelineProps) {
  const normalizedStatus = String(currentStatus).toLowerCase();
  
  const getStepIndex = (status: string) => {
    if (status.includes('placed') || status.includes('pending')) return 0;
    if (status.includes('processing')) return 1;
    if (status.includes('shipped')) return 2;
    if (status.includes('delivered')) return 3;
    return 1;
  };

  const currentIndex = getStepIndex(normalizedStatus);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Tracking</h3>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-600">Tracking Number</span>
        <code className="rounded bg-gray-100 px-3 py-1 font-mono text-sm font-medium text-gray-900">
          {trackingNumber}
        </code>
      </div>

      <div className="space-y-4">
        {displaySteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === displaySteps.length - 1;

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="mt-1 flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'border-green-500 bg-green-50'
                      : isCurrent
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`mt-2 h-12 w-1 transition-colors ${
                      index < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>

              <div className="pt-1">
                <p
                  className={`text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'text-green-700 font-semibold'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
