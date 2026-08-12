"use client";

import Image from "next/image";
import { Medicine } from "@/types/medicine";

interface MedicineCardProps {
  medicine: Medicine;
  onViewDetails: (medicine: Medicine) => void;
  onSubscribe: (medicine: Medicine) => void;
}

export default function MedicineCard({
  medicine,
  onViewDetails,
  onSubscribe,
}: MedicineCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Medicine Image */}

      <div className="relative h-52 w-full bg-slate-100">
        <Image
          src={medicine.image}
          alt={medicine.name}
          fill
          className="object-contain p-5"
        />
      </div>

      {/* Card Body */}

      <div className="space-y-3 p-5">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {medicine.name}
            </h2>

            <p className="text-sm text-slate-500">
              {medicine.category}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              medicine.stock > 20
                ? "bg-green-100 text-green-700"
                : medicine.stock > 0
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {medicine.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Manufacturer
          </p>

          <p className="font-medium text-slate-700">
            {medicine.manufacturer}
          </p>

        </div>

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Price
            </p>

            <h3 className="text-xl font-bold text-teal-600">
              ₹ {medicine.price}
            </h3>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-500">
              Stock
            </p>

            <h3 className="font-semibold">
              {medicine.stock}
            </h3>

          </div>

        </div>

        {/* Buttons */}

        <div className="flex gap-3 pt-2">

          <button
            onClick={() => onViewDetails(medicine)}
            className="flex-1 rounded-xl border border-teal-500 py-3 font-semibold text-teal-600 transition hover:bg-teal-50"
          >
            View Details
          </button>

          <button
            onClick={() => onSubscribe(medicine)}
            className="flex-1 rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700"
          >
            Subscribe
          </button>

        </div>

      </div>

    </div>
  );
}