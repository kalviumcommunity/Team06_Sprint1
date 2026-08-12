"use client";

import Link from "next/link";

type MobileMenuProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileMenu({ setOpen }: MobileMenuProps) {
  return (
    <div className="border-t border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 lg:hidden">
      <div className="flex flex-col space-y-1 px-5 py-4">
        {[
          { href: "/", label: "Home" },
          { href: "#features", label: "Features" },
          { href: "#how", label: "How It Works" },
          { href: "#demo", label: "Demo" },
          { href: "#faq", label: "FAQ" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-teal-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400"
          >
            {label}
          </Link>
        ))}

        <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

        <Link
          href="/login"
          onClick={() => setOpen(false)}
          className="rounded-xl border border-slate-200 px-3 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Login
        </Link>

        <Link
          href="/register"
          onClick={() => setOpen(false)}
          className="rounded-xl bg-teal-600 px-3 py-3 text-center font-semibold text-white transition hover:bg-teal-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
}