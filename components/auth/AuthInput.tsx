import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthInput({
  label,
  ...props
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
        {label}
      </label>

      <input
        {...props}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-gray-50
          px-4
          py-3
          text-gray-900
          outline-none
          transition-all
          duration-300
          placeholder:text-gray-400

          focus:border-teal-500
          focus:bg-white
          focus:ring-2
          focus:ring-teal-200

          dark:border-slate-700
          dark:bg-slate-800
          dark:text-white
          dark:placeholder:text-slate-400
          dark:focus:border-teal-500
          dark:focus:bg-slate-800
          dark:focus:ring-teal-500/30
        "
      />
    </div>
  );
}