import { FiArrowRight, FiCheckCircle, FiMapPin, FiPackage, FiRefreshCw, FiXCircle } from "react-icons/fi";

const statusMeta = {
  Delivered: {
    icon: FiCheckCircle,
    classes: "bg-green-100 text-green-700",
  },
  Processing: {
    icon: FiRefreshCw,
    classes: "bg-blue-100 text-blue-700",
  },
  Cancelled: {
    icon: FiXCircle,
    classes: "bg-rose-100 text-rose-700",
  },
};

export default function OrderCard({ order, onViewDetails }) {
  const status = statusMeta[order.status] || statusMeta.Delivered;
  const Icon = status.icon;

  return (
    <article className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{order.id}</h2>
            <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${status.classes}`}>
              <Icon className="h-4 w-4" />
              {order.status}
            </span>
          </div>
          <p className="text-base text-slate-500">{order.date}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xl font-semibold text-slate-900">₹{order.price}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-5">
        <div className="space-y-3">
          {order.medicines.map((medicine) => (
            <div key={medicine} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="mt-1 rounded-full bg-slate-100 p-1.5 text-slate-500">
                <FiPackage className="h-3.5 w-3.5" />
              </span>
              <span>{medicine}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-sm text-slate-500">
          <FiMapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{order.address}</span>
        </div>
        <button
          type="button"
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition duration-300 hover:underline"
        >
          View Details
          <FiArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
