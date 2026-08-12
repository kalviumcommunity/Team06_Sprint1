import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseClass = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00b386]/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950";
  const sizeClass = size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-sm";
  const variantClass = {
    primary: "bg-[#00b386] text-white shadow-sm hover:bg-[#009e76]",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:border-[#00b386] hover:text-[#00b386] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  }[variant];

  return (
    <button type={type} className={`${baseClass} ${sizeClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
