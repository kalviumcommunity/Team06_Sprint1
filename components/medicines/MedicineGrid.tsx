"use client";

import { useState } from "react";
import MedicineCard from "./MedicineCard";
import MedicineDetailsModal from "./MedicineDetailsModal";
import { Medicine } from "@/types/medicine";

interface Props {
  medicines: Medicine[];
}

export default function MedicineGrid({
  medicines,
}: Props) {
  const [selectedMedicine, setSelectedMedicine] =
    useState<Medicine | null>(null);

  const [open, setOpen] = useState(false);

  const handleViewDetails = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setOpen(true);
  };

  const handleSubscribe = (medicine: Medicine) => {
    alert(`Subscription started for ${medicine.name}`);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        {medicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            onViewDetails={handleViewDetails}
            onSubscribe={handleSubscribe}
          />
        ))}

      </div>

      <MedicineDetailsModal
        medicine={selectedMedicine}
        open={open}
        onClose={() => setOpen(false)}
        onSubscribe={handleSubscribe}
      />
    </>
  );
}