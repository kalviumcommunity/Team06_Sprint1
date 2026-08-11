"use client";

import Image from "next/image";
import { Subscription } from "@/types/subscription";
import RefillProgress from "./RefillProgress";
import SubscriptionTimeline from "./SubscriptionTimeline";

interface Props {
  subscription: Subscription;

  onEdit: (subscription: Subscription) => void;

  onPause: (subscription: Subscription) => void;

  onResume: (subscription: Subscription) => void;

  onCancel: (subscription: Subscription) => void;
}

export default function SubscriptionCard({
  subscription,
  onEdit,
  onPause,
  onResume,
  onCancel,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

      {/* Header */}

      <div className="flex items-center gap-5">

        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-100">

          <Image
            src={subscription.medicineImage}
            alt={subscription.medicineName}
            fill
            className="object-contain p-2"
          />

        </div>

        <div className="flex-1">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold">
              {subscription.medicineName}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                subscription.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : subscription.status === "PAUSED"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {subscription.status}
            </span>

          </div>

          <p className="mt-2 text-slate-500">

            Frequency : {subscription.frequency}

          </p>

        </div>

      </div>

      {/* Details */}

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <Info
          title="Quantity"
          value={`${subscription.quantity} Packs`}
        />

        <Info
          title="Next Refill"
          value={subscription.nextRefill}
        />

        <Info
          title="Remaining Refills"
          value={subscription.remainingRefills.toString()}
        />

        <Info
          title="Payment"
          value={subscription.paymentMethod}
        />

      </div>

      <div className="mt-6">

        <Info
          title="Delivery Address"
          value={subscription.address}
        />

      </div>

      <div className="mt-8">

        <SubscriptionTimeline
          nextRefill={subscription.nextRefill}
        />

      </div>

      <div className="mt-6">

        <RefillProgress
          progress={subscription.progress}
        />

      </div>

      <div className="mt-6 flex items-center justify-between">

        <div>

          {subscription.reminderEnabled ? (
            <span className="rounded-full bg-green-100 px-3 py-2 text-sm font-medium text-green-700">
              Reminder Enabled
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
              Reminder Disabled
            </span>
          )}

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-8 flex flex-wrap gap-3">

        <button
          onClick={() => onEdit(subscription)}
          className="rounded-xl border border-teal-600 px-5 py-3 font-semibold text-teal-600 hover:bg-teal-50"
        >
          Edit
        </button>

        <button
          onClick={() => onPause(subscription)}
          className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600"
        >
          Pause
        </button>

        <button
          onClick={() => onResume(subscription)}
          className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          Resume
        </button>

        <button
          onClick={() => onCancel(subscription)}
          className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-sm text-slate-500">

        {title}

      </p>

      <h3 className="mt-2 font-semibold">

        {value}

      </h3>

    </div>
  );
}