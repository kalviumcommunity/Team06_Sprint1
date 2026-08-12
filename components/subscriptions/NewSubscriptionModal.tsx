"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (subscription: {
    medicine: string;
    frequency: string;
    quantity: number;
    paymentMethod: string;
    address: string;
  }) => void;
}

export default function NewSubscriptionModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [medicine, setMedicine] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [address, setAddress] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onCreate({
      medicine,
      frequency,
      quantity,
      paymentMethod,
      address,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            New Subscription
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X />
          </button>

        </div>

        <div className="space-y-6">

          <div>

            <label className="mb-2 block font-medium">
              Medicine
            </label>

            <select
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Select Medicine</option>
              <option>Paracetamol 500mg</option>
              <option>Vitamin C</option>
              <option>Insulin</option>
              <option>Aspirin</option>
            </select>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Frequency
              </label>

              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-xl border p-3"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Quantity
              </label>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
                className="w-full rounded-xl border p-3"
              >
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Cash on Delivery</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Delivery Address
              </label>

              <input
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                className="w-full rounded-xl border p-3"
                placeholder="Enter address"
              />

            </div>

          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-teal-600 py-4 text-lg font-semibold text-white hover:bg-teal-700"
          >
            Create Subscription
          </button>

        </div>

      </div>

    </div>
  );
}