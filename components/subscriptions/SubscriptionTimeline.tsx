"use client";

interface Props {
  nextRefill: string;
}

export default function SubscriptionTimeline({
  nextRefill,
}: Props) {
  return (
    <div className="rounded-xl bg-teal-50 p-4">

      <h3 className="font-semibold text-teal-700">
        Next Scheduled Refill
      </h3>

      <p className="mt-2 text-lg font-bold">
        {nextRefill}
      </p>

    </div>
  );
}