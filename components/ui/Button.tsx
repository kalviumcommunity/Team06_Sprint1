import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 active:scale-95",
    secondary:
      "border border-teal-600 text-teal-600 hover:bg-teal-50 active:scale-95",
    ghost: "text-gray-600 hover:bg-gray-100 active:scale-95",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
