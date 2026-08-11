"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  placeholder: string;
}

export default function PasswordInput({
  label,
  placeholder,
  ...props
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...props}
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-gray-50
            px-4
            py-3
            pr-12
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

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          aria-label={show ? "Hide password" : "Show password"}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2

            text-gray-500
            transition-all
            duration-300

            hover:text-teal-600

            dark:text-slate-400
            dark:hover:text-teal-400
          "
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}