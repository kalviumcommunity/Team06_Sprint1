import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

export default function Card({
  children,
  variant = "default",
  className = "",
  ...props
}: Props) {
  const base = "rounded-2xl bg-white dark:bg-slate-800";
  const variants = {
    default: "border border-gray-200 dark:border-slate-700 p-6",
    elevated: "shadow-lg p-6",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
