"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Medicine } from "@/types/medicine";

interface Props {
  medicine: Medicine | null;
  open: boolean;
  onClose: () => void;
  onSubscribe: (medicine: Medicine) => void;
}

export default function MedicineDetailsModal({
  medicine,
  open,
  onClose,
  onSubscribe,
}: Props) {
  if (!open || !medicine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Close Button */}

        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 transition hover:bg-slate-100"
        >
          <X size={22} />
        </button>

        <div className="grid gap-10 p-10 lg:grid-cols-2">

          {/* Left Side */}

          <div>

            <div className="relative h-96 rounded-2xl bg-slate-100">

              <Image
                src={medicine.image}
                alt={medicine.name}
                fill
                className="object-contain p-8"
              />

            </div>

          </div>

          {/* Right Side */}

          <div className="space-y-6">

            <div>

              <h1 className="text-3xl font-bold text-slate-800">
                {medicine.name}
              </h1>

              <p className="mt-2 text-slate-500">
                {medicine.category}
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <Info
                title="Manufacturer"
                value={medicine.manufacturer}
              />

              <Info
                title="Price"
                value={`₹ ${medicine.price}`}
              />

              <Info
                title="Stock"
                value={medicine.stock.toString()}
              />

              <Info
                title="Manufacturing Date"
                value={medicine.manufacturingDate}
              />

              <Info
                title="Expiry Date"
                value={medicine.expiryDate}
              />

              <Info
                title="Dosage"
                value={medicine.dosage}
              />

            </div>

            <Section
              title="Composition"
              value={medicine.composition}
            />

            <Section
              title="Side Effects"
              value={medicine.sideEffects}
            />

            <Section
              title="Storage Instructions"
              value={medicine.storage}
            />

            <button
              onClick={() => onSubscribe(medicine)}
              className="w-full rounded-xl bg-teal-600 py-4 text-lg font-semibold text-white transition hover:bg-teal-700"
            >
              Subscribe Now
            </button>

          </div>

        </div>

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

      <h3 className="mt-1 font-semibold">
        {value}
      </h3>
    </div>
  );
}

function Section({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <h2 className="font-semibold text-slate-800">
        {title}
      </h2>

      <p className="mt-2 text-slate-600">
        {value}
      </p>
    </div>
  );
}