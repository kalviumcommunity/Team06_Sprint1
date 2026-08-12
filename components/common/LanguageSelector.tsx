"use client";

export default function LanguageSelector() {
  return (
    <select
      className="bg-transparent text-sm outline-none text-slate-700 dark:text-slate-300"
      defaultValue="en"
    >
      <option value="en">EN</option>
    </select>
  );
}
