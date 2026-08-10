"use client";

import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiCreditCard, FiMapPin, FiPackage, FiRefreshCw, FiTruck, FiXCircle } from "react-icons/fi";

const statusMeta = {
  Delivered: {
    icon: FiCheckCircle,
    classes: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30",
  },
  Processing: {
    icon: FiRefreshCw,
    classes: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30",
  },
  Shipped: {
    icon: FiTruck,
    classes: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30",
  },
  Pending: {
    icon: FiRefreshCw,
    classes: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  },
  Cancelled: {
    icon: FiXCircle,
    classes: "bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30",
  },
};

export default function OrderCard({ order, onViewDetails, isLoading }) {
  const statusKey = order.status || "Processing";
  const status = statusMeta[statusKey] || statusMeta.Processing;
  const Icon = status.icon;

  const displayOrderNumber = order.orderNumber || order.id;

  return (
    <article className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
      {/* Header Row: Top Left (Order Number, Status Badge, Date) & Top Right (Total Amount) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{displayOrderNumber}</h2>
            <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${status.classes}`}>
              <Icon className="h-4 w-4" />
              {statusKey}
            </span>
          </div>
          <p className="text-base text-slate-500 dark:text-slate-400">{order.date}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1">
          <p className="text-xl font-semibold text-slate-900 dark:text-white">₹{order.price ?? order.totalAmount}</p>
          <Link
            href={`/payments?orderId=${displayOrderNumber}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
          >
            <FiCreditCard className="h-3.5 w-3.5" />
            <span>Payment Info</span>
          </Link>
        </div>
      </div>

      {/* Middle Section: Medicine List & Quantity */}
      <div className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-5">
        <div className="space-y-3">
          {order.items && order.items.length > 0
            ? order.items.map((item) => (
                <div key={item.id || item.medicineName} className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-500 dark:text-slate-400">
                      <FiPackage className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">{item.medicineName}</span>
                  </div>
                  <div className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Qty: {item.quantity}
                  </div>
                </div>
              ))
            : order.medicines?.map((medicine, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-500 dark:text-slate-400">
                    <FiPackage className="h-3.5 w-3.5" />
                  </span>
                  <span>{medicine}</span>
                </div>
              ))}
        </div>
      </div>

      {/* Bottom Section: Bottom Left (Delivery Address) & Bottom Right (View Details Button) */}
      <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
          <FiMapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{order.address || order.deliveryAddress}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 text-sm font-semibold transition duration-300 cursor-pointer ${
              isLoading ? 'cursor-not-allowed text-slate-400 dark:text-slate-500' : 'text-teal-600 dark:text-teal-400 hover:underline hover:text-teal-700 dark:hover:text-teal-300'
            }`}
          >
            {isLoading ? 'Loading...' : 'View Details'}
            {!isLoading && <FiArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}

