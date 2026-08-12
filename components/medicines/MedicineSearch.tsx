"use client";

interface MedicineSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MedicineSearch({
  value,
  onChange,
}: MedicineSearchProps) {
  return (
    <input
      type="text"
      placeholder="Search medicines..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
    />
  );
}