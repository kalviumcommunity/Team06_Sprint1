"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  "All",
  "Tablet",
  "Capsule",
  "Injection",
  "Syrup",
  "Vitamin",
];

export default function MedicineFilters({
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-slate-300 bg-white px-5 py-3 shadow-sm outline-none focus:border-teal-500"
    >
      {categories.map((category) => (
        <option
          key={category}
          value={category}
        >
          {category}
        </option>
      ))}
    </select>
  );
}